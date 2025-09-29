# Autodesk Vault Data SDK for TypeScript

This SDK provides TypeScript bindings for the Autodesk Vault Data API.

## Installation

```bash
npm install @adsk-platform/vaultdata
```

## Usage

```typescript
import { createClientWithVaultUserAccount } from "@adsk-platform/vaultdata";

const vaultServer ="localhost"; // Your Vault server hostname
const vault = "Vault"; // Your Vault name
const userName = "Administrator"; // Your Vault username
const password = ""; // Your Vault password
const isHttps = false; // Set to true if using HTTPS

// Create a client using a Vault user account
const client = createClientWithVaultUserAccount( vaultServer, vault,userName, password,isHttps);

// Get list of groups
const vaults = await vaultClient.api.groups.get();

```

## License

MIT
