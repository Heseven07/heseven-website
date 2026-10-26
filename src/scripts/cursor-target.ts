/**
 * Target cursor — in the style of React Bits' "Target Cursor": a reticle of four corner brackets
 * spinning around a dot. Over a link/button the brackets stop spinning and snap around the element,
 * following its corner radius and leaning slightly toward the pointer; clicking squeezes them.
 * White with `mix-blend-mode: difference`, so it stays visible on any background.
 *
 * Loaded lazily by motion.ts on the first mouse move, only for a fine pointer. Self-contained: it
 * injects its own styles. Hides the system cursor only once it is running.
 */
const TARGETS = 'a, button, [role="button"], summary, label, select, .cursor-target';
const SIZE = 36; // reticle size while roaming, px
const CORNER = 12; // bracket arm length, px
const THICKNESS = 3; // bracket stroke, px
const PADDING = 6; // gap between a locked target and the brackets, px
const DOT = 4; // centre dot, px
const SPIN = 2; // seconds per turn while roaming
const SNAP = 0.2; // seconds to snap onto / off a target
const PARALLAX = 0.08; // how far locked brackets lean toward the pointer

let started = false;

export function startTargetCursor(first?: PointerEvent) {
  if (started) return;
  started = true;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const style = document.createElement('style');
  style.textContent = `
    html.tc-on, html.tc-on * { cursor: none !important; }
    html.tc-on input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]), html.tc-on textarea { cursor: text !important; }
    .tc { position: fixed; inset: 0; z-index: 70; pointer-events: none; mix-blend-mode: difference; }
    .tc > i { position: absolute; top: 0; left: 0; display: block; box-sizing: border-box; will-change: transform; opacity: 0; transition: opacity .2s; }
    .tc.is-on > i { opacity: 1; }
    .tc-dot { width: ${DOT}px; height: ${DOT}px; border-radius: 50%; background: #fff; }
    .tc-c { width: ${CORNER}px; height: ${CORNER}px; border: 0 solid #fff; }
    .tc-tl { border-top-width: ${THICKNESS}px; border-left-width: ${THICKNESS}px; }
    .tc-tr { border-top-width: ${THICKNESS}px; border-right-width: ${THICKNESS}px; }
    .tc-br { border-bottom-width: ${THICKNESS}px; border-right-width: ${THICKNESS}px; }
    .tc-bl { border-bottom-width: ${THICKNESS}px; border-left-width: ${THICKNESS}px; }
  `;

  const root = document.createElement('div');
  root.className = 'tc';
  root.setAttribute('aria-hidden', 'true');
  const dot = document.createElement('i');
  dot.className = 'tc-dot';
  const names = ['tl', 'tr', 'br', 'bl'] as const;
  const corners = names.map((n) => {
    const el = document.createElement('i');
    el.className = `tc-c tc-${n}`;
    return el;
  });
  root.append(dot, ...corners);
  // Both on <html> itself, outside <head>/<body>, so view-transition swaps never remove them.
  document.documentElement.append(style, root);

  // Corner centre offsets (unit square) and which border-radius each corner uses.
  const signs = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ] as const;
  const radiusProp = [
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomRightRadius',
    'borderBottomLeftRadius',
  ] as const;

  const mouse = { x: -100, y: -100 };
  let target: Element | null = null;
  let lock = 0; // 0 = roaming, 1 = locked on target (eased)
  let angle = 0;
  let pressed = 0;
  let pressTarget = 0;
  let last = performance.now();
  let visible = false;

  const ease = (t: number) => t * t * (3 - 2 * t);

  function frame(now: number) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    // Ease lock in/out over SNAP seconds and the click squeeze.
    lock += ((target ? 1 : 0) - lock) * Math.min(1, dt / (SNAP / 4));
    pressed += (pressTarget - pressed) * Math.min(1, dt * 18);
    if (!reduceMotion && SPIN > 0) angle += ((Math.PI * 2) / SPIN) * dt * (1 - lock);
    // The reticle looks identical every quarter turn, so keep the angle in [-45°, 45°): unwinding to
    // 0 then always lands each bracket upright on its own corner (a 90° landing drew them sideways).
    const q = Math.PI / 2;
    angle = ((((angle + q / 2) % q) + q) % q) - q / 2;
    const k = ease(lock);
    const rot = angle * (1 - k);

    dot.style.transform = `translate(${mouse.x - DOT / 2}px, ${mouse.y - DOT / 2}px)`;

    let rect: DOMRect | null = null;
    let radius = 0;
    if (target) {
      if (!target.isConnected) target = null;
      else {
        rect = target.getBoundingClientRect();
        radius = parseFloat(getComputedStyle(target).borderTopLeftRadius) || 0;
      }
    }
    const squeeze = 1 - 0.18 * pressed;
    const pad = PADDING - 3 * pressed;
    const half = (SIZE / 2) * squeeze - CORNER / 2;
    const lean = rect
      ? {
          x: (mouse.x - (rect.left + rect.width / 2)) * PARALLAX,
          y: (mouse.y - (rect.top + rect.height / 2)) * PARALLAX,
        }
      : { x: 0, y: 0 };

    corners.forEach((el, i) => {
      const [sx, sy] = signs[i]!;
      // Roaming: around the pointer, rotated by the spin angle.
      const ox = sx * half;
      const oy = sy * half;
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      let x = mouse.x + ox * cos - oy * sin;
      let y = mouse.y + ox * sin + oy * cos;
      if (rect) {
        // Locked: on the target's corners (expanded by the padding), leaning toward the pointer.
        const tx = (sx < 0 ? rect.left - pad + CORNER / 2 : rect.right + pad - CORNER / 2) + lean.x;
        const ty = (sy < 0 ? rect.top - pad + CORNER / 2 : rect.bottom + pad - CORNER / 2) + lean.y;
        x += (tx - x) * k;
        y += (ty - y) * k;
      }
      el.style.transform = `translate(${x - CORNER / 2}px, ${y - CORNER / 2}px) rotate(${rot}rad)`;
      el.style[radiusProp[i]!] = `${Math.min(CORNER, (radius + pad) * k)}px`;
    });

    requestAnimationFrame(frame);
  }

  const findTarget = (el: EventTarget | null) => (el instanceof Element ? el.closest(TARGETS) : null);

  const show = () => {
    if (visible) return;
    visible = true;
    root.classList.add('is-on');
    document.documentElement.classList.add('tc-on');
  };
  addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      show();
    },
    { passive: true },
  );
  addEventListener('pointerover', (e) => (target = findTarget(e.target)), { passive: true });
  addEventListener('pointerdown', () => (pressTarget = 1), { passive: true });
  addEventListener('pointerup', () => (pressTarget = 0), { passive: true });
  // Content moves under a still pointer while scrolling: re-check what's beneath it.
  addEventListener('scroll', () => (target = findTarget(document.elementFromPoint(mouse.x, mouse.y))), {
    passive: true,
  });
  // Leaving the window hides the reticle and gives the system cursor back.
  document.documentElement.addEventListener('pointerleave', () => {
    visible = false;
    root.classList.remove('is-on');
    document.documentElement.classList.remove('tc-on');
  });

  if (first) {
    mouse.x = first.clientX;
    mouse.y = first.clientY;
    target = findTarget(first.target);
    show();
  }
  requestAnimationFrame(frame);
}
