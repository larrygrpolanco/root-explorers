<script>
  import { quizStore, quizActions } from '$lib/stores/quiz.js';
  import { goto } from '$app/navigation';

  let quizState = $state();

  // Subscribe to the quiz store
  quizStore.subscribe(state => {
    quizState = state;
  });

  // Handle field updates
  function updateField(field, value) {
    quizActions.updateField(field, value);
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
            {step === 1 ? 'Basics' : step === 2 ? 'Details' : 'Scene'}
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
        <h2 class="step-title">Step 1: Basics</h2>
        
        <!-- Name input -->
        <div class="form-group">
          <label for="name" class="form-label">What is your vagabond's name?</label>
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
          <div class="char-counter">{quizState.data.name.length}/50</div>
        </div>

        <!-- Species Role textarea -->
        <div class="form-group">
          <label for="speciesRole" class="form-label">Describe your vagabond's species and role in the Root world. What kind of creature are they, and what path do they follow?</label>
          <textarea
            id="speciesRole"
            class="form-textarea {quizState.errors.speciesRole ? 'error' : ''}"
            bind:value={quizState.data.speciesRole}
            oninput={(e) => updateField('speciesRole', e.target.value)}
            placeholder="e.g., a cunning fox as a thief or a sturdy badger as a tinker"
            maxlength="300"
            rows="4"
            disabled={quizState.isSubmitting}
          ></textarea>
          {#if quizState.errors.speciesRole}
            <div class="error-message">{quizState.errors.speciesRole}</div>
          {/if}
          <div class="char-counter">{quizState.data.speciesRole.length}/300</div>
        </div>
      </div>
    {/if}

    <!-- Step 2: Details -->
    {#if quizState.currentStep === 2}
      <div class="quiz-step">
        <h2 class="step-title">Step 2: Details</h2>

        <!-- Presentation textarea -->
        <div class="form-group">
          <label for="presentation" class="form-label">How is your vagabond dressed and presented? Describe their attire, accessories, and overall style in the woodland setting.</label>
          <textarea
            id="presentation"
            class="form-textarea {quizState.errors.presentation ? 'error' : ''}"
            bind:value={quizState.data.presentation}
            oninput={(e) => updateField('presentation', e.target.value)}
            placeholder="Describe their attire, accessories, and overall style in the woodland setting"
            maxlength="300"
            rows="4"
            disabled={quizState.isSubmitting}
          ></textarea>
          {#if quizState.errors.presentation}
            <div class="error-message">{quizState.errors.presentation}</div>
          {/if}
          <div class="char-counter">{quizState.data.presentation.length}/300</div>
        </div>

        <!-- Demeanor textarea -->
        <div class="form-group">
          <label for="demeanor" class="form-label">What defines your vagabond's demeanor and personality? How do they carry themselves, and what emotions or traits stand out visually?</label>
          <textarea
            id="demeanor"
            class="form-textarea {quizState.errors.demeanor ? 'error' : ''}"
            bind:value={quizState.data.demeanor}
            oninput={(e) => updateField('demeanor', e.target.value)}
            placeholder="e.g., confident stride, wary eyes"
            maxlength="300"
            rows="4"
            disabled={quizState.isSubmitting}
          ></textarea>
          {#if quizState.errors.demeanor}
            <div class="error-message">{quizState.errors.demeanor}</div>
          {/if}
          <div class="char-counter">{quizState.data.demeanor.length}/300</div>
        </div>

        <!-- Item textarea -->
        <div class="form-group">
          <label for="item" class="form-label">What item does your vagabond carry, and why is it significant to them? Describe its appearance and how they use or hold it.</label>
          <textarea
            id="item"
            class="form-textarea {quizState.errors.item ? 'error' : ''}"
            bind:value={quizState.data.item}
            oninput={(e) => updateField('item', e.target.value)}
            placeholder="Describe its appearance and how they use or hold it"
            maxlength="300"
            rows="4"
            disabled={quizState.isSubmitting}
          ></textarea>
          {#if quizState.errors.item}
            <div class="error-message">{quizState.errors.item}</div>
          {/if}
          <div class="char-counter">{quizState.data.item.length}/300</div>
        </div>
      </div>
    {/if}

    <!-- Step 3: Scene -->
    {#if quizState.currentStep === 3}
      <div class="quiz-step">
        <h2 class="step-title">Step 3: Scene</h2>

        <!-- Scene textarea -->
        <div class="form-group">
          <label for="scene" class="form-label">Where do we find your vagabond? Describe the scene, their pose, and the surrounding environment in the Root RPG world.</label>
          <textarea
            id="scene"
            class="form-textarea {quizState.errors.scene ? 'error' : ''}"
            bind:value={quizState.data.scene}
            oninput={(e) => updateField('scene', e.target.value)}
            placeholder="e.g., lurking in misty woods or standing defiantly on a hill"
            maxlength="300"
            rows="4"
            disabled={quizState.isSubmitting}
          ></textarea>
          {#if quizState.errors.scene}
            <div class="error-message">{quizState.errors.scene}</div>
          {/if}
          <div class="char-counter">{quizState.data.scene.length}/300</div>
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
  .form-textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    background-color: #fefefe;
    transition: all 0.2s;
    font-family: inherit;
  }

  .form-textarea {
    resize: vertical;
    min-height: 100px;
    line-height: 1.5;
  }

  .form-input:focus,
  .form-textarea:focus {
    outline: none;
    border-color: #8b4513;
    box-shadow: 0 0 0 3px rgba(139, 69, 19, 0.1);
  }

  .form-input.error,
  .form-textarea.error {
    border-color: #ef4444;
  }

  .char-counter {
    font-size: 0.875rem;
    color: #9ca3af;
    text-align: right;
    margin-top: 0.25rem;
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