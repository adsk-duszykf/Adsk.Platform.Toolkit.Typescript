import { createClientWithVaultUserAccount } from "@adsk-platform/vaultdata";

// Vault connection with a Vault user account
// The client wraps the @adsk-platform/httpclient
const client = createClientWithVaultUserAccount(
    "localhost",
    "vault",
    "administrator",
    "",
    false);

// Get list of groups
// The code reflects the API structure 
// https://{VaultServerAddress}/AutodeskDM/Services/api/vault/v2?limit=2
const resp = await client?.api.groups.get({
    queryParameters: {
        limit: 2
    }
});

// output:
// Group: Administrators (1)
// Group: Users (2)
for (const group of resp?.results || []) {
    console.log(`Group: ${group.name} (${group.id})`);
}
