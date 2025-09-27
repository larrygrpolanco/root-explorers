<script>
	import { quizStore } from '$lib/stores/quizStore.js';
	export let field; // e.g., 'definingFeature'
	let value = $quizStore[field];
	$: quizStore.update(s => ({ ...s, [field]: value }));
	export let label = '';
	export let maxLength = 100;
	let charCount = 0;
	$: charCount = value.length;
</script>

<div class="mb-4">
	<label for="{field}" class="block text-sm font-medium text-gray-700 mb-2">{label}</label>
	<textarea
		id="{field}"
		bind:value
		maxlength={maxLength}
		rows="3"
		class="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
		placeholder="Enter your response (max {maxLength} characters)"
	></textarea>
	<div class="text-xs text-gray-500 mt-1">Characters: {charCount}/{maxLength}</div>
	{#if charCount > maxLength}
		<div class="text-xs text-red-500 mt-1">Over limit!</div>
	{/if}
</div>