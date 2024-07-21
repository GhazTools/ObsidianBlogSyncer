import { App } from "obsidian";

export abstract class SyncerTab {
	app: App;
	mainElement: HTMLDivElement;

	constructor(app: App, element: HTMLDivElement) {
		this.app = app;
		this.mainElement = element;
	}

	abstract showTab(): void;
	abstract publishHandler(objectName: string): boolean;
	abstract releaseHandler(objectName: string): boolean;
	abstract deleteHandler(objectName: string): boolean;
}
