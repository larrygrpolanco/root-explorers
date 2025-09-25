<script>
  import { playbooks } from '$lib/data-sources.js';
  import { characterStore } from '$lib/stores.js';

  let customDemeanor = '';
  let selectedPlaybook = '';
  let availableDemeanors = [];

  $: selectedPlaybook = $characterStore.playbook;
  $: availableDemeanors = selectedPlaybook ? playbooks.find(p => p.name === selectedPlaybook)?.demeanors || [] : [];
  $: if ($characterStore.demeanor === 'Other') {
    characterStore.update(c => ({ ...c, demeanor: customDemeanor }));
  }

  function selectDemeanor(selected) {
    if (selected === 'Other') {
      customDemeanor = '';
    } else {
      characterStore.update(c => ({ ...c, demeanor: selected }));
      customDemeanor = '';
    }
  }
</script>

<div class="space-y-4">
  <h2 class="text-xl font-semibold text-center text-brown-800">Choose Your Demeanor</h2>
  <p class="text-center text-brown-600 mb-4">How does your {selectedPlaybook} vagabond carry themselves?</p>
  
  {#if !selectedPlaybook}
    <p class="text-center text-red-500">Please select a playbook first.</p>
  {:else}
    <div class="space-y-2 max-h-96 overflow-y-auto">
      {#each availableDemeanors as dem}
        <button
          class="w-full p-3 text-left border rounded-lg transition-colors { $characterStore.demeanor === dem ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400' }"
          on:click={() => selectDemeanor(dem)}
        >
          {dem}
        </button>
      {/each}
      <button
        class="w-full p-3 text-left border rounded-lg transition-colors { $characterStore.demeanor === 'Other' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400' }"
        on:click={() => selectDemeanor('Other')}
      >
        Other
      </button>
    </div>

    {#if $characterStore.demeanor === 'Other'}
      <div class="mt-4">
        <label class="block text-sm font-medium text-brown-700 mb-2">Custom Demeanor</label>
        <input
          type="text"
          bind:value={customDemeanor}
          placeholder="Enter custom demeanor"
          class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          on:input={() => characterStore.update(c => ({ ...c, demeanor: customDemeanor || 'Other' }))}
        />
      </div>
    {/if}
  {/if}
</div>