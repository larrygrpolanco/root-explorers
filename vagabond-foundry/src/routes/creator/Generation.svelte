<script>
  import { characterStore } from '$lib/stores.js';
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let loading = false;
  let generatedImage = $characterStore.generatedImage;
  let prompt = $characterStore.prompt;
  let error = '';

  export let isDebug = false;

  function validateCharacter() {
    const c = $characterStore;
    return c.playbook && c.species && c.demeanor && c.physical_desc && c.trinket && c.char_name;
  }

  function handleGenerate({ result }) {
    loading = false;
    if (result.success) {
      generatedImage = result.image;
      prompt = result.prompt;
      characterStore.update(c => ({ ...c, generatedImage, prompt }));
      if (isDebug) {
        console.log('Debug mode: Generated prompt:', prompt);
      }
    } else {
      error = result.error;
    }
  }

  function handleSave({ result }) {
    loading = false;
    if (result.success) {
      // Navigate to gallery or show success
      error = '';
      // Optionally reset store or navigate
    } else {
      error = result.error;
    }
  }
</script>

<div class="space-y-6 text-center">
  <h2 class="text-xl font-semibold text-brown-800">Generate Your Vagabond</h2>
  <p class="text-brown-600 mb-4">Review your character and generate their portrait.</p>

  {#if error}
    <div class="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
      {error}
    </div>
  {/if}

  {#if loading}
    <div class="flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
    <p class="text-brown-600">Generating portrait...</p>
  {:else if generatedImage}
    <div class="space-y-4">
      <img src={generatedImage} alt="Generated Vagabond" class="w-full max-w-md mx-auto rounded-lg shadow-lg" />
      {#if isDebug}
        <div class="p-4 bg-yellow-100 rounded-lg">
          <h3 class="font-semibold mb-2">Debug Prompt:</h3>
          <pre class="text-sm whitespace-pre-wrap text-brown-800">{prompt}</pre>
        </div>
      {/if}
      <div class="flex space-x-4 justify-center">
        <form method="POST" action="?/generate" use:enhance={{ onSubmit: () => loading = true }}>
          <input type="hidden" name="playbook" value={$characterStore.playbook} />
          <input type="hidden" name="species" value={$characterStore.species} />
          <input type="hidden" name="demeanor" value={$characterStore.demeanor} />
          <input type="hidden" name="physical_desc" value={$characterStore.physical_desc} />
          <input type="hidden" name="trinket" value={$characterStore.trinket} />
          <input type="hidden" name="char_name" value={$characterStore.char_name} />
          <input type="hidden" name="debug" value={isDebug.toString()} />
          <button type="submit" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Generate Again
          </button>
        </form>
        <form method="POST" action="?/save" use:enhance={handleSave}>
          <input type="hidden" name="playbook" value={$characterStore.playbook} />
          <input type="hidden" name="species" value={$characterStore.species} />
          <input type="hidden" name="demeanor" value={$characterStore.demeanor} />
          <input type="hidden" name="physical_desc" value={$characterStore.physical_desc} />
          <input type="hidden" name="trinket" value={$characterStore.trinket} />
          <input type="hidden" name="char_name" value={$characterStore.char_name} />
          <input type="hidden" name="generatedImage" value={generatedImage} />
          <input type="hidden" name="debug" value={isDebug.toString()} />
          <button type="submit" class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            Save to Gallery
          </button>
        </form>
      </div>
    </div>
  {:else}
    <form method="POST" action="?/generate" use:enhance={handleGenerate}>
      <input type="hidden" name="playbook" value={$characterStore.playbook} />
      <input type="hidden" name="species" value={$characterStore.species} />
      <input type="hidden" name="demeanor" value={$characterStore.demeanor} />
      <input type="hidden" name="physical_desc" value={$characterStore.physical_desc} />
      <input type="hidden" name="trinket" value={$characterStore.trinket} />
      <input type="hidden" name="char_name" value={$characterStore.char_name} />
      <input type="hidden" name="debug" value={isDebug.toString()} />
      <button type="submit" class="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold" disabled={!validateCharacter()}>
        Generate Portrait
      </button>
    </form>
  {/if}
</div>