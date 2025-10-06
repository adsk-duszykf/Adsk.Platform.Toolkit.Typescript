import type { HttpClient } from "@microsoft/kiota-http-fetchlibrary";
import type { BaseDataConnectorClient } from "./generatedCode/baseDataConnectorClient.js";
import type { DataRequest } from "./generatedCode/models/index.js";

export class DataConnectorClientHelper {
	constructor(
		private readonly api: BaseDataConnectorClient,
		private readonly httpClient?: HttpClient,
	) {}

	async *getAllRequests(accountId: string): AsyncIterableIterator<DataRequest> {
		const pageSize = 20; // Adjust based on API limits
		const getRequests = async (
			offset: number,
			pageSize: number,
		): Promise<DataRequest[]> => {
			const page = await this.api.accounts
				.byAccountId(accountId)
				.requests.get({ queryParameters: { offset, limit: pageSize } });
			return page?.results ?? [];
		};

		yield* this.getMultiPageResultsWithOffset(getRequests, pageSize);
	}

	/**
	 * Version that uses offset/limit pagination
	 * @param getPage Function that takes offset and limit and returns page data
	 * @param pageSize Number of items per page
	 * @returns AsyncIterableIterator that yields each page of results
	 */
	async *getMultiPageResultsWithOffset<T>(
		getPage: (offset: number, limit: number) => Promise<T[]>,
		pageSize: number,
	): AsyncIterableIterator<T> {
		let offset = 0;
		let hasMore = true;

		while (hasMore) {
			const page = await getPage(offset, pageSize);

			if (page && page.length > 0) {
				for (const item of page) {
					yield item;
				}
				offset += page.length;
				hasMore = page.length === pageSize; // Assume no more data if less than pageSize
			} else {
				hasMore = false;
			}
		}
	}
}
