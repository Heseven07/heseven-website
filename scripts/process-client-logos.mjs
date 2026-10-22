// Prepares the client logos (brand-source/client-logos/*.png, from heseven.com) for the logo marquee:
// keeps their ORIGINAL colours, only trims empty space and resizes to 96px tall (2x for 48px display).
// Output: src/assets/clients/<slug>.png
// Usage: node scripts/process-client-logos.mjs
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'brand-source/client-logos';
const OUT = 'src/assets/clients';
const HEIGHT = 96;

for (const file of fs.readdirSync(SRC).filter((f) => f.endsWith('.png'))) {
  await sharp(path.join(SRC, file))
    .ensureAlpha()
    .trim({ threshold: 1 })
    .resize({ height: HEIGHT })
    .png()
    .toFile(path.join(OUT, file));
  const meta = await sharp(path.join(OUT, file)).metadata();
  console.log(file.padEnd(24), `${meta.width}x${meta.height}`);
}
