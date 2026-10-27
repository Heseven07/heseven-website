// Seeds case studies (case-studies.mjs) into Sanity, uploading their screenshots (full case studies:
// data/case-studies/<slug>.jpg + -mobile.jpg; recent-work links: data/case-studies/recent/<slug>.jpg).
//   node seed-case-studies.mjs --dataset migration-test|production [--dry-run] [--force]
// Ids: casestudy-<slug>. Never overwrites a case study edited in Studio (or with an open draft) unless
// --force; revisions this script wrote are remembered in data/seeded-revs-<dataset>.json.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@sanity/client';
import { CASE_STUDIES, RECENT_WORK } from './case-studies.mjs';

const arg = (n) =>
  process.argv.indexOf(`--${n}`) > -1 ? process.argv[process.argv.indexOf(`--${n}`) + 1] : undefined;
const DATASET = arg('dataset');
const DRY = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');
if (!DATASET) throw new Error('Pass --dataset <name>');
const IMAGES = 'data/case-studies';
const REVS_FILE = `data/seeded-revs-${DATASET}.json`;
const ownRevs = new Set(fs.existsSync(REVS_FILE) ? JSON.parse(fs.readFileSync(REVS_FILE, 'utf8')) : []);

let k = 0;
const key = () => `c${(++k).toString(36)}`;
const slugOf = (name) =>
  name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const full = CASE_STUDIES.map((c, i) => ({
  _id: `casestudy-${c.slug}`,
  _type: 'caseStudy',
  client: c.client,
  slug: { _type: 'slug', current: c.slug },
  ...(c.website ? { website: c.website } : {}),
  headline: c.headline,
  summary: c.summary,
  industry: c.industry,
  platform: c.platform,
  services: c.services,
  challenge: c.challenge,
  solution: c.solution.map(([title, body]) => ({ _type: 'solutionPoint', _key: key(), title, body })),
  highlights: c.highlights,
  result: c.result,
  fullStory: true,
  featured: Boolean(c.featured),
  order: (i + 1) * 10,
  accent: c.accent,
}));
const recent = RECENT_WORK.map(([client, website], i) => ({
  _id: `casestudy-${slugOf(client)}`,
  _type: 'caseStudy',
  client,
  slug: { _type: 'slug', current: slugOf(client) },
  website,
  fullStory: false,
  order: 1000 + i,
}));
const docs = [...full, ...recent];
console.log(`${full.length} case studies, ${recent.length} recent-work links`);
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

const existing = await client.fetch('*[_id in $ids]{_id, _rev, cover, mobile}', {
  ids: docs.flatMap((d) => [d._id, `drafts.${d._id}`]),
});
const upload = async (file, alt) => {
  if (!fs.existsSync(file)) return undefined;
  const asset = await client.assets.upload('image', fs.createReadStream(file), {
    filename: path.basename(file),
  });
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, alt };
};

const tx = client.transaction();
const skipped = [];
for (const d of docs) {
  const pub = existing.find((e) => e._id === d._id);
  const draft = existing.find((e) => e._id === `drafts.${d._id}`);
  if (!FORCE && (draft || (pub && !ownRevs.has(pub._rev)))) {
    skipped.push(d.slug.current);
    continue;
  }
  if (d.fullStory) {
    // Re-use images already uploaded on an earlier run; upload otherwise.
    d.cover = pub?.cover ?? (await upload(`${IMAGES}/${d.slug.current}.jpg`, `${d.client} store on desktop`));
    d.mobile =
      pub?.mobile ?? (await upload(`${IMAGES}/${d.slug.current}-mobile.jpg`, `${d.client} store on mobile`));
    if (!d.cover) delete d.cover;
    if (!d.mobile) delete d.mobile;
  } else {
    // "More recent work" cards show a desktop screenshot too (data/case-studies/recent/<slug>.jpg).
    d.cover =
      pub?.cover ?? (await upload(`${IMAGES}/recent/${d.slug.current}.jpg`, `${d.client} store homepage`));
    if (!d.cover) delete d.cover;
  }
  tx.createOrReplace(d);
}
const res = await tx.commit({ visibility: 'sync' });
const written = await client.fetch('*[_id in $ids]._rev', { ids: res.documentIds });
fs.writeFileSync(REVS_FILE, JSON.stringify([...ownRevs, ...written], null, 2) + '\n');
console.log(`written to "${DATASET}": ${res.documentIds.length} documents`);
if (skipped.length) console.log(`skipped (edited in Studio — rerun with --force): ${skipped.join(', ')}`);
