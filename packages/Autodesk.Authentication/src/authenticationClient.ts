import { AnonymousAuthenticationProvider } from '@microsoft/kiota-abstractions';
import { FetchRequestAdapter, HttpClient } from '@microsoft/kiota-http-fetchlibrary';
import { HttpClientFactory } from '@adsk-platform/httpclient/httpClientFactory.js';
import { createBaseAuthenticationClient, type BaseAuthenticationClient } from "./generatedCode/baseAuthenticationClient.js";
import { AuthenticationClientHelper } from "./authenticationClientHelper.js";

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
      httpClient
    );
    this.api = createBaseAuthenticationClient(adapter);

    this.helper = new AuthenticationClientHelper(this.api, httpClient);
  }
}
