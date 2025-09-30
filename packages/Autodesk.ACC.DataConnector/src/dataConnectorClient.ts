import { BaseDataConnectorClient, createBaseDataConnectorClient } from './generatedCode/baseDataConnectorClient.js';
import { HttpClient } from '@microsoft/kiota-http-fetchlibrary';
import { HttpClientFactory } from '@adsk-platform/httpclient/httpClientFactory.js';
import { DataConnectorClientHelper } from './dataConnectorClientHelper.js';

/**
 * Main entry point for Autodesk Data Connector SDK
 */
export class DataConnectorClient {
  public readonly api: BaseDataConnectorClient;
  public readonly helper: DataConnectorClientHelper;

  /**
   * Create a new client for using Data Connector API
   * @param getAccessToken Function that returns the access token passed in Authorization header
   * @param httpClient Optional HttpClient instance overriding the default resilient HttpClient
   */
  constructor(getAccessToken: () => Promise<string>,

    httpClient?: HttpClient) {
    const adapter = HttpClientFactory.createFetchRequestAdapter(getAccessToken, httpClient)
    this.api = createBaseDataConnectorClient(adapter);

    this.helper = new DataConnectorClientHelper(this.api, httpClient);
  }
}
