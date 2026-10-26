// Writes full SEO content (service-content.mjs) for every service page in the header's Services mega
// menu (/services/<handle>, Studio → Service pages). Never touches landing pages (/pages/<handle>).
//   node seed-service-content.mjs --dataset migration-test|production [--dry-run] [--force]
// Ids: service-<handle>. Skips pages edited in Studio after the starter seed (or with an open draft)
// unless --force.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@sanity/client';
import { LINKED, PAGES } from './service-content.mjs';
import { EXTRAS } from './service-extras.mjs';

if (PAGES.some((p) => p.type !== 'servicePage')) throw new Error('Only service pages are seeded here');

const arg = (n) =>
  process.argv.indexOf(`--${n}`) > -1 ? process.argv[process.argv.indexOf(`--${n}`) + 1] : undefined;
const DATASET = arg('dataset');
const DRY = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');
if (!DATASET) throw new Error('Pass --dataset <name>');
// Last write of the starter seed (seed-landing-pages.mjs). A page changed after that is only overwritten
// if its current revision is one this script wrote (recorded in data/seeded-revs-<dataset>.json).
const SEEDED_UNTIL = '2026-10-21T10:23:00Z';
const REVS_FILE = `data/seeded-revs-${DATASET}.json`;
const ownRevs = new Set(fs.existsSync(REVS_FILE) ? JSON.parse(fs.readFileSync(REVS_FILE, 'utf8')) : []);

let k = 0;
const key = () => `k${(++k).toString(36)}`;
const CONTACT = '/pages/contact-us';
/** A related service: one of ours (/services/<slug>) or a migrated Shopify page (/pages/<slug>). */
const relatedCard = (slug) => {
  const p = PAGES.find((x) => x.slug === slug);
  if (p) return { title: p.title, body: p.hero.lead, href: `/services/${slug}` };
  const l = LINKED.find((x) => x.slug === slug);
  if (l) return { title: l.title, body: l.lead, href: `/pages/${slug}` };
  throw new Error(`related: unknown page ${slug}`);
};

/** "### Heading" lines → h3; other lines → paragraphs; [text](href) → link annotations. */
function portableText(src) {
  return src
    .trim()
    .split('\n')
    .filter((l) => l.trim())
    .map((line) => {
      const h3 = line.startsWith('### ');
      const text = h3 ? line.slice(4) : line;
      const children = [];
      const markDefs = [];
      let last = 0;
      for (const m of text.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
        if (m.index > last)
          children.push({ _type: 'span', _key: key(), text: text.slice(last, m.index), marks: [] });
        const mk = key();
        markDefs.push({ _type: 'link', _key: mk, href: m[2] });
        children.push({ _type: 'span', _key: key(), text: m[1], marks: [mk] });
        last = m.index + m[0].length;
      }
      if (last < text.length)
        children.push({ _type: 'span', _key: key(), text: text.slice(last), marks: [] });
      return { _type: 'block', _key: key(), style: h3 ? 'h3' : 'normal', markDefs, children };
    });
}

const STATS = [
  ['1000+', 'E-commerce brands served'],
  ['2018', 'Shopify Partner since'],
  ['4', 'Global time zones'],
  ['5.0', 'Average client rating'],
];

const ctaOf = (label, href) => ({ _type: 'cta', _key: key(), label, href });

