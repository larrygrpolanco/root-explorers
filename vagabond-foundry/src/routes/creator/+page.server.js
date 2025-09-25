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
    const character = {
      playbook: formData.playbook,
      species: formData.species,
      demeanor: formData.demeanor,
      physical_desc: formData.physical_desc,
      trinket: formData.trinket,
      char_name: formData.char_name
    };
    const prompt = vagabondPrompt(character);

    const styleBase64 = fs.readFileSync(stylePath, 'base64');
    const contents = [
      { inlineData: { data: styleBase64, mimeType: 'image/png' } },
      { text: prompt }
    ];

    let result;
    try {
      result = await generateContent(contents);
    } catch (error) {
      if (error.message.includes('GEMINI_API_KEY')) {
        // Mock a simple image base64 (1x1 transparent)
        result = {
          image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
          prompt
        };
      } else {
        return { success: false, error: error.message };
      }
    }

    return { success: true, image: result.image, prompt: result.prompt };
  },

  save: async ({ request }) => {
    const data = await request.formData();
    const formData = Object.fromEntries(data);
    const base64Data = formData.generatedImage.split(',')[1]; // Remove data URL prefix
    const imagePath = await saveImage(base64Data);
    const character = {
      ...formData,
      generatedImage: imagePath, // Store path instead of base64
      id: undefined // Let writeCharacter generate UUID
    };
    const savedChar = await writeCharacter(character);
    return { success: true, character: savedChar };
  }
};