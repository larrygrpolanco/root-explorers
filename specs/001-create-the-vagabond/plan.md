# Implementation Plan: Create The Vagabond Foundry

**Feature Branch**: `001-create-the-vagabond`  
**Created**: 2025-09-25  
**Status**: Draft  
**Based On**: PRD.md and spec.md

This plan outlines the technical implementation for The Vagabond Foundry, a mobile-first SvelteKit web app for generating Root RPG character art using Gemini API. It aligns with the spec's functional requirements, UI/UX principles, and technical specifications, focusing on server-side data handling, prompt-driven AI generation, and secure API integration.

## 1. Requirements Analysis

### Functional Requirements Summary
- **Vagabond Creator (FR-001, FR-002)**: Multi-screen flow (6 screens) for user inputs (playbook, species, demeanor, physical_desc, trinket, char_name). Generate/refine square (1:1) portraits via Gemini API with style reference. Save to JSON and /generated_images/.
- **Gallery (FR-003, FR-005)**: Responsive grid of character cards; modal for details/delete (updates JSON, removes image file).
- **Band Composer (FR-004)**: Select 2-5 characters from gallery; input scene_location and scene_action; stitch references server-side; generate landscape group scene via Gemini; display for device save (no persistent storage).
- **AI Prompting (AI-001 to AI-004)**: Narrative prompts with style_reference_sheet.png; debug mode (?debug=true) for prompt preview and reference sheet.
- **UI/UX (UI-001 to UI-006, FR-006)**: Mobile-first responsive design; stepper navigation; loading states; earthy palette, textured backgrounds, serif/sans-serif fonts; subtle interactions.

### Non-Functional Requirements
- **Performance**: Server-side generation to handle API calls; optimize image stitching for <5s latency.
- **Security**: API keys in .env; no client-side exposure. Validate inputs to prevent injection.
- **Scalability**: Single JSON file for 5 users; no database needed.
- **Accessibility**: ARIA labels for grids/modals; keyboard navigation.
- **Edge Cases**: API failures (retry button); validation (2-5 chars for composer); custom "Other" inputs sanitized.
- **Mobile-First**: Tailwind responsive classes (sm:, md:); touch-friendly buttons (>44px).

### Dependencies & Constraints
- Aligns with spec: SvelteKit + Tailwind; Gemini API (image-to-image); characters.json schema; /generated_images/ storage.
- Assumptions: style_reference_sheet.png provided in static/; private use (no auth); Node.js 18+ for server-side image processing.

## 2. System Architecture

### High-Level Design
- **Frontend**: SvelteKit for routing, components, and stores (e.g., writable store for creator state).
- **Backend**: SvelteKit server actions (+server.js) for secure API calls, JSON read/write, image saving/stitching.
- **Data Layer**: File-based (fs module); characters.json in src/lib/data/; images in static/generated_images/.
- **AI Integration**: @google/generative-ai client in server actions; base64 encoding for images.
- **Styling**: Tailwind CSS via PostCSS; custom theme for Root aesthetic (colors: green-600, brown-800, cream-100).
- **Image Processing**: Sharp library for server-side stitching (horizontal composite for references).

### Data Flows
1. **Creator Flow**: User inputs → Store in session → Construct prompt → Server action: Call Gemini → Save image/JSON → Navigate to Gallery.
2. **Gallery Flow**: Load JSON → Render grid → Click → Modal with details → Delete: Server action removes entry/image.
3. **Composer Flow**: Load JSON → Select chars → Inputs → Server: Stitch images + prompt → Gemini call → Return base64 image → Client display + download link.

Mermaid diagram for core flows:

