import { HttpClient } from '@microsoft/kiota-http-fetchlibrary';
import type { BaseAuthenticationClient } from "./generatedCode/baseAuthenticationClient.js";
import { TokenPostRequestBody } from "./generatedCode/authentication/v2/token/index.js";
import { GranttypeObject, AuthToken } from "./generatedCode/models/index.js";
import { create } from 'domain';
import { createAuthenticationUrl, createPKCEAuthenticationUrl, createScopeString, encodeBase64, extractCodeFromUrl } from './utils.js';

export interface ITokenStore {
  get(): AuthTokenExtended | null;
  set(token: AuthTokenExtended): void;
}

export type AuthenticationScope = string; // You may want to use a union of allowed scope strings

export interface AuthTokenExtended extends AuthToken {
  expiresAt: Date;
  accessToken: string;
}

export interface UserInfo {
  sub?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  preferred_username?: string;
  email?: string;
  email_verified?: boolean;
  profile?: string;
  picture?: string;
  locale?: string;
  updated_at?: number;
}

/**
 * Helper class for the Autodesk Authentication SDK
 */
export class AuthenticationClientHelper {
  private readonly httpClient?: HttpClient;
  readonly api: BaseAuthenticationClient;

  constructor(api: BaseAuthenticationClient, httpClient?: HttpClient) {
    this.api = api;
    this.httpClient = httpClient;
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
  createPKCEAuthenticationUrl(
    clientId: string,
    redirectUri: string,
    scope: AuthenticationScope[],
    codeChallenge: string,
    nonce = "",
    state = "",
    forceLogin = false
  ): string {
    return createPKCEAuthenticationUrl(clientId, redirectUri, scope, codeChallenge, nonce, state, forceLogin);
  }

  /**
   * Get the User info. 
   * @param threeLeggedToken 3L Access token
   * @returns User info
   */
  async getUserInfoAsync(threeLeggedToken: string): Promise<UserInfo | null> {
    const userInfoUrl = "https://api.userprofile.autodesk.com/userinfo";

    try {
      const response = await fetch(userInfoUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${threeLeggedToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userInfo = await response.json() as UserInfo;
      return userInfo;
    } catch (error) {
      console.error("Error fetching user info:", error);
      return null;
    }
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
  createAuthenticationUrl(
    clientId: string,
    redirectUri: string,
    scope: AuthenticationScope[],
    nonce = "",
    state = "",
    forceLogin = false
  ): string {
    return createAuthenticationUrl(clientId, redirectUri, scope, nonce, state, forceLogin);
  }

  /**
   * Extract the code from the callback url
   * @param url Callback url from Autodesk Authentication
   * @returns Code
   */
  extractCodeFromUrl(url: string): string | null {
    return extractCodeFromUrl(url);
  }
  /**
   * Refresh a 3 legged token
   * @param clientId Autodesk App Id
   * @param clientSecret Autodesk App secret
   * @param refreshToken Refresh token returned by the previous authentication
   * @param scopes New scope. You can only reduce the initial scope
   * @returns Fresh 3 legged token
   */
  async refreshThreeLeggedToken(
    clientId: string,
    clientSecret: string,
    refreshToken: string,
    scopes?: AuthenticationScope[]
  ): Promise<AuthTokenExtended> {
    const bodyReq: TokenPostRequestBody = {
      grantType: GranttypeObject.Refresh_token,
      refreshToken: refreshToken,
      scope: scopes ? this.createScopeString(scopes) : undefined
    };

    const result = await this.api.authentication.v2.token.post(bodyReq, {
      headers: {
        "Authorization": this.createAuthorizationString(clientId, clientSecret)
      }
    });

    if (!result) {
      throw new Error("Token is null");
    }

    return this.createAuthTokenExtended(result);
  }

  /**
   * Create an auto refreshing 2 legged token
   * @param clientId Autodesk App Id
   * @param clientSecret Autodesk App Secret
   * @param scopes List of scopes
   * @param authTokenStore Used for storing the generated token. The token will be reused until it expires. At that point it will be regenerated
   * @returns Function returning a 2L AccessToken
   */
  createTwoLeggedAutoRefreshToken(
    clientId: string,
    clientSecret: string,
    scopes: string[],
    authTokenStore: ITokenStore
  ): () => Promise<string> {
    return async () => {
      let currentToken = authTokenStore.get();
      const isExpired = !currentToken || (currentToken.expiresAt.getTime() - Date.now()) < 10000;

      if (isExpired) {
        const newToken = await this.getTwoLeggedToken(clientId, clientSecret, scopes);
        currentToken = newToken;
        authTokenStore.set(currentToken);
      }

      return currentToken?.accessToken ?? "";
    };
  }

  /**
   * Create a 2 legged token
   * @param clientId Autodesk App Id
   * @param clientSecret Autodesk App Secret
   * @param scopes List of scopes
   * @returns Fresh 2 legged token with expiration date calculated
   */
  async getTwoLeggedToken(
    clientId: string,
    clientSecret: string,
    scopes: string[]
  ): Promise<AuthTokenExtended> {
    const body: TokenPostRequestBody = {
      grantType: GranttypeObject.Client_credentials,
      scope: this.createScopeString(scopes)
    };

    const authString = this.createAuthorizationString(clientId, clientSecret);

    const result = await this.api.authentication.v2.token.post(body, {
      headers: {
        "Authorization": authString
      }
    });

    if (!result) {
      throw new Error("Token is null");
    }

    return this.createAuthTokenExtended(result);
  }

  /**
   * Combine client id and client secret to create a base64 encoded string
   * @param clientId Autodesk App Id
   * @param clientSecret Autodesk App Secret
   * @returns '{clientId}:{clientSecret}' in base64 encoded string
   */
  createAuthorizationString(clientId: string, clientSecret: string): string {
    const authValue = `${clientId}:${clientSecret}`;
    return `Basic ${encodeBase64(encodeURIComponent(authValue))}`;
  }

  /**
   * Check if a token is valid
   * @param authToken Token to check
   * @returns 'True' if valid token
   */
  isValidToken(authToken: AuthTokenExtended | null): boolean {
    // Token is valid if it is not null and it expires in more than 10 seconds
    return this.isValidToken(authToken);
  }

  /**
   * Convert a list of scopes to a string
   * @param scopes List of scopes
   * @returns Scopes separated with spaces
   */
  createScopeString(scopes: AuthenticationScope[]): string {
    return createScopeString(scopes);
  }

  /**
   * Helper method to create AuthTokenExtended from AuthToken
   * @param result AuthToken from API
   * @returns AuthTokenExtended with calculated expiration date
   */
  private createAuthTokenExtended(result: AuthToken): AuthTokenExtended {
    const expiresInMs = (result.expiresIn ?? 0) * 1000;
    const expiresAt = new Date(Date.now() + expiresInMs);

    return {
      ...result,
      expiresAt,
      accessToken: result.accessToken ?? ""
    };
  }



}
