<script>
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { goto } from '$app/navigation';

  let { data } = $props();
  let characters = data.characters || [];
  let selected = null;
  let error = '';
  let loading = false;
  let deleteConfirm = false;

  $effect(() => {
    characters = data.characters || [];
  });

  function openModal(char) {
    selected = char;
    deleteConfirm = false;
  }

  function closeModal() {
    selected = null;
    error = '';
  }

  async function handleDelete({ result }) {
    loading = false;
    if (result.success) {
      selected = null;
      deleteConfirm = false;
      await invalidateAll();
      // Or goto('/gallery') to reload
    } else {
      error = result.error || 'Delete failed';
    }
  }

  function confirmDelete() {
    deleteConfirm = true;
  }

  function cancelDelete() {
    deleteConfirm = false;
  }
</script>

<svelte:head>
  <title>Gallery - The Vagabond Foundry</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-green-100 py-8 px-4">
  <div class="max-w-6xl mx-auto">
    <!-- Back Navigation -->
    <div class="mb-8">
      <a href="/" class="inline-flex items-center text-stone-600 hover:text-stone-800 font-semibold mb-4">
        ← Back to Home
      </a>
      <h1 class="text-3xl font-bold text-stone-800 text-center">Vagabond Gallery</h1>
    </div>

    {#if error}
      <div class="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-4 text-center">
        {error}
      </div>
    {/if}

    {#if characters.length === 0}
      <div class="text-center py-12">
        <p class="text-stone-600 text-lg mb-4">No characters in the gallery yet.</p>
        <a href="/creator" class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
          Create Your First Vagabond
        </a>
      </div>
    {:else}
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {#each characters as char}
          <div class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" on:click={() => openModal(char)}>
            <div class="aspect-square overflow-hidden">
              <img src={char.image} alt={char.char_name} class="w-full h-full object-cover" />
            </div>
            <div class="p-3 text-center">
              <h3 class="font-semibold text-stone-800 text-sm">{char.char_name}</h3>
            </div>
          </div>
        {/each}
      </div>
    {/if}

    <!-- Modal -->
    {#if selected}
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <!-- Close Button -->
          <div class="p-4 border-b flex justify-between items-center">
            <h2 class="text-xl font-semibold text-stone-800">Character Details</h2>
            <button on:click={closeModal} class="text-stone-500 hover:text-stone-700 text-2xl">&times;</button>
          </div>

          <!-- Image -->
          <div class="p-4">
            <img src={selected.image} alt={selected.char_name} class="w-full max-h-96 object-contain mx-auto rounded" />
          </div>

          <!-- Details -->
          <div class="p-4 space-y-2">
            <div class="flex justify-between">
              <span class="text-stone-600 font-medium">Name:</span>
              <span class="text-stone-800">{selected.char_name}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-stone-600 font-medium">Playbook:</span>
              <span class="text-stone-800">{selected.playbook}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-stone-600 font-medium">Species:</span>
              <span class="text-stone-800">{selected.species}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-stone-600 font-medium">Demeanor:</span>
              <span class="text-stone-800">{selected.demeanor}</span>
            </div>
          </div>

          <!-- Delete Section -->
          <div class="p-4 border-t">
            {#if deleteConfirm}
              <div class="space-y-2">
                <p class="text-red-600 text-sm">Are you sure you want to delete {selected.char_name}?</p>
                <div class="flex space-x-2">
                  <form method="POST" action="?/default" use:enhance={handleDelete} class="flex-1">
                    <input type="hidden" name="id" value={selected.id} />
                    <button type="submit" class="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors" disabled={loading}>
                      {loading ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                  </form>
                  <button on:click={cancelDelete} class="flex-1 bg-gray-300 hover:bg-gray-400 text-stone-800 py-2 px-4 rounded transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            {:else}
              <button on:click={confirmDelete} class="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors">
                Delete Character
              </button>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>