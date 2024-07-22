import { App } from "obsidian";
import { SyncerTab } from "./syncerTab";
import { BlogUpdaterWrapper } from "utils/blogUpdaterWrapper";

export class PostSyncerTab extends SyncerTab {
	constructor(app: App, blogUpdaterWrapper: BlogUpdaterWrapper) {
		super(app, blogUpdaterWrapper);
	}

	async showTab(mainElement: HTMLDivElement): Promise<void> {
		mainElement.empty();

		const table = mainElement.createEl("table");

		const cellStyle = "padding: 0 20px;";

		const headerRow = table.createEl("tr");
		["Blog Post Title", "Publish", "Release", "Delete"].forEach(
			(headerText) => {
				const headerCell = headerRow.createEl("th");
				headerCell.textContent = headerText;
				headerCell.setAttribute("style", cellStyle); // Apply the cell style
			},
		);
	}

	protected publishHandler(objectName: string): boolean {
		return true;
	}

	protected releaseHandler(objectName: string): boolean {
		return true;
	}

	protected deleteHandler(objectName: string): boolean {
		return true;
	}
}
