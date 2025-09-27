# Phase 0: Research for Root Vagabond Portrait Creator

## Research Areas

This document consolidates findings from analyzing the feature spec, PRD, and constitution. Focus areas: Root RPG domain knowledge, AI image generation prompting best practices (Gemini Flash), and SvelteKit implementation patterns for quizzes and server-side AI integration. No NEEDS CLARIFICATION remain; research resolves best practices for dependencies.

## 1. Root RPG Vagabonds Domain Knowledge

**Decision**: Use predefined species and playbooks lists exactly as specified. Incorporate thematic descriptions (presentation, demeanor, item, scene) directly into prompts to ensure fidelity to Root's woodland, anthropomorphic animal world. Reference Kyle Ferrin's art style (vibrant, textured storybook illustrations) in every prompt, including a reference image of Root artwork.

**Rationale**: Root: A Game of Woodland Might and its RPG expansion emphasize customizable vagabonds—solitary animal characters navigating faction conflicts. Species define physical traits (e.g., Badger: sturdy, burrowing), playbooks define roles/archetypes (e.g., Arbiter: mediator). Descriptions add personality/scene for immersive portraits. This aligns with constitution's Aesthetic and Thematic Fidelity principle, ensuring generated images feel like official Root art. Predefined lists prevent invalid inputs; customs allow flexibility.

**Alternatives Considered**:

- Dynamic species/playbook generation: Rejected—violates simplicity; predefined ensures consistency.
- Broader RPG integration (e.g., factions): Out of scope; focus on vagabonds only.

**Key Insights**:

- Species List: Badger, Bird, Cat, Fox, Mouse, Owl, Rabbit, Raccoon, Squirrel, Wolf, Beaver, Opossum.
- Playbooks List: Adventurer, Arbiter, Harrier, Ranger, Ronin, Scoundrel, Thief, Tinker, Vagrant.
- Art Style: Expressive animals in detailed, hand-drawn environments; prompts must specify "full-body portrait" for composition.

## 2. AI Prompting Best Practices for Gemini Flash

**Decision**: Construct prompts dynamically by inserting quiz state strings into a fixed template: "Full body portrait of [name], a [species] [playbook]. Their demeanor is defined by: [demeanor]. They are dressed [presentation]. They carry [item]. We find them [scene]. In the vibrant, storybook art style of Kyle Ferrin's Root board game, textured and expressive." Include a base64 or URL reference image of Root artwork in the API call (text+image prompting). Limit custom inputs to 200 chars; validate for empty (default to first option).

**Rationale**: Gemini Flash excels at efficient image generation with multimodal inputs. Structured prompts reduce variability, improving style adherence (e.g., specifying artist/style guides output). Reference image anchors to Root's aesthetic (earthy tones, detailed fur/textures). Server-side construction ensures security. Handles constitution's Technical Reliability: <30s generation via Flash model. Error handling: Retry on failures (rate limits, invalid responses).

**Alternatives Considered**:

- Free-form prompts: Risky—leads to inconsistent styles; template ensures completeness.
- Advanced techniques (e.g., negative prompts): Unnecessary for simple app; Flash handles basics well.
- Other models (e.g., Stable Diffusion): Rejected—Gemini specified for ease/integration; no local setup needed.

**Key Insights**:

- Best Practices: Be descriptive (pose, attire, setting), specify aspect ratio (e.g., 1:1 for portraits), use commas for separation. Test prompts iteratively for quality.
- API: Use `generativeai` Node.js SDK or direct fetch to `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent` with API key from .env.
- Performance: Expect 5-20s generation; show loading spinner.

## 3. SvelteKit Patterns for Quizzes and AI Integration

**Decision**: Implement multi-step quiz using Svelte stores for reactive state management (writable store for quiz data object). Use SvelteKit forms/actions for step progression/validation (e.g., enhance() for client-side, server actions for submission). Server routes (+server.js in /generate) for prompt construction and Gemini API call (fetch with Authorization: Bearer $GEMINI_API_KEY). Gallery: Server load function to read/write JSON file. Mobile-first: Use Tailwind or custom CSS for responsive grid (quiz steps as full-width cards).

**Rationale**: SvelteKit's unified architecture simplifies the web app (no separate backend). Stores handle quiz state across steps without prop drilling. Server routes secure API keys and handle JSON I/O (fs module for gallery.json). Aligns with constitution's simplicity: No external libs beyond SvelteKit ecosystem (e.g., Vitest for TDD). Performance: SSR for fast loads (<3s), client-side transitions for quiz flow.

**Alternatives Considered**:

- Vanilla JS forms: Rejected—Svelte's reactivity better for dynamic UI (e.g., custom input reveal).
- External state (e.g., Redux): Overkill; Svelte stores sufficient.
- Client-side AI: Impossible—exposes key; server-only per privacy principle.

**Key Insights**:

- Quiz Pattern: Wizard component with prev/next buttons; validate on submit (e.g., name required, customs trimmed).
- AI Integration: In +page.server.js or dedicated route: Parse form data, build prompt, call API, return image URL/base64.
- Testing: Vitest for store/unit tests, Playwright for E2E (quiz flow, generation, gallery save).
- Deployment: `npm run build && npm start` for Node adapter; static if no SSR needed.

## Consolidation

All research aligns with spec/PRD/constitution. No further unknowns. Ready for Phase 1: Design (entities, contracts, quickstart). Technical Context in plan.md is now fully informed.

**Version**: 1.0 | **Date**: 2025-09-26
