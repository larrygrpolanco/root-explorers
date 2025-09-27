Understood. This final detail is crucial for establishing the project's technical baseline. I will now integrate this information and provide the complete, non-truncated Product Requirements Document for your final review.

---

## **Product Requirements Document: Root Vagabond Portrait Creator**

- **Version:** 1.2 (Final)
- **Date:** September 26, 2025
- **Author:** Gemini (in collaboration with you)

### **1. Introduction & Vision**

This document outlines the requirements for the **Root Vagabond Portrait Creator**, a simple web application designed for a small group of friends who play the _Root_ RPG. The application will guide a user through a quick, thematic quiz to generate a unique, full-body character portrait in the art style of the game. The goal is to create a fun, fast, and visually appealing tool that enhances the role-playing experience.

## Clarifications

### Session 2025-09-26

- Q: How should the app handle failures when calling the Gemini API (e.g., rate limits, network errors, invalid responses)? → A: Simple error message with retry button.
- Q: What validation or error handling should be applied to quiz inputs (e.g., empty name, invalid custom text)? → A: Basic required field checks with inline messages.
- Q: Should we add acceptance criteria to define completion for each feature (e.g., quiz submits without errors)? → A: Basic bullets under a new section.
- Q: How should the app handle duplicate character names in the gallery (e.g., allow multiples or prevent)? → A: Allow duplicates.
- Q: What accessibility features should be included (e.g., screen reader support)? → A: Basic ARIA labels and keyboard navigation; prioritize mobile-first UI.

### **2. Target Audience**

The primary users are a small, private group of approximately 5 friends who are familiar with and play the _Root_ board game and RPG.

### **3. User Flow**

The user journey is designed to be simple, creative, and intuitive:

1.  **Landing Page:** The user arrives at a homepage with a rustic, woodland theme. They are presented with two choices: "Create a Vagabond" or "View the Gallery."
2.  **Character Quiz:**
    - The user is guided through a 3-step quiz.
    - For each multiple-choice question, the user can select one of the pre-written options OR select a "Custom" option to write their own descriptive text.
    - The user's choices (whether pre-written or custom) are stored as they progress.
3.  **Image Generation:** Upon submitting the quiz, the application sends the collected data to the server, which constructs a prompt and calls the Gemini API to generate the character portrait. The user will see a loading indicator during this process.
4.  **Results Page:** The generated character portrait is displayed. The user has three options:
    - **Save:** Saves the character's name, playbook, and portrait to the Gallery.
    - **Edit:** Opens a text box pre-filled with the prompt that generated the image, allowing the user to modify it and regenerate the portrait.
    - **Try Again:** Takes the user back to the beginning of the quiz to start over.
5.  **Gallery:** A persistent, view-only page displaying all the "Saved" character portraits with their name and playbook.

### **4. Key Features**

#### **4.1. Dynamic Character Creation Quiz**

- **Description:** A multi-step, narrative-driven quiz designed to gather rich, descriptive details for the AI prompt. Crucially, every multiple-choice question will also include a "Custom" field, allowing users to override pre-written options with their own text for maximum creative control.
- **User Stories:**
  - As a user, I want to choose from a list of thematic descriptions to quickly build my character's identity.
  - As a user, I want the flexibility to write my own description for _any_ aspect of my character if the pre-written options don't perfectly match my vision.
  - As a user, I want the quiz to be broken into logical steps so it feels organized and engaging.

- **Requirements & Structure:**

  **Step 1: The Essentials**
  - **Name:** A standard text input field.
  - **Species:** A dropdown/select list using the predefined species.
  - **Playbook:** A dropdown/select list using the predefined playbooks.
  - Input Validation: Perform basic required field checks (e.g., non-empty name) with inline error messages.

  **Step 2: The Character** (Each question below includes a final "Custom..." radio option which, when selected, reveals a text input field).
  - **How do they present themselves?**
    - [ ] Dressed for the long road, in practical, well-worn leather and a heavy cloak.
    - [ ] In mismatched finery, wearing a silken scarf and a surprisingly fancy hat.
    - [ ] Covered in pouches, tools, and odd trinkets, with a smudge of soot on their cheek.
    - [ ] In simple, functional clothes, worn and patched from countless scrapes and escapes.
    - [ ] **Custom...** _(Reveals text input)_
  - **What is their signature demeanor?**
    - [ ] A friendly and disarming smile, quick to win over strangers.
    - [ ] A sharp, intense gaze, always scanning their surroundings for threats.
    - [ ] A quiet and thoughtful expression, lost in their own thoughts.
    - [ ] A nervous, fidgety energy, ready to bolt at the slightest surprise.
    - [ ] **Custom...** _(Reveals text input)_
  - **What small, defining item do they carry?**
    - [ ] A beautifully carved wooden flute they often play.
    - [ ] A single, oversized, and very rusty key.
    - [ ] A worn map with a destination that keeps changing.
    - [ ] A lucky coin they are constantly flipping.
    - [ ] **Custom...** _(Reveals text input)_

  **Step 3: The Scene**
  - **Right now, where do we find them?**
    - [ ] ...taking a quiet rest, leaning against a mossy tree in the forest.
    - [ ] ...peeking cautiously around the corner of a building in a bustling clearing.
    - [ ] ...standing atop a hill, looking out over the Woodland at sunset.
    - [ ] ...huddled around a small campfire at night, cooking a meager meal.
    - [ ] **Custom...** _(Reveals text input)_

