import { Plugin } from "obsidian";
import { ImageSyncerModel } from "./models/imageSyncerModel";
import * as dotenv from "dotenv";

const basePath = (app.vault.adapter as any).basePath;
dotenv.config({
	path: `${basePath}/.obsidian/plugins/obsidian-blog-syncer/.env`,
	debug: false,
});

export default class MyPlugin extends Plugin {
	async onload() {
		const imageIconElement = this.addRibbonIcon(
			"dice",
			"Blog Image Syncer",
			(evt: MouseEvent) => {
				const modal = new ImageSyncerModel(this.app);
				modal.open();
			}
		);
		imageIconElement.addClass("my-plugin-ribbon-class");
	}

	onunload() {}
}
