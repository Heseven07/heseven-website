// Extra sections for the /services pages (read by seed-service-content.mjs), keyed by slug:
//   fit       "Is this right for you?" — good-fit and not-yet points
//   pitfalls  [title, what goes wrong, how we avoid it]
//   compare   comparison table (right column is highlighted)
//   plans     ways to work together: [badge, title, body, [included…]]
//   guides    existing blog posts to link (/blogs/news/<handle>) — never new or changed URLs
// British English; no prices or results we cannot back up.

export const EXTRAS = {
  'shopify-web-design': {
    fit: {
      good: [
        'Your store looks dated next to competitors, or no longer matches your brand',
        'Traffic is healthy but too few visitors add to cart',
        'You are launching a new brand or range and want it right first time',
        'Your team struggles to update pages without a developer',
      ],
      notYet: [
        'The store converts well and only needs a few small tweaks',
        'You have not validated the product yet — start lean and redesign later',
        'You need a new logo and brand identity first',
      ],
    },
    pitfalls: [
      [
        'Designing on desktop first',
        'Most Shopify traffic is mobile, yet designs are often approved on a big screen and squeezed down later.',
        'Every template is designed for a phone first, then scaled up.',
      ],
      [
        'Beautiful but slow',
        'Autoplay video, oversized images and stacks of apps can wipe out the gains of a new design.',
        'Performance budgets are set at wireframe stage and checked before launch.',
      ],
      [
        'Redesigning away what already worked',
        'A fresh look can quietly remove the trust signals and content that were driving sales and rankings.',
        'We audit the current store first, so the redesign keeps what earns money.',
      ],
      [
        'A design your team cannot edit',
        'Hard-coded layouts mean every banner change becomes a developer ticket.',
        'Everything is built from Shopify sections and blocks your team controls.',
      ],
      [
        'Forgetting accessibility',
        'Low contrast and missing focus states lock out customers and create legal risk.',
        'Designs are checked against WCAG 2.2 AA before handover.',
      ],
      [
        'No plan for launch day',
        'Redirects, tracking and app settings get missed when a new theme goes live.',
        'A launch checklist covers redirects, analytics and checkout testing.',
      ],
    ],
    compare: {
      heading: 'Off-the-shelf theme or custom design?',
      lead: 'A premium theme is a sensible start. A custom design pays off when your brand and range need more.',
      leftLabel: 'Off-the-shelf theme',
      rightLabel: 'Custom design with Heseven',
      rows: [
        ['Look and feel', 'Shared with thousands of other stores', 'Built around your brand and products'],
        ['Conversion', 'Generic layouts', 'Product, collection and cart journeys shaped by your data'],
        ['Speed', 'Features you do not use still load', 'Only what you need, with a performance budget'],
        ['Editing', 'Limited to the theme’s sections', 'Custom sections designed for your campaigns'],
        ['Time to launch', 'Days to weeks', 'Typically 6–10 weeks for design and build'],
      ],
    },
    plans: [
      [
        'Audit',
        'Design audit',
        'A review of your current store with a prioritised list of design fixes.',
        ['UX and conversion review', 'Mobile walkthrough', 'Prioritised recommendations'],
      ],
      [
        'Project',
        'Store design & build',
        'Full custom design, built on Shopify and launched by the same team.',
        ['Discovery and wireframes', 'Custom design system', 'Build, QA and launch'],
      ],
      [
        'Monthly',
        'Design retainer',
        'Ongoing design for campaigns, landing pages and new features.',
        ['Landing pages and banners', 'New sections as you grow', 'A named designer'],
      ],
    ],
    guides: [
      ['Is your Shopify store design holding you back?', 'shopify-store-design-services'],
      [
        'Why invest in professional Shopify store design',
        'why-your-shopify-store-needs-a-professional-design-upgrade-right-now',
      ],
      ['Custom vs free Shopify themes', 'shopify-custom-theme-development-explained'],
    ],
  },

  'ecommerce-ai-seo': {
    fit: {
      good: [
        'Customers in your category already ask ChatGPT or Perplexity what to buy',
        'Competitors are being recommended by AI assistants and you are not',
        'You have good products and reviews, but thin product data online',
        'You already invest in SEO and want it to cover AI search too',
      ],
      notYet: [
        'Your store has basic technical SEO problems that need fixing first',
        'You have very few reviews or third-party mentions yet',
        'You need sales next week — AI visibility builds over months',
      ],
    },
    pitfalls: [
      [
        'Treating AI SEO as a separate trick',
        'Chasing prompts without solid SEO foundations rarely lasts.',
        'We build on technical SEO, structured data and content together.',
      ],
      [
        'Incomplete product data',
        'Missing prices, stock, materials or sizes make products hard for AI to recommend.',
        'Product schema and feed attributes are completed and kept in sync.',
      ],
      [
        'Blocking the crawlers that cite you',
        'A blanket robots.txt block can remove your store from AI answers.',
        'We review which crawlers to allow, together with you.',
      ],
      [
        'Vague, salesy copy',
        'AI assistants cite clear, factual answers, not slogans.',
        'Key pages get plain-English answers to real buying questions.',
      ],
      [
        'Ignoring what others say about you',
        'AI leans on reviews, press and forums as much as your own site.',
        'We build mentions on trusted third-party sources.',
      ],
      [
        'No way to measure it',
        'Without tracking, nobody knows whether anything changed.',
        'A fixed set of shopping prompts is checked regularly across assistants.',
      ],
    ],
    compare: {
      heading: 'Traditional SEO and AI SEO, side by side.',
      lead: 'They share the same foundations, which is why we run them together.',
      leftLabel: 'Traditional SEO',
      rightLabel: 'AI SEO (GEO)',
      rows: [
        ['Goal', 'Rank in search results', 'Be named and linked in AI answers'],
        ['Where it shows', 'Google and Bing results pages', 'ChatGPT, Perplexity, Gemini, AI Overviews'],
        [
          'What matters most',
          'Keywords, links and technical health',
          'Clear facts, structured data and trusted mentions',
        ],
        ['Content style', 'Pages targeting keywords', 'Direct answers to buying questions'],
        [
          'How it is measured',
          'Rankings and organic traffic',
          'Citations, share of recommendations, AI referrals',
        ],
      ],
    },
    plans: [
      [
        'Audit',
        'AI visibility audit',
        'See how AI assistants describe you and your competitors today.',
        ['Prompt research', 'Citation check across assistants', 'Prioritised action plan'],
      ],
      [
        'Project',
        'AI-ready store',
        'Structured data, feeds and key content fixed in one focused project.',
        ['Product and organisation schema', 'Feed clean-up', 'Answer-ready key pages'],
      ],
      [
        'Monthly',
        'Ongoing AI SEO',
        'Content, mentions and tracking month after month, alongside your SEO.',
        ['New answer content', 'Third-party mentions', 'Regular visibility reports'],
      ],
    ],
    guides: [
      ['What’s new in Shopify ecommerce development', 'what-s-new-in-shopify-ecommerce-development-for-2025'],
      ['How to optimise page loading speed', 'how-to-optimise-page-loading-speed'],
      ['Why upgrade to Online Store 2.0', 'upgrade-to-shopify-online-store-2-0-in-the-uk'],
    ],
  },

  'ecommerce-content-marketing': {
    fit: {
      good: [
        'People search for advice in your category before they buy',
        'Your blog is quiet, or full of posts that bring no traffic',
        'Collection and product pages have thin or duplicate copy',
        'You want organic growth that keeps paying back after ads stop',
      ],
      notYet: [
        'Your store has unresolved technical SEO issues',
        'You need sales this month — content compounds over months',
        'Nobody on your side can review content for accuracy',
      ],
    },
    pitfalls: [
      [
        'Writing about what you want to say',
        'Topics chosen without search data rarely find readers.',
        'Every brief starts from real search demand and buyer questions.',
      ],
      [
        'Articles that never link to products',
        'Traffic arrives, reads and leaves without seeing what you sell.',
        'Each article links naturally to the right collections and products.',
      ],
      [
        'Publishing unedited AI text',
        'Generic copy damages trust and gives AI assistants nothing to cite.',
        'Specialists write and fact-check every piece; AI only supports research.',
      ],
      [
        'Two pages fighting for one keyword',
        'Overlapping posts split rankings between them.',
        'A keyword map gives each topic one clear owner page.',
      ],
      [
        'Publish and forget',
        'Old posts slowly lose rankings as facts and competitors change.',
        'Top articles are refreshed on a schedule.',
      ],
      [
        'Measuring only page views',
        'Traffic alone hides whether content helps sales.',
        'We report on rankings, traffic and assisted revenue.',
      ],
    ],
    compare: {
      heading: 'Content that ranks versus content that just fills a blog.',
      leftLabel: 'Typical blog content',
      rightLabel: 'Heseven content',
      rows: [
        ['Topic choice', 'Ideas and trends', 'Search demand mapped to your products'],
        ['Writing', 'Generic, often AI-generated', 'Written and fact-checked by specialists'],
        ['Links', 'Few or none to products', 'Linked to the right collections and products'],
        ['Structure', 'Long paragraphs', 'Clear headings, FAQs and answer boxes'],
        ['After publishing', 'Left alone', 'Measured and refreshed'],
      ],
    },
    plans: [
      [
        'Audit',
        'Content audit',
        'What to keep, merge, update or remove — and where the gaps are.',
        ['Existing content review', 'Keyword gap analysis', 'Content roadmap'],
      ],
      [
        'Project',
        'Content sprint',
        'A focused batch of cornerstone pages and articles.',
        ['Buying guides and comparisons', 'Collection copy', 'Internal linking'],
      ],
      [
        'Monthly',
        'Content programme',
        'A steady flow of articles and refreshes, every month.',
        ['Monthly briefs and articles', 'Refreshes of top posts', 'Performance reporting'],
      ],
    ],
    guides: [
      ['How to build a clothing ecommerce website', 'clothing-ecommerce-website-how-to-build'],
      ['Cosmetics ecommerce websites', 'cosmetics-ecommerce-websites'],
      ['Health and wellness ecommerce in 2026', 'health-and-wellness-ecommerce-in-2026'],
    ],
  },

  'shopify-paid-ads': {
    fit: {
      good: [
        'You have products with healthy margins and want to scale',
        'Your ads spend is growing but profit is not',
        'You are unsure whether your tracking is accurate',
        'You want Google and Meta managed by one team',
      ],
      notYet: [
        'Your store converts poorly — fix that first or ads will leak money',
        'Margins are too thin to pay for customer acquisition',
        'You cannot commit a test budget for a few months',
      ],
    },
    pitfalls: [
      [
        'Optimising on broken tracking',
        'Duplicate or missing conversions teach the algorithms the wrong lessons.',
        'GA4, Google Ads and Meta Conversions API are audited and fixed first.',
      ],
      [
        'Chasing ROAS instead of profit',
        'A high ROAS on repeat customers can hide expensive new-customer growth.',
        'We report on margin and new-customer cost, not just ROAS.',
      ],
      [
        'A messy product feed',
        'Poor titles and missing attributes hold Shopping and Performance Max back.',
        'Feed titles, attributes and exclusions are optimised.',
      ],
      [
        'Running the same creative for months',
        'Ad fatigue quietly pushes costs up.',
        'New creative is tested on a steady rhythm.',
      ],
      [
        'Sending traffic to weak pages',
        'Ads cannot fix a slow or confusing landing page.',
        'We work with our CRO team on the pages ads point to.',
      ],
      [
        'No plan for returning customers',
        'Paying again and again to reach your own customers.',
        'Email and retention bring them back at a fraction of the cost.',
      ],
    ],
    compare: {
      heading: 'What changes when ads are run for profit.',
      leftLabel: 'Typical ad management',
      rightLabel: 'Heseven paid ads',
      rows: [
        ['Starting point', 'Launch campaigns straight away', 'Fix tracking and feed first'],
        ['Main metric', 'ROAS or clicks', 'Profit and new-customer cost'],
        ['Creative', 'Occasional refresh', 'Regular testing rhythm'],
        ['Landing pages', 'Not their job', 'Improved with our CRO team'],
        ['Reporting', 'Platform dashboards', 'Plain-English monthly report and plan'],
      ],
    },
    plans: [
      [
        'Audit',
        'Ads & tracking audit',
        'Account structure, feed and tracking reviewed with clear fixes.',
        ['Conversion tracking check', 'Account structure review', 'Feed health check'],
      ],
      [
        'Project',
        'Account rebuild',
        'Campaigns, feed and tracking rebuilt properly in one go.',
        ['New campaign structure', 'Feed optimisation', 'Tracking fixes'],
      ],
      [
        'Monthly',
        'Managed paid media',
        'Ongoing management of Google and Meta with weekly optimisation.',
        ['Weekly optimisation', 'Creative testing', 'Monthly reporting'],
      ],
    ],
    guides: [
      ['How to improve your conversion rate on Shopify', 'how-to-improve-your-conversion-rate'],
      [
        'Is your store optimised for conversions?',
        'shopify-store-design-services-that-help-you-sell-more-online',
      ],
      ['How to optimise page loading speed', 'how-to-optimise-page-loading-speed'],
    ],
  },

  'shopify-store-audit': {
    fit: {
      good: [
        'Sales have stalled and you are not sure why',
        'You are planning a redesign or migration and want a clear brief',
        'You have inherited a store from another agency',
        'You want an outside view before investing more',
      ],
      notYet: [
        'You already know exactly what to fix — go straight to the work',
        'The store is brand new with little data to analyse',
        'You need someone to implement today, not a plan',
      ],
    },
    pitfalls: [
      [
        'Audits that only list problems',
        'Fifty issues without priorities leave you stuck.',
        'Every finding is ranked by impact and effort.',
      ],
      [
        'Relying on automated scores',
        'Tools miss context, like why customers actually hesitate.',
        'Expert review on real devices backs up every tool.',
      ],
      [
        'Ignoring the app stack',
        'Unused apps cost money and slow the store down.',
        'Every app is reviewed for cost, speed and purpose.',
      ],
      [
        'Missing the SEO basics',
        'Duplicate URLs and indexing problems hide good pages from Google.',
        'Indexing, schema and on-page SEO are part of every audit.',
      ],
      [
        'Findings nobody can act on',
        'Jargon-heavy reports end up in a drawer.',
        'A walkthrough session explains every recommendation.',
      ],
    ],
    compare: {
      heading: 'A free scan versus a proper audit.',
      leftLabel: 'Automated scan',
      rightLabel: 'Heseven store audit',
      rows: [
        [
          'What it checks',
          'A handful of technical scores',
          'UX, conversion, SEO, speed, accessibility and apps',
        ],
        ['Context', 'None — same advice for every store', 'Based on your analytics and customers'],
        ['Priorities', 'Long unranked list', 'Ranked by impact and effort'],
        ['Output', 'A score', 'A roadmap you can act on'],
        ['Support', 'Self-serve', 'Live walkthrough with the team'],
      ],
    },
    plans: [
      [
        'Fixed fee',
        'Store audit',
        'A complete review with a prioritised roadmap.',
        ['UX and conversion', 'SEO and speed', 'Walkthrough session'],
      ],
      [
        'Project',
        'Audit and fix',
        'The audit, then our team implements the top fixes.',
        ['Everything in the audit', 'Quick wins implemented', 'Before-and-after check'],
      ],
      [
        'Monthly',
        'Audit into growth',
        'Start with the audit and keep improving month by month.',
        ['Quarterly re-audits', 'Monthly improvements', 'Progress reporting'],
      ],
    ],
    guides: [
      ['How to improve your conversion rate on Shopify', 'how-to-improve-your-conversion-rate'],
      ['How to optimise page loading speed', 'how-to-optimise-page-loading-speed'],
      ['Why upgrade to Online Store 2.0', 'upgrade-to-shopify-online-store-2-0-in-the-uk'],
    ],
  },

  'klaviyo-email-marketing': {
    fit: {
      good: [
        'You have a growing list but email drives little revenue',
        'Your flows were set up years ago and never revisited',
        'You rely on discounts to get people to buy again',
        'You are moving to Klaviyo from another platform',
      ],
      notYet: [
        'You have almost no customers or subscribers yet',
        'You cannot commit to sending regular campaigns',
        'You only need a single newsletter template',
      ],
    },
    pitfalls: [
      [
        'Campaigns before flows',
        'Weekly newsletters get all the attention while automated flows sit broken.',
        'Core flows are built and tested first.',
      ],
      [
        'One message for everyone',
        'Sending the same email to every subscriber hurts engagement and deliverability.',
        'Segments are built on behaviour and purchase history.',
      ],
      [
        'Discounting by default',
        'Training customers to wait for a code erodes margin.',
        'Flows lead with value, with discounts used deliberately.',
      ],
      [
        'Ignoring deliverability',
        'Without authentication and list hygiene, emails land in spam.',
        'Authentication, sunsetting and sending strategy are set up properly.',
      ],
      [
        'Pop-ups that annoy',
        'Aggressive sign-up forms grow the list but hurt the store experience.',
        'Forms are timed and targeted to stay helpful.',
      ],
    ],
    compare: {
      heading: 'Newsletter-only email versus flow-led retention.',
      leftLabel: 'Newsletter-only',
      rightLabel: 'Flow-led retention',
      rows: [
        ['Revenue source', 'Mostly one-off campaigns', 'Automated flows plus campaigns'],
        ['Targeting', 'Whole list', 'Segments by behaviour and value'],
        ['Discounts', 'Frequent', 'Used deliberately'],
        ['Deliverability', 'Left to chance', 'Monitored and protected'],
        ['Reporting', 'Opens and clicks', 'Revenue and repeat purchase rate'],
      ],
    },
    plans: [
      [
        'Audit',
        'Klaviyo audit',
        'Your flows, segments and deliverability reviewed.',
        ['Flow gap analysis', 'Deliverability check', 'Prioritised fixes'],
      ],
      [
        'Project',
        'Flow build',
        'The core automations designed, written and launched.',
        ['Welcome and abandonment flows', 'Post-purchase and win-back', 'Sign-up forms'],
      ],
      [
        'Monthly',
        'Managed email & SMS',
        'Campaigns, testing and reporting every month.',
        ['Campaign calendar', 'A/B testing', 'Monthly revenue report'],
      ],
    ],
    guides: [
      ['How to improve your conversion rate on Shopify', 'how-to-improve-your-conversion-rate'],
      ['Shopify support and maintenance services', 'shopify-support-and-maintenance-services-for-growth'],
      ['Why growing brands need a Shopify Plus agency', 'shopify-plus-ecommerce-agency-scale-your-brand'],
    ],
  },

  'shopify-growth-partnership': {
    fit: {
      good: [
        'You are an established brand ready for steady month-on-month growth',
        'You are tired of coordinating several freelancers and agencies',
        'You have no in-house ecommerce team, or a small one that needs support',
        'You want one roadmap and one report',
      ],
      notYet: [
        'You need a single one-off project — a fixed scope suits better',
        'The store is not live yet',
        'You want to manage every task yourself',
      ],
    },
    pitfalls: [
      [
        'Too many suppliers',
        'Development, SEO, ads and email agencies rarely talk to each other.',
        'One team works from one shared roadmap.',
      ],
      [
        'Busywork instead of priorities',
        'Retainers drift into small tasks that do not move revenue.',
        'Each month starts with the roadmap and the biggest levers.',
      ],
      [
        'No clear goals',
        'Without targets, nobody knows whether the work is working.',
        'Quarterly goals tied to revenue and margin.',
      ],
      [
        'Reports nobody reads',
        'Pages of charts hide what actually changed.',
        'One short monthly report: what we did, what changed, what is next.',
      ],
      [
        'Losing knowledge when people change',
        'Every new freelancer starts from scratch.',
        'A stable team and documented store.',
      ],
    ],
    compare: {
      heading: 'Several agencies, or one growth team?',
      leftLabel: 'Several agencies',
      rightLabel: 'Heseven growth partnership',
      rows: [
        ['Strategy', 'Each supplier has its own', 'One shared roadmap'],
        ['Coordination', 'Your job', 'Ours'],
        ['Priorities', 'Whatever each scope says', 'Whatever moves revenue most'],
        ['Reporting', 'Several reports in different formats', 'One monthly report'],
        ['Knowledge of your store', 'Spread thin', 'One team that knows it end to end'],
      ],
    },
    plans: [
      [
        'Fixed fee',
        'Growth audit',
        'Find the biggest levers across store, data and channels.',
        ['Store and data review', 'Channel review', '90-day roadmap'],
      ],
      [
        'Monthly',
        'Growth partnership',
        'A retained team shipping development, CRO, SEO and email each month.',
        ['Monthly sprints', 'Shared dashboard', 'Quarterly strategy review'],
      ],
      [
        'Advisory',
        'Senior advice',
        'Strategy and reviews for brands with their own in-house team.',
        ['Monthly strategy call', 'Roadmap reviews', 'On-call advice'],
      ],
    ],
    guides: [
      [
        'Is a Shopify website development agency the upgrade you need?',
        'best-shopify-website-development-agency-for-growth',
      ],
      ['Why growing brands need a Shopify Plus agency', 'shopify-plus-ecommerce-agency-scale-your-brand'],
      ['How to improve your conversion rate on Shopify', 'how-to-improve-your-conversion-rate'],
    ],
  },
  'shopify-app-development': {
    fit: {
      good: [
        'You pay for several apps that together still do not fit your workflow',
        'Your team repeats the same manual task in the admin every day',
        'You need Shopify connected to an ERP, PIM or in-house system',
        'You need custom discount, shipping or checkout logic',
      ],
      notYet: [
        'A well-reviewed App Store app already does the job',
        'The process itself is still changing week to week',
        'You have no budget for ongoing maintenance as APIs change',
      ],
    },
    pitfalls: [
      [
        'Building what an app already does',
        'Custom code for a solved problem costs more to build and maintain.',
        'We check the App Store and native features before writing code.',
      ],
      [
        'Apps that slow the storefront',
        'Script-heavy apps add seconds to every page.',
        'Functions and theme app extensions load only where needed.',
      ],
      [
        'Fragile integrations',
        'Sync jobs that fail silently leave stock and orders wrong.',
        'Retries, logging and alerts are built in from day one.',
      ],
      [
        'Ignoring API versions',
        'Shopify retires API versions regularly, and old apps break.',
        'Apps are kept on supported versions as part of support.',
      ],
      [
        'No owner after launch',
        'Nobody knows how the app works when something changes.',
        'You get documentation, the code and a team that knows it.',
      ],
    ],
    compare: {
      heading: 'An App Store app or a custom app?',
      lead: 'Off-the-shelf is usually the right start. Custom wins when the fit, cost or speed is wrong.',
      leftLabel: 'App Store app',
      rightLabel: 'Custom app by Heseven',
      rows: [
        ['Fit', 'Built for thousands of stores', 'Built around your exact workflow'],
        ['Cost over time', 'Monthly fees that grow with you', 'One build, then maintenance'],
        ['Speed', 'Often loads scripts on every page', 'Native Functions and extensions'],
        ['Data', 'Stored on the vendor’s servers', 'Stays in your Shopify or your cloud'],
        ['Changes', 'Feature requests to a vendor', 'Your roadmap, your priorities'],
      ],
    },
    plans: [
      [
        'Fixed fee',
        'App & workflow audit',
        'Your app stack and manual workflows reviewed for what to replace or automate.',
        ['App stack review', 'Workflow mapping', 'Build or buy recommendations'],
      ],
      [
        'Project',
        'Custom app build',
        'Spec, build, test and launch of your app or integration.',
        ['Technical spec', 'Build and testing', 'Launch and handover'],
      ],
      [
        'Monthly',
        'App care',
        'Hosting, monitoring, API upgrades and new features.',
        ['Monitoring and alerts', 'API version upgrades', 'Feature development'],
      ],
    ],
    guides: [
      ['What’s new in Shopify ecommerce development', 'what-s-new-in-shopify-ecommerce-development-for-2025'],
      [
        'Shopify development solutions for scalable stores',
        'professional-shopify-development-solutions-services',
      ],
      ['Why growing brands need a Shopify Plus agency', 'shopify-plus-ecommerce-agency-scale-your-brand'],
    ],
  },
};
