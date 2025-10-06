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