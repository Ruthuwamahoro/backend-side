module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 30000,
    coverageThreshold: {
      global: {
        lines: 50,
      },
    },
  };
  