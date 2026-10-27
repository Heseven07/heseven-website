// Case studies from "Heseven Casestudies.pdf" (read by seed-case-studies.mjs). Facts come from the PDF
// only — no invented numbers. Images live in data/case-studies/<slug>.jpg and <slug>-mobile.jpg.

export const CASE_STUDIES = [
  {
    slug: 'lifestyle-home-collection',
    client: 'Lifestyle Home Collection',
    website: 'https://www.lifestylehomecollection.org',
    headline: 'A fully bespoke luxury Shopify experience',
    summary:
      'A luxury candle and home fragrance house where detail is everything. We built a bespoke Shopify theme that feels as refined as the products.',
    industry: 'Home & lifestyle',
    platform: 'Shopify',
    services: ['Custom theme', 'Conversion (CRO)', 'Performance'],
    challenge:
      'Lifestyle Home Collection is a luxury candle house where detail and design sit at the heart of the brand. They needed a store that felt as considered as their products — elegant and sophisticated — without sacrificing speed or the ability to grow.',
    solution: [
      [
        'A theme built for the brand',
        'We designed and developed a fully bespoke Shopify theme, tailored precisely to their aesthetic rather than adapted from a template.',
      ],
      [
        'Detail in every interaction',
        'Every layout, interaction and micro-detail was crafted to reflect elegance and sophistication across the store.',
      ],
      [
        'Beauty that still sells',
        'Commercial thinking runs through the design, so the store stays conversion-focused while looking refined.',
      ],
    ],
    highlights: [
      'Bespoke Shopify theme',
      'Custom micro-interactions',
      'Conversion-focused layouts',
      'Built to scale',
    ],
    result:
      'A store that balances beauty with commercial strategy — visually refined, fast and scalable, and designed to turn browsers into customers.',
    accent: 'amber',
    featured: true,
  },
  {
    slug: 'citizenm',
    client: 'CitizenM',
    website: null, // internal platform behind a login
    headline: 'A Shopify Plus stock and supply platform for a global hotel group',
    summary:
      'A secure backend platform on Shopify Plus that runs internal procurement, stock distribution and supply across CitizenM’s hotels.',
    industry: 'Hospitality',
    platform: 'Shopify Plus',
    services: ['Shopify Plus', 'Custom app', 'B2B & wholesale'],
    challenge:
      'CitizenM needed a robust stock and supply management platform to support global hotel operations — handling internal procurement, stock distribution and operational supply across multiple hotel locations.',
    solution: [
      [
        'Built on Shopify Plus',
        'We used Shopify Plus as the foundation for a secure, scalable internal platform tailored to CitizenM’s own workflows.',
      ],
      [
        'Structured stock and ordering',
        'Structured inventory management and streamlined ordering processes make day-to-day supply simple for hotel teams.',
      ],
      [
        'Centralised control',
        'Central control across every location keeps stock and supply consistent throughout the hotel chain.',
      ],
    ],
    highlights: [
      'Internal procurement portal',
      'Multi-location stock distribution',
      'Streamlined ordering',
      'Centralised control',
    ],
    result:
      'A powerful operational backbone that supports daily logistics across the hotel chain, while staying flexible enough to grow with the business.',
    accent: 'violet',
  },
  {
    slug: 'waldo-watches',
    client: 'Waldo Watches',
    website: 'https://waldowatches.com',
    headline: 'A bespoke Shopify build for a premium watch brand',
    summary:
      'A fully custom Shopify theme that brings Waldo’s minimalist identity and craftsmanship online, built to guide customers naturally towards purchase.',
    industry: 'Watches & jewellery',
    platform: 'Shopify',
    services: ['Custom theme', 'Conversion (CRO)', 'Performance'],
    challenge:
      'Waldo Watches needed a digital experience that reflected the precision and craftsmanship of their timepieces — and a store that could support long-term growth.',
    solution: [
      [
        'Custom theme from the ground up',
        'A fully custom Shopify theme, carefully aligned with the brand’s minimalist identity.',
      ],
      [
        'Product storytelling',
        'Refined layouts, considered typography and immersive imagery bring each watch’s story to life.',
      ],
      [
        'A journey towards purchase',
        'Every step of the user journey was structured to elevate perception and guide customers naturally to checkout.',
      ],
    ],
    highlights: [
      'Fully custom theme',
      'Minimalist brand design',
      'Immersive product storytelling',
      'Conversion-focused structure',
    ],
    result:
      'A fast, elegant store built for scale that showcases the brand’s craftsmanship and supports long-term growth through a conversion-focused structure.',
    accent: 'teal',
  },
  {
    slug: 'delli',
    client: 'Delli',
    website: 'https://delli.market',
    headline: 'A custom multi-vendor B2B marketplace on Shopify',
    summary:
      'Custom multi-vendor logic inside Shopify, letting independent makers onboard, manage and sell their products from one unified marketplace.',
    industry: 'Food & drink',
    platform: 'Shopify',
    services: ['Multi-vendor marketplace', 'B2B & wholesale', 'Custom app'],
    challenge:
      'Delli’s marketplace model needed advanced multi-vendor functionality: many suppliers selling through one store, for both retail and wholesale buyers.',
    solution: [
      [
        'Multi-vendor logic in Shopify',
        'We built custom logic that lets multiple suppliers manage and distribute their products within one unified ecosystem.',
      ],
      [
        'Simple on the surface',
        'Complex vendor workflows run behind the scenes while day-to-day operations stay simple.',
      ],
      [
        'Ready for B2B',
        'Structured B2B operations sit alongside retail, inside the same scalable Shopify store.',
      ],
    ],
    highlights: [
      'Vendor onboarding',
      'Flexible product management',
      'Retail and wholesale buying',
      'Unified marketplace',
    ],
    result:
      'A platform with streamlined vendor onboarding, flexible product management and structured B2B operations — all within a scalable Shopify environment.',
    accent: 'lime',
  },
  {
    slug: 'bioenex',
    client: 'Bioenex',
    website: 'https://bioenex.de',
    headline: 'Multi-country Shopify expansion',
    summary:
      'A custom Shopify theme with multi-currency and multi-region selling, tailored shipping logic and a smooth cross-border checkout.',
    industry: 'Home energy',
    platform: 'Shopify',
    services: ['Custom theme', 'Multi-region & currency', 'Performance'],
    challenge:
      'Bioenex needed a scalable Shopify store to support international growth across multiple markets, with the right products, prices and shipping in each one.',
    solution: [
      [
        'Multi-currency, multi-region',
        'A custom theme with multi-currency and multi-region functionality for seamless cross-border transactions.',
      ],
      [
        'Rules per market',
        'Tailored shipping logic and flexible product rules per region keep every market accurate.',
      ],
      [
        'Fast everywhere',
        'Performance was optimised for speed across regions, with a streamlined international checkout.',
      ],
    ],
    highlights: [
      'Multi-currency checkout',
      'Region-specific product rules',
      'Custom shipping logic',
      'Optimised for speed',
    ],
    result: 'A fully scalable, conversion-focused store ready for continued international expansion.',
    accent: 'lime',
  },
  {
    slug: 'powerlete',
    client: 'Powerlete',
    website: 'https://www.powerleteclo.com',
    headline: 'A fully custom Shopify store build',
    summary:
      'Built from scratch around a detailed brief and the owner’s vision — every section custom developed, with conversion at its core.',
    industry: 'Sports & fitness',
    platform: 'Shopify',
    services: ['Custom theme', 'Conversion (CRO)'],
    challenge:
      'Powerlete wanted a store built entirely from scratch, following a detailed project brief and the owner’s clear vision for a bold activewear brand.',
    solution: [
      [
        'Every section custom',
        'Every section was custom developed, from the homepage to product and collection pages.',
      ],
      ['Conversion at the core', 'The structure was designed around conversion from the start.'],
      ['Bold brand, high-performance UX', 'A strong brand identity combined with proven UX principles.'],
    ],
    highlights: [
      'Built from scratch',
      'Custom homepage, product and collection pages',
      'Bold brand identity',
      'Conversion-led structure',
    ],
    result:
      'A powerful ecommerce engine that actively supports the brand’s growth — visually strong and commercially effective.',
    accent: 'pink',
  },
  {
    slug: 'the-wine-caverns',
    client: 'The Wine Caverns',
    website: 'https://thewinecaverns.co.uk',
    headline: 'Shopify theme redesign and performance enhancement',
    summary:
      'A redesign that modernised the storefront, fixed structural issues and improved speed and mobile experience.',
    industry: 'Wine & spirits',
    platform: 'Shopify',
    services: ['Theme redesign', 'Performance', 'Conversion (CRO)'],
    challenge:
      'The Wine Caverns needed to modernise their storefront and resolve existing structural issues in their Shopify theme.',
    solution: [
      [
        'Clearer layout and navigation',
        'We refined the existing theme, improving layout clarity, navigation flow and visual consistency.',
      ],
      [
        'Faster and mobile-ready',
        'Performance and mobile responsiveness were improved for a smooth experience on every device.',
      ],
      [
        'Built on what worked',
        'Refining rather than replacing kept what already worked while fixing what did not.',
      ],
    ],
    highlights: [
      'Theme redesign',
      'Improved navigation',
      'Mobile responsiveness',
      'Performance improvements',
    ],
    result:
      'A cleaner, more reliable online store that reflects the quality of their wines while improving usability and conversion.',
    accent: 'violet',
  },
  {
    slug: 'coyalz-haircare',
    client: 'Coyalz Haircare',
    website: 'https://coyalzhaircare.com',
    headline: 'A modern Shopify store for a growing haircare brand',
    summary:
      'A bespoke, stylish Shopify theme with clean layouts and refined product pages to support a growing product range.',
    industry: 'Beauty & wellness',
    platform: 'Shopify',
    services: ['Custom theme', 'Conversion (CRO)'],
    challenge:
      'Coyalz Haircare needed a stylish, scalable Shopify store to support their growing product range and premium positioning.',
    solution: [
      ['Bespoke theme', 'We developed a bespoke theme with clean layouts and intuitive navigation.'],
      [
        'Refined product pages',
        'Product pages highlight the brand’s premium positioning and make products easy to understand.',
      ],
      ['Effortless browsing', 'A simple structure lets customers browse the range without friction.'],
    ],
    highlights: [
      'Bespoke Shopify theme',
      'Refined product pages',
      'Intuitive navigation',
      'Premium positioning',
    ],
    result: 'A modern, conversion-ready storefront built to support long-term brand expansion.',
    accent: 'pink',
  },
  {
    slug: 'black-sand-distribution',
    client: 'Black Sand Distribution',
    website: 'https://blacksanddistribution.com',
    headline: 'A custom B2B FMCG export platform on Shopify',
    summary:
      'A wholesale platform for global FMCG exporting — large catalogues, trade pricing by buyer and region, and bulk ordering made simple.',
    industry: 'B2B & wholesale',
    platform: 'Shopify',
    services: ['B2B & wholesale', 'Custom app', 'Performance'],
    challenge:
      'Black Sand Distribution needed a B2B platform for their FMCG export operations — able to handle large product catalogues, complex pricing and international trade, while staying simple for wholesale buyers.',
    solution: [
      [
        'Trade pricing logic',
        'Advanced pricing and structured customer segmentation, with visibility and prices controlled by buyer type and region.',
      ],
      [
        'Built for bulk buying',
        'Bulk ordering and account-based purchasing make wholesale orders fast and secure.',
      ],
      [
        'Efficient behind the scenes',
        'Backend efficiency and operational flexibility let the team manage stock, orders and export requirements without unnecessary complexity.',
      ],
    ],
    highlights: [
      'Trade pricing by buyer and region',
      'Customer segmentation',
      'Bulk ordering',
      'Account-based purchasing',
    ],
    result:
      'A robust, scalable B2B platform that supports international growth, simplifies wholesale transactions and strengthens Black Sand’s global exporting capabilities.',
    accent: 'teal',
  },
];

