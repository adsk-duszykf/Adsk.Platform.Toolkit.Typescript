import { beforeEach, describe, expect, it } from "bun:test";
import { useFetchMock } from "bun-fetch-mock";
import { HttpClientFactory } from "../src/httpClientFactory.js";
import type { HttpRequestError } from "../src/middleware/errorHandler.js";
import {
	ErrorHandlerOptionKey,
	ErrorHandlerOptions,
} from "../src/middleware/options/errorHandlerOptions.js";

describe("Custom Error Handler Tests", () => {
	const mockedUrl = "http://localhost:3000";
	const fetchMock = useFetchMock({ baseUrl: mockedUrl });

	beforeEach(() => {
		// Setup mock returning error 500
		fetchMock.get("/", {
			status: 500,
			statusText: "Internal Server Error",
		});
	});

	it("should throw error when http status 500 and custom error handler is enabled", async () => {
		// By default, the custom error handler is enabled
		const httpClient = HttpClientFactory.create();

		try {
			await httpClient.executeFetch(mockedUrl, { method: "GET" });
		} catch (error) {
			expect((error as HttpRequestError).statusCode).toBe(500);
		}

		fetchMock.assertAllMocksUsed();
	});

	it("should NOT throw error when http status 500 and custom error handler is disabled", async () => {
		// By default, the custom error handler is enabled
		const httpClient = HttpClientFactory.create();

		const errorHandlerDisabler = {
			[ErrorHandlerOptionKey]: new ErrorHandlerOptions(false),
		};

		const response = await httpClient.executeFetch(
			mockedUrl,
			{ method: "GET" },
			errorHandlerDisabler,
		);

		expect(response.status).toBe(500);

		fetchMock.assertAllMocksUsed();
	});

	it("should throw error when http status 500 and custom error handler is enabled again", async () => {
		const httpClient = HttpClientFactory.create();

		try {
			await httpClient.executeFetch(mockedUrl, { method: "GET" });
		} catch (error) {
			expect((error as HttpRequestError).statusCode).toBe(500);
		}
		fetchMock.assertAllMocksUsed();
	});
});
