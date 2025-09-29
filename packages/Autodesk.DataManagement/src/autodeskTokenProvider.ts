import { AccessTokenProvider } from "@microsoft/kiota-abstractions";

export class AutodeskTokenProvider implements AccessTokenProvider {
  constructor(private getAccessToken: () => Promise<string>) {}
  getAuthorizationToken = this.getAccessToken;
  getAllowedHostsValidator = () => {
    throw new Error("Not implemented");
  };
}
