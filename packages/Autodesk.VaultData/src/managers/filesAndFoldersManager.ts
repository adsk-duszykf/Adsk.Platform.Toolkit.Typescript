import type { BaseVaultDataClient } from "../generatedCode/baseVaultDataClient.js";
import type { ChangeOrdersRequestBuilderGetQueryParameters } from "../generatedCode/vaults/item/changeOrders/index.js";
import type { FilesItemRequestBuilderGetQueryParameters } from "../generatedCode/vaults/item/files/item/index.js";
import type { VersionsRequestBuilderGetQueryParameters } from "../generatedCode/vaults/item/files/item/versions/index.js";
import type { FileVersionsRequestBuilderGetQueryParameters } from "../generatedCode/vaults/item/fileVersions/index.js";
import type { ContentRequestBuilderGetQueryParameters } from "../generatedCode/vaults/item/fileVersions/item/content/index.js";
import type { ItemVersionsRequestBuilderGetQueryParameters } from "../generatedCode/vaults/item/fileVersions/item/itemVersions/index.js";
import type { ParentsRequestBuilderGetQueryParameters } from "../generatedCode/vaults/item/fileVersions/item/parents/index.js";
import type { SignedurlRequestBuilderGetQueryParameters } from "../generatedCode/vaults/item/fileVersions/item/signedurl/index.js";
import type { UsesRequestBuilderGetQueryParameters } from "../generatedCode/vaults/item/fileVersions/item/uses/index.js";
import type { ContentsRequestBuilderGetQueryParameters } from "../generatedCode/vaults/item/folders/item/contents/index.js";
import type { SubFoldersRequestBuilderGetQueryParameters } from "../generatedCode/vaults/item/folders/item/subFolders/index.js";
import { iterateAllPages } from "../utils.js";
/**
 * Manager for Files and Folders operations
 * Handles file versions, files, and folder operations
 */
export default class FilesAndFoldersManager {
	constructor(private readonly api: BaseVaultDataClient) {}

