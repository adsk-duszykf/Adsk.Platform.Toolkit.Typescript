# Autodesk Platform Services (APS) SDK - TypeScript

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)
[![Bun Runtime](https://img.shields.io/badge/bun-%3E%3D1.0.0-black.svg)](https://bun.sh/)

A comprehensive TypeScript SDK for Autodesk Platform Services (APS), built using Microsoft Kiota and organized as a monorepo with multiple service-specific packages.

## 🚀 Quick Start

1. Install the SDK (select packages as needed):

   ```bash
   npm install @adsk-platform/authentication @adsk-platform/httpclient @adsk-platform/data-management @adsk-platform/model-derivative @adsk-platform/vault-data
   ```

## 📦 Packages

This monorepo contains the following SDK packages:

| Package | Description | Status |
|---------|-------------|--------|
| [`@adsk-platform/authentication`](./packages/Autodesk.Authentication/) | Authentication and token management | ✅ Active |
| [`@adsk-platform/httpclient`](./packages/Autodesk.Common.HttpClient/) | Common HTTP client utilities | ✅ Active |
| [`@adsk-platform/data-management`](./packages/Autodesk.DataManagement/) | Data Management API wrapper | 🚧 In Progress |
| [`@adsk-platform/model-derivative`](./packages/Autodesk.ModelDerivative/) | Model Derivative API wrapper | 🚧 In Progress |
| [`@adsk-platform/vault-data`](./packages/Autodesk.VaultData/) | Vault Data API wrapper | ✅ Active |

## 🔧 Development

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0.0 (recommended)
- [Node.js](https://nodejs.org/) >= 18 (alternative)
- TypeScript >= 5.0

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd Typescript
````

### Building All Packages

```bash
bun run build
```

### Running Type Checks

```bash
bun run check-types
```

### Development Mode

```bash
bun run dev
```

### Testing

```bash
bun test
```

## 🏗️ Architecture

This SDK is built using:

- **[Microsoft Kiota](https://github.com/microsoft/kiota)**: API client generator
- **[Turborepo](https://turbo.build/)**: Monorepo build system
- **[Bun](https://bun.sh/)**: Fast JavaScript runtime and package manager
- **TypeScript**: Type-safe development

### Monorepo Structure

```text
Typescript/
├── packages/
│   ├── Autodesk.Authentication/     # Authentication SDK
│   ├── Autodesk.Common.HttpClient/  # Shared HTTP utilities
│   ├── Autodesk.DataManagement/     # Data Management API
│   ├── Autodesk.ModelDerivative/    # Model Derivative API
│   ├── Autodesk.VaultData/          # Vault Data API
│   └── examples/                    # Usage examples
├── utils/                           # Development utilities
├── package.json                     # Root package configuration
├── turbo.json                       # Turborepo configuration
└── tsconfig.base.json              # Base TypeScript configuration
```

## 🛠️ Scripts

| Script | Description |
|--------|-------------|
| `bun run build` | Build all packages |
| `bun run dev` | Start development mode |
| `bun run test` | Run tests |
| `bun run check-types` | Type checking |

## 📚 Documentation

- [Autodesk Platform Services Documentation](https://aps.autodesk.com/)
- [API Reference](https://aps.autodesk.com/en/docs/oauth/v2/developers_guide/overview/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run tests: `bun test`
5. Build packages: `bun run build`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

- [Autodesk Platform Services Community](https://aps.autodesk.com/en/support)

## 🔗 Related Projects

- [APS SDK C#](https://github.com/adsk-duszykf/Adsk.Platform.Toolkit.dotNet) - C# implementation of the same SDK

---

Built with ❤️ by me.
