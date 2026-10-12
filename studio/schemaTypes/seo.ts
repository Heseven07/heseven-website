import { defineField, defineType } from 'sanity';

/** Per-page SEO overrides. Everything is optional — the site falls back to title/excerpt/main image. */
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'title',
      title: 'Meta title',
      type: 'string',
      description: 'Shown in Google results. Leave empty to use the post title. Ideal: 50–60 characters.',
      validation: (r) => r.max(70).warning('Google usually cuts titles after ~60 characters'),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description:
        'Shown under the title in Google. Leave empty to use the excerpt. Ideal: 120–160 characters.',
      validation: (r) => r.max(170).warning('Google usually cuts descriptions after ~160 characters'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social share image',
      type: 'image',
      description:
        'Shown when the post is shared on LinkedIn/WhatsApp/etc. 1200×630 recommended. Defaults to the main image.',
    }),
    defineField({
      name: 'noindex',
      title: 'Hide from Google',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});
