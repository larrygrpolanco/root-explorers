<script>
	import { galleryStore } from '$lib/stores/galleryStore.js';
	
	$: portraits = $galleryStore;
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
			{#each portraits as portrait}
				<div class="bg-white rounded-lg shadow-md overflow-hidden">
					<img src={portrait.imageUrl} alt={portrait.prompt} class="w-full h-64 object-cover" />
					<div class="p-4">
						<p class="text-sm text-gray-600 line-clamp-2">{portrait.prompt}</p>
						<p class="text-xs text-gray-400 mt-2">{new Date(portrait.timestamp).toLocaleDateString()}</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>