/** @type {import('@lhci/cli/src/types').LighthouseCiConfiguration} */
module.exports = {
  ci: {
    collect: {
      // Use a static server for dist output
      staticDistDir: "./dist",
      numberOfRuns: 2,
      url: [
        "http://localhost/index.html",
        "http://localhost/blog/index.html",
        "http://localhost/search/index.html",
        "http://localhost/library/index.html"
      ],
      settings: {
        preset: "desktop"
      }
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["warn", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.95 }]
      }
    },
    upload: {
      target: "temporary-public-storage"
    }
  }
};
