import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
  testPathIgnorePatterns: ["/node_modules/", "/src/__tests__/mocks/"],
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
  ],
  coverageDirectory: "coverage",
  collectCoverage: true,
  setupFilesAfterEnv: ["<rootDir>/src/jest.setup.ts"], // Global setup
};

export default config;
