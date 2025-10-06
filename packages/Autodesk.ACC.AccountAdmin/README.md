# Autodesk Construction Cloud (ACC) - Account Admin SDK for TypeScript

This SDK provides TypeScript bindings for the [Autodesk Construction Cloud (ACC) Account Admin API](https://aps.autodesk.com/en/docs/acc/v1/tutorials/admin/admin-create-configure-projects/). The Account Admin API allows you to manage accounts, projects, users, companies, and other administrative resources in ACC.

## Installation

```bash
npm install @adsk-platform/acc-accountadmin
```

## Usage

```typescript
import { AccountAdminClient } from "@adsk-platform/acc-accountadmin";

const accountId = "your_account_id"; // Replace with your account ID

// Create a resilient httpclient (with retry, rate limit handling)
// 1. Create your function to get the access token. See also @adsk-platform/authentication
const getToken = () => Promise.resolve("your_access_token");

// 2. Create the client
const client = new AccountAdminClient(getToken);


// Get a project by name
// The code reflects the API structure
// GET https://developer.api.autodesk.com/construction/admin/v1/accounts/:accountId/projects?filter[name]=myproject
const resp = await client?.api.construction.admin.v1.accounts.byAccountId(accountId).projects.get(
    {queryParameters: {filtername:"My Project"}});

// output:
// Result: My Project => (Paris)
if (resp?.results && resp.results.length > 0)
    console.log(`Result: ${resp?.results[0].name} => (${resp?.results[0].city})`);
else
    console.log("No project found");
```

## API Reference

The `AccountAdminClient` provides two main interfaces:

- **`client.api`**: Direct access to the Account Admin API endpoints
- **`client.helper`**: High-level helper methods for common operations (coming soon)

### Helper Methods

The helper provides convenient methods for common operations (implementation in progress)

## Authentication

This SDK requires a valid APS (Autodesk Platform Services) access token with appropriate scopes. The token should be obtained through the [APS Authentication API](https://aps.autodesk.com/developer/overview/authentication-api).

Required scopes may include:

- `account:read` - Read access to account data
- `account:write` - Write access to account data
- Additional scopes depending on the specific operations you need to perform

## Documentation

For more information about the ACC Account Admin API, refer to:
- [ACC Account Admin API Documentation](https://aps.autodesk.com/en/docs/acc/v1/overview/account-admin/)
- [BIM 360 Account Admin API Documentation](https://aps.autodesk.com/en/docs/bim360/v1/overview/account-admin/)

## Repository

This package is part of the [APS SDK Kiota](https://github.com/adsk-duszykf/Adsk.Platform.Toolkit.Typescript) project.

## License

MIT
