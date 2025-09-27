import { json } from '@sveltejs/kit';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';

/**
 * GET /api/gallery
 * 
 * Retrieves all saved characters from the gallery.json file.
 * Handles missing files and corrupted data gracefully.
 */
export async function GET() {
	try {
		// Path to gallery file
		const galleryPath = 'src/lib/server/gallery.json';
		
		try {
			// Read gallery file
			const fileContent = await readFile(galleryPath, 'utf-8');
			
			// Parse JSON content
			let galleryData;
			try {
				galleryData = JSON.parse(fileContent);
			} catch (parseError) {
				console.error('Gallery file contains invalid JSON, resetting to empty array:', parseError);
				
				// Reset corrupted file to empty array
				galleryData = [];
				await ensureDirectoryExists(galleryPath);
				await writeFile(galleryPath, JSON.stringify(galleryData, null, 2), 'utf-8');
			}
			
			// Ensure it's an array
			if (!Array.isArray(galleryData)) {
				console.warn('Gallery file contains non-array data, resetting to empty array');
				galleryData = [];
				await writeFile(galleryPath, JSON.stringify(galleryData, null, 2), 'utf-8');
			}
			
			// Validate each character in the gallery
			const validCharacters = galleryData.filter((characterData, index) => {
				try {
					// Basic validation - ensure required fields exist
					if (!characterData || typeof characterData !== 'object') {
						console.warn(`Invalid character data at index ${index}, skipping`);
						return false;
					}
					
					if (!characterData.name || !characterData.species || !characterData.playbook) {
						console.warn(`Character at index ${index} missing required fields, skipping`);
						return false;
					}
					
					return true;
				} catch (error) {
					console.warn(`Error validating character at index ${index}, skipping:`, error);
					return false;
				}
			});
			
			// If we filtered out invalid characters, update the file
			if (validCharacters.length !== galleryData.length) {
				console.log(`Filtered out ${galleryData.length - validCharacters.length} invalid characters from gallery`);
				await writeFile(galleryPath, JSON.stringify(validCharacters, null, 2), 'utf-8');
			}
			
			return json(validCharacters);
			
		} catch (fileError) {
			// File doesn't exist - return empty array and create the file
			if (fileError.code === 'ENOENT') {
				console.log('Gallery file not found, creating empty gallery');
				
				const emptyGallery = [];
				await ensureDirectoryExists(galleryPath);
				await writeFile(galleryPath, JSON.stringify(emptyGallery, null, 2), 'utf-8');
				
				return json(emptyGallery);
			}
			
			// Other file system errors
			console.error('File system error reading gallery:', fileError);
			throw fileError;
		}
		
	} catch (error) {
		console.error('Gallery endpoint error:', error);
		return json(
			{ error: 'Failed to load gallery. Please try again.' },
			{ status: 500 }
		);
	}
}

/**
 * Ensures the directory for the given file path exists
 * @param {string} filePath - The file path
 */
async function ensureDirectoryExists(filePath) {
	try {
		await mkdir(dirname(filePath), { recursive: true });
	} catch (error) {
		// Directory might already exist, ignore EEXIST errors
		if (error.code !== 'EEXIST') {
			throw error;
		}
	}
}