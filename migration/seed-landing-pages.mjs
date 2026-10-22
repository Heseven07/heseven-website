// Seeds starter landing pages (/pages/<handle>) and service pages (/services/<handle>) in Sanity
// for every page the site links to.
// Content: Shopify's own title + SEO description where the page exists on Shopify, otherwise the
// site's service copy; plus the site's process steps and a CTA. Full content migration comes later.
//   node seed-landing-pages.mjs --dataset migration-test|production [--dry-run]
// Idempotent (ids page-<handle>). Won't overwrite a page that editors have changed since seeding
// unless --force.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createClient } from '@sanity/client';

const arg = (n) =>
  process.argv.indexOf(`--${n}`) > -1 ? process.argv[process.argv.indexOf(`--${n}`) + 1] : undefined;
const DATASET = arg('dataset');
const DRY = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');
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

const shopify = Object.fromEntries(
  JSON.parse(fs.readFileSync('data/shopify-pages.json', 'utf8')).data.pages.nodes.map((p) => [p.handle, p]),
);
let k = 0;
const key = () => `k${(++k).toString(36)}`;

const process5 = [
  ['Kickoff', 'Goals, audience, KPIs and a clear scope — agreed in one focused session.'],
  ['Discovery & wireframes', 'User journeys and low-fidelity layouts to validate structure early.'],
  ['Design', 'High-fidelity, on-brand designs for every key template and breakpoint.'],
  ['Development', 'Clean, fast Shopify code with QA on real devices at every step.'],
  ['Launch & support', 'A smooth go-live, then ongoing optimisation and support.'],
];
const steps = () => ({
  _type: 'sectionSteps',
  _key: key(),
  eyebrow: 'How we work',
  heading: 'From kickoff to launch in 4–8 weeks.',
  steps: process5.map(([title, body]) => ({ _key: key(), title, body })),
});
const cta = () => ({
  _type: 'sectionCta',
  _key: key(),
  eyebrow: "Let's work together",
  heading: 'Ready to transform your Shopify store?',
  body: 'Tell us where you are and where you want to be. We reply within one business day.',
  cta: { _type: 'cta', label: 'Get in touch', href: '/pages/contact-us' },
});
const hero = (heading, lead, eyebrow = 'Service') => ({
  _type: 'sectionHero',
  _key: key(),
  eyebrow,
  heading,
  lead,
  primaryCta: { _type: 'cta', label: 'Get a quote', href: '/pages/contact-us' },
  secondaryCta: { _type: 'cta', label: 'See our work', href: '/#work' },
});

// handle → fallback copy (used when Shopify has no page / no SEO description)
const SERVICE_PAGES = {
  'shopify-website-development-services': [
    'Store Development',
    'Custom Shopify and Shopify Plus themes built for speed, conversion and easy editing.',
  ],
  'ecommerce-platform-migration-service': [
    'Platform Migration',
    'Move from WooCommerce, Magento or BigCommerce with zero data loss and SEO intact.',
  ],
  'conversion-rate-optimisation': [
    'Conversion Rate Optimisation',
    'Research-led UX changes and A/B tests that turn more visitors into customers.',
  ],
  'speed-optimization': [
    'Speed Optimisation',
    'Core Web Vitals fixes, app audits and image pipelines for a faster storefront.',
  ],
  'shopify-seo-services': [
    'Shopify SEO Services',
    'Technical SEO, structured data and content that compounds organic revenue.',
  ],
  'shopify-maintenance-service': [
    'Shopify Maintenance Service',
    'A dedicated team on retainer for updates, fixes and continuous improvements.',
  ],
  'shopify-plus-development-agency': [
    'Shopify Plus Development Agency',
    'Scalable Shopify Plus builds for high-growth brands.',
  ],
  'virtual-assistant-for-shopify': [
    'Virtual Assistant for Shopify',
    'Day-to-day store management so you can focus on growth.',
  ],
  'white-label-shopify-development': [
    'White-label Shopify Development',
    'Your agency’s Shopify development team — under your brand.',
  ],
};

const docs = [];
const legacyOf = (h) =>
  shopify[h]
    ? {
        legacy: {
          shopifyId: shopify[h].id ?? `shopify-page-${h}`,
          url: `https://www.heseven.com/pages/${h}`,
          template: shopify[h].templateSuffix || undefined,
        },
      }
    : {};

