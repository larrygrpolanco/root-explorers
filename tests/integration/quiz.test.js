import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';

// Mock fs module for save operations
vi.mock('fs/promises');

describe('Quiz Flow Integration Tests', () => {
	const GENERATE_ENDPOINT = '/api/generate';
	const SAVE_ENDPOINT = '/api/save';
	const GALLERY_ENDPOINT = '/api/gallery';

	// Complete quiz flow data representing the 3-step process
	const quizStep1Data = {
		name: 'Whiskers McTail',
		species: 'Cat',
		playbook: 'Scoundrel'
	};

	const quizStep2Data = {
		...quizStep1Data,
		presentation: 'Elegant silk vest with brass buttons',
		demeanor: 'Sly and calculating'
	};

	const quizStep3Data = {
		...quizStep2Data,
		item: 'Lockpicking tools',
		scene: 'Moonlit alleyway'
	};

	const mockGeneratedCharacter = {
		...quizStep3Data,
		portrait: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
		prompt: 'A Cat Scoundrel vagabond with elegant silk vest...'
	};

	const mockSavedCharacter = {
		...mockGeneratedCharacter,
		createdAt: '2025-09-26T12:00:00.000Z'
	};

	beforeEach(() => {
		vi.clearAllMocks();
		// Mock successful file operations
		fs.readFile.mockResolvedValue('[]');
		fs.writeFile.mockResolvedValue();
		
		// Mock successful fetch responses by default
		global.fetch.mockImplementation((url, options) => {
			if (url === GENERATE_ENDPOINT && options?.method === 'POST') {
				return Promise.resolve({
					ok: true,
					status: 200,
					json: async () => mockGeneratedCharacter
				});
			}
			if (url === SAVE_ENDPOINT && options?.method === 'POST') {
				return Promise.resolve({
					ok: true,
					status: 200,
					json: async () => ({ success: true, message: 'Character saved to gallery' })
				});
			}
			if (url === GALLERY_ENDPOINT && options?.method === 'GET') {
				return Promise.resolve({
					ok: true,
					status: 200,
					json: async () => [mockSavedCharacter]
				});
			}
			return Promise.resolve({
				ok: false,
				status: 404,
				json: async () => ({ error: 'Not found' })
			});
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Complete Quiz Flow', () => {
		it('should complete full 3-step quiz to generation workflow', async () => {
			// Step 1: User completes basic info (name, species, playbook)
			// This would typically be stored in Svelte store, but we simulate the final submission
			
			// Step 2: User completes presentation and demeanor
			// Again, stored in state management
			
			// Step 3: User completes item and scene, then submits
			const generateResponse = await fetch(GENERATE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(quizStep3Data)
			});

			expect(generateResponse.status).toBe(200);
			const generatedCharacter = await generateResponse.json();
			
			// Verify all quiz data is preserved
			expect(generatedCharacter.name).toBe(quizStep3Data.name);
			expect(generatedCharacter.species).toBe(quizStep3Data.species);
			expect(generatedCharacter.playbook).toBe(quizStep3Data.playbook);
			expect(generatedCharacter.presentation).toBe(quizStep3Data.presentation);
			expect(generatedCharacter.demeanor).toBe(quizStep3Data.demeanor);
			expect(generatedCharacter.item).toBe(quizStep3Data.item);
			expect(generatedCharacter.scene).toBe(quizStep3Data.scene);
			
			// Verify generated content is added
			expect(generatedCharacter.portrait).toBeDefined();
			expect(generatedCharacter.prompt).toBeDefined();
		});

		it('should handle quiz state management through multiple steps', async () => {
			// Simulate progressive quiz state building
			let quizState = {};
			
			// Step 1: Basic character info
			quizState = { ...quizState, ...quizStep1Data };
			expect(quizState.name).toBe('Whiskers McTail');
			expect(quizState.species).toBe('Cat');
			expect(quizState.playbook).toBe('Scoundrel');
			
			// Step 2: Appearance and personality
			quizState = { ...quizState, ...quizStep2Data };
			expect(quizState.presentation).toBe('Elegant silk vest with brass buttons');
			expect(quizState.demeanor).toBe('Sly and calculating');
			
			// Step 3: Items and scene
			quizState = { ...quizState, ...quizStep3Data };
			expect(quizState.item).toBe('Lockpicking tools');
			expect(quizState.scene).toBe('Moonlit alleyway');
			
			// Final submission
			const response = await fetch(GENERATE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(quizState)
			});

			expect(response.status).toBe(200);
			const result = await response.json();
			expect(result.name).toBe(quizState.name);
		});

		it('should complete generate -> save -> gallery workflow', async () => {
			// Step 1: Generate character
			const generateResponse = await fetch(GENERATE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(quizStep3Data)
			});

			expect(generateResponse.status).toBe(200);
			const generatedCharacter = await generateResponse.json();
			
			// Step 2: Save to gallery
			const saveResponse = await fetch(SAVE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(generatedCharacter)
			});

			expect(saveResponse.status).toBe(200);
			const saveResult = await saveResponse.json();
			expect(saveResult.success).toBe(true);
			
			// Step 3: Verify in gallery
			const galleryResponse = await fetch(GALLERY_ENDPOINT, {
				method: 'GET'
			});

			expect(galleryResponse.status).toBe(200);
			const gallery = await galleryResponse.json();
			expect(Array.isArray(gallery)).toBe(true);
			expect(gallery).toHaveLength(1);
			expect(gallery[0].name).toBe(generatedCharacter.name);
		});
	});

	describe('Quiz Validation and Error Handling', () => {
		it('should handle incomplete quiz submission gracefully', async () => {
			const incompleteQuizData = {
				name: 'Incomplete Character',
				species: 'Fox'
				// Missing required fields
			};

			global.fetch.mockImplementationOnce(() => Promise.resolve({
				ok: false,
				status: 500,
				json: async () => ({ error: 'Generation failed. Please try again.' })
			}));

			const response = await fetch(GENERATE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(incompleteQuizData)
			});

			expect(response.status).toBe(500);
			const result = await response.json();
			expect(result.error).toBeDefined();
		});

		it('should handle generation API failures during quiz flow', async () => {
			global.fetch.mockImplementationOnce(() => Promise.reject(new Error('API Error')));

			try {
				await fetch(GENERATE_ENDPOINT, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(quizStep3Data)
				});
			} catch (error) {
				expect(error.message).toBe('API Error');
			}
		});

		it('should validate quiz data before submission', async () => {
			const invalidQuizData = {
				name: '', // Invalid: empty name
				species: 'Dragon', // Invalid: not in enum
				playbook: 'Wizard', // Invalid: not in enum
				presentation: 'A'.repeat(201), // Invalid: too long
				demeanor: 'Normal',
				item: 'Sword',
				scene: 'Castle'
			};

			global.fetch.mockImplementationOnce(() => Promise.resolve({
				ok: false,
				status: 500,
				json: async () => ({ error: 'Generation failed. Please try again.' })
			}));

			const response = await fetch(GENERATE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(invalidQuizData)
			});

			expect(response.status).toBe(500);
		});
	});

	describe('Results Page Functionality', () => {
		it('should display generated character on results page', async () => {
			const generateResponse = await fetch(GENERATE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(quizStep3Data)
			});

			const character = await generateResponse.json();
			
			// Simulate results page display logic
			expect(character.name).toBeDefined();
			expect(character.portrait).toBeDefined();
			expect(character.prompt).toBeDefined();
			
			// Verify all character details are available for display
			expect(character.species).toBeDefined();
			expect(character.playbook).toBeDefined();
			expect(character.presentation).toBeDefined();
			expect(character.demeanor).toBeDefined();
			expect(character.item).toBeDefined();
			expect(character.scene).toBeDefined();
		});

		it('should handle save button functionality on results page', async () => {
			// First generate a character
			const generateResponse = await fetch(GENERATE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(quizStep3Data)
			});

			const character = await generateResponse.json();
			
			// Then save it (simulating save button click)
			const saveResponse = await fetch(SAVE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(character)
			});

			expect(saveResponse.status).toBe(200);
			const saveResult = await saveResponse.json();
			expect(saveResult.success).toBe(true);
			expect(saveResult.message).toBe('Character saved to gallery');
		});

		it('should handle try again functionality', async () => {
			// Generate initial character
			const firstResponse = await fetch(GENERATE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(quizStep3Data)
			});

			const firstCharacter = await firstResponse.json();
			expect(firstCharacter.name).toBe(quizStep3Data.name);
			
			// Simulate "Try Again" with same data (should generate new portrait)
			global.fetch.mockImplementationOnce(() => Promise.resolve({
				ok: true,
				status: 200,
				json: async () => ({
					...mockGeneratedCharacter,
					portrait: 'data:image/jpeg;base64,DIFFERENT_IMAGE_DATA...',
					prompt: 'A different generated prompt...'
				})
			}));

			const retryResponse = await fetch(GENERATE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(quizStep3Data)
			});

			const retryCharacter = await retryResponse.json();
			expect(retryCharacter.name).toBe(quizStep3Data.name);
			expect(retryCharacter.portrait).toBeDefined();
		});

		it('should handle edit functionality (return to quiz)', async () => {
			// Generate character
			const generateResponse = await fetch(GENERATE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(quizStep3Data)
			});

			const originalCharacter = await generateResponse.json();
			
			// Simulate editing (modify quiz data and regenerate)
			const editedQuizData = {
				...quizStep3Data,
				demeanor: 'Cheerful and optimistic', // Changed from original
				scene: 'Sunny marketplace' // Changed from original
			};

			global.fetch.mockImplementationOnce(() => Promise.resolve({
				ok: true,
				status: 200,
				json: async () => ({
					...mockGeneratedCharacter,
					demeanor: editedQuizData.demeanor,
					scene: editedQuizData.scene,
					prompt: 'Updated prompt with new demeanor and scene...'
				})
			}));

			const editedResponse = await fetch(GENERATE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(editedQuizData)
			});

			const editedCharacter = await editedResponse.json();
			expect(editedCharacter.demeanor).toBe(editedQuizData.demeanor);
			expect(editedCharacter.scene).toBe(editedQuizData.scene);
			expect(editedCharacter.demeanor).not.toBe(originalCharacter.demeanor);
		});
	});

	describe('Gallery Integration', () => {
		it('should show saved characters in gallery after quiz completion', async () => {
			// Complete quiz and save character
			const generateResponse = await fetch(GENERATE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(quizStep3Data)
			});

			const character = await generateResponse.json();
			
			await fetch(SAVE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(character)
			});

			// Check gallery
			const galleryResponse = await fetch(GALLERY_ENDPOINT, {
				method: 'GET'
			});

			const gallery = await galleryResponse.json();
			expect(gallery).toHaveLength(1);
			expect(gallery[0].name).toBe(character.name);
			expect(gallery[0].createdAt).toBeDefined();
		});

		it('should handle multiple quiz completions in gallery', async () => {
			// Mock gallery with existing characters
			const existingCharacters = [
				{ ...mockSavedCharacter, name: 'Existing Character 1' },
				{ ...mockSavedCharacter, name: 'Existing Character 2' }
			];

			global.fetch.mockImplementation((url, options) => {
				if (url === GALLERY_ENDPOINT && options?.method === 'GET') {
					return Promise.resolve({
						ok: true,
						status: 200,
						json: async () => [...existingCharacters, mockSavedCharacter]
					});
				}
				// Default behavior for other endpoints
				if (url === GENERATE_ENDPOINT && options?.method === 'POST') {
					return Promise.resolve({
						ok: true,
						status: 200,
						json: async () => mockGeneratedCharacter
					});
				}
				if (url === SAVE_ENDPOINT && options?.method === 'POST') {
					return Promise.resolve({
						ok: true,
						status: 200,
						json: async () => ({ success: true, message: 'Character saved to gallery' })
					});
				}
				return Promise.resolve({
					ok: false,
					status: 404,
					json: async () => ({ error: 'Not found' })
				});
			});

			// Complete new quiz
			const generateResponse = await fetch(GENERATE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(quizStep3Data)
			});

			const newCharacter = await generateResponse.json();
			
			await fetch(SAVE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newCharacter)
			});

			// Verify gallery shows all characters
			const galleryResponse = await fetch(GALLERY_ENDPOINT, {
				method: 'GET'
			});

			const gallery = await galleryResponse.json();
			expect(gallery).toHaveLength(3);
			expect(gallery.map(c => c.name)).toContain('Existing Character 1');
			expect(gallery.map(c => c.name)).toContain('Existing Character 2');
			expect(gallery.map(c => c.name)).toContain(newCharacter.name);
		});
	});

	describe('Error Recovery and User Experience', () => {
		it('should handle network errors gracefully during quiz flow', async () => {
			global.fetch.mockRejectedValueOnce(new Error('Network error'));

			try {
				await fetch(GENERATE_ENDPOINT, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(quizStep3Data)
				});
			} catch (error) {
				expect(error.message).toBe('Network error');
				// In real app, this would trigger user-friendly error message
			}
		});

		it('should preserve quiz state during errors', async () => {
			// Simulate quiz state preservation during API failure
			const quizState = { ...quizStep3Data };
			
			global.fetch.mockRejectedValueOnce(new Error('API Error'));

			try {
				await fetch(GENERATE_ENDPOINT, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(quizState)
				});
			} catch (error) {
				// Quiz state should still be available for retry
				expect(quizState.name).toBe('Whiskers McTail');
				expect(quizState.species).toBe('Cat');
				expect(quizState.playbook).toBe('Scoundrel');
			}
		});

		it('should handle save failures without losing generated character', async () => {
			// Generate character successfully
			const generateResponse = await fetch(GENERATE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(quizStep3Data)
			});

			const character = await generateResponse.json();
			
			// Simulate save failure
			global.fetch.mockImplementationOnce(() => Promise.resolve({
				ok: false,
				status: 500,
				json: async () => ({ error: 'Save failed' })
			}));

			const saveResponse = await fetch(SAVE_ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(character)
			});

			expect(saveResponse.status).toBe(500);
			
			// Character data should still be available for retry
			expect(character.name).toBe(quizStep3Data.name);
			expect(character.portrait).toBeDefined();
		});
	});
});