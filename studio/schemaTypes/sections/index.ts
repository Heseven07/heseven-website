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

export const sectionTypes = [
  sectionHero,
  sectionRichText,
  sectionFeatures,
  sectionStats,
  sectionImageText,
  sectionSteps,
  sectionFaq,
  sectionCta,
];
