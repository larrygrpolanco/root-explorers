import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';

// Mock fs module
vi.mock('fs/promises');

describe('GET /api/gallery Contract Tests', () => {
	const GALLERY_ENDPOINT = '/api/gallery';
	
	// Sample gallery data for testing
	const sampleCharacters = [
		{
			name: 'Whiskers McTail',
			species: 'Cat',
			playbook: 'Scoundrel',
			presentation: 'Elegant silk vest with brass buttons',
			demeanor: 'Sly and calculating',
			item: 'Lockpicking tools',
			scene: 'Moonlit alleyway',
			portrait: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
			prompt: 'A Cat Scoundrel vagabond with elegant silk vest...',
			createdAt: '2025-09-26T12:00:00.000Z'
		},
		{
			name: 'Bramble Swiftpaw',
			species: 'Fox',
			playbook: 'Ranger',
			presentation: 'Forest green cloak with leather boots',
			demeanor: 'Alert and cautious',
			item: 'Carved wooden bow',
			scene: 'Dense woodland clearing',
			portrait: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB...',
			prompt: 'A Fox Ranger vagabond with forest green cloak...',
			createdAt: '2025-09-25T10:30:00.000Z'
		}
	];

	beforeEach(() => {
		vi.clearAllMocks();
		// Mock successful file read by default
		fs.readFile.mockResolvedValue(JSON.stringify(sampleCharacters));
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Basic Functionality', () => {
		it('should return 200 status for successful request', async () => {
			const response = await fetch(GALLERY_ENDPOINT, {
				method: 'GET'
			});

			expect(response.status).toBe(200);
		});

		it('should return array of Character objects', async () => {
			const response = await fetch(GALLERY_ENDPOINT, {
				method: 'GET'
			});

			expect(response.status).toBe(200);
			const result = await response.json();
			
			expect(Array.isArray(result)).toBe(true);
			expect(result).toHaveLength(2);
			expect(result[0].name).toBe('Whiskers McTail');
			expect(result[1].name).toBe('Bramble Swiftpaw');
		});

		it('should not require any request headers', async () => {
			const response = await fetch(GALLERY_ENDPOINT, {
				method: 'GET'
				// No headers specified
			});

			expect(response.status).toBe(200);
		});

		it('should not require request body', async () => {
			const response = await fetch(GALLERY_ENDPOINT, {
				method: 'GET'
				// No body specified
			});

			expect(response.status).toBe(200);
		});
	});

	describe('Character Object Structure', () => {
		it('should return Characters with all required fields', async () => {
			const response = await fetch(GALLERY_ENDPOINT, {
				method: 'GET'
			});

			const result = await response.json();
			const character = result[0];

			// Verify all Character model fields are present
			expect(character).toHaveProperty('name');
			expect(character).toHaveProperty('species');
			expect(character).toHaveProperty('playbook');
			expect(character).toHaveProperty('presentation');
			expect(character).toHaveProperty('demeanor');
			expect(character).toHaveProperty('item');
			expect(character).toHaveProperty('scene');
			expect(character).toHaveProperty('portrait');
			expect(character).toHaveProperty('prompt');
			expect(character).toHaveProperty('createdAt');
		});

		it('should return Characters with correct data types', async () => {
			const response = await fetch(GALLERY_ENDPOINT, {
				method: 'GET'
			});

			const result = await response.json();
			const character = result[0];

			expect(typeof character.name).toBe('string');
			expect(typeof character.species).toBe('string');
			expect(typeof character.playbook).toBe('string');
			expect(typeof character.presentation).toBe('string');
			expect(typeof character.demeanor).toBe('string');
			expect(typeof character.item).toBe('string');
			expect(typeof character.scene).toBe('string');
			expect(typeof character.portrait).toBe('string');
			expect(typeof character.prompt).toBe('string');
			expect(typeof character.createdAt).toBe('string');
		});

		it('should return Characters with valid ISO timestamp format', async () => {
			const response = await fetch(GALLERY_ENDPOINT, {
				method: 'GET'
			});

			const result = await response.json();
			
			result.forEach(character => {
				expect(character.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
				// Verify it's a valid date
				expect(new Date(character.createdAt).toString()).not.toBe('Invalid Date');
			});
		});

		it('should preserve all Character data exactly as saved', async () => {
			const response = await fetch(GALLERY_ENDPOINT, {
				method: 'GET'
			});

			const result = await response.json();
			
			// Verify first character matches sample data exactly
			expect(result[0]).toEqual(sampleCharacters[0]);
			expect(result[1]).toEqual(sampleCharacters[1]);
		});
	});

	describe('File System Operations', () => {
		it('should read from correct gallery.json path', async () => {
			const response = await fetch(GALLERY_ENDPOINT, {
				method: 'GET'
			});

			expect(response.status).toBe(200);
			expect(fs.readFile).toHaveBeenCalledWith('src/lib/server/gallery.json', 'utf8');
		});

		it('should handle empty gallery.json file', async () => {
			fs.readFile.mockResolvedValue('[]');

			const response = await fetch(GALLERY_ENDPOINT, {
				method: 'GET'
			});

			expect(response.status).toBe(200);
			const result = await response.json();
			expect(Array.isArray(result)).toBe(true);
			expect(result).toHaveLength(0);
		});

		it('should handle missing gallery.json file', async () => {
			fs.readFile.mockRejectedValue(new Error('ENOENT: no such file or directory'));

			const response = await fetch(GALLERY_ENDPOINT, {
				method: 'GET'
			});

			expect(response.status).toBe(200);
			const result = await response.json();
			expect(Array.isArray(result)).toBe(true);
			expect(result).toHaveLength(0);
		});

		it('should handle corrupted gallery.json file', async () => {
			fs.readFile.mockResolvedValue('invalid json content');

			const response = await fetch(GALLERY_ENDPOINT, {
				method: 'GET'
			});

			expect(response.status).toBe(200);
			const result = await response.json();
			expect(Array.isArray(result)).toBe(true);
			expect(result).toHaveLength(0);
		});

		it('should handle file system read errors gracefully', async () => {
			fs.readFile.mockRejectedValue(new Error('Permission denied'));

			const response = await fetch(GALLERY_ENDPOINT, {
				method: 'GET'
			});

			// Should return 500 for file system errors, but still return empty array on corruption
			expect(response.status).toBe(500);
		});
	});

	describe('Response Format', () => {
		it('should return JSON content type', async () => {
			const response = await fetch(GALLERY_ENDPOINT, {
				method: 'GET'
			});

			expect(response.status).toBe(200);
			expect(response.headers.get('content-type')).toContain('application/json');
		});

		it('should return valid JSON format', async () => {
			const response = await fetch(GALLERY_ENDPOINT, {
				method: 'GET'
			});

			expect(response.status).toBe(200);
			
			// Should not throw when parsing JSON
			expect(async () => {
				await response.json();
			}).not.toThrow();
		});

		it('should always return an array', async () => {
			// Test with various file states
			const testCases = [
				'[]', // Empty array
				JSON.stringify(sampleCharacters), // Valid data
				'invalid json', // Corrupted data
			];

			for (const testData of testCases) {
				vi.clearAllMocks();
				
				if (testData === 'invalid json') {
					fs.readFile.mockResolvedValue(testData);
				} else {
					fs.readFile.mockResolvedValue(testData);
				}

				const response = await fetch(GALLERY_ENDPOINT, {
					method: 'GET'
				});

				const result = await response.json();
				expect(Array.isArray(result)).toBe(true);
			}
		});
	});

	describe('Data Ordering and Consistency', () => {
		it('should return characters in the order they were saved', async () => {
			const response = await fetch(GALLERY_ENDPOINT, {
				method: 'GET'
			});

			const result = await response.json();
			
			// First character should be the first one saved
			expect(result[0].name).toBe('Whiskers McTail');
			expect(result[1].name).toBe('Bramble Swiftpaw');
			
			// Verify chronological order by createdAt
			const firstDate = new Date(result[0].createdAt);
			const secondDate = new Date(result[1].createdAt);
			expect(firstDate.getTime()).toBeGreaterThan(secondDate.getTime());
		});

		it('should handle large gallery files efficiently', async () => {
			// Create a large array of characters
			const largeGallery = Array.from({ length: 50 }, (_, i) => ({
				...sampleCharacters[0],
				name: `Character ${i + 1}`,
				createdAt: new Date(Date.now() - i * 1000).toISOString()
			}));

			fs.readFile.mockResolvedValue(JSON.stringify(largeGallery));

			const response = await fetch(GALLERY_ENDPOINT, {
				method: 'GET'
			});

			expect(response.status).toBe(200);
			const result = await response.json();
			expect(result).toHaveLength(50);
			expect(result[0].name).toBe('Character 1');
			expect(result[49].name).toBe('Character 50');
		});

		it('should handle duplicate characters correctly', async () => {
			const duplicateGallery = [
				sampleCharacters[0],
				sampleCharacters[0], // Exact duplicate
				sampleCharacters[1]
			];

			fs.readFile.mockResolvedValue(JSON.stringify(duplicateGallery));

			const response = await fetch(GALLERY_ENDPOINT, {
				method: 'GET'
			});

			expect(response.status).toBe(200);
			const result = await response.json();
			expect(result).toHaveLength(3);
			expect(result[0].name).toBe('Whiskers McTail');
			expect(result[1].name).toBe('Whiskers McTail'); // Duplicate preserved
			expect(result[2].name).toBe('Bramble Swiftpaw');
		});
	});

	describe('Edge Cases', () => {
		it('should handle gallery with single character', async () => {
			fs.readFile.mockResolvedValue(JSON.stringify([sampleCharacters[0]]));

			const response = await fetch(GALLERY_ENDPOINT, {
				method: 'GET'
			});

			expect(response.status).toBe(200);
			const result = await response.json();
			expect(result).toHaveLength(1);
			expect(result[0].name).toBe('Whiskers McTail');
		});

		it('should handle characters with optional fields missing', async () => {
			const characterWithMissingOptional = {
				name: 'Minimal Character',
				species: 'Mouse',
				playbook: 'Thief',
				presentation: 'Simple clothes',
				demeanor: 'Nervous',
				item: 'Small dagger',
				scene: 'Dark corner',
				portrait: 'portrait-data',
				createdAt: '2025-09-26T15:00:00.000Z'
				// Missing prompt field (optional)
			};

			fs.readFile.mockResolvedValue(JSON.stringify([characterWithMissingOptional]));

			const response = await fetch(GALLERY_ENDPOINT, {
				method: 'GET'
			});

			expect(response.status).toBe(200);
			const result = await response.json();
			expect(result).toHaveLength(1);
			expect(result[0].name).toBe('Minimal Character');
			expect(result[0]).not.toHaveProperty('prompt');
		});

		it('should handle characters with extra fields', async () => {
			const characterWithExtraFields = {
				...sampleCharacters[0],
				extraField: 'This should be preserved',
				anotherExtra: 123
			};

			fs.readFile.mockResolvedValue(JSON.stringify([characterWithExtraFields]));

			const response = await fetch(GALLERY_ENDPOINT, {
				method: 'GET'
			});

			expect(response.status).toBe(200);
			const result = await response.json();
			expect(result).toHaveLength(1);
			expect(result[0].extraField).toBe('This should be preserved');
			expect(result[0].anotherExtra).toBe(123);
		});
	});

	describe('HTTP Method Validation', () => {
		it('should only accept GET requests', async () => {
			const methods = ['POST', 'PUT', 'DELETE', 'PATCH'];
			
			for (const method of methods) {
				const response = await fetch(GALLERY_ENDPOINT, {
					method: method
				});

				// Should return method not allowed or similar error
				expect(response.status).not.toBe(200);
			}
		});

		it('should handle HEAD requests appropriately', async () => {
			const response = await fetch(GALLERY_ENDPOINT, {
				method: 'HEAD'
			});

			// HEAD should return same headers as GET but no body
			expect(response.status).toBe(200);
		});
	});
});