import { App } from "obsidian";
import { SyncerTab } from "./syncerTab";

export class ImageSyncerTab extends SyncerTab {
	constructor(app: App, element: HTMLDivElement) {
		super(app, element);
	}

	showTab(): void {}

	publishHandler(objectName: string): boolean {
		return true;
	}

	releaseHandler(objectName: string): boolean {
		return true;
	}

	deleteHandler(objectName: string): boolean {
		return true;
	}
}
