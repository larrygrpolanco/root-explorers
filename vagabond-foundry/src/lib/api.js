import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generateContent = async (contents) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
  }
  
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-exp' });
  const result = await model.generateContent(contents);
  const response = result.response;
  const candidate = response.candidates[0];
  
  if (!candidate) {
    throw new Error('No candidates in response');
  }
  
  const part = candidate.content.parts[0];
  if (part.inlineData) {
    return {
      image: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
      prompt: contents.find(c => c.text)?.text || ''
    };
  }
  
  throw new Error('No image generated');
};