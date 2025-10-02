# Autodesk Secure Service Account SDK for TypeScript

This SDK provides TypeScript bindings for the [Autodesk Secure Service Account API](https://aps.autodesk.com/en/docs/ssa/v1/developers_guide/overview/). The Secure Service Account API allows you to create and manage service accounts, handle JWT-based authentication, create and manage service account keys, and exchange JWT assertions for access tokens.

## Installation

```bash
npm install @adsk-platform/secure-service-account
```

## Usage

```typescript
import { SecureServiceAccountClient } from '@adsk-platform/secure-service-account';
import { type ServiceAccountInfo } from '@adsk-platform/secure-service-account/models';

// Create a resilient httpclient (with retry, rate limit handling)
// 1. Create your function to get the access token. See also @adsk-platform/authentication
const getToken = () => Promise.resolve("your_access_token");

// 2. Create the client
const client = new SecureServiceAccountClient(getToken);

// 3. Create a service account
const serviceAccountInfo: ServiceAccountInfo = {
    firstName: "service",
    lastName: "acme.europe.sales-reports",
    name: "service.acme.europe.sales-reports"
};

// Use helper method to create the service account and the key (wrap 2 API calls)
const serviceAccount = await client?.helper.createSecureServiceAccount(serviceAccountInfo);

// Output:
// Service Account Email: service.acme.europe.sales-reports@@Ycw2Us...NtPvTXwGu.adskserviceaccount.com
console.log(`Service Account Email: ${serviceAccount?.account.email}`);

// Output:
// Service Account private Key : "-----BEGIN RSA PRIVATE KEY-----\nMIIEow.... ....gvjNX\n-----END RSA PRIVATE KEY-----\n"
console.log(`Service Account private Key : ${serviceAccount?.key.privateKey}`);

// 4. Generate 3-legged token for the service account
// Use helper method to generate the JWT and get the token 
const authToken= await client?.helper.getServiceAccountThreeLeggedToken(
    "your_client_id",
    serviceAccount?.account.serviceAccountId, ["data:read", "data:write"],
    serviceAccount?.key
);

// Output:
// 3-legged token: eyJ....
console.log(`3-legged token: ${authToken?.accessToken}`);

// 5. Get service account details
// The code reflects the API structure
// GET https://developer.api.autodesk.com/authentication/v2/service-accounts/:serviceAccountId
const accountDetails = await client?.api.serviceAccounts.byServiceAccountId(serviceAccount?.account.serviceAccountId).get();

// Output:
// Service Account ID: 2a3b4c5d-6e7f-8g9h-0i1j-2k3l4m5n6o7p, status: ENABLED
console.log(`Service Account ID: ${accountDetails?.serviceAccountId}, status: ${accountDetails?.status}`);

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
