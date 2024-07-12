import axios from "axios";
import { BaseRequest, TokenGranterWrapper } from "./tokenGranterWrapper";
import { pushChanges } from "./gitHelper";

interface PublishImageRequest extends BaseRequest {
	image_name: string;
}

interface UpdateImageReleaseRequest extends BaseRequest {
	image_name: string;
	release: boolean;
}

interface ImageStatusRequest extends BaseRequest {
	image_name: string;
}

export interface ImageStatusResponse {
	released: boolean;
	published: boolean;
}

interface DeleteImageRequest extends BaseRequest {
	image_name: string;
}

export class BlogUpdaterWrapper {
	token_granter_wrapper: TokenGranterWrapper;
	blog_updater_url: string;

	constructor() {
		this.token_granter_wrapper = new TokenGranterWrapper();
		this.blog_updater_url = process.env.BLOG_UPDATER_URL as string;
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

	async publishImage(imageName: string): Promise<boolean> {
		const publishUrl = `${this.blog_updater_url}/images/publish`;

		const request: PublishImageRequest = {
			...(await this.token_granter_wrapper.getBaseRequest()),
			image_name: imageName,
		};

		try {
			const response = await axios.post(publishUrl, request, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.status === 200) {
				return true;
			} else {
				console.log(
					"Failed to publish image, error:",
					response.statusText
				);
				return false;
			}
		} catch (error) {
			console.log("Failed to publish image:", error);
		}

		return false;
	}

	async updateImageRelease(
		imageName: string,
		release: boolean
	): Promise<boolean> {
		const publishUrl = `${this.blog_updater_url}/images/updateImageRelease`;

		const request: UpdateImageReleaseRequest = {
			...(await this.token_granter_wrapper.getBaseRequest()),
			image_name: imageName,
			release,
		};

		console.log("Image request here", request);

		try {
			const response = await axios.post(publishUrl, request, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.status === 200) {
				console.log("Released image:", imageName);
				return true;
			} else {
				console.log(
					"Failed to update image release, error:",
					response.statusText
				);
				return false;
			}
		} catch (error) {
			console.log("Failed to update image release:", error);
		}

		return false;
	}

	async getImageStatus(imageName: string): Promise<ImageStatusResponse> {
		const iamgeStatusUrl = `${this.blog_updater_url}/images/imageStatus`;

		const request: ImageStatusRequest = {
			...(await this.token_granter_wrapper.getBaseRequest()),
			image_name: imageName,
		};

		try {
			const response = await axios.post(iamgeStatusUrl, request, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.status >= 400) {
				return {
					released: false,
					published: false,
				};
			} else {
				const formattedResponse: ImageStatusResponse = JSON.parse(
					response.data
				);
				return formattedResponse;
			}
		} catch (error) {
			console.log("Failed to get image status:", error);
		}

		return {
			released: false,
			published: false,
		};
	}

	async deleteImage(imageName: string): Promise<boolean> {
		const deleteUrl = `${this.blog_updater_url}/images/delete`;

		const request: DeleteImageRequest = {
			...(await this.token_granter_wrapper.getBaseRequest()),
			image_name: imageName,
		};

		try {
			const response = await axios.post(deleteUrl, request, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.status === 200) {
				console.log("Deleted image", imageName);
				return true;
			} else {
				console.log(
					"Failed to delete image, error:",
					response.statusText
				);
				return false;
			}
		} catch (error) {
			console.log("Failed to delete image:", error);
		}

		return false;
	}
}
