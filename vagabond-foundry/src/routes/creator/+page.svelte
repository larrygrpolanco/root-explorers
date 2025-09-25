<script>
  import { onMount } from 'svelte';
  import { characterStore } from '$lib/stores.js';
  import { page } from '$app/stores';
  import PlaybookSelection from './PlaybookSelection.svelte';
  import SpeciesSelection from './SpeciesSelection.svelte';
  import DemeanorSelection from './DemeanorSelection.svelte';
  import AppearanceSelection from './AppearanceSelection.svelte';
  import NameInput from './NameInput.svelte';
  import Generation from './Generation.svelte';

  let currentStep = 1;
  const totalSteps = 6;
  let isDebug = false;
  let character = {};

  $: character = $characterStore;

  function nextStep() {
    if (currentStep < totalSteps) {
      if (validateStep()) {
        currentStep += 1;
      }
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep -= 1;
    }
  }

  function validateStep() {
    // Basic validation for required fields before advancing
    switch (currentStep) {
      case 1:
        return character.playbook !== '';
      case 2:
        return character.species !== '';
      case 3:
        return character.demeanor !== '';
      case 4:
        return character.physical_desc !== '' && character.trinket !== '';
      case 5:
        return character.char_name !== '';
      default:
        return true;
    }
  }

  function goToStep(step) {
    if (step >= 1 && step <= totalSteps && validateStep()) {
      currentStep = step;
    }
  }

  onMount(() => {
    const url = new URL($page.url);
    isDebug = url.searchParams.get('debug') === 'true';
    // Reset store if starting fresh
    characterStore.set({
      playbook: '',
      species: '',
      demeanor: '',
      physical_desc: '',
      trinket: '',
      char_name: '',
      generatedImage: '',
      prompt: ''
    });
  });
</script>

<svelte:head>
  <title>Vagabond Creator</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-green-50 to-brown-100 p-4">
  <div class="max-w-md mx-auto flex flex-col h-full">
    <!-- Header -->
    <header class="text-center mb-6">
      <h1 class="text-2xl font-bold text-brown-800 mb-2">Create Your Vagabond</h1>
      <p class="text-brown-600">Step {currentStep} of {totalSteps}</p>
    </header>

    <!-- Stepper -->
    <div class="flex justify-between mb-8">
      {#each Array(totalSteps) as _, i}
        <div
          class="w-3 h-3 rounded-full {currentStep > i + 1 ? 'bg-green-500' : currentStep === i + 1 ? 'bg-blue-500' : 'bg-gray-300'} transition-colors"
          on:click={() => goToStep(i + 1)}
        ></div>
      {/each}
    </div>

    <!-- Content -->
    <main class="flex-1 overflow-y-auto mb-8">
      {#if currentStep === 1}
        <PlaybookSelection />
      {:else if currentStep === 2}
        <SpeciesSelection />
      {:else if currentStep === 3}
        <DemeanorSelection />
      {:else if currentStep === 4}
        <AppearanceSelection />
      {:else if currentStep === 5}
        <NameInput />
      {:else if currentStep === 6}
        <Generation {isDebug} />
      {/if}
    </main>

    <!-- Navigation -->
    <footer class="flex justify-between">
      {#if currentStep > 1}
        <button
          class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          on:click={prevStep}
        >
          Back
        </button>
      {/if}
      {#if currentStep < totalSteps}
        <button
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ml-auto"
          on:click={nextStep}
          disabled={!validateStep()}
        >
          Next
        </button>
      {:else}
        <!-- Save button in Generation -->
      {/if}
    </footer>

    {#if isDebug}
      <div class="mt-4 p-2 bg-yellow-100 rounded text-sm">
        Debug mode enabled
      </div>
    {/if}
  </div>
</div>

<style>
  /* Additional custom styles if needed */
</style>