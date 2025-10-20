import { getMultiPageResultsWithOffset } from "@adsk-platform/common";
import type { ApiRequestBuilder } from "../accountAdminClient.js";
import type {
	ProjectsGetResponse_results,
	ProjectsPostRequestBody,
	ProjectsPostResponse,
	ProjectsRequestBuilderGetQueryParameters,
} from "../generatedCode/acc/construction/admin/v1/accounts/item/projects/index.js";
import type {
	WithProjectGetResponse,
	WithProjectItemRequestBuilderGetQueryParameters,
} from "../generatedCode/acc/construction/admin/v1/projects/item/index.js";

/**
 * Manager for Projects operations
 */
export class ProjectsManager {
	constructor(private readonly api: ApiRequestBuilder) {}

	/**
	 * Retrieves a list of all projects within a specified ACC account.
	 * Supports automatic pagination to retrieve all projects.
	 *
	 * @param accountId - The ID of the ACC account (hub ID without 'b.' prefix)
	 * @param options - Optional query parameters for filtering and sorting
	 * @param region - Optional region header for request routing
	 * @param userId - Optional user ID for 2-legged authentication context
	 * @returns Async generator yielding projects one at a time
	 */
	async *listProjects(
		accountId: string,
		options?: Omit<ProjectsRequestBuilderGetQueryParameters, "offset" | "limit">,
		region?: string,
		userId?: string,
	): AsyncGenerator<ProjectsGetResponse_results> {
		const getPageResult = async (offset: number, limit?: number) => {
			const result = await this.api.construction.admin.v1.accounts
				.byAccountId(accountId)
				.projects.get({
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
	 * Creates a new project in the specified account.
	 *
	 * @param accountId - The ID of the ACC account (hub ID without 'b.' prefix)
	 * @param projectData - The project creation data
	 * @param region - Optional region header for request routing
	 * @param userId - Optional user ID for 2-legged authentication context
	 * @returns The created project information
	 */
	async createProject(
		accountId: string,
		projectData: ProjectsPostRequestBody,
		region?: string,
		userId?: string,
	): Promise<ProjectsPostResponse> {
		const result = await this.api.construction.admin.v1.accounts
			.byAccountId(accountId)
			.projects.post(projectData, {
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
	 * Retrieves detailed information about a specific project.
	 *
	 * @param projectId - The ID of the project (without 'b.' prefix)
	 * @param fields - Optional comma-separated list of fields to include in response
	 * @param region - Optional region header for request routing
	 * @param userId - Optional user ID for 2-legged authentication context
	 * @returns The project information
	 */
	async getProject(
		projectId: string,
		fields?: WithProjectItemRequestBuilderGetQueryParameters | undefined,
		region?: string,
		userId?: string,
	): Promise<WithProjectGetResponse> {
		const result = await this.api.construction.admin.v1.projects
			.byProjectId(projectId)
			.get({
				headers: {
					...(region && { Region: region }),
					...(userId && { "User-Id": userId }),
				},
				queryParameters: fields,
			});

		if (!result) {
			throw new Error("Unexpected null response");
		}

		return result;
	}
}
