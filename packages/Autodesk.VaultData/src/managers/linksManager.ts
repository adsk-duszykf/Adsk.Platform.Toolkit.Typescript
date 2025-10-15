import type { BaseVaultDataClient } from "../generatedCode/baseVaultDataClient.js";
import { iterateAllPages } from "../utils.js";

/**
 * Manager for Links operations
 * Handles link entities (shortcuts to files, folders, items, or change orders)
 */
export default class LinksManager {
	constructor(private readonly api: BaseVaultDataClient) {}

	/**
	 * Get all links
	 * @param vaultId The unique identifier of a vault
	 * @param options Query parameters for filtering
	 * @returns Iterator of links
	 */
	async *getLinks(vaultId: string, options?: { limit?: number }) {
		const getLinksPage = async (cursor: string) => {
			const response = await this.api.vaults.byId(vaultId).links.get({
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

		yield* iterateAllPages(getLinksPage);
	}

	/**
	 * Get a link by ID
	 * @param vaultId The unique identifier of a vault
	 * @param linkId The unique identifier of a link
	 * @returns Link information
	 */
	async getLinkById(vaultId: string, linkId: string) {
		const result = await this.api.vaults.byId(vaultId).links.byId(linkId).get();
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}
}
