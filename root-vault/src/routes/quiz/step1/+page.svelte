<script>
	import SpeciesSelector from '$lib/components/quiz/SpeciesSelector.svelte';
	import ColorSelector from '$lib/components/quiz/ColorSelector.svelte';
	import BuildHeightSelector from '$lib/components/quiz/BuildHeightSelector.svelte';
</script>

<div class="space-y-6">
	<h1 class="text-2xl font-bold text-gray-900">Step 1: Basics</h1>
	<p class="text-gray-600">Tell us about your character's physical appearance.</p>
	
	<SpeciesSelector />
	<ColorSelector type="fur" />
	<ColorSelector type="eye" />
	<BuildHeightSelector />
</div>