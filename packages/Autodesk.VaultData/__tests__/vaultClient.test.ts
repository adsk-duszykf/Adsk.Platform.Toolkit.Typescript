import { describe, expect, it } from "bun:test";
import {
	createAnonymousVaultClient,
	createClientWithVaultUserAccount,
} from "../src/utils.js";

describe("VaultClient", () => {
	const isHttps = false;
	const vaultServer = "localhost";
	const vault = "Vault";
	const userName = "Administrator";
	const password = "";

	it("should reach Vault", async () => {
		const client = createAnonymousVaultClient(vaultServer, isHttps);

		const resp = await client.serverInfo.get();

		expect(resp).toBeDefined();
		expect(resp?.name).toBeDefined();
		expect(resp?.productVersion).toBeDefined();
	});

	it("should create an instance of VaultClient", async () => {
		//const auth = getVaultUserAccessTokenGenerator(vaultServer, vault, userName, password,isHttps);
		const client = createClientWithVaultUserAccount(
			vaultServer,
			vault,
			userName,
			password,
			isHttps,
		);

		const resp = await client?.api.groups.get({
			queryParameters: {
				limit: 2,
			},
		});

		expect(resp?.results?.length).toBeDefined();
	});
});
