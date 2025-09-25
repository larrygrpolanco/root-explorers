import { generateContent } from '$lib/api.js';
import { vagabondPrompt } from '$lib/prompts.js';
import { saveImage, writeCharacter } from '$lib/data.js';
import fs from 'fs';
import path from 'path';

const stylePath = path.join(process.cwd(), 'static', 'style_reference_sheet.png');

export const actions = {
  generate: async ({ request }) => {
    const data = await request.formData();
    const formData = Object.fromEntries(data);
    const debug = formData.debug === 'true';
    const character = {
      playbook: formData.playbook,
      species: formData.species,
      demeanor: formData.demeanor,
      physical_desc: formData.physical_desc,
      trinket: formData.trinket,
      char_name: formData.char_name
    };
    let prompt, image;

    if (debug) {
      prompt = vagabondPrompt(character);
      const safeName = formData.char_name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      image = `/generated_images/${safeName}_portrait.png`;
      console.log('Debug mode: Generated prompt:', prompt);
    } else {
      prompt = vagabondPrompt(character);
      const styleBase64 = fs.readFileSync(stylePath, 'base64');
      const contents = [
        { inlineData: { data: styleBase64, mimeType: 'image/png' } },
        { text: prompt }
      ];

      let result;
      try {
        result = await generateContent(contents);
        image = result.image;
      } catch (error) {
        if (error.message.includes('GEMINI_API_KEY')) {
          // Mock a simple image base64 (1x1 transparent)
          image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
        } else {
          return { success: false, error: error.message };
        }
      }
    }

    return { success: true, image, prompt };
  },

  save: async ({ request }) => {
    const data = await request.formData();
    const formData = Object.fromEntries(data);
    let imagePath = formData.generatedImage;

    if (imagePath.startsWith('data:')) {
      const base64Data = imagePath.split(',')[1]; // Remove data URL prefix
      imagePath = await saveImage(base64Data);
    } // Else: dummy path from debug, use as-is (no saveImage)

    const character = {
      ...formData,
      imagePath, // Use spec schema key
      id: undefined // Let writeCharacter generate UUID
    };
    const savedChar = await writeCharacter(character);
    return { success: true, character: savedChar };
  }
};