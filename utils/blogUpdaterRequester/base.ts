import { TokenGranterWrapper } from "utils/tokenGranterWrapper";

export interface ImageStatus {
	released: boolean;
	published: boolean;
}

export abstract class BlogUpdaterRequester {
	token_granter_wrapper: TokenGranterWrapper;
	blog_updater_url: string;

	constructor(
		tokenGranterWrapper: TokenGranterWrapper,
		blog_updater_url: string,
	) {
		this.token_granter_wrapper = tokenGranterWrapper;
		this.blog_updater_url = blog_updater_url;
	}

	abstract publish(entityName: string): Promise<boolean>;
	abstract delete(entityName: string): Promise<boolean>;
	abstract updateRelease(
		entityName: string,
		release: boolean,
	): Promise<boolean>;
	abstract getStatus(entityName: string): Promise<ImageStatus>;
}
