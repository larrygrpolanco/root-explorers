import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const filePath = path.join(process.cwd(), 'static', 'characters.json');

export async function readCharacters() {
  console.log('Reading characters from JSON');
  try {
    const data = await fs.readFile(filePath, 'utf8');
    let characters = JSON.parse(data);
    // Normalize schema: Convert old 'image' to 'imagePath' for backward compatibility
    characters = characters.map(char => {
      if (char.image && !char.imagePath) {
        char.imagePath = char.image;
        delete char.image;
      }
      return char;
    });
    // Write back normalized data
    await fs.writeFile(filePath, JSON.stringify(characters, null, 2));
    console.log(`Successfully read and normalized ${characters.length} characters`);
    return characters;
  } catch (error) {
    console.error('Error reading characters:', error);
    if (error.code === 'ENOENT') {
      console.log('No characters file found, returning empty array');
      return [];
    }
    throw error;
  }
}

export async function writeCharacter(character) {
  console.log('Writing new character:', character);
  const characters = await readCharacters();
  // Ensure imagePath is set (from caller or fallback)
  const newChar = {
    ...character,
    imagePath: character.imagePath || '',
    id: uuidv4()
  };
  // Remove old 'generatedImage' if present
  delete newChar.generatedImage;
  characters.push(newChar);
  await fs.writeFile(filePath, JSON.stringify(characters, null, 2));
  console.log('Successfully wrote character:', newChar.id);
  return newChar;
}

export async function deleteCharacter(id) {
  console.log('Deleting character:', id);
  const characters = await readCharacters();
  const filtered = characters.filter(c => c.id !== id);
  await fs.writeFile(filePath, JSON.stringify(filtered, null, 2));
  console.log(`Successfully deleted character, remaining: ${filtered.length}`);
  return filtered;
}

export async function saveImage(base64Data, mimeType = 'image/png') {
  console.log('Saving image with base64 length:', base64Data.length);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `generated-${timestamp}.png`;
  const imagePath = path.join(process.cwd(), 'static', 'generated_images', filename);
  
  // Ensure directory exists
  const dir = path.dirname(imagePath);
  await fs.mkdir(dir, { recursive: true });
  
  const buffer = Buffer.from(base64Data, 'base64');
  await fs.writeFile(imagePath, buffer);
  
  console.log('Successfully saved image:', filename);
  return `/generated_images/${filename}`;
}