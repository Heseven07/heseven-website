import { defineArrayMember, defineField, defineType } from 'sanity';
import { sectionTypes } from './sections';

/**
 * Landing pages served at heseven.com/pages/<slug> — the same URL structure as Shopify.
 * Publishing a page with a Shopify handle automatically replaces that URL's old redirect.
 */
export const landingPage = defineType({
  name: 'landingPage',
  title: 'Landing page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'meta', title: 'Details' },
  ],
  fields: [
    defineField({ name: 'title', type: 'string', group: 'content', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      group: 'content',
      description: 'The page URL: heseven.com/pages/<slug>. Keep the old Shopify handle when migrating.',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Page sections',
      type: 'array',
      group: 'content',
      description: 'Build the page from sections. Drag to reorder. Put a Hero first for the page heading.',
      of: sectionTypes.map((t) => defineArrayMember({ type: t.name })),
    }),
    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
    defineField({
      name: 'legacy',
      title: 'Migrated from Shopify',
      type: 'object',
      group: 'meta',
      readOnly: true,
      hidden: ({ value }) => !value,
      fields: [
        { name: 'shopifyId', type: 'string' },
        { name: 'url', type: 'url' },
        { name: 'template', title: 'Shopify template', type: 'string' },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current' },
    prepare: ({ title, slug }) => ({ title, subtitle: slug ? `/pages/${slug}` : 'No URL yet' }),
  },
});
