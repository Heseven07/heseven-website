/**
 * Cloudflare Worker — runs ONLY for /api/* (see `run_worker_first` in wrangler.jsonc).
 * Every other request is served straight from static assets without invoking this code.
 *
 * POST /api/contact
 *   Spam: honeypot field, minimum fill time, same-origin check, Cloudflare Turnstile (if configured).
 *   Delivery: Resend (https://resend.com) → CONTACT_TO, with reply-to set to the visitor.
 *   Accepts JSON (JS form) or urlencoded (no-JS fallback → 303 redirect to /thanks/).
 *
 * Secrets (wrangler secret put …): RESEND_API_KEY, TURNSTILE_SECRET_KEY
 * Vars (wrangler.jsonc):           CONTACT_TO, CONTACT_FROM
 */

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

type Fields = Record<string, string>;

const MIN_FILL_MS = 3000;
const LIMITS: Record<string, number> = {
  need: 100,
  budget: 60,
  currency: 3,
  timeline: 60,
  website: 200,
  message: 5000,
  name: 120,
  email: 200,
  country: 80,
};

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

async function readFields(request: Request): Promise<Fields> {
  const type = request.headers.get('content-type') ?? '';
  if (type.includes('application/json')) {
    const raw = (await request.json()) as Record<string, unknown>;
    return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, typeof v === 'string' ? v : '']));
  }
  const form = await request.formData();
  const out: Fields = {};
  form.forEach((v, k) => {
    out[k] = typeof v === 'string' ? v : '';
  });
  return out;
}

function validate(f: Fields): string | null {
  for (const [key, max] of Object.entries(LIMITS)) {
    f[key] = (f[key] ?? '').trim();
    if (f[key]!.length > max) return `${key} is too long`;
  }
  if (!f.need) return 'need is required';
  if (!f.budget) return 'budget is required';
  if (f.message!.length < 10) return 'message is too short';
  if (!f.name) return 'name is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email!)) return 'email is invalid';
  return null;
}

async function verifyTurnstile(token: string, secret: string, ip: string | null) {
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

function emailBodies(f: Fields) {
  const rows: [string, string][] = [
    ['Name', f.name!],
    ['Email', f.email!],
    ['Country', f.country || '—'],
    ['Website', f.website || '—'],
    ['Need', f.need!],
    ['Budget', `${f.budget} (${f.currency || 'USD'})`],
    ['Timeline', f.timeline || '—'],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${f.message}`;
  const html = `<table cellpadding="6" style="font-family:system-ui,sans-serif;font-size:14px">${rows
    .map(([k, v]) => `<tr><td style="color:#666">${k}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`)
    .join(
      '',
    )}</table><p style="font-family:system-ui,sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(
    f.message!,
  )}</p>`;
  return { text, html };
}

async function handleContact(request: Request, env: Env): Promise<Response> {
  const wantsJson = (request.headers.get('content-type') ?? '').includes('application/json');
  const done = (status: number, body: Record<string, unknown>) =>
    wantsJson
      ? json(status, body)
      : Response.redirect(new URL(status < 300 ? '/thanks/' : '/contact/?error=1', request.url).href, 303);

  // Same-origin only (blocks other sites posting into the form).
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(request.url).host)
    return done(403, { ok: false, error: 'origin' });

  let f: Fields;
  try {
    f = await readFields(request);
  } catch {
    return done(400, { ok: false, error: 'bad_request' });
  }

  // Bots: filled the honeypot or submitted inhumanly fast. Pretend success, send nothing.
  const elapsed = Number(f.formMs);
  if (f.company || (Number.isFinite(elapsed) && f.formMs !== '' && elapsed < MIN_FILL_MS))
    return done(200, { ok: true });

  const problem = validate(f);
  if (problem) return done(422, { ok: false, error: problem });

  if (env.TURNSTILE_SECRET_KEY) {
    const ok = await verifyTurnstile(
      f.turnstileToken ?? '',
      env.TURNSTILE_SECRET_KEY,
      request.headers.get('cf-connecting-ip'),
    );
    if (!ok) return done(400, { ok: false, error: 'turnstile' });
  }

  if (!env.RESEND_API_KEY) return done(503, { ok: false, error: 'not_configured' });

  const { text, html } = emailBodies(f);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_FROM || 'Heseven Website <onboarding@resend.dev>',
      to: [env.CONTACT_TO || 'info@heseven.com'],
      reply_to: f.email,
      subject: `New enquiry: ${f.need} — ${f.name}`,
      text,
      html,
    }),
  });
  if (!res.ok) {
    console.error('resend failed', res.status, await res.text());
    return done(502, { ok: false, error: 'send_failed' });
  }
  return done(200, { ok: true });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') return json(405, { ok: false, error: 'method_not_allowed' });
      return handleContact(request, env);
    }
    if (url.pathname.startsWith('/api/')) return json(404, { ok: false, error: 'not_found' });
    return env.ASSETS.fetch(request);
  },
};
