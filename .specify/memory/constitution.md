<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.0.0 (initial constitution aligned with PRD; no bump needed as this establishes baseline)
- Modified sections: Title (project-specific), Core Principles (replaced with 5 PRD-derived principles: User Experience Simplicity, Creative Flexibility, Technical Reliability and Simplicity, Aesthetic and Thematic Fidelity, Privacy and Internal Use), Technical Constraints (updated to SvelteKit JS, Gemini Flash, JSON storage, no auth), Development Workflow (minor alignment to SvelteKit TDD), Governance (added PR-based amendments, semantic versioning, compliance reviews)
- Added sections: None
- Removed sections: Mobile-First Experience, Root Universe Aesthetic Fidelity, AI-Powered Character Generation, User-Centric Refinement Workflow, Data Simplicity & Persistence (replaced with new principles)
- Templates status:
  ✅ .specify/templates/plan-template.md (requires version update from v2.1.1 to 1.0.0)
  ✅ .specify/templates/spec-template.md (no references, unchanged)
  ✅ .specify/templates/tasks-template.md (no references, unchanged)
- Commands/*.md: None exist
- README.md: No constitution references, unchanged
- Follow-up TODOs: Update plan-template.md version reference; review README.md if it should link to constitution
-->
# Root Vagabond Portrait Creator Constitution

## Core Principles

### I. User Experience Simplicity (NON-NEGOTIABLE)
The application MUST provide an intuitive, linear 3-step quiz for character creation with clear pre-written options, custom inputs, loading indicators during generation, and straightforward navigation (Create/View Gallery, Save/Edit/Try Again). All interactions MUST be mobile-friendly and complete within 2 minutes.  
**Rationale:** To deliver a fun, fast tool that enhances Root RPG sessions for a small group of friends without introducing unnecessary complexity or friction.

### II. Creative Flexibility
Every quiz question MUST include multiple pre-written thematic choices plus a "Custom" option revealing a text input for user-defined descriptions. The results page MUST display the generated prompt in an editable text box, allowing regeneration with modifications. Users MUST be able to iterate on portraits seamlessly.  
**Rationale:** To empower users to craft unique vagabonds tailored to their imagination, extending beyond predefined options while maintaining an engaging, narrative-driven flow.

### III. Technical Reliability and Simplicity
The stack MUST use SvelteKit with JavaScript (no TypeScript) for unified frontend and backend development. Image generation MUST leverage the Gemini Flash API via secure server-side HTTP requests, with prompts dynamically constructed from quiz data. Data storage MUST be a single JSON file (e.g., src/lib/server/gallery.json) for gallery persistence. No external databases or complex state management beyond Svelte stores.  
**Rationale:** To ensure a lightweight, maintainable application suitable for internal use, minimizing dependencies and deployment overhead while guaranteeing reliable AI integration and data handling.

### IV. Aesthetic and Thematic Fidelity
All UI elements MUST adopt a rustic woodland theme inspired by the Root universe, incorporating paper textures, wood grains, and earthy color palette (browns, greens, oranges, creams). Typography MUST use serif fonts for headings and clean sans-serif for body text to evoke a storybook feel. Generated portraits MUST reference Root art style images in API prompts for consistency. The layout MUST be clean, responsive, and immersive.  
**Rationale:** To create a visually cohesive experience that immerses users in the Root RPG world, ensuring portraits and interface align with the game's expressive, textured aesthetic.

### V. Privacy and Internal Use
No user authentication or external accounts MUST be implemented. All operations (quiz data, gallery saves, API calls) MUST occur server-side where possible, with the Gemini API key stored exclusively in environment variables (.env). Data MUST remain local to the JSON file, with no sharing or export features beyond browser save.  
**Rationale:** As a private tool for approximately 5 friends, prioritize simplicity and inherent security over robust access controls, focusing on ease of use within a trusted group.

## Technical Constraints

### Technology Stack
- **Frontend Framework**: SvelteKit (JavaScript)
- **Styling**: Custom CSS with earthy theme (no external libraries unless minimal)
- **AI Integration**: Google Gemini Flash API (server-side calls with text+image prompting)
- **Data Storage**: Single JSON file for gallery (src/lib/server/gallery.json)
- **Deployment**: Static hosting or simple Node.js server (Vite/SvelteKit defaults)

### Performance Standards
- Quiz completion and image generation MUST complete within 30 seconds
- Gallery loading MUST be instantaneous for up to 50 entries
- Application MUST maintain 60fps on mobile devices with responsive design

### Compatibility Requirements
- MUST support modern browsers (Chrome, Safari, Firefox) on desktop and mobile (iOS 15+, Android 10+)
- MUST function offline for viewing saved gallery (client-side rendering where possible)
- MUST include basic accessibility (ARIA labels, keyboard navigation, alt text for images)

## Development Workflow

### Testing Methodology
- TDD mandatory: Write failing tests first (unit for components, integration for flows, e2e for user journeys), then implement to pass
- Contract tests for server routes (e.g., prompt generation, API calls)
- Visual regression tests for UI consistency with Root theme
- Manual testing on mobile devices for touch interactions

### Code Quality Standards
- All code MUST pass ESLint and Prettier with SvelteKit defaults
- Components MUST be reusable, documented with JSDoc, and follow Svelte best practices
- Error handling MUST be user-friendly (e.g., graceful failures with retry options) and logged server-side
- Prompts and data objects MUST be validated before API submission

### Review Process
- All PRs MUST include screenshots of mobile/desktop views, test coverage reports, and prompt examples
- AI outputs MUST be manually verified for style adherence and quality
- Changes MUST be tested end-to-end (quiz → generation → gallery save)

## Governance
This constitution establishes the foundational rules for the Root Vagabond Portrait Creator project and supersedes conflicting documentation or practices. It ensures alignment with the PRD for a simple, thematic AI tool.

### Amendment Procedure
Amendments MUST follow these steps:
1. Propose changes via a GitHub Pull Request (PR) with clear rationale tied to PRD evolution or lessons learned
2. Obtain approval from all project stakeholders (initially the 5 friends)
3. Include a migration plan for any breaking changes (e.g., data schema updates)
4. Update all dependent templates, docs, and code references post-merge

### Versioning
Use semantic versioning (MAJOR.MINOR.PATCH):
- MAJOR: Breaking changes to principles or stack (e.g., switching frameworks)
- MINOR: Additions or refinements (e.g., new principles from feature expansions)
- PATCH: Fixes or clarifications (e.g., wording updates)
Initial version: 1.0.0 (PRD baseline)

### Compliance Reviews
Every PR MUST include a self-review section verifying adherence to this constitution (e.g., "Does this maintain UX simplicity?"). Non-compliant changes MUST be rejected or justified with user benefit evidence. Quarterly reviews of the project against the constitution are recommended.

**Version**: 1.0.0 | **Ratified**: 2025-09-26 | **Last Amended**: 2025-09-26