import { Plugin } from "obsidian";
import { ImageSyncerModel } from "./models/imageSyncerModel";

export default class MyPlugin extends Plugin {
	async onload() {
		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"dice",
			"Blog Image Syncer",
			(evt: MouseEvent) => {
				const modal = new ImageSyncerModel(this.app);
				modal.open();
			}
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");
	}

	onunload() {}
}
