import axios from "axios";
import { ImageStatus } from "./blogUpdaterRequester/base";
import { ImageRequester } from "./blogUpdaterRequester/imageRequester";
import { pushChanges } from "./gitHelper";
import { BaseRequest, TokenGranterWrapper } from "./tokenGranterWrapper";

export class BlogUpdaterWrapper {
	token_granter_wrapper: TokenGranterWrapper;
	blog_updater_url: string;
	image_requester: ImageRequester;

	constructor() {
		this.token_granter_wrapper = new TokenGranterWrapper();
		this.blog_updater_url = process.env.BLOG_UPDATER_URL as string;
		this.image_requester = new ImageRequester(
			this.token_granter_wrapper,
			this.blog_updater_url,
		);
	}

	async syncRepo(): Promise<void> {
		await pushChanges();

		const syncUrl = `${this.blog_updater_url}/vault/sync`;

		const request: BaseRequest =
			await this.token_granter_wrapper.getBaseRequest();

		try {
			axios.post(syncUrl, request, {
				headers: {
					"Content-Type": "application/json",
				},
			});
		} catch (error) {
			console.log("Failed to sync repo");
		}
	}

	// IMAGE METHODS START HERE
	async publishImage(imageName: string): Promise<boolean> {
		return await this.image_requester.publish(imageName);
	}
	async deleteImage(imageName: string): Promise<boolean> {
		return await this.image_requester.delete(imageName);
	}

	async updateImageRelease(
		imageName: string,
		release: boolean,
	): Promise<boolean> {
		return await this.image_requester.updateRelease(imageName, release);
	}

	async getImageStatus(imageName: string): Promise<ImageStatus> {
		return await this.image_requester.getStatus(imageName);
	}
	// IMAGE METHODS END HERE
}
