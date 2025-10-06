import { HttpClientFactory } from "@adsk-platform/httpclient/httpClientFactory.js";
import type { HttpClient } from "@microsoft/kiota-http-fetchlibrary";
import { AccountAdminClientHelper } from "./accountAdminClientHelper.js";
import { createBaseAccountAdminClient as createACCbaseClient } from "./generatedCode/acc/baseAccountAdminClient.js";
import type { ConstructionRequestBuilder } from "./generatedCode/acc/construction/index.js";
import { createBaseAccountAdminClient as createBIMbaseClient } from "./generatedCode/bim/baseAccountAdminClient.js";
import type { HqRequestBuilder } from "./generatedCode/bim/hq/index.js";

/**
 * Main entry point for Autodesk Account Admin SDK
 */
export class AccountAdminClient {
	public readonly api: ApiRequestBuilder;
	public readonly helper: AccountAdminClientHelper;

	/**
	 * Create a new client for using Account Admin API
	 * @param getAccessToken Function that returns the access token passed in Authorization header
	 * @param httpClient Optional HttpClient instance overriding the default resilient HttpClient
	 */
	constructor(getAccessToken: () => Promise<string>, httpClient?: HttpClient) {
		const adapter = HttpClientFactory.createFetchRequestAdapter(
			getAccessToken,
			httpClient,
		);
		this.api = {
			construction: createACCbaseClient(adapter).construction,
			hq: createBIMbaseClient(adapter).hq,
		};

		this.helper = new AccountAdminClientHelper(this.api, httpClient);
	}
}

export interface ApiRequestBuilder {
	construction: ConstructionRequestBuilder;
	hq: HqRequestBuilder;
}
