import { TokenGranterWrapper } from "utils/tokenGranterWrapper";
import { BlogUpdaterRequester, ImageStatus } from "./base";

export class BlogPostRequester extends BlogUpdaterRequester {
	constructor(
		token_granter_wrapper: TokenGranterWrapper,
		blog_updater_url: string
	) {
		super(token_granter_wrapper, blog_updater_url);
	}

	async publish(blogPostName: string): Promise<boolean> {
		return false;
	}

	async delete(blogPostName: string): Promise<boolean> {
		return false;
	}

	async updateRelease(
		blogPostName: string,
		release: boolean
	): Promise<boolean> {
		return false;
	}

	async getStatus(blogPostName: string): Promise<ImageStatus> {
		return {
			released: false,
			published: false,
		};
	}
}
