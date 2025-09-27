<script>
  import { goto } from '$app/navigation';
</script>

<svelte:head>
  <title>Root Vagabond Portrait Creator</title>
  <meta name="description" content="Create unique portraits of your Root RPG vagabond characters" />
</svelte:head>

<div class="landing-page">
  <!-- Hero section -->
  <div class="hero">
    <div class="hero-content">
      <h1 class="hero-title">Root Vagabond Portrait Creator</h1>
      <p class="hero-subtitle">
        Bring your woodland wanderer to life with AI-generated portraits
      </p>
      <p class="hero-description">
        Answer a few questions about your vagabond's appearance, demeanor, and current scene, 
        and watch as their unique portrait comes to life in the rustic style of the Root RPG world.
      </p>
    </div>
  </div>

  <!-- Main actions -->
  <div class="main-actions">
    <div class="action-cards">
      <!-- Create a Vagabond -->
      <div class="action-card primary">
        <div class="card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <h2 class="card-title">Create a Vagabond</h2>
        <p class="card-description">
          Start the character creation quiz to generate a unique portrait of your woodland wanderer.
        </p>
        <button 
          class="card-button primary"
          onclick={() => goto('/create')}
        >
          Begin Creation
        </button>
      </div>

      <!-- View the Gallery -->
      <div class="action-card secondary">
        <div class="card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21,15 16,10 5,21"/>
          </svg>
        </div>
        <h2 class="card-title">View the Gallery</h2>
        <p class="card-description">
          Browse through all the vagabond portraits you've created and saved to your collection.
        </p>
        <button 
          class="card-button secondary"
          onclick={() => goto('/gallery')}
        >
          Browse Gallery
        </button>
      </div>
    </div>
  </div>

  <!-- Features section -->
  <div class="features">
    <div class="features-content">
      <h2 class="features-title">How It Works</h2>
      <div class="features-grid">
        <div class="feature">
          <div class="feature-number">1</div>
          <h3 class="feature-title">Choose Your Basics</h3>
          <p class="feature-description">
            Select your vagabond's name, species, and playbook from the Root RPG world.
          </p>
        </div>
        <div class="feature">
          <div class="feature-number">2</div>
          <h3 class="feature-title">Describe Their Character</h3>
          <p class="feature-description">
            Tell us about their presentation, demeanor, and the defining item they carry.
          </p>
        </div>
        <div class="feature">
          <div class="feature-number">3</div>
          <h3 class="feature-title">Set the Scene</h3>
          <p class="feature-description">
            Choose where we find them in their current moment of adventure.
          </p>
        </div>
        <div class="feature">
          <div class="feature-number">4</div>
          <h3 class="feature-title">Generate & Save</h3>
          <p class="feature-description">
            Watch as AI creates a unique portrait that you can save to your gallery.
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer class="footer">
    <p class="footer-text">
      Inspired by the <strong>Root RPG</strong> by Leder Games. 
      Create your own woodland adventures at your table.
    </p>
  </footer>
</div>

<style>
  .landing-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f3e8d3 0%, #e8d5b7 50%, #d4c4a8 100%);
    position: relative;
  }

  /* Add subtle texture overlay */
  .landing-page::before {
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

  /* Hero section */
  .hero {
    padding: 4rem 2rem;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .hero-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .hero-title {
    font-size: 3.5rem;
    font-weight: 800;
    color: #8b4513;
    margin-bottom: 1rem;
    font-family: serif;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    line-height: 1.1;
  }

  .hero-subtitle {
    font-size: 1.5rem;
    color: #654321;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }

  .hero-description {
    font-size: 1.125rem;
    color: #5d4e37;
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto;
  }

  /* Main actions */
  .main-actions {
    padding: 3rem 2rem;
    position: relative;
    z-index: 1;
  }

  .action-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .action-card {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 1rem;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 8px 32px rgba(139, 69, 19, 0.15);
    border: 2px solid rgba(139, 69, 19, 0.1);
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .action-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(139, 69, 19, 0.2);
    border-color: rgba(139, 69, 19, 0.2);
  }

  .action-card.primary {
    border-color: #8b4513;
    background: rgba(255, 248, 240, 0.95);
  }

  .action-card.primary:hover {
    border-color: #a0522d;
    background: rgba(255, 248, 240, 1);
  }

  .card-icon {
    width: 4rem;
    height: 4rem;
    margin: 0 auto 1.5rem;
    color: #8b4513;
    background: rgba(139, 69, 19, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-icon svg {
    width: 2rem;
    height: 2rem;
  }

  .card-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #8b4513;
    margin-bottom: 1rem;
    font-family: serif;
  }

  .card-description {
    color: #5d4e37;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .card-button {
    padding: 0.875rem 2rem;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    width: 100%;
  }

  .card-button.primary {
    background-color: #8b4513;
    color: white;
  }

  .card-button.primary:hover {
    background-color: #a0522d;
    transform: translateY(-1px);
  }

  .card-button.secondary {
    background-color: #6b7280;
    color: white;
  }

  .card-button.secondary:hover {
    background-color: #4b5563;
    transform: translateY(-1px);
  }

  /* Features section */
  .features {
    padding: 4rem 2rem;
    background: rgba(255, 255, 255, 0.3);
    position: relative;
    z-index: 1;
  }

  .features-content {
    max-width: 1000px;
    margin: 0 auto;
  }

  .features-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #8b4513;
    text-align: center;
    margin-bottom: 3rem;
    font-family: serif;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }

  .feature {
    text-align: center;
    padding: 1.5rem;
  }

  .feature-number {
    width: 3rem;
    height: 3rem;
    background-color: #8b4513;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0 auto 1rem;
  }

  .feature-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #654321;
    margin-bottom: 0.75rem;
  }

  .feature-description {
    color: #5d4e37;
    line-height: 1.6;
  }

  /* Footer */
  .footer {
    padding: 2rem;
    text-align: center;
    background: rgba(139, 69, 19, 0.1);
    position: relative;
    z-index: 1;
  }

  .footer-text {
    color: #5d4e37;
    font-size: 0.875rem;
  }

  .footer-text strong {
    color: #8b4513;
    font-weight: 600;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .hero {
      padding: 2rem 1rem;
    }

    .hero-title {
      font-size: 2.5rem;
    }

    .hero-subtitle {
      font-size: 1.25rem;
    }

    .main-actions {
      padding: 2rem 1rem;
    }

    .action-cards {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .features {
      padding: 3rem 1rem;
    }

    .features-title {
      font-size: 2rem;
    }

    .features-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .hero-title {
      font-size: 2rem;
    }

    .hero-subtitle {
      font-size: 1.125rem;
    }

    .action-card {
      padding: 1.5rem;
    }

    .card-title {
      font-size: 1.25rem;
    }
  }
</style>
