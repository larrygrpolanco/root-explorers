<script>
  import { playbooks } from '$lib/data-sources.js';
  import { characterStore } from '$lib/stores.js';

  let selectedPlaybook = '';
  let physicalOptions = [];
  let trinketOptions = [];
  let selectedPhysical = [];
  let selectedTrinket = '';
  let customPhysical = '';
  let customTrinket = '';

  $: selectedPlaybook = $characterStore.playbook;
  $: if (selectedPlaybook) {
    const pb = playbooks.find(p => p.name === selectedPlaybook);
    physicalOptions = pb ? pb.physicalOptions : [];
    trinketOptions = pb ? pb.trinketOptions : [];
  }
  $: selectedPhysical = $characterStore.physical_desc ? $characterStore.physical_desc.split(', ') : [];
  $: selectedTrinket = $characterStore.trinket || '';
  $: if (customPhysical && selectedPhysical.includes('Other')) {
    const others = selectedPhysical.filter(tag => tag !== 'Other');
    characterStore.update(c => ({ ...c, physical_desc: [...others, customPhysical].join(', ') }));
  }
  $: if (customTrinket && selectedTrinket === 'Other') {
    characterStore.update(c => ({ ...c, trinket: customTrinket }));
  }

  function togglePhysical(tag) {
    if (tag === 'Other') {
      customPhysical = '';
    } else {
      const idx = selectedPhysical.indexOf(tag);
      if (idx > -1) {
        selectedPhysical = selectedPhysical.filter(t => t !== tag);
      } else {
        selectedPhysical = [...selectedPhysical, tag];
      }
      characterStore.update(c => ({ ...c, physical_desc: selectedPhysical.join(', ') }));
      if (selectedPhysical.includes('Other')) customPhysical = '';
    }
  }

  function selectTrinket(trinket) {
    if (trinket === 'Other') {
      customTrinket = '';
    } else {
      characterStore.update(c => ({ ...c, trinket }));
      customTrinket = '';
    }
  }
</script>

<div class="space-y-6">
  <h2 class="text-xl font-semibold text-center text-brown-800">Customize Appearance</h2>
  <p class="text-center text-brown-600 mb-4">Select physical traits and a trinket for your {selectedPlaybook}.</p>
  
  {#if !selectedPlaybook}
    <p class="text-center text-red-500">Please select a playbook first.</p>
  {:else}
    <!-- Physical Description -->
    <div class="space-y-3">
      <label class="block text-sm font-medium text-brown-700">Physical Description (select multiple)</label>
      <div class="space-y-2 max-h-48 overflow-y-auto">
        {#each physicalOptions as option}
          <label class="flex items-center p-2 border rounded-lg cursor-pointer transition-colors { selectedPhysical.includes(option) ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400' }">
            <input
              type="checkbox"
              checked={selectedPhysical.includes(option)}
              on:change={() => togglePhysical(option)}
              class="mr-2"
            />
            {option}
          </label>
        {/each}
        <label class="flex items-center p-2 border rounded-lg cursor-pointer transition-colors { selectedPhysical.includes('Other') ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400' }">
          <input
            type="checkbox"
            checked={selectedPhysical.includes('Other')}
            on:change={() => togglePhysical('Other')}
            class="mr-2"
          />
          Other
        </label>
      </div>
      {#if selectedPhysical.includes('Other')}
        <input
          type="text"
          bind:value={customPhysical}
          placeholder="Describe additional physical trait"
          class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      {/if}
    </div>

    <!-- Trinket -->
    <div class="space-y-3">
      <label class="block text-sm font-medium text-brown-700">Trinket (select one)</label>
      <div class="space-y-2 max-h-48 overflow-y-auto">
        {#each trinketOptions as trinket}
          <button
            class="w-full p-3 text-left border rounded-lg transition-colors { selectedTrinket === trinket ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400' }"
            on:click={() => selectTrinket(trinket)}
          >
            {trinket}
          </button>
        {/each}
        <button
          class="w-full p-3 text-left border rounded-lg transition-colors { selectedTrinket === 'Other' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400' }"
          on:click={() => selectTrinket('Other')}
        >
          Other
        </button>
      </div>
      {#if selectedTrinket === 'Other'}
        <input
          type="text"
          bind:value={customTrinket}
          placeholder="Describe custom trinket"
          class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          on:input
        />
      {/if>
    </div>
  {/if}
</div>