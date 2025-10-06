import { HttpClientFactory } from "@adsk-platform/httpclient/httpClientFactory.js";
import type { HttpClient } from "@microsoft/kiota-http-fetchlibrary";
import {
	type BaseSecureServiceAccountClient,
	createBaseSecureServiceAccountClient,
} from "./generatedCode/baseSecureServiceAccountClient.js";
import { SecureServiceAccountClientHelper } from "./secureServiceAccountClientHelper.js";

/**
 * Main entry point for Autodesk Secure Service Account SDK
 */
export class SecureServiceAccountClient {
	public readonly api: BaseSecureServiceAccountClient;
	public readonly helper: SecureServiceAccountClientHelper;

	/**
	 * Create a new client for using Secure Service Account API
	 * @param getAccessToken Function that returns the access token passed in Authorization header
	 * @param httpClient Optional HttpClient instance overriding the default resilient HttpClient
	 */
	constructor(
		getAccessToken: () => Promise<string>,

		httpClient?: HttpClient,
	) {
		const adapter = HttpClientFactory.createFetchRequestAdapter(
			getAccessToken,
			httpClient,
		);

		this.api = createBaseSecureServiceAccountClient(adapter);

		this.helper = new SecureServiceAccountClientHelper(this.api, httpClient);
	}
}
