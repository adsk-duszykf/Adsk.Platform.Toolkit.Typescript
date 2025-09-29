import { AccessTokenProvider as IAccessTokenProvider, AllowedHostsValidator, RequestInformation } from '@microsoft/kiota-abstractions';
export class AccessTokenProvider implements IAccessTokenProvider {
    constructor(private getAccessToken: () => Promise<string>) { }
    async getAuthorizationToken(url?: string, additionalAuthenticationContext?: Record<string, unknown>): Promise<string> {
        return await this.getAccessToken();
    }
    getAllowedHostsValidator(): AllowedHostsValidator {
        throw new Error('Method not implemented.');
    }

}