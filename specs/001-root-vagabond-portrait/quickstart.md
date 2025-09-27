# Quickstart Guide: Root Vagabond Portrait Creator

## Project Setup

This is a SvelteKit web application. The existing repository (/Users/larrygrpolanco/Documents/GitHub/root-explorers) is already a SvelteKit project. Add feature files to src/ (routes, lib, etc.) and contracts/tests as per plan.

1. **Clone/Navigate** (if new): Already in workspace; ensure on branch `001-root-vagabond-portrait`.
2. **Install Dependencies**:
   - Run `npm install` (adds @google/generative-ai for Gemini if needed; otherwise, use fetch).
   - No other deps: Use built-in fs for JSON, Svelte stores for state.
3. **Environment Variables**:
   - Create `.env` in root:
     ```
     GEMINI_API_KEY=your_google_gemini_api_key_here
     ```
   - Obtain key from Google AI Studio (free tier sufficient for small use).
   - **Security**: Never commit .env; add to .gitignore if not already.
4. **Gallery Initialization**:
   - Create `src/lib/server/gallery.json` with `[]` (empty array).

## Run Commands

- **Development Server**: `npm run dev` - Starts at http://localhost:5173. Hot reload for frontend/backend.
- **Build for Production**: `npm run build` - Generates static or Node adapter output.
- **Start Production**: `npm run preview` or `npm start` (after build) - Serves at http://localhost:4173.
- **Testing**:
  - Unit/Integration: `npm run test` (Vitest; covers stores, routes).
  - E2E: `npm run test:e2e` (Playwright; quiz flow, generation, gallery).
  - Lint: `npm run check` (ESLint/Prettier).

## Quickstart Test Scenarios

Validate feature end-to-end:

1. **Quiz Flow**: Navigate to /create → Complete 3 steps (select options/custom) → Submit → See loading → Results page with portrait, Save/Edit/Try Again buttons.
2. **Generation**: Verify prompt construction (console.log server-side), image displays (no errors), edit regenerates.
3. **Gallery**: /gallery loads empty → Save character → Reloads with image/name/playbook → Duplicates allowed.
4. **Errors**: Submit empty name → Inline error; API fail → Retry message.
5. **Mobile**: Resize browser or use dev tools; ensure responsive (quiz steps stack, gallery grid adapts).
6. **Performance**: Time quiz (<2min), load (<3s), generation (<30s).

## Troubleshooting

- API Key Error: Check .env, verify key in Google console.
- JSON Corruption: Delete gallery.json → Auto-resets to [].
- Port Conflict: Change in vite.config.js.
- Tests Fail: Run `npm run test -- --fix` for snapshots.

**Alignment**: Follows TDD (write failing tests first), mobile-first, no auth. Ready for implementation.

**Version**: 1.0 | **Date**: 2025-09-26
