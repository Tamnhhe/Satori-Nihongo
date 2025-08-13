import { loadIcons } from './config/icon-loader';
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

// Polyfills for Node.js environment
if (typeof globalThis.TextEncoder === 'undefined') {
  const util = require('util'); // eslint-disable-line
  globalThis.TextEncoder = util.TextEncoder;
  globalThis.TextDecoder = util.TextDecoder;
}

// Load icons for tests
loadIcons();

// Mock window.matchMedia for responsive design tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver for chart components
(globalThis as any).ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver for lazy loading components
(globalThis as any).IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock scrollTo for navigation tests
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
});
