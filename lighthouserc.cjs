module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      staticDistDir: './dist',
      url: [
        'http://localhost/index.html',
        'http://localhost/blog/index.html',
        'http://localhost/search/index.html',
        'http://localhost/library/index.html',
      ],
      settings: {
      throttlingMethod: 'provided',
      emulatedFormFactor: 'desktop',

        chromeFlags: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage'],
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      },
    },
    assert: {
      assertions: {
        // NebulaWind quality bar (tune later if needed)
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 1.0 }],
        'categories:seo': ['error', { minScore: 0.95 }],

        // Ensure console is clean
        'errors-in-console': 'error',
      },
    },
    upload: {
      target: 'filesystem',
    
    outputDir: '.lighthouseci'
  },
  },
};
