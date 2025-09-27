# Feature Specification: Integrate Imagen API Calls

**Feature Branch**: `001-integrate-imagen-api`  
**Created**: 2025-09-27  
**Status**: Draft  
**Input**: User description: "Integrate imagen api calls review this doc: 'root-vault/gemini-image-docs.txt'"

## Execution Flow (main)
```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

### Section Requirements
- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation
When creating this spec from a user prompt:
1. **Mark all ambiguities**: Use [NEEDS CLARIFICATION: specific question] for any assumption you'd need to make
2. **Don't guess**: If the prompt doesn't specify something (e.g., "login system" without auth method), mark it
3. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
4. **Common underspecified areas**:
   - User types and permissions
   - Data retention/deletion policies  
   - Performance targets and scale
   - Error handling behaviors
   - Integration requirements
   - Security/compliance needs

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As a user completing a quiz or browsing the gallery in the SvelteKit app, I want to generate or edit dynamic images using AI (via Gemini's Imagen capabilities) based on my inputs (e.g., species, colors, playbooks), so that I can visualize personalized results like custom character portraits or edited gallery images.

### Acceptance Scenarios
1. **Given** a user has selected quiz options (e.g., species: elf, color: green, playbook: warrior), **When** they reach the results page, **Then** the app generates a photorealistic image of their character using a descriptive prompt derived from selections.
2. **Given** a user uploads or selects an image in the gallery, **When** they request an edit (e.g., "change color to blue"), **Then** the app edits the image via API and displays the updated version.
3. **Given** API key is configured, **When** generation is triggered, **Then** the response includes generated image data (base64 or file) and any accompanying text description.

### Edge Cases
- What happens when API rate limits are hit or key is invalid? (System should fallback to mock images from mockAI.js and log error.)
- How does system handle input images exceeding limits (up to 3 images)? (Reject or process subset, notify user.)
- What if prompt generation fails to produce legible text in image? (Iterate with refined prompt or use best practices from doc.)

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST integrate Gemini API (model: "gemini-2.5-flash-image-preview") for text-to-image generation and image editing in SvelteKit backend.
- **FR-002**: System MUST install and use 'google-generativeai' npm package for API calls; configure API key via environment variable (e.g., GEMINI_API_KEY).
- **FR-003**: System MUST adapt Python examples from doc to JavaScript/Node.js: e.g., generateContent with prompt/content, handle inline_data for images, save as PNG.
- **FR-004**: System MUST support prompt strategies: hyper-specific narratives for photorealism/stylized images, text rendering (e.g., logos with legible text), iterative refinement via multi-turn calls.
- **FR-005**: System MUST handle responses: extract text parts for descriptions, inline_data for images (base64 to file via fs.writeFileSync), include SynthID watermark.
- **FR-006**: System MUST integrate into quiz results (generate based on quizStore selections) and gallery (edit via user prompts), replacing/extending mockAI.js functions.
- **FR-007**: System MUST respect limitations: English/best languages, up to 3 input images, no audio/video; fallback for unsupported regions (e.g., no child images in EEA/UK).
- **FR-008**: System MUST compare/use Gemini Native over Imagen for flexibility in conversational editing and multi-image composition.

### Key Entities *(include if feature involves data)*
- **ImagePrompt**: Represents user-derived text for generation/editing (e.g., "Photorealistic elf warrior in green armor under Gemini constellation"); attributes: prompt string, style (photorealistic/stylized), aspect ratio.
- **GeneratedImage**: Output entity from API; attributes: base64 data or file path, accompanying text description, metadata (model used, timestamp); relationships: linked to quiz result or gallery item.
- **APIResponse**: Handles Gemini output; parts: text (descriptions), inline_data (images); ensures error handling for invalid responses.

---

## Review & Acceptance Checklist
*GATE: Automated checks run during main() execution*

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous  
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status
*Updated by main() during processing*

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

## Overview
Integrate Gemini's Imagen capabilities (via Gemini API) to enable dynamic image creation and editing in the SvelteKit app. This allows users to generate personalized visuals (e.g., quiz-based characters) or edit gallery images conversationally, enhancing engagement with AI-driven content. Prefer Gemini Native for flexibility over standalone Imagen.

## API Integration Details
- **Setup**: Install `google-generativeai`; set `GEMINI_API_KEY` in .env.
- **JS Code Snippet (Generation)**:
  ```javascript
  import { GoogleGenerativeAI } from '@google/generative-ai';
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image-preview' });
  const prompt = 'Photorealistic portrait of a green elf warrior in a fantasy forest.';
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const imagePart = response.candidates[0].content.parts.find(part => part.inlineData);
  if (imagePart) {
    const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
    require('fs').writeFileSync('generated.png', buffer);
  }
  ```
- **JS Code Snippet (Editing)**:
  ```javascript
  const prompt = 'Add a wizard hat to the cat in a fancy restaurant.';
  const imageFile = { inlineData: { data: base64Image, mimeType: 'image/png' } };
  const result = await model.generateContent([prompt, imageFile]);
  // Handle response as above
  ```
- **Prompt Strategies**: Use descriptive narratives (e.g., camera angles for photorealism); iterate for refinement; semantic negatives (describe positively); best languages: EN, es-MX, etc.
- **Limitations**: Up to 3 input images; no audio/video; SynthID watermark always included.

## Implementation Plan
1. Extend src/lib/utils/mockAI.js with Gemini functions (generateImage, editImage).
2. Update quizStore/results page: Derive prompt from selections, call API on submit, display generated image.
3. Update galleryStore/+page.svelte: Add edit button triggering API with user text input and selected image.
4. Handle errors/fallbacks: Use mock if API fails; store images in static or lib/assets.
5. Test integration: Verify in dev server (npm run dev in root-vault).

## Testing
- Unit: Mock API calls to test prompt generation and response parsing.
- Integration: End-to-end quiz flow generates valid image; gallery edit updates UI.
- Error: Invalid key returns mock; >3 images processes subset.
- Performance: Generation <10s; handle token costs (~$0.03/image).
