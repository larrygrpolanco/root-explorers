<script>
	import OpenQuestion from '$lib/components/quiz/OpenQuestion.svelte';
	import { quizStore } from '$lib/stores/quizStore.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// Mock completion logic: log prompt on mount if all previous steps filled
	onMount(() => {
		const data = $quizStore;
		if (data.species && data.playbook) {
			const mockPrompt = `Generate a Root Vagabond portrait for: ${data.species} with ${data.furColor} fur, ${data.eyeColor} eyes, ${data.build} build, ${data.height} height, ${data.playbook} playbook. Defining feature: ${data.definingFeature}. Expression: ${data.typicalExpression}. Item: ${data.treasuredItem}. Clothing: ${data.preferredClothing}.`;
			console.log('Mock AI Prompt:', mockPrompt);
			// Optionally auto-navigate after a delay, but keep manual for now
		}
	});
</script>

<form method="POST" action="/results" class="space-y-6">
	<div class="space-y-6">
		<h1 class="text-2xl font-bold text-gray-900">Step 3: Spark of Life</h1>
		<p class="text-gray-600">Add personal touches to bring your character to life.</p>
		
		<OpenQuestion field="definingFeature" label="Defining physical feature" maxLength={100} />
		<OpenQuestion field="typicalExpression" label="Typical expression/demeanor" maxLength={100} />
		<OpenQuestion field="treasuredItem" label="Treasured item carried" maxLength={100} />
		<OpenQuestion field="preferredClothing" label="Preferred clothing" maxLength={100} />
	</div>

	<!-- Hidden inputs for all quiz data from store -->
	{#each Object.entries($quizStore) as [key, value] (value)}
		<input type="hidden" name={key} value={value} />
	{/each}

	<button 
		type="submit" 
		disabled={!$quizStore.definingFeature || !$quizStore.typicalExpression || !$quizStore.treasuredItem || !$quizStore.preferredClothing}
		class="w-full mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
	>
		Complete Quiz & Generate Portrait
	</button>
</form>
