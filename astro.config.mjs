// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://heseven.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Inline all CSS: removes the render-blocking stylesheet request (mobile LCP).
    inlineStylesheets: 'always',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    sitemap({
      filter: (page) => !/\/(thanks|styleguide)\/$/.test(page),
    }),
  ],
  // Self-hosted, latin-only, exact weights. Files come from @fontsource packages (no network at build).
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Syne',
      cssVariable: '--font-syne',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          { weight: 600, style: 'normal', src: ['@fontsource/syne/files/syne-latin-600-normal.woff2'] },
          { weight: 700, style: 'normal', src: ['@fontsource/syne/files/syne-latin-700-normal.woff2'] },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Roboto',
      cssVariable: '--font-roboto',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          { weight: 400, style: 'normal', src: ['@fontsource/roboto/files/roboto-latin-400-normal.woff2'] },
          { weight: 500, style: 'normal', src: ['@fontsource/roboto/files/roboto-latin-500-normal.woff2'] },
        ],
      },
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
