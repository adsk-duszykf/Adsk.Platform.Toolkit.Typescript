import { getMultiPageResultsWithOffset } from "@adsk-platform/common";
import type { ApiRequestBuilder } from "../accountAdminClient.js";
import type {
	UsersGetResponse_results,
	UsersPostRequestBody,
	UsersPostResponse,
	UsersRequestBuilderGetQueryParameters,
} from "../generatedCode/acc/construction/admin/v1/projects/item/users/index.js";
import type {
	WithUserPatchRequestBody,
	WithUserPatchResponse,
} from "../generatedCode/acc/construction/admin/v1/projects/item/users/item/index.js";
import type {
	UsersImportPostRequestBody,
	UsersImportPostResponse,
} from "../generatedCode/acc/construction/admin/v2/projects/item/usersImport/index.js";

/**
 * Manager for Project Users operations
 */
export class ProjectUsersManager {
	constructor(private readonly api: ApiRequestBuilder) {}

	/**
	 * Retrieves a filtered list of users in a specified project.
	 * Supports automatic pagination to retrieve all matching users.
	 *
	 * @param projectId - The ID of the project (without 'b.' prefix)
	 * @param options - Optional query parameters for filtering and sorting
	 * @param region - Optional region header for request routing
	 * @param userId - Optional user ID for 2-legged authentication context
	 * @returns Async generator yielding project users one at a time
	 */
	async *listProjectUsers(
		projectId: string,
		options?: Omit<UsersRequestBuilderGetQueryParameters, "offset" | "limit">,
		region?: string,
		userId?: string,
	): AsyncGenerator<UsersGetResponse_results> {
		const getPageResult = async (offset: number, limit?: number) => {
			const result = await this.api.construction.admin.v1.projects
				.byProjectId(projectId)
				.users.get({
					headers: {
						...(region && { Region: region }),
						...(userId && { "User-Id": userId }),
					},
					queryParameters: {
						...options,
						offset,
						limit,
					},
				});

			if (!result?.results) {
				throw new Error("Unexpected null response");
			}
			return result.results;
		};

		yield* getMultiPageResultsWithOffset(getPageResult);
	}

	/**
	 * Assigns a user to the specified project.
	 *
	 * @param projectId - The ID of the project (without 'b.' prefix)
	 * @param userData - The user assignment data
	 * @param region - Optional region header for request routing
	 * @param userId - Optional user ID for 2-legged authentication context
	 * @returns The created project user information
	 */
	async addProjectUser(
		projectId: string,
		userData: UsersPostRequestBody,
		region?: string,
		userId?: string,
	): Promise<UsersPostResponse> {
		const result = await this.api.construction.admin.v1.projects
			.byProjectId(projectId)
			.users.post(userData, {
				headers: {
					...(region && { Region: region }),
					...(userId && { "User-Id": userId }),
				},
			});

		if (!result) {
			throw new Error("Unexpected null response");
		}

		return result;
	}

	/**
	 * Retrieves detailed information about a specific user in a project.
	 *
	 * @param projectId - The ID of the project (without 'b.' prefix)
	 * @param userIdOrAutodeskId - The ACC ID or Autodesk ID of the user
	 * @param fields - Optional list of fields to include in response
	 * @param region - Optional region header for request routing
	 * @param userId - Optional user ID for 2-legged authentication context
	 * @returns The project user information
	 */
	async getProjectUser(
		projectId: string,
		userIdOrAutodeskId: string,
		fields?: string[],
		region?: string,
		userId?: string,
	): Promise<UsersGetResponse_results> {
		const result = await this.api.construction.admin.v1.projects
			.byProjectId(projectId)
			.users.byUserId(userIdOrAutodeskId)
			.get({
				headers: {
					...(region && { Region: region }),
					...(userId && { "User-Id": userId }),
				},
				queryParameters: fields ? { fields } : undefined,
			});

		if (!result) {
			throw new Error("Unexpected null response");
		}

		return result;
	}

	/**
	 * Updates information about a specified user in a project.
	 *
	 * @param projectId - The ID of the project (without 'b.' prefix)
	 * @param userIdOrAutodeskId - The ACC ID or Autodesk ID of the user
	 * @param userData - The user update data (partial update)
	 * @param region - Optional region header for request routing
	 * @param userId - Optional user ID for 2-legged authentication context
	 * @returns The updated project user information
	 */
	async updateProjectUser(
		projectId: string,
		userIdOrAutodeskId: string,
		userData: WithUserPatchRequestBody, // Using any because PATCH request body type
		region?: string,
		userId?: string,
	): Promise<WithUserPatchResponse> {
		const result = await this.api.construction.admin.v1.projects
			.byProjectId(projectId)
			.users.byUserId(userIdOrAutodeskId)
			.patch(userData, {
				headers: {
					...(region && { Region: region }),
					...(userId && { "User-Id": userId }),
				},
			});

		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Removes a specified user from a project.
	 *
	 * @param projectId - The ID of the project (without 'b.' prefix)
	 * @param userIdOrAutodeskId - The ACC ID or Autodesk ID of the user
	 * @param region - Optional region header for request routing
	 * @param userId - Optional user ID for 2-legged authentication context
	 * @returns Promise that resolves when the operation is complete
	 */
	async removeProjectUser(
		projectId: string,
		userIdOrAutodeskId: string,
		region?: string,
		userId?: string,
	): Promise<void> {
		await this.api.construction.admin.v1.projects
			.byProjectId(projectId)
			.users.byUserId(userIdOrAutodeskId)
			.delete({
				headers: {
					...(region && { Region: region }),
					...(userId && { "User-Id": userId }),
				},
			});
	}

	/**
	 * Imports multiple users to a project at once (up to 200 users per request).
	 *
	 * @param projectId - The ID of the project (without 'b.' prefix)
	 * @param users - Array of users to import
	 * @param region - Optional region header for request routing
	 * @param userId - Optional user ID for 2-legged authentication context
	 * @returns The import job information
	 */
	async importProjectUsers(
		projectId: string,
		users: UsersImportPostRequestBody, // Using any because import request body type
		region?: string,
		userId?: string,
	): Promise<UsersImportPostResponse> {
		const result = await this.api.construction.admin.v2.projects
			.byProjectId(projectId)
			.usersImport.post(users, {
				headers: {
					...(region && { Region: region }),
					...(userId && { "User-Id": userId }),
				},
			});

		if (!result) {
			throw new Error("Unexpected null response");
		}

		return result;
	}
}
