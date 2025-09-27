# Tasks: Root Vagabond Portrait Generator

**Input**: Design documents from `specs/001-root-vagabond-portrait/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (simplified)

1. Setup project basics (existing SvelteKit).
2. Write failing contract tests for endpoints.
3. Write failing integration test for quiz flow.
4. Implement Character model.
5. Implement endpoints to pass tests.
6. Integrate quiz UI with endpoints.
7. Polish with basic tests and docs.

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

- Single project: `src/` at repository root (SvelteKit structure)
- API: `src/routes/api/[endpoint]/+server.js`
- Models: `src/lib/models/`
- Components: `src/lib/components/`
- Tests: `tests/` (Vitest)

## Phase 3.1: Setup

- [ ] T001 Install dependencies and initialize gallery.json per plan.md and quickstart.md (add @google/generative-ai if needed; create src/lib/server/gallery.json with [])
- [ ] T002 [P] Configure linting and formatting (ESLint/Prettier already in repo; ensure SvelteKit setup in eslint.config.js)

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [ ] T003 [P] Contract test POST /api/generate in tests/contract/test_generate.js (validate request body, mock Gemini response, assert Character output per contracts/generate.md)
- [ ] T004 [P] Contract test POST /api/save in tests/contract/test_save.js (validate Character input, mock fs write, assert success per contracts/save.md)
- [ ] T005 [P] Contract test GET /api/gallery in tests/contract/test_gallery.js (mock fs read, assert array of Characters per contracts/gallery.md)
- [ ] T006 [P] Integration test quiz flow in tests/integration/test_quiz.js (simulate 3-step quiz submission from quickstart.md, call generate endpoint, verify results display)

## Phase 3.3: Core Implementation (ONLY after tests are failing)

- [ ] T007 Implement Character model in src/lib/models/Character.js (define class/object with attributes and validation from data-model.md; export for use in endpoints)
- [ ] T008 Implement POST /api/generate endpoint in src/routes/api/generate/+server.js (construct prompt from research.md template, call Gemini API securely, return Character with portrait/prompt; depends on T007)
- [ ] T009 Implement POST /api/save endpoint in src/routes/api/save/+server.js (append Character to src/lib/server/gallery.json using fs, add createdAt; depends on T007)
- [ ] T010 Implement GET /api/gallery endpoint in src/routes/api/gallery/+server.js (read and return array from src/lib/server/gallery.json, handle errors with empty []; depends on T007)

## Phase 3.4: Integration

- [ ] T011 Integrate quiz components: Create src/lib/components/Quiz.svelte (3-step form with Svelte store for state), src/routes/create/+page.svelte (quiz flow), src/routes/results/+page.svelte (display portrait, save/edit buttons calling endpoints), src/routes/gallery/+page.svelte (grid view from /api/gallery); connect to endpoints from quickstart.md scenarios (depends on T008-T010)

## Phase 3.5: Polish

- [ ] T012 [P] Add basic unit tests for Character model in tests/unit/test_character.js and update docs in README.md (add usage notes); run quickstart.md scenarios manually

## Dependencies

- Tests (T003-T006) before implementation (T007-T010)
- T007 blocks T008, T009, T010
- T008-T010 block T011
- Implementation before polish (T012)

## Parallel Example

```
# Run setup in parallel where possible:
task-agent run T002

# Launch contract tests together (independent):
task-agent run T003
task-agent run T004
task-agent run T005
task-agent run T006

# Polish independent:
task-agent run T012
```

## Notes

- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Focus on client-side: Svelte components for UI, server routes for API/JSON
- Limit scope: No auth, mobile-responsive CSS in src/app.css, error handling with retries
- Each task specific: Use Svelte stores for quiz state, fs for JSON, Gemini via fetch or SDK

## Task Generation Rules (simplified)

1. **From Contracts**: Each file → one contract test [P] + one impl task
2. **From Data Model**: Character entity → one model task
3. **From Quickstart**: Quiz flow → one integration test [P]
4. **Ordering**: Setup → Tests → Models → Endpoints → Integration → Polish
5. **Validation**: All 3 contracts tested/implemented; 1 entity modeled; 1 integration; total 12 tasks (minimal for small scope)

## Validation Checklist

- [ ] All contracts have corresponding tests
- [ ] Character entity has model task
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task
