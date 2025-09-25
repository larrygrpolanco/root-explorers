## **PRD: The Vagabond Foundry**

### 1. Overview

**Project Name:** The Vagabond Foundry
**Project Goal:** To create a simple, mobile-first web application for a small group of friends to quickly generate character concepts and stylized art for their _Root: The Roleplaying Game_ campaign. The app will facilitate individual character creation, manage a gallery of created characters, and compose group scenes with consistent character art using image-to-image AI generation.
**Core Aesthetic:** A rustic, storybook illustration style that feels like an authentic extension of the _Root_ universe.

### 2. Target Audience

- The 5 players in our private _Root: The RPG_ campaign.
- The users are technically proficient and appreciate creative control, justifying the inclusion of custom input options.

### 3. Key Features & User Flows

#### **3.1. Feature: Vagabond Creator**

A multi-screen, non-linear flow for defining and generating a single character.

**User Story:** As a player, I want a guided but flexible process to create a visual for my character, with the ability to easily change my mind and refine the result until it's perfect.

**UX Flow:**
The creator will be presented as a series of steps, with a persistent navigation/stepper at the top (e.g., "1. Playbook > 2. Species > 3. Details..."). This allows the user to freely navigate back and forth between screens to change their selections at any time before the final save.

- **Screen 1: Choose Your Playbook**

  - **UI:** A grid of cards with playbook names and reference art.
  - **Prompt Variable:** `{playbook}`

- **Screen 2: Choose Your Species**

  - **UI:** A grid of species icons. Includes an "Other" button which, when selected, reveals a text input field for custom species.
  - **Prompt Variable:** `{species}`

- **Screen 3: What is Your Demeanor?**

  - **UI:** A list of selectable tags, filtered by the chosen playbook. An "Other" button at the bottom reveals a text input field for a custom demeanor.
  - **Prompt Variable:** `{demeanor}`

- **Screen 4: Describe Your Appearance**

  - **UI:** Two sets of selectable tags from the playbook's "Details" section. Both sets include an "Other" option with a text field.
  - **Category 1 (Physical):** E.g., "scarred," "well-groomed."
  - **Category 2 (Key Item/Trinket):** E.g., "tarnished locket," "faded military insignia."
  - **Prompt Variables:** `{physical_desc}`, `{trinket}`

- **Screen 5: Name Your Vagabond**

  - **UI:** A simple text input field.
  - **Data Variable:** `{char_name}`

- **Screen 6: Generation & Refinement**
  - **UI:** Displays a loading indicator, then the generated **square (1:1 aspect ratio)** image.
  - **Functionality:**
    - **"Generate Again" Button:** Re-runs the generation with the exact same prompt for a different result.
    - **"Save to Gallery" Button:** Finalizes the character, saves the data to `characters.json`, saves the image file to the server, and navigates the user to the Gallery.
    - **Navigation Stepper:** Remains active, allowing the user to go back to any previous screen to edit choices and return to Screen 6 to generate an updated image.

#### **3.2. Feature: The Gallery**

A persistent collection of all saved characters.

**User Story:** As a group, we want a central place to view all our characters, so we can see our band and manage our creations.

**Requirements:**

- **Layout:** A responsive grid of square "character cards." Each card will display the character's generated image and their `{char_name}`. CSS will enforce a `1:1` aspect ratio with `object-fit: cover` to ensure a clean, uniform grid.
- **Interaction:** Clicking a card opens a modal window.
- **Modal View:**
  - Displays the full-resolution image.
  - Lists key details: Name, Playbook, Species, Demeanor.
  - Contains a "Delete" button (with a confirmation step like "Are you sure?") that removes the character's data from the JSON file and deletes their image file from the server.

#### **3.3. Feature: Band Composer**

An advanced tool to generate a group scene using the existing character art as a reference for consistency.

**User Story:** As a GM, I want to create a group shot of the party in a specific setting by providing their existing portraits as a reference, ensuring the AI knows exactly what they look like.

**Requirements:**

- **Step 1: Character Selection**
  - **UI:** The Gallery grid with selectable checkboxes on each character. Allows selection of 2-5 characters.
- **Step 2: Scene Description**
  - **UI:** A form with two text inputs:
    1.  **Where are they?** (e.g., "In a tavern filled with shady patrons")
    2.  **What are they doing?** (e.g., "Arguing over a shared purse of coin")
