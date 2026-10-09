/**
 * Global motion: Lenis smooth scroll + scroll-reveal.
 * Bundled module script → executes once; re-binds on every view-transition navigation.
 */
import Lenis from 'lenis';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis: Lenis | null = null;
let observer: IntersectionObserver | null = null;

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
});

// Lenis must jump (not glide) to the top of a freshly swapped page.
document.addEventListener('astro:after-swap', () => {
  lenis?.scrollTo(0, { immediate: true, force: true });
});
