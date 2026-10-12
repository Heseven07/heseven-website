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

const components: Partial<PortableTextHtmlComponents> = {
  block: {
    h2: ({ children, value }) =>
      `<h2 id="${slugify(blockText(value as unknown as PortableBlock))}">${children}</h2>`,
    h3: ({ children, value }) =>
      `<h3 id="${slugify(blockText(value as unknown as PortableBlock))}">${children}</h3>`,
  },
  marks: {
    link: ({ children, value }) => {
      const href = String(value?.href ?? '');
      const external = /^https?:\/\//.test(href) && !href.startsWith('https://heseven.com');
      return `<a href="${escapeHTML(href)}"${external ? ' target="_blank" rel="noopener"' : ''}>${children}</a>`;
    },
  },
};

export type BodySegment = { type: 'html'; html: string } | { type: 'image'; block: PortableBlock };

export function toSegments(body: PortableBlock[] = []): BodySegment[] {
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

/** h2/h3 headings for the table of contents. */
export const headings = (body: PortableBlock[] = []) =>
  body
    .filter((b) => b._type === 'block' && (b.style === 'h2' || b.style === 'h3'))
    .map((b) => ({ depth: b.style === 'h2' ? 2 : 3, text: blockText(b), id: slugify(blockText(b)) }));
