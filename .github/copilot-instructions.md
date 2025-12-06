# Copilot Instructions for speckit Petstore Node.js

## Repository Overview

This repository contains the source code for the speckit Petstore application built with Node.js, Next.js, and TypeScript.

- **Language**: node.js 24.x latest, typescript latest
- **Framework**: nexst.js latest, react 18.x
- **Middleware**: passport latest, passport-keycloak-oauth2-oidc-portable latest
- **validation**: zod latest
- **UI Library**: daisyui latest, tailwindcss latest
- **HTTP Server**: Next.js built-in server
- **ORM**: Prisma latest
- **Package Manager**: npm latest
- **Linting**: eslint latest, prettier latest
- **Testing**: jest latest , supertest latest
- **API Specification**: OpenAPI Latest
- **Authentication**: Keycloak latest
- **Database**: SQLite latest (development), PostgreSQL latest (production)

## Build Instructions

### Prerequisites

### Commands

| Command | Description | Typical Duration |
|---------|-------------|------------------|
| `npm run build` | transpile and build `build/` | ~2 seconds |
| `npm run test` | Run all tests | ~5 seconds |
| `npm run fmt` | Format code with prettier | ~1 second |
| `npm run lint` | Run eslint | ~5 seconds |
| `npm run all` | Run test → fmt → lint → build | ~15 seconds |
| `npm run clean` | Remove `build/` directory | ~1 second |

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
├── src/                             # server-side and shared logic
│   └── ...                   
├── pages/                           # Next.js pages (routing)
│   ├── index.tsx
│   └── ...                   
├── components/                      # React components
│   └── ...                   
├── public/                          # Static files (images, etc.)
│   └── ...                   
├── styles/                          # CSS and styling files
│   └── ...                   
├── tests/                           # Jest test code
│   └── ...                   
├── docker-compose.yaml              # Container definitions for local development
├── keycloak/                        # Keycloak configuration and initialization files
│   └── ...                   
├── node_modules/             
├── package.json              
├── tsconfig.json             
├── next.config.js                   # Next.js configuration
├── .eslintrc.json            
├── .prettierrc               
├── jest.config.js            
├── .gitignore                
└── README.md                 
```

## Key Files

- `src/`: Server-side and shared logic (if any)
- `pages/`: Next.js pages (routing)
- `components/`: React components
- `public/`: Static files (images, etc.)
- `styles/`: CSS and styling files
- `tests/`: Jest test code
- `next.config.js`: Next.js configuration
- `.eslintrc.json`: ESLint configuration
- `.prettierrc`: Prettier configuration
- `jest.config.js`: Jest configuration  

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

- Tests located in `tests/` directory
- Use `jest` framework
- Mock external dependencies as needed
- Run tests with `npm run test`

## Code Style

- Use `prettier` for formatting
- Follow JavaScript/TypeScript conventions for naming
- Organize code in `src/` directory
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
