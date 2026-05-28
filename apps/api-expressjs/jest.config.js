import { createDefaultEsmPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultEsmPreset().transform;

/** @type {import("jest").Config} **/
export default {
  testEnvironment: "node",
  preset: "ts-jest/presets/default-esm",
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.ts$": ['ts-jest', {
      useESM: true,
      tsconfig: "<rootDir>/tsconfig.test.json"
    }],
    ...tsJestTransformCfg,
  },

  // Permet à Jest de résoudre "../x.js" vers "../x"
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  setupFilesAfterEnv: ["<rootDir>/tests/setup/prisma.mock.ts"],

  coverageDirectory: "./coverage",
  coverageReporters: ["json-summary", "text", "lcov"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/index.ts",
    "!src/services/db.ts",
    "!src/services/multer.ts",
    "!src/generated/**",
    "!src/helpers/mustGetLocal.ts",
    "!src/types/**"
  ],
};