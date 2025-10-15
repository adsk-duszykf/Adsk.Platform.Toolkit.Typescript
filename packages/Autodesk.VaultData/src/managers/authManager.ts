import type { BaseVaultDataClient } from "../generatedCode/baseVaultDataClient.js";

/**
 * Manager for Authentication operations
 * Handles session creation and management
 */
export default class AuthManager {
	constructor(private readonly api: BaseVaultDataClient) {}

	/**
	 * Create a new session with Vault credentials
	 * @param vault The knowledge vault to sign in to
	 * @param userName The Vault user name
	 * @param password The Vault password
	 * @param appCode Optional app name for server-side audit logging
	 * @returns Session information including access token
	 */
	async createSession(
		vault: string,
		userName: string,
		password: string,
		appCode?: string,
	) {
		const result = await this.api.sessions.post({
			input: {
				vault,
				userName,
				password,
				appCode,
			},
		});
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Create a new session with Windows authentication
	 * @param vault The knowledge vault to sign in to
	 * @param appCode Optional app name for server-side audit logging
	 * @returns Session information including access token
	 */
	async createSessionWithWinAuth(vault: string, appCode?: string) {
		const result = await this.api.sessions.winAuth.post({
			input: {
				vault,
				appCode,
			},
		});
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Get current session information
	 * @param sessionId The unique identifier of a login session (use '@current' for current session)
	 * @returns Session information
	 */
	async getSessionById(sessionId: string = "@current") {
		const result = await this.api.sessions.byId(sessionId).get();
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Delete a session
	 * @param sessionId The unique identifier of a login session (use '@current' for current session)
	 */
	async deleteSession(sessionId: string = "@current") {
		await this.api.sessions.byId(sessionId).delete();
	}
}
