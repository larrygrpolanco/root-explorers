<script>
  import { page } from '$app/stores';
  let { data } = $props();
  let characters = data.characters || [];
  let currentStep = 1;
  let selectedIds = new Set();
  let selectedCharacters = $derived(characters.filter(char => selectedIds.has(char.id)));
  let location = '';
  let action = '';
  let generatedImage = '';
  let constructedPrompt = '';
  let stitchedSheet = '';
  let error = '';
  let loading = false;
  let debug = $page.url.searchParams.has('debug');

  $effect(() => {
    characters = data.characters || [];
  });

  function toggleSelection(char) {
    if (selectedIds.has(char.id)) {
      selectedIds.delete(char.id);
    } else if (selectedIds.size < 5) {
      selectedIds.add(char.id);
    }
  }

  function nextStep() {
    if (currentStep === 1 && selectedIds.size < 2) {
      error = 'Select at least 2 characters (max 5)';
      return;
    }
    if (currentStep === 2 && (!location.trim() || !action.trim())) {
      error = 'Please fill in location and action';
      return;
    }
    error = '';
    currentStep++;
  }

  function prevStep() {
    currentStep--;
  }

  async function handleGenerate({ result }) {
    loading = false;
    if (result.success) {
      generatedImage = result.image;
      constructedPrompt = result.prompt;
      if (debug) {
        stitchedSheet = result.stitchedSheet;
      }
    } else {
      error = result.error || 'Generation failed';
    }
  }
</script>

<svelte:head>
  <title>Band Composer - The Vagabond Foundry</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-green-100 py-8 px-4">
  <div class="max-w-4xl mx-auto">
    <!-- Back Navigation -->
    <div class="mb-8">
      <a href="/" class="inline-flex items-center text-stone-600 hover:text-stone-800 font-semibold mb-4">
        ← Back to Home
      </a>
      <h1 class="text-3xl font-bold text-stone-800 text-center">Band Composer</h1>
    </div>

    {#if error}
      <div class="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-4 text-center">
        {error}
      </div>
    {/if}

    <!-- Stepper -->
    <div class="flex justify-between mb-8">
      <div class="flex items-center">
        <div class={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>1</div>
        <div class="ml-2 text-sm font-medium">Selection</div>
      </div>
      <div class="flex items-center">
        <div class={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>2</div>
        <div class="ml-2 text-sm font-medium">Description</div>
      </div>
      <div class="flex items-center">
        <div class={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= 3 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>3</div>
        <div class="ml-2 text-sm font-medium">Generate</div>
      </div>
    </div>

    <!-- Step 1: Character Selection -->
    {#if currentStep === 1}
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-2xl font-semibold mb-4">Select 2-5 Characters</h2>
        <p class="text-stone-600 mb-6">Choose characters from your gallery to include in the band scene.</p>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {#each characters as char (char.id)}
            <label class="relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow {selectedIds.has(char.id) ? 'ring-2 ring-green-500' : ''}" on:click={() => toggleSelection(char)}>
              <input
                type="checkbox"
                checked={selectedIds.has(char.id)}
                disabled={selectedIds.size >= 5 && !selectedIds.has(char.id)}
                class="sr-only"
              />
              <div class="aspect-square overflow-hidden">
                <img src={char.image} alt={char.char_name} class="w-full h-full object-cover" />
              </div>
              <div class="p-3 text-center">
                <h3 class="font-semibold text-stone-800 text-sm">{char.char_name}</h3>
              </div>
              {#if selectedIds.size >= 5 && !selectedIds.has(char.id)}
                <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span class="text-white text-xs">Max reached</span>
                </div>
              {/if}
            </label>
          {/each}
        </div>
        <p class="text-sm text-stone-600 mt-4">Selected: {selectedIds.size}/5</p>
      </div>
    {/if}

    <!-- Step 2: Scene Description -->
    {#if currentStep === 2}
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-2xl font-semibold mb-4">Describe the Scene</h2>
        <p class="text-stone-600 mb-6">Provide a location and action for your band.</p>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-stone-700 mb-1">Location (e.g., "In a misty forest tavern")</label>
            <textarea
              bind:value={location}
              rows="3"
              class="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Describe the setting..."
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-stone-700 mb-1">Action (e.g., "plotting their next heist")</label>
            <textarea
              bind:value={action}
              rows="3"
              class="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="What are they doing..."
            ></textarea>
          </div>
        </div>
        <div class="mt-6 flex flex-col sm:flex-row gap-4">
          <button on:click={prevStep} class="flex-1 bg-gray-300 hover:bg-gray-400 text-stone-800 font-semibold py-3 px-6 rounded-lg transition-colors">
            Previous
          </button>
          <button on:click={nextStep} class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            Next
          </button>
        </div>
      </div>
    {/if}

    <!-- Step 3: Generation -->
    {#if currentStep === 3}
      <form method="POST" action="?/generate" use:enhance={handleGenerate} class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-2xl font-semibold mb-4">Generate Band Scene</h2>
        <input type="hidden" name="selectedIds" value={Array.from(selectedIds).join(',')} />
        <input type="hidden" name="location" value={location} />
        <input type="hidden" name="action" value={action} />
        <div class="space-y-4 mb-6">
          <button type="submit" disabled={loading} class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            {loading ? 'Generating...' : 'Generate Scene'}
          </button>
          <button type="button" on:click={prevStep} class="w-full bg-gray-300 hover:bg-gray-400 text-stone-800 font-semibold py-3 px-6 rounded-lg transition-colors">
            Previous
          </button>
        </div>
        {#if generatedImage}
          <div class="text-center">
            <img src={generatedImage} alt="Generated band scene" class="max-w-full h-auto rounded-lg shadow-md mx-auto mb-4" />
            <a href={generatedImage} download="band-scene.png" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
              Save to Device
            </a>
          </div>
        {/if}
        {#if debug && constructedPrompt}
          <details class="mt-6 p-4 bg-gray-50 rounded-lg">
            <summary class="cursor-pointer font-semibold">Debug: Constructed Prompt</summary>
            <pre class="mt-2 text-sm text-stone-700 overflow-auto">{constructedPrompt}</pre>
          </details>
        {/if}
        {#if debug && stitchedSheet}
          <details class="mt-6 p-4 bg-gray-50 rounded-lg">
            <summary class="cursor-pointer font-semibold">Debug: Stitched Character Sheet</summary>
            <img src={stitchedSheet} alt="Stitched characters" class="max-w-full h-auto rounded-lg mt-2" />
          </details>
        {/if}
      </form>
    {/if}

    <!-- Navigation Buttons (except in step 3) -->
    {#if currentStep < 3}
      <div class="flex flex-col sm:flex-row gap-4">
        {#if currentStep > 1}
          <button on:click={prevStep} class="flex-1 bg-gray-300 hover:bg-gray-400 text-stone-800 font-semibold py-3 px-6 rounded-lg transition-colors">
            Previous
          </button>
        {/if}
        <button on:click={nextStep} class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors" disabled={loading}>
          {currentStep === 2 ? 'Generate' : 'Next'}
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  /* Custom styles if needed */
</style>