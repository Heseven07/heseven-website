/**
 * Store audit form. Progressive enhancement over a normal POST form: submits JSON to /api/contact,
 * shows an inline success message and falls back to a pre-filled email if the API is unavailable.
 */
import { loadTurnstile } from './turnstile';

const loadedAt = performance.now();

export function initAuditForm() {
  const form = document.querySelector<HTMLFormElement>('[data-audit-form]');
  if (!form || form.dataset.ready) return;
  form.dataset.ready = 'true';

  const card = form.closest<HTMLElement>('.qf-card')!;
  const errorEl = form.querySelector<HTMLElement>('[data-qf-error]')!;
  const submitBtn = form.querySelector<HTMLButtonElement>('[data-qf-submit]')!;
  const submitLabel = form.querySelector<HTMLElement>('[data-qf-submit-label]')!;
  const success = card.querySelector<HTMLElement>('[data-qf-success]')!;
  const box = form.querySelector<HTMLElement>('[data-turnstile]');

  form.noValidate = true;
  form.addEventListener('focusin', () => loadTurnstile(box), { once: true });

  const messageFor = (el: HTMLInputElement | HTMLTextAreaElement) => {
    if (el.validity.typeMismatch) return 'Please enter a valid email address.';
    const label = form.querySelector(`label[for="${el.id}"]`)?.childNodes[0]?.textContent?.trim();
    return `Please fill in “${label ?? 'this field'}”.`;
  };

  const mailto = (d: Record<string, string>) => {
    const body = [
      `Name: ${d.name ?? ''}`,
      `Email: ${d.email ?? ''}`,
      `Store URL: ${d.website ?? ''}`,
      '',
      d.message ?? '',
    ].join('\n');
    return `mailto:${form.dataset.email}?subject=${encodeURIComponent(`Audit request: ${d.website ?? ''}`)}&body=${encodeURIComponent(body)}`;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.textContent = '';
    const fields = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea')];
    const invalid = fields.find((f) => !f.checkValidity());
    if (invalid) {
      errorEl.textContent = messageFor(invalid);
      invalid.focus();
      return;
    }
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
      form.hidden = true;
      card.querySelector('.qf-head')?.setAttribute('hidden', '');
      success.hidden = false;
      success.focus();
      // Conversion events (no-ops unless analytics were consented and loaded).
      window.gtag?.('event', 'generate_lead', { service: 'Store audit' });
      window.tlq?.('track', 'Lead (audit)');
    } catch {
      if (box) window.turnstile?.reset(box);
      errorEl.innerHTML = '';
      errorEl.append(
        'Sorry — we couldn’t send that right now. ',
        Object.assign(document.createElement('a'), {
          href: mailto(data),
          textContent: 'Email your request instead',
          className: 'underline text-lime',
        }),
        ' (it’s pre-filled).',
      );
    } finally {
      submitBtn.disabled = false;
      submitLabel.textContent = 'Request my audit';
    }
  });
}
