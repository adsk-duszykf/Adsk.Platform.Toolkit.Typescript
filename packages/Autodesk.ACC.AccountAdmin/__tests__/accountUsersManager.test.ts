import { describe, expect, it } from "bun:test";
import { useFetchMock } from "bun-fetch-mock";
import { AccountAdminClient } from "../src/accountAdminClient.js";

const BASE_URL = "https://developer.api.autodesk.com";
const ACCOUNT_ID = "f9a8b7c6-d5e4-43f2-a1b0-c9d8e7f6a5b5";
const USER_ID = "f9a8b7c6-d5e4-43f2-a1b0-c9d8e7f6a5b7";

describe("AccountUsersManager", () => {
	const mock = useFetchMock({ baseUrl: BASE_URL });
	const getToken = async () => "test-token";
	const client = new AccountAdminClient(getToken);

	it("should get a user", async () => {
		mock.get(`${BASE_URL}/hq/v1/accounts/${ACCOUNT_ID}/users/${USER_ID}`, {
			data: {
				id: USER_ID,
				account_id: ACCOUNT_ID,
				email: "test@example.com",
				name: "Test User",
				first_name: "Test",
				last_name: "User",
				role: "account_user",
				status: "active",
				company_id: "company-123",
				company_name: "Test Company",
			},
			status: 200,
		});

		const result = await client.accountUsers.getUser(ACCOUNT_ID, USER_ID);

		expect(result).toBeDefined();
		expect(result?.id).toBe(USER_ID);
		expect(result?.email).toBe("test@example.com");
		expect(result?.name).toBe("Test User");
		mock.reset();
	});
});
