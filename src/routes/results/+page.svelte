<script>
  import { quizStore, quizActions } from '$lib/stores/quiz.js';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  // Subscribe to the quiz store
  let quizState = $state();
  quizStore.subscribe(state => {
    quizState = state;
  });

  // State for editing
  let isEditing = $state(false);
  let editPrompt = $state('');
  let isSaving = $state(false);
  let isRegenerating = $state(false);
  let saveError = $state('');
  let regenerateError = $state('');

  // Check if we have a generated character, redirect if not
  onMount(() => {
    if (!quizState.generatedCharacter) {
      goto('/create');
    }
  });

  // Save character to gallery
  async function saveCharacter() {
    if (!quizState.generatedCharacter) return;

    isSaving = true;
    saveError = '';

    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quizState.generatedCharacter)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save character');
      }

      // Navigate to gallery after successful save
      goto('/gallery');
    } catch (error) {
      console.error('Save error:', error);
      saveError = error.message || 'Failed to save character. Please try again.';
    } finally {
      isSaving = false;
    }
  }

  // Start editing
  function startEdit() {
    isEditing = true;
    editPrompt = quizState.generatedCharacter?.prompt || '';
  }

  // Cancel editing
  function cancelEdit() {
    isEditing = false;
    editPrompt = '';
    regenerateError = '';
  }

  // Regenerate with edited prompt
  async function regenerateCharacter() {
    if (!editPrompt.trim() || !quizState.generatedCharacter) return;

    isRegenerating = true;
    regenerateError = '';

    try {
      // Create updated character data with new prompt
      const updatedCharacter = {
        ...quizState.generatedCharacter,
        prompt: editPrompt.trim()
      };

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedCharacter)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to regenerate character');
      }

      const result = await response.json();
      
      // Update store with new generated character
      quizStore.update(state => ({
        ...state,
        generatedCharacter: result
      }));

      // Exit editing mode
      isEditing = false;
      editPrompt = '';
    } catch (error) {
      console.error('Regenerate error:', error);
      regenerateError = error.message || 'Failed to regenerate character. Please try again.';
    } finally {
      isRegenerating = false;
    }
  }

  // Try again (restart quiz)
  function tryAgain() {
    quizActions.reset();
    goto('/create');
  }
</script>

<svelte:head>
  <title>Your Vagabond Portrait - Root Portrait Creator</title>
  <meta name="description" content="View your generated Root RPG vagabond character portrait" />
</svelte:head>

