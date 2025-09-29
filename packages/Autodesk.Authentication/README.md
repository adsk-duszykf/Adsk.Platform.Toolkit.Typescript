# Autodesk Authentication SDK for TypeScript

This package provides authentication utilities for Autodesk Platform Services (APS) in TypeScript projects.

This package is intended for improving developer experience :

- Wrapping low-level API calls with code that reflects the API url. See [Usage section below for examples](#usage)

- Providing a set of function for common use cases that would otherwise require multiple API calls

## Installation

```sh
npm install @adsk-platform/authentication
```

## Usage

### With the Autodesk API

``` typescript

// Assuming this endpoit: GET https://myservice.com/todos/{todoId}
// The code, looks like this:
const resp=client.todos

```


```typescript
async function GetTwoLeggedAuthTokenWithAPI( clientId: string, clientSecret: string ):Promise<string> {
    const client = new AuthenticationClient();
    
    const credentials=client.helper.createAuthorizationString(clientId,clientSecret)
    const resp = await client.api.authentication.v2.token.post(
        {
            grantType: "client_credentials",
            scope: "data:read data:write"
        },
        { headers: { "Authorization": credentials } }
    );

    if (!resp?.accessToken) {
        throw new Error("No token received");
    }

    return resp.accessToken;
}
```

### Using helper functions

```typescript
import { AuthenticationClient } from '@adsk-platform/authentication';

const client = new AuthenticationClient({ /* options */ });

const clientId = 'your_client_id';
const clientSecret = 'your_client_secret';
const scopes = ['data:read', 'data:write'];
const tokenStore= new InMemoryTokenStore(); // or your custom implementation

// Helper function
const tokenResponse = await client.createTwoLeggedAutoRefreshToken(clientId, clientSecret, scopes, tokenStore);
```

## Helper Functions

The SDK provides several convenience helper functions through the `AuthenticationClientHelper` class:

### Token Management

- **`getTwoLeggedToken(clientId, clientSecret, scopes)`** - Creates a fresh 2-legged token
- **`createTwoLeggedAutoRefreshToken(clientId, clientSecret, scopes, tokenStore)`** - Creates an auto-refreshing 2-legged token function
- **`refreshThreeLeggedToken(clientId, clientSecret, refreshToken, scopes?)`** - Refreshes a 3-legged token

### Authentication URLs

- **`createAuthenticationUrl(clientId, redirectUri, scopes, nonce?, state?, forceLogin?)`** - Creates URL for Autodesk login page (3-legged auth)
- **`createPKCEAuthenticationUrl(clientId, redirectUri, scopes, codeChallenge, nonce?, state?, forceLogin?)`** - Creates URL for PKCE authentication

### User Information

- **`getUserInfoAsync(threeLeggedToken)`** - Retrieves user profile information using a 3-legged token

### Utility Functions

- **`createAuthorizationString(clientId, clientSecret)`** - Creates Base64 encoded authorization header
- **`extractCodeFromUrl(url)`** - Extracts authorization code from callback URL
- **`isValidToken(authToken)`** - Checks if a token is valid and not expired
- **`createScopeString(scopes)`** - Converts scope array to space-separated string

## Features

- Easy integration with Autodesk authentication endpoints
- TypeScript type definitions included
- Modern ES and UMD builds

## Documentation

Refer to the API documentation and examples in the source code for more details.

## License

MIT
