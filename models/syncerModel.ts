import { App, Modal } from "obsidian";
import { BlogUpdaterWrapper } from "utils/blogUpdaterWrapper";
import { ImageSyncerTab } from "./syncerTab/imageSyncerTab";
import { PostSyncerTab } from "./syncerTab/postSyncerTab";

export class SyncerModel extends Modal {
	blog_updater_wrapper: BlogUpdaterWrapper;
	dynamicContentArea: HTMLDivElement;

	imageTab: ImageSyncerTab;
	postTab: PostSyncerTab;

	constructor(app: App, blog_updater_wrapper: BlogUpdaterWrapper) {
		super(app);

		this.blog_updater_wrapper = blog_updater_wrapper;
		this.imageTab = new ImageSyncerTab(app, blog_updater_wrapper);
		this.postTab = new PostSyncerTab(app, blog_updater_wrapper);

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

		await this.imageTab.showTab(this.dynamicContentArea);
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

	private async createTabs(): Promise<void> {
		const { contentEl } = this;

		const tabFunctions: Record<string, CallableFunction> = {
			"Image Syncer": this.imageTab.showTab.bind(this.imageTab),
			"Blog Post Syncer": this.postTab.showTab.bind(this.postTab),
		};

		const table = contentEl.createEl("table");
		const tabRow = table.createEl("tr");

		for (const tabName in tabFunctions) {
			const tabCell = tabRow.createEl("th");
			tabCell.textContent = tabName;
			tabCell.addClass("clickable-text"); // Add this class for styling

			tabCell.addEventListener("click", async () => {
				await tabFunctions[tabName](this.dynamicContentArea);
			});
		}
	}
}
