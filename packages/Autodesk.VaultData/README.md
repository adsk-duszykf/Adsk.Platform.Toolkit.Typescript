# Autodesk Vault Data SDK for TypeScript

This SDK provides TypeScript bindings for the [Autodesk Vault Data API](https://aps.autodesk.com/en/docs/vaultdataapi/v2/developers_guide/overview/). The Vault Data API provides access to the Vault database, offering operations for files, folders, items, change orders, search, and more.

## Installation

```bash
npm install @adsk-platform/vaultdata
```

## Usage

```typescript
/**
 * Vault Data API Example
 * 
 * This example demonstrates how to use the Autodesk Vault Data API SDK
 * to interact with Vault Server for file management, item tracking, BOM,
 * search, and user management.
 * 
 * =============================================================================
 * AUTHENTICATION METHODS
 * =============================================================================
 * 
 * This SDK simplifies the process of initializing the client in THREE different ways:
 * 
 * 1. 🔐 Vault User Account (username/password)
 *    - Use: createClientWithVaultUserAccount(server, vault, user, pass)
 *    - Best for: Simple scripts, internal tools, automation
 * 
 * 2. 🪟 Windows Account (integrated authentication)
 *    - Use: createClientWithWindowsAccount(server, vault)
 *    - Best for: Corporate environments with Active Directory
 * 
 * 3. ☁️ Autodesk User Account (3-legged OAuth)
 *    - Use: new VaultClient(getToken, server)
 *    - Best for: Web apps, mobile apps, cloud services
 *    - Requires: OAuth flow with scopes: data:read, data:write, data:create
 * 
 * See Example 1 below for detailed implementation of all four methods.
 * 
 * =============================================================================
 * WHAT'S COVERED
 * =============================================================================
 * 
 * • Example 1: Client Initialization (all 3 auth methods)
 * • Example 2: Files and Folders (browsing, search, dependencies)
 * • Example 3: Items and BOM (item management, bill of materials)
 * • Example 4: Search (basic and advanced search)
 * • Example 5: User Management (users, groups, roles)
 * • Example 6: Property Definitions (file and item properties)
 * • Example 7: Change Orders (CO management and entities)
 * 
 * =============================================================================
 */

import {
 VaultClient,
 createClientWithVaultUserAccount,
 createClientWithWindowsAccount
} from "@adsk-platform/vaultdata";

// =============================================================================
// CONFIGURATION
// =============================================================================
const VAULT_SERVER = "http://localhost"; // or https://your-vault-server or https://12345678.vg.autodesk.com
const VAULT_NAME = "Vault";
const USERNAME = "administrator";
const PASSWORD = "";

// =============================================================================
// Example 1: Client Initialization - Three Authentication Methods
// =============================================================================
async function clientInitializationExample() {
 console.log("\n=== Client Initialization - Multiple Authentication Methods ===\n");

 // -------------------------------------------------------------------------
 // Method 1: Vault User Account (username/password)
 // -------------------------------------------------------------------------
 console.log("1️⃣  Vault User Account Authentication:");
 console.log("   Use this when connecting with a Vault native user account\n");

 const vaultUserClient = createClientWithVaultUserAccount(
  VAULT_SERVER,      // Vault server URL
  VAULT_NAME,        // Knowledge Vault name
  USERNAME,          // Vault username
  PASSWORD,          // Vault password
  "VaultExample"     // Optional: App code for audit logging
 );

 // Test the connection
 const serverInfo = await vaultUserClient.informational.getServerInfo();
 console.log(`   ✓ Connected to: ${serverInfo.name} v${serverInfo.productVersion}\n`);

 // -------------------------------------------------------------------------
 // Method 2: Windows Account (integrated Windows authentication)
 // -------------------------------------------------------------------------
 console.log("2️⃣  Windows Account Authentication:");
 console.log("   Use this for Windows integrated authentication\n");

 const windowsUserClient = createClientWithWindowsAccount(
  VAULT_SERVER,      // Vault server URL
  VAULT_NAME,        // Knowledge Vault name
  "VaultExample"     // Optional: App code for audit logging
 );

 // Note: Windows authentication requires the request to come from a Windows
 // environment with valid credentials. This may not work in all environments.
 try {
  const winServerInfo = await windowsUserClient.informational.getServerInfo();
  console.log(`   ✓ Connected with Windows auth: ${winServerInfo.name}\n`);
 } catch (error) {
  console.log("   ⚠ Windows authentication not available in this environment\n");
 }

 // -------------------------------------------------------------------------
 // Method 3: Autodesk User Account (3-legged OAuth with APS)
 // -------------------------------------------------------------------------
 console.log("3️⃣  Autodesk User Account Authentication (APS OAuth):");
 console.log("   Use this when your Vault is federated with Autodesk accounts\n");

 // Create a token provider function that returns a 3-legged OAuth token
 // In a real application, you would:
 // 1. Implement the OAuth 3-legged flow to get user authorization
 // 2. Exchange the authorization code for an access token
 // 3. Store and refresh the token as needed

 const getAutodeskToken = async (): Promise<string> => {
  // Example: This would typically call your OAuth token endpoint
  // or use the APS Authentication API

  // For demonstration, we'll show the structure:
  // In production, implement proper OAuth flow:
  // - Redirect user to: https://developer.api.autodesk.com/authentication/v2/authorize
  // - Get authorization code
  // - Exchange for token at: https://developer.api.autodesk.com/authentication/v2/token

  // Required OAuth scopes for Vault Data API:
  // - data:read (for read operations)
  // - data:write (for write operations)
  // - data:create (for create operations)

  // Return your 3-legged OAuth access token
  // return "your_3_legged_oauth_token_here";

  // For this example, we'll throw an error since we don't have a real token
  throw new Error("3-legged OAuth token not configured. Implement OAuth flow in production.");
 };

 // Create client with Autodesk authentication
 const autodeskClient = new VaultClient(getAutodeskToken, VAULT_SERVER);

 console.log("   📝 Token Provider Function configured");
 console.log("   📋 Required OAuth Scopes: data:read, data:write, data:create");
 console.log("   🔗 OAuth Authorization: https://developer.api.autodesk.com/authentication/v2/authorize");
 console.log("   🔗 Token Exchange: https://developer.api.autodesk.com/authentication/v2/token\n");

 try {
  // This will fail unless you have a valid 3-legged OAuth token
  await autodeskClient.informational.getServerInfo();
 } catch (error) {
  console.log("   ⚠ OAuth token not provided - implement OAuth flow for production use\n");
 }


 // -------------------------------------------------------------------------
 // Summary and Recommendations
 // -------------------------------------------------------------------------
 console.log("📌 Which method should you use?");
 console.log("   • Vault User Account: Simple scripts, internal tools");
 console.log("   • Windows Account: Corporate environments with AD integration");
 console.log("   • Autodesk OAuth: Web apps, mobile apps, cloud services");

 return vaultUserClient; // Return a client for use in other examples
}

// =============================================================================
// Example 2: Working with Files and Folders
// =============================================================================
async function filesAndFoldersExample() {
 console.log("\n=== Files and Folders Example ===\n");

 const client = createClientWithVaultUserAccount(VAULT_SERVER, VAULT_NAME, USERNAME, PASSWORD);

 // Get list of vaults to get vault ID
 let vaultId = "1";
 for await (const vault of client?.informational.getVaults() || []) {
  vaultId = vault.id?.toString() || "1";
  break; // Get first vault
 }
 console.log(`Working with Vault ID: ${vaultId}`);

 // Get root folder contents
 console.log("\n📁 Root Folder Contents:");
 let count = 0;
 for await (const item of client?.filesAndFolders.getFolderContents(vaultId, 'root', { limit: 5 }) || []) {
  // Check if it's a folder by checking for folderType property (Folder/FolderExtended have this)
  const icon = ('fullName' in item) ? '📁' : '📄';
  console.log(`  ${icon} ${item.name}`);
  count++;
  if (count >= 5) break;
 }

 // Search for file versions
 console.log("\n🔍 Searching for files:");
 const fileVersions: Array<{ id?: string | null; name?: string | null; version?: number | null; state?: string | null }> = [];
 count = 0;
 for await (const file of client?.filesAndFolders.getFileVersions(vaultId, { q: '', limit: 3 }) || []) {
  console.log(`  📄 ${file.name} (Version ${file.version}, State: ${file.state})`);
  fileVersions.push(file);
  count++;
  if (count >= 3) break;
 }

 // Get file dependencies (if files exist)
 if (fileVersions.length > 0) {
  const fileId = fileVersions[0].id?.toString();
  if (fileId) {
   console.log(`\n🔗 Dependencies for: ${fileVersions[0].name}`);
   let hasDeps = false;
   count = 0;
   for await (const dep of client?.filesAndFolders.getFileVersionUses(vaultId, fileId) || []) {
    console.log(`  → ${dep.childFile?.name} (${dep.fileAssocType})`);
    hasDeps = true;
    count++;
    if (count >= 3) break;
   }
   if (!hasDeps) {
    console.log("  (No dependencies found)");
   }
  }
 }
}

// =============================================================================
// Example 3: Working with Items and Bill of Materials
// =============================================================================
async function itemsAndBomExample() {
 console.log("\n=== Items and BOM Example ===\n");

 const client = createClientWithVaultUserAccount(VAULT_SERVER, VAULT_NAME, USERNAME, PASSWORD);
 let vaultId = "1";
 for await (const vault of client?.informational.getVaults() || []) {
  vaultId = vault.id?.toString() || "1";
  break;
 }

 // Search for item versions
 console.log("🔍 Searching for items:");
 const itemVersions: Array<{ id?: string | null; number?: string | null; title?: string | null; revision?: string | null }> = [];
 let count = 0;
 for await (const item of client?.items.getItemVersions(vaultId, { limit: 3 }) || []) {
  console.log(`  📦 ${item.number} - ${item.title} (Rev: ${item.revision})`);
  itemVersions.push(item);
  count++;
  if (count >= 3) break;
 }

 // Get Bill of Materials for first item (if exists)
 if (itemVersions.length > 0) {
  const itemId = itemVersions[0].id?.toString();
  if (itemId) {
   console.log(`\n📋 BOM for Item: ${itemVersions[0].number}`);
   const bom = await client?.items.getItemVersionBom(vaultId, itemId);

   if (bom) {
    count = 0;
    for (const bomItem of bom.itemVersions || []) {
     console.log(`  → ${bomItem.number} (Rev: ${bomItem.revision})`);
     count++;
     if (count >= 5) break;
    }
   }

   // Get associated files
   console.log(`\n📄 Associated Files:`);
   const associatedFiles = await client?.items.getItemVersionAssociatedFiles(vaultId, itemId);
   count = 0;
   for (const file of associatedFiles?.results || []) {
    console.log(`  → ${file.file?.name}`);
    count++;
    if (count >= 3) break;
   }
  }
 }
}

// =============================================================================
// Example 4: Search Operations
// =============================================================================
async function searchExample() {
 console.log("\n=== Search Example ===\n");

 const client = createClientWithVaultUserAccount(VAULT_SERVER, VAULT_NAME, USERNAME, PASSWORD);
 let vaultId = "1";
 for await (const vault of client?.informational.getVaults() || []) {
  vaultId = vault.id?.toString() || "1";
  break;
 }

 // Basic search
 console.log("🔍 Basic Search:");
 let count = 0;
 for await (const result of client?.search.search(vaultId, { q: '', limit: 5 }) || []) {
  // Check type of result - files have 'version' property, items have 'number', folders have 'fullName'
  const icon = ('version' in result) ? '📄' : ('number' in result) ? '📦' : '📁';
  const displayName = result.name || ('number' in result ? result.number : '');
  console.log(`  ${icon} ${displayName}`);
  count++;
  if (count >= 5) break;
 }

 // Advanced search with criteria
 console.log("\n🔎 Advanced Search (Files with specific state):");
 try {
  count = 0;
  for await (const result of client?.search.advancedSearch(
   vaultId,
   {
    entityTypesToSearch: ['File'],
    searchCriterias: [
     {
      propertyDefinitionUrl: `/AutodeskDM/Services/api/vault/v2/vaults/${vaultId}/property-definitions/5`, // State property
      operator: 'IsNotEmpty',
     }
    ]
   }
  ) || []) {
   console.log(`  📄 ${result.name}`);
   count++;
   if (count >= 3) break;
  }
 } catch (error) {
  console.log("  (Advanced search may require specific property definitions)");
 }
}

// =============================================================================
// Example 5: User and Group Management
// =============================================================================
async function userManagementExample() {
 console.log("\n=== User and Group Management Example ===\n");

 const client = createClientWithVaultUserAccount(VAULT_SERVER, VAULT_NAME, USERNAME, PASSWORD);

 // Get all users
 console.log("👥 Users:");
 let count = 0;
 for await (const user of client?.accounts.getAllUsers({ limit: 5 }) || []) {
  console.log(`  - ${user.name} (Email: ${user.email || 'N/A'})`);
  count++;
  if (count >= 5) break;
 }

 // Get all groups
 console.log("\n👥 Groups:");
 count = 0;
 for await (const group of client?.accounts.getGroups() || []) {
  console.log(`  - ${group.name} (ID: ${group.id})`);
  count++;
  if (count >= 5) break;
 }

 // Get all roles
 console.log("\n🎭 Roles:");
 count = 0;
 for await (const role of client?.accounts.getRoles({ limit: 5 }) || []) {
  console.log(`  - ${role.description} (ID: ${role.id})`);
  count++;
  if (count >= 5) break;
 }
}

// =============================================================================
// Example 6: Property Definitions
// =============================================================================
async function propertyDefinitionsExample() {
 console.log("\n=== Property Definitions Example ===\n");

 const client = createClientWithVaultUserAccount(VAULT_SERVER, VAULT_NAME, USERNAME, PASSWORD);
 let vaultId = "1";
 for await (const vault of client?.informational.getVaults() || []) {
  vaultId = vault.id?.toString() || "1";
  break;
 }

 // Get file property definitions
 console.log("📝 File Property Definitions:");
 let count = 0;
 for await (const propDef of client?.property.getPropertyDefinitions(vaultId, { limit: 5 }) || []) {
  console.log(`  - ${propDef.displayName} (${propDef.dataType})`);
  count++;
  if (count >= 5) break;
 }

 // Get item property definitions
 console.log("\n📝 Item Property Definitions:");
 count = 0;
 for await (const propDef of client?.property.getPropertyDefinitions(vaultId, { limit: 5 }) || []) {
  console.log(`  - ${propDef.displayName} (${propDef.dataType})`);
  count++;
  if (count >= 5) break;
 }
}

// =============================================================================
// Example 7: Change Orders
// =============================================================================
async function changeOrdersExample() {
 console.log("\n=== Change Orders Example ===\n");

 const client = createClientWithVaultUserAccount(VAULT_SERVER, VAULT_NAME, USERNAME, PASSWORD);
 let vaultId = "1";
 for await (const vault of client?.informational.getVaults() || []) {
  vaultId = vault.id?.toString() || "1";
  break;
 }

 // Get change orders
 console.log("📋 Change Orders:");
 const changeOrders: Array<{ id?: string | null; number?: string | null; title?: string | null; state?: string | null }> = [];
 let count = 0;
 for await (const co of client?.changeOrders.getChangeOrders(vaultId, { limit: 5 }) || []) {
  console.log(`  - ${co.number}: ${co.title} (${co.state})`);
  changeOrders.push(co);
  count++;
  if (count >= 5) break;
 }

 if (changeOrders.length > 0) {
  // Get details for first change order
  const coId = changeOrders[0].id?.toString();
  if (coId) {
   console.log(`\n📎 Associated Entities for CO: ${changeOrders[0].number}`);
   count = 0;
   for await (const entity of client?.changeOrders.getChangeOrderAssociatedEntities(vaultId, coId, { limit: 3 }) || []) {
    const displayName = entity.name || ('number' in entity ? entity.number : '');
    console.log(`  → ${displayName}`);
    count++;
    if (count >= 3) break;
   }
  }
 } else {
  console.log("  (No change orders found)");
 }
}

// =============================================================================
// MAIN EXECUTION
// =============================================================================
async function main() {
 console.log("╔════════════════════════════════════════════════════════════╗");
 console.log("║        Autodesk Vault Data API - Example Suite           ║");
 console.log("╚════════════════════════════════════════════════════════════╝");

 try {
  // Run all examples
  await clientInitializationExample();
  await filesAndFoldersExample();
  await itemsAndBomExample();
  await searchExample();
  await userManagementExample();
  await propertyDefinitionsExample();
  await changeOrdersExample();

  console.log("\n✅ All examples completed successfully!");

 } catch (error) {
  console.error("\n❌ Error running examples:", error);
  if (error instanceof Error) {
   console.error("Message:", error.message);
  }
 }
}

// Run all examples
main();

```

## API Reference

The `VaultClient` provides the following interfaces:

### Manager Classes (High-Level API)

- **`client.informational`**: Server and vault information
  - `getServerInfo()` - Get server version and info
  - `getApiSpec()` - Get OpenAPI specification
  - `getVaults()` - List all knowledge vaults
  - `getVaultById()` - Get specific vault

- **`client.auth`**: Authentication and session management
  - `createSession()` - Create session with Vault credentials
  - `createSessionWithWinAuth()` - Create session with Windows authentication
  - `getSessionById()` - Get current or specific session
  - `deleteSession()` - Logout and delete session

- **`client.accounts`**: Users, groups, roles, and profile attributes
  - `getAllUsers()` - Get all users (requires AdminUserRead permission)
  - `getUserById()` - Get specific user information
  - `getUserAccounts()` - Get user account information
  - `getGroups()` - Get all groups
  - `getRoles()` - Get all roles
  - `getProfileAttributeDefinitions()` - Get profile attribute definitions

- **`client.filesAndFolders`**: File and folder operations
  - `getFolderById()` - Get folder information
  - `getFolderContents()` - Get folder contents with filtering
  - `getFolderSubFolders()` - Get subfolders
  - `getFileVersions()` - Search for file versions
  - `getFileVersionById()` - Get specific file version
  - `getFileVersionContent()` - Download file content
  - `getFileVersionSignedUrl()` - Get signed download URL (expires in 180 seconds)
  - `getFileVersionThumbnail()` - Get file thumbnail
  - `getFileVersionUses()` - Get file dependencies and attachments
  - `getFileVersionWhereUsed()` - Get where-used (parent files)
  - `getFileHistory()` - Get file version history

- **`client.items`**: Item and BOM operations
  - `getItems()` - Get all items
  - `getItemVersions()` - Get item versions with search
  - `getItemVersionById()` - Get specific item version
  - `getItemVersionBom()` - Get Bill of Materials
  - `getItemVersionWhereUsed()` - Get where-used for an item
  - `getItemVersionAssociatedFiles()` - Get file associations
  - `getItemVersionThumbnail()` - Get item thumbnail
  - `getItemHistory()` - Get item version history

- **`client.changeOrders`**: Change order operations
  - `getChangeOrders()` - Get change orders with filtering
  - `getChangeOrderById()` - Get specific change order
  - `getChangeOrderAssociatedEntities()` - Get associated files and items
  - `getChangeOrderRelatedFiles()` - Get all related files
  - `getChangeOrderComments()` - Get comments
  - `getChangeOrderCommentAttachments()` - Get comment attachments

- **`client.search`**: Search operations
  - `search()` - Basic search across properties and content
  - `advancedSearch()` - Advanced search with detailed criteria and sorting

- **`client.property`**: Property definitions
  - `getPropertyDefinitions()` - Get all property definitions
  - `getPropertyDefinitionById()` - Get specific property definition

- **`client.options`**: System and vault options management
  - `getSystemOptions()` - Get system options
  - `createSystemOption()` - Create system option
  - `updateSystemOptionById()` - Update system option
  - `deleteSystemOptionById()` - Delete system option
  - `getVaultOptions()` - Get vault options
  - `createVaultOption()` - Create vault option
  - `updateVaultOptionById()` - Update vault option
  - `deleteVaultOptionById()` - Delete vault option

- **`client.links`**: Link entity operations
  - `getLinks()` - Get all links
  - `getLinkById()` - Get specific link

- **`client.jobs`**: Job queue operations
  - `addJob()` - Add job to queue
  - `getJobQueueEnabled()` - Check if job queue is enabled
  - `getJobById()` - Get job status

### Low-Level API

- **`client.api`**: Direct access to all REST API endpoints using Kiota-generated fluent API

## Authentication

The Vault Data API supports two authentication methods:

### Vault Session Token (Direct Authentication)

Create a session using Vault credentials or Windows authentication:

```typescript
const session = await client.auth.createSession("Vault", "username", "password");
// Or use Windows authentication
const winSession = await client.auth.createSessionWithWinAuth("Vault");
```

The session token format: `V:eyJUaWNrZXQiOiI...`

### APS OAuth Token (Federated Authentication)

If your Vault is configured with Autodesk Account mapping, you can use a 3-legged OAuth token from the [APS Authentication API](https://aps.autodesk.com/developer/overview/authentication-api).

Required OAuth scopes:

- `data:read` - Read access to vault data
- `data:write` - Write access to vault data
- `data:create` - Create operations

## Documentation

For more information about the Vault Data API, refer to:

- [Vault Data API Developer's Guide](https://aps.autodesk.com/en/docs/vaultdataapi/v2/developers_guide/overview/)
- [Vault Data API Reference](https://aps.autodesk.com/en/docs/vaultdataapi/v2/reference/)

## Repository

This package is part of the [APS SDK Kiota](https://github.com/adsk-duszykf/Adsk.Platform.Toolkit.Typescript) project.

## License

MIT
