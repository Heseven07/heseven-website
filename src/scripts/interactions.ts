/**
 * Pointer micro-interactions — only on devices with a real hover pointer.
 *  [data-tilt]      3D tilt + glare + cursor-follow badge (work cards)
 *  [data-spotlight] radial light following the cursor (cards)
 *  [data-magnetic]  element eases toward the cursor (primary CTAs)
 * Uses event delegation on document (bound once, survives view-transition swaps) and
 * writes only CSS custom properties inside rAF → compositor-only transforms.
 */
let bound = false;

export function initInteractions(reduceMotion: boolean) {
  if (bound || reduceMotion || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  bound = true;

  let frame = 0;
  let last: PointerEvent | null = null;
  let magnet: HTMLElement | null = null;

  const apply = () => {
    frame = 0;
    const e = last;
    if (!e || !(e.target instanceof Element)) return;

    const tilt = e.target.closest<HTMLElement>('[data-tilt]');
    if (tilt) {
      const media = tilt.querySelector<HTMLElement>('.work-media') ?? tilt;
      const r = media.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      media.style.setProperty('--rx', `${((0.5 - y) * 10).toFixed(2)}deg`);
      media.style.setProperty('--ry', `${((x - 0.5) * 12).toFixed(2)}deg`);
      media.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
      media.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
      media.style.setProperty('--cx', `${(e.clientX - r.left).toFixed(0)}px`);
      media.style.setProperty('--cy', `${(e.clientY - r.top).toFixed(0)}px`);
    }

    const spot = e.target.closest<HTMLElement>('[data-spotlight]');
    if (spot) {
      const r = spot.getBoundingClientRect();
      spot.style.setProperty('--sx', `${(e.clientX - r.left).toFixed(0)}px`);
      spot.style.setProperty('--sy', `${(e.clientY - r.top).toFixed(0)}px`);
    }

    const mag = e.target.closest<HTMLElement>('[data-magnetic]');
    if (magnet && magnet !== mag) magnet.style.translate = '';
    magnet = mag;
    if (mag) {
      const r = mag.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      mag.style.translate = `${(dx * 0.25).toFixed(1)}px ${(dy * 0.35).toFixed(1)}px`;
    }
  };

  document.addEventListener(
    'pointermove',
    (e) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    },
    { passive: true },
  );

  // Reset tilt when the pointer leaves a card (pointerout bubbles; check we truly left it).
  document.addEventListener('pointerout', (e) => {
    if (!(e.target instanceof Element)) return;
    const tilt = e.target.closest<HTMLElement>('[data-tilt]');
    if (tilt && !(e.relatedTarget instanceof Node && tilt.contains(e.relatedTarget))) {
      const media = tilt.querySelector<HTMLElement>('.work-media') ?? tilt;
      media.style.setProperty('--rx', '0deg');
      media.style.setProperty('--ry', '0deg');
    }
    if (magnet && !(e.relatedTarget instanceof Node && magnet.contains(e.relatedTarget))) {
      magnet.style.translate = '';
      magnet = null;
    }
  });
}
