<script>
  import { quizStore, quizActions, quizOptions } from '$lib/stores/quiz.js';
  import { Character } from '$lib/models/Character.js';
  import { goto } from '$app/navigation';

  // Subscribe to the quiz store
  let quizState = $state();
  quizStore.subscribe(state => {
    quizState = state;
  });

  // Custom input values for "Custom..." options
  let customPresentation = $state('');
  let customDemeanor = $state('');
  let customItem = $state('');
  let customScene = $state('');

  // Handle field updates
  function updateField(field, value) {
    quizActions.updateField(field, value);
  }

  // Handle custom option selection
  function handleCustomOption(field, isCustom, customValue) {
    if (isCustom && customValue.trim()) {
      updateField(field, customValue.trim());
    }
  }

  // Navigation functions
  function nextStep() {
    const success = quizActions.nextStep(quizState);
    if (!success) {
      // Scroll to first error
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  function previousStep() {
    quizActions.previousStep();
  }

  function goToStep(step) {
    quizActions.goToStep(step);
  }

  // Submit quiz
  async function submitQuiz() {
    const success = await quizActions.submitQuiz(quizState);
    if (success) {
      // Navigate to results page
      goto('/results');
    }
  }

  // Get species and playbooks from Character model
  const species = Character.getSpecies();
  const playbooks = Character.getPlaybooks();
</script>

<div class="quiz-container">
  <!-- Progress indicator -->
  <div class="progress-bar">
    <div class="progress-steps">
      {#each [1, 2, 3] as step}
        <button
          class="progress-step {quizState.currentStep === step ? 'active' : ''} {quizState.currentStep > step ? 'completed' : ''}"
          onclick={() => goToStep(step)}
          disabled={quizState.isSubmitting}
        >
          <span class="step-number">{step}</span>
          <span class="step-label">
            {step === 1 ? 'Basics' : step === 2 ? 'Character' : 'Scene'}
          </span>
        </button>
        {#if step < 3}
          <div class="progress-line {quizState.currentStep > step ? 'completed' : ''}"></div>
        {/if}
      {/each}
    </div>
  </div>

  <!-- Quiz form -->
  <form class="quiz-form" onsubmit={(e) => e.preventDefault()}>
    
    <!-- Step 1: Basics -->
    {#if quizState.currentStep === 1}
      <div class="quiz-step">
        <h2 class="step-title">Tell us about your vagabond</h2>
        
        <!-- Name input -->
        <div class="form-group">
          <label for="name" class="form-label">What is their name?</label>
          <input
            id="name"
            type="text"
            class="form-input {quizState.errors.name ? 'error' : ''}"
            bind:value={quizState.data.name}
            oninput={(e) => updateField('name', e.target.value)}
            placeholder="Enter a name for your vagabond"
            maxlength="50"
            disabled={quizState.isSubmitting}
          />
          {#if quizState.errors.name}
            <div class="error-message">{quizState.errors.name}</div>
          {/if}
        </div>

        <!-- Species dropdown -->
        <div class="form-group">
          <label for="species" class="form-label">What species are they?</label>
          <select
            id="species"
            class="form-select {quizState.errors.species ? 'error' : ''}"
            bind:value={quizState.data.species}
            onchange={(e) => updateField('species', e.target.value)}
            disabled={quizState.isSubmitting}
          >
            <option value="">Choose a species...</option>
            {#each species as speciesOption}
              <option value={speciesOption}>{speciesOption}</option>
            {/each}
          </select>
          {#if quizState.errors.species}
            <div class="error-message">{quizState.errors.species}</div>
          {/if}
        </div>

        <!-- Playbook dropdown -->
        <div class="form-group">
          <label for="playbook" class="form-label">What is their playbook?</label>
          <select
            id="playbook"
            class="form-select {quizState.errors.playbook ? 'error' : ''}"
            bind:value={quizState.data.playbook}
            onchange={(e) => updateField('playbook', e.target.value)}
            disabled={quizState.isSubmitting}
          >
            <option value="">Choose a playbook...</option>
            {#each playbooks as playbookOption}
              <option value={playbookOption}>{playbookOption}</option>
            {/each}
          </select>
          {#if quizState.errors.playbook}
            <div class="error-message">{quizState.errors.playbook}</div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Step 2: Character Details -->
    {#if quizState.currentStep === 2}
      <div class="quiz-step">
        <h2 class="step-title">How do they appear?</h2>

        <!-- Presentation -->
        <div class="form-group">
          <label class="form-label">How do they present themselves?</label>
          <div class="radio-group {quizState.errors.presentation ? 'error' : ''}">
            {#each quizOptions.presentation as option}
              <label class="radio-option">
                <input
                  type="radio"
                  name="presentation"
                  value={option === 'Custom...' ? customPresentation : option}
                  checked={quizState.data.presentation === (option === 'Custom...' ? customPresentation : option)}
                  onchange={(e) => {
                    if (option === 'Custom...') {
                      // Don't update field yet, wait for custom input
                    } else {
                      updateField('presentation', option);
                    }
                  }}
                  disabled={quizState.isSubmitting}
                />
                <span class="radio-label">{option}</span>
              </label>
              {#if option === 'Custom...' && quizState.data.presentation === customPresentation}
                <input
                  type="text"
                  class="custom-input"
                  bind:value={customPresentation}
                  oninput={() => handleCustomOption('presentation', true, customPresentation)}
                  placeholder="Describe their presentation..."
                  maxlength="200"
                  disabled={quizState.isSubmitting}
                />
              {/if}
            {/each}
          </div>
          {#if quizState.errors.presentation}
            <div class="error-message">{quizState.errors.presentation}</div>
          {/if}
        </div>

        <!-- Demeanor -->
        <div class="form-group">
          <label class="form-label">What is their signature demeanor?</label>
          <div class="radio-group {quizState.errors.demeanor ? 'error' : ''}">
            {#each quizOptions.demeanor as option}
              <label class="radio-option">
                <input
                  type="radio"
                  name="demeanor"
                  value={option === 'Custom...' ? customDemeanor : option}
                  checked={quizState.data.demeanor === (option === 'Custom...' ? customDemeanor : option)}
                  onchange={(e) => {
                    if (option === 'Custom...') {
                      // Don't update field yet, wait for custom input
                    } else {
                      updateField('demeanor', option);
                    }
                  }}
                  disabled={quizState.isSubmitting}
                />
                <span class="radio-label">{option}</span>
              </label>
              {#if option === 'Custom...' && quizState.data.demeanor === customDemeanor}
                <input
                  type="text"
                  class="custom-input"
                  bind:value={customDemeanor}
                  oninput={() => handleCustomOption('demeanor', true, customDemeanor)}
                  placeholder="Describe their demeanor..."
                  maxlength="200"
                  disabled={quizState.isSubmitting}
                />
              {/if}
            {/each}
          </div>
          {#if quizState.errors.demeanor}
            <div class="error-message">{quizState.errors.demeanor}</div>
          {/if}
        </div>

        <!-- Item -->
        <div class="form-group">
          <label class="form-label">What small, defining item do they carry?</label>
          <div class="radio-group {quizState.errors.item ? 'error' : ''}">
            {#each quizOptions.item as option}
              <label class="radio-option">
                <input
                  type="radio"
                  name="item"
                  value={option === 'Custom...' ? customItem : option}
                  checked={quizState.data.item === (option === 'Custom...' ? customItem : option)}
                  onchange={(e) => {
                    if (option === 'Custom...') {
                      // Don't update field yet, wait for custom input
                    } else {
                      updateField('item', option);
                    }
                  }}
                  disabled={quizState.isSubmitting}
                />
                <span class="radio-label">{option}</span>
              </label>
              {#if option === 'Custom...' && quizState.data.item === customItem}
                <input
                  type="text"
                  class="custom-input"
                  bind:value={customItem}
                  oninput={() => handleCustomOption('item', true, customItem)}
                  placeholder="Describe their item..."
                  maxlength="200"
                  disabled={quizState.isSubmitting}
                />
              {/if}
            {/each}
          </div>
          {#if quizState.errors.item}
            <div class="error-message">{quizState.errors.item}</div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Step 3: Scene -->
    {#if quizState.currentStep === 3}
      <div class="quiz-step">
        <h2 class="step-title">Where do we find them?</h2>

        <!-- Scene -->
        <div class="form-group">
          <label class="form-label">Right now, where do we find them?</label>
          <div class="radio-group {quizState.errors.scene ? 'error' : ''}">
            {#each quizOptions.scene as option}
              <label class="radio-option">
                <input
                  type="radio"
                  name="scene"
                  value={option === 'Custom...' ? customScene : option}
                  checked={quizState.data.scene === (option === 'Custom...' ? customScene : option)}
                  onchange={(e) => {
                    if (option === 'Custom...') {
                      // Don't update field yet, wait for custom input
                    } else {
                      updateField('scene', option);
                    }
                  }}
                  disabled={quizState.isSubmitting}
                />
                <span class="radio-label">{option}</span>
              </label>
              {#if option === 'Custom...' && quizState.data.scene === customScene}
                <input
                  type="text"
                  class="custom-input"
                  bind:value={customScene}
                  oninput={() => handleCustomOption('scene', true, customScene)}
                  placeholder="Describe the scene..."
                  maxlength="200"
                  disabled={quizState.isSubmitting}
                />
              {/if}
            {/each}
          </div>
          {#if quizState.errors.scene}
            <div class="error-message">{quizState.errors.scene}</div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- API Error Display -->
    {#if quizState.apiError}
      <div class="api-error">
        <p>{quizState.apiError}</p>
        <button type="button" onclick={() => quizActions.clearErrors()} class="error-dismiss">
          Dismiss
        </button>
      </div>
    {/if}

    <!-- Navigation buttons -->
    <div class="quiz-navigation">
      {#if quizState.currentStep > 1}
        <button
          type="button"
          class="btn btn-secondary"
          onclick={previousStep}
          disabled={quizState.isSubmitting}
        >
          Previous
        </button>
      {/if}

      <div class="nav-spacer"></div>

      {#if quizState.currentStep < 3}
        <button
          type="button"
          class="btn btn-primary"
          onclick={nextStep}
          disabled={quizState.isSubmitting}
        >
          Next
        </button>
      {:else}
        <button
          type="button"
          class="btn btn-primary"
          onclick={submitQuiz}
          disabled={quizState.isSubmitting}
        >
          {#if quizState.isSubmitting}
            <span class="loading-spinner"></span>
            Generating...
          {:else}
            Create Portrait
          {/if}
        </button>
      {/if}
    </div>
  </form>
</div>

<style>
  .quiz-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
  }

  /* Progress bar */
  .progress-bar {
    margin-bottom: 3rem;
  }

  .progress-steps {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .progress-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.2s;
  }

  .progress-step:hover:not(:disabled) {
    background-color: rgba(139, 69, 19, 0.1);
  }

  .progress-step:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .step-number {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #d4d4d8;
    color: #71717a;
    font-weight: 600;
    margin-bottom: 0.5rem;
    transition: all 0.2s;
  }

  .progress-step.active .step-number {
    background-color: #8b4513;
    color: white;
  }

  .progress-step.completed .step-number {
    background-color: #22c55e;
    color: white;
  }

  .step-label {
    font-size: 0.875rem;
    color: #71717a;
    font-weight: 500;
  }

  .progress-step.active .step-label {
    color: #8b4513;
    font-weight: 600;
  }

  .progress-line {
    width: 4rem;
    height: 2px;
    background-color: #d4d4d8;
    margin: 0 1rem;
    transition: all 0.2s;
  }

  .progress-line.completed {
    background-color: #22c55e;
  }

  /* Quiz form */
  .quiz-step {
    margin-bottom: 2rem;
  }

  .step-title {
    font-size: 1.875rem;
    font-weight: 700;
    color: #8b4513;
    margin-bottom: 2rem;
    text-align: center;
    font-family: serif;
  }

  .form-group {
    margin-bottom: 2rem;
  }

  .form-label {
    display: block;
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
  }

  .form-input,
  .form-select {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    background-color: #fefefe;
    transition: all 0.2s;
  }

  .form-input:focus,
  .form-select:focus {
    outline: none;
    border-color: #8b4513;
    box-shadow: 0 0 0 3px rgba(139, 69, 19, 0.1);
  }

  .form-input.error,
  .form-select.error {
    border-color: #ef4444;
  }

  .radio-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .radio-group.error {
    border: 2px solid #ef4444;
    border-radius: 0.5rem;
    padding: 1rem;
  }

  .radio-option {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .radio-option:hover {
    border-color: #8b4513;
    background-color: rgba(139, 69, 19, 0.05);
  }

  .radio-option input[type="radio"] {
    margin-right: 0.75rem;
    accent-color: #8b4513;
  }

  .radio-label {
    font-weight: 500;
    color: #374151;
  }

  .custom-input {
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    font-size: 0.875rem;
  }

  .error-message {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    font-weight: 500;
  }

  .api-error {
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .api-error p {
    color: #dc2626;
    margin: 0;
    font-weight: 500;
  }

  .error-dismiss {
    background: none;
    border: none;
    color: #dc2626;
    cursor: pointer;
    font-weight: 600;
    text-decoration: underline;
  }

  /* Navigation */
  .quiz-navigation {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 3rem;
  }

  .nav-spacer {
    flex: 1;
  }

  .btn {
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .btn:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .btn-primary {
    background-color: #8b4513;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background-color: #a0522d;
  }

  .btn-secondary {
    background-color: #6b7280;
    color: white;
  }

  .btn-secondary:hover:not(:disabled) {
    background-color: #4b5563;
  }

  .loading-spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Responsive design */
  @media (max-width: 640px) {
    .quiz-container {
      padding: 1rem;
    }

    .progress-steps {
      flex-direction: column;
      gap: 1rem;
    }

    .progress-line {
      width: 2px;
      height: 2rem;
      margin: 0;
    }

    .step-title {
      font-size: 1.5rem;
    }

    .quiz-navigation {
      flex-direction: column;
      gap: 1rem;
    }

    .nav-spacer {
      display: none;
    }

    .btn {
      width: 100%;
      justify-content: center;
    }
  }
</style>