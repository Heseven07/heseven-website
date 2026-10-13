// Step 2 — Import data/shopify-articles.json into Sanity, word-for-word.
//
//   node import-sanity.mjs --dataset migration-test   # rehearsal
//   node import-sanity.mjs --dataset production       # real import
//   add --dry-run to only write data/import-<dataset>.ndjson
//
// Idempotent: posts/authors/categories use deterministic IDs and images are cached in
// data/asset-map.json, so re-running replaces documents instead of duplicating them.
// Auth: the Sanity CLI login on this machine (~/.config/sanity/config.json).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@sanity/client';
import { Schema } from '@sanity/schema';
import { htmlToBlocks } from '@portabletext/block-tools';
import { JSDOM } from 'jsdom';

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const DATASET = arg('dataset');
const DRY = process.argv.includes('--dry-run');
if (!DATASET) throw new Error('Pass --dataset <name>');

const token = JSON.parse(
  fs.readFileSync(path.join(os.homedir(), '.config/sanity/config.json'), 'utf8'),
).authToken;
const client = createClient({
  projectId: 'flt9h8js',
  dataset: DATASET,
  apiVersion: '2026-10-01',
  token,
  useCdn: false,
});

const { articles } = JSON.parse(fs.readFileSync('data/shopify-articles.json', 'utf8'));

// ---- Helpers --------------------------------------------------------------
/** Shopify's handleize(): how /blogs/news/tagged/<handle> URLs are built. */
const handleize = (s) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
const numericId = (gid) => gid.split('/').pop();
const plain = (html) =>
  new JSDOM(`<body>${html ?? ''}</body>`).window.document.body.textContent.replace(/\s+/g, ' ').trim();
const absolute = (src) => (src.startsWith('//') ? `https:${src}` : src);
/** Shopify CDN URLs carry size/version params; the original file is the URL without them. */
const originalUrl = (src) => {
  const u = new URL(absolute(src));
  for (const k of ['width', 'height', 'crop', 'v']) u.searchParams.delete(k);
  return u.toString();
};

// ---- Images (uploaded once, cached) ---------------------------------------
const MAP_FILE = `data/asset-map.${DATASET}.json`;
const assetMap = fs.existsSync(MAP_FILE) ? JSON.parse(fs.readFileSync(MAP_FILE, 'utf8')) : {};
async function uploadImage(src) {
  const url = originalUrl(src);
  if (assetMap[url]) return assetMap[url];
  if (DRY) return (assetMap[url] = `image-DRYRUN-${Object.keys(assetMap).length}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`image ${res.status}: ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const filename = decodeURIComponent(new URL(url).pathname.split('/').pop());
  const asset = await client.assets.upload('image', buffer, {
    filename,
    source: { id: url, name: 'shopify', url },
  });
  assetMap[url] = asset._id;
  fs.writeFileSync(MAP_FILE, JSON.stringify(assetMap, null, 2));
  return asset._id;
}

// ---- Portable Text schema (mirror of studio/schemaTypes/blockContent.ts) ---
const blockContentType = Schema.compile({
  name: 'default',
  types: [
    {
      name: 'blockContent',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: ['normal', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'].map((value) => ({
            title: value,
            value,
          })),
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: ['strong', 'em', 'code'].map((value) => ({ title: value, value })),
            annotations: [{ name: 'link', type: 'object', fields: [{ name: 'href', type: 'url' }] }],
          },
        },
        // Declared as a plain object named "image" (only the _type name matters for conversion;
        // the real image type with hotspot/crop lives in the Studio schema).
        {
          type: 'object',
          name: 'image',
          fields: [
            { name: 'asset', type: 'string' },
            { name: 'alt', type: 'string' },
          ],
        },
      ],
    },
  ],
}).get('blockContent');

