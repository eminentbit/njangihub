export default {
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testEnvironment: "node",
  detectOpenHandles: true,
  setupFilesAfterEnv: ["./__tests__/setup.js"],
};
