module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    clearMocks: true,
    collectCoverage: true,
    testTimeout: 30000,
    coverageThreshold: {
      global: {
        lines: 50,
      },
    },
  };
  