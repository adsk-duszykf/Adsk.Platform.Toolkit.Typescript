# Autodesk.Common.HttpClient

A TypeScript HTTP client library for Autodesk APS SDK, providing common utilities for making HTTP requests.

## Features

- Simplified HTTP request handling
- Typed request and response interfaces
- Resilient (Retry, rate limit handling)

## Installation

```bash
npm install @adsk-platform/httpclient
```

## Usage

```typescript
import { HttpClientFactory } from '@adsk-platform/httpclient';

const client = HttpClientFactory.create();
const response = await client.executeFetch('https://api.example.com/data', { method: 'GET' });
console.log(response.data);
```

## API

- `HttpClient.get(url, options?)`
- `HttpClient.post(url, data, options?)`
- `HttpClient.put(url, data, options?)`
- `HttpClient.delete(url, options?)`

## Contributing

Contributions are welcome! Please submit issues or pull requests via GitHub.

## License

This project is licensed under the MIT License.