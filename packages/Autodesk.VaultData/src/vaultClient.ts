import {
	type AccessTokenProvider,
	BaseBearerTokenAuthenticationProvider,
} from "@microsoft/kiota-abstractions";
import {
	FetchRequestAdapter,
	type HttpClient,
} from "@microsoft/kiota-http-fetchlibrary";
import {
	type BaseVaultDataClient,
	createBaseVaultDataClient,
} from "./generatedCode/baseVaultDataClient.js";

/**
 * Access token provider for Autodesk Vault
 */
class VaultAccessTokenProvider implements AccessTokenProvider {
	constructor(getAccessToken: () => Promise<string>) {
		this.getAuthorizationToken = getAccessToken;
	}

	getAuthorizationToken: () => Promise<string>;

	getAllowedHostsValidator = () => {
		throw new Error("Not implemented");
	};
}

/**
 * Main entry point for Autodesk Vault SDK
 */
export class VaultClient {
	/**
	 * Vault API client
	 */
	public readonly api: BaseVaultDataClient;

	constructor(
		getAccessToken: () => Promise<string>,
		public readonly vaultServer: string,
		public readonly isHttps: boolean = true,
		httpClient?: HttpClient,
	) {
		const tokenProvider = new VaultAccessTokenProvider(getAccessToken);
		const authProvider = new BaseBearerTokenAuthenticationProvider(tokenProvider);

		const adapter = new FetchRequestAdapter(
			authProvider,
			undefined,
			undefined,
			httpClient,
		);

		adapter.baseUrl = `${this.isHttps ? "https" : "http"}://${vaultServer}/AutodeskDM/Services/api/vault/v2`;

		this.api = createBaseVaultDataClient(adapter);
	}
}
