import type { BaseVaultDataClient } from "../generatedCode/baseVaultDataClient.js";
import type { VaultOptionsRequestBuilderGetQueryParameters } from "../generatedCode/vaults/item/vaultOptions/index.js";
import { iterateAllPages } from "../utils.js";

/**
 * Manager for Options operations
 * Handles system-wide and vault-specific options
 */
export default class OptionsManager {
	constructor(private readonly api: BaseVaultDataClient) {}

	// System Options operations
	/**
	 * Get system options
	 * @param options Query parameters including filter
	 * @returns Iterator of system options
	 */
	async *getSystemOptions(options?: {
		"filter[name]"?: string;
		limit?: number;
	}) {
		const getSystemOptionsPage = async (cursor: string) => {
			const response = await this.api.systemOptions.get({
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

		yield* iterateAllPages(getSystemOptionsPage);
	}

	/**
	 * Create a system option
	 * @param name The name of the option
	 * @param value The value of the option
	 * @returns Created system option
	 */
	async createSystemOption(name: string, value: string) {
		const result = await this.api.systemOptions.post({
			name,
			value,
		});
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Get a system option by ID
	 * @param optionId The unique identifier of an option
	 * @returns System option
	 */
	async getSystemOptionById(optionId: string) {
		const result = await this.api.systemOptions.byId(optionId).get();
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Update a system option
	 * @param optionId The unique identifier of an option
	 * @param value The new value of the option
	 * @returns Updated system option
	 */
	async updateSystemOptionById(optionId: string, value: string) {
		const result = await this.api.systemOptions.byId(optionId).patch({
			value,
		});
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Delete a system option
	 * @param optionId The unique identifier of an option
	 */
	async deleteSystemOptionById(optionId: string) {
		await this.api.systemOptions.byId(optionId).delete();
	}

	// Vault Options operations
	/**
	 * Get vault-specific options
	 * @param vaultId The unique identifier of a vault
	 * @param options Query parameters including filter
	 * @returns Iterator of vault options
	 */
	async *getVaultOptions(
		vaultId: string,
		options?: VaultOptionsRequestBuilderGetQueryParameters,
	) {
		const getVaultOptionsPage = async (cursor: string) => {
			const response = await this.api.vaults.byId(vaultId).vaultOptions.get({
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

		yield* iterateAllPages(getVaultOptionsPage);
	}

	/**
	 * Create a vault option
	 * @param vaultId The unique identifier of a vault
	 * @param name The name of the option
	 * @param value The value of the option
	 * @returns Created vault option
	 */
	async createVaultOption(vaultId: string, name: string, value: string) {
		const result = await this.api.vaults.byId(vaultId).vaultOptions.post({
			name,
			value,
		});
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Get a vault option by ID
	 * @param vaultId The unique identifier of a vault
	 * @param optionId The unique identifier of an option
	 * @returns Vault option
	 */
	async getVaultOptionById(vaultId: string, optionId: string) {
		const result = await this.api.vaults
			.byId(vaultId)
			.vaultOptions.byId(optionId)
			.get();
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Update a vault option
	 * @param vaultId The unique identifier of a vault
	 * @param optionId The unique identifier of an option
	 * @param value The new value of the option
	 * @returns Updated vault option
	 */
	async updateVaultOptionById(vaultId: string, optionId: string, value: string) {
		const result = await this.api.vaults
			.byId(vaultId)
			.vaultOptions.byId(optionId)
			.patch({
				value,
			});
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Delete a vault option
	 * @param vaultId The unique identifier of a vault
	 * @param optionId The unique identifier of an option
	 */
	async deleteVaultOptionById(vaultId: string, optionId: string) {
		await this.api.vaults.byId(vaultId).vaultOptions.byId(optionId).delete();
	}
}
