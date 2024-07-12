import axios from "axios";
import { TokenGranterWrapper } from "./tokenGranterWrapper";

export class BlogUpdaterWrapper {
	token_granter_wrapper: TokenGranterWrapper;
	blog_updater_url: string;

	constructor() {
		this.token_granter_wrapper = new TokenGranterWrapper();
		this.blog_updater_url = process.env.BLOG_UPDATER_URL as string;
	}

	syncRepo(): void {
		const syncUrl = `${this.blog_updater_url}/vault/sync`;

		try {
			axios.post(syncUrl, this.token_granter_wrapper.getBaseRequest(), {
				headers: {
					"Content-Type": "application/json",
				},
			});
		} catch (error) {
			console.log("Failed to sync repo");
		}
	}

	publishImage(imageName: string): boolean {
		return false;
	}

	updateImageRelease(imageName: string, release: boolean): boolean {
		return false;
	}

	checkIfImageExists(imageName: string): boolean {
		return false;
	}
}
