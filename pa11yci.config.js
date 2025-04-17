module.exports = {
  defaults: {
    // Use WCAG 2 AA standard
    standard: 'WCAG2AA',
    // Set a longer timeout if needed
    timeout: 30000,
    // Additional options:
    hideElements: '',
    includeNotices: false,
    includeWarnings: false
  },
  // Define the URLs you want to test
  urls: [
    'http://localhost:3000',
    'http://localhost:3000/index-not-optimized.html'
    // Add more URLs as your project grows
  ],
  // Explicitly require the HTML reporter module
  reporters: {
    html: require('pa11y-ci-reporter-html')
  }
};
