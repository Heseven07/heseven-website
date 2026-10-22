/**
 * Global motion: Lenis smooth scroll + scroll-reveal.
 * Bundled module script → executes once; re-binds on every view-transition navigation.
 */
import Lenis from 'lenis';
import { initCounters } from './counters';
import { initProcess } from './process';
import { initInteractions } from './interactions';
import { initGridComets } from './grid-comet';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis: Lenis | null = null;
let observer: IntersectionObserver | null = null;
let inviewObserver: IntersectionObserver | null = null;

/** Toggle `.is-inview` on [data-inview] elements, so expensive loops (e.g. the footer aurora) only run on screen. */
function initInview() {
  inviewObserver?.disconnect();
  inviewObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) entry.target.classList.toggle('is-inview', entry.isIntersecting);
  });
  document.querySelectorAll('[data-inview]').forEach((el) => inviewObserver!.observe(el));
}

function initLenis() {
  if (reduceMotion || lenis) return;
  lenis = new Lenis({ lerp: 0.1, anchors: true, autoRaf: true });
}

function initReveal() {
  observer?.disconnect();
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)');
  if (!els.length) return;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );
  els.forEach((el) => observer!.observe(el));
}

document.addEventListener('astro:page-load', () => {
  initLenis();
  lenis?.resize();
  initReveal();
  initInview();
  initCounters(reduceMotion);
  initProcess(reduceMotion);
  initInteractions(reduceMotion);
  initGridComets();
});

// Lenis must jump (not glide) to the top of a freshly swapped page.
document.addEventListener('astro:after-swap', () => {
  lenis?.scrollTo(0, { immediate: true, force: true });
});

// Cursor smoke: fetched only on the first real mouse move (never during page load), and only for
// a fine pointer with motion allowed.
if (!reduceMotion && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const loadSmoke = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    removeEventListener('pointermove', loadSmoke);
    void import('./cursor-smoke').then((m) => m.startSmoke(e));
  };
  addEventListener('pointermove', loadSmoke, { passive: true });
}
