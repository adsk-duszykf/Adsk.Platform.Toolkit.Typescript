import type { BaseVaultDataClient } from "../generatedCode/baseVaultDataClient.js";
import type { ChangeOrdersRequestBuilderGetQueryParameters } from "../generatedCode/vaults/item/changeOrders/index.js";
import type { FilesItemRequestBuilderGetQueryParameters } from "../generatedCode/vaults/item/files/item/index.js";
import type { ItemsRequestBuilderGetQueryParameters } from "../generatedCode/vaults/item/items/index.js";
import type { VersionsRequestBuilderGetQueryParameters } from "../generatedCode/vaults/item/items/item/versions/index.js";
import type { ItemVersionsRequestBuilderGetQueryParameters } from "../generatedCode/vaults/item/itemVersions/index.js";
import type { AssociatedFilesRequestBuilderGetQueryParameters } from "../generatedCode/vaults/item/itemVersions/item/associatedFiles/index.js";
import type { BillOfMaterialsRequestBuilderGetQueryParameters } from "../generatedCode/vaults/item/itemVersions/item/billOfMaterials/index.js";
import type { ParentsRequestBuilderGetQueryParameters } from "../generatedCode/vaults/item/itemVersions/item/parents/index.js";
import { iterateAllPages } from "../utils.js";

/**
 * Manager for Items operations
 * Handles item and item version operations
 */
export default class ItemsManager {
	constructor(private readonly api: BaseVaultDataClient) {}

	// Item Version operations
	/**
	 * Get item versions
	 * @param vaultId The unique identifier of a vault
	 * @param options Query parameters for filtering
	 * @returns Iterator of item versions
	 */
	async *getItemVersions(
		vaultId: string,
		options?: ItemVersionsRequestBuilderGetQueryParameters,
	) {
		const getItemVersionsPage = async (cursor: string) => {
			const response = await this.api.vaults.byId(vaultId).itemVersions.get({
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

		yield* iterateAllPages(getItemVersionsPage);
	}

	/**
	 * Get an item version by ID
	 * @param vaultId The unique identifier of a vault
	 * @param itemVersionId The unique identifier of an item version
	 * @returns Item version information
	 */
	async getItemVersionById(vaultId: string, itemVersionId: string) {
		const result = await this.api.vaults
			.byId(vaultId)
			.itemVersions.byId(itemVersionId)
			.get();
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Get file associations for an item version
	 * @param vaultId The unique identifier of a vault
	 * @param itemVersionId The unique identifier of an item version
	 * @param options Query parameters for filtering
	 * @returns List of associated file versions
	 */
	async getItemVersionAssociatedFiles(
		vaultId: string,
		itemVersionId: string,
		options?: AssociatedFilesRequestBuilderGetQueryParameters,
	) {
		const result = await this.api.vaults
			.byId(vaultId)
			.itemVersions.byId(itemVersionId)
			.associatedFiles.get({
				queryParameters: options,
			});
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Get Bill of Materials for an item version
	 * @param vaultId The unique identifier of a vault
	 * @param itemVersionId The unique identifier of an item version
	 * @param options Query parameters for BOM options
	 * @returns BOM links and revisions
	 */
	async getItemVersionBom(
		vaultId: string,
		itemVersionId: string,
		options?: BillOfMaterialsRequestBuilderGetQueryParameters,
	) {
		const result = await this.api.vaults
			.byId(vaultId)
			.itemVersions.byId(itemVersionId)
			.billOfMaterials.get({
				queryParameters: options,
			});
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Get where-used information for an item version
	 * @param vaultId The unique identifier of a vault
	 * @param itemVersionId The unique identifier of an item version
	 * @param options Query parameters for where-used options
	 * @returns BOM links and revisions showing parent items
	 */
	async getItemVersionWhereUsed(
		vaultId: string,
		itemVersionId: string,
		options?: ParentsRequestBuilderGetQueryParameters,
	) {
		const result = await this.api.vaults
			.byId(vaultId)
			.itemVersions.byId(itemVersionId)
			.parents.get({
				queryParameters: options,
			});
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Get thumbnail for an item version
	 * @param vaultId The unique identifier of a vault
	 * @param itemVersionId The unique identifier of an item version
	 * @returns Thumbnail as binary data
	 */
	async getItemVersionThumbnail(vaultId: string, itemVersionId: string) {
		const result = await this.api.vaults
			.byId(vaultId)
			.itemVersions.byId(itemVersionId)
			.thumbnail.get();
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	// Item operations
	/**
	 * Get all items
	 * @param vaultId The unique identifier of a vault
	 * @param options Query parameters for filtering
	 * @returns Iterator of items
	 */
	async *getItems(
		vaultId: string,
		options?: ItemsRequestBuilderGetQueryParameters,
	) {
		const getItemsPage = async (cursor: string) => {
			const response = await this.api.vaults.byId(vaultId).items.get({
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

		yield* iterateAllPages(getItemsPage);
	}

	/**
	 * Get an item by ID
	 * @param vaultId The unique identifier of a vault
	 * @param itemId The unique identifier of an item (MasterId)
	 * @param options Query parameters
	 * @returns Item information
	 */
	async getItemById(
		vaultId: string,
		itemId: string,
		options?: FilesItemRequestBuilderGetQueryParameters,
	) {
		const result = await this.api.vaults.byId(vaultId).items.byId(itemId).get({
			queryParameters: options,
		});
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Get change orders for an item
	 * @param vaultId The unique identifier of a vault
	 * @param itemId The unique identifier of an item (MasterId)
	 * @param options Query parameters for filtering
	 * @returns Iterator of change orders
	 */
	async *getItemAssociatedChangeOrders(
		vaultId: string,
		itemId: string,
		options?: ChangeOrdersRequestBuilderGetQueryParameters,
	) {
		const getChangeOrdersPage = async (cursor: string) => {
			const response = await this.api.vaults
				.byId(vaultId)
				.items.byId(itemId)
				.changeOrders.get({
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

		yield* iterateAllPages(getChangeOrdersPage);
	}

	/**
	 * Get version history for an item
	 * @param vaultId The unique identifier of a vault
	 * @param itemId The unique identifier of an item (MasterId)
	 * @param options Query parameters for filtering
	 * @returns Iterator of item versions
	 */
	async *getItemHistory(
		vaultId: string,
		itemId: string,
		options?: VersionsRequestBuilderGetQueryParameters,
	) {
		const getHistoryPage = async (cursor: string) => {
			const response = await this.api.vaults
				.byId(vaultId)
				.items.byId(itemId)
				.versions.get({
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

		yield* iterateAllPages(getHistoryPage);
	}
}
