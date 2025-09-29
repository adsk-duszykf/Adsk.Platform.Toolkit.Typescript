import { AnonymousAuthenticationProvider } from '@microsoft/kiota-abstractions';
import { DefaultRequestAdapter } from "@microsoft/kiota-bundle";
import { BaseVaultDataClient, createBaseVaultDataClient } from "./generatedCode/baseVaultDataClient.js";
import { VaultClient } from './vaultClient.js';

export function createClientWithVaultUserAccount(vaultServer: string, vault: string, userName: string, password: string, isHttps: boolean = true, appCode?: string) {
    const getToken = getVaultUserAccessTokenGenerator(vaultServer, vault, userName, password, isHttps, appCode);

    return new VaultClient(getToken, vaultServer, isHttps);
}

export function createClientWithWindowsAccount(vaultServer: string, vault: string, isHttps: boolean = true, appCode?: string) {
    const getToken = getWindowsUserAccessTokenGenerator(vaultServer, vault, isHttps, appCode);

    return new VaultClient(getToken, vaultServer, isHttps);
}

export function createAnonymousVaultClient(vaultServer: string, isHttps: boolean = true): BaseVaultDataClient {
    const adapter = new DefaultRequestAdapter(new AnonymousAuthenticationProvider());
    adapter.baseUrl = `${isHttps ? 'https' : 'http'}://${vaultServer}/AutodeskDM/Services/api/vault/v2`;
    return createBaseVaultDataClient(adapter);
}

/**
 * Get access token generator for Vault user
 *
 * @export
 * @param {string} vault Name of the vault
 * @param {string} userName Vault user name
 * @param {string} password Vault user password
 * @param {string} [appCode] Optional app code, used for server side logging
 * @return {() => Promise<string>} Access token generator function
 */
function getVaultUserAccessTokenGenerator(vaultServer: string, vault: string, userName: string, password: string, isHttp: boolean = true, appCode?: string) {
    const vaultClient = createAnonymousVaultClient(vaultServer, isHttp);

    return async () => {
        const resp = await vaultClient.sessions.post({ input: { vault, userName, password, appCode } });

        if (!resp?.accessToken) {
            throw new Error("Failed to get access token from Vault");
        }
        return resp.accessToken;
    };
}

/**
 * Get access token generator for Vault user
 *
 * @export
 * @param {string} vault Name of the vault
 * @param {string} [appCode] Optional app code, used for server side logging
 * @return {() => Promise<string>} Access token generator function
 */
function getWindowsUserAccessTokenGenerator(vaultServer: string, vault: string, isHttp: boolean = true, appCode?: string) {
    const vaultClient = createAnonymousVaultClient(vaultServer, isHttp);

    return async () => {
        const resp = await vaultClient.sessions.winAuth.post({ input: { vault, appCode } });

        if (!resp?.accessToken) {
            throw new Error("Failed to get access token from Vault");
        }
        return resp.accessToken;
    };
}

