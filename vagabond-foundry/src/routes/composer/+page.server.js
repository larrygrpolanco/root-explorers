import { readCharacters } from '$lib/data.js';
import { bandPrompt } from '$lib/prompts.js';
import { generateContent } from '$lib/api.js';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const styleRefPath = path.join(process.cwd(), 'static', 'style_reference_sheet.png');

export const load = async () => {
  try {
    const characters = await readCharacters();
    return { characters };
  } catch (error) {
    console.error('Failed to load characters:', error);
    return { characters: [] };
  }
};

export const actions = {
  generate: async ({ request, url }) => {
    const formData = await request.formData();
    const selectedIdsStr = formData.get('selectedIds');
    const location = formData.get('location')?.trim() || '';
    const action = formData.get('action')?.trim() || '';
    const debug = url.searchParams.has('debug');

    if (!selectedIdsStr) {
      return { success: false, error: 'No characters selected' };
    }

    const selectedIds = selectedIdsStr.split(',').filter(id => id);
    if (selectedIds.length < 2 || selectedIds.length > 5) {
      return { success: false, error: 'Select 2-5 characters' };
    }

    if (!location || !action) {
      return { success: false, error: 'Location and action required' };
    }

    try {
      const characters = await readCharacters();
      const selectedChars = selectedIds
        .map(id => characters.find(c => c.id === id))
        .filter(Boolean);

      if (selectedChars.length !== selectedIds.length) {
        return { success: false, error: 'Some characters not found' };
      }

      // Stitch character sheet
      let stitchedSheet = '';
      try {
        const composites = [];
        for (const char of selectedChars) {
          const imageRelPath = char.image.replace(/^\//, '');
          const imagePath = path.join(process.cwd(), 'static', imageRelPath);
          const imageBuffer = await fs.readFile(imagePath);
          const resized = await sharp(imageBuffer)
            .resize({ height: 512, width: 512, fit: 'inside' })
            .png()
            .toBuffer();
          composites.push({ input: resized, top: 0, left: composites.length * 532 }); // 512 + 20 gap
        }

        const stitchedBuffer = await sharp({
          create: {
            width: selectedChars.length * 532 - 20, // total width minus last gap
            height: 512,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          }
        })
          .composite(composites)
          .png()
          .toBuffer();

        stitchedSheet = `data:image/png;base64,${stitchedBuffer.toString('base64')}`;
      } catch (stitchError) {
        console.error('Stitching failed:', stitchError);
        return { success: false, error: 'Failed to prepare character sheet' };
      }

      // Build prompt
      const prompt = bandPrompt(location, action, selectedChars);

      // Style reference
      const styleBuffer = await fs.readFile(styleRefPath);
      const styleBase64 = styleBuffer.toString('base64');

      // Generate
      let generatedImage = '';
      if (process.env.GEMINI_API_KEY) {
        const contents = [
          { inlineData: { data: styleBase64, mimeType: 'image/png' } },
          { inlineData: { data: stitchedSheet.split(',')[1], mimeType: 'image/png' } },
          { text: prompt }
        ];
        const result = await generateContent(contents);
        generatedImage = result.image;
        prompt = result.prompt; // from api
      } else {
        // Mock: simple landscape placeholder
        const mockBuffer = await sharp({
          create: {
            width: 1024,
            height: 576,
            channels: 3,
            background: { r: 34, g: 139, b: 34 } // forest green
          }
        })
          .composite([
            {
              input: Buffer.from('<svg><rect width="100%" height="100%" fill="url(#grad)"/><defs><linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#228B22"/><stop offset="100%" stop-color="#006400"/></linearGradient></defs></svg>'),
              top: 0,
              left: 0
            }
          ])
          .png()
          .toBuffer();
        generatedImage = `data:image/png;base64,${mockBuffer.toString('base64')}`;
      }

      return {
        success: true,
        image: generatedImage,
        prompt,
        ...(debug && { stitchedSheet })
      };
    } catch (error) {
      console.error('Generation failed:', error);
      return { success: false, error: 'Generation failed: ' + error.message };
    }
  }
};