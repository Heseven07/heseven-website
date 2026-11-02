/** /pages/audit content. The report panel is an illustration, so it is labelled "Sample report". */
export const auditHero = {
  eyebrow: 'Shopify store audit',
  title: 'Find out what your store is leaving on the table.',
  lead: 'Share your store and our Shopify specialists will review it the way a customer, a search engine and a developer would, then tell you what to fix first.',
  points: [
    'Reviewed by people, not a generic scanner',
    'Prioritised by likely impact',
    'A clear next step for your team or ours',
  ],
};

export const auditSample = {
  url: 'yourstore.com',
  scores: [
    { label: 'Speed', value: 58 },
    { label: 'Conversion', value: 71 },
    { label: 'SEO', value: 83 },
    { label: 'Mobile UX', value: 64 },
  ],
  findings: [
    { level: 'High', text: 'Hero image delays first paint' },
    { level: 'High', text: 'Add to cart is below the fold on mobile' },
    { level: 'Medium', text: 'Unused app scripts load on every page' },
  ],
};

export const auditAreas = [
  {
    id: 'speed',
    label: 'Speed',
    title: 'How fast your store feels',
    body: 'Slow pages cost attention before a customer sees a product.',
    checks: [
      'Core Web Vitals on key templates',
      'Images, fonts and theme code',
      'Scripts that load on every page',
    ],
  },
  {
    id: 'conversion',
    label: 'Conversion',
    title: 'Where shoppers drop off',
    body: 'We follow the path from landing page to checkout and look for friction.',
    checks: [
      'Product page clarity and trust',
      'Cart and checkout journey',
      'Offers, navigation and calls to action',
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile UX',
    title: 'How it works on a phone',
    body: 'We use your store on a real phone-sized screen, the way most shoppers do.',
    checks: ['Tap targets and layout', 'Menus, filters and search', 'Content order on small screens'],
  },
  {
    id: 'seo',
    label: 'SEO',
    title: 'How search engines read it',
    body: 'Technical issues can quietly hold back the pages you want to rank.',
    checks: [
      'Titles, headings and structured data',
      'Indexing, redirects and broken links',
      'Collection and product page content',
    ],
  },
  {
    id: 'apps',
    label: 'Apps & code',
    title: 'What is running under the hood',
    body: 'Years of apps and edits add weight, overlap and risk.',
    checks: ['Overlapping or unused apps', 'Theme code quality', 'Leftover code from removed apps'],
  },
  {
    id: 'tracking',
    label: 'Tracking',
    title: 'Whether you can trust your data',
    body: 'Good decisions need numbers that match what is actually happening.',
    checks: ['Analytics events and conversions', 'Ad platform pixels', 'Duplicate or missing events'],
  },
];

export const auditSteps = [
  {
    title: 'Share your store',
    body: 'Send your store URL and anything you already suspect is holding it back.',
  },
  {
    title: 'We review it',
    body: 'A Shopify specialist works through speed, conversion, UX, SEO, apps and tracking.',
  },
  { title: 'Get your priorities', body: 'We come back with what we found and what to fix first.' },
];
