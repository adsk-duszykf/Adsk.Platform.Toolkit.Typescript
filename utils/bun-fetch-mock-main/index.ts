import { afterAll, beforeAll, expect, spyOn } from "bun:test";

const DEFAULT_METHOD = "GET";

type HttpMethod =
	| "GET"
	| "POST"
	| "PUT"
	| "DELETE"
	| "PATCH"
	| "HEAD"
	| "OPTIONS";

interface MockResponse<T = unknown> {
	data?: T;
	status?: number;
	headers?: Record<string, string>;
	statusText?: string;
}

export interface MockOpts<T = unknown> extends MockResponse<T> {
	once?: boolean;
	requestHeaders?: { [key: string]: string };
}

export type UrlOrPath = `https://${string}` | `http://${string}` | `/${string}`;

function getKey({ method, url }: { method: HttpMethod; url: string }) {
	// Normalize URL and sort query parameters alphabetically
	const urlObj = new URL(url);
	if (urlObj.search) {
		const params = Array.from(urlObj.searchParams.entries());
		params.sort(([a], [b]) => a.localeCompare(b));
		urlObj.search = params.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&");
	}
	url = urlObj.toString();
	return `[${method}] ${url}`;
}

export interface FetchMockOpts {
	baseUrl?: string;
}

type ValidationError = {
	message: string;
	url?: string;
	method?: HttpMethod;
};

export class FetchMock {
	readonly baseUrl: string;
	readonly mocks = new Map<string, { isUsed: boolean } & MockOpts<unknown>>();
	private mockQueue = new Map<
		string,
		Array<{ isUsed: boolean } & MockOpts<unknown>>
	>();

	constructor(opts: FetchMockOpts) {
		this.baseUrl = opts.baseUrl ?? "";
	}

	private validateUrl(url: UrlOrPath): ValidationError | null {
		if (!url || typeof url !== "string") {
			return { message: "URL must be a non-empty string" };
		}

		if (
			!url.startsWith("http://") &&
			!url.startsWith("https://") &&
			!url.startsWith("/")
		) {
			return { message: "URL must start with http://, https://, or /" };
		}

		return null;
	}

	private validateMethod(method: string): method is HttpMethod {
		const validMethods: HttpMethod[] = [
			"GET",
			"POST",
			"PUT",
			"DELETE",
			"PATCH",
			"HEAD",
			"OPTIONS",
		];
		return validMethods.includes(method as HttpMethod);
	}

	reset(this: FetchMock) {
		this.mocks.clear();
		this.mockQueue.clear();

		return this;
	}

	get<T>(this: FetchMock, url: UrlOrPath, opts?: MockOpts<T>) {
		return this.#mockRequest("GET", url, opts);
	}

	post<T>(this: FetchMock, url: UrlOrPath, opts?: MockOpts<T>) {
		return this.#mockRequest("POST", url, opts);
	}

	put<T>(this: FetchMock, url: UrlOrPath, opts?: MockOpts<T>) {
		return this.#mockRequest("PUT", url, opts);
	}

	delete<T>(this: FetchMock, url: UrlOrPath, opts?: MockOpts<T>) {
		return this.#mockRequest("DELETE", url, opts);
	}

	patch<T>(this: FetchMock, url: UrlOrPath, opts?: MockOpts<T>) {
		return this.#mockRequest("PATCH", url, opts);
	}

	head<T>(this: FetchMock, url: UrlOrPath, opts?: MockOpts<T>) {
		return this.#mockRequest("HEAD", url, opts);
	}

	options<T>(this: FetchMock, url: UrlOrPath, opts?: MockOpts<T>) {
		return this.#mockRequest("OPTIONS", url, opts);
	}

	/**
	 * Asserts that all defined mocks have been used at least once.
	 *
	 * @param {FetchMock} this
	 * @memberof FetchMock
	 */
	assertAllMocksUsed(this: FetchMock) {
		for (const [key, opts] of this.mocks.entries()) {
			expect(opts.isUsed, `Fetch mock ${key} was not used`).toBe(true);
		}
		for (const [key, queue] of this.mockQueue.entries()) {
			for (const opts of queue) {
				expect(opts.isUsed, `Fetch mock ${key} was not used`).toBe(true);
			}
		}
	}

