<script>
	import { page } from '$app/stores';
	import { quizStore } from '$lib/stores/quizStore.js';
	import { goto } from '$app/navigation';

	let currentStep = 1;
	$: {
		const path = $page.url.pathname;
		if (path.includes('/step1')) currentStep = 1;
		else if (path.includes('/step2')) currentStep = 2;
		else if (path.includes('/step3')) currentStep = 3;
		else currentStep = 1; // default
	}

	$: isValid = (() => {
		const data = $quizStore;
		switch (currentStep) {
			case 1:
				return data.species && data.furColor && data.eyeColor && data.build && data.height;
			case 2:
				return data.playbook;
			case 3:
				return data.definingFeature && data.typicalExpression && data.treasuredItem && data.preferredClothing;
			default:
				return false;
		}
	})();

	function handleNext() {
		if (currentStep < 3) {
			goto(`/quiz/step${currentStep + 1}`);
		}
	}

	function handleComplete() {
		const data = $quizStore;
		const mockPrompt = `Generate a Root Vagabond portrait for: ${data.species} with ${data.furColor} fur, ${data.eyeColor} eyes, ${data.build} build, ${data.height} height, ${data.playbook} playbook. Defining feature: ${data.definingFeature}. Expression: ${data.typicalExpression}. Item: ${data.treasuredItem}. Clothing: ${data.preferredClothing}.`;
		console.log('Mock AI Prompt:', mockPrompt);
		goto('/results');
	}
</script>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="max-w-2xl mx-auto px-4">
		<!-- Stepper -->
		<div class="mb-8 bg-white p-4 rounded-lg shadow-sm">
			<div class="flex justify-between items-center">
				<div class="flex items-center">
					<div class="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-3">1</div>
					<div>
						<div class="font-medium">Basics</div>
						<div class="text-sm text-gray-500">Species, colors, build, height</div>
					</div>
				</div>
				<div class="flex-1 h-1 bg-gray-200 mx-4"></div>
				<div class="flex items-center">
					<div class="w-10 h-10 {currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'} text-white rounded-full flex items-center justify-center font-bold mr-3">2</div>
					<div>
						<div class="font-medium">Playbook</div>
						<div class="text-sm text-gray-500">Choose your archetype</div>
					</div>
				</div>
				<div class="flex-1 h-1 bg-gray-200 mx-4"></div>
				<div class="flex items-center">
					<div class="w-10 h-10 {currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-300'} text-white rounded-full flex items-center justify-center font-bold mr-3">3</div>
					<div>
						<div class="font-medium">Spark of Life</div>
						<div class="text-sm text-gray-500">Personal details</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Page content -->
		<main class="bg-white p-6 rounded-lg shadow-sm mb-8">
			<slot />
		</main>

		<!-- Navigation -->
		<div class="flex justify-between">
			{#if currentStep > 1}
				<button onclick={() => goto(`/quiz/step${currentStep - 1}`)} class="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition">Back</button>
			{/if}
			{#if currentStep < 3}
				<button onclick={handleNext} disabled={!isValid} class="px-6 py-3 {isValid ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} rounded-lg transition ml-auto">Next</button>
			{:else}
				<button onclick={handleComplete} disabled={!isValid} class="px-6 py-3 {isValid ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} rounded-lg transition ml-auto">Complete Quiz</button>
			{/if}
		</div>
	</div>
</div>