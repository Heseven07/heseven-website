import { defineField, defineType } from 'sanity';

export const post = defineType({
  name: 'post',
  title: 'Blog post',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'Details' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'content',
      validation: (r) => r.required().max(110),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      group: 'content',
      description:
        'The post URL: heseven.com/blog/<slug>/. Keep old Shopify slugs when migrating so redirects work.',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'One or two sentences shown on the blog list and used as the default meta description.',
      validation: (r) => [
        r.required(),
        r.max(220).warning('Shorter excerpts (≤ 220 characters) read better on cards'),
      ],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (r) => r.required().warning('Describe the image for screen readers and Google'),
        },
      ],
      validation: (r) => r.required(),
    }),
    defineField({ name: 'body', type: 'blockContent', group: 'content', validation: (r) => r.required() }),
    defineField({
      name: 'publishedAt',
      title: 'Published date',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last updated',
      type: 'datetime',
      group: 'meta',
      description: 'Optional. Shown to Google as the modified date (migrated posts keep their Shopify date).',
    }),
    defineField({ name: 'author', type: 'reference', to: [{ type: 'author' }], group: 'meta' }),
    defineField({
      name: 'categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      group: 'meta',
    }),
    defineField({
      name: 'featured',
      title: 'Feature on blog home',
      type: 'boolean',
      initialValue: false,
      group: 'meta',
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
        { name: 'tags', type: 'array', of: [{ type: 'string' }] },
      ],
    }),
  ],
  orderings: [
    { title: 'Newest first', name: 'publishedDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', date: 'publishedAt', media: 'mainImage' },
    prepare: ({ title, date, media }) => ({
      title,
      subtitle: date ? new Date(date).toLocaleDateString('en-GB', { dateStyle: 'medium' }) : 'No date',
      media,
    }),
  },
});
