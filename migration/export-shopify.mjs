// Step 1 — Export every article from Shopify (read-only Admin API) to migration/data/shopify-articles.json.
// Usage: node --env-file=.env.migration migration/export-shopify.mjs
import fs from 'node:fs';

const { SHOPIFY_SHOP, SHOPIFY_ACCESS_TOKEN } = process.env;
if (!SHOPIFY_ACCESS_TOKEN) throw new Error('SHOPIFY_ACCESS_TOKEN missing (see migration/README.md)');
const endpoint = `https://${SHOPIFY_SHOP}.myshopify.com/admin/api/2025-07/graphql.json`;

async function gql(query, variables = {}) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-shopify-access-token': SHOPIFY_ACCESS_TOKEN },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

const QUERY = `query($after: String) {
  blogs(first: 10) { nodes { handle title } }
  articles(first: 50, after: $after, sortKey: PUBLISHED_AT) {
    pageInfo { hasNextPage endCursor }
    nodes {
      id handle title body summary
      publishedAt createdAt updatedAt isPublished
      tags templateSuffix
      blog { handle }
      author { name }
      image { url altText width height }
      seoTitle: metafield(namespace: "global", key: "title_tag") { value }
      seoDescription: metafield(namespace: "global", key: "description_tag") { value }
    }
  }
}`;

const articles = [];
let after = null;
let blogs;
do {
  const data = await gql(QUERY, { after });
  blogs = data.blogs.nodes;
  articles.push(...data.articles.nodes);
  after = data.articles.pageInfo.hasNextPage ? data.articles.pageInfo.endCursor : null;
} while (after);

fs.writeFileSync(
  'data/shopify-articles.json',
  JSON.stringify(
    { exportedAt: new Date().toISOString(), shop: SHOPIFY_SHOP, blogs, count: articles.length, articles },
    null,
    2,
  ),
);
console.log(`exported ${articles.length} articles from ${blogs.map((b) => b.handle).join(', ')}`);
