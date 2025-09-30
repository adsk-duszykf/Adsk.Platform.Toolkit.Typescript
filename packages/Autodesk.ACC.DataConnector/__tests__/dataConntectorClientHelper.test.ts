import { describe, it, expect, beforeEach } from 'bun:test';
import { useFetchMock } from 'bun-fetch-mock';
import { BaseDataConnectorClient, createBaseDataConnectorClient } from '../src/generatedCode/baseDataConnectorClient.js';
import { AnonymousAuthenticationProvider } from '@microsoft/kiota-abstractions';
import { FetchRequestAdapter } from '@microsoft/kiota-http-fetchlibrary';
import type { DataRequest } from '../src/generatedCode/models/index.js';
import { DataConnectorClient } from '../src/dataConnectorClient.js';

describe('DataConnectorClientHelper', () => {
    const mockBaseUrl = 'https://developer.api.autodesk.com/data-connector/v1';
    const fetchMock = useFetchMock({ baseUrl: mockBaseUrl });

    let mockApi: BaseDataConnectorClient;
    const testAccountId = 'f9abf4c8-1f51-4b26-a6b7-6ac0639cb138';
    const rootReqId = 'ce9bc188-1e18-11eb-adc1-0242ac1200';
    const accessToken = "access-token";
    const client = new DataConnectorClient(() => Promise.resolve(accessToken));


    beforeEach(() => {
        fetchMock.reset();

        // Create a mock request adapter with FetchRequestAdapter
        const authProvider = new AnonymousAuthenticationProvider();
        const requestAdapter = new FetchRequestAdapter(authProvider);
        requestAdapter.baseUrl = mockBaseUrl;

        // Create the API client
        mockApi = createBaseDataConnectorClient(requestAdapter);

    });

    describe('getAllRequestsAsync', () => {
        it('should provide access token in Authorization header', async () => {
            // Mock first page with 5 items
            const firstPageRequests: Partial<DataRequest>[] = Array.from({ length: 5 }, (_, i) => ({
                id: `${rootReqId}${i + 1 > 9 ? '' : '0'}${i + 1}`,
                accountId: testAccountId,
                description: `Test request ${i + 1}`,
                createdAt: new Date(),
            }));

            fetchMock
                .get(`/accounts/${testAccountId}/requests?offset=0&limit=20`, {
                    data: {
                        results: firstPageRequests
                    },
                    status: 200,
                    requestHeaders: { "Authorization": `Bearer ${accessToken}` }
                })

            const resp = client.helper.getAllRequests(testAccountId);

            await resp.next();

            // All mock are used, if the request with Auth header found
            fetchMock.assertAllMocksUsed();

        })
        it('should fetch all requests across multiple pages', async () => {
            // Mock first page with 20 items (full page)
            const firstPageRequests: Partial<DataRequest>[] = Array.from({ length: 20 }, (_, i) => ({
                id: `${rootReqId}${i + 1 > 9 ? '' : '0'}${i + 1}`,
                accountId: testAccountId,
                description: `Test request ${i + 1}`,
                createdAt: new Date(),
            }));

            // Mock second page with 15 items (partial page, indicating end)
            const secondPageRequests: Partial<DataRequest>[] = Array.from({ length: 15 }, (_, i) => ({
                id: `${rootReqId}${i + 21}`,
                accountId: testAccountId,
                description: `Test request ${i + 21}`,
                createdAt: new Date(),
            }));

            // Setup fetch mocks for pagination
            fetchMock
                .get(`/accounts/${testAccountId}/requests?offset=0&limit=20`, {
                    data: {
                        results: firstPageRequests
                    },
                    status: 200
                })
                .get(`/accounts/${testAccountId}/requests?offset=20&limit=20`, {
                    data: {
                        results: secondPageRequests
                    },
                    status: 200
                });

            // Collect all results
            const allRequests: DataRequest[] = [];
            const reqIterator = client.helper.getAllRequests(testAccountId);
            for await (const request of reqIterator) {
                allRequests.push(request);
            }

            // Verify results
            expect(allRequests).toHaveLength(35);
            expect(allRequests[0].id).toBe(`${rootReqId}01`);
            expect(allRequests[19].id).toBe(`${rootReqId}20`);
            expect(allRequests[20].id).toBe(`${rootReqId}21`);
            expect(allRequests[34].id).toBe(`${rootReqId}35`);

            // Verify all mocks were used
            fetchMock.assertAllMocksUsed();
        });

        it('should handle empty response', async () => {
            // Mock empty response
            fetchMock.get(`/accounts/${testAccountId}/requests?offset=0&limit=20`, {
                data: {
                    results: []
                },
                status: 200
            });

            const allRequests: DataRequest[] = [];
            for await (const request of client.helper.getAllRequests(testAccountId)) {
                allRequests.push(request);
            }

            expect(allRequests).toHaveLength(0);
            fetchMock.assertAllMocksUsed();
        });

        it('should handle single page with less than pageSize items', async () => {
            // Mock single page with only 5 items
            const singlePageRequests: Partial<DataRequest>[] = Array.from({ length: 5 }, (_, i) => ({
                id: `${rootReqId}${i + 1 > 9 ? '' : '0'}${i + 1}`,
                accountId: testAccountId,
                description: `Test request ${i + 1}`,
            }));

            fetchMock.get(`/accounts/${testAccountId}/requests?offset=0&limit=20`, {
                data: {
                    results: singlePageRequests
                },
                status: 200
            });

            const allRequests: DataRequest[] = [];
            for await (const request of client.helper.getAllRequests(testAccountId)) {
                allRequests.push(request);
            }

            expect(allRequests).toHaveLength(5);
            expect(allRequests[0].id).toBe(`${rootReqId}01`);
            expect(allRequests[4].id).toBe(`${rootReqId}05`);

            fetchMock.assertAllMocksUsed();
        });

        it('should handle response with null results', async () => {
            // Mock response with null results
            fetchMock.get(`/accounts/${testAccountId}/requests?offset=0&limit=20`, {
                data: {
                    results: null
                },
                status: 200
            });

            const allRequests: DataRequest[] = [];
            for await (const request of client.helper.getAllRequests(testAccountId)) {
                allRequests.push(request);
            }

            expect(allRequests).toHaveLength(0);
            fetchMock.assertAllMocksUsed();
        });

        it('should handle response with undefined results', async () => {
            // Mock response with undefined results
            fetchMock.get(`/accounts/${testAccountId}/requests?offset=0&limit=20`, {
                data: {},
                status: 200
            });

            const allRequests: DataRequest[] = [];
            for await (const request of client.helper.getAllRequests(testAccountId)) {
                allRequests.push(request);
            }

            expect(allRequests).toHaveLength(0);
            fetchMock.assertAllMocksUsed();
        });

        it('should handle multiple full pages correctly', async () => {
            // Create 3 full pages of 20 items each, then a partial page
            const pages = [
                Array.from({ length: 20 }, (_, i) => ({ id: `${rootReqId}${i + 1 > 9 ? '' : '0'}${i + 1}`, accountId: testAccountId })),
                Array.from({ length: 20 }, (_, i) => ({ id: `${rootReqId}${i + 21}`, accountId: testAccountId })),
                Array.from({ length: 20 }, (_, i) => ({ id: `${rootReqId}${i + 41}`, accountId: testAccountId })),
                Array.from({ length: 10 }, (_, i) => ({ id: `${rootReqId}${i + 61}`, accountId: testAccountId })),
            ];

            // Setup mocks for each page
            pages.forEach((page, index) => {
                const offset = index * 20;
                fetchMock.get(`/accounts/${testAccountId}/requests?offset=${offset}&limit=20`, {
                    data: { results: page },
                    status: 200
                });
            });

            const allRequests: DataRequest[] = [];
            for await (const request of client.helper.getAllRequests(testAccountId)) {
                allRequests.push(request);
            }

            expect(allRequests).toHaveLength(70);
            expect(allRequests[0].id).toBe(`${rootReqId}01`);
            expect(allRequests[19].id).toBe(`${rootReqId}20`);
            expect(allRequests[20].id).toBe(`${rootReqId}21`);
            expect(allRequests[39].id).toBe(`${rootReqId}40`);
            expect(allRequests[69].id).toBe(`${rootReqId}70`);

            fetchMock.assertAllMocksUsed();
        });

    });

    describe('getMultiPageResultsWithOffset', () => {
        it('should handle generic pagination correctly', async () => {
            const mockGetPage = async (offset: number, limit: number): Promise<{ id: string }[]> => {
                if (offset === 0) {
                    return Array.from({ length: limit }, (_, i) => ({ id: `item-${i + 1}` }));
                } else if (offset === 20) {
                    return Array.from({ length: 10 }, (_, i) => ({ id: `item-${i + 21}` }));
                }
                return [];
            };

            const results: { id: string }[] = [];
            for await (const item of client.helper.getMultiPageResultsWithOffset(mockGetPage, 20)) {
                results.push(item);
            }

            expect(results).toHaveLength(30);
            expect(results[0].id).toBe('item-1');
            expect(results[19].id).toBe('item-20');
            expect(results[20].id).toBe('item-21');
            expect(results[29].id).toBe('item-30');
        });

        it('should handle empty first page', async () => {
            const mockGetPage = async (): Promise<{ id: string }[]> => {
                return [];
            };

            const results: { id: string }[] = [];
            for await (const item of client.helper.getMultiPageResultsWithOffset(mockGetPage, 20)) {
                results.push(item);
            }

            expect(results).toHaveLength(0);
        });
    });
});
