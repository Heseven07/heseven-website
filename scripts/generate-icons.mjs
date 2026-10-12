// Regenerates favicons, app icons, schema logo and the default OG image from the
// original brand files in brand-source/ (taken from heseven.com).
// Usage: npm run icons
import sharp from 'sharp';

const root = process.cwd();
const ICON = `${root}/brand-source/heseven-icon-color.png`; // black + teal mark, transparent
const MARK_WHITE = `${root}/src/assets/brand/heseven-mark-white.png`;
const out = (f) => `${root}/public/${f}`;

/** Colour mark centred on a white rounded tile (readable on light and dark tab bars). */
async function tile(size, { radius = 0.22, pad = 0.16 } = {}) {
  const inner = Math.round(size * (1 - pad * 2));
  const mark = await sharp(ICON)
    .resize(inner, inner, { fit: 'contain', background: '#0000' })
    .png()
    .toBuffer();
  const r = Math.round(size * radius);
  const bg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" fill="#fff"/></svg>`,
  );
  return sharp(bg)
    .composite([{ input: mark, gravity: 'center' }])
    .png();
}

await (await tile(32, { pad: 0.08, radius: 0.18 })).toFile(out('favicon-32.png'));
await (await tile(48, { pad: 0.08, radius: 0.18 })).toFile(out('favicon.ico')); // PNG-in-ICO, supported by all browsers
await (await tile(180, { radius: 0 })).toFile(out('apple-touch-icon.png')); // iOS rounds corners itself
await (await tile(192)).toFile(out('icon-192.png'));
await (await tile(512)).toFile(out('icon-512.png'));
await (await tile(512, { radius: 0, pad: 0.1 })).toFile(out('logo.png')); // schema.org Organization logo

// Default social share image (1200×630)
const mark = await sharp(MARK_WHITE).resize({ height: 300 }).png().toBuffer();
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><radialGradient id="g" cx="85%" cy="5%" r="95%"><stop offset="0" stop-color="#5a3fd1"/><stop offset="1" stop-color="#0b0a10"/></radialGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="80" y="250" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="76" fill="#f5f4f9">Your <tspan fill="#b5f36b">Shopify</tspan></text>
  <text x="80" y="340" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="76" fill="#f5f4f9">growth partner</text>
  <text x="80" y="450" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#a9a5b8">Shopify Plus Partner · heseven.com</text>
</svg>`;
await sharp(Buffer.from(og))
  .composite([{ input: mark, top: 165, left: 1200 - 80 - Math.round((488 / 456) * 300) }])
  .png()
  .toFile(out('og-default.png'));

console.log('icons + og-default regenerated');
