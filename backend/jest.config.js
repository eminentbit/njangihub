export default {
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testEnvironment: "node",
  detectOpenHandles: true,
  setupFilesAfterEnv: ["./__tests__/setup.js"],
  // setup.js is a setup helper, not a test suite — exclude it from discovery
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/__tests__/setup.js"],
};
