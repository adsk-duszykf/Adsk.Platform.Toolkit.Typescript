import type {
	AuthenticationScope,
	AuthTokenExtended,
} from "./authenticationClientHelper.js";

/**
 * Check if a token is valid
 * @param authToken Token to check
 * @returns 'True' if valid token
 */
export function isValidToken(authToken: AuthTokenExtended | null): boolean {
	// Token is valid if it is not null and it expires in more than 10 seconds
	return !!authToken && authToken.expiresAt.getTime() - Date.now() > 10000;
}

/**
 * Convert a list of scopes to a string
 * @param scopes List of scopes
 * @returns Scopes separated with spaces
 */
export function createScopeString(scopes: AuthenticationScope[]): string {
	return scopes.join(" ");
}

/**
 * Combine client id and client secret to create a base64 encoded string
 * @param clientId Autodesk App Id
 * @param clientSecret Autodesk App Secret
 * @returns '{clientId}:{clientSecret}' in base64 encoded string
 */
export function createAuthorizationString(
	clientId: string,
	clientSecret: string,
): string {
	const authValue = `${clientId}:${clientSecret}`;
	return `Basic ${encodeBase64(encodeURIComponent(authValue))}`;
}

/**
 * Extract the code from the callback url
 * @param url Callback url from Autodesk Authentication
 * @returns Code
 */
export function extractCodeFromUrl(url: string): string | null {
	const match = /[?&]code=([^&]+)/.exec(url);
	return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Create the url for reaching the Autodesk login page (3legged Auth)
 * @param clientId Autodesk App Id
 * @param redirectUri Callback url
 * @param scope Token scope
 * @param nonce Optional, except if scope is 'OpenId'
 * @param state Optional
 * @param forceLogin Default:False. If 'true' ignore the current session and force the login again
 * @returns Url for the Autodesk login page
 */
export function createAuthenticationUrl(
	clientId: string,
	redirectUri: string,
	scope: AuthenticationScope[],
	nonce = "",
	state = "",
	forceLogin = false,
): string {
	const scopeStr = createScopeString(scope);
	let url = `https://developer.api.autodesk.com/authentication/v2/authorize?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopeStr)}`;

	if (nonce) {
		url += `&nonce=${encodeURIComponent(nonce)}`;
	}

	if (state) {
		url += `&state=${encodeURIComponent(state)}`;
	}

	if (forceLogin) {
		url += `&prompt=login`;
	}

	return url;
}

/**
 * Create the url for reaching the Autodesk login page with PKCE authentication
 * @param clientId Autodesk App Id
 * @param redirectUri Callback url
 * @param scope Token scope
 * @param codeChallenge Code challenge for PKCE
 * @param nonce Optional, except if scope is 'OpenId'
 * @param state Optional.
 * @param forceLogin Default:False. If 'true' ignore the current session and force the login again
 * @returns Url for Autodesk PKCE authentication
 */
export function createPKCEAuthenticationUrl(
	clientId: string,
	redirectUri: string,
	scope: AuthenticationScope[],
	codeChallenge: string,
	nonce = "",
	state = "",
	forceLogin = false,
): string {
	let url = createAuthenticationUrl(
		clientId,
		redirectUri,
		scope,
		nonce,
		state,
		forceLogin,
	);
	url += `&code_challenge=${encodeURIComponent(codeChallenge)}&code_challenge_method=S256`;
	return url;
}
export function encodeBase64(str: string): string {
	if (typeof window !== "undefined" && typeof window.btoa === "function") {
		// Browser environment
		return window.btoa(str);
	} else if (typeof Buffer !== "undefined") {
		// Node.js environment
		return Buffer.from(str, "binary").toString("base64");
	} else {
		throw new Error("No btoa implementation found");
	}
}
