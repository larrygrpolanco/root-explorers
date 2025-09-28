<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { quizStore } from '$lib/stores/quizStore.js';
	import { generatePortrait } from '$lib/utils/mockAI.js';
	import { galleryStore } from '$lib/stores/galleryStore.js';
	
	$: data = $quizStore;
	let loading = true;
	let prompt = '';
	let imageUrl = '';
	let liked = false;
	let downloadLink;
	
	onMount(async () => {
		if (!data || Object.keys(data).length === 0) {
			goto('/quiz/step1');
			return;
		}
		const result = await generatePortrait(data);
		prompt = result.prompt;
		imageUrl = result.imageUrl;
		loading = false;
	});
</script>

{#if loading}
	<div class="max-w-2xl mx-auto px-4 py-8 text-center">
		<h1 class="text-3xl font-bold text-gray-900 mb-4">Generating Portrait...</h1>
		<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
		<p class="text-gray-600 mt-4">Please wait while we create your unique Root Vagabond portrait.</p>
	</div>
{:else}
	<div class="max-w-2xl mx-auto px-4 py-8">
		<h1 class="text-3xl font-bold text-gray-900 mb-4">Your Root Vagabond Portrait</h1>
		
		<!-- Debug Prompt -->
		<div class="bg-gray-100 p-4 rounded-lg mb-6">
			<p class="text-sm text-gray-600 mb-2">Generated Prompt (for debug):</p>
			<p class="text-xs bg-white p-2 rounded border overflow-auto max-h-32">{prompt}</p>
		</div>
		
		<!-- Portrait Image -->
		<div class="bg-gray-100 p-8 rounded-lg text-center mb-6">
			<img src={imageUrl} alt="Generated Root Vagabond portrait based on: {prompt.substring(0, 100)}..." class="mx-auto rounded-lg shadow-lg max-w-full h-auto" />
		</div>
		
		<!-- Character Summary -->
		<div class="bg-gray-100 p-8 rounded-lg text-center mb-6">
			<p class="text-lg">Your character summary:</p>
			<ul class="mt-4 text-left max-w-md mx-auto space-y-2">
				<li><strong>Species:</strong> {data.species || 'Not selected'}</li>
				<li><strong>Fur Color:</strong> {data.furColor || 'Not selected'}</li>
				<li><strong>Eye Color:</strong> {data.eyeColor || 'Not selected'}</li>
				<li><strong>Build:</strong> {data.build || 'Not selected'}</li>
				<li><strong>Height:</strong> {data.height || 'Not selected'}</li>
				<li><strong>Playbook:</strong> {data.playbook || 'Not selected'}</li>
				<li><strong>Defining Feature:</strong> {data.definingFeature || 'Not provided'}</li>
				<li><strong>Typical Expression:</strong> {data.typicalExpression || 'Not provided'}</li>
				<li><strong>Treasured Item:</strong> {data.treasuredItem || 'Not provided'}</li>
				<li><strong>Preferred Clothing:</strong> {data.preferredClothing || 'Not provided'}</li>
			</ul>
		</div>
		
		<!-- Feedback Button -->
		<div class="text-center mb-4">
			<button
				aria-label={liked ? 'Unlike this portrait' : 'Like this portrait for AI feedback'}
				on:click={() => {
					liked = !liked;
					console.log(liked ? 'Portrait liked (feedback for AI improvement)' : 'Portrait disliked');
				}}
				class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
			>
				{liked ? 'Unlike' : 'Like this portrait?'}
			</button>
		</div>

		<!-- Action Buttons -->
		<div class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
			<button
				aria-label="Save this portrait to your gallery"
				on:click={async () => {
					const gallery = $galleryStore;
					if (gallery.some(p => p.imageUrl === imageUrl)) {
						alert('This portrait is already in your gallery.');
						return;
					}
					galleryStore.update(g => [...g, {
						id: Date.now().toString(),
						imageUrl,
						prompt,
						timestamp: new Date().toISOString(),
						liked: false
					}]);
					import { goto } from '$app/navigation';
					goto('/gallery');
				}}
				class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex-1 sm:flex-none"
			>
				Save to Gallery
			</button>
			<button
				aria-label="Try again with a new quiz to generate another portrait"
				on:click={() => {
					quizStore.set({});
					goto('/quiz/step1');
				}}
				class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex-1 sm:flex-none"
			>
				Try Again
			</button>
			<button
				aria-label="Download this portrait image"
				on:click={() => downloadLink.click()}
				class="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex-1 sm:flex-none"
			>
				Download Portrait
			</button>
		</div>
		<a
			bind:this={downloadLink}
			{href:imageUrl}
			download="vagabond-portrait.png"
			style="display:none"
			aria-label="Download link for portrait image"
			aria-hidden="true"
		></a>
	</div>
{/if}
