import type { BaseVaultDataClient } from "../generatedCode/baseVaultDataClient.js";
import type { SearchResultsRequestBuilderGetQueryParameters } from "../generatedCode/vaults/item/searchResults/index.js";
import type {
	WithVaultIdAdvancedSearchPostRequestBody,
	WithVaultIdAdvancedSearchRequestBuilderPostQueryParameters,
} from "../generatedCode/vaults/withVaultIdAdvancedSearch/index.js";
import { iterateAllPages } from "../utils.js";

/**
 * Manager for Search operations
 * Handles basic and advanced search functionality
 */
export default class SearchManager {
	constructor(private readonly api: BaseVaultDataClient) {}

	/**
	 * Perform basic search across all properties or content
	 * @param vaultId The unique identifier of a vault
	 * @param options Query parameters for search and filtering
	 * @returns Iterator of search results
	 */
	async *search(
		vaultId: string,
		options?: SearchResultsRequestBuilderGetQueryParameters,
	) {
		const getSearchPage = async (cursor: string) => {
			const response = await this.api.vaults.byId(vaultId).searchResults.get({
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

		yield* iterateAllPages(getSearchPage);
	}

	/**
	 * Perform advanced search with detailed criteria
	 * @param vaultId The unique identifier of a vault
	 * @param body Search criteria including entity types, folders, and property filters
	 * @param options Query parameters for search options
	 * @returns Iterator of search results
	 */
	async *advancedSearch(
		vaultId: string,
		body: WithVaultIdAdvancedSearchPostRequestBody,
		options?: WithVaultIdAdvancedSearchRequestBuilderPostQueryParameters,
	) {
		const getAdvancedSearchPage = async (cursor: string) => {
			const response = await this.api.vaults
				.withVaultIdAdvancedSearch(vaultId)
				.post(body, {
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

		yield* iterateAllPages(getAdvancedSearchPage);
	}
}
