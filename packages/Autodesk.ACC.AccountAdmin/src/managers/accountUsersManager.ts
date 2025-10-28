import type { ApiRequestBuilder } from "../accountAdminClient.js";
import type {
	ImportPostRequestBody,
	ImportPostResponse,
} from "../generatedCode/hq/v1/accounts/item/users/importEscaped/index.js";
import type {
	UsersGetResponse,
	UsersPostRequestBody,
	UsersPostResponse,
} from "../generatedCode/hq/v1/accounts/item/users/index.js";

/**
 * Manager for Account Users operations (BIM360)
 */
export class AccountUsersManager {
	constructor(private readonly api: ApiRequestBuilder) {}

	/**
	 * Query all the users in a specific BIM 360 account.
	 *
	 * @param accountId - The account ID of the users
	 * @returns User data
	 */
	async listUsers(accountId: string): Promise<UsersGetResponse> {
		const result = await this.api.hq.v1.accounts
			.byAccount_id(accountId)
			.users.get();

		if (!result) {
			throw new Error("Unexpected null response");
		}

		return result;
	}

	/**
	 * Create a new user in the BIM 360 member directory.
	 *
	 * @param accountId - The account ID
	 * @param userData - The user creation data
	 * @returns The created user information
	 */
	async createUser(
		accountId: string,
		userData: UsersPostRequestBody,
	): Promise<UsersPostResponse> {
		const result = await this.api.hq.v1.accounts
			.byAccount_id(accountId)
			.users.post(userData);

		if (!result) {
			throw new Error("Unexpected null response");
		}

		return result;
	}

	/**
	 * Query the details of a specific user.
	 *
	 * @param accountId - The account ID of the user
	 * @param userId - User ID
	 * @returns The user information
	 */
	async getUser(accountId: string, userId: string): Promise<UsersGetResponse> {
		const result = await this.api.hq.v1.accounts
			.byAccount_id(accountId)
			.users.byUser_id(userId)
			.get();

		if (!result) {
			throw new Error("Unexpected null response");
		}

		return result;
	}

	/**
	 * Bulk import users to the master member directory in a BIM 360 account.
	 * Maximum 50 users per call.
	 *
	 * @param accountId - The account ID
	 * @param users - Array of users to import (max 50)
	 * @returns Import result with success and failure counts
	 */
	async importUsers(
		accountId: string,
		users: ImportPostRequestBody,
	): Promise<ImportPostResponse> {
		const result = await this.api.hq.v1.accounts
			.byAccount_id(accountId)
			.users.importEscaped.post(users);

		if (!result) {
			throw new Error("Unexpected null response");
		}

		return result;
	}
}
