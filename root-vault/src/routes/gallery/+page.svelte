<script>
	import { galleryStore } from '$lib/stores/galleryStore.js';
	
	$: portraits = $galleryStore;
	let editingId = null;
	let editPrompt = '';
	let loadingEdit = null;
	
	async function handleEdit(portraitId) {
		if (!editPrompt.trim()) {
			alert('Please enter an edit description.');
			return;
		}
		loadingEdit = portraitId;
		try {
			await galleryStore.editImage(portraitId, editPrompt);
			editPrompt = '';
		} catch (error) {
			alert('Failed to edit image. Check console for details.');
			console.error('Edit error:', error);
		} finally {
			loadingEdit = null;
		}
	}
	
	function openEditModal(portraitId) {
		editingId = portraitId;
		editPrompt = '';
	}
	
	function closeEditModal() {
		editingId = null;
	}
</script>

<svelte:head>
	<title>Your Gallery - Root Vagabond Portrait Creator</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold text-gray-900 mb-8 text-center">Your Saved Portraits</h1>
	
	{#if portraits.length === 0}
		<div class="text-center py-12">
			<p class="text-xl text-gray-600 mb-4">No portraits saved yet.</p>
			<a href="/quiz/step1" class="text-blue-500 hover:underline">Start creating your first portrait!</a>
		</div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{#each portraits as portrait (portrait.id)}
				<div class="bg-white rounded-lg shadow-md overflow-hidden relative">
					{#if loadingEdit === portrait.id}
						<div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
							<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
						</div>
					{/if}
					<img src={portrait.imageUrl} alt={portrait.prompt} class="w-full h-64 object-cover" />
					<div class="p-4">
						<p class="text-sm text-gray-600 line-clamp-2">{portrait.prompt}</p>
						<p class="text-xs text-gray-400 mt-2">{new Date(portrait.timestamp).toLocaleDateString()}</p>
						<div class="mt-3 flex gap-2">
							<button
								on:click={() => openEditModal(portrait.id)}
								class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
								disabled={loadingEdit === portrait.id}
							>
								Edit
							</button>
							<a
								href={portrait.imageUrl}
								download={`vagabond-portrait-${portrait.id}.png`}
								class="px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
							>
								Download
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

{#if editingId}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
		<div class="bg-white p-6 rounded-lg max-w-md w-full mx-4">
			<h2 class="text-xl font-bold mb-4">Edit Portrait</h2>
			<p class="text-sm text-gray-600 mb-4">Describe changes (e.g., "change fur to blue", "add hat"):</p>
			<textarea
				bind:value={editPrompt}
				rows="3"
				class="w-full p-2 border rounded mb-4"
				placeholder="Enter edit prompt..."
			></textarea>
			<div class="flex gap-2 justify-end">
				<button
					on:click={closeEditModal}
					class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
				>
					Cancel
				</button>
				<button
					on:click={() => handleEdit(editingId)}
					disabled={!editPrompt.trim() || loadingEdit}
					class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
				>
					{#if loadingEdit}Editing...{:else}Edit Image{/if}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>