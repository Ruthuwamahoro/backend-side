module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverageFrom:["./src/**"],
    testTimeout: 30000,
    coverageThreshold: {
      global: {
        lines: 50,
      },
    },
  };
  