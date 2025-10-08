import { describe, expect, it } from "bun:test";
import { useFetchMock } from "bun-fetch-mock";
import { AccountAdminClient } from "../src/accountAdminClient.js";

const BASE_URL = "https://developer.api.autodesk.com";
const ACCOUNT_ID = "f9a8b7c6-d5e4-43f2-a1b0-c9d8e7f6a5b5";
const PROJECT_ID = "f9a8b7c6-d5e4-43f2-a1b0-c9d8e7f6a5b4";

describe("ProjectsManager", () => {
	const mock = useFetchMock({ baseUrl: BASE_URL });
	const getToken = async () => "test-token";
	const client = new AccountAdminClient(getToken);

	it("should get a single project", async () => {
		mock.get(`${BASE_URL}/construction/admin/v1/projects/${PROJECT_ID}`, {
			data: {
				id: PROJECT_ID,
				name: "Test Project",
				type: "Office",
				status: "active",
				accountId: ACCOUNT_ID,
				platform: "acc",
				startDate: "2024-01-01",
				endDate: "2024-12-31",
				createdAt: "2024-01-01T10:00:00Z",
			},
			status: 200,
		});

		const result = await client.projects.getProject(PROJECT_ID);

		expect(result).toBeDefined();
		expect(result?.id).toBe(PROJECT_ID);
		expect(result?.name).toBe("Test Project");
		expect(result?.type).toBe("Office");
		mock.reset();
	});

	it("should list projects with automatic pagination (multi-page)", async () => {
		// First page
		mock.get(
			`${BASE_URL}/construction/admin/v1/accounts/${ACCOUNT_ID}/projects?offset=0`,
			{
				data: {
					results: [
						{
							id: "proj-1",
							name: "Project 1",
							type: "Office",
							status: "active",
						},
						{
							id: "proj-2",
							name: "Project 2",
							type: "Hospital",
							status: "active",
						},
					],
					pagination: {
						limit: 2,
						offset: 0,
						totalResults: 4,
					},
				},
				status: 200,
				once: true,
			},
		);

		// Second page
		mock.get(
			`${BASE_URL}/construction/admin/v1/accounts/${ACCOUNT_ID}/projects?offset=2`,
			{
				data: {
					results: [
						{
							id: "proj-3",
							name: "Project 3",
							type: "Bridge",
							status: "active",
						},
						{
							id: "proj-4",
							name: "Project 4",
							type: "Road",
							status: "pending",
						},
					],
					pagination: {
						limit: 2,
						offset: 2,
						totalResults: 4,
					},
				},
				status: 200,
			},
		);

		const projects = [];
		for await (const project of client.projects.listProjects(ACCOUNT_ID)) {
			projects.push(project);
		}

		expect(projects.length).toBeGreaterThanOrEqual(2);
		expect(projects[0].name).toBe("Project 1");
		expect(projects[0].type).toBe("Office");
		mock.reset();
	});
});
