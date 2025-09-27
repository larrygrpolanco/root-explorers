/**
 * Character Model for Root Vagabond Portrait Creator
 * 
 * Represents a generated vagabond portrait from quiz inputs and AI output.
 * Handles validation, serialization, and data management for character entities.
 */

/**
 * Character class representing a Root Vagabond character
 */
export class Character {
  /**
   * Create a new Character instance
   * @param {Object} data - Character data object
   */
  constructor(data = {}) {
    this.name = data.name || '';
    // Backward compatibility for old data
    if (data.species && data.playbook && !data.speciesRole) {
      this.speciesRole = `a ${data.species.toLowerCase()} ${data.playbook.toLowerCase()}`;
    } else {
      this.speciesRole = data.speciesRole || '';
    }
    this.presentation = data.presentation || '';
    this.demeanor = data.demeanor || '';
    this.item = data.item || '';
    this.scene = data.scene || '';
    this.portrait = data.portrait || '';
    this.prompt = data.prompt || '';
    this.createdAt = data.createdAt || '';
  }

  /**
   * Validate the name field
   * @returns {Object} Validation result with isValid boolean and error message
   */
  validateName() {
    if (!this.name || typeof this.name !== 'string') {
      return { isValid: false, error: 'Name is required and must be a string' };
    }
    
    const trimmedName = this.name.trim();
    if (trimmedName.length < 2) {
      return { isValid: false, error: 'Name must be at least 2 characters' };
    }
    
    if (trimmedName.length > 50) {
      return { isValid: false, error: 'Name cannot exceed 50 characters' };
    }
    
    return { isValid: true };
  }

  /**
   * Validate text fields (speciesRole, presentation, demeanor, item, scene)
   * @param {string} fieldName - Name of the field being validated
   * @param {string} value - Value to validate
   * @returns {Object} Validation result with isValid boolean and error message
   */
  validateTextField(fieldName, value) {
    if (!value || typeof value !== 'string') {
      return { isValid: false, error: `${fieldName} is required and must be a string` };
    }
    
    const trimmedValue = value.trim();
    if (trimmedValue.length < 20) {
      return { isValid: false, error: `${fieldName} must be at least 20 characters` };
    }
    
    if (trimmedValue.length > 300) {
      return { isValid: false, error: `${fieldName} cannot exceed 300 characters` };
    }
    
    return { isValid: true };
  }

  /**
   * Validate all text fields
   * @returns {Object} Validation result with isValid boolean and error message
   */
  validateTextFields() {
    const fields = [
      { name: 'Species Role', value: this.speciesRole },
      { name: 'Presentation', value: this.presentation },
      { name: 'Demeanor', value: this.demeanor },
      { name: 'Item', value: this.item },
      { name: 'Scene', value: this.scene }
    ];

    for (const field of fields) {
      const result = this.validateTextField(field.name, field.value);
      if (!result.isValid) {
        return result;
      }
    }

    return { isValid: true };
  }

  /**
   * Validate the portrait field
   * @param {boolean} requirePortrait - Whether portrait is required (true for saved characters)
   * @returns {Object} Validation result with isValid boolean and error message
   */
  validatePortrait(requirePortrait = false) {
    if (requirePortrait) {
      if (!this.portrait || typeof this.portrait !== 'string') {
        return { isValid: false, error: 'Portrait is required for saved characters' };
      }
      
      const trimmedPortrait = this.portrait.trim();
      if (trimmedPortrait.length === 0) {
        return { isValid: false, error: 'Portrait cannot be empty for saved characters' };
      }
      
      // Basic validation for URL or base64 format
      const isUrl = trimmedPortrait.startsWith('http://') || trimmedPortrait.startsWith('https://');
      const isBase64 = trimmedPortrait.startsWith('data:image/');
      
      if (!isUrl && !isBase64) {
        return { isValid: false, error: 'Portrait must be a valid URL or base64 data URI' };
      }
    }
    
    return { isValid: true };
  }

  /**
   * Comprehensive validation of all character fields
   * @param {boolean} requirePortrait - Whether portrait is required (true for saved characters)
   * @returns {Object} Validation result with isValid boolean and error message
   */
  validate(requirePortrait = false) {
    // Validate name
    const nameResult = this.validateName();
    if (!nameResult.isValid) {
      return nameResult;
    }

    // Validate text fields
    const textFieldsResult = this.validateTextFields();
    if (!textFieldsResult.isValid) {
      return textFieldsResult;
    }

    // Validate portrait
    const portraitResult = this.validatePortrait(requirePortrait);
    if (!portraitResult.isValid) {
      return portraitResult;
    }

    return { isValid: true };
  }

  /**
   * Serialize character to JSON object
   * @returns {Object} Plain object representation of the character
   */
  toJSON() {
    return {
      name: this.name,
      speciesRole: this.speciesRole,
      presentation: this.presentation,
      demeanor: this.demeanor,
      item: this.item,
      scene: this.scene,
      portrait: this.portrait,
      prompt: this.prompt,
      createdAt: this.createdAt
    };
  }

  /**
   * Add timestamp to character (for saving)
   * @returns {Character} Returns this instance for chaining
   */
  addTimestamp() {
    if (!this.createdAt) {
      this.createdAt = new Date().toISOString();
    }
    return this;
  }

  /**
   * Check if character has all required fields for saving
   * @returns {boolean} True if character is complete for saving
   */
  isComplete() {
    const validation = this.validate(true); // Require portrait for completeness
    return validation.isValid;
  }

  /**
   * Create Character instance from JSON data
   * @param {Object} jsonData - Plain object with character data
   * @returns {Character} New Character instance
   */
  static fromJSON(jsonData) {
    if (!jsonData || typeof jsonData !== 'object') {
      throw new Error('Invalid JSON data provided');
    }
    return new Character(jsonData);
  }

  /**
   * Create Character instance from quiz submission data
   * @param {Object} quizData - Quiz form data
   * @returns {Character} New Character instance
   */
  static fromQuizData(quizData) {
    if (!quizData || typeof quizData !== 'object') {
      throw new Error('Invalid quiz data provided');
    }

    // Create character from quiz data (no portrait or prompt yet)
    const character = new Character({
      name: quizData.name,
      speciesRole: quizData.speciesRole,
      presentation: quizData.presentation,
      demeanor: quizData.demeanor,
      item: quizData.item,
      scene: quizData.scene
    });

    // Validate the quiz data
    const validation = character.validate(false); // Don't require portrait for quiz data
    if (!validation.isValid) {
      throw new Error(`Invalid quiz data: ${validation.error}`);
    }

    return character;
  }

  /**
   * Create Character instance from saved gallery data
   * @param {Object} savedData - Saved character data from gallery
   * @returns {Character} New Character instance
   */
  static fromSavedData(savedData) {
    if (!savedData || typeof savedData !== 'object') {
      throw new Error('Invalid saved data provided');
    }

    const character = new Character(savedData);

    // Validate saved data (should be complete)
    const validation = character.validate(true); // Require portrait for saved data
    if (!validation.isValid) {
      throw new Error(`Invalid saved data: ${validation.error}`);
    }

    return character;
  }
}

export default Character;