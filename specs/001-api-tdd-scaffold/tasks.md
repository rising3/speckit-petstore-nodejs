# Tasks: API-First TDD Scaffold (001-api-tdd-scaffold)

Phase 1: Setup (project initialization)

- [ ] T001 Create `package.json` with scripts (`build`, `typecheck`, `test`, `lint`, `fmt`, `fmt:fix`, `all`) and devDependencies in project root (`package.json`)
- [P] T002 Create TypeScript config `tsconfig.json` (`tsconfig.json`)
- [P] T003 Create Jest config `jest.config.js` configured for TypeScript (ts-jest) (`jest.config.js`)
- [P] T004 Create ESLint config `.eslintrc.json` (TypeScript rules) (`.eslintrc.json`)
- [P] T005 Create Prettier config `.prettierrc` (`.prettierrc`)
- [P] T006 Create `.gitignore` with node, build, and env ignores (`.gitignore`)
- [ ] T007 Add minimal Express app entry `src/app.ts` (export `app` without listening) (`src/app.ts`)
- [ ] T008 Add minimal route implementation `src/routes/pets.ts` implementing `GET /api/pets` and returning OpenAPI-compatible `PaginatedPets` response (`src/routes/pets.ts`)
- [ ] T009 Add dev entry `src/index.ts` to start server for manual dev runs (calls `app.listen`) (`src/index.ts`)
- [ ] T010 Add a simple passing unit test `tests/unit/dummy.test.ts` to validate test runner (`tests/unit/dummy.test.ts`)

Phase 2: Foundational (blocking prerequisites)

- [ ] T011 Add contract OpenAPI copy to `specs/001-api-tdd-scaffold/contracts/petstore-openapi.yaml` (if not already present) (`specs/001-api-tdd-scaffold/contracts/petstore-openapi.yaml`)
- [ ] T012 Add contract test using `jest-openapi`/`supertest` that asserts `GET /api/pets` conforms to the OpenAPI schema (`tests/contract/pet.contract.test.ts`)
- [ ] T013 Add request validation helper using `zod` for Pet schemas (`src/validators/pet.validator.ts`)
- [P] T014 Add developer quickstart and docs snippet `specs/001-api-tdd-scaffold/quickstart.md` (already present; verify contents) (`specs/001-api-tdd-scaffold/quickstart.md`)
- [ ] T015 Add `.specify/specify.md` or README snippet documenting how to run contract tests and `npm run all` (`.specify/specify.md`)
- [ ] T016 Install devDependencies and lockfile (`npm ci`) — ensure `package-lock.json` or `pnpm-lock.yaml` committed (`package.json` + lockfile)

Phase 3: User Story Implementation (priority order)

User Story: US1 — Initialize repo scaffold (Priority: P1)
- [ ] T017 [US1] Verify `npm run typecheck` runs without errors on the scaffold (command: `npm run typecheck`) (manual verification)
- [ ] T018 [US1] Verify `npm run test` runs and unit tests pass (command: `npm run test`) (manual verification)
- [ ] T019 [US1] Verify `npm run fmt` reports checked files (command: `npm run fmt`) (manual verification)
- [ ] T020 [US1] Verify `npm run lint` runs and returns zero when code follows rules (command: `npm run lint`) (manual verification)
- [ ] T021 [US1] Verify `npm run all` executes `test` → `fmt` → `lint` → `build` and exits 0 on fresh checkout (command: `npm run all`) (manual verification)

User Story: US2 — Add baseline configuration files (Priority: P2)
- [P] T022 [US2] Implement `jest.config.js` coverage and `tests/` glob patterns so contract and unit tests run (`jest.config.js`)
- [P] T023 [US2] Implement `.eslintrc.json` to include `@typescript-eslint` rules and `eslint-config-prettier` (`.eslintrc.json`)
- [ ] T024 [US2] Add `tsconfig.json` paths and compiler options for tests and src (`tsconfig.json`)

User Story: US3 — Provide example contract test and example route (Priority: P3)
- [ ] T025 [US3] Create `tests/contract/example.failing.contract.test.ts` as a template for TDD (a test that initially fails) (`tests/contract/example.failing.contract.test.ts`)
- [ ] T026 [US3] Create minimal implementation making contract test pass (if not already implemented): adjust `src/routes/pets.ts` to satisfy the contract (`src/routes/pets.ts`)
- [ ] T027 [US3] Add an integration test `tests/integration/pets.integration.test.ts` that starts the app and verifies `GET /api/pets` (`tests/integration/pets.integration.test.ts`)

Final Phase: Polish & Cross-cutting concerns

- [ ] T028 Update `specs/001-api-tdd-scaffold/spec.md` to reference completed tasks and mark done items (`specs/001-api-tdd-scaffold/spec.md`)
- [ ] T029 Add PR template / checklist requiring `npm run all` in PR description (`.github/PULL_REQUEST_TEMPLATE.md`)
- [ ] T030 Document how contract tests map to OpenAPI operations in `specs/001-api-tdd-scaffold/contracts/README.md` (`specs/001-api-tdd-scaffold/contracts/README.md`)

Dependencies (story completion order)

- US1 must complete before US2 and US3 can be considered fully verified (US1 provides the runnable scaffold and scripts).
- US2 (config stabilization) can be done in parallel with parts of US1, but `npm ci` (T016) depends on `package.json` (T001).
- US3 (contract tests + example route) depends on `src/app.ts`/`src/routes/pets.ts` (T007,T008) and contract file (T011).

Parallel execution examples

- `T002`, `T003`, `T004`, `T005`, `T006` can be implemented in parallel (they are independent config files).
- `T007` and `T008` (app and route) can be implemented in parallel with config tasks, but tests (`T012`,`T025`,`T026`) should run after `T007`/`T008` exist.
- `T022` and `T023` (jest/eslint refinements) are parallelizable across different files.

Independent test criteria (per user story)

- US1: `npm run all` completes successfully (exit 0) on a fresh checkout. Verifies developer scripts, unit tests, formatting, lint, and build.
- US2: Individual scripts `npm run typecheck`, `npm run test`, `npm run lint`, `npm run fmt` are runnable and return expected outputs for a conforming codebase.
- US3: A contract test in `tests/contract/*.test.ts` asserts API responses against `specs/001-api-tdd-scaffold/contracts/petstore-openapi.yaml`; the example integration test demonstrates failing→passing cycle (template + implementation).

Parallel opportunities identified

- Config files creation and formatter/linter config (`T002`-`T006`, `T022`-`T024`) — high parallelism.
- Documentation tasks (`T014`, `T015`, `T030`) — can be done in parallel with implementation.

Suggested MVP scope

- MVP = User Story 1 (US1) + minimal example route + passing contract test (T001..T013, T016, T021, T026). This gives a runnable scaffold, passing CI checks, and one contract-verified endpoint.

Format validation

- All tasks in this file follow the required checklist format: each line starts with `- [ ]`, has a unique Task ID `T###`, includes `[P]` where marked as parallelizable, includes `[USx]` labels for user story tasks, and ends with explicit file paths where the change will occur.
