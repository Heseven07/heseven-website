/**
 * Homepage content. Placeholder copy adapted from the current heseven.com.
 * Moves to Sanity in Phase 4 — keep shapes stable so components don't change.
 */
import type { ImageMetadata } from 'astro';
import { icons } from './icons';
import powerlete from '../assets/work/powerlete.jpg';
import vroom from '../assets/work/vroom-classic.jpg';
import caorunn from '../assets/work/caorunn-gin.jpg';
import ornella from '../assets/work/ornellagorza.jpg';
import aquadoc from '../assets/work/aquadoc.jpg';
import waldo from '../assets/work/waldo-watch.jpg';

export const nav = [
  { label: 'Services', href: '/services/' },
  { label: 'Work', href: '/#work' },
  { label: 'Process', href: '/#process' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/contact/' },
];

export const hero = {
  eyebrow: 'Shopify Partner · Since 2018',
  titleBefore: 'Your',
  titleAccent: 'Shopify',
  titleAfter: 'growth partner',
  lead: 'We design, build and grow high-converting Shopify stores — from first wireframe to ongoing optimisation.',
  tags: ['UI/UX Design', 'Development', 'Ongoing Support'],
  primary: { label: 'Get your quote', href: '/contact/' },
  secondary: { label: 'See our work', href: '/#work' },
  stats: [
    { value: '1000+', label: 'E-commerce brands served' },
    { value: '2018', label: 'Shopify Partner since' },
    { value: '4', label: 'Global time zones' },
    { value: '5.0', label: 'Average client rating' },
  ],
};

export const clients = [
  'Powerlete',
  'Vroom Classic',
  'Caorunn Gin',
  'Ornellagorza',
  'Aquadoc',
  'Waldo Watch',
  'Grenla',
  'ModMyCar',
];

export const about = {
  eyebrow: 'About Heseven',
  title: 'A Shopify agency that treats your store like a product, not a project.',
  body: 'Since 2018 we have helped founders and growing brands launch, migrate and scale on Shopify. Strategy, design, development and support live under one roof — so nothing gets lost in hand-offs.',
};

export type Service = { slug: string; title: string; summary: string; icon: string };
export const services: Service[] = [
  {
    slug: 'store-development',
    title: 'Store Development',
    summary: 'Custom Shopify and Shopify Plus themes built for speed, conversion and easy editing.',
    icon: icons.code,
  },
  {
    slug: 'platform-migration',
    title: 'Platform Migration',
    summary: 'Move from WooCommerce, Magento or BigCommerce with zero data loss and SEO intact.',
    icon: icons.migrate,
  },
  {
    slug: 'conversion-optimisation',
    title: 'Conversion Optimisation',
    summary: 'Research-led UX changes and A/B tests that turn more visitors into customers.',
    icon: icons.trend,
  },
  {
    slug: 'speed-optimisation',
    title: 'Speed Optimisation',
    summary: 'Core Web Vitals fixes, app audits and image pipelines for a faster storefront.',
    icon: icons.bolt,
  },
  {
    slug: 'shopify-seo',
    title: 'Shopify SEO',
    summary: 'Technical SEO, structured data and content that compounds organic revenue.',
    icon: icons.search,
  },
  {
    slug: 'store-maintenance',
    title: 'Store Maintenance',
    summary: 'A dedicated team on retainer for updates, fixes and continuous improvements.',
    icon: icons.clock,
  },
];

export const results = {
  eyebrow: 'Driven by results',
  title: 'Every decision is measured against revenue.',
  points: [
    {
      icon: icons.target,
      title: 'Strategy first',
      body: 'We start with your numbers — traffic, conversion, AOV — and prioritise the work that moves them.',
    },
    {
      icon: icons.users,
      title: 'Dedicated experts',
      body: 'A named designer, developer and project lead who know your store inside out.',
    },
    {
      icon: icons.report,
      title: 'Transparent reporting',
      body: 'Clear timelines, weekly updates and reports you can actually read.',
    },
  ],
};

export type CaseStudy = {
  slug: string;
  client: string;
  sector: string;
  metric: string;
  metricLabel: string;
  image: ImageMetadata;
};
export const work: CaseStudy[] = [
  {
    slug: 'powerlete',
    client: 'Powerlete',
    sector: 'Fitness Apparel',
    metric: '+38%',
    metricLabel: 'Conversion rate',
    image: powerlete,
  },
  {
    slug: 'vroom-classic',
    client: 'Vroom Classic',
    sector: 'Classic Car Parts',
    metric: '−45%',
    metricLabel: 'Bounce rate',
    image: vroom,
  },
  {
    slug: 'caorunn-gin',
    client: 'Caorunn Gin',
    sector: 'Scottish Gin',
    metric: '+64%',
    metricLabel: 'Conversion rate',
    image: caorunn,
  },
  {
    slug: 'ornellagorza',
    client: 'Ornellagorza',
    sector: 'Wine Maker',
    metric: '2.1×',
    metricLabel: 'Revenue',
    image: ornella,
  },
  {
    slug: 'aquadoc',
    client: 'Aquadoc',
    sector: 'Pool Care',
    metric: '−38%',
    metricLabel: 'Load time',
    image: aquadoc,
  },
  {
    slug: 'waldo-watch',
    client: 'Waldo Watch',
    sector: 'Streaming Platform',
    metric: '+52%',
    metricLabel: 'Customer LTV',
    image: waldo,
  },
];

export const testimonials = [
  {
    quote:
      'Heseven rebuilt our store from the ground up. It is faster, easier to manage and our conversion rate jumped within the first month.',
    name: 'Founder',
    company: 'Grenla',
    stats: [
      { value: '+38%', label: 'Conversion' },
      { value: '5 wks', label: 'To launch' },
    ],
  },
  {
    quote:
      'Clear communication, on time and genuinely invested in our results. They feel like part of our team rather than an agency.',
    name: 'Managing Director',
    company: 'ModMyCar',
    stats: [
      { value: '+22%', label: 'Page speed' },
      { value: '3 wks', label: 'To launch' },
    ],
  },
];

export const process = {
  eyebrow: 'How we work',
  title: 'From kickoff to launch in 4–8 weeks.',
  steps: [
    { title: 'Kickoff', body: 'Goals, audience, KPIs and a clear scope — agreed in one focused session.' },
    {
      title: 'Discovery & wireframes',
      body: 'User journeys and low-fidelity layouts to validate structure early.',
    },
    { title: 'Design', body: 'High-fidelity, on-brand designs for every key template and breakpoint.' },
    { title: 'Development', body: 'Clean, fast Shopify code with QA on real devices at every step.' },
    { title: 'Launch & support', body: 'A smooth go-live, then ongoing optimisation and support.' },
  ],
};

export const whyUs = {
  eyebrow: 'Why Heseven',
  title: 'Senior people, small-team focus, global reach.',
  pillars: [
    {
      icon: icons.globe,
      title: 'Global expertise',
      body: 'Brands across the UK, US, Europe, Australia and India.',
    },
    {
      icon: icons.sliders,
      title: 'Tailored solutions',
      body: 'No templates-in-disguise. Built around your products and customers.',
    },
    {
      icon: icons.sparkles,
      title: 'Creative team',
      body: 'Designers and developers who sweat the details together.',
    },
    {
      icon: icons.layers,
      title: 'End-to-end service',
      body: 'Strategy, design, build, SEO and support under one roof.',
    },
    {
      icon: icons.heart,
      title: '100% satisfaction',
      body: 'We are not done until you are proud to share your store.',
    },
  ],
};

export const offices = [
  { city: 'London', timeZone: 'Europe/London' },
  { city: 'New York', timeZone: 'America/New_York' },
  { city: 'Mumbai', timeZone: 'Asia/Kolkata' },
  { city: 'Melbourne', timeZone: 'Australia/Melbourne' },
];

export const faqs = [
  {
    q: 'What makes Heseven different from other Shopify agencies?',
    a: 'We combine senior strategy, design and development in one small team, and we measure success by your revenue — not by hours billed.',
  },
  {
    q: 'What services do you offer?',
    a: 'Store design and development, Shopify Plus builds, platform migrations, conversion and speed optimisation, SEO and ongoing maintenance.',
  },
  {
    q: 'How do I get a quote?',
    a: 'Tell us about your project through the contact form. We reply within one business day with next steps and, usually, a call to scope the work.',
  },
  {
    q: 'How much does a Shopify store cost?',
    a: 'It depends on scope. After a short discovery call we send a fixed, itemised quote so you know exactly what you are paying for.',
  },
  {
    q: 'How long does a project take?',
    a: 'Most new builds launch in 4–8 weeks. Smaller optimisation projects can start delivering results within days.',
  },
];
