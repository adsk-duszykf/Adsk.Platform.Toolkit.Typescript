import { AnonymousAuthenticationProvider } from "@microsoft/kiota-abstractions";
import { DefaultRequestAdapter } from "@microsoft/kiota-bundle";
import {
	type BaseVaultDataClient,
	createBaseVaultDataClient,
} from "./generatedCode/baseVaultDataClient.js";
import { VaultClient } from "./vaultClient.js";

/**
 * Create a Vault client with Vault user account
 *
 * @param vaultServerBaseUrl - Base URL of the vault server. Example: https://10.12.125.240, http://localhost
 * @param vault - Name of the vault
 * @param userName - Vault user name
 * @param password - Vault user password
 * @param appCode - Optional app code, used for server side logging
 * @returns Access token generator function
 */
export function createClientWithVaultUserAccount(
	vaultServerBaseUrl: string,
	vault: string,
	userName: string,
	password: string,
	appCode?: string,
) {
	const getToken = getVaultUserAccessTokenGenerator(
		vaultServerBaseUrl,
		vault,
		userName,
		password,
		appCode,
	);

	return new VaultClient(getToken, vaultServerBaseUrl);
}

/**
 * Create a Vault client with Windows account
 *
 * @param vaultServerBaseUrl - Base URL of the vault server. Example: https://10.12.125.240, http://localhost
 * @param vault - Name of the vault
 * @param appCode - Optional app code, used for server side logging
 * @returns Access token generator function
 */
export function createClientWithWindowsAccount(
	vaultServerBaseUrl: string,
	vault: string,
	appCode?: string,
) {
	const getToken = getWindowsUserAccessTokenGenerator(
		vaultServerBaseUrl,
		vault,
		appCode,
	);

	return new VaultClient(getToken, vaultServerBaseUrl);
}

/**
 * Create an anonymous Vault client
 *
 * @param vaultServerBaseUrl - Base URL of the vault server. Example: https://10.12.125.240, http://localhost
 * @returns Base Vault Data Client
 */
export function createAnonymousVaultClient(
	vaultServerBaseUrl: string,
): BaseVaultDataClient {
	const adapter = new DefaultRequestAdapter(
		new AnonymousAuthenticationProvider(),
	);
	adapter.baseUrl = `${vaultServerBaseUrl}/AutodeskDM/Services/api/vault/v2`;
	return createBaseVaultDataClient(adapter);
}

/**
 * Get access token generator for Vault user
 *
 * @param vaultServerBaseUrl - Base URL of the vault server. Example: https://10.12.125.240, http://localhost
 * @param vault - Name of the vault
 * @param userName - Vault user name
 * @param password - Vault user password
 * @param appCode - Optional app code, used for server side logging
 * @returns Access token generator function
 */
function getVaultUserAccessTokenGenerator(
	vaultServerBaseUrl: string,
	vault: string,
	userName: string,
	password: string,
	appCode?: string,
) {
	const vaultClient = createAnonymousVaultClient(vaultServerBaseUrl);

	return async () => {
		const resp = await vaultClient.sessions.post({
			input: { vault, userName, password, appCode },
		});

		if (!resp?.accessToken) {
			throw new Error("Failed to get access token from Vault");
		}
		return resp.accessToken;
	};
}

/**
 * Get access token generator for Windows user
 *
 * @param vaultServerBaseUrl - Base URL of the vault server. Example: https://10.12.125.240, http://localhost
 * @param vault - Name of the vault
 * @param appCode - Optional app code, used for server side logging
 * @returns Access token generator function
 */
function getWindowsUserAccessTokenGenerator(
	vaultServerBaseUrl: string,
	vault: string,
	appCode?: string,
) {
	const vaultClient = createAnonymousVaultClient(vaultServerBaseUrl);

	return async () => {
		const resp = await vaultClient.sessions.winAuth.post({
			input: { vault, appCode },
		});

		if (!resp?.accessToken) {
			throw new Error("Failed to get access token from Vault");
		}
		return resp.accessToken;
	};
}

/**
 * Iterate through all pages of a paginated API
 *
 * @param pageGetter - Function to get a page of results
 * @param cursor - Cursor state for the next page
 * @returns Iterator of all results
 */
export async function* iterateAllPages<T>(
	pageGetter: (cursor: string) => Promise<{
		pagination: Partial<{ nextUrl?: string | null }>;
		results: T[];
	}>,
) {
	let response = await pageGetter("");
	for (const item of response?.results ?? []) {
		yield item;
	}

	while (response?.pagination?.nextUrl) {
		const tmpNextUrl = new URL(`http://mock/${response.pagination.nextUrl}`);
		const cursorState = tmpNextUrl.searchParams.get("cursorState");
		if (!cursorState) break;

		response = await pageGetter(cursorState);
		for (const item of response?.results ?? []) {
			yield item;
		}
	}
}
