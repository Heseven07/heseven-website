/** Count-up numbers (<Counter />) when they scroll into view. ~1KB. */
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t));
let io: IntersectionObserver | null = null;

function format(el: HTMLElement, n: number) {
  const { prefix = '', suffix = '', decimals = '0' } = el.dataset;
  el.textContent = `${prefix}${n.toFixed(Number(decimals))}${suffix}`;
}

function run(el: HTMLElement) {
  const to = Number(el.dataset.to);
  const from = Number(el.dataset.from ?? 0);
  const duration = 1800;
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    format(el, from + (to - from) * easeOutExpo(t));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function initCounters(reduceMotion: boolean) {
  io?.disconnect();
  const els = document.querySelectorAll<HTMLElement>('[data-counter]:not([data-counted])');
  if (reduceMotion || !els.length) return;
  els.forEach((el) => {
    // Lock the final width first so counting never shifts layout (CLS = 0).
    el.style.minWidth = `${el.getBoundingClientRect().width}px`;
    format(el, Number(el.dataset.from ?? 0));
  });
  io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.dataset.counted = '';
        io?.unobserve(el);
        run(el);
      }
    },
    { threshold: 0.6 },
  );
  els.forEach((el) => io!.observe(el));
}
