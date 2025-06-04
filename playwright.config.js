module.exports = {
  testDir: "./tests",
  testMatch: /.*-visual-test\.spec\.js/,
  timeout: 30000,
  use: {
    headless: true,
  },
};
