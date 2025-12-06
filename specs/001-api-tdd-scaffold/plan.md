# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

**Language/Version**: TypeScript (Node.js 24.x)
**Primary Dependencies**: Next.js (API routes) or minimal Express/Polka for example endpoint, Prisma (ORM) optional for examples, Zod for request validation, Jest + Supertest + jest-openapi for tests/contract checks
**Storage**: SQLite for local development, PostgreSQL for production (design documented in `docs/petstore-spec.md`)
**Testing**: Jest (unit/integration), Supertest (HTTP integration), jest-openapi (contract assertion) — tests are TDD-first and must be present before implementation
**Target Platform**: Linux/macOS developer machines and CI runners; Node.js 24.x runtime
**Project Type**: Web API (Next.js API routes or standalone Node.js service)
**Performance Goals**: Default baseline per Constitution: P95 latency <= 300ms under baseline load (adjust per feature if needed)
**Constraints**: Follow Constitution constraints — OpenAPI-first, TDD, CI gate (`npm run all`), observability endpoints (`/metrics`), logging with request correlation
**Scale/Scope**: Reference implementation for portability and examples; not a production-grade horizontally scaled deployment in this initial scaffold

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Gates validation summary:

- OpenAPI contract present: PASSED — `docs/petstore-openai.yaml` exists and will be copied into `contracts/` for local contract tests.
- Test-First requirement: PARTIAL — tests are planned (see `research.md` and tasks in this plan). Phase 1 will include concrete failing tests (TDD).
- Contract tests: PLANNED — jest-openapi based contract assertion will be used; task created in `plan` to add example failing contract test.
- Observability: PLANNED — recommend `/metrics` endpoint and request-id logging; to be included in implementation tasks.
- Performance: DEFAULT — inherit Constitution baseline (P95 <= 300ms); no strict performance task in scaffold phase but measurement hooks recommended.
- Security: PLANNED — auth model = JWT Bearer (per constitution and OpenAPI securitySchemes); secrets handling via env and secret stores is documented as follow-up.
- CI/Quality gates: PASSED (planned) — `npm run all` defined in spec; CI tasks to include tests, fmt, lint, typecheck, contract tests.

Notes: No gate violations that block Phase 0 research. Any deferred items include explicit follow-up tasks in `plan` and `tasks.md`.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
