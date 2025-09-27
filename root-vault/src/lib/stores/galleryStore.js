import { writable } from 'svelte/store';

const STORAGE_KEY = 'root-vagabond-gallery';

let initialData = [];

if (typeof window !== 'undefined') {
	const saved = localStorage.getItem(STORAGE_KEY);
	if (saved) {
		initialData = JSON.parse(saved);
	}
}

export const galleryStore = writable(initialData);

galleryStore.subscribe(value => {
	if (typeof window !== 'undefined') {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
	}
});