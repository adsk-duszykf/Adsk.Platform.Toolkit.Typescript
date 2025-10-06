import { describe, expect, it } from "bun:test";
import type { AuthTokenExtended } from "../src/authenticationClientHelper.js";
import { InMemoryTokenStore } from "../src/models/inMemoryTokenStore.js";

describe("InMemoryTokenStore", () => {
	it("should store and retrieve token", () => {
		const store = new InMemoryTokenStore();
		const token: AuthTokenExtended = {
			accessToken: "test-token",
			expiresIn: 3600,
			expiresAt: new Date(Date.now() + 3600000),
		};

		store.set(token);
		const retrievedToken = store.get();

		expect(retrievedToken).toEqual(token);
	});

	it("should return null when no token is stored", () => {
		const store = new InMemoryTokenStore();
		expect(store.get()).toBeNull();
	});

	it("should update token when setting new one", () => {
		const store = new InMemoryTokenStore();
		const token1: AuthTokenExtended = {
			accessToken: "token-1",
			expiresIn: 3600,
			expiresAt: new Date(Date.now() + 3600000),
		};

		const token2: AuthTokenExtended = {
			accessToken: "token-2",
			expiresIn: 3600,
			expiresAt: new Date(Date.now() + 3600000),
		};

		store.set(token1);
		store.set(token2);

		expect(store.get()).toEqual(token2);
	});
});
