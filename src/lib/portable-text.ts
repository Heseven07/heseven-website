/**
 * Portable Text → HTML for post bodies. Images are NOT rendered here: the body is split into
 * text segments (rendered to HTML) and image blocks (rendered by Astro's <Image> for AVIF/WebP + sizing).
 */
import { toHTML, escapeHTML, type PortableTextHtmlComponents } from '@portabletext/to-html';
import type { PortableBlock } from './sanity';

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);

const blockText = (b: PortableBlock) => (b.children ?? []).map((c) => c.text ?? '').join('');

/**
 * Posts migrated from Shopify start at h3/h4 (no h2), which breaks heading order under the page h1.
 * At render time only, shift every heading so the body's top level becomes `top` (h2 for a post; h3
 * inside a page-builder section that already has its own h2). Stored content is untouched.
 */
export function normalizeHeadings(body: PortableBlock[] = [], top = 2): PortableBlock[] {
  const levels = body.map((b) =>
    b._type === 'block' && /^h[1-6]$/.test(b.style ?? '') ? Number(b.style![1]) : 0,
  );
  const used = levels.filter(Boolean);
  if (!used.length) return body;
  const shift = Math.min(...used) - top;
  if (shift === 0) return body;
  return body.map((b, i) =>
    levels[i] ? { ...b, style: `h${Math.min(6, Math.max(top, levels[i]! - shift))}` } : b,
  );
}

/** Links to the old domain stay on this site (made relative) instead of opening a new tab. */
const OWN_ORIGIN = /^https?:\/\/(www\.)?heseven\.com(?=\/|$)/i;

const withId =
  (tag: string) =>
  ({ children, value }: { children?: string; value: unknown }) =>
    `<${tag} id="${slugify(blockText(value as PortableBlock))}">${children}</${tag}>`;

const components: Partial<PortableTextHtmlComponents> = {
  block: {
    h2: withId('h2'),
    h3: withId('h3'),
    h4: ({ children }) => `<h4>${children}</h4>`,
    h5: ({ children }) => `<h5>${children}</h5>`,
    h6: ({ children }) => `<h6>${children}</h6>`,
  },
  marks: {
    link: ({ children, value }) => {
      const href = String(value?.href ?? '').replace(OWN_ORIGIN, '') || '/';
      const external = /^https?:\/\//.test(href);
      return `<a href="${escapeHTML(href)}"${external ? ' target="_blank" rel="noopener"' : ''}>${children}</a>`;
    },
  },
};

export type BodySegment = { type: 'html'; html: string } | { type: 'image'; block: PortableBlock };

export function toSegments(raw: PortableBlock[] = [], top = 2): BodySegment[] {
  const body = normalizeHeadings(raw, top);
  const out: BodySegment[] = [];
  let run: PortableBlock[] = [];
  const flush = () => {
    if (run.length) out.push({ type: 'html', html: toHTML(run, { components }) });
    run = [];
  };
  for (const block of body) {
    if (block._type === 'image') {
      flush();
      out.push({ type: 'image', block });
    } else run.push(block);
  }
  flush();
  return out;
}

/** h2/h3 headings (after normalisation) for the table of contents. */
export const headings = (raw: PortableBlock[] = []) =>
  normalizeHeadings(raw)
    .filter((b) => b._type === 'block' && (b.style === 'h2' || b.style === 'h3'))
    .map((b) => ({ depth: b.style === 'h2' ? 2 : 3, text: blockText(b), id: slugify(blockText(b)) }));
