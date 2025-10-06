import {
	AnonymousAuthenticationProvider,
	BaseBearerTokenAuthenticationProvider,
} from "@microsoft/kiota-abstractions";
import {
	FetchRequestAdapter,
	type HttpClient,
} from "@microsoft/kiota-http-fetchlibrary";
import { AutodeskTokenProvider } from "./autodeskTokenProvider";
import { DataManagementClientHelper } from "./dataManagementClientHelper";
import { BaseAutodeskDataManagement } from "./generatedCode/dataMgt/baseAutodeskDataManagement.js";
import { BaseAutodeskOSSClient } from "./generatedCode/OSS/baseAutodeskOSSClient.js";

export class DataManagementClient {
	readonly dataMgtApi: BaseAutodeskDataManagement;
	readonly ossApi: BaseAutodeskOSSClient;
	readonly helper: DataManagementClientHelper;

	constructor(getAccessToken: () => Promise<string>, httpClient?: HttpClient) {
		const authProvider = new AnonymousAuthenticationProvider();
		// Create request adapter using the fetch-based implementation
		const adapter = this.createAdapter(getAccessToken, httpClient);

		this.dataMgtApi = new BaseAutodeskDataManagement(adapter);
		this.ossApi = new BaseAutodeskOSSClient(adapter);
		this.helper = new DataManagementClientHelper(this.dataMgtApi, this.ossApi);
	}

	private createAdapter(
		getAccessToken: () => Promise<string>,
		httpClient?: HttpClient,
	): FetchRequestAdapter {
		const authProvider = new AutodeskTokenProvider(getAccessToken);
		var bearerAuth = new BaseBearerTokenAuthenticationProvider(authProvider);

		var adapter = httpClient
			? new FetchRequestAdapter(bearerAuth, undefined, undefined, httpClient)
			: new FetchRequestAdapter(bearerAuth);

		return adapter;
	}
}