async function htmlToPortableText(html) {
  const doc = new JSDOM(`<body>${html}</body>`).window.document;
  // Google Docs paste artefact: <b id="docs-internal-guid-…"> wrapping whole paragraphs. It triggers
  // block-tools' Google Docs mode, which reorders/drops paragraphs. Shopify rendered it bold (no
  // font-weight:normal style), so replace it with an equivalent <strong>; unwrap if it was non-bold.
  for (const b of doc.querySelectorAll('b[id^="docs-internal-guid"]')) {
    const nonBold = /font-weight:\s*(normal|400)/i.test(b.getAttribute('style') ?? '');
    const repl = nonBold ? doc.createDocumentFragment() : doc.createElement('strong');
    while (b.firstChild) repl.appendChild(b.firstChild);
    b.replaceWith(repl);
  }
  // Upload inline images first, then let the deserializer turn <img> into image blocks.
  const imgAssets = new Map();
  for (const img of doc.querySelectorAll('img')) {
    const src = img.getAttribute('src');
    if (src && !imgAssets.has(src)) imgAssets.set(src, await uploadImage(src));
  }
  return htmlToBlocks(doc.body.innerHTML, blockContentType, {
    parseHtml: (h) => new JSDOM(h).window.document,
    rules: [
      {
        deserialize(el, _next, block) {
          if (el.nodeName?.toLowerCase() !== 'img') return undefined;
          const ref = imgAssets.get(el.getAttribute('src'));
          if (!ref) return undefined;
          const alt = el.getAttribute('alt') ?? '';
          return block({ _type: 'image', asset: { _type: 'reference', _ref: ref }, ...(alt ? { alt } : {}) });
        },
      },
    ],
  });
}

// ---- Build documents -------------------------------------------------------
const docs = [];
const authors = new Map();
const categories = new Map();

for (const a of articles) {
  const name = a.author?.name ?? 'Heseven';
  if (!authors.has(name))
    authors.set(name, {
      _id: `author-${handleize(name)}`,
      _type: 'author',
      name,
      slug: { _type: 'slug', current: handleize(name) },
    });
  for (const t of a.tags)
    if (!categories.has(handleize(t)))
      categories.set(handleize(t), {
        _id: `category-${handleize(t)}`,
        _type: 'category',
        title: t,
        slug: { _type: 'slug', current: handleize(t) },
      });
}
docs.push(...authors.values(), ...categories.values());

let i = 0;
for (const a of articles) {
  i++;
  process.stdout.write(`\r[${i}/${articles.length}] ${a.handle.slice(0, 60).padEnd(60)}`);
  const mainImage = a.image
    ? {
        _type: 'image',
        asset: { _type: 'reference', _ref: await uploadImage(a.image.url) },
        ...(a.image.altText ? { alt: a.image.altText } : {}),
      }
    : undefined;
  const summary = plain(a.summary);
  docs.push({
    _id: `post-shopify-${numericId(a.id)}`,
    _type: 'post',
    title: a.title,
    slug: { _type: 'slug', current: a.handle },
    excerpt: summary || a.seoDescription?.value || '',
    publishedAt: a.publishedAt,
    updatedAt: a.updatedAt,
    author: { _type: 'reference', _ref: authors.get(a.author?.name ?? 'Heseven')._id },
    categories: [...new Set(a.tags.map(handleize))].map((h) => ({
      _type: 'reference',
      _ref: `category-${h}`,
      _key: h.slice(0, 40),
    })),
    ...(mainImage ? { mainImage } : {}),
    body: await htmlToPortableText(a.body ?? ''),
    seo: {
      _type: 'seo',
      ...(a.seoTitle?.value ? { title: a.seoTitle.value } : {}),
      ...(a.seoDescription?.value ? { description: a.seoDescription.value } : {}),
    },
    legacy: { shopifyId: a.id, url: `https://www.heseven.com/blogs/news/${a.handle}`, tags: a.tags },
  });
}
console.log(
  `\nbuilt ${docs.length} documents: ${articles.length} posts, ${authors.size} authors, ${categories.size} categories`,
);

fs.writeFileSync(`data/import-${DATASET}.ndjson`, docs.map((d) => JSON.stringify(d)).join('\n'));
if (DRY) {
  console.log(`dry run: wrote data/import-${DATASET}.ndjson, nothing sent to Sanity`);
} else {
  for (let k = 0; k < docs.length; k += 50) {
    const tx = client.transaction();
    docs.slice(k, k + 50).forEach((d) => tx.createOrReplace(d));
    await tx.commit({ visibility: 'async' });
  }
  console.log(`imported into dataset "${DATASET}"`);
}
