/**
 * Lighthouse CI — fails the build if any page drops below target.
 * Runs against the static build in ./dist (mobile emulation by default).
 */
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      // Add every indexable page template here as it's built (404 is noindex by design, so excluded).
      url: [
        'http://localhost/',
        'http://localhost/services/',
        'http://localhost/services/store-development/',
        'http://localhost/contact/',
      ],
      numberOfRuns: 3,
      settings: {
        // CI runners are slower than real devices; this keeps results stable.
        throttlingMethod: 'simulate',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.98 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
        'total-blocking-time': ['error', { maxNumericValue: 100 }],
        'resource-summary:script:size': ['error', { maxNumericValue: 100000 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
