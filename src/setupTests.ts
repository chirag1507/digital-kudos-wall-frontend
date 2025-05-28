// Jest setup file for frontend tests
import "@testing-library/jest-dom";

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
