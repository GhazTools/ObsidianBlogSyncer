import * as dotenv from "dotenv";
import { Plugin } from "obsidian";
import { BlogUpdaterWrapper } from "utils/blogUpdaterWrapper";
import { SyncerModel } from "./models/syncerModel";

export default class MyPlugin extends Plugin {
	blog_updater_wrapper: BlogUpdaterWrapper;

	async onload() {
		const basePath = (app.vault.adapter as any).basePath;
		dotenv.config({
			path: `${basePath}/.obsidian/plugins/obsidian-blog-syncer/.env`,
			debug: false,
		});

		this.blog_updater_wrapper = new BlogUpdaterWrapper();

		const imageIconElement = this.addRibbonIcon(
			"dice",
			"Blog Image Syncer",
			(evt: MouseEvent) => {
				const modal = new SyncerModel(
					this.app,
					this.blog_updater_wrapper
				);
				modal.open();
			}
		);
		imageIconElement.addClass("my-plugin-ribbon-class");
	}

	onunload() {}
}
