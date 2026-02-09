/* eslint-disable */
const { readFileSync } = require('fs');

// Reading the SWC compilation config for the spec files
const swcJestConfig = JSON.parse(
  readFileSync(`${__dirname}/.spec.swcrc`, 'utf-8'),
);

// Disable .swcrc look-up by SWC core because we're passing in swcJestConfig ourselves
swcJestConfig.swcrc = false;

module.exports = {
  displayName: '@magic-tool/backend',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['@swc/jest', swcJestConfig],
  },
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1',
    '^@identity/(.*)$': '<rootDir>/src/modules/identity/$1',
    '^@projects/(.*)$': '<rootDir>/src/modules/projects/$1',
    '^@operations/(.*)$': '<rootDir>/src/modules/operations/$1',
    '^@audit/(.*)$': '<rootDir>/src/modules/audit/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: 'test-output/jest/coverage',
};