```mermaid
graph TD
    A[User Input: Creator Screens] --> B[Store State in Svelte Store]
    B --> C[Server Action: Build Prompt + Base64 Style Ref]
    C --> D[Gemini API: Generate Image]
    D --> E[Save PNG to /generated_images/ & Update characters.json]
    E --> F[Display/Refine/Save to Gallery]

    G[Gallery Load: Read JSON] --> H[Render Grid]
    H --> I[Modal: View Details]
    I --> J[Delete: Server Remove JSON Entry & File]

    K[Composer: Select Chars + Scene Inputs] --> L[Server: Stitch Refs with Sharp]
    L --> M[Build Prompt + Base64 (Style + Char Sheet)]
    M --> N[Gemini API: Group Scene]
    N --> O[Return Base64 to Client for Download]
```

### Security & Best Practices
- API Key: Store in .env (GEMINI_API_KEY); load via import.meta.env in server actions only.
- Input Sanitization: Trim/escape user texts; limit lengths (e.g., name <50 chars).
- File Handling: Generate unique filenames (timestamp + UUID); validate MIME types.
- Error Handling: Try-catch for API; user-friendly messages (e.g., "Generation failed, retry?").
- Debugging: ?debug=true queries store to show prompts/images in dev mode.

## 3. Components and Data Flows Outline

