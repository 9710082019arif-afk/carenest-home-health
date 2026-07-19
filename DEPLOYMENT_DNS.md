# DNS Cutover — `javahomecare.in` → Emergent-hosted site

**Goal**: point `javahomecare.in` (and `www.javahomecare.in`) to the new site **without breaking Titan Email**.

## 1) DO NOT TOUCH (email keeps working)
Leave these MX + related records exactly as they are:

- `MX` records (Titan): usually `mx1.titan.email`, `mx2.titan.email` (priority 10, 20)
- `TXT` for SPF: `v=spf1 include:spf.titan.email ~all`
- `TXT` for DKIM: `titan1._domainkey.javahomecare.in` (and similar Titan DKIM CNAMEs)
- `TXT` for DMARC: `_dmarc.javahomecare.in` (if configured)
- Any `CNAME` under `mail.` / `webmail.` etc.

> Rule of thumb: **do not change any record whose host is `@`, `mail`, `webmail`, `_dmarc`, `_domainkey`, or which has type `MX`/`TXT` referring to Titan.**

## 2) CHANGE / ADD (website)

You'll get the exact IP / host from the Emergent deploy dashboard after we deploy. Two common patterns:

### Option A — A record (if you get an IPv4)
```
Type   Host   Value                 TTL
A      @      <EMERGENT_PUBLIC_IP>  300
```

### Option B — CNAME apex flattening / ALIAS (preferred if the provider supports it)
```
Type              Host   Value                             TTL
ALIAS / ANAME     @      <emergent-app>.preview.emergentagent.com   300
```

### `www` subdomain
```
Type   Host   Value                                       TTL
CNAME  www    <emergent-app>.preview.emergentagent.com    300
```

## 3) TLS / HTTPS
Emergent auto-provisions Let's Encrypt certificates once DNS resolves to us. No manual cert action required.

## 4) Verification checklist (after DNS change)
1. `dig +short A javahomecare.in`      → Emergent IP (or CNAME chain)
2. `dig +short MX javahomecare.in`     → **still Titan MX** (unchanged)
3. `dig +short TXT javahomecare.in`    → **SPF still present**
4. Send a test email to `info@javahomecare.in` and reply from it — both must work.
5. Visit `https://javahomecare.in` — new site loads with padlock.

## 5) Rollback (safety)
Registrar keeps DNS history. If anything breaks, restore the previous `A` / `CNAME` record. Because we never touched MX/TXT/DKIM, email is unaffected in either state.

## 6) What Emergent will provide before you cut over
- The exact `A` or `CNAME` target
- A pre-deploy dry-run URL so you can preview
- Support during the 60-minute propagation window

---

**Contacts**
- Emergent deployment: through your Emergent dashboard
- Java Home Care ops: info@javahomecare.in · +91 9175724546
