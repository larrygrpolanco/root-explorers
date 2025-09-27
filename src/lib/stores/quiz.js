import { writable } from 'svelte/store';
import { Character } from '$lib/models/Character.js';

/**
 * Quiz state store for managing the 3-step character creation process
 */

// Initial quiz state
const initialState = {
  // Current step (1, 2, or 3)
  currentStep: 1,
  
  // Quiz data matching Character model
  data: {
    name: '',
    species: '',
    playbook: '',
    presentation: '',
    demeanor: '',
    item: '',
    scene: ''
  },
  
  // Validation errors for each field
  errors: {},
  
  // Loading states
  isSubmitting: false,
  
  // Generated character result
  generatedCharacter: null,
  
  // API error message
  apiError: null
};

// Create the writable store
export const quizStore = writable(initialState);

/**
 * Quiz store actions
 */
export const quizActions = {
  /**
   * Update a specific field in the quiz data
   * @param {string} field - Field name to update
   * @param {string} value - New value for the field
   */
  updateField(field, value) {
    quizStore.update(state => ({
      ...state,
      data: {
        ...state.data,
        [field]: value
      },
      // Clear error for this field when user starts typing
      errors: {
        ...state.errors,
        [field]: null
      }
    }));
  },

  /**
   * Set validation error for a specific field
   * @param {string} field - Field name
   * @param {string} error - Error message
   */
  setFieldError(field, error) {
    quizStore.update(state => ({
      ...state,
      errors: {
        ...state.errors,
        [field]: error
      }
    }));
  },

  /**
   * Clear all validation errors
   */
  clearErrors() {
    quizStore.update(state => ({
      ...state,
      errors: {}
    }));
  },

  /**
   * Validate current step data
   * @param {number} step - Step number to validate
   * @param {Object} data - Current quiz data
   * @returns {boolean} - True if step is valid
   */
  validateStep(step, data) {
    const errors = {};
    let isValid = true;

    if (step === 1) {
      // Validate name
      if (!data.name?.trim()) {
        errors.name = 'Name is required';
        isValid = false;
      } else if (data.name.trim().length > 50) {
        errors.name = 'Name cannot exceed 50 characters';
        isValid = false;
      }

      // Validate species
      if (!data.species) {
        errors.species = 'Please select a species';
        isValid = false;
      } else if (!Character.getSpecies().includes(data.species)) {
        errors.species = 'Please select a valid species';
        isValid = false;
      }

      // Validate playbook
      if (!data.playbook) {
        errors.playbook = 'Please select a playbook';
        isValid = false;
      } else if (!Character.getPlaybooks().includes(data.playbook)) {
        errors.playbook = 'Please select a valid playbook';
        isValid = false;
      }
    }

    if (step === 2) {
      // Validate presentation
      if (!data.presentation?.trim()) {
        errors.presentation = 'Please select how they present themselves';
        isValid = false;
      } else if (data.presentation.trim().length > 200) {
        errors.presentation = 'Presentation cannot exceed 200 characters';
        isValid = false;
      }

      // Validate demeanor
      if (!data.demeanor?.trim()) {
        errors.demeanor = 'Please select their demeanor';
        isValid = false;
      } else if (data.demeanor.trim().length > 200) {
        errors.demeanor = 'Demeanor cannot exceed 200 characters';
        isValid = false;
      }

      // Validate item
      if (!data.item?.trim()) {
        errors.item = 'Please select their defining item';
        isValid = false;
      } else if (data.item.trim().length > 200) {
        errors.item = 'Item cannot exceed 200 characters';
        isValid = false;
      }
    }

    if (step === 3) {
      // Validate scene
      if (!data.scene?.trim()) {
        errors.scene = 'Please select where we find them';
        isValid = false;
      } else if (data.scene.trim().length > 200) {
        errors.scene = 'Scene cannot exceed 200 characters';
        isValid = false;
      }
    }

    // Update store with errors
    quizStore.update(state => ({
      ...state,
      errors
    }));

    return isValid;
  },

  /**
   * Move to the next step
   * @param {Object} currentState - Current store state
   */
  nextStep(currentState) {
    const isValid = this.validateStep(currentState.currentStep, currentState.data);
    
    if (isValid && currentState.currentStep < 3) {
      quizStore.update(state => ({
        ...state,
        currentStep: state.currentStep + 1
      }));
    }
    
    return isValid;
  },

  /**
   * Move to the previous step
   */
  previousStep() {
    quizStore.update(state => ({
      ...state,
      currentStep: Math.max(1, state.currentStep - 1),
      errors: {} // Clear errors when going back
    }));
  },

  /**
   * Go to a specific step
   * @param {number} step - Step number (1, 2, or 3)
   */
  goToStep(step) {
    if (step >= 1 && step <= 3) {
      quizStore.update(state => ({
        ...state,
        currentStep: step,
        errors: {}
      }));
    }
  },

  /**
   * Submit the quiz to generate character
   * @param {Object} currentState - Current store state
   */
  async submitQuiz(currentState) {
    // Validate all steps
    const step1Valid = this.validateStep(1, currentState.data);
    const step2Valid = this.validateStep(2, currentState.data);
    const step3Valid = this.validateStep(3, currentState.data);

    if (!step1Valid || !step2Valid || !step3Valid) {
      return false;
    }

    // Set loading state
    quizStore.update(state => ({
      ...state,
      isSubmitting: true,
      apiError: null
    }));

    try {
      // Create character from quiz data to validate
      const character = Character.fromQuizData(currentState.data);
      
      // Submit to API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(character.toJSON())
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate character');
      }

      const result = await response.json();
      
      // Update store with generated character
      quizStore.update(state => ({
        ...state,
        isSubmitting: false,
        generatedCharacter: result,
        apiError: null
      }));

      return true;
    } catch (error) {
      console.error('Quiz submission error:', error);
      
      quizStore.update(state => ({
        ...state,
        isSubmitting: false,
        apiError: error.message || 'Failed to generate character. Please try again.'
      }));

      return false;
    }
  },

  /**
   * Reset the quiz to initial state
   */
  reset() {
    quizStore.set(initialState);
  },

  /**
   * Reset only the quiz data, keeping the current step
   */
  resetData() {
    quizStore.update(state => ({
      ...state,
      data: initialState.data,
      errors: {},
      generatedCharacter: null,
      apiError: null
    }));
  }
};

/**
 * Predefined options for quiz questions
 */
export const quizOptions = {
  presentation: [
    'practical leather/cloak',
    'mismatched finery',
    'pouches/tools',
    'simple functional clothes',
    'Custom...'
  ],
  
  demeanor: [
    'friendly smile',
    'sharp intense gaze',
    'quiet thoughtful',
    'nervous fidgety',
    'Custom...'
  ],
  
  item: [
    'carved wooden flute',
    'oversized rusty key',
    'worn changing map',
    'lucky coin',
    'Custom...'
  ],
  
  scene: [
    'resting against mossy tree',
    'peeking around building corner',
    'standing on hill at sunset',
    'huddled around campfire',
    'Custom...'
  ]
};