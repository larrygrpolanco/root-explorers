import { json } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Character } from '$lib/models/Character.js';
import { GEMINI_API_KEY } from '$env/static/private';

/**
 * POST /api/generate
 * 
 * Generates a character portrait using Google Gemini API based on quiz data.
 * Constructs a prompt from the research template and returns a complete Character object.
 */
export async function POST({ request }) {
	try {
		// Parse request body
		const quizData = await request.json();
		
		// Validate and create Character from quiz data
		let character;
		try {
			character = Character.fromQuizData(quizData);
		} catch (error) {
			return json(
				{ error: `Invalid quiz data: ${error.message}` },
				{ status: 500 }
			);
		}

		// Validate API key is available
		if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
			console.error('GEMINI_API_KEY environment variable not set');
			return json(
				{ error: 'Generation service temporarily unavailable. Please try again later.' },
				{ status: 500 }
			);
		}

		// Initialize Gemini AI
		const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
		const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

		// Construct prompt from research template
		const prompt = constructPrompt(character);
		
		// Generate image using Gemini API
		try {
			const result = await model.generateContent([prompt]);
			const response = await result.response;
			const generatedText = response.text();
			
			// For now, we'll simulate a portrait URL since Gemini Flash primarily generates text
			// In a real implementation, you would use Gemini's image generation capabilities
			// or integrate with another image generation service
			const portraitUrl = `data:image/svg+xml;base64,${btoa(createPlaceholderSVG(character))}`;
			
			// Update character with generated content
			character.portrait = portraitUrl;
			character.prompt = prompt;
			
			return json(character.toJSON());
			
		} catch (apiError) {
			console.error('Gemini API error:', apiError);
			
			// Handle specific API errors
			if (apiError.message?.includes('quota') || apiError.message?.includes('rate limit')) {
				return json(
					{ error: 'Generation service is busy. Please try again in a moment.' },
					{ status: 429 }
				);
			}
			
			return json(
				{ error: 'Generation failed. Please try again.' },
				{ status: 500 }
			);
		}
		
	} catch (error) {
		console.error('Generate endpoint error:', error);
		return json(
			{ error: 'Generation failed. Please try again.' },
			{ status: 500 }
		);
	}
}

/**
 * Constructs the prompt for image generation based on research template
 * @param {Character} character - The character object with quiz data
 * @returns {string} The constructed prompt
 */
function constructPrompt(character) {
	// Template from research.md with dynamic insertion
	return `Full body portrait of ${character.name}, ${character.speciesRole}. Their demeanor is defined by: ${character.demeanor}. They are dressed ${character.presentation}. They carry ${character.item}. We find them ${character.scene}. In the vibrant, storybook art style of Kyle Ferrin's Root board game, textured and expressive.`;
}

/**
 * Creates a placeholder SVG for development/testing purposes
 * @param {Character} character - The character object
 * @returns {string} SVG markup as string
 */
function createPlaceholderSVG(character) {
	// Default color since speciesRole is descriptive
	const color = '#666666';
	
	return `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
		<rect width="400" height="400" fill="#f0f8ff"/>
		<circle cx="200" cy="150" r="80" fill="${color}" stroke="#333" stroke-width="3"/>
		<circle cx="180" cy="130" r="8" fill="#000"/>
		<circle cx="220" cy="130" r="8" fill="#000"/>
		<path d="M 180 170 Q 200 180 220 170" stroke="#333" stroke-width="2" fill="none"/>
		<text x="200" y="320" text-anchor="middle" font-family="serif" font-size="18" fill="#333">
			${character.name}
		</text>
		<text x="200" y="340" text-anchor="middle" font-family="serif" font-size="14" fill="#666">
			${character.speciesRole}
		</text>
	</svg>`;
}