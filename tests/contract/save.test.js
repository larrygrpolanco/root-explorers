import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';

// Mock fs module
vi.mock('fs/promises');

describe('POST /api/save Contract Tests', () => {
	const SAVE_ENDPOINT = '/api/save';
	
	// Valid Character object (complete from /generate response)
	const validCharacter = {
		name: 'Whiskers McTail',
		species: 'Cat',
		playbook: 'Scoundrel',
		presentation: 'Elegant silk vest with brass buttons',
		demeanor: 'Sly and calculating',
		item: 'Lockpicking tools',
		scene: 'Moonlit alleyway',
		portrait: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
		prompt: 'A Cat Scoundrel vagabond with elegant silk vest...'
	};

	const expectedSuccessResponse = {
		success: true,
		message: 'Character saved to gallery'
	};

	beforeEach(() => {
		vi.clearAllMocks();
		// Mock successful file operations by default
		fs.readFile.mockResolvedValue('[]');
		fs.writeFile.mockResolvedValue();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Request Validation', () => {
		it('should accept valid Character object with all required fields', async () => {
			const response = await fetch(SAVE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(validCharacter)
			});

			expect(response.status).toBe(200);
			const result = await response.json();
			expect(result.success).toBe(true);
			expect(result.message).toBe('Character saved to gallery');
		});

		it('should reject request with missing name field', async () => {
			const invalidCharacter = { ...validCharacter };
			delete invalidCharacter.name;

			const response = await fetch(SAVE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(invalidCharacter)
			});

			expect(response.status).toBe(400);
			const result = await response.json();
			expect(result.error).toBe('Invalid character data');
		});

		it('should reject request with empty name field', async () => {
			const invalidCharacter = { ...validCharacter, name: '' };

			const response = await fetch(SAVE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(invalidCharacter)
			});

			expect(response.status).toBe(400);
			const result = await response.json();
			expect(result.error).toBe('Invalid character data');
		});

		it('should reject request with missing portrait field', async () => {
			const invalidCharacter = { ...validCharacter };
			delete invalidCharacter.portrait;

			const response = await fetch(SAVE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(invalidCharacter)
			});

			expect(response.status).toBe(400);
			const result = await response.json();
			expect(result.error).toBe('Invalid character data');
		});

		it('should reject request with empty portrait field', async () => {
			const invalidCharacter = { ...validCharacter, portrait: '' };

			const response = await fetch(SAVE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(invalidCharacter)
			});

			expect(response.status).toBe(400);
			const result = await response.json();
			expect(result.error).toBe('Invalid character data');
		});

		it('should accept Character without createdAt and add timestamp', async () => {
			const characterWithoutTimestamp = { ...validCharacter };
			delete characterWithoutTimestamp.createdAt;

			const response = await fetch(SAVE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(characterWithoutTimestamp)
			});

			expect(response.status).toBe(200);
			const result = await response.json();
			expect(result.success).toBe(true);

			// Verify that createdAt was added during save process
			expect(fs.writeFile).toHaveBeenCalled();
			const writeCall = fs.writeFile.mock.calls[0];
			const savedData = JSON.parse(writeCall[1]);
			expect(savedData[0]).toHaveProperty('createdAt');
			expect(savedData[0].createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/); // ISO timestamp format
		});

		it('should preserve existing createdAt if provided', async () => {
			const existingTimestamp = '2025-09-26T12:00:00.000Z';
			const characterWithTimestamp = { 
				...validCharacter, 
				createdAt: existingTimestamp 
			};

			const response = await fetch(SAVE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(characterWithTimestamp)
			});

			expect(response.status).toBe(200);
			
			// Verify that existing createdAt was preserved
			expect(fs.writeFile).toHaveBeenCalled();
			const writeCall = fs.writeFile.mock.calls[0];
			const savedData = JSON.parse(writeCall[1]);
			expect(savedData[0].createdAt).toBe(existingTimestamp);
		});
	});

	describe('Gallery File Operations', () => {
		it('should read existing gallery.json and append new character', async () => {
			const existingCharacter = {
				name: 'Existing Character',
				species: 'Fox',
				playbook: 'Ranger',
				presentation: 'Forest gear',
				demeanor: 'Cautious',
				item: 'Bow',
				scene: 'Deep woods',
				portrait: 'existing-portrait-data',
				prompt: 'existing-prompt',
				createdAt: '2025-09-25T10:00:00.000Z'
			};

			fs.readFile.mockResolvedValue(JSON.stringify([existingCharacter]));

			const response = await fetch(SAVE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(validCharacter)
			});

			expect(response.status).toBe(200);
			expect(fs.readFile).toHaveBeenCalledWith('src/lib/server/gallery.json', 'utf8');
			expect(fs.writeFile).toHaveBeenCalled();

			// Verify that new character was appended to existing data
			const writeCall = fs.writeFile.mock.calls[0];
			const savedData = JSON.parse(writeCall[1]);
			expect(savedData).toHaveLength(2);
			expect(savedData[0]).toEqual(existingCharacter);
			expect(savedData[1].name).toBe(validCharacter.name);
		});

		it('should handle empty gallery.json file', async () => {
			fs.readFile.mockResolvedValue('[]');

			const response = await fetch(SAVE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(validCharacter)
			});

			expect(response.status).toBe(200);
			expect(fs.writeFile).toHaveBeenCalled();

			// Verify that character was added to empty array
			const writeCall = fs.writeFile.mock.calls[0];
			const savedData = JSON.parse(writeCall[1]);
			expect(savedData).toHaveLength(1);
			expect(savedData[0].name).toBe(validCharacter.name);
		});

		it('should handle missing gallery.json file by creating new one', async () => {
			fs.readFile.mockRejectedValue(new Error('ENOENT: no such file or directory'));

			const response = await fetch(SAVE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(validCharacter)
			});

			expect(response.status).toBe(200);
			expect(fs.writeFile).toHaveBeenCalled();

			// Verify that new file was created with single character
			const writeCall = fs.writeFile.mock.calls[0];
			const savedData = JSON.parse(writeCall[1]);
			expect(savedData).toHaveLength(1);
			expect(savedData[0].name).toBe(validCharacter.name);
		});

		it('should handle corrupted gallery.json by resetting to empty array', async () => {
			fs.readFile.mockResolvedValue('invalid json content');

			const response = await fetch(SAVE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(validCharacter)
			});

			expect(response.status).toBe(200);
			expect(fs.writeFile).toHaveBeenCalled();

			// Verify that corrupted file was reset and character was added
			const writeCall = fs.writeFile.mock.calls[0];
			const savedData = JSON.parse(writeCall[1]);
			expect(savedData).toHaveLength(1);
			expect(savedData[0].name).toBe(validCharacter.name);
		});

		it('should allow duplicate characters to be saved', async () => {
			// Setup existing gallery with same character
			fs.readFile.mockResolvedValue(JSON.stringify([validCharacter]));

			const response = await fetch(SAVE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(validCharacter)
			});

			expect(response.status).toBe(200);
			expect(fs.writeFile).toHaveBeenCalled();

			// Verify that duplicate was allowed
			const writeCall = fs.writeFile.mock.calls[0];
			const savedData = JSON.parse(writeCall[1]);
			expect(savedData).toHaveLength(2);
			expect(savedData[0].name).toBe(validCharacter.name);
			expect(savedData[1].name).toBe(validCharacter.name);
		});
	});

	describe('Error Handling', () => {
		it('should return 400 for invalid JSON in request body', async () => {
			const response = await fetch(SAVE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: 'invalid json'
			});

			expect(response.status).toBe(400);
			const result = await response.json();
			expect(result.error).toBe('Invalid character data');
		});

		it('should return 400 for non-object request body', async () => {
			const response = await fetch(SAVE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify('not an object')
			});

			expect(response.status).toBe(400);
			const result = await response.json();
			expect(result.error).toBe('Invalid character data');
		});

		it('should return 500 for file system write errors', async () => {
			fs.readFile.mockResolvedValue('[]');
			fs.writeFile.mockRejectedValue(new Error('Permission denied'));

			const response = await fetch(SAVE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(validCharacter)
			});

			expect(response.status).toBe(500);
			const result = await response.json();
			expect(result.error).toBe('Save failed');
		});

		it('should return proper error format for all error cases', async () => {
			const invalidCharacter = { ...validCharacter };
			delete invalidCharacter.name;

			const response = await fetch(SAVE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(invalidCharacter)
			});

			expect(response.status).toBe(400);
			const result = await response.json();
			expect(result).toHaveProperty('error');
			expect(typeof result.error).toBe('string');
			expect(result.error.length).toBeGreaterThan(0);
		});
	});

	describe('Response Format', () => {
		it('should return success response with correct format', async () => {
			const response = await fetch(SAVE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(validCharacter)
			});

			expect(response.status).toBe(200);
			const result = await response.json();
			
			expect(result).toHaveProperty('success');
			expect(result).toHaveProperty('message');
			expect(result.success).toBe(true);
			expect(typeof result.message).toBe('string');
			expect(result.message).toBe('Character saved to gallery');
		});

		it('should return consistent error response format', async () => {
			fs.writeFile.mockRejectedValue(new Error('File system error'));

			const response = await fetch(SAVE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(validCharacter)
			});

			expect(response.status).toBe(500);
			const result = await response.json();
			
			expect(result).toHaveProperty('error');
			expect(result).not.toHaveProperty('success');
			expect(result).not.toHaveProperty('message');
			expect(typeof result.error).toBe('string');
		});
	});

	describe('Data Integrity', () => {
		it('should preserve all Character fields when saving', async () => {
			const response = await fetch(SAVE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(validCharacter)
			});

			expect(response.status).toBe(200);
			expect(fs.writeFile).toHaveBeenCalled();

			const writeCall = fs.writeFile.mock.calls[0];
			const savedData = JSON.parse(writeCall[1]);
			const savedCharacter = savedData[0];

			// Verify all original fields are preserved
			Object.keys(validCharacter).forEach(key => {
				expect(savedCharacter[key]).toBe(validCharacter[key]);
			});
		});

		it('should write to correct gallery.json path', async () => {
			const response = await fetch(SAVE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(validCharacter)
			});

			expect(response.status).toBe(200);
			expect(fs.readFile).toHaveBeenCalledWith('src/lib/server/gallery.json', 'utf8');
			expect(fs.writeFile).toHaveBeenCalledWith(
				'src/lib/server/gallery.json',
				expect.any(String),
				'utf8'
			);
		});

		it('should write valid JSON format', async () => {
			const response = await fetch(SAVE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(validCharacter)
			});

			expect(response.status).toBe(200);
			expect(fs.writeFile).toHaveBeenCalled();

			const writeCall = fs.writeFile.mock.calls[0];
			const writtenContent = writeCall[1];
			
			// Verify that written content is valid JSON
			expect(() => JSON.parse(writtenContent)).not.toThrow();
			
			const parsedContent = JSON.parse(writtenContent);
			expect(Array.isArray(parsedContent)).toBe(true);
		});
	});
});