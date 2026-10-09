/**
 * "How we work" timeline. A line is measured between the first and last dot, then filled with
 * scroll progress; each step lights up as the fill reaches its dot.
 * Desktop: the section is pinned (CSS sticky) and progress = how far through the tall section you are.
 * Mobile: progress = how far the line has passed a reading line at 65% of the viewport.
 */
let cleanup: (() => void) | null = null;

export function initProcess(reduceMotion: boolean) {
  cleanup?.();
  cleanup = null;
  const section = document.querySelector<HTMLElement>('[data-process]');
  if (!section) return;
  const track = section.querySelector<HTMLElement>('.process-track')!;
  const line = section.querySelector<HTMLElement>('.process-line')!;
  const steps = [...section.querySelectorAll<HTMLElement>('.process-step')];
  const dots = steps.map((s) => s.querySelector<HTMLElement>('.process-dot')!);
  const pinned = matchMedia('(min-width: 768px) and (min-height: 640px)');

  if (reduceMotion) {
    section.style.setProperty('--p', '1');
    steps.forEach((s) => s.classList.add('is-active'));
  }

  let horizontal = true;
  let length = 0;
  let positions: number[] = [];

  const measure = () => {
    const t = track.getBoundingClientRect();
    const centers = dots.map((d) => {
      const r = d.getBoundingClientRect();
      return { x: r.left + r.width / 2 - t.left, y: r.top + r.height / 2 - t.top };
    });
    const first = centers[0]!;
    const last = centers[centers.length - 1]!;
    horizontal = Math.abs(last.x - first.x) > Math.abs(last.y - first.y);
    length = horizontal ? last.x - first.x : last.y - first.y;
    positions = centers.map((c) => (horizontal ? c.x - first.x : c.y - first.y));
    Object.assign(line.style, {
      left: `${first.x}px`,
      top: `${first.y}px`,
      width: horizontal ? `${length}px` : '2px',
      height: horizontal ? '2px' : `${length}px`,
    });
    line.dataset.axis = horizontal ? 'x' : 'y';
    update();
  };

  const update = () => {
    if (reduceMotion || !length) return;
    let p: number;
    if (pinned.matches) {
      const r = section.getBoundingClientRect();
      const scrollable = r.height - innerHeight;
      // Finish the line at 80% of the pin so it rests complete for a beat before releasing.
      p = scrollable > 0 ? -r.top / (scrollable * 0.8) : 1;
    } else {
      const t = track.getBoundingClientRect();
      const firstDotTop = t.top + (parseFloat(line.style.top) || 0);
      p = (innerHeight * 0.65 - firstDotTop) / length;
    }
    p = Math.min(Math.max(p, 0), 1);
    section.style.setProperty('--p', p.toFixed(4));
    const reached = p * length + 1;
    steps.forEach((s, i) => s.classList.toggle('is-active', positions[i]! <= reached));
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };

  const ro = new ResizeObserver(measure);
  ro.observe(track);
  addEventListener('scroll', onScroll, { passive: true });
  measure();

  cleanup = () => {
    ro.disconnect();
    removeEventListener('scroll', onScroll);
  };
}
