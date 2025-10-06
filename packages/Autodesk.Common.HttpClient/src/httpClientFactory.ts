import { BaseBearerTokenAuthenticationProvider } from "@microsoft/kiota-abstractions";
import {
	FetchRequestAdapter,
	HttpClient,
	MiddlewareFactory,
} from "@microsoft/kiota-http-fetchlibrary";
import { AccessTokenProvider } from "./accessTokenProvider.js";
import { ErrorHandler } from "./middleware/errorHandler.js";
export class HttpClientFactory {
	static create(
		customFetch?: (request: string, init: RequestInit) => Promise<Response>,
	): HttpClient {
		const middlewares = [
			new ErrorHandler(),
			...MiddlewareFactory.getDefaultMiddlewares(customFetch),
		];

		return new HttpClient(customFetch, ...middlewares);
	}

	static createFetchRequestAdapter(
		getAccessToken: () => Promise<string>,
		httpClient?: HttpClient,
	): FetchRequestAdapter {
		const auth = new BaseBearerTokenAuthenticationProvider(
			new AccessTokenProvider(getAccessToken),
		);

		httpClient = httpClient ?? HttpClientFactory.create();

		return new FetchRequestAdapter(auth, undefined, undefined, httpClient);
	}
}
