import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      'dist/',
      '.astro/',
      '.wrangler/',
      'studio/', // separate Sanity Studio app with its own tooling
      'node_modules/',
      '.lighthouseci/',
      'playwright-report/',
      'test-results/',
    ],
  },
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
];
