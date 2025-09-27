<script>
  import { onMount } from 'svelte';

  // State for gallery
  let characters = $state([]);
  let isLoading = $state(true);
  let error = $state('');

  // Load characters from gallery
  async function loadGallery() {
    isLoading = true;
    error = '';

    try {
      const response = await fetch('/api/gallery');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load gallery');
      }

      const data = await response.json();
      characters = data.characters || [];
    } catch (err) {
      console.error('Gallery load error:', err);
      error = err.message || 'Failed to load gallery. Please try again.';
    } finally {
      isLoading = false;
    }
  }

  // Load gallery on mount
  onMount(() => {
    loadGallery();
  });

  // Retry loading
  function retryLoad() {
    loadGallery();
  }

  // Format date for display
  function formatDate(dateString) {
    if (!dateString) return 'Unknown date';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown date';
    }
  }
</script>

<svelte:head>
  <title>Character Gallery - Root Portrait Creator</title>
  <meta name="description" content="Browse your collection of Root RPG vagabond character portraits" />
</svelte:head>

<div class="gallery-page">
  <!-- Header -->
  <div class="page-header">
    <h1 class="page-title">Character Gallery</h1>
    <p class="page-subtitle">
      Your collection of woodland wanderers
    </p>
  </div>

  <!-- Main content -->
  <div class="gallery-content">
    {#if isLoading}
      <!-- Loading state -->
      <div class="loading-section">
        <div class="loading-spinner large"></div>
        <p class="loading-text">Loading your characters...</p>
      </div>
    {:else if error}
      <!-- Error state -->
      <div class="error-section">
        <div class="error-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h2 class="error-title">Unable to Load Gallery</h2>
        <p class="error-message">{error}</p>
        <button class="btn btn-primary" onclick={retryLoad}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
          </svg>
          Try Again
        </button>
      </div>
    {:else if characters.length === 0}
      <!-- Empty state -->
      <div class="empty-section">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21,15 16,10 5,21"/>
          </svg>
        </div>
        <h2 class="empty-title">No Characters Yet</h2>
        <p class="empty-message">
          You haven't saved any vagabond portraits to your gallery yet. 
          Create your first character to get started!
        </p>
        <a href="/create" class="btn btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Create Your First Vagabond
        </a>
      </div>
    {:else}
      <!-- Gallery grid -->
      <div class="gallery-grid">
        {#each characters as character, index}
          <div class="character-card">
            <!-- Portrait -->
            <div class="card-portrait">
              {#if character.portrait}
                <img 
                  src={character.portrait} 
                  alt="Portrait of {character.name}"
                  class="portrait-image"
                  loading="lazy"
                />
              {:else}
                <div class="portrait-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                  </svg>
                </div>
              {/if}
            </div>

            <!-- Character info -->
            <div class="card-info">
              <h3 class="character-name">{character.name}</h3>
              <div class="character-details">
                <div class="detail-row">
                  <span class="detail-label">Species:</span>
                  <span class="detail-value">{character.species}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Playbook:</span>
                  <span class="detail-value">{character.playbook}</span>
                </div>
              </div>
              
              <!-- Additional character traits -->
              <div class="character-traits">
                {#if character.presentation}
                  <div class="trait">
                    <span class="trait-label">Presentation:</span>
                    <span class="trait-value">{character.presentation}</span>
                  </div>
                {/if}
                {#if character.demeanor}
                  <div class="trait">
                    <span class="trait-label">Demeanor:</span>
                    <span class="trait-value">{character.demeanor}</span>
                  </div>
                {/if}
                {#if character.item}
                  <div class="trait">
                    <span class="trait-label">Item:</span>
                    <span class="trait-value">{character.item}</span>
                  </div>
                {/if}
                {#if character.scene}
                  <div class="trait">
                    <span class="trait-label">Scene:</span>
                    <span class="trait-value">{character.scene}</span>
                  </div>
                {/if}
              </div>

              <!-- Creation date -->
              {#if character.createdAt}
                <div class="creation-date">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                  Created {formatDate(character.createdAt)}
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>

      <!-- Gallery stats -->
      <div class="gallery-stats">
        <p class="stats-text">
          {characters.length} character{characters.length !== 1 ? 's' : ''} in your gallery
        </p>
      </div>
    {/if}
  </div>

  <!-- Actions -->
  <div class="gallery-actions">
    <a href="/create" class="btn btn-primary">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      Create Another Character
    </a>
    
    {#if characters.length > 0}
      <button class="btn btn-secondary" onclick={retryLoad}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="1 4 1 10 7 10"/>
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
        </svg>
        Refresh Gallery
      </button>
    {/if}
  </div>

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

<style>
  .gallery-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f3e8d3 0%, #e8d5b7 50%, #d4c4a8 100%);
    position: relative;
  }

  /* Add subtle texture overlay */
  .gallery-page::before {
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
  .gallery-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    position: relative;
    z-index: 1;
  }

  /* Loading state */
  .loading-section {
    text-align: center;
    padding: 4rem 2rem;
  }

  .loading-spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }

  .loading-spinner.large {
    width: 3rem;
    height: 3rem;
    border-width: 3px;
    color: #8b4513;
  }

  .loading-text {
    margin-top: 1rem;
    color: #5d4e37;
    font-size: 1.125rem;
  }

  /* Error state */
  .error-section {
    text-align: center;
    padding: 4rem 2rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 1rem;
    box-shadow: 0 8px 32px rgba(139, 69, 19, 0.15);
    border: 2px solid rgba(139, 69, 19, 0.1);
    backdrop-filter: blur(10px);
  }

  .error-icon {
    width: 4rem;
    height: 4rem;
    margin: 0 auto 1.5rem;
    color: #ef4444;
  }

  .error-icon svg {
    width: 100%;
    height: 100%;
  }

  .error-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #8b4513;
    margin-bottom: 1rem;
  }

  .error-message {
    color: #5d4e37;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  /* Empty state */
  .empty-section {
    text-align: center;
    padding: 4rem 2rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 1rem;
    box-shadow: 0 8px 32px rgba(139, 69, 19, 0.15);
    border: 2px solid rgba(139, 69, 19, 0.1);
    backdrop-filter: blur(10px);
  }

  .empty-icon {
    width: 4rem;
    height: 4rem;
    margin: 0 auto 1.5rem;
    color: #6b7280;
  }

  .empty-icon svg {
    width: 100%;
    height: 100%;
  }

  .empty-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #8b4513;
    margin-bottom: 1rem;
  }

  .empty-message {
    color: #5d4e37;
    margin-bottom: 2rem;
    line-height: 1.6;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  /* Gallery grid */
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .character-card {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(139, 69, 19, 0.15);
    border: 2px solid rgba(139, 69, 19, 0.1);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
  }

  .character-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(139, 69, 19, 0.2);
    border-color: rgba(139, 69, 19, 0.2);
  }

  /* Card portrait */
  .card-portrait {
    aspect-ratio: 1;
    overflow: hidden;
    position: relative;
  }

  .portrait-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .portrait-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f3f4f6;
    color: #6b7280;
  }

  .portrait-placeholder svg {
    width: 4rem;
    height: 4rem;
  }

  /* Card info */
  .card-info {
    padding: 1.5rem;
  }

  .character-name {
    font-size: 1.25rem;
    font-weight: 700;
    color: #8b4513;
    margin-bottom: 1rem;
    font-family: serif;
  }

  .character-details {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(139, 69, 19, 0.1);
  }

  .detail-row {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .detail-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .detail-value {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
  }

  /* Character traits */
  .character-traits {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .trait {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .trait-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #8b4513;
  }

  .trait-value {
    font-size: 0.875rem;
    color: #374151;
    line-height: 1.4;
  }

  /* Creation date */
  .creation-date {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(139, 69, 19, 0.1);
  }

  .creation-date svg {
    width: 1rem;
    height: 1rem;
  }

  /* Gallery stats */
  .gallery-stats {
    text-align: center;
    margin-bottom: 2rem;
  }

  .stats-text {
    color: #5d4e37;
    font-size: 0.875rem;
    font-weight: 500;
  }

  /* Actions */
  .gallery-actions {
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

  .btn svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  .btn-primary {
    background-color: #8b4513;
    color: white;
  }

  .btn-primary:hover {
    background-color: #a0522d;
    transform: translateY(-1px);
  }

  .btn-secondary {
    background-color: #6b7280;
    color: white;
  }

  .btn-secondary:hover {
    background-color: #4b5563;
    transform: translateY(-1px);
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

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .gallery-content {
      padding: 1rem;
    }

    .page-header {
      padding: 2rem 1rem 1rem;
    }

    .page-title {
      font-size: 2rem;
    }

    .gallery-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .character-details {
      flex-direction: column;
      gap: 0.5rem;
    }

    .gallery-actions {
      flex-direction: column;
      align-items: center;
    }

    .btn {
      width: 100%;
      max-width: 300px;
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .page-title {
      font-size: 1.75rem;
    }

    .character-card {
      border-radius: 0.75rem;
    }

    .card-info {
      padding: 1rem;
    }

    .character-name {
      font-size: 1.125rem;
    }
  }
</style>