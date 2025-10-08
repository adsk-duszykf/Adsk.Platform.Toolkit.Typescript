import { HttpClientFactory } from "@adsk-platform/httpclient/httpClientFactory.js";
import type { HttpClient } from "@microsoft/kiota-http-fetchlibrary";
import { createBaseAccountAdminClient as createACCbaseClient } from "./generatedCode/acc/baseAccountAdminClient.js";
import type { ConstructionRequestBuilder } from "./generatedCode/acc/construction/index.js";
import { createBaseAccountAdminClient as createBIMbaseClient } from "./generatedCode/bim/baseAccountAdminClient.js";
import type { HqRequestBuilder } from "./generatedCode/bim/hq/index.js";
import  {ProjectsManager}  from "./managers/projectsManager.js";
import  {ProjectUsersManager}  from "./managers/projectUsersManager.js";
import  {CompaniesManager}  from "./managers/companiesManager.js";
import  {AccountUsersManager}  from "./managers/accountUsersManager.js";
import  {BusinessUnitsManager}  from "./managers/businessUnitsManager.js";

/**
 * Main entry point for Autodesk Account Admin SDK
 */
export class AccountAdminClient {

	/**
	 * All ACC API request builders
	 */
	public readonly api: ApiRequestBuilder;
	/**
	 * Only ACC Projects API request builder
	 */
	public readonly projects: ProjectsManager;
	public readonly projectUsers: ProjectUsersManager;
	/**
	 * Only BIM360 Companies API request builder
	 */
	public readonly companies: CompaniesManager;
	/**
	 * Only ACC Account Users API request builder
	 */
	public readonly accountUsers: AccountUsersManager;
	/**
	 * Only ACC Business Units API request builder
	 */
	public readonly businessUnits: BusinessUnitsManager;

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

		// ACC Managers
		this.projects = new ProjectsManager(this.api);
		this.projectUsers = new ProjectUsersManager(this.api);
		// BIM360 Managers
		this.companies = new CompaniesManager(this.api);
		this.accountUsers = new AccountUsersManager(this.api);
		this.businessUnits = new BusinessUnitsManager(this.api);
	}
}

export interface ApiRequestBuilder {
	construction: ConstructionRequestBuilder;
	hq: HqRequestBuilder;
}
