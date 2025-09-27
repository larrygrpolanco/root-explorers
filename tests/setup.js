import { vi } from 'vitest';

// Mock fetch globally for all tests
global.fetch = vi.fn();

// Mock console methods to reduce noise in tests
global.console = {
	...console,
	log: vi.fn(),
	warn: vi.fn(),
	error: vi.fn()
};