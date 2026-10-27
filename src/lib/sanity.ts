/**
 * Sanity data layer. Runs at BUILD time only — pages are static, no client JS, no runtime API calls.
 * Project/dataset are public identifiers (the dataset is public-read), so no secrets are needed to build.
 */
import { createClient } from '@sanity/client';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';

export const sanityConfig = {
  projectId: 'flt9h8js',
  // Override for rehearsal builds: SANITY_DATASET=migration-test npm run build
  dataset: (import.meta.env.SANITY_DATASET as string | undefined) ?? 'production',
  apiVersion: '2026-10-01',
  studioUrl: 'https://heseven.sanity.studio',
} as const;

export const sanity = createClient({
  ...sanityConfig,
  useCdn: false, // builds always read the freshest published content
  perspective: 'published',
});

const builder = createImageUrlBuilder(sanity);
export const imageUrl = (source: SanityImageSource) => builder.image(source).auto('format');

// ---------- Types ----------
export interface SanityImage {
  asset: {
    _id: string;
    url: string;
    metadata: { dimensions: { width: number; height: number }; lqip?: string };
  };
  alt?: string;
  caption?: string;
  hotspot?: { x: number; y: number };
  crop?: Record<string, number>;
}
export interface Category {
  title: string;
  slug: string;
  description?: string;
}
export interface Author {
  name: string;
  slug: string;
  role?: string;
  bio?: string;
  image?: SanityImage;
}
export interface PortableBlock {
  _type: string;
  _key: string;
  style?: string;
  children?: { text?: string }[];
  [key: string]: unknown;
}
export interface Post {
  _id: string;
  _updatedAt: string;
  /** Original "last updated" date (kept from Shopify for migrated posts). */
  updatedAt?: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  featured?: boolean;
  mainImage: SanityImage;
  author?: Author;
  categories: Category[];
  body: PortableBlock[];
  seo?: { title?: string; description?: string; ogImage?: SanityImage; noindex?: boolean };
  /** Set on posts migrated from Shopify. */
  legacy?: { shopifyId: string; url: string };
  readingMinutes: number;
}

// ---------- Queries ----------
const imageFields = `asset->{_id, url, metadata{dimensions{width, height}, lqip}}, alt, caption, hotspot, crop`;

const postFields = `
  _id, _updatedAt, updatedAt, title, "slug": slug.current, excerpt, publishedAt, featured,
  mainImage{ ${imageFields} },
  author->{ name, "slug": slug.current, role, bio, image{ ${imageFields} } },
  "categories": coalesce(categories[]->{ title, "slug": slug.current, description }, []),
  body[]{ ..., _type == "image" => { ${imageFields} } },
  seo{ title, description, noindex, ogImage{ ${imageFields} } },
  legacy{ shopifyId, url }
`;

const plainText = (blocks: PortableBlock[] = []) =>
  blocks
    .filter((b) => b._type === 'block')
    .map((b) => (b.children ?? []).map((c) => c.text ?? '').join(''))
    .join(' ');

let cache: Promise<Post[]> | null = null;

/** All published posts, newest first. Fetched once per build and shared by every page. */
export function getAllPosts(): Promise<Post[]> {
  cache ??= sanity
    .fetch<Omit<Post, 'readingMinutes'>[]>(
      `*[_type == "post" && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc){ ${postFields} }`,
    )
    .then((posts) =>
      posts.map((p) => ({
        ...p,
        readingMinutes: Math.max(1, Math.round(plainText(p.body).split(/\s+/).filter(Boolean).length / 225)),
      })),
    );
  return cache;
}

export async function getAllCategories(): Promise<(Category & { count: number })[]> {
  const posts = await getAllPosts();
  const map = new Map<string, Category & { count: number }>();
  for (const p of posts)
    for (const c of p.categories) {
      const entry = map.get(c.slug) ?? { ...c, count: 0 };
      entry.count++;
      map.set(c.slug, entry);
    }
  return [...map.values()].sort((a, b) => b.count - a.count || a.title.localeCompare(b.title));
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

// ---------- Landing pages (/pages/<slug>) ----------
export interface Cta {
  label: string;
  href: string;
}
export interface PageSection {
  _type: string;
  _key: string;
  eyebrow?: string;
  heading?: string;
  [key: string]: unknown;
}
export interface LandingPage {
  _id: string;
  _updatedAt: string;
  title: string;
  slug: string;
  sections: PageSection[];
  seo?: Post['seo'];
  legacy?: { shopifyId: string; url: string; template?: string };
}

const sectionFields = `
  ...,
  image{ ${imageFields} },
  body[]{ ..., _type == "image" => { ${imageFields} } },
  items[]{ ..., image{ ${imageFields} } }
`;

const pageCache = new Map<string, Promise<LandingPage[]>>();

/** All published page-builder documents of one type. Fetched once per build. */
function getBuilderPages(type: 'landingPage' | 'servicePage'): Promise<LandingPage[]> {
  if (!pageCache.has(type))
    pageCache.set(
      type,
      sanity.fetch<LandingPage[]>(
        `*[_type == $type && defined(slug.current)] | order(title asc){
          _id, _updatedAt, title, "slug": slug.current,
          "sections": coalesce(sections[]{ ${sectionFields} }, []),
          seo{ title, description, noindex, ogImage{ ${imageFields} } },
          legacy{ shopifyId, url, template }
        }`,
        { type },
      ),
    );
  return pageCache.get(type)!;
}

/** Landing pages at /pages/<slug>. */
export const getAllLandingPages = () => getBuilderPages('landingPage');
/** Service pages at /services/<slug>. */
export const getAllServicePages = () => getBuilderPages('servicePage');

// ---------- Case studies ----------

export type Accent = 'lime' | 'violet' | 'teal' | 'pink' | 'amber';
export interface CaseStudy {
  _id: string;
  _updatedAt: string;
  client: string;
  slug: string;
  website?: string;
  headline: string;
  summary: string;
  industry: string;
  platform?: string;
  services: string[];
  challenge?: string;
  solution: { _key: string; title: string; body?: string }[];
  highlights: string[];
  result?: string;
  quote?: { text?: string; name?: string; role?: string };
  cover?: SanityImage;
  mobile?: SanityImage;
  gallery: SanityImage[];
  fullStory: boolean;
  featured?: boolean;
  accent: Accent;
  seo?: Post['seo'];
}

let caseStudyCache: Promise<CaseStudy[]> | undefined;

/** Every published case study (full pages and "more recent work" links), in display order. */
export function getCaseStudies(): Promise<CaseStudy[]> {
  caseStudyCache ??= sanity.fetch<CaseStudy[]>(
    `*[_type == "caseStudy" && defined(slug.current)]
      | order(coalesce(order, 999) asc, _createdAt asc){
        _id, _updatedAt, client, "slug": slug.current, website, headline, summary, industry, platform,
        "services": coalesce(services, []), challenge, "solution": coalesce(solution, []),
        "highlights": coalesce(highlights, []), result, quote,
        cover{ ${imageFields} }, mobile{ ${imageFields} }, "gallery": coalesce(gallery[]{ ${imageFields} }, []),
        "fullStory": fullStory != false, featured, "accent": coalesce(accent, "lime"),
        seo{ title, description, noindex, ogImage{ ${imageFields} } }
      }`,
  );
  return caseStudyCache;
}
