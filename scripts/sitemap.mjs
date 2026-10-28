// Astro integration: after the build, write dist/sitemap.xml from the pages that were actually built.
// - Same address Shopify used (heseven.com/sitemap.xml), one file, so Search Console keeps working
//   after the domain moves. Old Shopify child sitemaps redirect here (public/_redirects).
// - Every built page is listed except 404 and pages marked noindex (e.g. a post with "Hide from
//   Google" ticked in Sanity), so new pages appear automatically.
// - <lastmod> comes from the page's own JSON-LD "dateModified" (posts, case studies, Sanity pages).
//   Pages without one are listed without a date rather than with a made-up one.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default function sitemapXml() {
  let site = '';
  return {
    name: 'sitemap-xml',
    hooks: {
      'astro:config:done': ({ config }) => {
        site = String(config.site).replace(/\/$/, '');
      },
      'astro:build:done': ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const pages = [];
        (function walk(d) {
          for (const f of fs.readdirSync(d, { withFileTypes: true })) {
            const p = path.join(d, f.name);
            if (f.isDirectory()) walk(p);
            else if (f.name === 'index.html') pages.push(p);
          }
        })(root);

        const entries = [];
        for (const file of pages) {
          const html = fs.readFileSync(file, 'utf8');
          if (/<meta name="robots" content="[^"]*noindex/i.test(html)) continue;
          const rel = path.relative(root, path.dirname(file)).split(path.sep).join('/');
          const loc = rel ? `${site}/${rel}` : `${site}/`;
          const modified = html.match(/"dateModified":"([^"]+)"/)?.[1];
          const lastmod =
            modified && !Number.isNaN(Date.parse(modified)) ? new Date(modified).toISOString() : '';
          entries.push({ loc, lastmod });
        }
        entries.sort((a, b) =>
          a.loc === `${site}/` ? -1 : b.loc === `${site}/` ? 1 : a.loc.localeCompare(b.loc),
        );

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...entries.map(
            (e) =>
              `<url><loc>${escape(e.loc)}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}</url>`,
          ),
          '</urlset>',
          '',
        ].join('\n');
        fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
        logger.info(
          `sitemap.xml: ${entries.length} URLs (${entries.filter((e) => e.lastmod).length} with lastmod)`,
        );
      },
    },
  };
}
