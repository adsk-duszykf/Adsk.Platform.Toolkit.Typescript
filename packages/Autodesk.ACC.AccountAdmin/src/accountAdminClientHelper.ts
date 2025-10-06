import type { HttpClient } from "@microsoft/kiota-http-fetchlibrary";
import type { ApiRequestBuilder } from "./accountAdminClient.js";
export class AccountAdminClientHelper {
	constructor(
		private readonly api: ApiRequestBuilder,
		private readonly httpClient?: HttpClient,
	) {}
}
