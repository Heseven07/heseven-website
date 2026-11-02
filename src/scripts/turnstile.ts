/** Lazy Cloudflare Turnstile: loads the script the first time a form needs it, so it never affects page load. */
declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (el?: HTMLElement) => void;
    };
    __hsTurnstileReady?: () => void;
  }
}

export function loadTurnstile(box: HTMLElement | null) {
  if (!box || box.dataset.requested) return;
  box.dataset.requested = 'true';
  const render = () =>
    window.turnstile?.render(box, {
      sitekey: box.dataset.sitekey,
      theme: 'dark',
      'response-field-name': 'turnstileToken',
    });
  if (window.turnstile) return render();
  window.__hsTurnstileReady = render;
  const s = document.createElement('script');
  s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__hsTurnstileReady';
  s.async = true;
  document.head.append(s);
}