- **Step 3: Image-to-Image Generation**
  - **Behind the Scenes:** Before calling the AI, the application will:
    1.  Retrieve the image files for the selected characters.
    2.  Programmatically "stitch" them together into a single, horizontal composite image (a "character reference sheet").
  - **API Call:** The app will send a request to the Gemini API that includes:
    1.  The composite reference sheet image.
    2.  A reference image for the _Root_ art style.
    3.  A text prompt constructed from the selected characters and scene descriptions.
  - **Output:** The generated group image is displayed to the user with a "Save to Device" button. These images are not saved to the Gallery.

### 4. UI/UX Principles ("The Root Feel")

- **Aesthetic:** Rustic, storybook, and tactile.
- **Color Palette:** Warm, earthy tones: forest greens, rich browns, parchment creams, and muted faction colors (red, blue) for accents.
- **Backgrounds:** Use subtle, textured backgrounds that resemble parchment or wood grain.
- **Typography:** A classic serif font (like Cormorant Garamond, Lora) for headings and a highly readable sans-serif for UI elements.
- **Interactions:** UI elements should have subtle, satisfying feedback. Buttons could have a slight "press" effect.

### 5. Technical & Data Specification

- **Frontend:** SvelteKit.
- **Styling:** Tailwind CSS.
- **AI Model:** Gemini API, specifically leveraging its image-to-image capabilities.
- **Data Persistence:** A single `characters.json` file stored in the web app's server directory.
  - **Data Structure:** The file will contain an array of character objects. Each object will follow this schema:
    ```json
    {
      "id": "unique_timestamp_or_uuid",
      "name": "Jinx",
      "playbook": "Vagrant",
      "species": "Opossum",
      "demeanor": "Mischievous",
      "physical_desc": "Patchwork clothes",
      "trinket": "Gambling paraphernalia",
      "imagePath": "/generated_images/1695641820.png",
      "prompt": "The full text prompt used to generate this image."
    }
    ```
- **Image Storage:** Generated character images will be saved as static files (e.g., `.png`) in a `/generated_images/` directory within the web app's file structure. The `imagePath` in the JSON will point to these files.

## **Section 6 - AI Generation & Prompting Strategy**

This new section replaces previous notes on prompting with a detailed strategy based on the Gemini 2.5 Flash Image API documentation.

### 6.1. Core Principle: Narrative Description

All prompts generated by the application will adhere to the principle of "Describe the scene, don't just list keywords." The templates will be structured as descriptive paragraphs to leverage the model's deep language understanding, resulting in more coherent and art-directed images.

### 6.2. Vagabond Creator: Style-Guided Text-to-Image

This feature will generate a single character portrait. To ensure a consistent _Root_ aesthetic across all generations, every API call will include a static, high-quality reference image that exemplifies the target art style.

- **Input Assembly:**

  1.  A **Style Reference Image** (`style_reference.png`) will be converted to a base64 string. This image will be a curated piece of official or style-matched art.
  2.  The **Text Prompt** will be constructed from user selections using the narrative template below.

- **Vagabond Prompt Template:**

  ```
  Create a full-body character portrait in the enchanting, rustic storybook art style of the provided reference image. The character is a {demeanor} {species} {playbook}. They have a {physical_desc} appearance and are carrying or wearing their {trinket}. The background should be a simple, muted, and slightly out-of-focus forest clearing, ensuring the focus remains entirely on the character. The image should be a square composition.
  ```

- **API `contents` Structure (Pseudo-code):**
  ```javascript
  const contents = [
    {
      // The Root style reference image
      inlineData: { mimeType: 'image/png', data: base64_style_image },
    },
    {
      // The dynamically generated text prompt
      text: 'Create a full-body character portrait...',
    },
  ];
  ```

Of course. That's an excellent refinement. Providing a curated "style sheet" is a much more robust way to guide the model than relying on a single image. It gives the AI more data points on what constitutes the "Root" aesthetic.

Here is the updated PRD section, specifically modifying the "Vagabond Creator" to reflect this more powerful image + text approach.

---

## **Section 6 - AI Generation & Prompting Strategy**

### 6.1. Core Principle: Narrative Description

All prompts generated by the application will adhere to the principle of "Describe the scene, don't just list keywords." The templates will be structured as descriptive paragraphs to leverage the model's deep language understanding, resulting in more coherent and art-directed images.

### 6.2. Vagabond Creator: Style-Guided Image + Text Generation

This feature will generate a single character portrait using a combined image and text prompt. To ensure high stylistic consistency across all generations, every API call will include a static, pre-compiled **style reference sheet** that serves as the definitive visual anchor for the _Root_ art style.

- **Input Assembly:**

  1.  A **Style Reference Sheet:** A single, curated image (`style_reference_sheet.png`) will be converted to a base64 string. This image will be a collage containing multiple character snippets and art examples taken directly from the _Root: The RPG_ rulebook. This gives the model a rich, unambiguous guide to the desired aesthetic.
  2.  The **Text Prompt:** The prompt will be constructed from user selections using the narrative template below, which explicitly instructs the model to adhere to the provided visual style guide.

