/**
 * Capsule CRM sync for website enquiries (https://developer.capsulecrm.com/v2).
 * Finds the visitor by email or creates them as a person, then adds an opportunity with the
 * enquiry details. Runs after the response is sent (ctx.waitUntil) and never throws: if Capsule
 * is down or misconfigured the enquiry email still goes out, and the error is only logged.
 *
 * Secret: CAPSULE_API_TOKEN (Capsule → My Preferences → API Authentication Tokens).
 * Var (optional): CAPSULE_MILESTONE_ID, the stage new opportunities start in. Without it, the
 * first milestone of the oldest active pipeline is used.
 *
 * Offline conversions (pushStageEvents, run by the Worker's cron every 15 minutes): when a website
 * opportunity (tagged "Website: …") moves to a mapped stage, the event goes to Tracklution's webhook,
 * which matches it by email/phone to the visitor's tracked session (the forms send ContactInfo) and
 * forwards it to the ad platforms. Only stage changes inside the cron's 15-minute window are sent,
 * so each change goes once. Secret: TRACKLUTION_WEBHOOK_URL (Tracklution → Webhook).
 */

type Fields = Record<string, string>;

export interface CapsuleEnv {
  CAPSULE_API_TOKEN?: string;
  CAPSULE_MILESTONE_ID?: string;
  TRACKLUTION_WEBHOOK_URL?: string;
  /** Tests only: point the sync at a mock server. */
  CAPSULE_API_BASE?: string;
}

const SOURCES: Record<string, { tag: string; label: string }> = {
  india: { tag: 'Website: India', label: 'India enquiry' },
  audit: { tag: 'Website: Audit', label: 'Store audit' },
};
const DEFAULT_SOURCE = { tag: 'Website: Contact', label: 'Website enquiry' };

async function call<T>(env: CapsuleEnv, path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${env.CAPSULE_API_BASE || 'https://api.capsulecrm.com'}/api/v2${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${env.CAPSULE_API_TOKEN}`,
      accept: 'application/json',
      'content-type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`${init.method ?? 'GET'} ${path} → ${res.status} ${await res.text()}`);
  return (await res.json()) as T;
}

type Party = { id: number; emailAddresses?: { address: string }[] };

async function findOrCreatePerson(env: CapsuleEnv, f: Fields, tag: string): Promise<number> {
  const email = f.email!.toLowerCase();
  const found = await call<{ parties: Party[] }>(env, `/parties/search?q=${encodeURIComponent(email)}`);
  const match = found.parties.find((p) => p.emailAddresses?.some((e) => e.address.toLowerCase() === email));
  if (match) return match.id;

  const [firstName, ...rest] = f.name!.split(/\s+/);
  const phone = f.phone || f.whatsapp;
  const website = f.website && (/^https?:\/\//.test(f.website) ? f.website : `https://${f.website}`);
  const created = await call<{ party: Party }>(env, '/parties', {
    method: 'POST',
    body: JSON.stringify({
      party: {
        type: 'person',
        firstName,
        lastName: rest.join(' ') || undefined,
        emailAddresses: [{ type: 'Work', address: f.email }],
        phoneNumbers: phone ? [{ type: 'Mobile', number: phone }] : undefined,
        websites: website ? [{ type: 'Work', service: 'URL', address: website }] : undefined,
        tags: [{ name: tag }],
      },
    }),
  });
  return created.party.id;
}

async function milestoneId(env: CapsuleEnv): Promise<number> {
  if (env.CAPSULE_MILESTONE_ID) return Number(env.CAPSULE_MILESTONE_ID);
  const { milestones } = await call<{ milestones: { id: number }[] }>(env, '/milestones?perPage=1');
  if (!milestones[0]) throw new Error('no milestones in Capsule');
  return milestones[0].id;
}

export async function syncToCapsule(env: CapsuleEnv, f: Fields): Promise<void> {
  if (!env.CAPSULE_API_TOKEN) return;
  const source = SOURCES[f.source ?? ''] ?? DEFAULT_SOURCE;
  try {
    const partyId = await findOrCreatePerson(env, f, source.tag);
    const details = [
      ['Need', f.need],
      ['Budget', f.budget && `${f.budget} (${f.currency || 'USD'})`],
      ['Timeline', f.timeline],
      ['Store / website', f.website],
      ['Mobile', f.phone],
      ['WhatsApp', f.whatsapp],
      ['Country', f.country],
    ]
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`);
    await call(env, '/opportunities', {
      method: 'POST',
      body: JSON.stringify({
        opportunity: {
          name: `${source.label}: ${f.source === 'audit' ? f.website : f.need} (${f.name})`.slice(0, 255),
          description: [...details, '', f.message].join('\n').trim(),
          party: { id: partyId },
          milestone: { id: await milestoneId(env) },
          tags: [{ name: source.tag }],
        },
      }),
    });
  } catch (err) {
    console.error('capsule sync failed', String(err));
  }
}

/** Capsule stage name → Tracklution event. Closed-won stages (100%) always send DealWon. */
const STAGE_EVENTS: Record<string, string> = {
  Qualified: 'QualifiedLead',
  Meeting: 'MeetingBooked',
  Proposal: 'ProposalSent',
  Negotiation: 'NegotiationStarted',
  Contract: 'ContractSent',
};
export const CRON_WINDOW_MS = 15 * 60 * 1000;

type Opportunity = {
  id: number;
  party: { id: number };
  milestone: { name: string; complete?: boolean; probability?: number };
  value?: { amount?: number; currency?: string };
  lastStageChangedAt?: string;
  tags?: { name: string }[];
};
type Person = { emailAddresses?: { address: string }[]; phoneNumbers?: { number: string }[] };

export async function pushStageEvents(env: CapsuleEnv, scheduledTime: number): Promise<void> {
  if (!env.CAPSULE_API_TOKEN || !env.TRACKLUTION_WEBHOOK_URL) return;
  const from = scheduledTime - CRON_WINDOW_MS;
  try {
    const since = new Date(from - 60_000).toISOString();
    const { opportunities } = await call<{ opportunities: Opportunity[] }>(
      env,
      `/opportunities?since=${encodeURIComponent(since)}&perPage=100&embed=tags,milestone`,
    );
    for (const o of opportunities) {
      const changed = Date.parse(o.lastStageChangedAt ?? '');
      if (!(changed >= from && changed < scheduledTime)) continue;
      if (!o.tags?.some((t) => t.name.startsWith('Website:'))) continue;
      const won = o.milestone.complete && o.milestone.probability === 100;
      const event = won ? 'DealWon' : STAGE_EVENTS[o.milestone.name];
      if (!event) continue;

      const { party } = await call<{ party: Person }>(env, `/parties/${o.party.id}`);
      const email = party.emailAddresses?.[0]?.address;
      const phoneNumber = party.phoneNumbers?.[0]?.number;
      if (!email && !phoneNumber) continue;
      const url = new URL(env.TRACKLUTION_WEBHOOK_URL);
      url.searchParams.set('track', event);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email,
          phoneNumber,
          ...(won && o.value?.amount ? { value: o.value.amount, currency: o.value.currency } : {}),
        }),
      });
      if (!res.ok) throw new Error(`tracklution ${event} for opportunity ${o.id} → ${res.status}`);
    }
  } catch (err) {
    console.error('stage events failed', String(err));
  }
}
