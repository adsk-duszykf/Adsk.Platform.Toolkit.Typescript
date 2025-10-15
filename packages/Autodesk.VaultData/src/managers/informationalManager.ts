import type { BaseVaultDataClient } from "../generatedCode/baseVaultDataClient.js";
import { iterateAllPages } from "../utils.js";

/**
 * Manager for Informational operations
 * Handles server information and vault listing
 */
export default class InformationalManager {
	constructor(private readonly api: BaseVaultDataClient) {}

	/**
	 * Get server information including product version
	 * @returns Server information
	 */
	async getServerInfo() {
		const result = await this.api.serverInfo.get();
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Get the OpenAPI specification
	 * @returns OpenAPI specification in YAML format
	 */
	async getApiSpec() {
		const result = await this.api.openapiSpecYml.get();
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Get all knowledge vaults on the server
	 * @param options Query parameters for filtering
	 * @returns Iterator of vaults
	 */
	async *getVaults(options?: { limit?: number }) {
		const getVaultsPage = async (cursor: string) => {
			const response = await this.api.vaults.get({
				queryParameters: { ...options, cursorState: cursor },
			});

			if (!response?.pagination || !response?.results) {
				throw new Error("Unexpected null response");
			}

			return {
				pagination: response.pagination,
				results: response.results,
			};
		};

		yield* iterateAllPages(getVaultsPage);
	}

	/**
	 * Get a specific knowledge vault by ID
	 * @param vaultId The unique identifier of a vault
	 * @returns Vault information
	 */
	async getVaultById(vaultId: string) {
		const result = await this.api.vaults.byId(vaultId).get();
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}
}
