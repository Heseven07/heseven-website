/**
 * Pointer micro-interactions — only on devices with a real hover pointer.
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

  // Release the magnet when the pointer leaves it (pointerout bubbles; check we truly left it).
  document.addEventListener('pointerout', (e) => {
    if (!(e.target instanceof Element)) return;
    if (magnet && !(e.relatedTarget instanceof Node && magnet.contains(e.relatedTarget))) {
      magnet.style.translate = '';
      magnet = null;
    }
  });
}
