import { imageUrl, type SanityImage } from './sanity';

/** Shared by <SanityImage> and <PreloadSanityImage> so both resolve to the exact same image URLs. */
export function sanityImageOptions(image: SanityImage, width: number, ratio?: number) {
  const dims = image.asset.metadata.dimensions;
  const height = Math.round(width / (ratio ?? dims.width / dims.height));
  return {
    src: imageUrl(image).width(width).height(height).fit('crop').url(),
    width,
    height,
    widths: [480, 720, 960, 1280, 1600].filter((w) => w < width).concat(width),
  };
}
