import type { BaseVaultDataClient } from "../generatedCode/baseVaultDataClient.js";

/**
 * Manager for Jobs operations
 * Handles job queue management and job execution
 */
export default class JobsManager {
	constructor(private readonly api: BaseVaultDataClient) {}

	/**
	 * Add a job to the job queue
	 * @param vaultId The unique identifier of a vault
	 * @param job Job details
	 * @returns Created job information
	 */
	async addJob(
		vaultId: string,
		job: {
			id?: string;
			jobType?: string;
			priority?: number;
			description?: string;
			params?: Record<string, string>;
			status?: "Ready" | "Running" | "Success" | "Failure";
			isOnSite?: string;
		},
	) {
		const result = await this.api.vaults.byId(vaultId).jobs.post(job);
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Get job queue enabled status
	 * @param vaultId The unique identifier of a vault
	 * @returns Boolean indicating if job queue is enabled
	 */
	async getJobQueueEnabled(vaultId: string) {
		const result = await this.api.vaults.byId(vaultId).jobs.jobQueueEnabled.get();
		if (result === undefined || result === null) {
			throw new Error("Unexpected null response");
		}
		return result;
	}

	/**
	 * Get a job by ID
	 * @param vaultId The unique identifier of a vault
	 * @param jobId The unique identifier of a job
	 * @returns Job information
	 */
	async getJobById(vaultId: string, jobId: string) {
		const result = await this.api.vaults.byId(vaultId).jobs.byId(jobId).get();
		if (!result) {
			throw new Error("Unexpected null response");
		}
		return result;
	}
}
