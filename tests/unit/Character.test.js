import { describe, it, expect } from 'vitest';
import { Character } from '../../src/lib/models/Character.js';

describe('Character Model Unit Tests', () => {
  const validCharacterData = {
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

  describe('Constructor and Basic Properties', () => {
    it('should create a Character instance with valid data', () => {
      const character = new Character(validCharacterData);
      
      expect(character.name).toBe(validCharacterData.name);
      expect(character.species).toBe(validCharacterData.species);
      expect(character.playbook).toBe(validCharacterData.playbook);
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
      expect(character.species).toBe('');
      expect(character.playbook).toBe('');
      expect(character.presentation).toBe('');
      expect(character.demeanor).toBe('');
      expect(character.item).toBe('');
      expect(character.scene).toBe('');
      expect(character.portrait).toBe('');
      expect(character.prompt).toBe('');
      expect(character.createdAt).toBe('');
    });
  });

  describe('Name Validation', () => {
    it('should validate valid name', () => {
      const character = new Character({ name: 'Valid Name' });
      const result = character.validateName();
      
      expect(result.isValid).toBe(true);
    });

    it('should reject empty name', () => {
      const character = new Character({ name: '' });
      const result = character.validateName();
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name is required and must be a string');
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

  describe('Species Validation', () => {
    it('should validate valid species', () => {
      const character = new Character({ species: 'Cat' });
      const result = character.validateSpecies();
      
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid species', () => {
      const character = new Character({ species: 'Dragon' });
      const result = character.validateSpecies();
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Species must be one of:');
    });

    it('should reject empty species', () => {
      const character = new Character({ species: '' });
      const result = character.validateSpecies();
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Species is required and must be a string');
    });
  });

  describe('Playbook Validation', () => {
    it('should validate valid playbook', () => {
      const character = new Character({ playbook: 'Scoundrel' });
      const result = character.validatePlaybook();
      
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid playbook', () => {
      const character = new Character({ playbook: 'Wizard' });
      const result = character.validatePlaybook();
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Playbook must be one of:');
    });

    it('should reject empty playbook', () => {
      const character = new Character({ playbook: '' });
      const result = character.validatePlaybook();
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Playbook is required and must be a string');
    });
  });

  describe('Text Field Validation', () => {
    it('should validate valid text fields', () => {
      const character = new Character(validCharacterData);
      const result = character.validateTextFields();
      
      expect(result.isValid).toBe(true);
    });

    it('should reject text field exceeding 200 characters', () => {
      const character = new Character({
        presentation: 'A'.repeat(201),
        demeanor: 'Valid',
        item: 'Valid',
        scene: 'Valid'
      });
      const result = character.validateTextFields();
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Presentation cannot exceed 200 characters');
    });

    it('should reject empty text fields', () => {
      const character = new Character({
        presentation: '',
        demeanor: 'Valid',
        item: 'Valid',
        scene: 'Valid'
      });
      const result = character.validateTextFields();
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Presentation is required and must be a string');
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
      const character = new Character({ ...validCharacterData, name: '' });
      const result = character.validate(true);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name is required and must be a string');
    });

    it('should reject character with invalid species', () => {
      const character = new Character({ ...validCharacterData, species: 'Dragon' });
      const result = character.validate(true);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Species must be one of:');
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
        species: 'Cat',
        playbook: 'Scoundrel',
        presentation: 'Test presentation',
        demeanor: 'Test demeanor',
        item: 'Test item',
        scene: 'Test scene'
      };
      
      const character = Character.fromQuizData(quizData);
      
      expect(character).toBeInstanceOf(Character);
      expect(character.name).toBe(quizData.name);
      expect(character.portrait).toBe(''); // Should be empty for quiz data
    });

    it('should throw error for invalid quiz data', () => {
      const invalidQuizData = {
        name: '',
        species: 'Cat',
        playbook: 'Scoundrel',
        presentation: 'Test',
        demeanor: 'Test',
        item: 'Test',
        scene: 'Test'
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

    it('should return species enum', () => {
      const species = Character.getSpecies();
      
      expect(Array.isArray(species)).toBe(true);
      expect(species).toContain('Cat');
      expect(species).toContain('Fox');
      expect(species).toContain('Rabbit');
    });

    it('should return playbooks enum', () => {
      const playbooks = Character.getPlaybooks();
      
      expect(Array.isArray(playbooks)).toBe(true);
      expect(playbooks).toContain('Scoundrel');
      expect(playbooks).toContain('Ranger');
      expect(playbooks).toContain('Thief');
    });
  });
});