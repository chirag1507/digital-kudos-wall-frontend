// Jest global setup file
import "cross-fetch/polyfill";
import "@testing-library/jest-dom";

// Polyfills for React Router - simple approach to avoid require() linter errors
if (typeof global.TextEncoder === "undefined") {
  const { TextEncoder, TextDecoder } = eval("require")("util");
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
