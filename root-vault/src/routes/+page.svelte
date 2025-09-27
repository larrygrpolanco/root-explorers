<script>
	import { goto } from '$app/navigation';
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
	<div class="text-center max-w-md">
		<h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to Root Vagabond Portrait Creator</h1>
		<p class="text-lg text-gray-600 mb-8">Create your unique Root Vagabond character portrait through an interactive quiz.</p>
		<div class="space-y-4">
			<button
				aria-label="Start the interactive quiz to create your Root Vagabond portrait"
				on:click={() => goto('/quiz/step1')}
				class="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
			>
				Start Quiz
			</button>
			<a
				aria-label="View your saved portraits in the gallery"
				href="/gallery"
				class="block w-full px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold text-center"
			>
				View Gallery
			</a>
		</div>
	</div>
</div>
