module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ['<rootDir>src/setupTests.ts'],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy"
  }
};