// Page order: hero → proof → what's included → approach → process → fit → pitfalls → comparison
// → ways to work → reviews → FAQ → link hub → contact form.
function sections(p) {
  const x = EXTRAS[p.slug];
  if (!x) throw new Error(`service-extras.mjs: no extras for ${p.slug}`);
  return [
    {
      _type: 'sectionHero',
      _key: key(),
      ...p.hero,
      primaryCta: { _type: 'cta', label: 'Get a quote', href: '#quote' },
      secondaryCta: { _type: 'cta', label: 'See our work', href: '/#work' },
    },
    // Proof strip right under the hero (no heading).
    {
      _type: 'sectionStats',
      _key: key(),
      items: STATS.map(([value, label]) => ({ _type: 'stat', _key: key(), value, label })),
    },
    {
      _type: 'sectionFeatures',
      _key: key(),
      eyebrow: "What's included",
      heading: p.features.heading,
      columns: 3,
      items: p.features.items.map(([icon, title, body]) => ({
        _type: 'feature',
        _key: key(),
        icon,
        title,
        body,
      })),
    },
    {
      _type: 'sectionRichText',
      _key: key(),
      eyebrow: 'Our approach',
      heading: p.approach.heading,
      body: portableText(p.approach.body),
    },
    {
      _type: 'sectionSteps',
      _key: key(),
      eyebrow: 'How we work',
      heading: `How we deliver ${p.title}.`,
      steps: p.steps.map(([title, body]) => ({ _type: 'step', _key: key(), title, body })),
    },
    {
      _type: 'sectionFit',
      _key: key(),
      eyebrow: 'Is this right for you?',
      heading: 'An honest answer before you get in touch.',
      goodTitle: 'A good fit if',
      good: x.fit.good,
      notTitle: 'Probably not yet if',
      notYet: x.fit.notYet,
    },
    {
      _type: 'sectionPitfalls',
      _key: key(),
      eyebrow: 'Before you commit',
      heading: 'What usually goes wrong.',
      lead: 'Most problems are cheap to prevent and expensive to find later. This is what we watch for.',
      items: x.pitfalls.map(([title, body, fix]) => ({ _type: 'pitfall', _key: key(), title, body, fix })),
    },
    {
      _type: 'sectionCompare',
      _key: key(),
      eyebrow: 'Compare',
      heading: x.compare.heading,
      lead: x.compare.lead,
      leftLabel: x.compare.leftLabel,
      rightLabel: x.compare.rightLabel,
      rows: x.compare.rows.map(([label, left, right]) => ({
        _type: 'compareRow',
        _key: key(),
        label,
        left,
        right,
      })),
    },
    {
      _type: 'sectionPlans',
      _key: key(),
      eyebrow: 'Ways to work together',
      heading: 'Start small, or hand us the whole thing.',
      items: x.plans.map(([badge, title, body, points]) => ({
        _type: 'plan',
        _key: key(),
        badge,
        title,
        body,
        points,
      })),
      cta: { _type: 'cta', label: 'Book a free intro call', href: '#quote' },
    },
    { _type: 'sectionTestimonials', _key: key() },
    {
      _type: 'sectionFaq',
      _key: key(),
      eyebrow: 'FAQ',
      heading: `${p.title}: questions, answered.`,
      items: p.faq.map(([question, answer]) => ({ _type: 'faqItem', _key: key(), question, answer })),
    },
    {
      _type: 'sectionLinks',
      _key: key(),
      eyebrow: 'Keep reading',
      heading: `Everything around ${p.title}.`,
      groups: [
        {
          _type: 'linkGroup',
          _key: key(),
          title: 'Related services',
          links: p.related.map((slug) => {
            const r = relatedCard(slug);
            return ctaOf(r.title, r.href);
          }),
        },
        {
          _type: 'linkGroup',
          _key: key(),
          title: 'Read before you decide',
          links: x.guides.map(([label, handle]) => ctaOf(label, `/blogs/news/${handle}`)),
        },
        {
          _type: 'linkGroup',
          _key: key(),
          title: 'Next steps',
          links: [
            ctaOf('See our work', '/#work'),
            ctaOf('All services', '/services'),
            ctaOf('Contact us', CONTACT),
          ],
        },
      ],
    },
    {
      _type: 'sectionContact',
      _key: key(),
      eyebrow: "Let's talk",
      heading: `Tell us about your ${p.title.toLowerCase().startsWith('shopify') ? p.title.replace(/^Shopify /, '') : p.title} project.`,
      body: 'A few quick questions and we will come back within one business day — with an honest view on whether this is the right next step.',
      points: [
        'Reply within one business day',
        'A senior specialist, not a sales team',
        'No obligation, no hard sell',
      ],
    },
  ];
}

const docs = PAGES.map((p) => ({
  _id: `${p.type === 'servicePage' ? 'service' : 'page'}-${p.slug}`,
  _type: p.type,
  title: p.title,
  slug: { _type: 'slug', current: p.slug },
  sections: sections(p),
  seo: { _type: 'seo', ...p.seo },
}));

for (const d of docs) {
  const s = d.seo;
  if (s.title.length > 60 || s.description.length > 160)
    console.warn(`! ${d.slug.current}: title ${s.title.length}, description ${s.description.length} chars`);
}
fs.writeFileSync(`data/seed-service-content-${DATASET}.json`, JSON.stringify(docs, null, 2));
console.log(`${docs.length} pages: ${docs.map((d) => d.slug.current).join(', ')}`);
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
const ids = docs.flatMap((d) => [d._id, `drafts.${d._id}`]);
const existing = await client.fetch('*[_id in $ids]{_id, _rev, _updatedAt}', { ids });
const tx = client.transaction();
const skipped = [];
for (const d of docs) {
  const pub = existing.find((e) => e._id === d._id);
  const draft = existing.find((e) => e._id === `drafts.${d._id}`);
  if (!FORCE && (draft || (pub && pub._updatedAt > SEEDED_UNTIL && !ownRevs.has(pub._rev)))) {
    skipped.push(d.slug.current);
    continue;
  }
  tx.createOrReplace(d);
}
const res = await tx.commit({ visibility: 'sync' });
const written = await client.fetch('*[_id in $ids]._rev', { ids: res.documentIds });
fs.writeFileSync(REVS_FILE, JSON.stringify([...ownRevs, ...written], null, 2));
console.log(`written to "${DATASET}": ${docs.length - skipped.length} pages`);
if (skipped.length)
  console.log(`skipped (edited in Studio — rerun with --force to overwrite): ${skipped.join(', ')}`);
