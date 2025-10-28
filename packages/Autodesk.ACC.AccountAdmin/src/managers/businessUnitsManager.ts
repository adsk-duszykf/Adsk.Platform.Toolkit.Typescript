import type { ApiRequestBuilder } from "../accountAdminClient.js";
import type {
	Business_units_structureGetResponse,
	Business_units_structurePutRequestBody,
	Business_units_structurePutResponse,
} from "../generatedCode/hq/v1/accounts/item/business_units_structure/index.js";

/**
 * Manager for Business Units operations (BIM360)
 */
export class BusinessUnitsManager {
	constructor(private readonly api: ApiRequestBuilder) {}

	/**
	 * Query all the business units in a specific BIM 360 account.
	 *
	 * @param accountId - The account ID of the business unit
	 * @returns Business units structure
	 */
	async getBusinessUnits(
		accountId: string,
	): Promise<Business_units_structureGetResponse> {
		const result = await this.api.hq.v1.accounts
			.byAccount_id(accountId)
			.business_units_structure.get();

		if (!result) {
			throw new Error("Unexpected null response");
		}

		return result;
	}

	/**
	 * Creates or redefines the business units of a specific BIM 360 account.
	 *
	 * @param accountId - The account ID of the business unit
	 * @param businessUnitsData - The business units structure data
	 * @returns Updated business units structure
	 */
	async updateBusinessUnits(
		accountId: string,
		businessUnitsData: Business_units_structurePutRequestBody,
	): Promise<Business_units_structurePutResponse> {
		const result = await this.api.hq.v1.accounts
			.byAccount_id(accountId)
			.business_units_structure.put(businessUnitsData);

		if (!result) {
			throw new Error("Unexpected null response");
		}

		return result;
	}
}
