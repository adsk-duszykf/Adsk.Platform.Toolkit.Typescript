/**
 * @module ErrorHandler
 */

import type { RequestOption } from "@microsoft/kiota-abstractions";
import {
	getObservabilityOptionsFromRequest,
	type Middleware,
} from "@microsoft/kiota-http-fetchlibrary";
import { trace } from "@opentelemetry/api";
import {
	ErrorHandlerOptionKey,
	ErrorHandlerOptions,
} from "./options/errorHandlerOptions.js";

/**
 * Middleware
 * Class for ErrorHandler
 */
export class ErrorHandler implements Middleware {
	/**
	 *
	 * The next middleware in the middleware chain
	 */
	next: Middleware | undefined;

	/**
	 *
	 * To create an instance of ErrorHandler
	 * @param [options] - The error handler options value
	 * @returns An instance of ErrorHandler
	 */
	public constructor(
		private readonly options: ErrorHandlerOptions = new ErrorHandlerOptions(),
	) {}

	/**
	 * To execute the current middleware
	 * @param url - The request url
	 * @param requestInit - The request options
	 * @param requestOptions - The request options
	 * @returns A Promise that resolves to nothing
	 */
	public async execute(
		url: string,
		requestInit: RequestInit,
		requestOptions?: Record<string, RequestOption>,
	): Promise<Response> {
		const response = await this.next?.execute(
			url,
			requestInit as RequestInit,
			requestOptions,
		);
		if (!response) {
			throw new Error("Response is undefined");
		}

		let currentOptions = this.options;
		if (requestOptions?.[ErrorHandlerOptionKey]) {
			currentOptions = requestOptions[
				ErrorHandlerOptionKey
			] as ErrorHandlerOptions;
		}

		if (currentOptions.enabled === false || this.isSuccessStatusCode(response)) {
			return response;
		}

		const obsOptions = getObservabilityOptionsFromRequest(requestOptions);
		if (obsOptions) {
			trace
				.getTracer(obsOptions.getTracerInstrumentationName())
				.startActiveSpan("retryHandler - execute", (span) => {
					span.setAttribute("com.microsoft.kiota.handler.error.enable", true);
					span.setAttribute("http.response.status_code", response.status);
					span.setAttribute("http.response.status_text", response.statusText);
					span.setAttribute("http.response.url", response.url);
					span.end();
				});
		}

		// Throw error, to avoid default handling of non-success status codes
		// in the kiota core (which is to return the response as is).
		// This allows the consumers to handle errors via try/catch.
		const err = new HttpRequestError(
			`Request to ${url} failed with status code ${response.status}`,
			response.status,
			{ url, request: requestInit, response },
		);

		throw err;
	}

	private isSuccessStatusCode(response: Response): boolean {
		return response.status >= 200 && response.status < 300;
	}
}
export class HttpRequestError extends Error {
	constructor(
		message: string,
		public statusCode?: number,
		public context?: { url: string; request: RequestInit; response: Response },
	) {
		super(message);
		this.name = "HttpRequestError";

		// Maintains proper stack trace for where our error was thrown (only available on V8)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, HttpRequestError);
		}
	}
}
