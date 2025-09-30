import { AuthenticationClient } from '@adsk-platform/authentication';


async function GetTwoLeggedAuthTokenWithAPI( clientId: string, clientSecret: string ):Promise<string> {
    const client = new AuthenticationClient();
    
    const credentials=client.helper.createAuthorizationString(clientId,clientSecret)
    const resp = await client.api.authentication.v2.token.post(
        {
            grantType: "client_credentials",
            scope: "data:read data:write"
        },
        { headers: { "Authorization": credentials } }
    );

    if (!resp?.accessToken) {
        throw new Error("No token received");
    }

    return resp.accessToken;
}
