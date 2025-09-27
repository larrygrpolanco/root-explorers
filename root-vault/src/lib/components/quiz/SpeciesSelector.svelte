<script>
	import { quizStore } from '$lib/stores/quizStore.js';
	let species = $quizStore.species;
	$: quizStore.update(s => ({ ...s, species }));
</script>

<div class="mb-4">
	<label for="species" class="block text-sm font-medium text-gray-700 mb-2">Species</label>
	<select id="species" bind:value={species} class="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
		<option value="">Select species</option>
		<option value="Badger">Badger</option>
		<option value="Bird">Bird</option>
		<option value="Cat">Cat</option>
		<option value="Fox">Fox</option>
		<option value="Mouse">Mouse</option>
		<option value="Owl">Owl</option>
		<option value="Rabbit">Rabbit</option>
		<option value="Raccoon">Raccoon</option>
		<option value="Squirrel">Squirrel</option>
		<option value="Wolf">Wolf</option>
		<option value="Beaver">Beaver</option>
		<option value="Opossum">Opossum</option>
	</select>
</div>