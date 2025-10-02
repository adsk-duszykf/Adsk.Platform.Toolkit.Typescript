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
