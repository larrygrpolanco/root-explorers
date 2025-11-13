## Product Requirements Document: Root Vagabond Portrait Creator

**Version:** 1.0  
**Status:** Draft  
**Owner:** Product / Engineering  
**Last Updated:** September 27, 2025

---

### 1. Product Overview

Root Vagabond Portrait Creator is a lightweight web application that lets players of Root: The Roleplaying Game (and fans of the Root universe) generate a single, stylized vagabond portrait from a short quiz.

- Users complete a 3-step quiz.
- The app builds a constrained prompt from their answers.
- A server-side AI image generation service (Imagen/Gemini, or mock in non-prod) creates one full-body character portrait.
- Users can:
  - View the result.
  - Download the image.
  - Optionally save it into a public gallery.
  - Start over with “Try Again.”
- No authentication, accounts, or complex editing flows.

Tech context (for implementation alignment):

- Frontend: SvelteKit.
- Backend: SvelteKit server routes for quiz submission, AI prompt construction, and calling the image generation API.
- Environments: support real AI provider in production and a mock AI implementation in development/demo.

---

### 2. In-Scope and Out-of-Scope

#### 2.1 In-Scope (MVP)

- Unauthenticated, session-based usage.
- A guided, linear 3-step quiz:
  1. Character basics (species and physical traits).
  2. Playbook selection via visual cards.
  3. Short flavor text inputs.
- Deterministic prompt construction from quiz answers using a single canonical template.
- Server-side AI image generation:
  - One image per quiz submission.
  - Fixed size and style constraints.
- Results page:
  - Show generated portrait.
  - Show a short textual summary of selected traits.
  - Actions: “Download Image”, “Save to Gallery”, “Try Again”.
- Public Gallery:
  - Public, read-only grid of saved portraits.
  - Basic metadata only (e.g., createdAt, derived label).
  - No personalized views; same gallery for all.
- Error and loading states:
  - Visible loading indicator during generation.
  - Clear, user-friendly error states on failure.
- Support for using a mock AI module when real API access is not available.

#### 2.2 Out-of-Scope (MVP)

- User accounts, authentication, user-specific galleries.
- Editing or partially re-generating an image (only full “Try Again” restarts).
- Arbitrary free-form prompt editing outside defined quiz inputs.
- Social sharing buttons or integrations (users may manually share downloaded images).
- Advanced image editing (crop, filters, multi-image variations, upscaling).
- Moderation UI or workflows beyond documented safety measures and manual removal capability.

---

### 3. Core User Flows

#### 3.1 Landing → Quiz Start

- User lands on the home page.
- Page explains the tool in 1–2 short paragraphs and a primary CTA:
  - “Create Your Vagabond Portrait”.
- CTA navigates to Step 1 of the quiz.

#### 3.2 Quiz Flow

The quiz is linear with a clear progress indicator (e.g., “Step 1 of 3”).

All required fields must be completed before advancing to the next step. Validation errors are shown inline.

Step 1: Basics (Multiple Choice)

- Species:
  - Fixed list of supported animals (e.g., Badger, Bird, Cat, Fox, Mouse, Owl, Rabbit, Raccoon, Squirrel, Wolf, Beaver, Opossum).
- Physical Attributes:
  - Fur/Feather/Scale Color: select from curated palette.
  - Eye Color: select from curated palette.
  - Build: e.g., Slight, Average, Hefty.
  - Height (relative to species): Short, Average, Tall.

Step 2: Playbook (Visual Selection)

- Display a grid of “Playbook Cards” for the supported vagabond playbooks:
  - Adventurer, Arbiter, Harrier, Ranger, Ronin, Scoundrel, Thief, Tinker, Vagrant (or the project’s final subset).
- Each card:
  - Shows name.
  - Shows representative art or an approved stand-in.
- Requirement:
  - Exactly one playbook must be selected to proceed.

