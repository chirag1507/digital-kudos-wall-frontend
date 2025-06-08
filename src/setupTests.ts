// Jest setup file for frontend tests
import "@testing-library/jest-dom";
import "cross-fetch/polyfill";
import { TextEncoder, TextDecoder } from "util";

// Global test configuration
if (typeof global !== "undefined") {
  global.console = {
    ...console,
    // Uncomment to ignore specific console outputs during tests
    // log: jest.fn(),
    // debug: jest.fn(),
    // info: jest.fn(),
    // warn: jest.fn(),
    // error: jest.fn(),
  };
}

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;
