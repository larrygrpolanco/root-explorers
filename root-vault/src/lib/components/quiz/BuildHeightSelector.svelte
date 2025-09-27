<script>
	import { quizStore } from '$lib/stores/quizStore.js';
	let build = $quizStore.build;
	let height = $quizStore.height;
	$: quizStore.update(s => ({ ...s, build }));
	$: quizStore.update(s => ({ ...s, height }));
</script>

<fieldset class="mb-4">
	<legend class="block text-sm font-medium text-gray-700 mb-2">Build</legend>
		<div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
			{#each ['Slight', 'Average', 'Hefty'] as option}
				<label for="build-{option.toLowerCase()}" class="flex items-center cursor-pointer">
					<input id="build-{option.toLowerCase()}" type="radio" bind:group={build} value={option.toLowerCase()} class="mr-2" />
					{option}
				</label>
			{/each}
		</div>
</fieldset>
<fieldset class="mb-4">
	<legend class="block text-sm font-medium text-gray-700 mb-2">Height</legend>
		<div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
			{#each ['Short', 'Average', 'Tall'] as option}
				<label for="height-{option.toLowerCase()}" class="flex items-center cursor-pointer">
					<input id="height-{option.toLowerCase()}" type="radio" bind:group={height} value={option.toLowerCase()} class="mr-2" />
					{option}
				</label>
			{/each}
		</div>
</fieldset>