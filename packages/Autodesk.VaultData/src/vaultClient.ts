import { HttpClientFactory } from "@adsk-platform/httpclient/httpClientFactory.js";
import type { HttpClient } from "@microsoft/kiota-http-fetchlibrary";
import {
	type BaseVaultDataClient,
	createBaseVaultDataClient,
} from "./generatedCode/baseVaultDataClient.js";
import {
	AccountsManager,
	AuthManager,
	ChangeOrdersManager,
	FilesAndFoldersManager,
	InformationalManager,
	ItemsManager,
	JobsManager,
	LinksManager,
	OptionsManager,
	PropertyManager,
	SearchManager,
} from "./managers/index.js";

/**
 * Main entry point for Autodesk Vault SDK
 */
export class VaultClient {
	/**
	 * Vault API client
	 */
	public readonly api: BaseVaultDataClient;

	/**
	 * Manager for informational operations (server info, vaults)
	 */
	public readonly informational: InformationalManager;

	/**
	 * Manager for authentication operations (sessions)
	 */
	public readonly auth: AuthManager;

	/**
	 * Manager for accounts operations (users, groups, roles, profile attributes)
	 */
	public readonly accounts: AccountsManager;

	/**
	 * Manager for options operations (system and vault options)
	 */
	public readonly options: OptionsManager;

	/**
	 * Manager for property operations (property definitions)
	 */
	public readonly property: PropertyManager;

	/**
	 * Manager for files and folders operations
	 */
	public readonly filesAndFolders: FilesAndFoldersManager;

	/**
	 * Manager for items operations
	 */
	public readonly items: ItemsManager;

	/**
	 * Manager for change orders operations
	 */
	public readonly changeOrders: ChangeOrdersManager;

	/**
	 * Manager for links operations
	 */
	public readonly links: LinksManager;

	/**
	 * Manager for search operations
	 */
	public readonly search: SearchManager;

	/**
	 * Manager for jobs operations
	 */
	public readonly jobs: JobsManager;

	/**
	 * Returns the vault server client
	 * @param getAccessToken Function that returns the access token passed in Authorization header
	 * @param vaultServerBaseUrl Base URL of Vault server. Example: "https://my-vault-server.com", "http;//10.26.145.125", for Vault Gateway "https://12345678.vg.autodesk.com"
	 * @param httpClient Optional HttpClient instance overriding the default resilient HttpClient
	 */
	constructor(
		getAccessToken: () => Promise<string>,
		public readonly vaultServerBaseUrl: string,

		httpClient?: HttpClient,
	) {
		httpClient = httpClient ?? HttpClientFactory.create();

		const adapter = HttpClientFactory.createFetchRequestAdapter(
			getAccessToken,
			httpClient,
		);
		adapter.baseUrl = `${vaultServerBaseUrl}/AutodeskDM/Services/api/vault/v2`;

		this.api = createBaseVaultDataClient(adapter);

		// Initialize managers
		this.informational = new InformationalManager(this.api);
		this.auth = new AuthManager(this.api);
		this.accounts = new AccountsManager(this.api);
		this.options = new OptionsManager(this.api);
		this.property = new PropertyManager(this.api);
		this.filesAndFolders = new FilesAndFoldersManager(this.api);
		this.items = new ItemsManager(this.api);
		this.changeOrders = new ChangeOrdersManager(this.api);
		this.links = new LinksManager(this.api);
		this.search = new SearchManager(this.api);
		this.jobs = new JobsManager(this.api);
	}
}