for (const [handle, [fallbackTitle, fallbackLead]] of Object.entries(SERVICE_PAGES)) {
  const s = shopify[handle];
  const title = s?.title ?? fallbackTitle;
  const lead = s?.seoDesc?.value?.trim() || fallbackLead;
  docs.push({
    _id: `page-${handle}`,
    _type: 'landingPage',
    title,
    slug: { _type: 'slug', current: handle },
    sections: [hero(title, lead), steps(), cta()],
    seo: { _type: 'seo', ...(s?.seoTitle?.value ? { title: s.seoTitle.value } : {}), description: lead },
    ...legacyOf(handle),
  });
}

// About
docs.push({
  _id: 'page-about',
  _type: 'landingPage',
  title: 'About',
  slug: { _type: 'slug', current: 'about' },
  sections: [
    hero(
      'A Shopify agency that treats your store like a product, not a project.',
      'Since 2018 we have helped founders and growing brands launch, migrate and scale on Shopify. Strategy, design, development and support live under one roof — so nothing gets lost in hand-offs.',
      'About Heseven',
    ),
    {
      _type: 'sectionStats',
      _key: key(),
      items: [
        ['1000+', 'E-commerce brands served'],
        ['2018', 'Shopify Partner since'],
        ['4', 'Global time zones'],
        ['5.0', 'Average client rating'],
      ].map(([value, label]) => ({ _key: key(), value, label })),
    },
    {
      _type: 'sectionFeatures',
      _key: key(),
      eyebrow: 'Why Heseven',
      heading: 'Senior people, small-team focus, global reach.',
      columns: 3,
      items: [
        ['globe', 'Global expertise', 'Brands across the UK, US, Europe, Australia and India.'],
        [
          'sliders',
          'Tailored solutions',
          'No templates-in-disguise. Built around your products and customers.',
        ],
        ['sparkles', 'Creative team', 'Designers and developers who sweat the details together.'],
        ['layers', 'End-to-end service', 'Strategy, design, build, SEO and support under one roof.'],
        ['heart', '100% satisfaction', 'We are not done until you are proud to share your store.'],
      ].map(([icon, title, body]) => ({ _key: key(), icon, title, body })),
    },
    cta(),
  ],
  seo: {
    _type: 'seo',
    title: shopify.about?.seoTitle?.value,
    description:
      'Heseven is a Shopify Plus Partner agency in London designing, building and growing e-commerce brands since 2018.',
  },
  ...legacyOf('about'),
});

// Service pages (/services/<handle>) — Studio → Service pages
docs.push({
  _id: 'service-shopify-web-design',
  _type: 'servicePage',
  title: 'Shopify Web Design',
  slug: { _type: 'slug', current: 'shopify-web-design' },
  sections: [
    hero(
      'Shopify web design that sells.',
      'Conversion-focused, on-brand Shopify and Shopify Plus stores — designed around your products and customers, built to be fast and easy to edit.',
      'Shopify web design',
    ),
    {
      _type: 'sectionFeatures',
      _key: key(),
      eyebrow: 'What you get',
      heading: 'Design that looks premium and performs.',
      items: [
        [
          'sparkles',
          'Custom, on-brand design',
          'Every key template designed for your brand — no themes in disguise.',
        ],
        ['layers', 'Conversion-led UX', 'Product, collection and cart journeys shaped by research and data.'],
        [
          'heart',
          'Easy to edit',
          'Built on Shopify sections so your team can update pages without a developer.',
        ],
      ].map(([icon, title, body]) => ({ _key: key(), icon, title, body })),
    },
    steps(),
    cta(),
  ],
  seo: {
    _type: 'seo',
    title: 'Shopify Web Design Agency',
    description:
      'Custom Shopify and Shopify Plus web design from a certified Shopify Plus Partner. On-brand, conversion-focused and fast.',
  },
});

fs.writeFileSync(`data/seed-pages-${DATASET}.json`, JSON.stringify(docs, null, 2));
console.log(`${docs.length} pages: ${docs.map((d) => d.slug.current).join(', ')}`);
if (DRY) process.exit(0);

const existing = await client.fetch('*[_id in $ids]{_id, _rev, "seeded": defined(seededRev)}', {
  ids: docs.map((d) => d._id),
});
const tx = client.transaction();
let skipped = 0;
for (const d of docs) {
  const ex = existing.find((e) => e._id === d._id);
  if (ex && !FORCE) {
    skipped++;
    continue;
  } // never clobber pages editors may have changed
  tx.createOrReplace(d);
}
await tx.commit({ visibility: 'async' });
console.log(
  `written to "${DATASET}" (${docs.length - skipped} created/replaced, ${skipped} skipped as already existing)`,
);
