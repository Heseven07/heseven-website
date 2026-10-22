// Builds the rotating globe texture (src/assets/earth/earth-night.jpg) from NASA's public-domain
// "Black Marble 2016" equirectangular map (brand-source/earth/). Lifts the oceans to heseven's deep blue
// and keeps the city lights warm. Re-run only if the source changes: node scripts/process-earth.mjs
import sharp from 'sharp';

const src = 'brand-source/earth/BlackMarble_2016_01deg.jpg';
const out = 'src/assets/earth/earth-night.jpg';
const W = 2048;
const blue = await sharp({ create: { width: W, height: W / 2, channels: 3, background: '#03123a' } })
  .png()
  .toBuffer();
await sharp(src)
  .resize(W, W / 2)
  .composite([{ input: blue, blend: 'screen' }])
  .linear(1.25, -6)
  .modulate({ saturation: 1.2 })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(out);
console.log('wrote', out);