{#if quizState.generatedCharacter}
  <div class="results-page">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">Your Vagabond Portrait</h1>
      <p class="page-subtitle">
        Meet {quizState.generatedCharacter.name}, your woodland wanderer
      </p>
    </div>

    <!-- Main content -->
    <div class="results-content">
      <!-- Portrait section -->
      <div class="portrait-section">
        <div class="portrait-container">
          {#if quizState.generatedCharacter.portrait}
            <img 
              src={quizState.generatedCharacter.portrait} 
              alt="Portrait of {quizState.generatedCharacter.name}"
              class="portrait-image"
            />
          {:else}
            <div class="portrait-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
              <p>Portrait not available</p>
            </div>
          {/if}
        </div>
      </div>

      <!-- Character details -->
      <div class="details-section">
        <div class="character-info">
          <h2 class="character-name">{quizState.generatedCharacter.name}</h2>
          <div class="character-basics">
            <div class="basic-info">
              <span class="info-label">Species:</span>
              <span class="info-value">{quizState.generatedCharacter.species}</span>
            </div>
            <div class="basic-info">
              <span class="info-label">Playbook:</span>
              <span class="info-value">{quizState.generatedCharacter.playbook}</span>
            </div>
          </div>

          <div class="character-details">
            <div class="detail-item">
              <h3 class="detail-label">Presentation</h3>
              <p class="detail-value">{quizState.generatedCharacter.presentation}</p>
            </div>
            <div class="detail-item">
              <h3 class="detail-label">Demeanor</h3>
              <p class="detail-value">{quizState.generatedCharacter.demeanor}</p>
            </div>
            <div class="detail-item">
              <h3 class="detail-label">Defining Item</h3>
              <p class="detail-value">{quizState.generatedCharacter.item}</p>
            </div>
            <div class="detail-item">
              <h3 class="detail-label">Scene</h3>
              <p class="detail-value">{quizState.generatedCharacter.scene}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit section -->
    {#if isEditing}
      <div class="edit-section">
        <h3 class="edit-title">Edit Portrait Prompt</h3>
        <p class="edit-description">
          Modify the prompt to regenerate the portrait with different details or style.
        </p>
        <textarea
          class="edit-textarea"
          bind:value={editPrompt}
          placeholder="Describe how you'd like the portrait to be different..."
          rows="4"
          disabled={isRegenerating}
        ></textarea>
        
        {#if regenerateError}
          <div class="error-message">{regenerateError}</div>
        {/if}

        <div class="edit-actions">
          <button 
            class="btn btn-secondary"
            onclick={cancelEdit}
            disabled={isRegenerating}
          >
            Cancel
          </button>
          <button 
            class="btn btn-primary"
            onclick={regenerateCharacter}
            disabled={isRegenerating || !editPrompt.trim()}
          >
            {#if isRegenerating}
              <span class="loading-spinner"></span>
              Regenerating...
            {:else}
              Regenerate Portrait
            {/if}
          </button>
        </div>
      </div>
    {/if}

    <!-- Action buttons -->
    <div class="action-buttons">
      <button 
        class="btn btn-success"
        onclick={saveCharacter}
        disabled={isSaving}
      >
        {#if isSaving}
          <span class="loading-spinner"></span>
          Saving...
        {:else}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17,21 17,13 7,13 7,21"/>
            <polyline points="7,3 7,8 15,8"/>
          </svg>
          Save to Gallery
        {/if}
      </button>

      <button 
        class="btn btn-secondary"
        onclick={startEdit}
        disabled={isSaving || isRegenerating || isEditing}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Edit & Regenerate
      </button>

      <button 
        class="btn btn-outline"
        onclick={tryAgain}
        disabled={isSaving || isRegenerating}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="1 4 1 10 7 10"/>
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
        </svg>
        Try Again
      </button>
    </div>

    <!-- Error messages -->
    {#if saveError}
      <div class="error-banner">
        <p>{saveError}</p>
        <button onclick={() => saveError = ''} class="error-dismiss">×</button>
      </div>
    {/if}

    <!-- Navigation -->
    <div class="navigation">
      <a href="/" class="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5"/>
          <path d="M12 19l-7-7 7-7"/>
        </svg>
        Back to Home
      </a>
    </div>
  </div>
{:else}
  <!-- Loading or redirect state -->
  <div class="loading-page">
    <div class="loading-content">
      <div class="loading-spinner large"></div>
      <p>Loading your portrait...</p>
    </div>
  </div>
{/if}

<style>
  .results-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f3e8d3 0%, #e8d5b7 50%, #d4c4a8 100%);
    position: relative;
  }

  /* Add subtle texture overlay */
  .results-page::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 25% 25%, rgba(139, 69, 19, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(101, 67, 33, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }

  /* Page header */
  .page-header {
    padding: 3rem 2rem 2rem;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #8b4513;
    margin-bottom: 1rem;
    font-family: serif;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }

  .page-subtitle {
    font-size: 1.125rem;
    color: #5d4e37;
    line-height: 1.6;
  }

  /* Main content */
  .results-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    position: relative;
    z-index: 1;
  }

  /* Portrait section */
  .portrait-section {
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }

  .portrait-container {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 8px 32px rgba(139, 69, 19, 0.15);
    border: 2px solid rgba(139, 69, 19, 0.1);
    backdrop-filter: blur(10px);
    max-width: 400px;
    width: 100%;
  }

  .portrait-image {
    width: 100%;
    height: auto;
    border-radius: 0.5rem;
    display: block;
  }

  .portrait-placeholder {
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #f3f4f6;
    border-radius: 0.5rem;
    color: #6b7280;
  }

  .portrait-placeholder svg {
    width: 4rem;
    height: 4rem;
    margin-bottom: 1rem;
  }

  /* Details section */
  .details-section {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(139, 69, 19, 0.15);
    border: 2px solid rgba(139, 69, 19, 0.1);
    backdrop-filter: blur(10px);
  }

  .character-name {
    font-size: 2rem;
    font-weight: 700;
    color: #8b4513;
    margin-bottom: 1.5rem;
    font-family: serif;
  }

  .character-basics {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid rgba(139, 69, 19, 0.1);
  }

  .basic-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .info-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .info-value {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
  }

  .character-details {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .detail-label {
    font-size: 1rem;
    font-weight: 600;
    color: #8b4513;
  }

  .detail-value {
    color: #374151;
    line-height: 1.6;
  }

  /* Edit section */
  .edit-section {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 1rem;
    box-shadow: 0 8px 32px rgba(139, 69, 19, 0.15);
    border: 2px solid rgba(139, 69, 19, 0.1);
    backdrop-filter: blur(10px);
    position: relative;
    z-index: 1;
  }

  .edit-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #8b4513;
    margin-bottom: 0.5rem;
  }

  .edit-description {
    color: #5d4e37;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  .edit-textarea {
    width: 100%;
    padding: 1rem;
    border: 2px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
    min-height: 100px;
    margin-bottom: 1rem;
  }

  .edit-textarea:focus {
    outline: none;
    border-color: #8b4513;
    box-shadow: 0 0 0 3px rgba(139, 69, 19, 0.1);
  }

  .edit-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  /* Action buttons */
  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: 2rem;
    position: relative;
    z-index: 1;
    flex-wrap: wrap;
  }

  .btn {
    padding: 0.875rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
  }

  .btn:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .btn svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  .btn-success {
    background-color: #22c55e;
    color: white;
  }

  .btn-success:hover:not(:disabled) {
    background-color: #16a34a;
    transform: translateY(-1px);
  }

  .btn-secondary {
    background-color: #6b7280;
    color: white;
  }

  .btn-secondary:hover:not(:disabled) {
    background-color: #4b5563;
    transform: translateY(-1px);
  }

  .btn-primary {
    background-color: #8b4513;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background-color: #a0522d;
    transform: translateY(-1px);
  }

  .btn-outline {
    background-color: transparent;
    color: #8b4513;
    border: 2px solid #8b4513;
  }

  .btn-outline:hover:not(:disabled) {
    background-color: #8b4513;
    color: white;
    transform: translateY(-1px);
  }

  /* Error handling */
  .error-message {
    color: #ef4444;
    font-size: 0.875rem;
    margin-bottom: 1rem;
    font-weight: 500;
  }

  .error-banner {
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 2rem auto;
    max-width: 800px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .error-banner p {
    color: #dc2626;
    margin: 0;
    font-weight: 500;
  }

  .error-dismiss {
    background: none;
    border: none;
    color: #dc2626;
    cursor: pointer;
    font-size: 1.5rem;
    font-weight: bold;
    padding: 0;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Navigation */
  .navigation {
    padding: 2rem;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #8b4513;
    text-decoration: none;
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    background: rgba(255, 255, 255, 0.8);
    border: 2px solid rgba(139, 69, 19, 0.2);
    transition: all 0.2s;
    backdrop-filter: blur(10px);
  }

  .back-link:hover {
    background: rgba(255, 255, 255, 0.95);
    border-color: #8b4513;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 69, 19, 0.15);
  }

  .back-link svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  /* Loading states */
  .loading-spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-spinner.large {
    width: 3rem;
    height: 3rem;
    border-width: 3px;
  }

  .loading-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f3e8d3 0%, #e8d5b7 50%, #d4c4a8 100%);
  }

  .loading-content {
    text-align: center;
    color: #5d4e37;
  }

  .loading-content p {
    margin-top: 1rem;
    font-size: 1.125rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .results-content {
      grid-template-columns: 1fr;
      gap: 2rem;
      padding: 1rem;
    }

    .page-header {
      padding: 2rem 1rem 1rem;
    }

    .page-title {
      font-size: 2rem;
    }

    .character-basics {
      flex-direction: column;
      gap: 1rem;
    }

    .action-buttons {
      flex-direction: column;
      align-items: center;
    }

    .btn {
      width: 100%;
      max-width: 300px;
      justify-content: center;
    }

    .edit-actions {
      flex-direction: column;
    }

    .edit-section {
      margin: 1rem;
      padding: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .page-title {
      font-size: 1.75rem;
    }

    .character-name {
      font-size: 1.5rem;
    }

    .portrait-container,
    .details-section {
      padding: 1rem;
    }
  }
</style>