- **Data Handling and State Management:**
  - To ensure clarity during development, the user's choices must be managed in a clean state object (e.g., a Svelte store).
  - This object will map each quiz section to the chosen string. The string will either be the text of the pre-written option or the content of the custom input field.
  - **Example Data Object:**
    ```javascript
    {
      "name": "Birch",
      "species": "Badger",
      "playbook": "Arbiter",
      "presentation": "In mismatched finery, wearing a silken scarf and a surprisingly fancy hat.",
      "demeanor": "A sharp, intense gaze, always scanning their surroundings for threats.",
      "item": "A locket that won't open", // This was a custom user entry
      "scene": "...standing atop a hill, looking out over the Woodland at sunset."
    }
    ```
  - This data object will be the single source of truth passed from the frontend to the SvelteKit server route for prompt construction.

#### **4.2. AI Image Generation**

- **Description:** The core feature that translates user choices into a visual portrait. The SvelteKit backend will be responsible for securely making API calls to the Google AI Gemini API.
- **Requirements:**
  - The backend will receive the final character data object from the client.
  - It will dynamically construct a detailed prompt string using the values from the object. This eliminates complex logic and simply inserts the strings.
  - **Example Prompt Generation:**
    > "Full body portrait of **[name]**, a **[species]** **[playbook]**. Their demeanor is defined by: **[demeanor]**. They are dressed **[presentation]**. They carry **[item]**. We find them **[scene]**. In the vibrant, storybook art style of Kyle Ferrin's Root board game, textured and expressive."
  - The API call should include a reference image of the _Root_ art style to guide the model's output (text+image prompting).
  - Error Handling: Display a simple error message with a retry button on API failures (e.g., rate limits, network errors, invalid responses). Log errors server-side.

#### **4.3. Character Gallery**

- **Description:** A simple page to display all saved characters, creating a shared collection for the friend group.
- **User Stories:**
  - As a user, I want to see all the characters my friends and I have created and saved in one place.
  - As a user, I want to easily identify each character by their portrait, name, and playbook.
- **Requirements:**
  - The gallery will be a grid or list of saved characters.
  - Each entry will display the generated image, the character name, and the playbook name.
  - Data will be stored simply on the server in a JSON file.
  - Uniqueness: Allow duplicate names for simplicity; no conflict resolution needed.

### **5. Design & UI/UX Guidelines**

- **Theme:** The aesthetic should be rustic, tactile, and inspired by the woodland setting of _Root_. Think paper textures, wood grains, and earthy elements.
- **Color Palette:** Use earthy tones: browns, greens, oranges, and creams found in the game's components.
- **Typography:** Select a serif font for headings and a clean sans-serif for body text that evokes a fantasy or storybook feel.
- **Layout:** The design should be clean, simple, and responsive (mobile-first for primary phone usage).
- **Accessibility:** Include basic ARIA labels for screen readers and ensure keyboard navigation support.

### **6. Technical Considerations**

- **Project Setup:** The project will be contained within a folder named `root`. This folder will contain a standard SvelteKit installation configured to use JavaScript (not TypeScript).
- **Frontend:** SvelteKit.
- **Backend:** SvelteKit server routes will handle the API call to Gemini.
- **AI Model:** Gemini Flash or a similar efficient model via the Gemini API. A direct server-side HTTP request will be made to the API endpoint.
- **Data Storage:** A single JSON file on the server is sufficient for storing gallery data (e.g., `src/lib/server/gallery.json`).
- **Security:** As this is an internal tool for friends, user authentication is not required. The Gemini API key must be stored securely as an environment variable on the server (e.g., in a `.env` file) and should never be exposed to the client-side.

### **7. Out of Scope (Features for Future Consideration)**

- User accounts and authentication.
- A dedicated "Download Image" button (users can save via their browser's native functionality).
- Editing or deleting characters from the gallery.
- Complex animations or page transitions.
- Sharing to social media.

### **8. Acceptance Criteria**

- **Quiz:** All steps can be completed, required fields validated (e.g., non-empty name), data object forms correctly without errors.
- **Image Generation:** Prompt is constructed from user inputs, API is called successfully, image displays on results page, or error message with retry shows on failure.
- **Gallery:** Characters save to JSON file, gallery page loads and displays all saved entries with image, name, and playbook.
- **Overall:** App is responsive on mobile/desktop, follows rustic theme, loads quickly, no authentication required, secure API key handling.
