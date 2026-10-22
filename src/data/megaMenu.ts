// Services mega menu (header). Items whose page doesn't exist yet point at /services as a placeholder —
// swap in /services/<handle> once the page is built in Sanity → Service pages.
export interface MegaItem {
  label: string;
  desc: string;
  href: string;
}
export interface MegaGroup {
  title: string;
  tags: string[];
  items: MegaItem[];
  more: { label: string; href: string; count: number };
}

export const megaGroups: MegaGroup[] = [
  {
    title: 'Build & Migrate',
    tags: ['Build', 'Migrate'],
    items: [
      {
        label: 'Shopify Web Design',
        desc: 'Storefronts designed to convert.',
        href: '/services/shopify-web-design',
      },
      {
        label: 'Shopify Development',
        desc: 'Custom themes to headless builds.',
        href: '/pages/shopify-website-development-services',
      },
      {
        label: 'Shopify Plus Development',
        desc: 'Checkout, Functions, Markets and B2B.',
        href: '/pages/shopify-plus-development-agency',
      },
      {
        label: 'Platform Migration',
        desc: 'Move to Shopify, rankings intact.',
        href: '/pages/ecommerce-platform-migration-service',
      },
    ],
    more: { label: 'All build services', href: '/services', count: 8 },
  },
  {
    title: 'Grow & Rank',
    tags: ['Organic', 'Reach'],
    items: [
      {
        label: 'Shopify SEO',
        desc: 'Technical and content SEO.',
        href: '/pages/shopify-seo-services',
      },
      { label: 'Ecommerce AI SEO', desc: 'Get cited by ChatGPT and Perplexity.', href: '/services' },
      { label: 'Content & Blogging', desc: 'Articles that rank and sell.', href: '/services' },
      { label: 'Paid Ads', desc: 'Ads that pay for themselves.', href: '/services' },
    ],
    more: { label: 'All growth services', href: '/services', count: 5 },
  },
  {
    title: 'Convert & Optimise',
    tags: ['CRO', 'Speed'],
    items: [
      {
        label: 'Conversion Rate Optimisation',
        desc: 'Find the leaks, fix them.',
        href: '/pages/conversion-rate-optimisation',
      },
      {
        label: 'Speed Optimisation',
        desc: 'Core Web Vitals in the green.',
        href: '/pages/speed-optimization',
      },
      { label: 'UX & Store Audit', desc: 'What to fix, and in what order.', href: '/services' },
      { label: 'Email & Klaviyo', desc: 'Flows that earn the inbox.', href: '/services' },
    ],
    more: { label: 'All optimisation services', href: '/services', count: 4 },
  },
  {
    title: 'Care & Support',
    tags: ['Retainer', 'Team'],
    items: [
      {
        label: 'Shopify Maintenance',
        desc: 'A named developer, not a queue.',
        href: '/pages/shopify-maintenance-service',
      },
      {
        label: 'Virtual Assistant',
        desc: 'Day-to-day store admin, handled.',
        href: '/pages/virtual-assistant-for-shopify',
      },
      {
        label: 'White-label Development',
        desc: "Your agency's Shopify team.",
        href: '/pages/white-label-shopify-development',
      },
      { label: 'Growth Partnership', desc: 'A retained team, one roadmap.', href: '/services' },
    ],
    more: { label: 'All support services', href: '/services', count: 6 },
  },
];

export const megaIndustries = [
  'Fashion & apparel',
  'Beauty & wellness',
  'Food & drink',
  'Home & interiors',
  'Fitness & activewear',
  'B2B & wholesale',
  'Luxury',
].map((label) => ({ label, href: '/services' }));
