// Jest setup file for component tests - includes all polyfills and MSW setup
import "cross-fetch/polyfill";
import "@testing-library/jest-dom";
import { server } from "./__tests__/mocks/server";
import { configure } from "@testing-library/react";
import { act } from "react";

// Configure React Testing Library to use React.act
configure({ asyncUtilTimeout: 5000 });

// Polyfills for React Router - simple approach to avoid require() linter errors
if (typeof global.TextEncoder === "undefined") {
  const util = eval("require")("util") as { TextEncoder: typeof TextEncoder; TextDecoder: typeof TextDecoder };
  Object.assign(global, {
    TextEncoder: util.TextEncoder,
    TextDecoder: util.TextDecoder,
    act: act,
  });
}

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
