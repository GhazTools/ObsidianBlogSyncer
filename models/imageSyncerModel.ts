import { App, Modal, TFile } from "obsidian";
import { pushChanges } from "../utils/gitHelper";

interface iImageData {
	name: string;
	file: TFile;
}

export class ImageSyncerModel extends Modal {
	app: App;

	constructor(app: App) {
		super(app);
		this.app = app;
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	async onOpen(): Promise<void> {
		await pushChanges();

		const { contentEl } = this;
		contentEl.empty();

		const title = contentEl.createEl("h1");
		title.textContent = "Blog Image Syncer";

		const image_section = contentEl.createEl("h2");
		image_section.textContent = "Unreleased Images";

		await this.createImageTable();
	}

	// PRIVATE METHODS
	private async createImageTable(): Promise<void> {
		const table = this.contentEl.createEl("table");

		const cellStyle = "padding: 0 20px;";

		const headerRow = table.createEl("tr");
		["Image", "Image Name", "Publish", "Release"].forEach((headerText) => {
			const headerCell = headerRow.createEl("th");
			headerCell.textContent = headerText;
			headerCell.setAttribute("style", cellStyle); // Apply the cell style
		});

		const images: iImageData[] = await this.getImagesFolderFiles();

		for (const image of images) {
			const row = table.createEl("tr");

			const imagePath = app.vault.getResourcePath(image.file);

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

			const publishCell = row.createEl("td");
			const publishButton = publishCell.createEl("button", {
				text: "Publish",
			});
			publishButton.disabled = true;

			publishButton.addEventListener("click", () => {
				console.log("Publish clicked for", image.name);
			});

			const releaseCell = row.createEl("td");
			const releaseButton = releaseCell.createEl("button", {
				text: "Release",
			});
			releaseButton.disabled = true;

			releaseButton.addEventListener("click", () => {
				console.log("Release clicked for", image.name);
			});
		}
	}

	private async getImagesFolderFiles(): Promise<iImageData[]> {
		const allFiles: TFile[] = this.app.vault.getFiles();

		const imageFiles: TFile[] = allFiles.filter((file: TFile) =>
			file.path.startsWith("__IMAGES__/")
		);

		const structuredFileNames: iImageData[] = [];

		for (const file of imageFiles) {
			structuredFileNames.push({ name: file.name, file: file });
		}

		return structuredFileNames;
	}
}
