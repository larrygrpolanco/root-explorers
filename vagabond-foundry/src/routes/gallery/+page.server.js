import { readCharacters, deleteCharacter } from '$lib/data.js';
import fs from 'fs/promises';
import path from 'path';

export const load = async () => {
  try {
    const characters = await readCharacters();
    return {
      characters
    };
  } catch (error) {
    console.error('Failed to load characters:', error);
    return {
      characters: []
    };
  }
};

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id');

    if (!id) {
      return { success: false, error: 'No character ID provided' };
    }

    try {
      const characters = await readCharacters();
      const charToDelete = characters.find(c => c.id === id);

      if (charToDelete && charToDelete.image) {
        // Remove leading slash if present
        const imageRelPath = charToDelete.image.replace(/^\//, '');
        const imagePath = path.join(process.cwd(), 'static', imageRelPath);
        try {
          await fs.unlink(imagePath);
          console.log(`Deleted image: ${imagePath}`);
        } catch (unlinkError) {
          console.error('Failed to delete image:', unlinkError);
          // Don't fail the whole operation if image delete fails
        }
      }

      await deleteCharacter(id);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete character:', error);
      return { success: false, error: 'Failed to delete character' };
    }
  }
};