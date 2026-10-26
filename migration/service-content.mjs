// Content for the service pages (/services/<handle>, Studio → Service pages) linked from the header's
// Services mega menu. Read by seed-service-content.mjs. British English; claims limited to facts the
// site already states (Shopify Partner since 2018, 1000+ brands, London + 4 time zones, 5.0 rating).
//
// Per page: slug (URL), title, seo, hero, features ("what's included"), approach (rich text,
// "### " = h3, [text](/link) = internal link), steps, faq, related (slugs from PAGES or LINKED).
//
// Services migrated from Shopify keep their /pages/<handle> URL and content (Studio → Landing pages);
// they are never written by the seed — LINKED only lets related cards and links point at them.

export const PAGES = [
  {
    type: 'servicePage',
    slug: 'shopify-web-design',
    title: 'Shopify Web Design',
    seo: {
      title: 'Shopify Web Design Agency | Custom Store Design',
      description:
        'Custom Shopify web design from a Shopify Partner since 2018. On-brand, conversion-led store design that is fast, accessible and easy for your team to edit.',
    },
    hero: {
      eyebrow: 'Shopify web design',
      heading: 'Shopify web design that sells.',
      lead: 'Conversion-led, on-brand Shopify and Shopify Plus stores — designed around your products and customers, built to load fast and easy for your team to edit.',
    },
    features: {
      heading: 'Design that looks premium and performs.',
      items: [
        [
          'sparkles',
          'Custom, on-brand design',
          'Every key template designed for your brand — no themes in disguise.',
        ],
        [
          'target',
          'Conversion-led UX',
          'Product, collection and cart journeys shaped by research and real customer data.',
        ],
        [
          'bolt',
          'Fast by design',
          'Lightweight layouts, optimised imagery and minimal apps, so Core Web Vitals stay green.',
        ],
        [
          'users',
          'Accessible to everyone',
          'Colour contrast, focus states and semantics built to WCAG 2.2 AA from the first wireframe.',
        ],
        [
          'sliders',
          'Easy to edit',
          'Built on Shopify sections and blocks so your team can launch pages without a developer.',
        ],
        [
          'layers',
          'Design system included',
          'Reusable components, type scale and colour tokens documented for future work.',
        ],
      ],
    },
    approach: {
      heading: 'Good-looking is the minimum. Selling is the job.',
      body: '### Research before pixels\nWe start with your analytics, customer reviews and competitors to find where shoppers hesitate. Every design decision traces back to a goal — higher add-to-cart, larger baskets or more repeat orders.\n\n### Mobile first, always\nMost Shopify traffic is mobile, so every template is designed for a thumb first and scaled up to desktop. Navigation, filters and the buy box get the most attention because that is where revenue is won or lost.\n\n### Designed to be built\nOur designers work alongside our [Shopify developers](/pages/shopify-website-development-services), so what you approve is exactly what goes live — fast, accessible and on Online Store 2.0. Already live and want to know what to fix first? Start with a [UX & store audit](/services/shopify-store-audit).',
    },
    steps: [
      ['Discovery', 'Goals, audience, competitors and KPIs agreed in one focused workshop.'],
      [
        'Wireframes',
        'Low-fidelity layouts for the homepage, collection, product and cart to validate structure early.',
      ],
      ['Visual design', 'High-fidelity, on-brand designs for every key template on mobile and desktop.'],
      [
        'Prototype & review',
        'A clickable prototype you can test with real customers before a line of code is written.',
      ],
      ['Handover to build', 'Annotated files and a design system our developers build pixel-perfect.'],
    ],
    faq: [
      [
        'How much does Shopify web design cost?',
        'It depends on the number of unique templates and how custom they are. After a short call we send a fixed quote with a clear scope, so there are no surprises.',
      ],
      [
        'How long does a Shopify store design take?',
        'Most store designs take 3–6 weeks from discovery to approved designs, and a full design-and-build project typically takes 6–10 weeks.',
      ],
      [
        'Do you use a Shopify theme or design from scratch?',
        'Both. We can design a fully custom theme or adapt a premium theme when budget and timeline matter more — we will recommend what fits your goals.',
      ],
      [
        'Will I be able to edit the store myself?',
        'Yes. Everything is built with Shopify sections and blocks, and we hand over a short guide so your team can update content without a developer.',
      ],
      [
        'Can you redesign my existing Shopify store?',
        'Yes. We usually start with an audit of your current store so the redesign fixes real problems and protects what already works, including your SEO.',
      ],
    ],
    related: ['shopify-website-development-services', 'conversion-rate-optimisation', 'shopify-store-audit'],
  },
  {
    type: 'servicePage',
    slug: 'ecommerce-ai-seo',
    title: 'Ecommerce AI SEO',
    seo: {
      title: 'Ecommerce AI SEO | Get Found in ChatGPT & AI Search',
      description:
        'AI SEO for Shopify brands: structured data, product feeds and content that help ChatGPT, Perplexity, Gemini and Google AI Overviews recommend your products.',
    },
    hero: {
      eyebrow: 'Ecommerce AI SEO',
      heading: 'Get recommended by ChatGPT, Perplexity and Google AI.',
      lead: 'Shoppers now ask AI assistants what to buy. We make your Shopify store easy for those assistants to understand, trust and cite.',
    },
    features: {
      heading: 'Make your products easy for AI to recommend.',
      items: [
        [
          'search',
          'AI visibility audit',
          'See how ChatGPT, Perplexity, Gemini and AI Overviews describe your brand and competitors today.',
        ],
        [
          'code',
          'Structured data',
          'Rich Product, Offer, Review and Organization schema so AI can read prices, stock and ratings.',
        ],
        [
          'layers',
          'Product feed quality',
          'Clean titles, attributes and identifiers in your Google Merchant Center and Shopify catalogue.',
        ],
        [
          'sparkles',
          'Answer-ready content',
          'Clear buying guides, comparisons and FAQs written the way people ask questions.',
        ],
        ['globe', 'Brand mentions', 'Reviews, press and trusted third-party sources that AI models rely on.'],
        [
          'report',
          'AI share-of-voice tracking',
          'Regular checks of key prompts to measure how often your brand is recommended.',
        ],
      ],
    },
    approach: {
      heading: 'Search is changing. Your store should be ready.',
      body: '### What is AI SEO?\nAI SEO — also called generative engine optimisation (GEO) — is the work of making your brand and products appear in answers from AI assistants such as ChatGPT, Perplexity, Gemini and Google AI Overviews.\n\n### Built on strong SEO foundations\nAI assistants lean heavily on well-structured, trusted websites. That is why we start with the same foundations as [Shopify SEO](/pages/shopify-seo-services): clean technical setup, complete structured data and fast pages.\n\n### Content that answers real questions\nWe publish clear, factual content that answers the questions shoppers ask before buying — sizing, materials, comparisons and use cases — through our [content & blogging service](/services/ecommerce-content-marketing).',
    },
    steps: [
      [
        'Prompt research',
        'Find the questions and prompts your customers use when shopping in your category.',
      ],
      ['Visibility audit', 'Check how AI assistants answer them today and where competitors are cited.'],
      [
        'Technical & data fixes',
        'Structured data, feeds and crawlability improved for AI and search engines.',
      ],
      ['Content & authority', 'Answer-ready pages published and brand mentions built on trusted sources.'],
      ['Track & iterate', 'Recommendation share measured regularly and the plan refined.'],
    ],
    faq: [
      [
        'What is the difference between SEO and AI SEO?',
        'Traditional SEO aims for rankings in search results. AI SEO aims for your brand to be mentioned and linked in AI-generated answers. They share the same foundations, so we run them together.',
      ],
      [
        'Can you guarantee ChatGPT will recommend my store?',
        'No one controls AI answers, so no guarantees. We improve the signals AI assistants rely on and track how often you are cited over time.',
      ],
      [
        'Does structured data help with AI search?',
        'Yes. Complete product, offer and review schema makes it much easier for AI systems and Google to understand your products, prices and reputation.',
      ],
      [
        'Should I block AI crawlers on my Shopify store?',
        'Usually not if you want to be recommended. We review your robots.txt and decide together which crawlers to allow.',
      ],
      [
        'How do you measure AI SEO results?',
        'We track a fixed set of shopping prompts across major assistants, plus referral traffic from AI tools in your analytics.',
      ],
    ],
    related: ['shopify-seo-services', 'ecommerce-content-marketing', 'shopify-store-audit'],
  },
  {
    type: 'servicePage',
    slug: 'ecommerce-content-marketing',
    title: 'Content & Blogging',
    seo: {
      title: 'Ecommerce Content Marketing & Blogging for Shopify',
      description:
        'Shopify blog and content marketing that ranks and sells: keyword-led articles, buying guides and collection copy written for your customers and search engines.',
    },
    hero: {
      eyebrow: 'Content & blogging',
      heading: 'Articles that rank — and sell.',
      lead: 'Keyword-led blog posts, buying guides and collection copy that bring the right shoppers to your Shopify store and help them choose.',
    },
    features: {
      heading: 'Content with a commercial purpose.',
      items: [
        [
          'search',
          'Keyword & topic strategy',
          'A content plan built on real search demand and mapped to your products.',
        ],
        [
          'sparkles',
          'Blog articles',
          'In-depth, well-researched posts written by specialists in your category.',
        ],
        [
          'target',
          'Buying guides & comparisons',
          'Content that helps shoppers decide — and links straight to the right products.',
        ],
        [
          'layers',
          'Collection & product copy',
          'Unique, helpful copy for the pages that earn the most revenue.',
        ],
        [
          'heart',
          'Your brand voice',
          'A tone of voice guide so every piece sounds like you, not like AI filler.',
        ],
        [
          'report',
          'Performance reporting',
          'Traffic, rankings and assisted revenue tracked for every article.',
        ],
      ],
    },
    approach: {
      heading: 'Every article earns its place.',
      body: '### Written for people, optimised for search\nEach article starts with a search intent and a customer question. We write the most helpful answer we can, then make sure it is structured for Google and AI assistants with clear headings, FAQs and internal links.\n\n### Connected to your products\nGood ecommerce content guides readers to the right collection or product. We link articles to commercial pages so content supports revenue, not just traffic.\n\n### Part of a bigger SEO plan\nContent works best on a technically sound store. It pairs naturally with our [Shopify SEO services](/pages/shopify-seo-services) and helps you appear in AI answers through [ecommerce AI SEO](/services/ecommerce-ai-seo).',
    },
    steps: [
      ['Content audit', 'Review existing posts to update, merge or remove, and find content gaps.'],
      ['Strategy & calendar', 'Topics prioritised by search demand and commercial value.'],
      ['Briefs & writing', 'Detailed briefs, then articles written and edited by specialists.'],
      ['Publish & link', 'Formatted in Shopify with images, schema and internal links.'],
      ['Measure & refresh', 'Performance tracked and top articles refreshed to stay ranked.'],
    ],
    faq: [
      [
        'Does blogging still help Shopify SEO?',
        'Yes. Helpful articles capture searches your product pages cannot, build topical authority and give AI assistants content to cite.',
      ],
      [
        'How many blog posts should my store publish?',
        'Quality beats volume. Most brands see results from 2–6 well-researched pieces a month, plus regular updates to existing content.',
      ],
      [
        'Do you use AI to write the content?',
        'We use AI tools for research support, but every article is written, fact-checked and edited by a person who knows the topic.',
      ],
      [
        'Who approves the content?',
        'You do. Every brief and article is shared for review before it goes live.',
      ],
      [
        'Can you write product descriptions too?',
        'Yes. We write unique product and collection copy, which is often the fastest content win for a Shopify store.',
      ],
    ],
    related: ['shopify-seo-services', 'ecommerce-ai-seo', 'klaviyo-email-marketing'],
  },
  {
    type: 'servicePage',
    slug: 'shopify-paid-ads',
    title: 'Paid Ads',
    seo: {
      title: 'Paid Ads for Shopify | Google, Meta & Shopping Ads',
      description:
        'Paid ads management for Shopify brands across Google, Shopping, Performance Max and Meta — built on clean tracking and measured on profit, not clicks.',
    },
    hero: {
      eyebrow: 'Paid ads',
      heading: 'Ads that pay for themselves.',
      lead: 'Google Shopping, Search, Performance Max and Meta campaigns for Shopify brands — built on accurate tracking and measured on profitable growth.',
    },
    features: {
      heading: 'Full-funnel paid media, managed.',
      items: [
        [
          'search',
          'Google Search & Shopping',
          'High-intent campaigns and a clean product feed in Google Merchant Center.',
        ],
        [
          'trend',
          'Performance Max',
          'Structured asset groups and feed segmentation so automation works for you.',
        ],
        [
          'users',
          'Meta ads',
          'Facebook and Instagram prospecting and retargeting with creative that stops the scroll.',
        ],
        [
          'target',
          'Tracking & attribution',
          'GA4, Google Ads and Meta Conversions API set up correctly on Shopify.',
        ],
        ['sparkles', 'Creative testing', 'A steady rhythm of new ad concepts tested against clear goals.'],
        [
          'report',
          'Profit-first reporting',
          'ROAS, new customer acquisition cost and margin — not just clicks.',
        ],
      ],
    },
    approach: {
      heading: 'Accurate data first, then scale.',
      body: "### Tracking you can trust\nMost ad accounts optimise on broken data. We audit and fix your Shopify tracking — GA4, Google Ads conversions and Meta's Conversions API — before changing a single campaign.\n\n### Feeds and landing pages matter\nShopping ads are only as good as your product feed, and every click lands on your store. We optimise feed titles and attributes and work with our [conversion rate optimisation](/pages/conversion-rate-optimisation) team on the pages your ads send traffic to.\n\n### Growth that compounds\nPaid ads bring customers in; [email & Klaviyo](/services/klaviyo-email-marketing) brings them back. Together they lower your blended acquisition cost over time.",
    },
    steps: [
      ['Account & tracking audit', 'Campaign structure, feed and conversion tracking reviewed and fixed.'],
      ['Strategy', 'Budgets, targets and channel mix set around your margins and goals.'],
      ['Launch', 'Restructured campaigns, new creative and feed improvements rolled out.'],
      ['Optimise weekly', 'Bids, audiences, search terms and creative refined every week.'],
      ['Report monthly', 'Clear reporting on revenue, profit and next month’s plan.'],
    ],
    faq: [
      [
        'Which ad platforms do you manage?',
        'Google Search, Shopping, Performance Max and YouTube, plus Meta (Facebook and Instagram). We recommend the mix that suits your products and budget.',
      ],
      [
        'What budget do I need for paid ads?',
        'It depends on your market and goals. We will recommend a test budget based on your margins and scale it once campaigns prove profitable.',
      ],
      [
        'How quickly will I see results?',
        'Search and Shopping campaigns often show results within weeks. Meta and Performance Max typically need a few weeks of learning before they stabilise.',
      ],
      [
        'Do you create the ad creative?',
        'Yes. We produce static and simple video creative, and brief your team or content creators when needed.',
      ],
      [
        'Do I keep ownership of my ad accounts?',
        'Always. Accounts stay in your name and we work through partner access.',
      ],
    ],
    related: ['conversion-rate-optimisation', 'klaviyo-email-marketing', 'shopify-growth-partnership'],
  },
  {
    type: 'servicePage',
    slug: 'shopify-store-audit',
    title: 'UX & Store Audit',
    seo: {
      title: 'Shopify Store Audit | UX, CRO, SEO & Speed Review',
      description:
        'A Shopify store audit covering UX, conversion, SEO, speed, accessibility and apps — delivered as a prioritised action plan showing what to fix first.',
    },
    hero: {
      eyebrow: 'UX & store audit',
      heading: 'Know exactly what to fix — and in what order.',
      lead: 'An expert review of your Shopify store’s UX, conversion, SEO, speed and apps, delivered as a clear, prioritised action plan.',
    },
    features: {
      heading: 'One audit, every angle.',
      items: [
        [
          'users',
          'UX & usability',
          'Navigation, search, filters and product pages reviewed against ecommerce best practice.',
        ],
        ['target', 'Conversion review', 'Funnel analysis showing where shoppers drop off and why.'],
        ['search', 'SEO health check', 'Indexing, duplicates, structured data and on-page SEO assessed.'],
        [
          'bolt',
          'Speed & Core Web Vitals',
          'The scripts, apps and assets slowing your store, ranked by impact.',
        ],
        ['heart', 'Accessibility', 'Key WCAG issues that block customers and create legal risk.'],
        [
          'report',
          'Prioritised roadmap',
          'Every finding ranked by impact and effort, with a recommended fix.',
        ],
      ],
    },
    approach: {
      heading: 'An audit you can actually act on.',
      body: '### Evidence, not opinions\nWe combine your analytics with expert review and real-device testing, so every recommendation is backed by data and explained in plain English.\n\n### Ranked by impact\nYou get a roadmap — quick wins first, bigger projects after — with effort estimates, so your team or ours can start straight away.\n\n### From findings to results\nAct on the audit with [conversion rate optimisation](/pages/conversion-rate-optimisation), [speed optimisation](/pages/speed-optimization) or [Shopify SEO](/pages/shopify-seo-services). Planning a redesign? The audit becomes the brief for [Shopify web design](/services/shopify-web-design).',
    },
    steps: [
      ['Kickoff', 'Goals, known issues and analytics access agreed.'],
      ['Data review', 'Analytics, funnels and search data analysed.'],
      ['Expert review', 'UX, SEO, speed, accessibility and apps reviewed on real devices.'],
      ['Roadmap', 'Findings prioritised by impact and effort.'],
      ['Walkthrough', 'A live session to explain findings and answer questions.'],
    ],
    faq: [
      [
        'What does a Shopify store audit include?',
        'A review of UX, conversion funnel, SEO, site speed, accessibility, apps and tracking, delivered as a prioritised action plan.',
      ],
      [
        'How long does a Shopify audit take?',
        'Usually around two weeks from kickoff to the walkthrough session.',
      ],
      [
        'What access do you need?',
        'Collaborator access to your Shopify store and read access to analytics and Search Console.',
      ],
      [
        'Do I have to use Heseven to implement the fixes?',
        'No. The roadmap is yours to use with your own team, a freelancer or us.',
      ],
      [
        'Is an audit worth it before a redesign?',
        'Yes. It shows what to keep, what to fix and what to rethink, so the redesign solves real problems and protects your SEO.',
      ],
    ],
    related: ['conversion-rate-optimisation', 'speed-optimization', 'shopify-seo-services'],
  },
  {
    type: 'servicePage',
    slug: 'klaviyo-email-marketing',
    title: 'Email & Klaviyo',
    seo: {
      title: 'Klaviyo Email Marketing for Shopify | Flows & Campaigns',
      description:
        'Klaviyo email and SMS marketing for Shopify brands: automated flows, segmented campaigns, sign-up forms and deliverability, measured on revenue and retention.',
    },
    hero: {
      eyebrow: 'Email & Klaviyo',
      heading: 'Email flows that earn their place in the inbox.',
      lead: 'Klaviyo flows, campaigns and sign-up forms for Shopify brands — designed to grow repeat purchases and customer lifetime value.',
    },
    features: {
      heading: 'Retention marketing, done properly.',
      items: [
        [
          'sliders',
          'Automated flows',
          'Welcome, abandoned cart, browse abandonment, post-purchase and win-back flows.',
        ],
        ['users', 'Segmentation', 'Audiences built on purchase behaviour, engagement and predicted value.'],
        ['sparkles', 'Campaign design', 'On-brand, mobile-first emails with copy that sounds like you.'],
        ['target', 'Sign-up forms', 'Pop-ups and embedded forms that grow your list without hurting UX.'],
        [
          'report',
          'Deliverability',
          'Authentication, list hygiene and sending strategy to stay out of spam.',
        ],
        ['trend', 'SMS', 'Klaviyo SMS added where it suits your customers and margins.'],
      ],
    },
    approach: {
      heading: 'Your most profitable channel, working harder.',
      body: '### Flows first\nAutomated flows run around the clock and usually drive a large share of email revenue. We build and test the core flows before scaling up campaigns.\n\n### Relevant, not relentless\nSegmentation means customers get emails that match what they bought and how engaged they are — which protects deliverability and keeps unsubscribe rates down.\n\n### Connected to your growth\nEmail turns the customers you win through [paid ads](/services/shopify-paid-ads) and [content](/services/ecommerce-content-marketing) into repeat buyers. Want it all run by one team? See our [growth partnership](/services/shopify-growth-partnership).',
    },
    steps: [
      ['Account audit', 'Flows, segments, deliverability and Shopify integration reviewed.'],
      ['Strategy', 'Flow map and campaign calendar built around your customer journey.'],
      ['Build flows', 'Core automations designed, written and launched.'],
      ['Campaigns', 'Regular segmented campaigns planned, designed and sent.'],
      ['Test & report', 'Subject lines, content and timing tested, with monthly revenue reporting.'],
    ],
    faq: [
      [
        'Why use Klaviyo for a Shopify store?',
        'Klaviyo integrates deeply with Shopify, so you can segment and automate on real purchase data such as products bought, order value and predicted next order date.',
      ],
      [
        'Which email flows should every Shopify store have?',
        'At minimum: welcome series, abandoned cart, browse abandonment, post-purchase and win-back. These form the foundation of retention revenue.',
      ],
      [
        'Can you migrate us from Mailchimp or another platform?',
        'Yes. We move your lists, consent data and templates, and rebuild your automations in Klaviyo.',
      ],
      [
        'How often should we send campaigns?',
        'It depends on your audience and product range. We test frequency by segment so engaged customers hear from you more often than less engaged ones.',
      ],
      [
        'Do you also manage SMS?',
        'Yes, through Klaviyo SMS, with consent handled correctly for each market.',
      ],
    ],
    related: ['shopify-paid-ads', 'ecommerce-content-marketing', 'conversion-rate-optimisation'],
  },
  {
    type: 'servicePage',
    slug: 'shopify-growth-partnership',
    title: 'Growth Partnership',
    seo: {
      title: 'Shopify Growth Partnership | Retained Ecommerce Team',
      description:
        'A retained Shopify growth team — strategy, development, CRO, SEO and email — working from one roadmap with clear monthly goals and reporting.',
    },
    hero: {
      eyebrow: 'Growth partnership',
      heading: 'A retained team. One roadmap. Real growth.',
      lead: 'Strategy, development, design, CRO, SEO and email from one Shopify team — working together each month towards the numbers that matter to you.',
    },
    features: {
      heading: 'Everything under one roof.',
      items: [
        [
          'target',
          'Growth strategy',
          'Quarterly goals and a prioritised roadmap tied to revenue and margin.',
        ],
        ['code', 'Development & design', 'New features, landing pages and improvements shipped every month.'],
        ['trend', 'CRO', 'Ongoing research and A/B tests to lift conversion rate and order value.'],
        [
          'search',
          'SEO & content',
          'Technical SEO, content and AI search visibility working in the background.',
        ],
        ['sliders', 'Email & retention', 'Klaviyo flows and campaigns that grow repeat purchases.'],
        ['report', 'One monthly report', 'A single view of what we did, what changed and what is next.'],
      ],
    },
    approach: {
      heading: 'Stop managing five agencies.',
      body: '### One team, joined-up thinking\nWhen development, CRO, SEO and email sit with different suppliers, opportunities fall between the gaps. A single team sees the whole picture and acts on it.\n\n### Priorities, not busywork\nEvery month starts with the roadmap: what will move revenue most, given your goals and budget. Work is planned, shipped and measured in that order.\n\n### Built from proven services\nYour partnership draws on our [CRO](/pages/conversion-rate-optimisation), [Shopify SEO](/pages/shopify-seo-services), [email & Klaviyo](/services/klaviyo-email-marketing) and [Shopify maintenance](/pages/shopify-maintenance-service) teams — scaled to the size of your ambition.',
    },
    steps: [
      ['Growth audit', 'Store, data, channels and team reviewed to find the biggest levers.'],
      ['Roadmap', 'A 90-day plan with clear goals and owners.'],
      ['Monthly sprints', 'Development, CRO, SEO and email work shipped in planned sprints.'],
      ['Measure', 'Results tracked against goals in one shared dashboard.'],
      ['Quarterly review', 'Strategy refreshed based on what worked.'],
    ],
    faq: [
      [
        'What is a Shopify growth partnership?',
        'A monthly retainer where one team handles strategy, development, CRO, SEO and email for your store, working from a shared roadmap.',
      ],
      [
        'Who is it for?',
        'Established Shopify brands that want consistent growth without hiring a full in-house team or coordinating several agencies.',
      ],
      [
        'How is it priced?',
        'A fixed monthly fee based on the services and capacity you need, agreed after the growth audit.',
      ],
      [
        'Can we include our in-house team?',
        'Yes. We often work alongside in-house marketers and developers, filling the gaps in skills or capacity.',
      ],
      [
        'How do you report on progress?',
        'A monthly report and call covering work completed, results against goals and the plan for next month.',
      ],
    ],
    related: ['conversion-rate-optimisation', 'shopify-seo-services', 'klaviyo-email-marketing'],
  },
  {
    type: 'servicePage',
    slug: 'shopify-app-development',
    title: 'Custom App Development',
    seo: {
      title: 'Shopify App Development | Custom & Private Apps',
      description:
        'Custom Shopify app development: private and public apps, Shopify Functions, checkout extensions and integrations, built by a Shopify Partner since 2018.',
    },
    hero: {
      eyebrow: 'Custom app development',
      heading: 'Shopify apps built for how your business actually works.',
      lead: 'Private apps, Shopify Functions, checkout extensions and integrations — for the jobs no app on the App Store does quite right.',
    },
    features: {
      heading: 'Custom functionality, built the Shopify way.',
      items: [
        [
          'code',
          'Private & custom apps',
          'Apps built for your store only, with exactly the features you need and nothing else.',
        ],
        [
          'sliders',
          'Shopify Functions',
          'Custom discounts, shipping, payment and cart rules that run natively and fast.',
        ],
        [
          'target',
          'Checkout extensions',
          'Fields, upsells and branded content in checkout with Checkout UI extensions.',
        ],
        [
          'layers',
          'Integrations',
          'ERP, PIM, 3PL, CRM and marketing tools connected reliably through Shopify’s APIs.',
        ],
        [
          'report',
          'Admin tools',
          'Embedded admin screens that save your team hours of manual work every week.',
        ],
        ['globe', 'Public apps', 'Apps built to Shopify’s standards and ready for review on the App Store.'],
      ],
    },
    approach: {
      heading: 'The right app is often the one you no longer pay for.',
      body: `### Replace, don’t stack
Many stores pay for several apps that each do part of a job and slow the storefront down. A single custom app or Shopify Function can often replace them — faster, cheaper over time and fully under your control.

### Built on Shopify’s modern platform
We build with Shopify’s current tools — the GraphQL Admin API, Functions, App Bridge and theme app extensions — so your app stays fast, secure and upgrade-safe as Shopify evolves.

### Part of the whole store
Apps work best alongside a well-built theme. Pair them with [Shopify development](/pages/shopify-website-development-services), [Shopify Plus](/pages/shopify-plus-development-agency) features or an ongoing [growth partnership](/services/shopify-growth-partnership).`,
    },
    steps: [
      ['Discovery', 'The workflow, data and edge cases mapped, with a clear spec and fixed quote.'],
      ['Architecture', 'APIs, data model, hosting and security planned before any code.'],
      ['Build', 'Development in a dev store with progress you can try every week.'],
      ['Test', 'Real orders, edge cases and load tested before anything reaches your live store.'],
      ['Launch & support', 'Installed, monitored and maintained as Shopify’s APIs change.'],
    ],
    faq: [
      [
        'When do I need a custom Shopify app?',
        'When no App Store app fits your workflow, when you are paying for several apps to do one job, or when you need to connect Shopify to an in-house system.',
      ],
      [
        'What is the difference between a private and a public app?',
        'A custom (private) app is built for one store only. A public app is listed on the Shopify App Store for any merchant to install and must pass Shopify’s review.',
      ],
      [
        'Can a custom app slow my store down?',
        'Not when it is built properly. We use Shopify Functions and theme app extensions, which run natively and load only where needed.',
      ],
      [
        'Who hosts and owns the app?',
        'You own the code. We can host it on your own cloud account or manage hosting for you.',
      ],
      [
        'How long does it take to build a Shopify app?',
        'Small Functions or integrations take a few weeks; larger apps with admin screens typically take 6–12 weeks.',
      ],
    ],
    related: [
      'shopify-website-development-services',
      'shopify-plus-development-agency',
      'shopify-growth-partnership',
    ],
  },
];

