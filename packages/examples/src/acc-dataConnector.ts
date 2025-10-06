import { DataConnectorClient } from "@adsk-platform/acc-dataconnector";

const accountId = "your_account_id"; // Replace with your account ID

// Create a resilient httpclient (with retry, rate limit handling)
// 1. Create your function to get the access token. See also @adsk-platform/authentication
const getToken = () => Promise.resolve("your_access_token");

// 2. Create the client
const client = new DataConnectorClient(getToken);

// Get list of groups
// The code reflects the API structure
// https://developer.api.autodesk.com/data-connector/v1/accounts/:accountId/requests?limit=2
const resp = await client?.api.accounts.byAccountId(accountId).requests.get({
	queryParameters: {
		limit: 2,
	},
});

// output:
// Request: Get Issues => (ce9bc188-1e18-11eb-adc1-0242ac120002)
// Request: List Files => (f9abf4c8-1f51-4b26-a6b7-6ac0639cb138)
for (const request of resp?.results || []) {
	console.log(`Request: ${request.description} => (${request.id})`);
}