	// File Version operations
	/**
	 * Get file versions based on conditions
	 * @param vaultId The unique identifier of a vault
	 * @param options Query parameters for filtering
	 * @returns Iterator of file versions
	 */
	async *getFileVersions(
		vaultId: string,
		options?: FileVersionsRequestBuilderGetQueryParameters,
	) {
		const getFileVersionsPage = async (cursor: string) => {
			const response = await this.api.vaults.byId(vaultId).fileVersions.get({
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

		yield* iterateAllPages(getFileVersionsPage);
	}

	/**
	 * Get a file version by ID
	 * @param vaultId The unique identifier of a vault
	 * @param fileVersionId The unique identifier of a file version
	 * @returns File version information
	 */
	async getFileVersionById(vaultId: string, fileVersionId: string) {
		const result = await this.api.vaults
			.byId(vaultId)
			.fileVersions.byId(fileVersionId)
			.get();
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Generate signed download URL for a file version
	 * @param vaultId The unique identifier of a vault
	 * @param fileVersionId The unique identifier of a file version
	 * @param options Query parameters for signed URL generation
	 * @returns Signed URL object with id and url
	 */
	async getFileVersionSignedUrl(
		vaultId: string,
		fileVersionId: string,
		options?: SignedurlRequestBuilderGetQueryParameters,
	) {
		const result = await this.api.vaults
			.byId(vaultId)
			.fileVersions.byId(fileVersionId)
			.signedurl.get({
				queryParameters: options,
			});
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Download file version content
	 * @param vaultId The unique identifier of a vault
	 * @param fileVersionId The unique identifier of a file version
	 * @param options Query parameters for download
	 * @returns File content as stream
	 */
	async getFileVersionContent(
		vaultId: string,
		fileVersionId: string,
		options?: ContentRequestBuilderGetQueryParameters & { range?: string },
	) {
		const result = await this.api.vaults
			.byId(vaultId)
			.fileVersions.byId(fileVersionId)
			.content.get({
				queryParameters: options,
				headers: options?.range ? { Range: options.range } : undefined,
			});
		
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Get file version thumbnail
	 * @param vaultId The unique identifier of a vault
	 * @param fileVersionId The unique identifier of a file version
	 * @returns Thumbnail as binary data
	 */
	async getFileVersionThumbnail(vaultId: string, fileVersionId: string) {
		const result = await this.api.vaults
			.byId(vaultId)
			.fileVersions.byId(fileVersionId)
			.thumbnail.get();
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Get items assigned to a file version
	 * @param vaultId The unique identifier of a vault
	 * @param fileVersionId The unique identifier of a file version
	 * @param options Query parameters for filtering
	 * @returns Iterator of item versions
	 */
	async *getFileVersionAssociatedItemVersions(
		vaultId: string,
		fileVersionId: string,
		options?: ItemVersionsRequestBuilderGetQueryParameters,
	) {
		const getItemVersionsPage = async (cursor: string) => {
			const response = await this.api.vaults
				.byId(vaultId)
				.fileVersions.byId(fileVersionId)
				.itemVersions.get({
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
	 * Get markups for a file version
	 * @param vaultId The unique identifier of a vault
	 * @param fileVersionId The unique identifier of a file version
	 * @param options Query parameters for filtering
	 * @returns Iterator of markups
	 */
	async *getFileVersionMarkups(
		vaultId: string,
		fileVersionId: string,
		options?: {
			limit?: number;
		},
	) {
		const getMarkupsPage = async (cursor: string) => {
			const response = await this.api.vaults
				.byId(vaultId)
				.fileVersions.byId(fileVersionId)
				.markups.get({
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

		yield* iterateAllPages(getMarkupsPage);
	}

	/**
	 * Get visualization attachments for a file version
	 * @param vaultId The unique identifier of a vault
	 * @param fileVersionId The unique identifier of a file version
	 * @param options Query parameters for filtering
	 * @returns Iterator of visualization attachments
	 */
	async *getFileVersionVisualizationAttachments(
		vaultId: string,
		fileVersionId: string,
		options?: {
			limit?: number;
		},
	) {
		const getVisualizationAttachmentsPage = async (cursor: string) => {
			const response = await this.api.vaults
				.byId(vaultId)
				.fileVersions.byId(fileVersionId)
				.visualizationAttachments.get({
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

		yield* iterateAllPages(getVisualizationAttachmentsPage);
	}

	/**
	 * Get child associations (dependencies and attachments) for a file version
	 * @param vaultId The unique identifier of a vault
	 * @param fileVersionId The unique identifier of a file version
	 * @param options Query parameters for filtering
	 * @returns Iterator of file associations
	 */
	async *getFileVersionUses(
		vaultId: string,
		fileVersionId: string,
		options?: UsesRequestBuilderGetQueryParameters,
	) {
		const getUsesPage = async (cursor: string) => {
			const response = await this.api.vaults
				.byId(vaultId)
				.fileVersions.byId(fileVersionId)
				.uses.get({
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

		yield* iterateAllPages(getUsesPage);
	}

	/**
	 * Get parent associations for a file version
	 * @param vaultId The unique identifier of a vault
	 * @param fileVersionId The unique identifier of a file version
	 * @param options Query parameters for filtering
	 * @returns Iterator of file associations
	 */
	async *getFileVersionWhereUsed(
		vaultId: string,
		fileVersionId: string,
		options?: ParentsRequestBuilderGetQueryParameters,
	) {
		const getWhereUsedPage = async (cursor: string) => {
			const response = await this.api.vaults
				.byId(vaultId)
				.fileVersions.byId(fileVersionId)
				.parents.get({
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

		yield* iterateAllPages(getWhereUsedPage);
	}

	// File operations
	/**
	 * Get a file by ID
	 * @param vaultId The unique identifier of a vault
	 * @param fileId The unique identifier of a file (MasterId)
	 * @param options Query parameters
	 * @returns File information
	 */
	async getFileById(
		vaultId: string,
		fileId: string,
		options?: FilesItemRequestBuilderGetQueryParameters,
	) {
		const result = await this.api.vaults.byId(vaultId).files.byId(fileId).get({
			queryParameters: options,
		});
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Get change orders for a file
	 * @param vaultId The unique identifier of a vault
	 * @param fileId The unique identifier of a file (MasterId)
	 * @param options Query parameters for filtering
	 * @returns Iterator of change orders
	 */
	async *getFileAssociatedChangeOrders(
		vaultId: string,
		fileId: string,
		options?: ChangeOrdersRequestBuilderGetQueryParameters,
	) {
		const getChangeOrdersPage = async (cursor: string) => {
			const response = await this.api.vaults
				.byId(vaultId)
				.files.byId(fileId)
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
	 * Get version history for a file
	 * @param vaultId The unique identifier of a vault
	 * @param fileId The unique identifier of a file (MasterId)
	 * @param options Query parameters for filtering
	 * @returns Iterator of file versions
	 */
	async *getFileHistory(
		vaultId: string,
		fileId: string,
		options?: VersionsRequestBuilderGetQueryParameters,
	) {
		const getHistoryPage = async (cursor: string) => {
			const response = await this.api.vaults
				.byId(vaultId)
				.files.byId(fileId)
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

	// Folder operations
	/**
	 * Get a folder by ID
	 * @param vaultId The unique identifier of a vault
	 * @param folderId The unique identifier of a folder (use 'root' for root folder)
	 * @returns Folder information
	 */
	async getFolderById(vaultId: string, folderId: string) {
		const result = await this.api.vaults
			.byId(vaultId)
			.folders.byId(folderId)
			.get();
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Get folder contents
	 * @param vaultId The unique identifier of a vault
	 * @param folderId The unique identifier of a folder (use 'root' for root folder)
	 * @param options Query parameters for filtering
	 * @returns Iterator of entities (folders and files)
	 */
	async *getFolderContents(
		vaultId: string,
		folderId: string,
		options?: ContentsRequestBuilderGetQueryParameters,
	) {
		const getContentsPage = async (cursor: string) => {
			const response = await this.api.vaults
				.byId(vaultId)
				.folders.byId(folderId)
				.contents.get({
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

		yield* iterateAllPages(getContentsPage);
	}

	/**
	 * Get immediate subfolders of a folder
	 * @param vaultId The unique identifier of a vault
	 * @param folderId The unique identifier of a folder
	 * @param options Query parameters for filtering
	 * @returns Iterator of subfolders
	 */
	async *getFolderSubFolders(
		vaultId: string,
		folderId: string,
		options?: SubFoldersRequestBuilderGetQueryParameters,
	) {
		const getSubFoldersPage = async (cursor: string) => {
			const response = await this.api.vaults
				.byId(vaultId)
				.folders.byId(folderId)
				.subFolders.get({
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

		yield* iterateAllPages(getSubFoldersPage);
	}
}
