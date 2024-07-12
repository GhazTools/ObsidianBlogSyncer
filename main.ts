import { Plugin } from "obsidian";
import { ImageSyncerModel } from "./models/imageSyncerModel";
import * as dotenv from "dotenv";

export default class MyPlugin extends Plugin {
	async onload() {
		dotenv.config();

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
