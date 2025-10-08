import { describe, expect, it } from "bun:test";
import { useFetchMock } from "bun-fetch-mock";
import { AccountAdminClient } from "../src/accountAdminClient.js";

const BASE_URL = "https://developer.api.autodesk.com";
const PROJECT_ID = "a4be0c34a-4ab7";
const USER_ID = "f9a8b7c6-d5e4-43f2-a1b0-c9d8e7f6a5b4";
const AUTODESK_ID = "autodesk-user-123";

describe("ProjectUsersManager", () => {
	const mock = useFetchMock({ baseUrl: BASE_URL });
	const getToken = async () => "test-token";
	const client = new AccountAdminClient(getToken);

	it("should get a single project user", async () => {
		mock.get(
			`${BASE_URL}/construction/admin/v1/projects/${PROJECT_ID}/users/${USER_ID}`,
			{
				data: {
					id: USER_ID,
					email: "test@example.com",
					name: "Test User",
					firstName: "Test",
					lastName: "User",
					autodeskId: AUTODESK_ID,
					status: "active",
					companyId: "company-123",
					companyName: "Test Company",
					roleIds: ["role-1"],
					products: [
						{
							key: "docs",
							access: "admin",
						},
					],
				},
				status: 200,
			},
		);

		const result = await client.projectUsers.getProjectUser(PROJECT_ID, USER_ID);

		expect(result).toBeDefined();
		expect(result?.id).toBe(USER_ID);
		expect(result?.email).toBe("test@example.com");
		expect(result?.name).toBe("Test User");
		mock.reset();
	});

	it("should list project users with automatic pagination (multi-page)", async () => {
		// First page
		mock.get(
			`${BASE_URL}/construction/admin/v1/projects/${PROJECT_ID}/users?offset=0`,
			{
				data: {
					results: [
						{
							id: "user-1",
							email: "user1@example.com",
							name: "John Doe",
							autodeskId: "autodesk-1",
							status: "active",
						},
						{
							id: "user-2",
							email: "user2@example.com",
							name: "Jane Smith",
							autodeskId: "autodesk-2",
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
			`${BASE_URL}/construction/admin/v1/projects/${PROJECT_ID}/users?offset=2`,
			{
				data: {
					results: [
						{
							id: "user-3",
							email: "user3@example.com",
							name: "Bob Johnson",
							autodeskId: "autodesk-3",
							status: "pending",
						},
						{
							id: "user-4",
							email: "user4@example.com",
							name: "Alice Brown",
							autodeskId: "autodesk-4",
							status: "active",
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

		const users = [];
		for await (const user of client.projectUsers.listProjectUsers(PROJECT_ID)) {
			users.push(user);
		}

		expect(users.length).toBeGreaterThanOrEqual(2);
		expect(users[0].email).toBe("user1@example.com");
		expect(users[0].name).toBe("John Doe");
		mock.reset();
	});
});
