/**
 * Page-builder sections for landing pages. Each maps 1:1 to a component in
 * src/components/page-builder/ on the website, styled with the site's design system.
 */
import { defineArrayMember, defineField, defineType } from 'sanity';
import { ICON_OPTIONS, imageWithAlt, sectionIntro } from './shared';

const preview = (label: string) => ({
  select: { title: 'heading', subtitle: 'eyebrow' },
  prepare: ({ title, subtitle }: { title?: string; subtitle?: string }) => ({
    title: title || '(no heading)',
    subtitle: `${label}${subtitle ? ` · ${subtitle}` : ''}`,
  }),
});

export const sectionHero = defineType({
  name: 'sectionHero',
  title: 'Hero',
  type: 'object',
  fields: [
    ...sectionIntro,
    defineField({ name: 'lead', title: 'Intro text', type: 'text', rows: 3 }),
    defineField({ name: 'primaryCta', title: 'Main button', type: 'cta' }),
    defineField({ name: 'secondaryCta', title: 'Second button', type: 'cta' }),
    imageWithAlt('image', 'Image (optional, shown on the right on desktop)'),
  ],
  preview: preview('Hero'),
});

export const sectionRichText = defineType({
  name: 'sectionRichText',
  title: 'Text',
  type: 'object',
  fields: [...sectionIntro, defineField({ name: 'body', type: 'blockContent' })],
  preview: preview('Text'),
});

export const sectionFeatures = defineType({
  name: 'sectionFeatures',
  title: 'Feature / service grid',
  type: 'object',
  fields: [
    ...sectionIntro,
    defineField({ name: 'lead', title: 'Intro text', type: 'text', rows: 2 }),
    defineField({
      name: 'columns',
      type: 'number',
      initialValue: 3,
      options: { list: [2, 3, 4], layout: 'radio', direction: 'horizontal' },
    }),
    defineField({
      name: 'items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'feature',
          fields: [
            defineField({ name: 'icon', type: 'string', options: { list: ICON_OPTIONS } }),
            imageWithAlt('image', 'Image (instead of an icon)'),
            defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'body', type: 'text', rows: 3 }),
            defineField({ name: 'href', title: 'Link (optional)', type: 'string' }),
          ],
          preview: { select: { title: 'title', subtitle: 'body', media: 'image' } },
        }),
      ],
    }),
  ],
  preview: preview('Feature grid'),
});

export const sectionStats = defineType({
  name: 'sectionStats',
  title: 'Stats / numbers',
  type: 'object',
  fields: [
    ...sectionIntro,
    defineField({
      name: 'items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stat',
          fields: [
            defineField({
              name: 'value',
              type: 'string',
              description: 'e.g. 1000+, 175M+, 4.9',
              validation: (r) => r.required(),
            }),
            defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        }),
      ],
    }),
  ],
  preview: preview('Stats'),
});

export const sectionImageText = defineType({
  name: 'sectionImageText',
  title: 'Image + text',
  type: 'object',
  fields: [
    ...sectionIntro,
    defineField({ name: 'body', type: 'blockContent' }),
    imageWithAlt(),
    defineField({
      name: 'imageSide',
      type: 'string',
      initialValue: 'right',
      options: { list: ['left', 'right'], layout: 'radio', direction: 'horizontal' },
    }),
    defineField({ name: 'cta', title: 'Button', type: 'cta' }),
  ],
  preview: preview('Image + text'),
});

export const sectionSteps = defineType({
  name: 'sectionSteps',
  title: 'Process steps',
  type: 'object',
  fields: [
    ...sectionIntro,
    defineField({
      name: 'steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'step',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'body', type: 'text', rows: 2 }),
          ],
        }),
      ],
    }),
  ],
  preview: preview('Steps'),
});

export const sectionFaq = defineType({
  name: 'sectionFaq',
  title: 'FAQ',
  type: 'object',
  fields: [
    ...sectionIntro,
    defineField({
      name: 'items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          fields: [
            defineField({ name: 'question', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'answer', type: 'text', rows: 4, validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'question', subtitle: 'answer' } },
        }),
      ],
    }),
  ],
  preview: preview('FAQ'),
});

export const sectionCta = defineType({
  name: 'sectionCta',
  title: 'Call to action',
  type: 'object',
  fields: [
    ...sectionIntro,
    defineField({ name: 'body', type: 'text', rows: 2 }),
    defineField({ name: 'cta', title: 'Button', type: 'cta' }),
  ],
  preview: preview('CTA'),
});

