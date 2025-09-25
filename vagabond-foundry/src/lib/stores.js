import { writable } from 'svelte/store';

export const characterStore = writable({
  playbook: '',
  species: '',
  demeanor: '',
  physical_desc: '',
  trinket: '',
  char_name: '',
  generatedImage: '',
  prompt: ''
});