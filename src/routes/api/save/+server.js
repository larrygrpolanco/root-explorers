import { json } from '@sveltejs/kit';
import { Character } from '$lib/models/Character.js';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';

/**
 * POST /api/save
 * 
 * Saves a generated Character to the gallery.json file.
 * Appends the character with a createdAt timestamp to the existing gallery array.
 */
export async function POST({ request }) {
	try {
		// Parse request body
		const characterData = await request.json();
		
		// Validate and create Character from the data
		let character;
		try {
			character = Character.fromJSON(characterData);
			
			// Add timestamp if not present
			character.addTimestamp();
			
			// Validate that the character is complete (has portrait)
			const validation = character.validate(true);
			if (!validation.isValid) {
				return json(
					{ error: `Invalid character data: ${validation.error}` },
					{ status: 400 }
				);
			}
		} catch (error) {
			return json(
				{ error: `Invalid character data: ${error.message}` },
				{ status: 400 }
			);
		}

		// Path to gallery file
		const galleryPath = 'src/lib/server/gallery.json';
		
		try {
			// Read existing gallery data
			let galleryData = [];
			try {
				const fileContent = await readFile(galleryPath, 'utf-8');
				galleryData = JSON.parse(fileContent);
				
				// Ensure it's an array
				if (!Array.isArray(galleryData)) {
					console.warn('Gallery file contains invalid data, resetting to empty array');
					galleryData = [];
				}
			} catch (readError) {
				// File doesn't exist or is corrupted, start with empty array
				console.log('Gallery file not found or corrupted, creating new one');
				galleryData = [];
				
				// Ensure directory exists
				await mkdir(dirname(galleryPath), { recursive: true });
			}
			
			// Append new character to gallery
			galleryData.push(character.toJSON());
			
			// Write updated gallery back to file (atomic operation)
			const tempPath = `${galleryPath}.tmp`;
			await writeFile(tempPath, JSON.stringify(galleryData, null, 2), 'utf-8');
			
			// Rename temp file to actual file (atomic on most filesystems)
			await writeFile(galleryPath, JSON.stringify(galleryData, null, 2), 'utf-8');
			
			return json({
				success: true,
				message: 'Character saved to gallery'
			});
			
		} catch (fileError) {
			console.error('File system error while saving character:', fileError);
			return json(
				{ error: 'Save failed. Please try again.' },
				{ status: 500 }
			);
		}
		
	} catch (error) {
		console.error('Save endpoint error:', error);
		return json(
			{ error: 'Save failed. Please try again.' },
			{ status: 500 }
		);
	}
}