Step 3: Spark of Life (Short Text Inputs)

Short, guided fields with character limits (e.g., 80–140 chars) and helper examples:

- Defining feature:
  - “What is their most defining physical feature?”
- Expression/demeanor:
  - “Describe their typical expression or demeanor.”
- Treasured item:
  - “What is a treasured item they always carry?”
- Clothing style:
  - “What kind of clothing do they prefer?”

Constraints:

- Inputs are optional or required as determined by UX, but if required:
  - Show concise validation messages.
- No file uploads or real-person references.

#### 3.3 Generate Portrait

On quiz submission:

- The frontend calls a SvelteKit server endpoint with validated quiz data.
- Server:
  - Builds the prompt using the canonical template.
  - Calls the configured AI image generation provider (Imagen/Gemini) or the mock module.
- UI:
  - Displays a loading state:
    - Example copy: “Summoning your vagabond...” with a small progress indicator.
- Timeouts:
  - If generation does not complete within 30 seconds (configurable), treat as failure.

Failure Handling (MVP):

- On API/network error, timeout, or safety block:
  - Show a clear message:
    - “We weren’t able to create that portrait. Please try again.”
  - Provide a “Try Again” button to re-attempt generation (with the same inputs, if still available) or restart the quiz.
- Do not expose raw provider error messages to the user.

#### 3.4 Results Page

On successful generation:

- Display:
  - Generated portrait (single image).
  - Short summary of the character based on quiz inputs.
- Actions:
  - “Download Image”:
    - Downloads the generated image file (PNG or JPG).
  - “Save to Gallery”:
    - Sends a request to persist this image + minimal metadata to the public gallery store.
  - “Try Again”:
    - Returns user to Step 1 (or landing) with a fresh quiz.

Notes:

- No inline editing of quiz answers on this screen (MVP).
- If “Save to Gallery” fails:
  - Show a short error: “Could not save to gallery. You can still download your portrait.”

#### 3.5 Public Gallery

- Accessible via navigation and from the results page.
- Displays a grid of saved portraits.

Behavior:

- No login; same global gallery for all users.
- Each gallery item:
  - Thumbnail of the image.
  - Optional flavor metadata (e.g., species + playbook, createdAt).
- Ordering:
  - Newest first (default).
- Pagination or infinite scroll:
  - Implement simple pagination or lazy loading for performance.

Constraints:

- No editing or deleting from the UI (MVP).
- Content safety relies on AI safety configuration plus manual removal capability at the infrastructure level.

---

### 4. AI Integration Requirements

#### 4.1 Prompt Construction

Use a single, canonical prompt template implemented server-side. Example (illustrative):

“Full body portrait of a [Build] [Height] [Species] vagabond from a woodland fantasy world. They have [Fur/Feather/Scale Color] fur/feathers/scales and [Eye Color] eyes. Their most defining feature is [Defining Feature]. Their typical expression is [Expression]. They are wearing [Clothing] and carrying [Treasured Item]. Vibrant, storybook illustration, textured and expressive, consistent with the whimsical tone of the Root universe.”

Rules:

- Only interpolate from validated quiz answers.
- All style and structural language outside user inputs is fixed and owned by us.
- Do not include user-supplied text verbatim if it violates safety or content policy (see Safety).
- Prompt template and model/configuration must be configurable per environment.

#### 4.2 Model and Infrastructure

- Must support:
  - Production: real Imagen/Gemini (or chosen provider) via server-side API.
  - Development/Preview: mock AI implementation (`mockAI.generate()` or equivalent) for fast, cost-free testing.
- Image:
  - Format: PNG or JPG (consistent per environment).
  - Recommended size: e.g., 512x768 (portrait) or equivalent; configurable constant.
- Request:
  - Server-only: API keys and secrets not exposed to client.
  - Timeout: default 30s, with one optional internal retry for transient failures.

#### 4.3 Safety and Compliance

