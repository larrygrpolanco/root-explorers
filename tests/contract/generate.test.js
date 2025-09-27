import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('POST /api/generate Contract Tests', () => {
  const GENERATE_ENDPOINT = '/api/generate';
  
  // Valid test data based on Character model
  const validQuizData = {
    name: 'Whiskers McTail',
    speciesRole: 'a cunning fox as a thief',
    presentation: 'Elegant silk vest with brass buttons',
    demeanor: 'Sly and calculating',
    item: 'Lockpicking tools',
    scene: 'Moonlit alleyway'
  };

  const expectedCharacterResponse = {
    name: 'Whiskers McTail',
    speciesRole: 'a cunning fox as a thief',
    presentation: 'Elegant silk vest with brass buttons',
    demeanor: 'Sly and calculating',
    item: 'Lockpicking tools',
    scene: 'Moonlit alleyway',
    portrait: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
    prompt: 'Full body portrait of Whiskers McTail, a cunning fox as a thief. Their demeanor is defined by: Sly and calculating. They are dressed Elegant silk vest with brass buttons. They carry Lockpicking tools. We find them Moonlit alleyway. In the vibrant, storybook art style of Kyle Ferrin's Root board game, textured and expressive.'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Request Validation', () => {
    it('should accept valid quiz data with all required fields', async () => {
      // Mock successful Gemini API response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ portrait: 'mock-image-data', prompt: 'mock-prompt' })
      });

      const response = await fetch(GENERATE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validQuizData)
      });

      expect(response.ok).toBe(true);
      const result = await response.json();
      
      // Verify all input fields are preserved
      expect(result.name).toBe(validQuizData.name);
      expect(result.speciesRole).toBe(validQuizData.speciesRole);
      expect(result.presentation).toBe(validQuizData.presentation);
      expect(result.demeanor).toBe(validQuizData.demeanor);
      expect(result.item).toBe(validQuizData.item);
      expect(result.scene).toBe(validQuizData.scene);
      
      // Verify generated fields are added
      expect(result.portrait).toBeDefined();
      expect(result.prompt).toBeDefined();
      expect(typeof result.portrait).toBe('string');
      expect(typeof result.prompt).toBe('string');
    });

    it('should reject request with missing name field', async () => {
      const invalidData = { ...validQuizData };
      delete invalidData.name;

      const response = await fetch(GENERATE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      });

      expect(response.status).toBe(500);
      const result = await response.json();
      expect(result.error).toBeDefined();
    });

    it('should reject request with name less than 2 characters', async () => {
      const invalidData = { ...validQuizData, name: 'A' };

      const response = await fetch(GENERATE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      });

      expect(response.status).toBe(500);
      const result = await response.json();
      expect(result.error).toBeDefined();
    });

    it('should reject request with name exceeding 50 characters', async () => {
      const invalidData = { 
        ...validQuizData, 
        name: 'A'.repeat(51) // 51 characters, exceeds limit
      };

      const response = await fetch(GENERATE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      });

      expect(response.status).toBe(500);
      const result = await response.json();
      expect(result.error).toBeDefined();
    });

    it('should reject request with speciesRole less than 20 characters', async () => {
      const invalidData = { ...validQuizData, speciesRole: 'Short' };

      const response = await fetch(GENERATE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      });

      expect(response.status).toBe(500);
      const result = await response.json();
      expect(result.error).toBeDefined();
    });

    it('should reject request with speciesRole exceeding 300 characters', async () => {
      const longText = 'A'.repeat(301);
      const invalidData = { ...validQuizData, speciesRole: longText };

      const response = await fetch(GENERATE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      });

      expect(response.status).toBe(500);
      const result = await response.json();
      expect(result.error).toBeDefined();
    });

    it('should reject request with description fields exceeding 300 characters', async () => {
      const longText = 'A'.repeat(301); // 301 characters, exceeds limit
      const invalidData = { ...validQuizData, presentation: longText };

      const response = await fetch(GENERATE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      });

      expect(response.status).toBe(500);
      const result = await response.json();
      expect(result.error).toBeDefined();
    });
  });

  describe('Gemini API Integration', () => {
    it('should handle successful Gemini API response', async () => {
      const mockGeminiResponse = {
        portrait: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        prompt: 'A detailed prompt for a vagabond character'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGeminiResponse
      });

      const response = await fetch(GENERATE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validQuizData)
      });

      expect(response.ok).toBe(true);
      const result = await response.json();
      expect(result.portrait).toBe(mockGeminiResponse.portrait);
      expect(result.prompt).toBe(mockGeminiResponse.prompt);
    });

    it('should handle Gemini API failure gracefully', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Gemini API Error'));

      const response = await fetch(GENERATE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validQuizData)
      });

      expect(response.status).toBe(500);
      const result = await response.json();
      expect(result.error).toBe('Generation failed. Please try again.');
    });

    it('should handle Gemini API timeout', async () => {
      global.fetch.mockImplementationOnce(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      );

      const response = await fetch(GENERATE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validQuizData)
      });

      expect(response.status).toBe(500);
      const result = await response.json();
      expect(result.error).toBe('Generation failed. Please try again.');
    });
  });

  describe('Response Format', () => {
    it('should return complete Character object with all required fields', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          portrait: 'mock-portrait-data',
          prompt: 'mock-constructed-prompt'
        })
      });

      const response = await fetch(GENERATE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validQuizData)
      });

      expect(response.ok).toBe(true);
      const result = await response.json();

      // Verify all Character model fields are present
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('speciesRole');
      expect(result).toHaveProperty('presentation');
      expect(result).toHaveProperty('demeanor');
      expect(result).toHaveProperty('item');
      expect(result).toHaveProperty('scene');
      expect(result).toHaveProperty('portrait');
      expect(result).toHaveProperty('prompt');

      // Verify data types
      expect(typeof result.name).toBe('string');
      expect(typeof result.speciesRole).toBe('string');
      expect(typeof result.presentation).toBe('string');
      expect(typeof result.demeanor).toBe('string');
      expect(typeof result.item).toBe('string');
      expect(typeof result.scene).toBe('string');
      expect(typeof result.portrait).toBe('string');
      expect(typeof result.prompt).toBe('string');
    });

    it('should preserve input data in response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          portrait: 'generated-portrait',
          prompt: 'generated-prompt'
        })
      });

      const response = await fetch(GENERATE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validQuizData)
      });

      const result = await response.json();

      // All input fields should be preserved exactly
      Object.keys(validQuizData).forEach(key => {
        expect(result[key]).toBe(validQuizData[key]);
      });
    });
  });

  describe('Error Handling', () => {
    it('should return proper error format for validation failures', async () => {
      const invalidData = { ...validQuizData, name: 'A' };

      const response = await fetch(GENERATE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData)
      });

      expect(response.status).toBe(500);
      const result = await response.json();
      expect(result).toHaveProperty('error');
      expect(typeof result.error).toBe('string');
      expect(result.error.length).toBeGreaterThan(0);
    });

    it('should return proper error format for API failures', async () => {
      global.fetch.mockRejectedValueOnce(new Error('API Error'));

      const response = await fetch(GENERATE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validQuizData)
      });

      expect(response.status).toBe(500);
      const result = await response.json();
      expect(result.error).toBe('Generation failed. Please try again.');
    });
  });
});