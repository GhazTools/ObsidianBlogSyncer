import axios from "axios";
import { BaseRequest, TokenGranterWrapper } from "utils/tokenGranterWrapper";
import { BlogUpdaterRequester, ImageStatus } from "./base";

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

interface DeleteImageRequest extends BaseRequest {
	image_name: string;
}

export class ImageRequester extends BlogUpdaterRequester {
	constructor(
		token_granter_wrapper: TokenGranterWrapper,
		blog_updater_url: string
	) {
		super(token_granter_wrapper, blog_updater_url);
	}

	async publish(imageName: string): Promise<boolean> {
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

	async delete(imageName: string): Promise<boolean> {
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

	async updateRelease(imageName: string, release: boolean): Promise<boolean> {
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

	async getStatus(imageName: string): Promise<ImageStatus> {
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
				const formattedResponse: ImageStatus = JSON.parse(
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
}
