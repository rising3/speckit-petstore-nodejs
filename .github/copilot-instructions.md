# Copilot Instructions for speckit Petstore Node.js

## Repository Overview

This repository contains the source code for the speckit Petstore web application built with Node.js, Next.js, and TypeScript.

- **Language**: node.js 24.x , typescript 5. x
- **Framework**: next.js 16.x, react 18.x
- **Middleware**: openid-client 6.x
- **validation**: zod 4.x
- **UI Library**: react-daisyui 5.x
- **HTTP Server**: Next.js built-in server
- **ORM**: prisma 7.x
- **Package Manager**: npm latest
- **Linting**: eslint 9.x
- **Formatting**: prettier 3.x
- **Testing**: jest 30.x , supertest 7.x
- **API Specification**: OpenAPI 3.x
- **Authentication**: Keycloak 26.x
- **Database**: SQLite latest (development), PostgreSQL latest (production)

## Build Instructions

### Prerequisites

### Commands

| Command | Description | Typical Duration |
|---------|-------------|------------------|
| `npm run dev` | Start the Next.js development server | ~2 seconds |
| `npm run build` | Build the Next.js application | ~2 seconds |
| `npm run start` | Start the Next.js server | ~2 seconds |
| `npm run test` | Run all tests | ~5 seconds |
| `npm run fmt` | Format code with prettier | ~1 second |
| `npm run lint` | Run eslint | ~5 seconds |
| `npm run all` | Run test → fmt → lint → build | ~15 seconds |
| `npm run clean` | Remove `.next` directory | ~1 second |

### Recommended Workflow

```bash
# 1. Install dependencies
npm ci

# 2. Build and validate all
npm run all
```

## Project Structure

```
.
├── .github/copilot-instructions.md  # GitHub Copilot instructions (this file)
├── .github/workflows/ci.yaml        # CI pipeline
├── app/
│   ├── api/
│   │   └── hello/
│   │       └── route.ts
│   ├── actions/
│   │   └── aaa-action.ts
│   └── page.tsx
├── components/
├── hooks/
├── lib/
├── utils/
├── styles/
├── types/
├── stores/
├── constants/
├── public/
├── __tests__/                       # Jest test code
│   └── ...                   
├── docker-compose.yaml              # Container definitions for local development
├── keycloak/                        # Keycloak configuration and initialization files
│   └── ...                   
├── node_modules/             
├── package.json              
├── next.config.js
├── tsconfig.json             
├── jest.config.js            
├── eslint.config.cjs            
├── .prettierignore
├── .prettierrc
├── .gitignore                
└── README.md                 
```

## Key Files

- `app/`: Next.js application code
- `components/`: React components
- `hooks/`: Custom React hooks
- `lib/`: Library code
- `utils/`: Utility functions
- `styles/`: CSS and styling files
- `types/`: TypeScript type definitions
- `stores/`: State management stores
- `constants/`: Application constants
- `public/`: Public static assets
- `__tests__/`: Jest test code
- `package.json`: npm scripts and dependencies
- `next.config.js`: Next.js configuration
- `tsconfig.json`: TypeScript configuration
- `jest.config.js`: Jest configuration  
- `eslint.config.cjs`: ESLint configuration            
- `.prettierignore`: Prettier ignore file 
- `.prettierrc`: Prettier configuration

## CI Pipeline

The `.github/workflows/ci.yaml` runs on PRs to `main`, `next`, and `feature/**` branches:

1. Checkout code
2. Set up node.js 24.x
3. Install dependencies with `npm ci`
4. `npm run test`
5. `npm run fmt`
6. `npm run lint`
7. `npm run build`
**Always run `npm run all` locally before pushing to ensure CI passes.**

## Testing

- Tests located in `__tests__/` directory
- Use `jest` framework
- Mock external dependencies as needed
- Run tests with `npm run test`

## Code Style

- Use `prettier` for formatting
- Follow JavaScript/TypeScript conventions for naming
- Organize code in `app/` directory
- Use ESLint for linting
- Run `npm run fmt` and `npm run lint` before commits

## Local Development with Docker Compose

For local development, you can use `docker-compose` to start the following services:

- **SQLite**: Development database
- **Keycloak**: Authentication and authorization server

### Example Structure

```
.
├── docker-compose.yaml         # Container definitions for development
├── keycloak/                   # Keycloak configuration and initialization files
│   └── ...
└── ...
```

### How to Start

```bash
# 1. Start containers
docker-compose up -d

# 2. Run migrations if needed
npm run prisma:migrate
```

### Notes

- SQLite data is persisted inside the container.
- Keycloak admin console is available at `http://localhost:8080` (see initial settings in the `keycloak/` directory).
- The application runs with the Next.js development server and integrates authentication via Keycloak.

For detailed configuration and initialization scripts, refer to `docker-compose.yaml` and the `keycloak/` directory.
