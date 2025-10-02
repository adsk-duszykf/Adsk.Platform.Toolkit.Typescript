# Autodesk Construction Cloud (ACC) - Data Connector SDK for TypeScript

This SDK provides TypeScript bindings for the [Autodesk Construction Cloud (ACC) Data Connector API](https://aps.autodesk.com/en/docs/acc/v1/tutorials/data-connector/dc-tutorial-submit-data-request/). The ACC Data Connector API allows you to extract data from ACC/BIM 360 accounts and projects, create and manage data requests, monitor jobs, and retrieve extracted data files.

## Installation

```bash
npm install @adsk-platform/acc-dataconnector
```

## Usage

```typescript
import { DataConnectorClient } from "@adsk-platform/acc-dataconnector";

// Function to get your access token
async function getAccessToken(): Promise<string> {
  // Return your APS access token here
  // This should be a valid Bearer token with appropriate scopes
  return "your-access-token";
}

// Create a client instance
// ** The underlying HTTP client is resilient with retries and rate limit handling see @adsk-platform/http-client package **
const client = new DataConnectorClient(getAccessToken);

const accountId = "your-account-id"; // Replace with your ACC account ID

// Get all data requests for an account
// ** The code reflects the endpoint: GET https://{baseUrl}/accounts/:accountId/requests **
const requests = await client.api.accounts.byAccountId(accountId).requests.get();

// ** Responses are strongly typed **

// Output:
// Request: Monthly Project Data Export
console.log("Data requests:", requests[0].description);

// ** Use helper methods for paginated results **
// Output:
// Request: Monthly Project Data Export
// Request: Weekly Project Data Export
// ...(the API returns paginated results, the helper fetches all pages)
for await (const request of client.helper.getAllRequests(accountId)) {
  console.log("Request:", request.description);
}
```

## API Reference

The `DataConnectorClient` provides two main interfaces:

- **`client.api`**: Direct access to the Data Connector API endpoints
- **`client.helper`**: High-level helper methods for common operations

### Helper Methods

The helper provides convenient methods for:

- `getAllRequestsAsync(accountId)`: Paginated retrieval of all data requests

## Authentication

This SDK requires a valid APS (Autodesk Platform Services) access token with appropriate scopes. The token should be obtained through the [APS Authentication API](https://aps.autodesk.com/developer/overview/authentication-api).

Required scopes may include:

- `data:read` - Read access to account/project data
- `data:write` - Write access for creating data requests
- `data:create` - Create access for data extraction jobs

## License

MIT
