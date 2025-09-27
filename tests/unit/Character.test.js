import { describe, it, expect } from 'vitest';
import { Character } from '../../src/lib/models/Character.js';

describe('Character Model Unit Tests', () => {
  const validCharacterData = {
    name: 'Whiskers McTail',
    speciesRole: 'a cunning fox as a thief',
    presentation: 'Elegant silk vest with brass buttons',
    demeanor: 'Sly, calculating, and always watchful',
    item: 'A set of finely crafted lockpicking tools',
    scene: 'In a shadowy moonlit alleyway behind the tavern',
    portrait: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
    prompt: 'A vagabond with elegant silk vest...'
  };

  describe('Constructor and Basic Properties', () => {
    it('should create a Character instance with valid data', () => {
      const character = new Character(validCharacterData);
      
      expect(character.name).toBe(validCharacterData.name);
      expect(character.speciesRole).toBe(validCharacterData.speciesRole);
      expect(character.presentation).toBe(validCharacterData.presentation);
      expect(character.demeanor).toBe(validCharacterData.demeanor);
      expect(character.item).toBe(validCharacterData.item);
      expect(character.scene).toBe(validCharacterData.scene);
      expect(character.portrait).toBe(validCharacterData.portrait);
      expect(character.prompt).toBe(validCharacterData.prompt);
    });

    it('should create a Character instance with empty data', () => {
      const character = new Character();
      
      expect(character.name).toBe('');
      expect(character.speciesRole).toBe('');
      expect(character.presentation).toBe('');
      expect(character.demeanor).toBe('');
      expect(character.item).toBe('');
      expect(character.scene).toBe('');
      expect(character.portrait).toBe('');
      expect(character.prompt).toBe('');
      expect(character.createdAt).toBe('');
    });

    it('should handle backward compatibility for old data', () => {
      const oldData = {
        name: 'Old Character',
        species: 'Cat',
        playbook: 'Scoundrel',
        presentation: 'Old presentation'
      };
      const character = new Character(oldData);
      
      expect(character.speciesRole).toBe('a cat scoundrel');
      expect(character.name).toBe('Old Character');
    });
  });

  describe('Name Validation', () => {
    it('should validate valid name', () => {
      const character = new Character({ name: 'Valid Name' });
      const result = character.validateName();
      
      expect(result.isValid).toBe(true);
    });

    it('should reject name less than 2 characters', () => {
      const character = new Character({ name: 'A' });
      const result = character.validateName();
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name must be at least 2 characters');
    });

    it('should reject name exceeding 50 characters', () => {
      const character = new Character({ name: 'A'.repeat(51) });
      const result = character.validateName();
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name cannot exceed 50 characters');
    });

    it('should reject non-string name', () => {
      const character = new Character({ name: 123 });
      const result = character.validateName();
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name is required and must be a string');
    });
  });

  describe('Text Field Validation', () => {
    it('should validate valid text fields', () => {
      const character = new Character(validCharacterData);
      const result = character.validateTextFields();
      
      expect(result.isValid).toBe(true);
    });

    it('should reject text field less than 20 characters', () => {
      const character = new Character({
        speciesRole: 'Short',
        presentation: 'Valid long text...',
        demeanor: 'Valid',
        item: 'Valid',
        scene: 'Valid'
      });
      const result = character.validateTextFields();
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Species Role must be at least 20 characters');
    });

    it('should reject text field exceeding 300 characters', () => {
      const longText = 'A'.repeat(301);
      const character = new Character({
        speciesRole: 'a valid species role description',
        presentation: longText,
        demeanor: 'Valid long enough',
        item: 'Valid long enough',
        scene: 'Valid long enough'
      });
      const result = character.validateTextFields();
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Presentation cannot exceed 300 characters');
    });

    it('should reject empty text fields', () => {
      const character = new Character({
        speciesRole: '',
        presentation: 'Valid',
        demeanor: 'Valid',
        item: 'Valid',
        scene: 'Valid'
      });
      const result = character.validateTextFields();
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Species Role is required and must be a string');
    });
  });

  describe('Portrait Validation', () => {
    it('should validate portrait when not required', () => {
      const character = new Character({ portrait: '' });
      const result = character.validatePortrait(false);
      
      expect(result.isValid).toBe(true);
    });

    it('should validate valid base64 portrait when required', () => {
      const character = new Character({ portrait: 'data:image/jpeg;base64,validdata' });
      const result = character.validatePortrait(true);
      
      expect(result.isValid).toBe(true);
    });

    it('should validate valid URL portrait when required', () => {
      const character = new Character({ portrait: 'https://example.com/image.jpg' });
      const result = character.validatePortrait(true);
      
      expect(result.isValid).toBe(true);
    });

    it('should reject empty portrait when required', () => {
      const character = new Character({ portrait: '' });
      const result = character.validatePortrait(true);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Portrait is required for saved characters');
    });

    it('should reject invalid portrait format when required', () => {
      const character = new Character({ portrait: 'invalid-format' });
      const result = character.validatePortrait(true);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Portrait must be a valid URL or base64 data URI');
    });
  });

  describe('Comprehensive Validation', () => {
    it('should validate complete valid character', () => {
      const character = new Character(validCharacterData);
      const result = character.validate(true);
      
      expect(result.isValid).toBe(true);
    });

    it('should reject character with invalid name', () => {
      const character = new Character({ ...validCharacterData, name: 'A' });
      const result = character.validate(true);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name must be at least 2 characters');
    });

    it('should reject character with invalid speciesRole', () => {
      const character = new Character({ ...validCharacterData, speciesRole: 'Short' });
      const result = character.validate(true);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Species Role must be at least 20 characters');
    });
  });

  describe('Utility Methods', () => {
    it('should serialize to JSON correctly', () => {
      const character = new Character(validCharacterData);
      const json = character.toJSON();
      
      // The toJSON method includes createdAt field even if empty
      const expectedJson = { ...validCharacterData, createdAt: '' };
      expect(json).toEqual(expectedJson);
    });

    it('should add timestamp when none exists', () => {
      const character = new Character(validCharacterData);
      character.addTimestamp();
      
      expect(character.createdAt).toBeDefined();
      expect(character.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should preserve existing timestamp', () => {
      const existingTimestamp = '2025-09-26T12:00:00.000Z';
      const character = new Character({ ...validCharacterData, createdAt: existingTimestamp });
      character.addTimestamp();
      
      expect(character.createdAt).toBe(existingTimestamp);
    });

    it('should check completeness correctly', () => {
      const completeCharacter = new Character(validCharacterData);
      expect(completeCharacter.isComplete()).toBe(true);
      
      const incompleteCharacter = new Character({ ...validCharacterData, portrait: '' });
      expect(incompleteCharacter.isComplete()).toBe(false);
    });
  });

  describe('Static Methods', () => {
    it('should create from JSON data', () => {
      const character = Character.fromJSON(validCharacterData);
      
      expect(character).toBeInstanceOf(Character);
      expect(character.name).toBe(validCharacterData.name);
    });

    it('should throw error for invalid JSON data', () => {
      expect(() => Character.fromJSON(null)).toThrow('Invalid JSON data provided');
      expect(() => Character.fromJSON('not an object')).toThrow('Invalid JSON data provided');
    });

    it('should create from quiz data', () => {
      const quizData = {
        name: 'Test Character',
        speciesRole: 'a test species role that is sufficiently descriptive',
        presentation: 'Test presentation that is long enough to meet requirements',
        demeanor: 'Test demeanor description that meets the minimum length',
        item: 'Test item description which is adequately detailed for validation',
        scene: 'Test scene setting that provides sufficient context and detail'
      };
      
      const character = Character.fromQuizData(quizData);
      
      expect(character).toBeInstanceOf(Character);
      expect(character.name).toBe(quizData.name);
      expect(character.portrait).toBe(''); // Should be empty for quiz data
    });

    it('should throw error for invalid quiz data', () => {
      const invalidQuizData = {
        name: 'A',
        speciesRole: 'Short',
        presentation: 'Valid',
        demeanor: 'Valid',
        item: 'Valid',
        scene: 'Valid'
      };
      
      expect(() => Character.fromQuizData(invalidQuizData)).toThrow('Invalid quiz data:');
    });

    it('should create from saved data', () => {
      const character = Character.fromSavedData(validCharacterData);
      
      expect(character).toBeInstanceOf(Character);
      expect(character.name).toBe(validCharacterData.name);
    });

    it('should throw error for invalid saved data', () => {
      const invalidSavedData = { ...validCharacterData, portrait: '' };
      
      expect(() => Character.fromSavedData(invalidSavedData)).toThrow('Invalid saved data:');
    });
  });
});