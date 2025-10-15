import type { BaseVaultDataClient } from "../generatedCode/baseVaultDataClient.js";
import type { PropertyDefinitionsRequestBuilderGetQueryParameters } from "../generatedCode/vaults/item/propertyDefinitions/index.js";
import { iterateAllPages } from "../utils.js";

/**
 * Manager for Property operations
 * Handles property definitions
 */
export default class PropertyManager {
	constructor(private readonly api: BaseVaultDataClient) {}

	/**
	 * Get all property definitions in the vault
	 * @param vaultId The unique identifier of a vault
	 * @param options Query parameters including filters
	 * @returns Iterator of property definitions
	 */
	async *getPropertyDefinitions(
		vaultId: string,
		options?: PropertyDefinitionsRequestBuilderGetQueryParameters,
	) {
		const getPropertyDefsPage = async (cursor: string) => {
			const response = await this.api.vaults
				.byId(vaultId)
				.propertyDefinitions.get({
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

		yield* iterateAllPages(getPropertyDefsPage);
	}

	/**
	 * Get a property definition by ID
	 * @param vaultId The unique identifier of a vault
	 * @param propertyDefId The unique identifier of a property definition
	 * @returns Property definition
	 */
	async getPropertyDefinitionById(vaultId: string, propertyDefId: string) {
		const result = await this.api.vaults
			.byId(vaultId)
			.propertyDefinitions.byId(propertyDefId)
			.get();
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}
}
