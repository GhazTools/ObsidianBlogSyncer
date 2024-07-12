import axios from "axios";

export interface BaseRequest {
	user: string;
	token: string;
}

export class TokenGranterWrapper {
	token_granter_url: string;
	request_data: Record<string, string | boolean>;

	constructor() {
		this.token_granter_url = process.env.TOKEN_GRANTER_URL as string;
		this.request_data = {
			username: process.env.BLOG_SYNCER_USERNAME as string,
			password: process.env.BLOG_SYNCER_PASSWORD as string,
			temporary: true,
		} as const;
	}

	async getBaseRequest(): Promise<BaseRequest> {
		return {
			user: this.request_data.username as string,
			token: await this.getAccessToken(),
		};
	}

	private async getAccessToken(): Promise<string> {
		const grantUrl = `${this.token_granter_url}/token/grant`;

		try {
			const response = await axios.post(grantUrl, this.request_data, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			return response.data["token"];
		} catch (error) {
			console.log(
				"BlogSyncer - Failed to get access token:",
				error.message
			);
		}

		return "";
	}
}
