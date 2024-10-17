export default {
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest', // This allows Jest to transform JS/JSX files
  },
  testEnvironment: 'jsdom', // Set the test environment to 'jsdom' for browser-like environment
  moduleFileExtensions: ['js', 'jsx'], // Recognize JS and JSX files
  transformIgnorePatterns: ['<rootDir>/node_modules/'], // Ignore transforming node_modules

  // Add this part to mock CSS files
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/jest/styleMock.js',
  },

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'] // Add this line here
};
