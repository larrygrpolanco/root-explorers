import { writable } from 'svelte/store';

const STORAGE_KEY = 'root-vagabond-quiz';

let initialData = {
	species: '',
	furColor: '',
	eyeColor: '',
	build: '',
	height: '',
	playbook: '',
	definingFeature: '',
	typicalExpression: '',
	treasuredItem: '',
	preferredClothing: ''
};

if (typeof window !== 'undefined') {
	const saved = localStorage.getItem(STORAGE_KEY);
	if (saved) {
		initialData = { ...initialData, ...JSON.parse(saved) };
	}
}

export const quizStore = writable(initialData);

quizStore.subscribe(value => {
	if (typeof window !== 'undefined') {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
	}
});