import { AuthTokenExtended, ITokenStore } from "../authenticationClientHelper.js";

export class InMemoryTokenStore implements ITokenStore {
    private token: AuthTokenExtended | null = null;

    get(): AuthTokenExtended | null {
        return this.token;
    }
    set(token: AuthTokenExtended): void {
        this.token = token;
    }
}