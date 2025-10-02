import { HttpClient } from '@microsoft/kiota-http-fetchlibrary';
import { BaseSecureServiceAccountClient } from "./generatedCode/baseSecureServiceAccountClient.js";
import { AuthenticationClient } from '@adsk-platform/authentication';
import { Key, ServiceAccountInfo } from './models/index.js';
import * as jose from 'jose';
import { AuthToken } from '@adsk-platform/authentication/models';


export class SecureServiceAccountClientHelper {
    private readonly authClient: AuthenticationClient;
    constructor(
        private readonly api: BaseSecureServiceAccountClient,
        private readonly httpClient?: HttpClient) {

        this.authClient = new AuthenticationClient(this.httpClient);

    }

    async generateAssertionJWT(clientId: string, serviceAccountId: string, scope: string[], pkcs8: string, keyId: string): Promise<string> {
        const alg = 'RS256';
        const privateKey = await jose.importPKCS8(pkcs8, alg);

        const jwt = await new jose.SignJWT({ scope })
            .setProtectedHeader({ alg, kid: keyId })
            .setIssuedAt()
            .setSubject(serviceAccountId)
            .setIssuer(clientId)
            .setAudience("https://developer.api.autodesk.com/authentication/v2/token")
            .setExpirationTime(Math.floor(Date.now() / 1000) + 300)
            .sign(privateKey);

        return jwt;
    }

    async createSecureServiceAccount(serviceAccount: ServiceAccountInfo) {
        const account = await this.api.serviceAccounts.post(serviceAccount);

        if (!account?.serviceAccountId || !account?.email) {
            throw new Error("Failed to create service account");
        }

        const { email, serviceAccountId } = account;

        const key = await this.api.serviceAccounts.byServiceAccountId(account.serviceAccountId).keys.post();

        if (!key?.kid || !key?.privateKey) {
            throw new Error("Failed to create service account key");
        }

        const { kid, privateKey } = key;

        return { account: { email, serviceAccountId }, key: { kid, privateKey } };
    }

    async getServiceAccountThreeLeggedToken(clientId: string, serviceAccountId: string, scope: string[], key: Key): Promise<AuthToken> {
        
        const jwt = await this.generateAssertionJWT(clientId, serviceAccountId, scope, key.privateKey, key.kid);

        const authToken = await this.authClient.helper.generateServiceAccountThreeLeggedToken(clientId, serviceAccountId, jwt, scope);
        
        if (!authToken) {
            throw new Error("Failed to get 3-legged token for service account");
        }

        return authToken;
    }
 


}