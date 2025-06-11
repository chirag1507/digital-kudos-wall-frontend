// Jest setup file for frontend tests
import "@testing-library/jest-dom";
import { server } from "./__tests__/mocks/server";

// Polyfills for React Router - simple approach to avoid require() linter errors
if (typeof global.TextEncoder === "undefined") {
  const { TextEncoder, TextDecoder } = eval("require")("util");
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
