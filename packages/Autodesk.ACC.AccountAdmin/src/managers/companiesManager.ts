import type { ApiRequestBuilder } from "../accountAdminClient.js";
import type {
	ImportPostRequestBody,
	ImportPostResponse,
} from "../generatedCode/bim/hq/v1/accounts/item/companies/importEscaped/index.js";
import type {
	CompaniesGetResponse,
	CompaniesPostRequestBody,
	CompaniesPostResponse,
} from "../generatedCode/bim/hq/v1/accounts/item/companies/index.js";
/**
 * Manager for Companies operations (BIM360)
 */
export class CompaniesManager {
	constructor(private readonly api: ApiRequestBuilder) {}

	/**
	 * Query all the partner companies in a specific BIM 360 account.
	 *
	 * @param accountId - The account ID of the company
	 * @returns Company data
	 */
	async listCompanies(
		accountId: string,
	): Promise<CompaniesGetResponse | undefined> {
		const result = await this.api.hq.v1.accounts
			.byAccount_id(accountId)
			.companies.get();

		return result;
	}

	/**
	 * Create a new partner company.
	 *
	 * @param accountId - The account ID
	 * @param companyData - The company creation data
	 * @returns The created company information
	 */
	async createCompany(
		accountId: string,
		companyData: CompaniesPostRequestBody,
	): Promise<CompaniesPostResponse | undefined> {
		const result = await this.api.hq.v1.accounts
			.byAccount_id(accountId)
			.companies.post(companyData);

		return result;
	}

	/**
	 * Bulk import partner companies to the company directory in a specific BIM 360 account.
	 * Maximum 50 companies per call.
	 *
	 * @param accountId - The account ID
	 * @param companies - Array of companies to import (max 50)
	 * @returns Import result with success and failure counts
	 */
	async importCompanies(
		accountId: string,
		companies: ImportPostRequestBody,
	): Promise<ImportPostResponse> {
		const result = await this.api.hq.v1.accounts
			.byAccount_id(accountId)
			.companies.importEscaped.post(companies);

		if (!result) {
			throw new Error("Unexpected null response");
		}

		return result;
	}
}
