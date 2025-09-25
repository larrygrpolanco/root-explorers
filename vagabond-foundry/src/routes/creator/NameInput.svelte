<script>
  import { characterStore } from '$lib/stores.js';

  let name = $characterStore.char_name;
</script>

<div class="space-y-4">
  <h2 class="text-xl font-semibold text-center text-brown-800">Name Your Vagabond</h2>
  <p class="text-center text-brown-600 mb-4">Give your character a fitting name for their adventures.</p>
  
  <div class="mt-6">
    <label class="block text-sm font-medium text-brown-700 mb-2">Character Name</label>
    <input
      type="text"
      bind:value={$characterStore.char_name}
      placeholder="Enter character name"
      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg"
      maxlength="50"
    />
    {#if !$characterStore.char_name}
      <p class="text-sm text-red-500 mt-1 text-center">Name is required.</p>
    {/if}
  </div>
</div>