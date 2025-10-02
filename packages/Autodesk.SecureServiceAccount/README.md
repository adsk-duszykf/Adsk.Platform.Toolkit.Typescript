# Autodesk Secure Service Account SDK for TypeScript

This SDK provides TypeScript bindings for the [Autodesk Secure Service Account API](https://aps.autodesk.com/en/docs/ssa/v1/developers_guide/overview/). The Secure Service Account API allows you to create and manage service accounts, handle JWT-based authentication, create and manage service account keys, and exchange JWT assertions for access tokens.

## Installation

```bash
npm install @adsk-platform/secure-service-account
```

## Usage

```typescript
import { SecureServiceAccountClient } from "@adsk-platform/secure-service-account";

// Function to get your access token
async function getAccessToken(): Promise<string> {
  // Return your APS access token here
  // This should be a valid Bearer token with appropriate scopes
  return "your-access-token";
}

// Create a client instance
const client = new SecureServiceAccountClient(getAccessToken);

// Get all service accounts
const serviceAccounts = await client.api.serviceAccounts.get();
console.log("Service accounts:", serviceAccounts?.serviceAccounts);

// Create a new service account
const createRequest = {
  name: "my-service-account",
  firstName: "Service",
  lastName: "Account"
};
const newServiceAccount = await client.api.serviceAccounts.post(createRequest);
console.log("Created service account:", newServiceAccount);

// Create a key for a service account
const serviceAccountId = "your-service-account-id";
const keyResponse = await client.api.serviceAccounts.byServiceAccountId(serviceAccountId).keys.post({});
console.log("Created key:", keyResponse);

// Exchange JWT for access token
const tokenRequest = {
  grantType: "urn:ietf:params:oauth:grant-type:jwt-bearer",
  assertion: "your-jwt-assertion",
  scope: "data:read"
};
const tokenResponse = await client.api.token.post(tokenRequest);
console.log("Access token:", tokenResponse?.accessToken);
```

## API Reference

The `SecureServiceAccountClient` provides two main interfaces:

- **`client.api`**: Direct access to the Secure Service Account API endpoints
- **`client.helper`**: High-level helper methods for common operations

### Helper Methods

The helper provides convenient methods for common operations (currently empty, ready for extension).

## Authentication

This SDK requires a valid APS (Autodesk Platform Services) access token with appropriate scopes. The token should be obtained through the [APS Authentication API](https://aps.autodesk.com/developer/overview/authentication-api).

Required scopes may include:

- `application:service_account:read` - Read access to account information
- `application:service_account:write` - Write access for managing service accounts and keys
- `application:service_account_key:read` - Read access to service account data
- `application:service_account_key:write` - Write access for service account operations

### Service Account Authentication Flow

Service accounts use JWT-based authentication:

1. Create a service account using your application credentials
2. Generate a key pair for the service account
3. Create a JWT assertion signed with the private key
4. Exchange the JWT assertion for an access token using the `/token` endpoint
5. Use the access token for subsequent API calls

## Key Features

- Create and manage service accounts
- Generate and manage service account keys
- JWT-based authentication flow
- Exchange JWT assertions for access tokens
- Manage service account status (enable/disable)
- Key status management

## License

MIT
