/**
 * Staged quote form. Progressive enhancement over a normal POST form:
 * hides all but the current step, validates per step, lazy-loads Turnstile on the last step,
 * submits JSON to /api/contact and falls back to a pre-filled email if the API is unavailable.
 */
import { loadTurnstile } from './turnstile';

const CONTACT_EMAIL = 'info@heseven.com';
const loadedAt = performance.now();

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    tlq?: (...args: unknown[]) => void;
  }
}

export function initQuoteForm() {
  const form = document.querySelector<HTMLFormElement>('[data-quote-form]');
  if (!form || form.dataset.ready) return;
  form.dataset.ready = 'true';

  const card = form.closest<HTMLElement>('.qf-card')!;
  const steps = [...form.querySelectorAll<HTMLFieldSetElement>('.qf-step')];
  const total = steps.length;
  const backBtn = form.querySelector<HTMLButtonElement>('[data-qf-back]')!;
  const nextBtn = form.querySelector<HTMLButtonElement>('[data-qf-next]')!;
  const submitBtn = form.querySelector<HTMLButtonElement>('[data-qf-submit]')!;
  const submitLabel = form.querySelector<HTMLElement>('[data-qf-submit-label]')!;
  const errorEl = form.querySelector<HTMLElement>('[data-qf-error]')!;
  const bar = card.querySelector<HTMLElement>('[data-qf-bar]')!;
  const counter = card.querySelector<HTMLElement>('[data-qf-current]')!;
  const success = card.querySelector<HTMLElement>('[data-qf-success]')!;
  let current = 0;

  // Tracklution events, each once per form (no-op unless analytics were consented and loaded).
  // /pages/contact-in only tracks its final "Lead From India"; the other forms track the whole funnel.
  const india = form.dataset.region === 'india';
  const tracked = new Set<string>();
  const track = (event: string) => {
    if (!window.tlq || tracked.has(event)) return;
    tracked.add(event);
    window.tlq('track', event);
  };
  const optionEvents: Record<string, string> = { need: 'Need', budget: 'Budget', timeline: 'Timeline' };

  form.noValidate = true;
  card.classList.add('is-staged');

  const show = (index: number, focus = true) => {
    current = Math.max(0, Math.min(index, total - 1));
    steps.forEach((s, i) => {
      s.hidden = i !== current;
    });
    backBtn.hidden = current === 0;
    nextBtn.hidden = current === total - 1;
    submitBtn.hidden = current !== total - 1;
    counter.textContent = String(current + 1);
    bar.style.transform = `scaleX(${(current + 1) / total})`;
    setError('');
    if (current === total - 1) loadTurnstile(form.querySelector<HTMLElement>('[data-turnstile]'));
    if (focus) steps[current]!.querySelector<HTMLElement>('.qf-legend')?.focus({ preventScroll: true });
  };

  const setError = (msg: string) => {
    errorEl.textContent = msg;
    errorEl.hidden = !msg;
  };

  const validateStep = (step: HTMLFieldSetElement) => {
    const fields = [...step.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea')];
    const invalid = fields.find((f) => !f.checkValidity());
    if (!invalid) return true;
    let msg = 'Please complete this step.';
    if (invalid.type === 'radio') msg = 'Please pick one option to continue.';
    else if (invalid.validity.valueMissing) msg = `Please fill in “${labelFor(invalid)}”.`;
    else if (invalid.validity.typeMismatch) msg = 'Please enter a valid email address.';
    else if (invalid.validity.patternMismatch) msg = 'Please enter a valid mobile number.';
    else if (invalid.validity.tooShort) msg = 'Could you add a little more detail (10+ characters)?';
    setError(msg);
    invalid.focus();
    return false;
  };

  const labelFor = (el: HTMLElement) =>
    (el.id && form.querySelector(`label[for="${el.id}"]`)?.childNodes[0]?.textContent?.trim()) ||
    'this field';

  nextBtn.addEventListener('click', () => {
    if (validateStep(steps[current]!)) show(current + 1);
  });
  backBtn.addEventListener('click', () => show(current - 1));

  // Single-choice steps advance automatically once an option is picked.
  form.addEventListener('change', (e) => {
    const input = e.target as HTMLInputElement;
    if (input.name === 'currency') {
      const symbol = input.value === 'GBP' ? '£' : '$';
      form.querySelectorAll('.cur').forEach((c) => (c.textContent = symbol));
      return;
    }
    const optionEvent = optionEvents[input.name];
    if (optionEvent && !india) track(optionEvent);
    if (input.type === 'radio' && input.closest('[data-autoadvance]') && current < total - 1) {
      setTimeout(() => show(current + 1), 280);
    }
  });

  // Enter in a text input moves forward instead of submitting early.
  form.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || current === total - 1) return;
    if ((e.target as HTMLElement).tagName === 'TEXTAREA') return;
    e.preventDefault();
    nextBtn.click();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    for (let i = 0; i < total; i++) {
      if (!validateStep(steps[i]!)) {
        show(i, false);
        validateStep(steps[i]!);
        return;
      }
    }
    if (!india) track('Contact');
    (form.elements.namedItem('formMs') as HTMLInputElement).value = String(
      Math.round(performance.now() - loadedAt),
    );
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    submitBtn.disabled = true;
    submitLabel.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      onSuccess(data);
    } catch {
      setError('');
      errorEl.hidden = false;
      errorEl.innerHTML = '';
      errorEl.append(
        'Sorry — we couldn’t send that right now. ',
        Object.assign(document.createElement('a'), {
          href: mailto(data),
          textContent: 'Email your brief instead',
          className: 'underline text-lime',
        }),
        ' (it’s pre-filled).',
      );
    } finally {
      submitBtn.disabled = false;
      submitLabel.textContent = 'Get my quote';
    }
  });

  const onSuccess = (data: Record<string, string>) => {
    form.hidden = true;
    card.querySelector('.qf-head')?.setAttribute('hidden', '');
    card.querySelector('.qf-progress')?.setAttribute('hidden', '');
    success.hidden = false;
    success.focus();
    // Conversion events (no-ops unless analytics were consented and loaded).
    window.gtag?.('event', 'generate_lead', { service: data.need, budget: data.budget });
    track(india ? 'Lead From India' : 'Lead');
  };

  const mailto = (d: Record<string, string>) => {
    const body = [
      `Name: ${d.name ?? ''}`,
      `Email: ${d.email ?? ''}`,
      ...(d.source === 'india'
        ? ['Lead from India', `Mobile: ${d.phone ?? ''}`]
        : [`Country: ${d.country ?? ''}`]),
      `Website: ${d.website ?? ''}`,
      `Need: ${d.need ?? ''}`,
      `Budget: ${d.budget ?? ''} ${d.currency ?? ''}`,
      `Timeline: ${d.timeline ?? ''}`,
      '',
      d.message ?? '',
    ].join('\n');
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Project enquiry: ${d.need ?? ''}`)}&body=${encodeURIComponent(body)}`;
  };

  show(0, false);
  form.classList.add('is-ready');
}
