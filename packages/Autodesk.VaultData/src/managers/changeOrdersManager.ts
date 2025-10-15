import type { BaseVaultDataClient } from "../generatedCode/baseVaultDataClient.js";
import type { AttachmentsRequestBuilderGetQueryParameters } from "../generatedCode/vaults/item/changeOrderComments/item/attachments/index.js";
import type { ChangeOrdersRequestBuilderGetQueryParameters } from "../generatedCode/vaults/item/changeOrders/index.js";
import type { AllRelatedFilesRequestBuilderGetQueryParameters } from "../generatedCode/vaults/item/changeOrders/item/allRelatedFiles/index.js";
import type { AssociatedEntitiesRequestBuilderGetQueryParameters } from "../generatedCode/vaults/item/changeOrders/item/associatedEntities/index.js";
import { iterateAllPages } from "../utils.js";

/**
 * Manager for Change Orders operations
 * Handles change orders and their associated entities
 */
export default class ChangeOrdersManager {
	constructor(private readonly api: BaseVaultDataClient) {}

	/**
	 * Get change orders based on conditions
	 * @param vaultId The unique identifier of a vault
	 * @param options Query parameters for filtering
	 * @returns Iterator of change orders
	 */
	async *getChangeOrders(
		vaultId: string,
		options?: ChangeOrdersRequestBuilderGetQueryParameters,
	) {
		const getChangeOrdersPage = async (cursor: string) => {
			const response = await this.api.vaults.byId(vaultId).changeOrders.get({
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
	 * Get a change order by ID
	 * @param vaultId The unique identifier of a vault
	 * @param changeOrderId The unique identifier of a change order
	 * @returns Change order information
	 */
	async getChangeOrderById(vaultId: string, changeOrderId: string) {
		const result = await this.api.vaults
			.byId(vaultId)
			.changeOrders.byId(changeOrderId)
			.get();
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Get all related files for a change order
	 * @param vaultId The unique identifier of a vault
	 * @param changeOrderId The unique identifier of a change order
	 * @param options Query parameters for filtering
	 * @returns Iterator of file versions
	 */
	async *getChangeOrderRelatedFiles(
		vaultId: string,
		changeOrderId: string,
		options?: AllRelatedFilesRequestBuilderGetQueryParameters,
	) {
		const getRelatedFilesPage = async (cursor: string) => {
			const response = await this.api.vaults
				.byId(vaultId)
				.changeOrders.byId(changeOrderId)
				.allRelatedFiles.get({
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

		yield* iterateAllPages(getRelatedFilesPage);
	}

	/**
	 * Get associated entities (files and items) for a change order
	 * @param vaultId The unique identifier of a vault
	 * @param changeOrderId The unique identifier of a change order
	 * @param options Query parameters for filtering
	 * @returns Iterator of entities
	 */
	async *getChangeOrderAssociatedEntities(
		vaultId: string,
		changeOrderId: string,
		options?: AssociatedEntitiesRequestBuilderGetQueryParameters,
	) {
		const getAssociatedEntitiesPage = async (cursor: string) => {
			const response = await this.api.vaults
				.byId(vaultId)
				.changeOrders.byId(changeOrderId)
				.associatedEntities.get({
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

		yield* iterateAllPages(getAssociatedEntitiesPage);
	}

	/**
	 * Get comments for a change order
	 * @param vaultId The unique identifier of a vault
	 * @param changeOrderId The unique identifier of a change order
	 * @param options Query parameters for filtering
	 * @returns Iterator of comments
	 */
	async *getChangeOrderComments(
		vaultId: string,
		changeOrderId: string,
		options?: {
			limit?: number;
		},
	) {
		const getCommentsPage = async (cursor: string) => {
			const response = await this.api.vaults
				.byId(vaultId)
				.changeOrders.byId(changeOrderId)
				.comments.get({
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

		yield* iterateAllPages(getCommentsPage);
	}

	/**
	 * Get attachments for a change order comment
	 * @param vaultId The unique identifier of a vault
	 * @param commentId The unique identifier of a change order comment
	 * @param options Query parameters for filtering
	 * @returns Iterator of file versions (attachments)
	 */
	async *getChangeOrderCommentAttachments(
		vaultId: string,
		commentId: string,
		options?: AttachmentsRequestBuilderGetQueryParameters,
	) {
		const getAttachmentsPage = async (cursor: string) => {
			const response = await this.api.vaults
				.byId(vaultId)
				.changeOrderComments.byId(commentId)
				.attachments.get({
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

		yield* iterateAllPages(getAttachmentsPage);
	}
}
