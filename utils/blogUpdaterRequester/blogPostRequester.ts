import axios from "axios";
import { BaseRequest, TokenGranterWrapper } from "utils/tokenGranterWrapper";
import { BlogUpdaterRequester, ImageStatus } from "./base";

interface PublishBlogPostRequest extends BaseRequest {
	post_name: string;
}
interface DeleteBlogPostRequest extends BaseRequest {
	post_name: string;
}

export class BlogPostRequester extends BlogUpdaterRequester {
	constructor(
		token_granter_wrapper: TokenGranterWrapper,
		blog_updater_url: string
	) {
		super(token_granter_wrapper, blog_updater_url);
	}

	async publish(blogPostName: string): Promise<boolean> {
		const publishUrl = `${this.blog_updater_url}/blogPosts/publish`;

		const request: PublishBlogPostRequest = {
			...(await this.token_granter_wrapper.getBaseRequest()),
			post_name: blogPostName,
		};

		try {
			const response = await axios.post(publishUrl, request, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.status === 200) {
				console.log("Published post", blogPostName);
				return true;
			} else {
				console.log(
					"Failed to publish post, error:",
					response.statusText
				);
				return false;
			}
		} catch (error) {
			console.log("Failed to publish post:", error);
		}
		return false;
	}

	async delete(blogPostName: string): Promise<boolean> {
		const deleteUrl = `${this.blog_updater_url}/blogPosts/delete`;

		const request: DeleteBlogPostRequest = {
			...(await this.token_granter_wrapper.getBaseRequest()),
			post_name: blogPostName,
		};

		try {
			const response = await axios.post(deleteUrl, request, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.status === 200) {
				console.log("Deleted post", blogPostName);
				return true;
			} else {
				console.log(
					"Failed to delete post, error:",
					response.statusText
				);
				return false;
			}
		} catch (error) {
			console.log("Failed to delete post:", error);
		}

		return false;
	}

	async updateRelease(
		blogPostName: string,
		release: boolean
	): Promise<boolean> {
		const updateReleaseUrl = `${this.blog_updater_url}/blogPosts/updatePostRelease`;

		return false;
	}

	async getStatus(blogPostName: string): Promise<ImageStatus> {
		const statusUrl = `${this.blog_updater_url}/blogPosts/blogPostStatus`;

		return {
			released: false,
			published: false,
		};
	}
}
