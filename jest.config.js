module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  testMatch: [
    '<rootDir>/**/*.test.js',
  ],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!vue-awesome)',
  ],
};
