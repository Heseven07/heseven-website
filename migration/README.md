# Shopify → Sanity blog migration

One-time move of the 64 heseven.com blog posts into Sanity, **word-for-word, on identical URLs**.
Completed 13 Oct 2026. Kept for reference / re-runs (all steps are idempotent).

## Result

| Check                                              | Result                                                                                           |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Posts migrated                                     | 64 / 64 (3 authors, 67 tags → categories, 166 images re-hosted in Sanity)                        |
| Content fidelity (`verify.mjs`)                    | 64 / 64 identical: full text, headings, links, bold, images + alt, title, slug, date, SEO fields |
| Same URL as Shopify, no redirect                   | 64 / 64 `/blogs/news/<handle>` → 200                                                             |
| `<title>` and meta description vs live heseven.com | 64 / 64 identical                                                                                |
| Old `/pages`, `/products`, `/collections` URLs     | 47 / 47 → 301 to a working page (`public/_redirects`)                                            |

## Pipeline

```bash
cd migration && npm install
npm run export                                  # Shopify Admin API (read_content) → data/shopify-articles.json
node import-sanity.mjs --dataset <name> --dry-run   # convert only → data/import-<name>.ndjson
node verify.mjs --dataset <name>                    # prove the conversion is faithful
node import-sanity.mjs --dataset <name>             # upload images + write documents
```

- **Access:** Dev Dashboard app "Heseven Website Migration" with only `read_content`, installed via the legacy
  install flow (client-credentials isn't allowed because the app's org differs from the store's).
  Token lives in `../.env.migration` (git-ignored). **Uninstall the app after go-live.**
- **Conversion:** Shopify HTML → Portable Text with `@portabletext/block-tools`. Pasted Word/Docs styling
  (spans, inline colours) is dropped so the site design applies; all words/structure are kept.
- **Google Docs fix:** 10 posts contained `<b id="docs-internal-guid-…">`, which made block-tools reorder
  paragraphs. It is converted to an equivalent `<strong>` first (it rendered bold on Shopify).
- **IDs:** `post-shopify-<id>`, `author-<handle>`, `category-<tag-handle>` → re-running replaces, never duplicates.
- **Render-time only (stored content untouched):** headings shifted so each post starts at h2 (accessibility),
  links to heseven.com made relative, Shopify's `<title>` format "<SEO title> – Heseven" kept for migrated posts.

`data/shopify-articles.json` is the raw export, kept as a permanent backup of the original Shopify content.