- **Vagabond Prompt Template:**

  ```
  Using the provided style reference sheet as the definitive guide for the art style, create a full-body character portrait. The style must match the enchanting, rustic, painterly storybook illustration of the examples.

  The character is a {demeanor} {species} {playbook}. They have a {physical_desc} appearance and are carrying or wearing their {trinket}.

  The background should be a simple, muted, and slightly out-of-focus forest clearing, ensuring the focus remains entirely on the character. The image must be a square composition.
  ```

- **API `contents` Structure (Pseudo-code):**
  ```javascript
  const contents = [
    {
      // The pre-compiled Root style reference sheet
      inlineData: { mimeType: 'image/png', data: base64_style_sheet },
    },
    {
      // The dynamically generated text prompt
      text: 'Using the provided style reference sheet as the definitive guide...',
    },
  ];
  ```

### 6.3. Band Composer: Multi-Image Composition

This feature will generate a new group scene by using the previously generated character portraits as a direct visual reference, ensuring character consistency.

- **Input Assembly:**

  1.  The **Style Reference Image** (`style_reference.png`) is included, identical to the one used in the Vagabond Creator.
  2.  A **Character Reference Sheet** is created on-the-fly. The application will fetch the image files for the 2-5 selected characters and programmatically stitch them side-by-side into a single, wide PNG (`character_sheet.png`). This composite image is then converted to a base64 string.
  3.  The **Text Prompt** is constructed from the selected characters' data and the user's scene description.

- **Band Prompt Template:**

  ```
  Using the provided reference image for the overall art style, create a new group scene. The characters to be included are depicted in the provided character reference sheet. Please maintain their exact species, clothing, and appearance.

  The scene is set in {scene_location}. The characters are currently {scene_action}.

  From left to right, the characters are:
  1. A {char1_species} {char1_playbook}.
  2. A {char2_species} {char2_playbook}.
  3. (etc.)

  The lighting and mood should match the setting. The composition should be a landscape view that clearly shows all characters interacting with each other and the environment.
  ```

- **API `contents` Structure (Pseudo-code):**
  ```javascript
  const contents = [
    {
      // The Root style reference image
      inlineData: { mimeType: 'image/png', data: base64_style_image },
    },
    {
      // The stitched-together character reference sheet
      inlineData: { mimeType: 'image/png', data: base64_character_sheet },
    },
    {
      // The dynamically generated scene prompt
      text: 'Using the provided reference image for the overall art style...',
    },
  ];
  ```

This feature will generate a new group scene by using the previously generated character portraits as a direct visual reference, ensuring character consistency.

- **Input Assembly:**

  1.  The **Style Reference Sheet** (`style_reference_sheet.png`) is included, identical to the one used in the Vagabond Creator.
  2.  A **Character Reference Sheet** is created on-the-fly by stitching the selected character images into a single composite PNG.
  3.  The **Text Prompt** is constructed from the selected characters' data and the user's scene description.

- **Band Prompt Template:**

  ```
  Using the provided style reference sheet for the overall art style, create a new group scene. The characters to be included are depicted in the provided character reference sheet. Please maintain their exact species, clothing, and appearance.

  The scene is set in {scene_location}. The characters are currently {scene_action}.

  From left to right, the characters are:
  1. A {char1_species} {char1_playbook}.
  2. A {char2_species} {char2_playbook}.
  3. (etc.)

  The lighting and mood should match the setting. The composition should be a landscape view that clearly shows all characters interacting with each other and the environment.
  ```

- **API `contents` Structure (Pseudo-code):**
  ```javascript
  const contents = [
    {
      // The Root style reference sheet
      inlineData: { mimeType: 'image/png', data: base64_style_sheet },
    },
    {
      // The stitched-together character reference sheet
      inlineData: { mimeType: 'image/png', data: base64_character_sheet },
    },
    {
      // The dynamically generated scene prompt
      text: 'Using the provided style reference sheet for the overall art style...',
    },
  ];
  ```

### 6.4. Developer Experience & Debugging

The prompt management and debugging features remain as specified, but are now even more critical due to the complexity of the prompts.

- **Prompt Management:** All prompt templates will be stored in a central `src/lib/prompts.js` file for easy editing.
- **Debug Mode:** A `?debug=true` URL parameter will display the final, fully-constructed text prompt on the generation screen, allowing for easy copy/paste testing into external tools. For the Band Composer, it will also show a preview of the stitched "Character Reference Sheet" image before it's sent to the API.
