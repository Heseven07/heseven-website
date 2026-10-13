import { defineField, defineType } from 'sanity';

/** Icon names available on the website (must match src/data/icons.ts). */
export const ICON_OPTIONS = [
  'code',
  'migrate',
  'trend',
  'bolt',
  'search',
  'clock',
  'target',
  'users',
  'report',
  'globe',
  'sliders',
  'sparkles',
  'layers',
  'heart',
].map((value) => ({ title: value, value }));

/** A button: label + link (internal path like /contact or a full URL). */
export const cta = defineType({
  name: 'cta',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      description: 'Internal path (e.g. /contact) or full URL (https://…)',
      validation: (r) => r.required(),
    }),
  ],
});

/** Fields every section starts with. */
export const sectionIntro = [
  defineField({ name: 'eyebrow', title: 'Small label above heading', type: 'string' }),
  defineField({ name: 'heading', type: 'string' }),
];

export const imageWithAlt = (name = 'image', title = 'Image') =>
  defineField({
    name,
    title,
    type: 'image',
    options: { hotspot: true },
    fields: [
      {
        name: 'alt',
        title: 'Alt text',
        type: 'string',
        validation: (r) => r.required().warning('Describe the image for screen readers and Google'),
      },
    ],
  });
