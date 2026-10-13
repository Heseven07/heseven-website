// Step 3 — Prove the import is faithful: compare every Shopify article with its Portable Text
// conversion (text word-for-word, headings, links, bold text, images + alt).
//   node verify.mjs --dataset migration-test        (reads data/import-<dataset>.ndjson)
import fs from 'node:fs';
import { JSDOM } from 'jsdom';

const i = process.argv.indexOf('--dataset');
const DATASET = i > -1 ? process.argv[i + 1] : 'migration-test';
const { articles } = JSON.parse(fs.readFileSync('data/shopify-articles.json', 'utf8'));
const docs = fs
  .readFileSync(`data/import-${DATASET}.ndjson`, 'utf8')
  .split('\n')
  .filter(Boolean)
  .map((l) => JSON.parse(l));
const posts = new Map(docs.filter((d) => d._type === 'post').map((d) => [d.legacy.shopifyId, d]));

const norm = (s) => s.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
const multiset = (arr) => arr.map(norm).filter(Boolean).sort();
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function fromHtml(html) {
  const doc = new JSDOM(`<body>${html ?? ''}</body>`).window.document;
  doc.querySelectorAll('br').forEach((br) => br.replaceWith(' '));
  return {
    text: norm(doc.body.textContent),
    headings: multiset(
      [...doc.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(
        (h) => `${h.tagName.toLowerCase()}:${norm(h.textContent)}`,
      ),
    ),
    links: multiset(
      [...doc.querySelectorAll('a[href]')]
        .filter((a) => norm(a.textContent))
        .map((a) => a.getAttribute('href')),
    ),
    images: multiset([...doc.querySelectorAll('img')].map((img) => `alt:${img.getAttribute('alt') ?? ''}`)),
    bold: norm([...doc.querySelectorAll('strong,b')].map((b) => b.textContent).join(' ')),
  };
}

function fromPortableText(blocks) {
  const text = [];
  const headings = [];
  const links = [];
  const images = [];
  const bold = [];
  for (const b of blocks) {
    if (b._type === 'image') {
      images.push(`alt:${b.alt ?? ''}`);
      continue;
    }
    const t = (b.children ?? []).map((c) => c.text ?? '').join('');
    text.push(t);
    if (/^h\d$/.test(b.style)) headings.push(`${b.style}:${norm(t)}`);
    const defs = new Map((b.markDefs ?? []).map((m) => [m._key, m]));
    const seen = new Set();
    for (const c of b.children ?? []) {
      if ((c.marks ?? []).includes('strong')) bold.push(c.text);
      for (const m of c.marks ?? []) {
        if (!defs.has(m) || seen.has(m)) continue;
        seen.add(m);
        links.push(defs.get(m).href);
      }
    }
  }
  return {
    text: norm(text.join(' ')),
    headings: multiset(headings),
    links: multiset(links),
    images: multiset(images),
    bold: norm(bold.join(' ')),
  };
}

let pass = 0;
const failures = [];
for (const a of articles) {
  const p = posts.get(a.id);
  const problems = [];
  if (!p) problems.push('missing post');
  else {
    const src = fromHtml(a.body);
    const out = fromPortableText(p.body);
    // Text: compare ignoring whitespace only (block boundaries become spaces).
    if (src.text.replace(/\s/g, '') !== out.text.replace(/\s/g, '')) problems.push('TEXT differs');
    if (!same(src.headings, out.headings)) problems.push('headings differ');
    if (!same(src.links, out.links))
      problems.push(`links differ (${src.links.length} vs ${out.links.length})`);
    if (!same(src.images, out.images))
      problems.push(`images differ (${src.images.length} vs ${out.images.length})`);
    if (src.bold.replace(/\s/g, '') !== out.bold.replace(/\s/g, '')) problems.push('bold text differs');
    if (p.title !== a.title) problems.push('title differs');
    if (p.slug.current !== a.handle) problems.push('slug differs');
    if (p.publishedAt !== a.publishedAt) problems.push('date differs');
    if ((a.seoTitle?.value ?? undefined) !== p.seo?.title) problems.push('seo title differs');
    if ((a.seoDescription?.value ?? undefined) !== p.seo?.description)
      problems.push('seo description differs');
  }
  if (problems.length) failures.push(`${a.handle}: ${problems.join(', ')}`);
  else pass++;
}
console.log(
  `${pass}/${articles.length} posts identical (text, headings, links, bold, images+alt, title, slug, date, SEO)`,
);
if (failures.length) {
  console.log('Differences:\n  ' + failures.join('\n  '));
  process.exitCode = 1;
}
