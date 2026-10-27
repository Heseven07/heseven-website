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

## Blog / CMS (Sanity)

- **Edit content:** https://heseven.sanity.studio (log in with the Heseven Google account; invite teammates in Sanity → Members).
- **Project:** `flt9h8js`, dataset `production` (public read, so builds need no secrets). Org: Heseven.
- **Content types:** Blog post (title, slug, excerpt, main image + alt, rich body with images, date, author,
  categories, "featured", SEO overrides incl. noindex), Author, Category. Schemas: `studio/schemaTypes/`.
- **How the site uses it:** `src/lib/sanity.ts` fetches published posts **at build time**; pages are static.
  Images are downloaded and re-encoded to AVIF/WebP by Astro, so visitors never hit Sanity's CDN.
- **Pages (identical to Shopify's URLs):** `/blogs/news`, `/blogs/news/<slug>`, `/blogs/news/tagged/<tag>`,
  `/blogs/news.atom` and `/rss.xml`. The whole site uses Shopify's no-trailing-slash style.
- **After publishing in Sanity** the site needs a rebuild + deploy (`npm run deploy`) until auto-deploy is set up.
- **64 posts migrated from Shopify**, word-for-word on the same URLs — see `migration/README.md`.

Studio is a separate app with its own `package.json`:

```bash
cd studio && npm install
npm run dev      # local Studio at http://localhost:3333
npm run deploy   # publish Studio to heseven.sanity.studio
```

## Pages (Shopify URL structure)

Every page lives at **`/pages/<handle>`**, matching heseven.com's Shopify URLs (contact is `/pages/contact-us`,
about is `/pages/about`). Landing/service pages are built in **Sanity → Landing pages** with the page builder
(`studio/schemaTypes/sections/`, rendered by `src/components/page-builder/`). Code pages in `src/pages/pages/`
(`contact-us`, `services`, `thank-you`) take precedence over Sanity pages with the same slug.

`public/_redirects` keeps fallbacks for old Shopify handles; `scripts/prune-redirects.mjs` drops any fallback whose
page exists in the build, so publishing a page with the old handle replaces its redirect automatically.
Inventory and migration checklist: `docs/landing-pages.md`.

## Contact form

`/contact/` is a 4-step quote form (`src/components/contact/QuoteForm.astro`, logic in `src/scripts/quote-form.ts`).
It posts to `/api/contact`, handled by the only server code in the project: `worker/index.ts`
(runs for `/api/*` only — every page stays static).

- **Spam protection:** honeypot field, minimum fill time, same-origin check, and Cloudflare Turnstile.
  Turnstile's script loads only when the visitor reaches the last step, so it never affects Lighthouse.
- **Delivery:** [Resend](https://resend.com) emails each brief to `CONTACT_TO` (set in `wrangler.jsonc`) with reply-to set to the visitor.
- **Until keys are set**, the API answers 503 and the form shows a pre-filled `mailto:` link instead — no enquiry is lost.
- **Analytics:** on success it fires GA4 `generate_lead` and Meta `Lead` (only if the visitor accepted cookies).

To switch on email delivery:

```bash
npx wrangler secret put RESEND_API_KEY        # from resend.com → API Keys
npx wrangler secret put TURNSTILE_SECRET_KEY  # from Cloudflare → Turnstile (optional but recommended)
```

Put the Turnstile **site** key in `.env` as `PUBLIC_TURNSTILE_SITE_KEY`, then `npm run deploy`.
To send from `@heseven.com`, verify the domain in Resend and update `CONTACT_FROM` in `wrangler.jsonc`.

Test the Worker locally: `npm run build && npx wrangler dev`.

## Workflow

- `main` is protected; work on a branch and open a PR.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org) (`feat:`, `fix:`, `chore:` …) — enforced by commitlint.
- Pre-commit: lint-staged runs ESLint + Prettier on staged files.
- CI (`.github/workflows/ci.yml`): format → lint → typecheck → build → Lighthouse CI + Playwright.
- Cloudflare Pages builds a preview URL for every PR and deploys `main` to production.

## Deploying (Cloudflare)

Hosted as **static assets on Cloudflare Workers** (the current version of Cloudflare Pages). No Worker script runs: every page is prebuilt HTML, and `public/_headers` / `public/_redirects` are applied by Cloudflare. Config: `wrangler.jsonc`.

### Automatic (normal way)

`.github/workflows/deploy.yml` builds and deploys automatically when:

| Trigger               | When                                                             |
| --------------------- | ---------------------------------------------------------------- |
| Merge to `main`       | after a PR passes CI                                             |
| **Publish in Sanity** | Sanity webhook → GitHub `repository_dispatch` (`sanity-publish`) |
| Manual                | GitHub → Actions → **Deploy** → **Run workflow**                 |

Rapid publishes collapse into one deploy of the latest content. A deploy takes ~2–3 minutes.

**One-time setup**

1. GitHub → Settings → Secrets and variables → Actions:
   - Secret `CLOUDFLARE_API_TOKEN`: Cloudflare → My Profile → API Tokens → _Edit Cloudflare Workers_ template.
   - Variable `CLOUDFLARE_ACCOUNT_ID` = `320e00995db5f5843ef9f80704f6eaab`.
     Until both exist the workflow skips deploying with a warning.
2. Sanity webhook (sanity.io/manage → project `flt9h8js` → API → Webhooks):
   - URL `https://api.github.com/repos/Heseven07/heseven-website/dispatches`, method POST, dataset `production`
   - Filter `_type in ["post", "author", "category", "caseStudy", "landingPage", "servicePage"]`,
     triggers create/update/delete, drafts excluded
   - Projection `{"event_type": "sanity-publish", "client_payload": {"id": _id, "type": _type}}`
   - Headers `Authorization: Bearer <GitHub fine-grained token>` (repo `heseven-website` only,
     **Contents: read & write**) and `Accept: application/vnd.github+json`
   - ⏰ The GitHub token expires (max 1 year): renew it and update the webhook header before then.

### Publishing a blog post

Write in https://heseven.sanity.studio → **Publish** → watch GitHub → Actions → _Deploy_ → live in ~3 minutes.

### Adding a case study

No code needed — see [docs/adding-a-case-study.md](docs/adding-a-case-study.md) (written for non-technical editors).
Studio → **Case studies** → create → fill the Story tab, add a desktop and a mobile screenshot → **Publish**.
It appears at `/pages/case-studies/<slug>` and on `/pages/case-studies` after the next deploy. Turn off
"Has its own page" to list a store under "More recent work" only. The starter content was seeded from
`Heseven Casestudies.pdf` by `migration/seed-case-studies.mjs`.

### Manual fallback

```bash
npx wrangler login   # once per machine
npm run deploy       # build + upload
```

Live (test) URL: https://heseven-website.heseven-website.workers.dev

> Do not add `@astrojs/cloudflare` unless a page genuinely needs server rendering — it puts a Worker in front of every request.
