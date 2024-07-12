import { Plugin } from "obsidian";
import { ImageSyncerModel } from "./models/imageSyncerModel";
import * as dotenv from "dotenv";
import { TokenGranterWrapper } from "utils/tokenGranterWrapper";

const basePath = (app.vault.adapter as any).basePath;
dotenv.config({
	path: `${basePath}/.obsidian/plugins/obsidian-blog-syncer/.env`,
	debug: false,
});

export default class MyPlugin extends Plugin {
	token_granter_wrapper: TokenGranterWrapper;

	async onload() {
		this.token_granter_wrapper = new TokenGranterWrapper();

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