	async fetchMock(
		this: FetchMock,
		url: string,
		init?: RequestInit,
	): Promise<Response> {
		const methodStr = init?.method ?? DEFAULT_METHOD;

		if (!this.validateMethod(methodStr)) {
			throw new Error(
				`Unsupported HTTP method: ${methodStr}. Supported methods: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS`,
			);
		}

		const method = methodStr as HttpMethod;
		const key = getKey({ method, url });

		const opts = this.mocks.get(key);

		const expectedHeaders = opts?.requestHeaders;
		if (expectedHeaders) {
			
			const incomingReqHeaders = new Headers(init?.headers);
			
			for (const [expectedHeaderKey, expectedHeaderValue] of Object.entries(
				expectedHeaders,
			)) {
				const incomingReqHeaderValue = incomingReqHeaders.get(expectedHeaderKey);
				if (incomingReqHeaderValue !== expectedHeaderValue) {
					throw new Error(
						`Fetch mock ${key} expected header ${expectedHeaderKey}: ${expectedHeaderValue}, but got: ${incomingReqHeaderValue}`,
					);
				}
			}
		}

		if (!opts) {
			const allMocks = [
				...Array.from(this.mocks.keys()),
				...Array.from(this.mockQueue.keys()),
			];
			const availableMocks = allMocks.join(", ");
			throw new Error(
				`No mock found for ${key}${availableMocks ? `. Available mocks: ${availableMocks}` : ""}`,
			);
		}

		const { once, data, status = 200, headers = {}, statusText = "OK" } = opts;

		opts.isUsed = true;

		if (once) {
			this.mocks.delete(key);
			const queue = this.mockQueue.get(key);
			if (queue && queue.length > 0) {
				const nextMock = queue.shift();
				if (nextMock) {
					this.mocks.set(key, nextMock);
				}
				if (queue.length === 0) {
					this.mockQueue.delete(key);
				}
			}
		}

		if (method === "HEAD") {
			return new Response(null, { status, headers, statusText });
		}

		if (data === undefined) {
			return new Response(null, { status, headers, statusText });
		}

		if (typeof data === "string") {
			return new Response(data, {
				status,
				headers: { "Content-Type": "text/plain", ...headers },
				statusText,
			});
		}

		return Response.json(data, { status, headers, statusText });
	}

	#mockRequest<T>(method: HttpMethod, url: UrlOrPath, opts?: MockOpts<T>) {
		const urlError = this.validateUrl(url);
		if (urlError) {
			throw new Error(`Invalid URL for ${method} mock: ${urlError.message}`);
		}

		const fullUrl = url.startsWith("/") ? `${this.baseUrl}${url}` : url;
		const key = getKey({ method, url: fullUrl });

		const mockData = {
			...opts,
			isUsed: false,
		};

		if (this.mocks.has(key)) {
			const queue = this.mockQueue.get(key) || [];
			queue.push(mockData);
			this.mockQueue.set(key, queue);
		} else {
			this.mocks.set(key, mockData);
		}

		return this;
	}
}
/**
 * Creates and sets up a FetchMock instance, and spies on the global fetch function to route calls through the mock.
 *
 * @param {FetchMockOpts} [opts={}]
 * @return {*} 
 */
export function useFetchMock(opts: FetchMockOpts = {}) {
	const mock = new FetchMock(opts);
	const spyFetch = spyOn(globalThis, "fetch");

	spyFetch.mockImplementation(
		(mock.fetchMock as unknown as typeof fetch).bind(mock),
	);

	beforeAll(() => {
		if (!spyFetch.mock) {
			spyFetch.mockImplementation(
				(mock.fetchMock as unknown as typeof fetch).bind(mock),
			);
		}
	});

	afterAll(() => {
		spyFetch.mockRestore();
	});

	return mock;
}
