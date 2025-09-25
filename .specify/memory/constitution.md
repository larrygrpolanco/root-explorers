<!--
Sync Impact Report:
- Version change: Template → 1.0.0
- Modified principles: All principles added based on PRD requirements
- Added sections: Core Principles, Technical Constraints, Development Workflow, Governance
- Removed sections: Template placeholder sections replaced with concrete content
- Templates requiring updates:
  ✅ .specify/templates/plan-template.md (version reference updated)
  ✅ .specify/templates/spec-template.md (no specific references, generic template)
  ✅ .specify/templates/tasks-template.md (no specific references, generic template)
- Follow-up TODOs: None - all placeholders filled
-->
# The Vagabond Foundry Constitution

## Core Principles

### I. Mobile-First Experience (NON-NEGOTIABLE)
Every interface MUST be designed for mobile devices first, with responsive adaptations for larger screens. Touch interactions MUST be prioritized over mouse-based interactions, and all UI elements MUST be sized for comfortable use on mobile devices.

### II. Root Universe Aesthetic Fidelity
All visual design MUST adhere to the rustic, storybook illustration style of the Root universe. Color palette MUST use warm, earthy tones (forest greens, rich browns, parchment creams) with muted faction colors for accents. Typography MUST use classic serif fonts for headings and highly readable sans-serif for UI elements.

### III. AI-Powered Character Generation
Character generation MUST use the Gemini API with image-to-image capabilities. All prompts MUST follow narrative description principles rather than keyword lists. Style reference sheets MUST be used to ensure visual consistency across all generated content.

### IV. User-Centric Refinement Workflow
The character creation process MUST allow non-linear navigation between steps, enabling users to refine choices at any time. Generation results MUST be easily regeneratable with the same prompt for variation. Saved characters MUST be easily deletable with confirmation steps.

### V. Data Simplicity & Persistence
Character data MUST be stored in a single characters.json file with a simple schema. Generated images MUST be saved as static files in /generated_images/ directory. Data structure MUST include all prompt information for reproducibility.

## Technical Constraints

### Technology Stack
- **Frontend Framework**: SvelteKit
- **Styling**: Tailwind CSS
- **AI Integration**: Gemini API
- **Data Storage**: JSON files and static image storage
- **Image Processing**: Server-side image composition for band scenes

### Performance Standards
- Character generation MUST complete within 30 seconds
- Gallery loading MUST be instantaneous for up to 50 characters
- Mobile responsiveness MUST maintain 60fps smoothness

### Compatibility Requirements
- MUST support modern browsers (Chrome, Safari, Firefox) on iOS and Android
- MUST maintain offline capability for viewing saved characters
- MUST support screen readers and accessibility features

## Development Workflow

### Testing Methodology
- TDD mandatory: Tests written → User approved → Tests fail → Then implement
- Contract tests for all API endpoints
- Integration tests for user flows
- Visual regression testing for style consistency

### Code Quality Standards
- All code MUST pass linting with project-specific rules
- CSS MUST use Tailwind utility classes primarily
- Components MUST be reusable and properly documented
- Error handling MUST be comprehensive and user-friendly

### Review Process
- All PRs MUST include visual examples of changes
- AI-generated content MUST be verified for style adherence
- Mobile experience MUST be tested on actual devices

## Governance

This constitution supersedes all other practices and documentation. Amendments require:
1. Documentation of the change rationale
2. Approval from all project stakeholders
3. Migration plan for any breaking changes
4. Update of all dependent templates and documentation

All PRs and reviews MUST verify compliance with this constitution. Complexity MUST be justified with clear user benefit. Use the project's PRD for runtime development guidance.

**Version**: 1.0.0 | **Ratified**: 2025-09-25 | **Last Amended**: 2025-09-25