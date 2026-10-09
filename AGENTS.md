## Project

Heseven agency website — static Astro 7 + Tailwind v4, Cloudflare Pages. Hard requirement: Lighthouse 100 on mobile and desktop. Read README.md "Performance rules" before adding anything.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Before committing: `npm run build && npm run lint && npm test && npm run lighthouse`.

## Documentation

Full documentation: https://docs.astro.build

- [Routing](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling / Tailwind](https://docs.astro.build/en/guides/styling/)
- [Fonts](https://docs.astro.build/en/guides/fonts/)
