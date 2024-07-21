import { App } from "obsidian";
import { BlogUpdaterWrapper } from "utils/blogUpdaterWrapper";

export abstract class SyncerTab {
	app: App;
	blogUpdaterWrapper: BlogUpdaterWrapper;

	constructor(app: App, blogUpdaterWrapper: BlogUpdaterWrapper) {
		this.app = app;
		this.blogUpdaterWrapper = blogUpdaterWrapper;
	}

	abstract showTab(mainElement: HTMLDivElement): void;

	protected abstract publishHandler(objectName: string): boolean;
	protected abstract releaseHandler(objectName: string): boolean;
	protected abstract deleteHandler(objectName: string): boolean;
}