const stringList = (name: string, title: string) =>
  defineField({ name, title, type: 'array', of: [defineArrayMember({ type: 'string' })] });

export const sectionFit = defineType({
  name: 'sectionFit',
  title: 'Is this right for you?',
  type: 'object',
  description: 'Two columns: when the service is a good fit, and when it is not (yet).',
  fields: [
    ...sectionIntro,
    defineField({
      name: 'goodTitle',
      title: 'Good fit — column title',
      type: 'string',
      initialValue: 'A good fit if',
    }),
    stringList('good', 'Good fit — points'),
    defineField({
      name: 'notTitle',
      title: 'Not yet — column title',
      type: 'string',
      initialValue: 'Probably not yet if',
    }),
    stringList('notYet', 'Not yet — points'),
    defineField({ name: 'cta', title: 'Button (optional)', type: 'cta' }),
  ],
  preview: preview('Fit check'),
});

export const sectionPitfalls = defineType({
  name: 'sectionPitfalls',
  title: 'Common pitfalls',
  type: 'object',
  fields: [
    ...sectionIntro,
    defineField({ name: 'lead', title: 'Intro text', type: 'text', rows: 2 }),
    defineField({
      name: 'items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'pitfall',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'body', title: 'What goes wrong', type: 'text', rows: 3 }),
            defineField({ name: 'fix', title: 'How we avoid it', type: 'string' }),
          ],
          preview: { select: { title: 'title', subtitle: 'fix' } },
        }),
      ],
    }),
  ],
  preview: preview('Pitfalls'),
});

export const sectionCompare = defineType({
  name: 'sectionCompare',
  title: 'Comparison table',
  type: 'object',
  fields: [
    ...sectionIntro,
    defineField({ name: 'lead', title: 'Intro text', type: 'text', rows: 2 }),
    defineField({ name: 'leftLabel', title: 'Left column', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'rightLabel',
      title: 'Right column (highlighted)',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'rows',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'compareRow',
          fields: [
            defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'left', type: 'string' }),
            defineField({ name: 'right', type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'right' } },
        }),
      ],
    }),
    defineField({ name: 'note', title: 'Footnote', type: 'string' }),
  ],
  preview: preview('Comparison'),
});

export const sectionPlans = defineType({
  name: 'sectionPlans',
  title: 'Ways to work together',
  type: 'object',
  fields: [
    ...sectionIntro,
    defineField({ name: 'lead', title: 'Intro text', type: 'text', rows: 2 }),
    defineField({
      name: 'items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'plan',
          fields: [
            defineField({ name: 'badge', type: 'string', description: 'e.g. Fixed fee, Project, Monthly' }),
            defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'body', type: 'text', rows: 3 }),
            stringList('points', 'Included'),
          ],
          preview: { select: { title: 'title', subtitle: 'badge' } },
        }),
      ],
    }),
    defineField({ name: 'cta', title: 'Button', type: 'cta' }),
  ],
  preview: preview('Plans'),
});

export const sectionLinks = defineType({
  name: 'sectionLinks',
  title: 'Link hub',
  type: 'object',
  description: 'Grouped links to related services and guides.',
  fields: [
    ...sectionIntro,
    defineField({
      name: 'groups',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'linkGroup',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'links', type: 'array', of: [defineArrayMember({ type: 'cta' })] }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
    }),
  ],
  preview: preview('Link hub'),
});

export const sectionTestimonials = defineType({
  name: 'sectionTestimonials',
  title: 'Client reviews',
  type: 'object',
  description: 'Shows the client reviews from the homepage.',
  fields: [...sectionIntro],
  preview: preview('Reviews'),
});

export const sectionContact = defineType({
  name: 'sectionContact',
  title: 'Contact form',
  type: 'object',
  description: 'The quote form, with a short intro beside it. Use once per page.',
  fields: [
    ...sectionIntro,
    defineField({ name: 'body', type: 'text', rows: 3 }),
    stringList('points', 'Bullet points'),
  ],
  preview: preview('Contact form'),
});

export const sectionTypes = [
  sectionHero,
  sectionRichText,
  sectionFeatures,
  sectionStats,
  sectionImageText,
  sectionSteps,
  sectionFaq,
  sectionFit,
  sectionPitfalls,
  sectionCompare,
  sectionPlans,
  sectionTestimonials,
  sectionLinks,
  sectionContact,
  sectionCta,
];
