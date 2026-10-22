/**
 * Grid comet — one neon comet at a time runs along a background grid's lines: a row, then a column,
 * then the next row… snaking until every line is covered, changing colour each run.
 *
 * Markup: <div data-grid-comet data-cell="48" [data-rows="0.6"] [data-delay="1200"]>
 *           <span class="grid-comet"></span></div>
 *   data-cell   grid cell size in px; lines sit at multiples of it from the layer's top-left corner
 *   data-rows   fraction of the layer's height whose rows are used (skip rows a mask hides)
 *   data-delay  ms to wait before the first run (e.g. let the hero intro finish)
 *
 * Moves with a compositor-only transform (Web Animations API), only while the layer is on screen.
 * Reduced-motion users see the static grid.
 */
const COLORS = ['#b5f36b', '#8b6cff', '#5eead4', '#f472b6', '#fbbf24'];
const SPEED = 650; // px per second
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let cleanups: Array<() => void> = [];

function runComet(layer: HTMLElement, comet: HTMLElement) {
  const cell = Number(layer.dataset.cell) || 48;
  const rowFraction = Number(layer.dataset.rows) || 1;
  const delay = Number(layer.dataset.delay) || 0;
  let run = 0; // alternates row / column
  let row = 0;
  let col = 0;
  let anim: Animation | undefined;
  let visible = false;
  let ready = delay === 0;
  const timer = delay ? window.setTimeout(() => ((ready = true), visible && next()), delay) : 0;

  function next() {
    if (!visible || !ready) return;
    const w = layer.clientWidth;
    const h = layer.clientHeight;
    const rows = Math.max(1, Math.floor((h * rowFraction) / cell) - 1); // inner horizontal lines
    const cols = Math.max(1, Math.floor(w / cell) - 1); // inner vertical lines
    const len = comet.offsetWidth;
    const thick = comet.offsetHeight;
    const span = Math.min(h, h * rowFraction + cell); // how far down columns run
    comet.style.setProperty('--c', COLORS[run % COLORS.length]!);

    let from: string;
    let to: string;
    let distance: number;
    if (run % 2 === 0) {
      const y = ((row % rows) + 1) * cell + 0.5 - thick / 2;
      const forward = row % 2 === 0; // snake: left→right, then right→left
      const [a, b] = forward ? [-len, w] : [w, -len];
      const rot = forward ? 0 : 180;
      from = `translate(${a}px, ${y}px) rotate(${rot}deg)`;
      to = `translate(${b}px, ${y}px) rotate(${rot}deg)`;
      distance = w + len;
      row++;
    } else {
      // The comet is a horizontal bar rotated about its centre, so offset x by half its length.
      const x = ((col % cols) + 1) * cell + 0.5 - len / 2;
      const down = col % 2 === 0;
      const [a, b] = down ? [-len, span + len / 2] : [span + len / 2, -len];
      const rot = down ? 90 : -90;
      from = `translate(${x}px, ${a}px) rotate(${rot}deg)`;
      to = `translate(${x}px, ${b}px) rotate(${rot}deg)`;
      distance = span + len * 1.5;
      col++;
    }
    run++;
    anim = comet.animate(
      [
        { transform: from, opacity: 0 },
        { opacity: 1, offset: 0.05 },
        { opacity: 1, offset: 0.95 },
        { transform: to, opacity: 0 },
      ],
      { duration: (distance / SPEED) * 1000, easing: 'linear' },
    );
    anim.onfinish = next;
  }

  const io = new IntersectionObserver(([entry]) => {
    visible = Boolean(entry?.isIntersecting);
    if (!visible) anim?.pause();
    else if (anim?.playState === 'paused') anim.play();
    else if (!anim || anim.playState === 'finished') next();
  });
  io.observe(layer);
  return () => {
    clearTimeout(timer);
    io.disconnect();
    anim?.cancel();
  };
}

export function initGridComets() {
  cleanups.forEach((c) => c());
  cleanups = [];
  if (reduceMotion) return;
  document.querySelectorAll<HTMLElement>('[data-grid-comet]').forEach((layer) => {
    const comet = layer.querySelector<HTMLElement>('.grid-comet');
    if (comet) cleanups.push(runComet(layer, comet));
  });
}
