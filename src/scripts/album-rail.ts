/**
 * Album rail (homepage "Selected work"): a fan of project "sleeves" — the active one faces you, the rest
 * turn away to each side and recede. Slides on by itself (stops only via the pause button, off screen, or
 * with reduced motion); arrows, ticks, swipe, keyboard and clicking a side sleeve all move it too.
 *
 * `pose()` is shared with Work.astro so the first frame is rendered on the server (no layout shift, and
 * it reads fine without JS). Offsets are % of the sleeve's own width, so nothing is measured.
 */
const VISIBLE = 2; // sleeves shown on each side
const INTERVAL = 4500;

export function pose(offset: number) {
  const a = Math.abs(offset);
  const side = Math.sign(offset);
  const x = a === 0 ? 0 : side * (54 + (a - 1) * 22);
  const transform = `translate3d(${x}%, 0, ${-a * 170}px) rotateY(${-side * 22}deg) rotateZ(${side * a * 1.5}deg)`;
  return {
    transform,
    opacity: a > VISIBLE ? 0 : 1 - a * 0.18,
    zIndex: 10 - a,
  };
}

/** Shortest signed distance from the active index, wrapping around. */
export const offsetOf = (i: number, active: number, n: number) => {
  const half = Math.floor(n / 2);
  return ((((i - active) % n) + n + half) % n) - half;
};

let cleanups: Array<() => void> = [];

export function initAlbumRails() {
  cleanups.forEach((c) => c());
  cleanups = [];
  document.querySelectorAll<HTMLElement>('[data-album]').forEach((root) => cleanups.push(bind(root)));
}

function bind(root: HTMLElement) {
  const cards = [...root.querySelectorAll<HTMLElement>('[data-album-card]')];
  const infos = [...root.querySelectorAll<HTMLElement>('[data-album-info]')];
  const ticks = [...root.querySelectorAll<HTMLButtonElement>('[data-album-tick]')];
  const playBtn = root.querySelector<HTMLButtonElement>('[data-album-play]');
  const n = cards.length;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active = 0;
  let playing = !reduce;
  let visible = false;
  let timer = 0;

  const render = () => {
    cards.forEach((card, i) => {
      const o = offsetOf(i, active, n);
      const p = pose(o);
      card.style.transform = p.transform;
      card.style.opacity = String(p.opacity);
      card.style.zIndex = String(p.zIndex);
      card.classList.toggle('is-active', o === 0);
      card.toggleAttribute('inert', Math.abs(o) > VISIBLE);
      card.setAttribute('aria-hidden', String(o !== 0));
      const link = card.querySelector<HTMLElement>('a');
      if (link) link.tabIndex = o === 0 ? 0 : -1;
    });
    infos.forEach((el, i) => (el.hidden = i !== active));
    ticks.forEach((t, i) => t.setAttribute('aria-current', String(i === active)));
    root.classList.toggle('is-playing', playing);
    playBtn?.setAttribute('aria-pressed', String(playing));
    playBtn?.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
  };

  const schedule = () => {
    clearTimeout(timer);
    if (playing && visible) timer = window.setTimeout(() => go(active + 1), INTERVAL);
  };
  const go = (i: number) => {
    active = (i + n) % n;
    render();
    schedule();
  };

  let dragged = false;
  const onClick = (e: Event) => {
    if (dragged) {
      // The pointer just swiped: don't also follow a link or change slide.
      dragged = false;
      e.preventDefault();
      return;
    }
    const t = e.target as Element;
    const card = t.closest<HTMLElement>('[data-album-card]');
    if (card && !card.classList.contains('is-active')) {
      // A side sleeve: bring it to the front instead of following its link.
      e.preventDefault();
      go(cards.indexOf(card));
      return;
    }
    if (t.closest('[data-album-prev]')) go(active - 1);
    else if (t.closest('[data-album-next]')) go(active + 1);
    else if (t.closest('[data-album-play]')) {
      playing = !playing;
      render();
      schedule();
    } else {
      const tick = t.closest<HTMLButtonElement>('[data-album-tick]');
      if (tick) go(ticks.indexOf(tick));
    }
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') go(active - 1);
    else if (e.key === 'ArrowRight') go(active + 1);
    else return;
    e.preventDefault();
  };

  // Swipe / drag on the stage.
  const stage = root.querySelector<HTMLElement>('[data-album-stage]')!;
  let startX = 0;
  let dragging = false;
  const down = (e: PointerEvent) => {
    startX = e.clientX;
    dragging = true;
    dragged = false;
  };
  const up = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 45) {
      dragged = true;
      go(active + (dx < 0 ? 1 : -1));
    }
  };

  const io = new IntersectionObserver(([entry]) => {
    visible = Boolean(entry?.isIntersecting);
    schedule();
  });
  io.observe(root);

  root.addEventListener('click', onClick);
  root.addEventListener('keydown', onKey);
  stage.addEventListener('pointerdown', down);
  stage.addEventListener('pointerup', up);
  root.classList.add('is-ready');
  render();

  return () => {
    clearTimeout(timer);
    io.disconnect();
    root.removeEventListener('click', onClick);
    root.removeEventListener('keydown', onKey);
    stage.removeEventListener('pointerdown', down);
    stage.removeEventListener('pointerup', up);
  };
}
