module.exports = {
  verbose: false,
  collectCoverage: false,
  collectCoverageFrom: ["src/**/*.{js,ts}", "!src/__tests__/**/*.{js,ts}"],
  testMatch: ["<rootDir>/**/?(*.)(spec|test|unit).(js?(x)|ts?(x))"],
  transform: {
    "^.+\\.njk$": "./src/__tests__/testHelpers/nunjucks-transformer.js",
    "^.+\\.js$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleDirectories: ["node_modules"],
  testPathIgnorePatterns: ["/node_modules"],
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/testHelpers/customMatchers.js"],
  moduleNameMapper: {
    "^~?@/(.*)$": "<rootDir>/src/$1",
    "^~?template/(.*)$": "<rootDir>/src/templates/$1",
  },
  globals: {
    nunjucks: {
      root: "./src",
      config: {},
    },
    "ts-jest": {
      tsconfig: {
        module: "commonjs",
      },
    },
  },
  preset: "ts-jest/presets/js-with-babel",
};
