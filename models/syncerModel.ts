import { App, Modal, TFile } from "obsidian";
import { BlogUpdaterWrapper } from "utils/blogUpdaterWrapper";
import { ImageStatus } from "../utils/blogUpdaterRequester/base";

interface iImageData {
	name: string;
	file: TFile;
}

export class SyncerModel extends Modal {
	blog_updater_wrapper: BlogUpdaterWrapper;
	dynamicContentArea: HTMLDivElement;

	constructor(app: App, blog_updater_wrapper: BlogUpdaterWrapper) {
		super(app);

		this.blog_updater_wrapper = blog_updater_wrapper;

		this.createTabs();
		this.dynamicContentArea = this.contentEl.createEl("div", {
			cls: "dynamic-content",
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	async onOpen(): Promise<void> {
		await this.blog_updater_wrapper.syncRepo();

		this.injectStyles();

		await this.createImageTable();
	}

	// PRIVATE METHODS
	private injectStyles(): void {
		const style = document.createElement("style");

		style.textContent = `
			.clickable-text {
				cursor: pointer;
				color: #F6F1D1; 
				text-decoration: underline;
			}
			.clickable-text:hover {
				color: #0B2027;
			}
		`;

		document.head.appendChild(style);
	}

	private async createTabs() {
		const { contentEl } = this;

		const tabFunctions: Record<string, CallableFunction> = {
			"Image Syncer Tool": this.createImageTable,
			"Blog Post Syncer Tool": this.createBlogPostTable,
		};

		const table = contentEl.createEl("table");
		const tabRow = table.createEl("tr");

		for (const tabName in tabFunctions) {
			const tabCell = tabRow.createEl("th");
			tabCell.textContent = tabName;
			tabCell.addClass("clickable-text"); // Add this class for styling

			tabCell.addEventListener("click", async () => {
				// Assuming tabFunctions[tabName] returns a function that can be awaited
				await tabFunctions[tabName]();
			});
		}
	}

	private createBlogPostTable = async (): Promise<void> => {
		console.log("HERE WE ARE");
		this.dynamicContentArea.empty(); // Clear only the dynamic content area
	};

	private createImageTable = async (): Promise<void> => {
		this.dynamicContentArea.empty(); // Clear only the dynamic content area

		const table = this.dynamicContentArea.createEl("table");

		const cellStyle = "padding: 0 20px;";

		const headerRow = table.createEl("tr");
		["Image", "Image Name", "Publish", "Release", "Delete"].forEach(
			(headerText) => {
				const headerCell = headerRow.createEl("th");
				headerCell.textContent = headerText;
				headerCell.setAttribute("style", cellStyle); // Apply the cell style
			}
		);

		const images: iImageData[] = await this.getImagesFolderFiles();

		for (const image of images) {
			const row = table.createEl("tr");

			const imagePath = this.app.vault.getResourcePath(image.file);

			const imageCell = row.createEl("td");
			imageCell.createEl("img", {
				attr: {
					src: imagePath,
					alt: image.name,
					style: "max-width: 100px; max-height: 100px;",
				},
			});

			const nameCell = row.createEl("td");
			nameCell.textContent = image.name;

			const imageStatus: ImageStatus =
				await this.blog_updater_wrapper.getImageStatus(image.name);

			const publishCell = row.createEl("td");
			const publishButton = publishCell.createEl("button", {
				text: "Publish",
			});
			publishButton.disabled = imageStatus.published;

			const releaseCell = row.createEl("td");
			const releaseButton = releaseCell.createEl("button", {
				text: "Release",
			});
			releaseButton.disabled = imageStatus.released;

			const deleteCell = row.createEl("td");
			const deleteButton = deleteCell.createEl("button", {
				text: "Delete",
			});

			deleteButton.style.backgroundColor = "#ff4d4d"; // Red background
			deleteButton.style.color = "white";
			deleteButton.style.border = "none";
			deleteButton.style.padding = "5px 10px";
			deleteButton.style.borderRadius = "5px";
			deleteButton.style.cursor = "pointer";
			deleteButton.disabled = !imageStatus.released;

			publishButton.addEventListener("click", async () => {
				console.log("Publish clicked for", image.name);

				await this.blog_updater_wrapper.syncRepo();

				if (await this.blog_updater_wrapper.publishImage(image.name)) {
					publishButton.disabled = true;
					releaseButton.disabled = false;
					deleteButton.disabled = true;

					await this.blog_updater_wrapper.syncRepo();
				}
			});

			releaseButton.addEventListener("click", async () => {
				console.log("Release clicked for", image.name);

				await this.blog_updater_wrapper.syncRepo();

				if (
					await this.blog_updater_wrapper.updateImageRelease(
						image.name,
						true
					)
				) {
					releaseButton.disabled = true;

					await this.blog_updater_wrapper.syncRepo();
				}
			});

			deleteButton.addEventListener("click", async () => {
				console.log("Delete clicked for", image.name);

				await this.blog_updater_wrapper.syncRepo();

				if (await this.blog_updater_wrapper.deleteImage(image.name)) {
					publishButton.disabled = false;
					releaseButton.disabled = false;
					deleteButton.disabled = true;

					await this.blog_updater_wrapper.syncRepo();
				}
			});
		}
	};

	private getImagesFolderFiles = async (): Promise<iImageData[]> => {
		const allFiles: TFile[] = this.app.vault.getFiles();

		const imageFiles: TFile[] = allFiles.filter((file: TFile) =>
			file.path.startsWith("__IMAGES__/")
		);

		const structuredFileNames: iImageData[] = [];

		for (const file of imageFiles) {
			structuredFileNames.push({ name: file.name, file: file });
		}

		return structuredFileNames;
	};
}
