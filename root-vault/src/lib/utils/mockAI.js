import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image-preview' });

export async function generatePortrait(quizData) {
  const { build, height, species, furColor, eyeColor, definingFeature, typicalExpression, treasuredItem, preferredClothing } = quizData;
  
  const colorType = furColor;
  
  const prompt = `Full body portrait of a ${build} ${height} ${species} vagabond. They have ${colorType} fur and ${eyeColor} eyes. Their most defining feature is ${definingFeature}. Their typical expression is ${typicalExpression}. They are wearing ${preferredClothing} and carrying ${treasuredItem}. In the vibrant, storybook art style of Kyle Ferrin's Root board game, textured and expressive.`;
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const imagePart = response.candidates[0]?.content?.parts?.find(part => part.inlineData);
    if (imagePart && imagePart.inlineData) {
      const base64 = imagePart.inlineData.data;
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
    let content;
    if (base64Image) {
      content = [prompt, { inlineData: { data: base64Image, mimeType: 'image/png' } }];
    } else {
      content = prompt;
    }
    const result = await model.generateContent(content);
    const response = await result.response;
    const imagePart = response.candidates[0]?.content?.parts?.find(part => part.inlineData);
    if (imagePart && imagePart.inlineData) {
      const base64 = imagePart.inlineData.data;
      return { image: `data:image/png;base64,${base64}` };
    }
    const text = response.text();
    return { text };
  } catch (error) {
    console.error('API Error in generateImage:', error);
    return { error: error.message };
  }
}

export async function editImage(prompt, base64Image) {
  return generateImage(prompt, base64Image);
}