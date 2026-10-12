# Contact form emails → dhiraj@heseven.com

Ye guide batata hai ki website ke contact form ki enquiries **heseven07@gmail.com** ki jagah **dhiraj@heseven.com** par kaise aayengi.

---

## Abhi kya chal raha hai

| Cheez                     | Abhi ki setting                                                           |
| ------------------------- | ------------------------------------------------------------------------- |
| Form ka backend           | Cloudflare Worker (`worker/index.ts`), sirf `/api/contact` par chalta hai |
| Email bhejne wali service | [Resend](https://resend.com), account: heseven07@gmail.com                |
| Enquiry kahan aati hai    | **heseven07@gmail.com**                                                   |
| Email kisse aata hai      | `Heseven Website <onboarding@resend.dev>`                                 |
| API key                   | Cloudflare mein secret `RESEND_API_KEY` ke naam se save hai ✅            |

**Gmail par kyun aa raha hai?** Resend ka test sender (`onboarding@resend.dev`) sirf usi email par bhej sakta hai jisse Resend account bana hai. Kisi aur address par, jaise dhiraj@heseven.com, bhejne ke liye **heseven.com domain Resend mein verify** karna zaroori hai.

---

## heseven.com ki DNS details (checked on 12 Oct 2026)

- **DNS provider:** Hostinger (nameservers `ns1.dns-parking.com`, `ns2.dns-parking.com`)
- **Company email:** Google Workspace (MX records `aspmx.l.google.com` …)
- **Existing SPF:** `v=spf1 include:_spf.google.com ~all`

✅ Resend ke records **alag naam** par lagte hain (`send.heseven.com` aur `resend._domainkey.heseven.com`). Isliye **dhiraj@heseven.com aur baaki company emails par koi asar nahi padega.**

---

## Step 1: Resend mein domain add karein

1. https://resend.com/domains kholiye (heseven07@gmail.com se login).
2. **Add Domain** dabaiye.
3. Domain: `heseven.com`. Region koi bhi chuniye, jaise **Ireland (eu-west-1)**.
4. **Add** dabaiye.
5. Resend 3–4 DNS records dikhayega, kuch aise:

   | Type           | Name                | Value (example)                         | Priority |
   | -------------- | ------------------- | --------------------------------------- | -------- |
   | MX             | `send`              | `feedback-smtp.eu-west-1.amazonses.com` | 10       |
   | TXT            | `send`              | `v=spf1 include:amazonses.com ~all`     | —        |
   | TXT            | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEB…` (lambi line)  | —        |
   | TXT (optional) | `_dmarc`            | `v=DMARC1; p=none;`                     | —        |

   > ⚠️ Upar wali values sirf example hain. **Hamesha wahi copy karein jo Resend aapki screen par dikhaye.**

Ye page khula rakhiye, Step 2 mein inhi values ki zaroorat padegi.

---

## Step 2: Hostinger mein DNS records daalein

1. https://hpanel.hostinger.com kholiye aur login kariye.
2. **Domains** → **heseven.com** → **DNS / Nameservers** (ya **DNS Zone Editor**).
3. Resend ke har record ke liye **Add Record** dabaiye aur ye bhariye:
   - **Type:** Resend jaisa (MX / TXT)
   - **Name:** sirf `send` ya `resend._domainkey` (ya `_dmarc`). **`.heseven.com` mat likhiye**, Hostinger khud jod deta hai.
   - **Points to / Value / Content:** Resend ki value **poori copy-paste** kariye
   - **Priority** (sirf MX ke liye): Resend jaisa (usually `10`)
   - **TTL:** default chhod dijiye
4. **Save / Add Record**.

### ⚠️ Dhyan rakhein

- Pehle se jo records hain (Google ke **MX**, `v=spf1 include:_spf.google.com ~all`, google-site-verification, facebook-domain-verification) unko **delete ya edit mat kariye**.
- Sirf **naye** records add karne hain.
- Agar `_dmarc` record pehle se maujood ho to naya mat banaiye.

---

## Step 3: Resend mein verify karein

1. Resend → **Domains** → **heseven.com** → **Verify DNS Records**.
2. Status **Pending** se **Verified ✅** hone mein 5 minute se kuch ghante lag sakte hain (zyada se zyada 48 ghante).
3. Agar koi record **Failed** dikhaye, to Hostinger mein us record ka **Name** aur **Value** dobara match kariye. Sabse common galti: Name mein `.heseven.com` extra lag jaana, ya value adhoori copy hona.

**Check karne ke liye (optional):** Mac Terminal mein ye command chalaiye. Output mein `p=MIG…` dikhe to DKIM record lag gaya hai.

```bash
dig +short TXT resend._domainkey.heseven.com
```

---

## Step 4: Website ki setting badlein

Domain **Verified ✅** hone ke baad project mein `wrangler.jsonc` file kholiye aur `vars` wala hissa aisa kar dijiye:

```jsonc
"vars": {
  "CONTACT_TO": "dhiraj@heseven.com",
  "CONTACT_FROM": "Heseven Website <website@heseven.com>",
},
```

(Upar wale "TEMPORARY" comments bhi hata dijiye.)

Phir deploy kariye:

```bash
npm run deploy
```

Output mein ye dikhna chahiye:

```
env.CONTACT_TO ("dhiraj@heseven.com")
env.CONTACT_FROM ("Heseven Website <website@heseven.com>")
```

> Ek se zyada logon ko email chahiye, jaise Dhiraj + info@? Ye code change hai (`worker/index.ts` mein `to` ko list banana). Developer ya Claude se karwa lijiye.

---

## Step 5: Test karein

1. Live site ka contact page kholiye: https://heseven-website.heseven-website.workers.dev/contact/ (domain jodne ke baad https://heseven.com/contact/).
2. Form bhariye. Message mein "TEST" likhiye.
3. **dhiraj@heseven.com** ka inbox check kariye. Spam folder bhi dekhiye.
4. Email aisa dikhna chahiye:
   - **From:** Heseven Website `<website@heseven.com>`
   - **Subject:** `New enquiry: <service> — <naam>`
   - **Reply** dabane par jawab seedha form bharne wale visitor ko jayega.

---

## Tab tak ke liye (optional): Gmail forwarding

Domain verify hone tak enquiries Dhiraj ko chahiye to:

1. heseven07@gmail.com mein login → ⚙️ **Settings** → **See all settings**
2. **Forwarding and POP/IMAP** → **Add a forwarding address** → `dhiraj@heseven.com`
3. Dhiraj ke inbox mein confirmation link aayega, use click kariye.
4. Wapas Gmail settings mein **Forward a copy of incoming mail to dhiraj@heseven.com** chuniye → **Save Changes**.

---

## Security notes

- **API key kabhi bhi code, chat ya command line mein mat likhiye.** Sirf is command ke "Enter a secret value" prompt par paste kariye:
  ```bash
  npx wrangler secret put RESEND_API_KEY
  ```
- Purani `re_9eWh…` key galti se expose ho gayi thi. Agar Resend → **API Keys** mein ab bhi dikh rahi hai, to **delete** kar dijiye. Abhi wali nayi key ko mat chhediye.
- Key badalni ho to Resend mein nayi key banaiye, upar wali command dobara chalaiye, phir purani key delete kariye.

---

## Problem aaye to

| Problem                                                                    | Kya karein                                                                                                            |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Form bhejne par "couldn't send" aur email link dikhe                       | Key ya domain ki dikkat hai. Cloudflare dashboard → Workers → heseven-website → **Logs** mein `resend failed` dekhiye |
| Resend error: "You can only send testing emails to your own email address" | Domain abhi verified nahi hai. Step 3 dobara check kariye                                                             |
| Resend error: "domain is not verified"                                     | `CONTACT_FROM` mein `@heseven.com` hai par domain verified nahi. Step 3                                               |
| Email spam mein ja raha hai                                                | "Not spam" mark kariye. `_dmarc` record add kiya ho to madad milti hai                                                |
| Kuch samajh na aaye                                                        | Resend ki screen ka screenshot lekar developer ya Claude ko bhejiye                                                   |

---

_Related files: `wrangler.jsonc` (CONTACT_TO / CONTACT_FROM), `worker/index.ts` (email bhejne ka code), `README.md` → "Contact form"._