// Migrated Shopify service pages (/pages/<handle>) — link targets only.
export const LINKED = [
  {
    slug: 'shopify-website-development-services',
    title: 'Shopify Website Development Services',
    lead: 'Custom Shopify themes, app integrations and headless builds — clean, fast code that your team can edit and your customers will enjoy using.',
  },
  {
    slug: 'shopify-plus-development-agency',
    title: 'Shopify Plus Development Agency',
    lead: 'Checkout extensibility, Shopify Functions, B2B, Markets and automation — built by a team that has shipped Shopify stores since 2018.',
  },
  {
    slug: 'ecommerce-platform-migration-service',
    title: 'eCommerce Platform Migration Service',
    lead: 'Products, customers, orders and rankings — migrated from WooCommerce, Magento, BigCommerce, Wix or a custom platform with a tested plan and zero surprises.',
  },
  {
    slug: 'shopify-seo-services',
    title: 'Shopify SEO Services',
    lead: 'Technical fixes, smarter collection pages, structured data and content that compounds — focused on the searches your buyers actually make.',
  },
  {
    slug: 'conversion-rate-optimisation',
    title: 'Conversion Rate Optimisation',
    lead: 'Research-led UX improvements and A/B tests that turn more of your existing Shopify traffic into customers — without spending more on ads.',
  },
  {
    slug: 'speed-optimization',
    title: 'Speed Optimization',
    lead: 'We find what is slowing your store down — apps, scripts, images and theme code — and fix it, so Core Web Vitals pass and shoppers stop waiting.',
  },
  {
    slug: 'shopify-maintenance-service',
    title: 'Shopify Maintenance Service',
    lead: 'Monthly Shopify maintenance and support — fixes, updates, new features and performance checks — from a team that knows your store.',
  },
  {
    slug: 'virtual-assistant-for-shopify',
    title: 'Virtual Assistant for Shopify',
    lead: 'A trained Shopify virtual assistant for product uploads, orders, customer emails and store housekeeping — so you get your time back for growth.',
  },
  {
    slug: 'white-label-shopify-development',
    title: 'White-label Shopify development',
    lead: 'Senior Shopify developers who build, customise and support stores for your clients, quietly and to your standards.',
  },
];