- Use provider’s built-in safety filters.
- On safety block or disallowed content:
  - Do not display generated image.
  - Show a generic failure message as above; encourage “Try Again”.
- Do not encourage:
  - Real-person likeness, hateful, or explicit content.
- No prompts or logs should contain sensitive personal data beyond what the user voluntarily types into flavor fields.

#### 4.4 Cost and Rate Limiting

- Implement simple guardrails to prevent abuse (at minimum, document and design for):
  - Max generations per IP or session in a given window (concrete values to be set per deployment, e.g., 20/day).
- Provide configuration for:
  - Switching between “real” and “mock” generation.
  - Tuning limits without code changes where feasible.

---

### 5. Gallery Requirements

Data Model (MVP, conceptual):

- id: unique identifier.
- imageUrl or storageKey.
- createdAt: timestamp.
- summaryMetadata (optional): subset of quiz-based descriptors (e.g., “[Species] [Playbook]” label).
- hash or checksum (optional): for duplicate detection or internal use.

Behavior:

- Persist entries in chosen storage (file system, bucket, or database) per environment.
- Gallery page:
  - Fetches list of entries.
  - Renders in responsive grid.
- Moderation:
  - Rely primarily on safe prompt + AI safety filters.
  - Reserve right to manually remove problematic images from storage; no dedicated UI required for MVP.

Privacy:

- No user identifiers or PII stored.
- No IP addresses displayed or included in gallery metadata.

---

### 6. UX, Accessibility, and Copy

UX Principles:

- Short, guided experience; total quiz completion target: under 5 minutes.
- Clear progress indicator on quiz steps.
- Friendly, in-world copy without long blocks of text.

Accessibility:

- WCAG 2.1 AA-aligned where feasible:
  - All interactive elements keyboard-accessible.
  - Sufficient color contrast.
  - Focus states visible.
- Alt text:
  - Quiz UI elements: descriptive alt text where needed.
  - Generated portraits: generic but meaningful alt, e.g., “AI-generated vagabond character portrait.”

Copy Guidelines (examples to implement):

- Loading:
  - “Summoning your vagabond portrait...”
- Generic error:
  - “We weren’t able to create that portrait. Please try again.”
- Gallery empty state:
  - “No portraits saved yet. Create one to begin the gallery.”

---

### 7. Non-Functional Requirements

Performance:

- Quiz and core pages render in under 3 seconds on a typical broadband connection.
- Image generation API calls expected to complete within 30 seconds; beyond that is treated as a failure.

Reliability:

- Handle network/API errors gracefully (see error states).
- Avoid blocking the entire app if AI is unavailable:
  - The quiz should still load.
  - Result step should show clear failure copy instead of hanging.

Security:

- API keys and secrets:
  - Stored server-side (env or secret manager).
  - Never exposed in client bundle.
- Only minimal, non-sensitive data is logged.

Observability:

- Log (server-side, aggregated and anonymized):
  - Quiz submissions and generation attempts (count).
  - Generation successes vs failures.
  - Gallery saves.
- No logging of full free-text answers where policy-sensitive, unless required and aligned with privacy constraints.

---

### 8. Success Metrics (MVP)

Trackable targets for the initial release:

- Quiz completion rate:
  - ≥ 60% of users who start Step 1 reach the generation request.
- Generation success rate:
  - ≥ 90% of generation attempts return an image (excluding user-canceled).
- Gallery save rate:
  - ≥ 15% of successful generations are saved to the public gallery.
- Performance:
  - ≥ 95% of quiz views load within 3 seconds.
- Operational:
  - AI-related error rate (timeouts, safety blocks, API errors) maintained below defined threshold (e.g., < 5% of attempts, excluding deliberate abuse).

This PRD is intended to be directly implementable against the existing SvelteKit-based root-vault codebase and its Gemini/Imagen integration, while remaining concise enough for engineering and design to execute without ambiguity.