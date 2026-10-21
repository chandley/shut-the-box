module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/test/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },
};
