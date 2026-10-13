import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAllPosts } from '../lib/sanity';
import { SITE } from '../config/site';

export async function GET(context: APIContext) {
  const posts = await getAllPosts();
  return rss({
    title: `${SITE.name} Blog`,
    description: 'Practical Shopify advice: conversion, speed, SEO and store development.',
    site: context.site!,
    items: posts.map((p) => ({
      title: p.title,
      description: p.excerpt,
      pubDate: new Date(p.publishedAt),
      link: `/blogs/news/${p.slug}`,
      categories: p.categories.map((c) => c.title),
    })),
  });
}
