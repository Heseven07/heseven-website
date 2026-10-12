/** Contact page content + quote-form options. Field set mirrors heseven.com's "Start a project" form. */
import { icons } from './icons';

export const contactHero = {
  eyebrow: 'Get a quote',
  title: "Let's build your next Shopify store.",
  lead: 'Tell us about your project and a strategist will reply within one business day with next steps and a rough scope.',
  responseNote: 'Typically replies within 1 business day',
  stats: [
    { value: '1000+', label: 'Stores launched' },
    { value: '3hr', label: 'Avg. response' },
    { value: '2018', label: 'Founded' },
  ],
  perks: [
    { title: 'Free scoping call', body: 'No commitment, just a look at your goals.' },
    { title: 'Fixed 4–8 week launch', body: 'Clear timeline from kickoff to go-live.' },
    { title: 'Dedicated Slack channel', body: 'Direct line to your build team, day one.' },
  ],
  quote: {
    text: 'Heseven rebuilt our store in five weeks and conversion jumped 38%.',
    name: 'Jamie D.',
    company: 'Grenla',
    initials: 'JD',
  },
};

export const quoteForm = {
  needs: [
    'New Shopify store',
    'Store redesign',
    'Shopify migration',
    'Shopify Plus',
    'Custom development',
    'CRO & optimisation',
    'Theme customisation',
    'SEO optimisation',
  ],
  /** Budget bands; the currency symbol is swapped client-side (USD/GBP). */
  budgets: ['Under 1k', '1k – 5k', '5k – 10k', '10k – 25k', '25k+', 'Not sure yet'],
  timelines: ['ASAP', '1–3 months', '3–6 months', 'Just exploring'],
};

export const nextSteps = [
  {
    when: 'Within hours',
    title: 'We review your brief',
    body: 'A strategist reads what you sent and works out how we can help — not an auto-responder.',
    icon: icons.search,
  },
  {
    when: 'Within 1 business day',
    title: 'Free scoping call',
    body: '20 focused minutes with the people who would actually build your store.',
    icon: icons.users,
  },
  {
    when: 'Fixed price',
    title: 'You get a proposal',
    body: 'Itemised scope, timeline and a fixed price. No surprises — you decide from there.',
    icon: icons.report,
  },
];
