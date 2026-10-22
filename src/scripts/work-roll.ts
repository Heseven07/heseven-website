/**
 * Selected work — pins the section on desktop and turns vertical page scroll into horizontal track
 * scroll. The section gets exactly as much extra height as the track can scroll sideways, so one pixel
 * down moves the cards one pixel left. The 3D roll itself is CSS (view(inline) timeline on each card),
 * so this only writes scrollLeft + a progress bar inside one rAF per frame. Mobile keeps native swipe.
 */
let cleanup: (() => void) | undefined;

export function initWorkRoll() {
  cleanup?.();
  cleanup = undefined;
  const pin = document.querySelector<HTMLElement>('[data-work-pin]');
  const track = pin?.querySelector<HTMLElement>('[data-work-track]');
  if (!pin || !track) return;
  const bar = pin.querySelector<HTMLElement>('[data-work-progress]');
  const desktop = matchMedia('(min-width: 768px)');
  let dist = 0;
  let frame = 0;

  const setBar = (p: number) => {
    if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
  };

  function update() {
    frame = 0;
    if (!desktop.matches) {
      setBar(dist > 0 ? track!.scrollLeft / dist : 0);
      return;
    }
    const total = pin!.offsetHeight - innerHeight;
    const p = total > 0 ? Math.min(1, Math.max(0, -pin!.getBoundingClientRect().top / total)) : 0;
    track!.scrollLeft = p * dist;
    setBar(p);
  }
  const schedule = () => {
    frame ||= requestAnimationFrame(update);
  };

  function measure() {
    pin!.classList.toggle('is-pinned', desktop.matches);
    dist = Math.max(0, track!.scrollWidth - track!.clientWidth);
    pin!.style.setProperty('--work-dist', `${dist}px`);
    update();
  }

  const ro = new ResizeObserver(measure);
  ro.observe(track);
  desktop.addEventListener('change', measure);
  addEventListener('scroll', schedule, { passive: true });
  track.addEventListener('scroll', schedule, { passive: true });
  measure();

  cleanup = () => {
    ro.disconnect();
    desktop.removeEventListener('change', measure);
    removeEventListener('scroll', schedule);
    cancelAnimationFrame(frame);
  };
}
