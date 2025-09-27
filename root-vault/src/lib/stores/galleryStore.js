import { writable } from 'svelte/store';
import { generateImage, editImage } from '$lib/utils/mockAI.js';

const STORAGE_KEY = 'root-vagabond-gallery';

let initialData = [];

if (typeof window !== 'undefined') {
	const saved = localStorage.getItem(STORAGE_KEY);
	if (saved) {
		initialData = JSON.parse(saved);
	}
}

const { subscribe, set, update } = writable(initialData);

function saveToStorage(value) {
	if (typeof window !== 'undefined') {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
	}
}

subscribe(value => saveToStorage(value));

const getStoreValue = () => {
  let value;
  subscribe(v => value = v)();
  return value;
};

export const galleryStore = {
	subscribe,
	set,
	update,
	get: getStoreValue,
	generateFromQuiz: async (quizData) => {
		const { species, furColor, height, build } = quizData;
		const prompt = `Photorealistic image of ${species} ${furColor} creature ${height} tall in fantasy setting, ${build} build.`;
		try {
			const result = await generateImage(prompt);
			if (result.image) {
				const newPortrait = {
					id: Date.now().toString(),
					imageUrl: result.image,
					prompt,
					timestamp: new Date().toISOString(),
					liked: false
				};
				update(g => [...g, newPortrait]);
				return newPortrait;
			} else {
				throw new Error('No image generated');
			}
		} catch (error) {
			console.error('Error generating image:', error);
			throw error;
		}
	},
	editImage: async (portraitId, editPrompt) => {
		const current = getStoreValue();
		const portraitIndex = current.findIndex(p => p.id === portraitId);
		if (portraitIndex === -1) return;

		const baseImageUrl = current[portraitIndex].imageUrl;
		const base64Match = baseImageUrl.match(/^data:image\/png;base64,(.+)$/);
		if (!base64Match) return;

		const base64Image = base64Match[1];

		try {
			const result = await editImage(editPrompt, base64Image);
			if (result.image) {
				update(g => {
					const newG = [...g];
					newG[portraitIndex] = { ...newG[portraitIndex], imageUrl: result.image, prompt: `${newG[portraitIndex].prompt} - Edited: ${editPrompt}` };
					return newG;
				});
			}
		} catch (error) {
			console.error('Error editing image:', error);
			throw error;
		}
	}
};