// "Other recent works" from the PDF — link-only entries (no page of their own). Design11 is left out:
// its store was unavailable (closed on Shopify) when this was seeded.
export const RECENT_WORK = [
  ['Omni Creatine', 'https://omnicreatine.com'],
  ['Visore X', 'https://www.visore-x.com'],
  ['LightHub Direct', 'https://www.lighthubdirect.com'],
  ['Kiano Life', 'https://www.kianolife.com'],
  ['WUKA', 'https://wuka.co.uk'],
  ['Sportech Fitness', 'https://sportechfitness.com'],
  ['Lekto Woodfuels', 'https://lektowoodfuels.co.uk'],
  ['O3 Zone', 'https://o3zoneltd.co.uk'],
  ['Vroom Classics', 'https://vroomclassics.com'],
  ['Ornella Gorza', 'https://ornellagorza.com'],
  ['Soru Jewellery', 'https://www.sorujewellery.com'],
  ['Aquadoc', 'https://www.mavaquadoc.com'],
  ['Caorunn Gin', 'https://shop.caorunngin.com'],
  ['New England Design', 'https://www.newenglanddesign.co.uk'],
  ['Coppolini', 'https://www.coppolini.ch'],
  ['The Fine Wine Company', 'https://www.thefinewinecompany.co.uk'],
  ['Angela Evans', 'https://www.angela-evans.co.uk'],
  ['Balance Addicts', 'https://balanceaddicts.com'],
  ['Hyvida', 'https://hyvida.com'],
  ['Pure Velvet Extracts', 'https://www.purevelvetextracts.com'],
  ['AimShop', 'https://www.aimshop.com'],
  ['Snatchd', 'https://snatchd.co.uk'],
];
