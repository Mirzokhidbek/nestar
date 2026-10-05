# Nestars Monorepo

Full-Stack NestJS monorepo project containing **API Server** and **Batch Server**.

## Structure

```text
nestar/
├── apps/
│   ├── nestars-api/     # Main API Server (Port: 3007)
│   └── nestars-batch/   # Batch Processing Server (Port: 3008)
├── nest-cli.json        # NestJS monorepo configuration
├── tsconfig.json        # TypeScript root configuration
├── .env.example         # Environment template
└── package.json
```

## Environment Setup

Create `.env` based on `.env.example`:

```env
PORT_API=3007
PORT_BATCH=3008
```

## Getting Started

### Installation
```bash
npm install
```

### Running Applications

- **Start API Server in development mode**:
  ```bash
  npm run start:dev
  ```

- **Start Batch Server in development mode**:
  ```bash
  npm run start:dev:batch
  ```

### Build
```bash
npm run build
```

### Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```
