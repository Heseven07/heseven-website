import { defineArrayMember, defineField, defineType, type ValidationContext } from 'sanity';

/**
 * Case studies → heseven.com/pages/case-studies/<slug>, listed on /pages/case-studies.
 * Written for non-technical editors: fill the Story tab, add two screenshots, press Publish.
 * Turn off "Has its own page" for stores that should only appear as a card under "More recent work".
 */
export const INDUSTRIES = [
  'Fashion & apparel',
  'Sports & fitness',
  'Beauty & wellness',
  'Food & drink',
  'Wine & spirits',
  'Home & lifestyle',
  'Watches & jewellery',
  'B2B & wholesale',
  'Hospitality',
  'Home energy',
  'Health & nutrition',
  'Other',
];

export const SERVICES = [
  'Custom theme',
  'Theme redesign',
  'Shopify Plus',
  'B2B & wholesale',
  'Multi-vendor marketplace',
  'Multi-region & currency',
  'Custom app',
  'Performance',
  'Migration',
  'Conversion (CRO)',
];

/** Required only for case studies with their own page ("Has its own page" on). */
const neededForPage = (value: unknown, ctx: ValidationContext) =>
  ctx.document?.fullStory === false ||
  (value !== undefined && value !== '') ||
  'Needed for a case study page';

const image = (name: string, title: string, description: string) =>
  defineField({
    name,
    title,
    type: 'image',
    group: 'images',
    description,
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt text',
        type: 'string',
        description: 'Describe the picture in a few words, e.g. "Waldo Watches homepage on desktop".',
      }),
    ],
  });

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case study',
  type: 'document',
  groups: [
    { name: 'story', title: 'Story', default: true },
    { name: 'images', title: 'Images' },
    { name: 'listing', title: 'Listing' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'client',
      title: 'Client name',
      type: 'string',
      group: 'story',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Page address',
      type: 'slug',
      group: 'story',
      description: 'Click "Generate". The page will be heseven.com/pages/case-studies/<this>.',
      options: { source: 'client', maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'website',
      title: 'Live store link',
      type: 'url',
      group: 'story',
      description: 'e.g. https://waldowatches.com — leave empty for private/internal platforms.',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      group: 'story',
      description: 'One line about the project, e.g. "Bespoke Shopify build for a premium watch brand".',
      validation: (r) => r.max(90).custom(neededForPage),
    }),
    defineField({
      name: 'summary',
      title: 'Short summary',
      type: 'text',
      rows: 3,
      group: 'story',
      description: 'Two sentences shown on the case study cards.',
      validation: (r) => r.max(260).custom(neededForPage),
    }),
    defineField({
      name: 'industry',
      type: 'string',
      group: 'story',
      options: { list: INDUSTRIES },
      validation: (r) => r.custom(neededForPage),
    }),
    defineField({
      name: 'platform',
      type: 'string',
      group: 'story',
      initialValue: 'Shopify',
      options: { list: ['Shopify', 'Shopify Plus'], layout: 'radio', direction: 'horizontal' },
    }),
    defineField({
      name: 'services',
      title: 'What we did (tags)',
      type: 'array',
      group: 'story',
      of: [defineArrayMember({ type: 'string' })],
      options: { list: SERVICES, layout: 'grid' },
    }),
    defineField({
      name: 'challenge',
      title: 'The brief',
      type: 'text',
      rows: 4,
      group: 'story',
      description: 'What the client needed and why.',
    }),
    defineField({
      name: 'solution',
      title: 'What we did',
      type: 'array',
      group: 'story',
      description: 'Two to four short points. Each has a title and a sentence or two.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'solutionPoint',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'body', type: 'text', rows: 3 }),
          ],
          preview: { select: { title: 'title', subtitle: 'body' } },
        }),
      ],
    }),
    defineField({
      name: 'highlights',
      title: 'Key features delivered',
      type: 'array',
      group: 'story',
      description: 'Short phrases shown as chips, e.g. "Multi-currency checkout".',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'result',
      title: 'The result',
      type: 'text',
      rows: 4,
      group: 'story',
    }),
    defineField({
      name: 'quote',
      title: 'Client quote (optional)',
      type: 'object',
      group: 'story',
      fields: [
        defineField({ name: 'text', type: 'text', rows: 3 }),
        defineField({ name: 'name', type: 'string' }),
        defineField({ name: 'role', type: 'string' }),
      ],
    }),

    image('cover', 'Desktop screenshot', 'The store on a laptop/desktop, about 1440 × 900 px.'),
    image('mobile', 'Mobile screenshot', 'The store on a phone, about 390 × 844 px.'),
    defineField({
      name: 'gallery',
      title: 'More images (optional)',
      type: 'array',
      group: 'images',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
        }),
      ],
    }),

    defineField({
      name: 'fullStory',
      title: 'Has its own page',
      type: 'boolean',
      group: 'listing',
      initialValue: true,
      description:
        'Off = the store only appears as a card in "More recent work": add the name, the live store link and a desktop screenshot (Images tab).',
    }),
    defineField({
      name: 'featured',
      title: 'Feature at the top of the case studies page',
      type: 'boolean',
      group: 'listing',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      group: 'listing',
      description: 'Lower numbers show first. Leave empty to show newest last.',
    }),
    defineField({
      name: 'accent',
      title: 'Glow colour',
      type: 'string',
      group: 'listing',
      initialValue: 'lime',
      options: {
        list: ['lime', 'violet', 'teal', 'pink', 'amber'],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'client', subtitle: 'headline', media: 'cover', full: 'fullStory' },
    prepare: ({ title, subtitle, media, full }) => ({
      title,
      subtitle: full === false ? 'More recent work (card only)' : subtitle,
      media,
    }),
  },
});
