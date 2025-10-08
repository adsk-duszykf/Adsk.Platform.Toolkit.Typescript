import { describe, expect, it } from "bun:test";
import { useFetchMock } from "bun-fetch-mock";
import { AccountAdminClient } from "../src/accountAdminClient.js";

const BASE_URL = "https://developer.api.autodesk.com";
const ACCOUNT_ID = "f9a8b7c6-d5e4-43f2-a1b0-c9d8e7f6a5b5";
const COMPANY_ID = "f9a8b7c6-d5e4-43f2-a1b0-c9d8e7f6a5b6";

describe("CompaniesManager", () => {
	const mock = useFetchMock({ baseUrl: BASE_URL });
	const getToken = async () => "test-token";
	const client = new AccountAdminClient(getToken);

	it("should list companies", async () => {
		mock.get(`${BASE_URL}/hq/v1/accounts/${ACCOUNT_ID}/companies`, {
			data: {
				id: COMPANY_ID,
				account_id: ACCOUNT_ID,
				name: "Test Company",
				trade: "General Contractor",
				address_line_1: "123 Main St",
				city: "New York",
				state_or_province: "NY",
				postal_code: "10001",
				country: "US",
				phone: "555-1234",
			},
			status: 200,
		});

		const result = await client.companies.listCompanies(ACCOUNT_ID);

		expect(result).toBeDefined();
		expect(result?.name).toBe("Test Company");
		expect(result?.trade).toBe("General Contractor");
		mock.reset();
	});
});
