<script>
  import { playbooks } from '$lib/data-sources.js';
  import { characterStore } from '$lib/stores.js';

  function selectPlaybook(playbook) {
    characterStore.update(c => ({ ...c, playbook: playbook.name }));
  }
</script>

<div class="space-y-4">
  <h2 class="text-xl font-semibold text-center text-brown-800">Choose Your Playbook</h2>
  <p class="text-center text-brown-600 mb-4">Select the archetype that defines your vagabond's journey.</p>
  
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {#each playbooks as playbook}
      <div
        class="p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md { $characterStore.playbook === playbook.name ? 'border-blue-500 bg-blue-50' : 'border-gray-300' }"
        on:click={() => selectPlaybook(playbook)}
      >
        <img src={playbook.image} alt={playbook.name} class="w-full h-32 object-cover rounded mb-2" />
        <h3 class="font-bold text-brown-800">{playbook.name}</h3>
        <p class="text-sm text-brown-600">{playbook.description}</p>
      </div>
    {/each}
  </div>
</div>