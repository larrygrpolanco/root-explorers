<script>
	import { quizStore } from '$lib/stores/quizStore.js';
	export let type; // 'fur' or 'eye'
	let color = $quizStore[type + 'Color'];
	$: quizStore.update(s => ({ ...s, [type + 'Color']: color }));
	
	const colors = type === 'fur' ? 
		['', 'brown', 'black', 'white', 'gray', 'red', 'orange', 'yellow', 'tan', 'silver'] :
		['', 'blue', 'green', 'brown', 'hazel', 'amber', 'black', 'gray'];
	
	const label = type === 'fur' ? 'Fur/Feather/Scale Color' : 'Eye Color';
</script>

<div class="mb-4">
	<label for="{type}-color" class="block text-sm font-medium text-gray-700 mb-2">{label}</label>
	<select id="{type}-color" bind:value={color} class="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
		{#each colors as c}
			<option value={c}>{c || 'Select color'}</option>
		{/each}
	</select>
</div>