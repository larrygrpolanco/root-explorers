import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generateContent = async (contents) => {
  console.log('Starting content generation with:', JSON.stringify(contents, null, 2));
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set');
    throw new Error('GEMINI_API_KEY is not set');
  }
  
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-exp' });
  const result = await model.generateContent(contents);
  console.log('API generation completed successfully');
  const response = result.response;
  const candidate = response.candidates[0];
  
  if (!candidate) {
    console.error('No candidates in response');
    throw new Error('No candidates in response');
  }
  
  const part = candidate.content.parts[0];
  if (part.inlineData) {
    console.log('Image generated successfully');
    return {
      image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
      prompt: contents.find(c => c.text)?.text || ''
    };
  }
  
  console.error('No image generated in response');
  throw new Error('No image generated');
};