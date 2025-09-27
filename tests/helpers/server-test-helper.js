import { vi } from 'vitest';

/**
 * Helper to create a mock SvelteKit request object
 */
export function createMockRequest(method, url, body = null, headers = {}) {
	const request = {
		method,
		url,
		headers: new Map(Object.entries({
			'content-type': 'application/json',
			...headers
		})),
		json: async () => body,
		text: async () => JSON.stringify(body)
	};
	
	return request;
}

/**
 * Helper to create a mock SvelteKit RequestEvent
 */
export function createMockRequestEvent(method, url, body = null, headers = {}) {
	return {
		request: createMockRequest(method, url, body, headers),
		params: {},
		url: new URL(url, 'http://localhost:3000'),
		locals: {},
		platform: null,
		cookies: {
			get: vi.fn(),
			set: vi.fn(),
			delete: vi.fn()
		}
	};
}

/**
 * Helper to extract response data from SvelteKit Response
 */
export async function extractResponse(response) {
	const headers = {};
	response.headers.forEach((value, key) => {
		headers[key] = value;
	});
	
	let body;
	try {
		const text = await response.text();
		body = JSON.parse(text);
	} catch {
		body = await response.text();
	}
	
	return {
		status: response.status,
		ok: response.ok,
		headers,
		json: async () => body,
		text: async () => typeof body === 'string' ? body : JSON.stringify(body)
	};
}