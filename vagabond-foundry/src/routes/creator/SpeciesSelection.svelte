<script>
  import { species } from '$lib/data-sources.js';
  import { characterStore } from '$lib/stores.js';

  let customSpecies = '';
  $: if ($characterStore.species === 'Other') {
    characterStore.update(c => ({ ...c, species: customSpecies }));
  }

  function selectSpecies(selected) {
    if (selected === 'Other') {
      customSpecies = '';
      // Input will handle update
    } else {
      characterStore.update(c => ({ ...c, species: selected }));
      customSpecies = '';
    }
  }
</script>

<div class="space-y-4">
  <h2 class="text-xl font-semibold text-center text-brown-800">Choose Your Species</h2>
  <p class="text-center text-brown-600 mb-4">What animal form does your vagabond take?</p>
  
  <div class="space-y-2 max-h-96 overflow-y-auto">
    {#each species as sp}
      <button
        class="w-full p-3 text-left border rounded-lg transition-colors { $characterStore.species === sp ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400' }"
        on:click={() => selectSpecies(sp)}
      >
        {sp}
      </button>
    {/each}
  </div>

  {#if $characterStore.species === 'Other'}
    <div class="mt-4">
      <label class="block text-sm font-medium text-brown-700 mb-2">Custom Species</label>
      <input
        type="text"
        bind:value={customSpecies}
        placeholder="Enter custom species name"
        class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        on:input={() => characterStore.update(c => ({ ...c, species: customSpecies || 'Other' }))}
      />
    </div>
  {/if}
</div>