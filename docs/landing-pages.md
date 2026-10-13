# Landing pages — Shopify `/pages/<handle>` inventory

The new site uses heseven.com's URL structure: every page lives at **`/pages/<handle>`**.
Pages are built in **Sanity Studio → Landing pages** with the page builder (Hero, Text, Feature grid,
Stats, Image + text, Process steps, FAQ, Call to action). Set the **URL slug = the Shopify handle**.

**Redirects are automatic.** `public/_redirects` keeps a fallback for every old handle. When a page with
that handle is published, the build drops its redirect (`scripts/prune-redirects.mjs`); unpublish it and
the redirect comes back. So migrating a page = create it in Sanity with the same slug → Publish.

> Note: on Shopify, 33 of these pages have an **empty body** — their content was built in the theme editor
> (sections), not the page editor. Migrating them means re-creating their sections in the page builder
> (copy from the live page), not an automatic import.

Status legend: ✅ live on new site · 🟡 starter content (migrate full content later) · ➡️ redirect · ⛔ don't rebuild

## Linked from the site (header/footer) — all live

| Handle                                 | Status       | Notes                                           |
| -------------------------------------- | ------------ | ----------------------------------------------- |
| `contact-us`                           | ✅ code page | Quote form (`src/pages/pages/contact-us.astro`) |
| `about`                                | 🟡 Sanity    | Starter: hero, stats, why-us, CTA               |
| `shopify-plus-development-agency`      | 🟡 Sanity    | Footer link                                     |
| `shopify-maintenance-service`          | 🟡 Sanity    | Footer link + "Store Maintenance" service       |
| `virtual-assistant-for-shopify`        | 🟡 Sanity    | Footer link                                     |
| `white-label-shopify-development`      | 🟡 Sanity    | Footer link                                     |
| `shopify-website-development-services` | 🟡 Sanity    | "Store Development" service                     |
| `ecommerce-platform-migration-service` | 🟡 Sanity    | "Platform Migration" service                    |
| `speed-optimization`                   | 🟡 Sanity    | "Speed Optimisation" service                    |
| `conversion-rate-optimisation`         | 🟡 Sanity    | New (no Shopify page)                           |
| `shopify-seo-services`                 | 🟡 Sanity    | New (no Shopify page)                           |
| `services`                             | ✅ code page | Services overview (new)                         |
| `thank-you`                            | ✅ code page | No-JS form confirmation, noindex                |

## SEO landing pages — recommended to migrate next

Have their own SEO title/description on Shopify; likely rank for service + industry searches.
Check **Google Search Console → Pages** (clicks, last 12 months) to prioritise.

| Handle                                              | Currently redirects to |
| --------------------------------------------------- | ---------------------- |
| `shopify-theme-development-services`                | Store Development      |
| `shopify-store-design-services`                     | Store Development      |
| `top-rated-shopify-store-design-services-uk`        | Store Development      |
| `b2b`                                               | Store Development      |
| `b2b-ecommerce-development-services`                | Store Development      |
| `b2b-theme-development-services`                    | Store Development      |
| `top-b2b-ecommerce-development-services-in-the-uk`  | Store Development      |
| `premium-b2b-ecommerce-theme-development-usa`       | Store Development      |
| `cosmetics-ecommerce-websites`                      | Store Development      |
| `health-and-wellness-ecommerce`                     | Store Development      |
| `clothing-ecommerce-website`                        | Store Development      |
| `furniture-ecommerce-website`                       | Store Development      |
| `ecommerce-fmcg-industry`                           | Store Development      |
| `ecommerce-store-for-timeless-collection`           | Store Development      |
| `move-to-shopify-plus-elevate-your-e-commerce-game` | Platform Migration     |
| `faqs`                                              | Home                   |
| `our-work`                                          | Home                   |

## Campaign / lead pages — check with marketing (ads may point here)

| Handle                                                      | Currently redirects to |
| ----------------------------------------------------------- | ---------------------- |
| `landing-page`, `ready-to-grow`, `new-lead`, `get-in-touch` | Contact                |
| `retainer`                                                  | Store Maintenance      |
| `speed`                                                     | Speed Optimisation     |

## Utility — keep redirected, don't rebuild ⛔

`usd`, `gbp` (currency switch), `partner-links`, `html-sitemap*` (5 pages; the new site has `/sitemap-index.xml`).

## Unpublished on Shopify — ignore ⛔

`citizenm`, `blacksand-distribution`, `lead`, `data-sharing-opt-out`.

---

Starter pages were created by `migration/seed-landing-pages.mjs` (idempotent; never overwrites a page that
already exists unless `--force`). Raw Shopify page data: `migration/data/shopify-pages.json`.
