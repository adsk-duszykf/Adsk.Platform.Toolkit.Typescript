import { expect, test, describe, it,beforeEach } from "bun:test";
import { HttpClientFactory } from "../src/httpClientFactory.js";
import { useFetchMock, type FetchMock } from "bun-fetch-mock";
import { ErrorHandlerOptionKey, ErrorHandlerOptions } from "../src/middleware/options/errorHandlerOptions.js";
import { HttpRequestError } from "../src/middleware/errorHandler.js";

describe("Custom Error Handler Tests", () => {
    const mockedUrl = "http://localhost:3000";
    let fetchMock = useFetchMock({ baseUrl: mockedUrl });

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
            await httpClient.executeFetch(mockedUrl, { method: 'GET' });
        } catch (error) {
            expect((error as HttpRequestError).statusCode).toBe(500);
        }

        fetchMock.assertAllMocksUsed();
    })

    it("should NOT throw error when http status 500 and custom error handler is disabled", async () => {

        // By default, the custom error handler is enabled
        const httpClient = HttpClientFactory.create();

        const errorHandlerDisabler = { [ErrorHandlerOptionKey]: new ErrorHandlerOptions(false) }

        const response = await httpClient.executeFetch(mockedUrl, { method: 'GET' }, errorHandlerDisabler);
        
        expect(response.status).toBe(500);

        fetchMock.assertAllMocksUsed();
    })
})