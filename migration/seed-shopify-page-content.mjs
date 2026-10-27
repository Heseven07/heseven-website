// Writes the full heseven.com page content (shopify-page-content.mjs) into the matching landing pages
// (/pages/<handle>, ids page-<handle>). Only `sections` is replaced; title, SEO and the legacy block
// stay as they are.
//   node seed-shopify-page-content.mjs --dataset migration-test|production [--dry-run]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@sanity/client';
import { CONTACT, SHOPIFY_PAGES } from './shopify-page-content.mjs';

const arg = (n) =>
  process.argv.indexOf(`--${n}`) > -1 ? process.argv[process.argv.indexOf(`--${n}`) + 1] : undefined;
const DATASET = arg('dataset');
const DRY = process.argv.includes('--dry-run');
if (!DATASET) throw new Error('Pass --dataset <name>');

let k = 0;
const key = () => `s${(++k).toString(36)}`;
const cta = (label, href = CONTACT) => ({ _type: 'cta', label, href });
const block = (text) => ({
  _type: 'block',
  _key: key(),
  style: 'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: key(), text, marks: [] }],
});

const BUILD = {
  hero: (x) => ({ _type: 'sectionHero', heading: x.heading, lead: x.lead, primaryCta: cta(x.cta) }),
  text: (x) => ({ _type: 'sectionRichText', heading: x.heading, body: x.paras.map(block) }),
  features: (x) => ({
    _type: 'sectionFeatures',
    eyebrow: x.eyebrow,
    heading: x.heading,
    lead: x.lead,
    columns: x.columns ?? 3,
    items: x.items.map(([icon, title, body, href]) => ({
      _type: 'feature',
      _key: key(),
      icon,
      title,
      body,
      href,
    })),
  }),
  steps: (x) => ({
    _type: 'sectionSteps',
    heading: x.heading,
    lead: x.lead,
    steps: x.steps.map(([title, body]) => ({ _type: 'step', _key: key(), title, body })),
  }),
  plans: (x) => ({
    _type: 'sectionPlans',
    heading: x.heading,
    items: x.items.map(([title, body, points]) => ({ _type: 'plan', _key: key(), title, body, points })),
    cta: x.cta ? cta(x.cta) : undefined,
  }),
  cta: (x) => ({ _type: 'sectionCta', heading: x.heading, body: x.body, cta: cta(x.label) }),
  contact: (x) => ({ _type: 'sectionContact', heading: x.heading, body: x.body }),
  faq: (x) => ({
    _type: 'sectionFaq',
    eyebrow: x.eyebrow,
    heading: x.heading,
    items: x.items.map(([question, answer]) => ({ _type: 'faqItem', _key: key(), question, answer })),
  }),
};

// Drop undefined fields so Sanity stores clean objects.
const clean = (o) => JSON.parse(JSON.stringify(o));
const pages = Object.entries(SHOPIFY_PAGES).map(([handle, list]) => ({
  id: `page-${handle}`,
  handle,
  sections: list.map(([kind, x]) => clean({ _key: key(), ...BUILD[kind](x) })),
}));
for (const p of pages)
  console.log(`${p.handle}: ${p.sections.map((s) => s._type.replace('section', '')).join(' > ')}`);
if (DRY) process.exit(0);

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
const existing = await client.fetch('*[_id in $ids]._id', { ids: pages.map((p) => p.id) });
const tx = client.transaction();
for (const p of pages) {
  if (!existing.includes(p.id)) throw new Error(`${p.id} not found in "${DATASET}"`);
  tx.patch(p.id, (patch) => patch.set({ sections: p.sections }));
}
await tx.commit({ visibility: 'sync' });
console.log(`updated sections on ${pages.length} pages in "${DATASET}"`);
