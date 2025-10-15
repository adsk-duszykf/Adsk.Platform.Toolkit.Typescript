import type { BaseVaultDataClient } from "../generatedCode/baseVaultDataClient.js";
import type { ProfileAttributeDefinitionsRequestBuilderGetQueryParameters } from "../generatedCode/profileAttributeDefinitions/index.js";
import { iterateAllPages } from "../utils.js";

/**
 * Manager for Accounts operations
 * Handles users, groups, roles, and profile attributes
 */
export default class AccountsManager {
	constructor(private readonly api: BaseVaultDataClient) {}

	// Groups operations
	/**
	 * Get all groups
	 * @param options Query parameters for pagination
	 * @returns List of groups
	 */
	async *getGroups() {
		const getGroupsPage = async (cursor: string) => {
			const response = await this.api.groups.get({
				queryParameters: { cursorState: cursor },
			});

			if (!response?.pagination || !response?.results) {
				throw new Error("Unexpected null response");
			}

			const pagination = response.pagination;
			const results = response.results;

			return {
				pagination,
				results,
			};
		};

		yield* iterateAllPages(getGroupsPage);
	}

	/**
	 * Get a group by its ID
	 * @param groupId The unique identifier of a group
	 * @returns Group information
	 */
	async getGroupById(groupId: string) {
		const result = await this.api.groups.byId(groupId).get();
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Get group account information by specific authentication type
	 * @param groupId The unique identifier of a group
	 * @param authType The type of account (ActiveDirectory, Vault, or Autodesk)
	 * @returns Account information
	 */
	async getGroupAccountByAuthType(
		groupId: string,
		authType: "ActiveDirectory" | "Vault" | "Autodesk",
	) {
		const result = await this.api.groups
			.byId(groupId)
			.accounts.byAuthType(authType)
			.get();
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	// Users operations
	/**
	 * Get all users in the vault (requires AdminUserRead permission)
	 * @param options Query parameters for filtering
	 * @returns Iterator of users
	 */
	async *getAllUsers(options?: { limit?: number }) {
		const getUsersPage = async (cursor: string) => {
			const response = await this.api.users.get({
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

		yield* iterateAllPages(getUsersPage);
	}

	/**
	 * Get a user by ID
	 * @param userId The unique identifier of a user
	 * @returns User information
	 */
	async getUserById(userId: string) {
		const result = await this.api.users.byId(userId).get();
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Get all accounts associated with a user
	 * @param userId The unique identifier of a user
	 * @returns List of accounts
	 */
	async getUserAccounts(userId: string) {
		const result = await this.api.users.byId(userId).accounts.get();
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Get user account information by specific authentication type
	 * @param userId The unique identifier of a user
	 * @param authType The type of account (ActiveDirectory, Vault, or Autodesk)
	 * @returns Account information
	 */
	async getUserAccountByAuthType(
		userId: string,
		authType: "ActiveDirectory" | "Vault" | "Autodesk",
	) {
		const result = await this.api.users
			.byId(userId)
			.accounts.byAuthType(authType)
			.get();
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	// Roles operations
	/**
	 * Get user roles (returns all roles if user has AdminUserRead permission, otherwise only assigned roles)
	 * @param options Query parameters for filtering
	 * @returns Iterator of roles
	 */
	async *getRoles(options?: { limit?: number }) {
		const getRolesPage = async (cursor: string) => {
			const response = await this.api.roles.get({
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

		yield* iterateAllPages(getRolesPage);
	}

	/**
	 * Get a role by ID
	 * @param roleId The unique identifier of a role
	 * @returns Role information
	 */
	async getRoleById(roleId: string) {
		const result = await this.api.roles.byId(roleId).get();
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	// Profile Attribute Definitions operations
	/**
	 * Get all profile attribute definitions
	 * @param options Query parameters including filter
	 * @returns Iterator of profile attribute definitions
	 */
	async *getProfileAttributeDefinitions(
		options?: ProfileAttributeDefinitionsRequestBuilderGetQueryParameters,
	) {
		const getProfileAttrsPage = async (cursor: string) => {
			const response = await this.api.profileAttributeDefinitions.get({
				queryParameters: { ...options, cursorState: cursor },
			});

			if (!response?.pagination || !response?.results) {
				throw new Error("Unexpected null response");
			}

			// Note: The OpenAPI spec has a bug where results is typed as a single object
			// instead of an array. We need to ensure it's an array.
			const results = Array.isArray(response.results)
				? response.results
				: [response.results];

			return {
				pagination: response.pagination,
				results,
			};
		};

		yield* iterateAllPages(getProfileAttrsPage);
	}

	/**
	 * Get a profile attribute definition by ID
	 * @param definitionId The unique identifier of a profile attribute definition
	 * @returns Profile attribute definition
	 */
	async getProfileAttributeDefinitionById(definitionId: string) {
		const result = await this.api.profileAttributeDefinitions
			.byId(definitionId)
			.get();
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}
}
