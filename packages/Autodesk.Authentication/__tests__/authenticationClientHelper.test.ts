import { useFetchMock } from 'bun-fetch-mock';
import { AuthenticationClient } from './../src/authenticationClient.js';
import { describe, it, expect } from 'bun:test';
import { AuthToken } from '../src/generatedCode/models/index.js';
import { createAuthenticationUrl, createPKCEAuthenticationUrl, extractCodeFromUrl } from '../src/utils.js';


describe('AuthenticationClientHelper', () => {
    let authClient = new AuthenticationClient();
    let adskServiceMock = useFetchMock({
        baseUrl: 'https://developer.api.autodesk.com'
    });

    const mockClientId = 'test-client-id';
    const mockRedirectUri = 'http://localhost:3000/callback';
    const mockScopes = ['data:read', 'data:write'];
    const mockCodeChallenge = 'test-code-challenge';

    describe('URL Generation', () => {
        it('should create a valid authentication URL', () => {
            const url = createAuthenticationUrl(
                mockClientId,
                mockRedirectUri,
                mockScopes
            );

            expect(url).toContain('https://developer.api.autodesk.com/authentication/v2/authorize');
            expect(url).toContain(`client_id=${encodeURIComponent(mockClientId)}`);
            expect(url).toContain(`redirect_uri=${encodeURIComponent(mockRedirectUri)}`);
            expect(url).toContain(`scope=${encodeURIComponent(mockScopes.join(' '))}`);
        });

        it('should create a valid PKCE authentication URL', () => {
            const url = createPKCEAuthenticationUrl(
                mockClientId,
                mockRedirectUri,
                mockScopes,
                mockCodeChallenge
            );

            expect(url).toContain('https://developer.api.autodesk.com/authentication/v2/authorize');
            expect(url).toContain(`code_challenge=${encodeURIComponent(mockCodeChallenge)}`);
            expect(url).toContain('code_challenge_method=S256');
        });

        it('should include optional parameters when provided', () => {
            const nonce = 'test-nonce';
            const state = 'test-state';
            const forceLogin = true;

            const url = createAuthenticationUrl(
                mockClientId,
                mockRedirectUri,
                mockScopes,
                nonce,
                state,
                forceLogin
            );

            expect(url).toContain(`nonce=${encodeURIComponent(nonce)}`);
            expect(url).toContain(`state=${encodeURIComponent(state)}`);
            expect(url).toContain('prompt=login');
        });
    });

    describe('Code Extraction', () => {
        it('should extract code from URL', () => {
            const code = 'test-auth-code';
            const url = `http://localhost:3000/callback?code=${code}&state=test-state`;

            const extractedCode = extractCodeFromUrl(url);
            expect(extractedCode).toBe(code);
        });

        it('should return null when no code in URL', () => {
            const url = 'http://localhost:3000/callback?state=test-state';

            const extractedCode = extractCodeFromUrl(url);
            expect(extractedCode).toBeNull();
        });
    });

    describe('Token Management', () => {
        const mockToken: AuthToken = {
            accessToken: 'test-access-token',
            expiresIn: 3600,
            refreshToken: 'test-refresh-token'
        };

        it('should get two-legged token', async () => {

            const tokenMock = {
                access_token: 'test-access-token',
                expires_in: 3600,
                refreshToken: 'test-refresh-token'
            };

            adskServiceMock.post<AuthToken>('/authentication/v2/token', {
                status: 200,
                data: tokenMock
            });

            const resp=await authClient.helper.getTwoLeggedToken("clientId", "clientSecret", []);
            expect(resp.accessToken).toBe(tokenMock.access_token as string);
            adskServiceMock.assertAllMocksUsed();
            
        });


    });

/*     describe('Token Store', () => {
        let tokenStore: ITokenStore;
        let storedToken: AuthTokenExtended | null = null;

        beforeEach(() => {
            tokenStore = {
                get: vi.fn(() => storedToken),
                set: vi.fn((token) => { storedToken = token; })
            };
        });

        it('should create auto-refreshing token function', async () => {
            (mockBaseClient.authentication.v2.token.post as any).mockResolvedValue(mockToken);

            const getToken = authClient.createTwoLeggedAutoRefreshToken(
                mockClientId,
                mockClientSecret,
                mockScopes,
                tokenStore
            );

            const token = await getToken();
            expect(token).toBe(mockToken.accessToken);
            expect(tokenStore.set).toHaveBeenCalled();
        });

        it('should reuse token if not expired', async () => {
            const futureDate = new Date(Date.now() + 3600000);
            storedToken = {
                accessToken: 'cached-token',
                expiresAt: futureDate,
                tokenType: 'Bearer',
                expiresIn: 3600
            };

            const getToken = authClient.createTwoLeggedAutoRefreshToken(
                mockClientId,
                mockClientSecret,
                mockScopes,
                tokenStore
            );

            const token = await getToken();
            expect(token).toBe('cached-token');
            expect(mockBaseClient.authentication.v2.token.post).not.toHaveBeenCalled();
        });
    }); */

/*     describe('Helper Methods', () => {
        it('should create authorization string', () => {
            const authString = AuthenticationClientHelper.createAuthorizationString(
                mockClientId,
                mockClientSecret
            );

            expect(authString).toStartWith('Basic ');
            expect(authString.split(' ')[1]).toBeTruthy();
        });

        it('should create scope string', () => {
            const scopeString = AuthenticationClientHelper.createScopeString(mockScopes);
            expect(scopeString).toBe('data:read data:write');
        });

        it('should validate tokens', () => {
            const validToken: AuthTokenExtended = {
                accessToken: 'test',
                expiresAt: new Date(Date.now() + 3600000),
                tokenType: 'Bearer',
                expiresIn: 3600
            };

            const expiredToken: AuthTokenExtended = {
                accessToken: 'test',
                expiresAt: new Date(Date.now() - 1000),
                tokenType: 'Bearer',
                expiresIn: 3600
            };

            expect(AuthenticationClientHelper.isValidToken(validToken)).toBe(true);
            expect(AuthenticationClientHelper.isValidToken(expiredToken)).toBe(false);
            expect(AuthenticationClientHelper.isValidToken(null)).toBe(false);
        });
    }); */
});
