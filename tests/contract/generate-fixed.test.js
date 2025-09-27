import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '../../src/routes/api/generate/+server.js';
import { createMockRequestEvent, extractResponse } from '../helpers/server-test-helper.js';

// Mock the environment variable
vi.mock('$env/static/private', () => ({
	GEMINI_API_KEY: 'test-api-key-12345'
}));

// Mock the Google Generative AI
vi.mock('@google/generative-ai', () => ({
	GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
		getGenerativeModel: vi.fn().mockReturnValue({
			generateContent: vi.fn().mockResolvedValue({
				response: {
					text: () => 'Generated text response'
				}
			})
		})
	}))
}));

describe('POST /api/generate Contract Tests', () => {
	// Valid test data based on Character model
	const validQuizData = {
	  name: 'Whiskers McTail',
	  speciesRole: 'a cunning cat scoundrel',
	  presentation: 'Elegant silk vest with brass buttons and leather belt',
	  demeanor: 'Sly, calculating, and always watchful for opportunities',
	  item: 'A set of finely crafted lockpicking tools hidden in pockets',
	  scene: 'In a shadowy moonlit alleyway behind the old tavern'
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Request Validation', () => {
		it('should accept valid quiz data with all required fields', async () => {
			const requestEvent = createMockRequestEvent('POST', '/api/generate', validQuizData);
			const response = await POST(requestEvent);
			const result = await extractResponse(response);

			expect(result.status).toBe(200);
			const data = await result.json();

			// Verify all input fields are preserved
			expect(data.name).toBe(validQuizData.name);
			expect(data.speciesRole).toBe(validQuizData.speciesRole);
			expect(data.presentation).toBe(validQuizData.presentation);
			expect(data.demeanor).toBe(validQuizData.demeanor);
			expect(data.item).toBe(validQuizData.item);
			expect(data.scene).toBe(validQuizData.scene);

			// Verify generated fields are added
			expect(data.portrait).toBeDefined();
			expect(data.prompt).toBeDefined();
			expect(typeof data.portrait).toBe('string');
			expect(typeof data.prompt).toBe('string');
		});

		it('should reject request with missing name field', async () => {
			const invalidData = { ...validQuizData };
			delete invalidData.name;

			const requestEvent = createMockRequestEvent('POST', '/api/generate', invalidData);
			const response = await POST(requestEvent);
			const result = await extractResponse(response);

			expect(result.status).toBe(500);
			const data = await result.json();
			expect(data.error).toBeDefined();
		});

		it('should reject request with empty name field', async () => {
			const invalidData = { ...validQuizData, name: '' };

			const requestEvent = createMockRequestEvent('POST', '/api/generate', invalidData);
			const response = await POST(requestEvent);
			const result = await extractResponse(response);

			expect(result.status).toBe(500);
			const data = await result.json();
			expect(data.error).toBeDefined();
		});

		it('should reject request with name exceeding 50 characters', async () => {
			const invalidData = {
				...validQuizData,
				name: 'A'.repeat(51) // 51 characters, exceeds limit
			};

			const requestEvent = createMockRequestEvent('POST', '/api/generate', invalidData);
			const response = await POST(requestEvent);
			const result = await extractResponse(response);

			expect(result.status).toBe(500);
			const data = await result.json();
			expect(data.error).toBeDefined();
		});

		it('should reject request with speciesRole less than 20 characters', async () => {
		  const invalidData = { ...validQuizData, speciesRole: 'Short' };

			const requestEvent = createMockRequestEvent('POST', '/api/generate', invalidData);
			const response = await POST(requestEvent);
			const result = await extractResponse(response);

			expect(result.status).toBe(500);
			const data = await result.json();
			expect(data.error).toBeDefined();
		});

		it('should reject request with speciesRole exceeding 300 characters', async () => {
		  const longText = 'A'.repeat(301);
		  const invalidData = { ...validQuizData, speciesRole: longText };

			const requestEvent = createMockRequestEvent('POST', '/api/generate', invalidData);
			const response = await POST(requestEvent);
			const result = await extractResponse(response);

			expect(result.status).toBe(500);
			const data = await result.json();
			expect(data.error).toBeDefined();
		});

		it('should reject request with description fields exceeding 300 characters', async () => {
		  const longText = 'A'.repeat(301); // 301 characters, exceeds limit
		  const invalidData = { ...validQuizData, presentation: longText };

			const requestEvent = createMockRequestEvent('POST', '/api/generate', invalidData);
			const response = await POST(requestEvent);
			const result = await extractResponse(response);

			expect(result.status).toBe(500);
			const data = await result.json();
			expect(data.error).toBeDefined();
		});
	});

	describe('Response Format', () => {
		it('should return complete Character object with all required fields', async () => {
			const requestEvent = createMockRequestEvent('POST', '/api/generate', validQuizData);
			const response = await POST(requestEvent);
			const result = await extractResponse(response);

			// Debug: Let's see what error we're getting
			if (result.status !== 200) {
				const errorData = await result.json();
				console.log('Error response:', errorData);
			}

			expect(result.status).toBe(200);
			const data = await result.json();

			// Verify all Character model fields are present
			expect(data).toHaveProperty('name');
			expect(data).toHaveProperty('speciesRole');
			expect(data).toHaveProperty('presentation');
			expect(data).toHaveProperty('demeanor');
			expect(data).toHaveProperty('item');
			expect(data).toHaveProperty('scene');
			expect(data).toHaveProperty('portrait');
			expect(data).toHaveProperty('prompt');

			// Verify data types
			expect(typeof data.name).toBe('string');
			expect(typeof data.speciesRole).toBe('string');
			expect(typeof data.presentation).toBe('string');
			expect(typeof data.demeanor).toBe('string');
			expect(typeof data.item).toBe('string');
			expect(typeof data.scene).toBe('string');
			expect(typeof data.portrait).toBe('string');
			expect(typeof data.prompt).toBe('string');
		});

		it('should preserve input data in response', async () => {
			const requestEvent = createMockRequestEvent('POST', '/api/generate', validQuizData);
			const response = await POST(requestEvent);
			const result = await extractResponse(response);

			const data = await result.json();

			// All input fields should be preserved exactly
			Object.keys(validQuizData).forEach((key) => {
				expect(data[key]).toBe(validQuizData[key]);
			});
		});
	});
});
