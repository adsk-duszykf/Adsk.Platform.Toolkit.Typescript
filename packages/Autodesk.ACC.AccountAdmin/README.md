# Autodesk Construction Cloud (ACC) - Account Admin SDK for TypeScript

This SDK provides TypeScript bindings for the [Autodesk Construction Cloud (ACC) Account Admin API](https://aps.autodesk.com/en/docs/acc/v1/tutorials/admin/admin-create-configure-projects/). The Account Admin API allows you to manage accounts, projects, users, companies, business units, and other administrative resources in ACC and BIM 360.

## Installation

```bash
npm install @adsk-platform/acc-accountadmin
```

## Usage

### Basic Usage

```typescript
import { AccountAdminClient } from "@adsk-platform/acc-accountadmin";

const accountId = "your_account_id"; // Replace with your account ID

// 1. Create your function to get the access token
// See also @adsk-platform/authentication
const getToken = () => Promise.resolve("your_access_token");

// 2. Create the client
const client = new AccountAdminClient(getToken);
```

### Using Manager Classes (Recommended)

Manager classes provide a clean, high-level API with automatic pagination:

```typescript
// Projects Manager (ACC)
// List all projects with automatic pagination
for await (const project of client.projects.listProjects(accountId)) {
    console.log(`Project: ${project.name} (ID: ${project.id})`);
}

// Create a new project
const newProject = await client.projects.createProject(accountId, {
    name: "My New Project",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    type: "Bridge Construction",
    city: "San Francisco",
    state: "CA",
    country: "US"
});
console.log(`Created project: ${newProject.id}`);

// Get project details
const project = await client.projects.getProject(projectId);

// Project Users Manager (ACC)
// List all users in a project with automatic pagination
for await (const user of client.projectUsers.listProjectUsers(projectId)) {
    console.log(`User: ${user.email} - ${user.name}`);
}

// Add a user to a project
const projectUser = await client.projectUsers.addProjectUser(projectId, {
    email: "user@example.com",
    products: [{
        key: "projectAdministration",
        access: "administrator"
    }],
    companyId: "company-id"
});

// Get specific user details
const user = await client.projectUsers.getProjectUser(projectId, userId);

// Update user information
await client.projectUsers.updateProjectUser(projectId, userId, {
    roleIds: ["role-id-1", "role-id-2"]
});

// Remove user from project
await client.projectUsers.removeProjectUser(projectId, userId);

// Import multiple users at once (up to 200)
const importResult = await client.projectUsers.importProjectUsers(projectId, {
    users: [
        { email: "user1@example.com", products: [...] },
        { email: "user2@example.com", products: [...] }
    ]
});

// Account Users Manager (BIM 360)
// List all users in the BIM 360 account
const accountUsersResponse = await client.accountUsers.listUsers(accountId);
for (const user of accountUsersResponse) {
    console.log(`Account User: ${user.email}`);
}

// Create a new account user
const newUser = await client.accountUsers.createUser(accountId, {
    email: "newuser@example.com",
    firstName: "John",
    lastName: "Doe",
    companyId: "company-id"
});

// Get specific account user
const accountUser = await client.accountUsers.getUser(accountId, userId);

// Import multiple users (max 50)
const userImportResult = await client.accountUsers.importUsers(accountId, {
    users: [
        { email: "user1@example.com", firstName: "Jane", lastName: "Smith" },
        { email: "user2@example.com", firstName: "Bob", lastName: "Johnson" }
    ]
});
console.log(`Imported: ${userImportResult.success} success, ${userImportResult.failure} failed`);

// Companies Manager (BIM 360)
// List all companies in the account
const companiesResponse = await client.companies.listCompanies(accountId);
for (const company of companiesResponse) {
    console.log(`Company: ${company.name}`);
}

// Create a new company
const newCompany = await client.companies.createCompany(accountId, {
    name: "ACME Construction",
    trade: "General Contractor",
    addressLine1: "123 Main St",
    city: "San Francisco",
    stateOrProvince: "CA",
    postalCode: "94105",
    country: "US"
});

// Import multiple companies (max 50)
const companyImportResult = await client.companies.importCompanies(accountId, {
    companies: [
        { name: "Company A", trade: "Electrical" },
        { name: "Company B", trade: "Plumbing" }
    ]
});

// Business Units Manager (BIM 360)
// Get business units structure
const businessUnits = await client.businessUnits.getBusinessUnits(accountId);
console.log(`Business Units: ${JSON.stringify(businessUnits)}`);

// Update business units structure
const updatedUnits = await client.businessUnits.updateBusinessUnits(accountId, {
    businessUnits: [
        { id: "unit-1", name: "Engineering", parentId: null },
        { id: "unit-2", name: "Construction", parentId: "unit-1" }
    ]
});
```

### Using Low-Level API

Direct access to all API endpoints via the fluent API:

```typescript
// List projects (ACC)
const projects = await client.api.construction.admin.v1.accounts
    .byAccountId(accountId)
    .projects.get({
        queryParameters: {
            filtername: "My Project"
        }
    });

// Create a project (ACC)
const newProject = await client.api.construction.admin.v1.accounts
    .byAccountId(accountId)
    .projects.post({
        name: "My New Project",
        startDate: "2024-01-01"
    });

// Get project users (ACC)
const users = await client.api.construction.admin.v1.projects
    .byProjectId(projectId)
    .users.get({
        queryParameters: {
            limit: 100,
            offset: 0
        }
    });

// List companies (BIM 360)
const companies = await client.api.hq.v1.accounts
    .byAccount_id(accountId)
    .companies.get();

// Get business units (BIM 360)
const businessUnits = await client.api.hq.v1.accounts
    .byAccount_id(accountId)
    .business_units_structure.get();
```

## API Reference

The `AccountAdminClient` provides the following interfaces:

### Manager Classes (High-Level API)

#### ACC Managers

- **`client.projects`**: ACC project management with automatic pagination
  - `listProjects()` - Async generator for all projects in an account
  - `createProject()` - Create a new project
  - `getProject()` - Get project details by ID
  
- **`client.projectUsers`**: ACC project user management with automatic pagination
  - `listProjectUsers()` - Async generator for all users in a project
  - `addProjectUser()` - Assign a user to a project
  - `getProjectUser()` - Get specific user details
  - `updateProjectUser()` - Update user information
  - `removeProjectUser()` - Remove user from project
  - `importProjectUsers()` - Bulk import users (up to 200)

#### BIM 360 Managers

- **`client.accountUsers`**: BIM 360 account user management
  - `listUsers()` - Get all users in the account
  - `createUser()` - Create a new user in the member directory
  - `getUser()` - Get specific user details
  - `importUsers()` - Bulk import users (max 50)
  
- **`client.companies`**: BIM 360 company management
  - `listCompanies()` - Get all partner companies
  - `createCompany()` - Create a new company
  - `importCompanies()` - Bulk import companies (max 50)
  
- **`client.businessUnits`**: BIM 360 business units management
  - `getBusinessUnits()` - Get business units structure
  - `updateBusinessUnits()` - Create or redefine business units

### Low-Level API

- **`client.api.construction`**: ACC Construction API endpoints
  - `admin.v1` - Account administration (projects, users)
  - `admin.v2` - Additional admin operations (bulk imports)
  
- **`client.api.hq`**: BIM 360 HQ API endpoints
  - `v1` - Account administration (users, companies, business units)

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
