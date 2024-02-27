module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    correctCoverageFrom: ['src/**'],
    testTimeout: 30000,
    coverageThreshold: {
      global: {
        lines: 50,
      },
    },
  };
  