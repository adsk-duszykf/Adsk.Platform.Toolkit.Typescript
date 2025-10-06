import { HttpClientFactory } from "@adsk-platform/httpclient/httpClientFactory.js";
import { AnonymousAuthenticationProvider } from "@microsoft/kiota-abstractions";
import {
	FetchRequestAdapter,
	type HttpClient,
} from "@microsoft/kiota-http-fetchlibrary";
import { AuthenticationClientHelper } from "./authenticationClientHelper.js";
import {
	type BaseAuthenticationClient,
	createBaseAuthenticationClient,
} from "./generatedCode/baseAuthenticationClient.js";

/**
 * Main entry point for Autodesk Authentication SDK
 */
export class AuthenticationClient {
	public readonly api: BaseAuthenticationClient;
	public readonly helper: AuthenticationClientHelper;

	constructor(httpClient?: HttpClient) {
		httpClient = httpClient ?? HttpClientFactory.create();

		const adapter = new FetchRequestAdapter(
			new AnonymousAuthenticationProvider(),
			undefined,
			undefined,
			httpClient,
		);
		this.api = createBaseAuthenticationClient(adapter);

		this.helper = new AuthenticationClientHelper(this.api, httpClient);
	}
}
