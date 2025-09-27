import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function generatePortrait(quizData) {
  const { build, height, species, furColor, eyeColor, definingFeature, typicalExpression, treasuredItem, preferredClothing } = quizData;
  
  const colorType = furColor;
  
  const prompt = `Full body portrait of a ${build} ${height} ${species} vagabond. They have ${colorType} fur and ${eyeColor} eyes. Their most defining feature is ${definingFeature}. Their typical expression is ${typicalExpression}. They are wearing ${preferredClothing} and carrying ${treasuredItem}. In the vibrant, storybook art style of Kyle Ferrin's Root board game, textured and expressive.`;
  
  try {
    const result = await genAI.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: [prompt]
    });
    const response = result;
    const imagePart = response.candidates[0]?.content?.parts?.find(part => part.inline_data);
    if (imagePart && imagePart.inline_data) {
      const base64 = imagePart.inline_data.data;
      const imageUrl = `data:image/png;base64,${base64}`;
      return { prompt, imageUrl };
    } else {
      throw new Error('No image generated');
    }
  } catch (error) {
    console.error('API Error in generatePortrait:', error);
    // Fallback to mock
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const imageUrl = `https://via.placeholder.com/400x600/${randomColor}/${randomColor}?text=${encodeURIComponent(`${species} Vagabond`)}`;
    return { prompt, imageUrl };
  }
}

export async function generateImage(prompt, base64Image) {
  try {
    const contents = base64Image
      ? [prompt, { inlineData: { data: base64Image, mimeType: 'image/png' } }]
      : [prompt];
    const result = await genAI.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents
    });
    const response = result;
    const imagePart = response.candidates[0]?.content?.parts?.find(part => part.inline_data);
    if (imagePart && imagePart.inline_data) {
      const base64 = imagePart.inline_data.data;
      return { image: `data:image/png;base64,${base64}` };
    }
    const text = response.candidates[0]?.content?.parts[0]?.text || '';
    return { text };
  } catch (error) {
    console.error('API Error in generateImage:', error);
    return { error: error.message };
  }
}

export async function editImage(prompt, base64Image) {
  return generateImage(prompt, base64Image);
}