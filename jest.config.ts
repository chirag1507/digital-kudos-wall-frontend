import type { Config } from "jest";

const commonConfig: Partial<Config> = {
  preset: "ts-jest",
  roots: ["<rootDir>/src"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/**/__tests__/**", "!src/**/?(*.)+(spec|test).*"],
};

const config: Config = {
  projects: [
    // Component & General Unit Test Configuration
    {
      ...commonConfig,
      displayName: "component",
      testEnvironment: "jsdom",
      testMatch: ["**/__tests__/**/*.test.tsx", "**/?(*.)+(spec|test).tsx"],
      setupFilesAfterEnv: ["<rootDir>/src/jest.setup.ts", "<rootDir>/src/setupComponentTests.ts"],
      testPathIgnorePatterns: ["/node_modules/", "/pact/"],
    },
    // Pact Contract Test Configuration
    {
      ...commonConfig,
      displayName: "contract",
      testEnvironment: "node", // Pact runs in a node environment
      testMatch: ["**/?(*.)+pact.test.ts"],
      setupFilesAfterEnv: ["<rootDir>/src/jest.setup.ts"], // No MSW setup
    },
  ],
  coverageDirectory: "coverage",
  collectCoverage: true,
};

export default config;
