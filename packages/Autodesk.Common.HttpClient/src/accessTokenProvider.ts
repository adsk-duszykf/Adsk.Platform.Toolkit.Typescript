import type {
	AllowedHostsValidator,
	AccessTokenProvider as IAccessTokenProvider,
} from "@microsoft/kiota-abstractions";
export class AccessTokenProvider implements IAccessTokenProvider {
	constructor(private getAccessToken: () => Promise<string>) {}
	async getAuthorizationToken(
		_url?: string,
		_additionalAuthenticationContext?: Record<string, unknown>,
	): Promise<string> {
		return await this.getAccessToken();
	}
	getAllowedHostsValidator(): AllowedHostsValidator {
		throw new Error("Method not implemented.");
	}
}
