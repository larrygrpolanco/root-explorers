<script>
	import { quizStore } from '$lib/stores/quizStore.js';
	let playbook = $quizStore.playbook;
	$: quizStore.update(s => ({ ...s, playbook }));

	const playbooks = [
		'Adventurer',
		'Arbiter',
		'Harrier',
		'Ranger',
		'Ronin',
		'Scoundrel',
		'Thief',
		'Tinker',
		'Vagrant'
	];
</script>

<fieldset class="mb-4">
	<legend class="block text-sm font-medium text-gray-700 mb-4">Select Playbook</legend>
	<div role="radiogroup" class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
		{#each playbooks as pb}
			<button
				aria-pressed={playbook === pb.toLowerCase()}
				class="p-4 border rounded-md text-center {playbook === pb.toLowerCase() ? 'bg-blue-500 text-white border-blue-600' : 'bg-white border-gray-300 hover:border-blue-300'} transition-colors"
				class:selected={playbook === pb.toLowerCase()}
				on:click={() => playbook = pb.toLowerCase()}
			>
				{pb}
			</button>
		{/each}
	</div>
</fieldset>

<style>
	button.selected {
		transform: scale(1.05);
	}
</style>