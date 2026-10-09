/** Single source of truth for brand + business details (used by SEO, JSON-LD, footer). */
export const SITE = {
  name: 'Heseven',
  legalName: 'Heseven Ltd',
  url: 'https://heseven.com',
  title: 'Heseven – Shopify Partner Agency',
  description:
    'Heseven is a Shopify Partner agency designing, building and growing high-converting e-commerce stores since 2018.',
  locale: 'en_GB',
  email: 'info@heseven.com',
  foundingYear: 2018,
  address: {
    streetAddress: 'TODO: street address',
    addressLocality: 'London',
    postalCode: 'TODO',
    addressCountry: 'GB',
  },
  social: {
    facebook: 'https://www.facebook.com/hesevenltd/',
    instagram: 'https://www.instagram.com/heseven.ltd/',
    linkedin: 'https://www.linkedin.com/company/heseven',
  },
  ogImage: '/og-default.png',
} as const;
