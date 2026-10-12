// Generates placeholder case-study images into src/assets/work/.
// Replace each file with the real screenshot (same filename) when assets arrive.
// Usage: node scripts/generate-placeholders.mjs
import sharp from 'sharp';

const items = [
  ['powerlete', '#2a1f5c', '#8b6cff'],
  ['vroom-classic', '#3a1420', '#ff6b6b'],
  ['caorunn-gin', '#0f2e2a', '#5ee6c4'],
  ['ornellagorza', '#2e2410', '#f3c76b'],
  ['aquadoc', '#0d2238', '#5bb8ff'],
  ['waldo-watch', '#1c1c22', '#b5f36b'],
];

for (const [slug, bg, accent] of items) {
  const label = slug.replace(/-/g, ' ').toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900">
    <defs><radialGradient id="g" cx="75%" cy="20%" r="85%"><stop offset="0" stop-color="${accent}" stop-opacity=".55"/><stop offset="1" stop-color="${bg}"/></radialGradient></defs>
    <rect width="1200" height="900" fill="${bg}"/><rect width="1200" height="900" fill="url(#g)"/>
    <rect x="140" y="140" width="920" height="620" rx="28" fill="#0b0a10" fill-opacity=".55" stroke="#fff" stroke-opacity=".12"/>
    <rect x="190" y="200" width="380" height="26" rx="13" fill="#fff" fill-opacity=".85"/>
    <rect x="190" y="250" width="260" height="16" rx="8" fill="#fff" fill-opacity=".35"/>
    <rect x="190" y="320" width="820" height="380" rx="18" fill="${accent}" fill-opacity=".25"/>
    <text x="600" y="530" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="56" fill="#fff" fill-opacity=".9">${label}</text>
  </svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toFile(`src/assets/work/${slug}.jpg`);
}
console.log('placeholders written');
