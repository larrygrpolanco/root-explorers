<script>
  import Quiz from '$lib/components/Quiz.svelte';
  import { quizActions } from '$lib/stores/quiz.js';
  import { onMount } from 'svelte';

  // Reset quiz state when page loads
  onMount(() => {
    quizActions.reset();
  });
</script>

<svelte:head>
  <title>Create Your Vagabond - Root Portrait Creator</title>
  <meta name="description" content="Create a unique portrait of your Root RPG vagabond character" />
</svelte:head>

<div class="create-page">
  <!-- Header -->
  <div class="page-header">
    <div class="header-content">
      <h1 class="page-title">Create Your Vagabond</h1>
      <p class="page-subtitle">
        Answer a few questions to bring your woodland wanderer to life
      </p>
    </div>
  </div>

  <!-- Quiz container -->
  <div class="quiz-container">
    <Quiz />
  </div>

  <!-- Back to home link -->
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
  .create-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f3e8d3 0%, #e8d5b7 50%, #d4c4a8 100%);
    position: relative;
  }

  /* Add subtle texture overlay */
  .create-page::before {
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

  .header-content {
    max-width: 600px;
    margin: 0 auto;
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

  /* Quiz container */
  .quiz-container {
    position: relative;
    z-index: 1;
    background: rgba(255, 255, 255, 0.8);
    margin: 2rem auto;
    max-width: 800px;
    border-radius: 1rem;
    box-shadow: 0 8px 32px rgba(139, 69, 19, 0.15);
    border: 2px solid rgba(139, 69, 19, 0.1);
    backdrop-filter: blur(10px);
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

  /* Responsive design */
  @media (max-width: 768px) {
    .page-header {
      padding: 2rem 1rem 1rem;
    }

    .page-title {
      font-size: 2rem;
    }

    .quiz-container {
      margin: 1rem;
      border-radius: 0.75rem;
    }

    .navigation {
      padding: 1rem;
    }
  }

  @media (max-width: 480px) {
    .page-title {
      font-size: 1.75rem;
    }

    .page-subtitle {
      font-size: 1rem;
    }
  }
</style>