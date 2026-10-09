# Heseven website

Agency site for Heseven (Shopify Partner). Static [Astro](https://astro.build) site, deployed on Cloudflare Pages.
Target: **100 / 100 / 100 / 100** on PageSpeed Insights (mobile + desktop), enforced in CI.

## Stack

| Concern   | Choice                                                                                                   |
| --------- | -------------------------------------------------------------------------------------------------------- |
| Framework | Astro 7 (static output, zero JS by default)                                                              |
| Styling   | Tailwind CSS v4 — tokens in `src/styles/global.css`                                                      |
| Fonts     | Syne + Roboto, self-hosted via Astro Fonts API, latin-only, 2 preloads, metric-matched fallbacks         |
| Motion    | View Transitions (`<ClientRouter />`), Lenis smooth scroll, IntersectionObserver reveals (`data-reveal`) |
| CMS       | Sanity (Phase 4) — placeholder content until then                                                        |
| Analytics | GA4 + Meta Pixel, consent-gated, **off until IDs are set** (see `.env.example`)                          |
| Hosting   | Cloudflare Pages (`public/_headers`, `public/_redirects`)                                                |

## Getting started

```bash
nvm use            # Node 24
npm install
npm run dev        # http://localhost:4321
```

| Script                            | What it does                                               |
| --------------------------------- | ---------------------------------------------------------- |
| `npm run dev`                     | Dev server                                                 |
| `npm run build`                   | Type-check + production build to `dist/`                   |
| `npm run preview`                 | Serve `dist/` locally                                      |
| `npm run lint` / `npm run format` | ESLint / Prettier                                          |
| `npm test`                        | Playwright smoke + axe accessibility tests (needs a build) |
| `npm run lighthouse`              | Lighthouse CI against `dist/` with score budgets           |
| `npm run icons`                   | Regenerate favicons + OG image from `public/favicon.svg`   |

## Performance rules (keep the 100)

1. No UI frameworks on public pages. Interactivity = small `<script>` in the component.
2. Images only through `<Image>` / `<Picture>` from `astro:assets` with width/height. The hero (LCP) image gets `loading="eager" fetchpriority="high"`.
3. No third-party scripts outside `Analytics.astro` (consent-gated + idle-loaded).
4. Animate only `transform` and `opacity`. Respect `prefers-reduced-motion`.
5. Every new indexable page template → add its URL to `lighthouserc.cjs`.

## Tracking (GA4 / Meta Pixel)

Disabled by default. To enable, set in Cloudflare Pages → Settings → Environment variables (or `.env` locally):

```
PUBLIC_GA4_ID=G-XXXXXXXXXX
PUBLIC_META_PIXEL_ID=000000000000000
```

A cookie banner then appears; scripts load only after "Accept". The original vendor snippets are kept as comments in `src/components/layout/Analytics.astro`.

## Workflow

- `main` is protected; work on a branch and open a PR.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org) (`feat:`, `fix:`, `chore:` …) — enforced by commitlint.
- Pre-commit: lint-staged runs ESLint + Prettier on staged files.
- CI (`.github/workflows/ci.yml`): format → lint → typecheck → build → Lighthouse CI + Playwright.
- Cloudflare Pages builds a preview URL for every PR and deploys `main` to production.

## Cloudflare Pages settings

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `NODE_VERSION=24`
