# DNS Cutover — `carenesthomehealth.in` (Hostinger)

**Registrar**: Hostinger  ·  **hPanel** → `Domains` → `carenesthomehealth.in` → `DNS / Nameservers`

**Goal**: point `carenesthomehealth.in` and `www.carenesthomehealth.in` to the new CareNest Home Health site — and set up Titan Email on the new domain.

---

## Step 1 — Website (A / CNAME)
After Emergent deployment, you will get one of:

### If Emergent gives you an IP (A record):
```
Type   Host   Value              TTL
A      @      <EMERGENT_IP>      300
CNAME  www    carenesthomehealth.in    300
```

### If Emergent gives you a hostname (CNAME / ALIAS — preferred):
```
Type              Host   Value                                       TTL
CNAME (or ALIAS)  @      <emergent-app>.preview.emergentagent.com    300
CNAME             www    <emergent-app>.preview.emergentagent.com    300
```
> Note: Hostinger's DNS editor supports CNAME on the apex (`@`) via their "CNAME flattening" — this works out of the box.

**Currently on Hostinger the domain shows nameservers**:
- `horizon.dns-parking.com`
- `orbit.dns-parking.com`

**No action needed on nameservers** — keep them as-is. Just edit the DNS records under those nameservers.

---

## Step 2 — Titan Email on new domain

Since the old `javahomecare.in` had Titan email, you'll need to set up Titan on the new domain too.

**Option A (Recommended) — Fresh Titan mailbox at carenesthomehealth.in**
1. In Hostinger hPanel → `Emails` → `Add mailbox` → Titan Business Email
2. Create `info@carenesthomehealth.in`
3. Hostinger will auto-add the required MX / SPF / DKIM records — accept them
4. Test by sending a mail to yourself

**Option B — Migrate existing Titan mailbox from javahomecare.in**
1. From Hostinger support / Titan support, request domain change for the existing mailbox
2. Existing emails/contacts are preserved

**MX records that will be added (auto by Titan/Hostinger)**:
```
MX   @   mx1.titan.email   priority 10
MX   @   mx2.titan.email   priority 20
TXT  @   v=spf1 include:spf.titan.email ~all
```
Plus DKIM CNAMEs (`titan1._domainkey`, `titan2._domainkey`).

**⚠️ DO NOT delete these records** once added — email won't work.

---

## Step 3 — Redirect old domain (optional but recommended for SEO)
If you still hold `javahomecare.in`:
- Set up a **301 permanent redirect** from all `javahomecare.in/*` → `https://carenesthomehealth.in/*`
- Hostinger hPanel → `Domains` → `javahomecare.in` → `Redirects` (or use a `.htaccess` rule if the domain is with another provider)
- This preserves your SEO equity (backlinks, existing rankings)

---

## Step 4 — After DNS change (verification)
```bash
dig +short A carenesthomehealth.in       # should show Emergent IP / CNAME chain
dig +short MX carenesthomehealth.in      # should show mx1.titan.email
dig +short TXT carenesthomehealth.in     # should show v=spf1 include:spf.titan.email
```
- Send + receive test email at `info@carenesthomehealth.in`
- Visit `https://carenesthomehealth.in` — new site loads with padlock (TLS auto-provisioned by Emergent)

---

## Step 5 — Submit sitemap to Google
Once live:
1. Google Search Console → Add property → `carenesthomehealth.in`
2. Verify ownership (TXT record method — Hostinger DNS)
3. Submit sitemap: `https://carenesthomehealth.in/sitemap.xml` (290 URLs waiting)
4. Repeat in Bing Webmaster Tools

---

## Rollback safety
Hostinger keeps DNS history for 30 days. If anything breaks, restore the previous record. Since MX/TXT/DKIM are separate from A/CNAME, changing one does not affect the other.

---

**Contact during cutover**
- Hostinger 24×7 chat (fastest): hPanel top-right chat icon
- CareNest ops: info@carenesthomehealth.in · +91 9175724546