### Key Svelte Components
- **Layout.svelte**: Global styles, navigation (Home/Gallery/Composer links).
- **Creator/**: Stepper.svelte (navigation), PlaybookGrid.svelte, SpeciesGrid.svelte, DemeanorList.svelte, AppearanceTags.svelte, NameInput.svelte, Generation.svelte (loading, image, buttons).
- **Gallery.svelte**: CharacterCard.svelte (image + name), Modal.svelte (details + delete).
- **Composer.svelte**: SelectableGallery.svelte (checkboxes), SceneForm.svelte (inputs), GenerationPreview.svelte (debug + download).
- **Lib/**: Prompts.js (templates), api.js (Gemini client), data.js (JSON CRUD), imageUtils.js (stitching with Sharp).

### Data Flows Details
- **State Management**: Use Svelte stores for creator session (resets on save); load JSON via load functions in +page.server.js.
- **Server Actions**: FormActions for save/delete/generate; invalidateAll() for reactivity.
- **Image Handling**: Base64 from Gemini → fs.writeFileSync for PNG; paths relative to static/.

## 4. API Calls and Prompt Construction

### Gemini API Integration
- Client: `const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);` (server-only).
- Model: `gemini-1.5-flash-exp` or similar for image-to-image.
- Generation Config: { responseModalities: ["TEXT", "IMAGE"], generationConfig: { temperature: 0.7, aspectRatio: "1:1" for creator } }.

### Vagabond Creator API Call
- Inputs: User vars → Prompts.vagabondTemplate(vars).
- Contents:
  ```js
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-exp" });
  const styleBase64 = await fs.readFileSync('static/style_reference_sheet.png', 'base64');
  const result = await model.generateContent([
    { inlineData: { data: styleBase64, mimeType: 'image/png' } },
    { text: prompt }  // Narrative template from PRD 6.2
  ]);
  const imageBlob = await result.response.candidates[0].content.parts[0].inlineData.data;
  ```
- Prompt: As in PRD 6.2 template; square composition.

### Band Composer API Call
- Stitch: Use Sharp to composite selected images horizontally (e.g., sharp().composite()).
- Contents: Style ref + char sheet base64 + prompt (PRD 6.3 template; landscape).
- Similar generateContent call; return base64 for client-side download (a.download = URL.createObjectURL()).

### Prompt Construction
- Central in src/lib/prompts.js: Export functions vagabondPrompt(vars), bandPrompt(chars, location, action).
- Narrative style; interpolate vars; include order for chars in band.

## 5. File Structure and Dependencies

### Proposed Structure
```
src/
├── lib/
│   ├── components/  (shared UI)
│   ├── prompts.js
│   ├── api.js       (Gemini wrapper)
│   ├── data.js      (JSON read/write)
│   └── imageUtils.js (Sharp stitching)
├── routes/
│   ├── +layout.svelte (global styles)
│   ├── +page.svelte  (home/landing)
│   ├── creator/
│   │   └── +page.svelte (multi-screen router or conditional)
│   ├── gallery/
│   │   └── +page.svelte
│   └── composer/
│       └── +page.svelte
└── app.html (Tailwind)
static/
├── generated_images/ (runtime writes)
└── style_reference_sheet.png
```

### Dependencies (package.json)
- sveltekit: ^2.0.0
- tailwindcss: ^3.4.0, postcss, autoprefixer
- @google/generative-ai: ^0.2.0
- sharp: ^0.33.0 (image processing)
- uuid: ^9.0.0 (IDs)
- Dev: @sveltejs/adapter-auto, vitest

### Setup
- npx degit sveltekit/demo my-app
- npm i above deps
- tailwind.config.js: Extend theme with Root colors/fonts (Lora via Google Fonts).
- .env: GEMINI_API_KEY=...

## 6. Step-by-Step Implementation Guide

### Phase 1: Project Setup (1-2 days)
1. Initialize SvelteKit project; install deps; configure Tailwind with custom theme (earthy colors, fonts).
2. Add .env template; create static/style_reference_sheet.png placeholder.
3. Implement global Layout.svelte with textured bg (CSS gradient/noise), navigation.
4. Setup stores: creatorStore (writable for inputs), charactersStore (derived from JSON load).

### Phase 2: Vagabond Creator (3-4 days)
1. Create routes/creator/+page.svelte with stepper (use Svelte routing or tabs for screens).
2. Build UI components: Grids for playbook/species (hardcode options from Root lore), tags for demeanor/appearance (dynamic from playbook), inputs.
3. Implement state flow: On change, update store; Generation.svelte: Form action to server for prompt/API.
4. Server action: Construct prompt, call Gemini, save image (fs, unique name), append to JSON.
5. Add "Generate Again" (re-call with same prompt); debug mode (URLSearchParams, display prompt/image).
6. Mobile: Tailwind grid-cols-2 sm:grid-cols-3; touch events.

### Phase 3: Gallery (1-2 days)
1. routes/gallery/+page.svelte: Load JSON in +page.server.js, render CharacterCard grid (aspect-square, object-cover).
2. Modal: Use Svelte transition; display details from JSON; delete action (filter JSON, fs.unlink image).
3. Confirmation: SweetAlert or native confirm(); invalidate store on delete.
4. Responsive: Masonry or CSS grid; infinite scroll if >20 chars (unlikely).

### Phase 4: Band Composer (2-3 days)
1. routes/composer/+page.svelte: Reuse gallery grid with checkboxes (limit 2-5 validation).
2. SceneForm: Two textareas; on submit, server action.
3. Server: Load selected images, stitch with Sharp (horizontal, 512px height, spaced); base64 composite.
4. Construct band prompt (include char order); call Gemini (landscape aspect).
5. Client: Display generated image; download button (base64 to blob URL).
6. Debug: Preview stitched sheet if ?debug=true.
7. Considerations: Sharp error handling (missing images); API rate limits (queue if needed).

### Phase 5: Polish & Testing (1 day)
1. Add loading spinners (Svelte stores for async); error toasts.
2. UI Interactions: Hover/press effects (Tailwind variants).
3. Security: Sanitize inputs (DOMPurify if needed); key validation.
4. Test: Unit (prompts, stitching); E2E (Playwright for flows); mobile emulator.
5. Deploy: Adapter-auto; ensure /generated_images/ writable.

### Considerations
- **Mobile-First**: All components use responsive Tailwind; test on 320px width.
- **Image Stitching**: Server-side only (Sharp); handle async fs; fallback if Sharp fails (log error).
- **Debugging**: ?debug=true appends to all routes; console.log prompts in dev.
- **Security/Best Practices**: No client API calls; HTTPS in prod; backup JSON; UUID for IDs to avoid collisions.

---

## Review & Next Steps
- All phases align with spec; testable via acceptance scenarios.
- Total Estimate: 8-12 days for solo dev.
- Risks: Gemini API changes (monitor docs); image gen variability (tune temperature).

Proceed to code mode for implementation.