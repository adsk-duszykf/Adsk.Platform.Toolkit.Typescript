import { HttpClient, MiddlewareFactory, FetchRequestAdapter } from '@microsoft/kiota-http-fetchlibrary';
import { BaseBearerTokenAuthenticationProvider } from '@microsoft/kiota-abstractions';
import { ErrorHandler } from './middleware/errorHandler.js';
import { AccessTokenProvider } from './accessTokenProvider.js';
export class HttpClientFactory {
    static create(customFetch?: (request: string, init: RequestInit) => Promise<Response>): HttpClient {

        const middlewares = [new ErrorHandler(), ...MiddlewareFactory.getDefaultMiddlewares(customFetch)];

        return new HttpClient(customFetch, ...middlewares);
    }

    static createFetchRequestAdapter(getAccessToken: () => Promise<string>, httpClient: HttpClient): FetchRequestAdapter {
        const auth = new BaseBearerTokenAuthenticationProvider(new AccessTokenProvider(getAccessToken));
        
        return new FetchRequestAdapter(
            auth,
            undefined,
            undefined,
            httpClient);
    }
    private test() {
        console.log('test');
    }
}