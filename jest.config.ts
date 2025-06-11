import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/src/__tests__/mocks/handlers.ts",
    "/src/__tests__/mocks/server.ts",
    "/src/__tests__/page-objects/",
    "/src/__tests__/builders/",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/main.tsx",
    "!src/**/vite-env.d.ts",
    "!src/**/__tests__/**",
    "!src/**/*.pact.test.ts",
    "!src/**/__tests__/page-objects/**",
    "!src/**/__tests__/builders/**",
  ],
  coverageDirectory: "coverage",
  collectCoverage: true,
  setupFilesAfterEnv: ["<rootDir>/src/setupComponentTests.ts"],
};

export default config;
