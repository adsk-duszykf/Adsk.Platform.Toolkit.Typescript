import { describe, expect, it } from "bun:test";
import { useFetchMock } from "bun-fetch-mock";
import { AccountAdminClient } from "../src/accountAdminClient.js";

const BASE_URL = "https://developer.api.autodesk.com";
const ACCOUNT_ID = "f9a8b7c6-d5e4-43f2-a1b0-c9d8e7f6a5b5";
const BU_ID = "f9a8b7c6-d5e4-43f2-a1b0-c9d8e7f6a5b8";

describe("BusinessUnitsManager", () => {
	const mock = useFetchMock({ baseUrl: BASE_URL });
	const getToken = async () => "test-token";
	const client = new AccountAdminClient(getToken);

	it("should get business units", async () => {
		mock.get(
			`${BASE_URL}/hq/v1/accounts/${ACCOUNT_ID}/business_units_structure`,
			{
				data: {
					business_units: [
						{
							id: BU_ID,
							account_id: ACCOUNT_ID,
							name: "West Region",
							parent_id: null,
							path: "West Region",
							description: "Western regional office",
							created_at: "2024-01-01T10:00:00Z",
							updated_at: "2024-01-01T10:00:00Z",
						},
					],
				},
				status: 200,
			},
		);

		const result = await client.businessUnits.getBusinessUnits(ACCOUNT_ID);

		expect(result).toBeDefined();
		expect(result?.businessUnits).toBeDefined();
		expect(result?.businessUnits?.length).toBeGreaterThan(0);
		expect(result?.businessUnits?.[0].name).toBe("West Region");
		mock.reset();
	});
});
