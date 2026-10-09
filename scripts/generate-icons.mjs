import sharp from 'sharp';
import { readFileSync } from 'node:fs';
// Regenerates PNG icons + default OG image from public/favicon.svg.
// Usage: npm run icons
const root = process.cwd();
const svg = readFileSync(`${root}/public/favicon.svg`);
await sharp(svg, { density: 600 }).resize(180, 180).png().toFile(`${root}/public/apple-touch-icon.png`);
await sharp(svg, { density: 600 }).resize(192, 192).png().toFile(`${root}/public/icon-192.png`);
await sharp(svg, { density: 600 }).resize(512, 512).png().toFile(`${root}/public/icon-512.png`);
await sharp(svg, { density: 600 }).resize(512, 512).png().toFile(`${root}/public/logo.png`);
await sharp(svg, { density: 300 }).resize(32, 32).png().toFile(`${root}/public/favicon-32.png`);
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><radialGradient id="g" cx="80%" cy="10%" r="90%"><stop offset="0" stop-color="#5a3fd1"/><stop offset="1" stop-color="#0b0a10"/></radialGradient></defs><rect width="1200" height="630" fill="url(#g)"/><text x="80" y="300" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="84" fill="#f5f4f9">Your <tspan fill="#b5f36b">Shopify</tspan></text><text x="80" y="400" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="84" fill="#f5f4f9">Growth Partner</text><text x="80" y="520" font-family="Helvetica, Arial, sans-serif" font-size="32" fill="#a9a5b8">heseven.com</text></svg>`;
await sharp(Buffer.from(og)).png().toFile(`${root}/public/og-default.png`);
