import { fail } from '@sveltejs/kit';
import { generatePortrait } from '$lib/server/gemini.js';

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const quizData = Object.fromEntries(formData);

    // Required fields check (minimal, based on destructuring)
    const required = ['build', 'height', 'species', 'furColor', 'eyeColor', 'definingFeature', 'typicalExpression', 'treasuredItem', 'preferredClothing'];
    const missing = required.filter(key => !quizData[key]);
    if (missing.length > 0) {
      return fail(400, { error: `Missing fields: ${missing.join(', ')}` });
    }

    try {
      const result = await generatePortrait(quizData);
      return { success: true, result: { ...quizData, ...result } };
    } catch (error) {
      console.error('Gemini generation error:', error);
      return fail(500, { error: 'Failed to generate image. Please check your API key and try again.' });
    }
  }
};
