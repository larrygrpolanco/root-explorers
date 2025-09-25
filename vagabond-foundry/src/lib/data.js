import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const filePath = path.join(process.cwd(), 'static', 'characters.json');

export async function readCharacters() {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function writeCharacter(character) {
  const characters = await readCharacters();
  const newChar = { ...character, id: uuidv4() };
  characters.push(newChar);
  await fs.writeFile(filePath, JSON.stringify(characters, null, 2));
  return newChar;
}

export async function deleteCharacter(id) {
  const characters = await readCharacters();
  const filtered = characters.filter(c => c.id !== id);
  await fs.writeFile(filePath, JSON.stringify(filtered, null, 2));
  return filtered;
}

export async function saveImage(base64Data, mimeType = 'image/png') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `generated-${timestamp}.png`;
  const imagePath = path.join(process.cwd(), 'static', 'generated_images', filename);
  
  // Ensure directory exists
  const dir = path.dirname(imagePath);
  await fs.mkdir(dir, { recursive: true });
  
  const buffer = Buffer.from(base64Data, 'base64');
  await fs.writeFile(imagePath, buffer);
  
  return `/generated_images/${filename}`;
}