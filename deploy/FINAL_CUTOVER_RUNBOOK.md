# CareNest — Same-day Emergent → AWS cutover (minimum manual work)

**Already done:** EC2 verify 36/0, Atlas, nginx, frontend, SEO on disk, PRs #2–#14.  
**Still true today:** Public `carenesthomehealth.in` is Emergent until DNS flips.

---

## You run ONE command

On EC2:

```bash
cd /opt/carenest/app
sudo -u carenest git pull --ff-only origin main
sudo cp -n deploy/env/cutover.env.example /etc/carenest/cutover.env
sudo nano /etc/carenest/cutover.env   # fill secrets once (see below)
sudo bash deploy/scripts/cutover_today.sh
```

Scripts do: DNS rollback snapshot, EIP detect, Mongo sync, GA/GTM write, SSL nginx, optional Cloudflare DNS API, live AWS-origin proof (health/mongo/SEO/lead/chat).

Re-check anytime:

```bash
sudo bash deploy/scripts/cutover_verify_live.sh
```

---

## Fill `/etc/carenest/cutover.env` once (script writes the rest)

| Variable | Required? | Why |
|----------|-----------|-----|
| `EMERGENT_MONGO_URL` + `EMERGENT_DB_NAME` | Unless `SKIP_MONGO=1` | Final data sync |
| `GA_MEASUREMENT_ID` (+ `GTM_ID`) | Strongly yes | Ads/GA stop being blind |
| `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ZONE_ID` | Optional | **Removes DNS UI clicks** |
| `CF_ORIGIN_CERT` + `CF_ORIGIN_KEY` paths | For Full (strict) | Script installs nginx SSL |

---

## Manual clicks you cannot avoid (unless CF API token is set)

### A. Cloudflare Origin Certificate (~2 min) — once

1. Cloudflare → **SSL/TLS** → **Origin Server** → **Create certificate**  
   Hosts: `carenesthomehealth.in`, `*.carenesthomehealth.in`
2. On EC2 (paste when prompted by `tee`):

```bash
sudo mkdir -p /etc/ssl/cloudflare
sudo tee /etc/ssl/cloudflare/carenest.pem >/dev/null   # paste cert, Ctrl-D
sudo tee /etc/ssl/cloudflare/carenest.key >/dev/null   # paste key, Ctrl-D
sudo chmod 600 /etc/ssl/cloudflare/carenest.key
sudo CUTOVER_SSL_MODE=cloudflare bash deploy/scripts/cutover_today.sh --phase ssl
```

3. Cloudflare → **SSL/TLS** → **Full (strict)**  
   *(API token also sets this automatically.)*

### B. DNS flip (~2 min) — only if no Cloudflare API token

Edit A records where they live (Hostinger DNS or Cloudflare DNS):

| Type | Name | Value | Proxy |
|------|------|-------|-------|
| A | `@` | *(EIP printed by script)* | Proxied |
| A | `www` | *(same EIP)* | Proxied |

**Do not change:** MX, SPF, DKIM, `google-site-verification` TXT.  
Then: **Caching → Purge Everything**.

### C. Google consoles (~6 min total) — no API in this repo

| Console | Clicks |
|---------|--------|
| Search Console | Resubmit `https://carenesthomehealth.in/sitemap.xml`; inspect `/locations` canonical |
| GA4 | Realtime/DebugView → visit site → see page_view |
| Google Ads | Test lead → Tag Assistant shows `lead_submit` |

### D. Emergent off — only at T+72h

Keep Emergent running unused 72h while Step live-verify stays green → cancel Emergent hosting + revoke keys.

### E. AWS Elastic IP (only if script IP ≠ Console EIP)

EC2 → Elastic IPs → Associate to this instance. Rare if already associated.

---

## Automation map

| Step | Cursor automated (script) | Your manual work | Est. time |
|------|---------------------------|------------------|-----------|
| 0 Rollback DNS snapshot | Yes — `cutover_today.sh` | None | 10s |
| 1 EC2 Elastic IP | Yes — detects + saves | Only if EIP not associated (Console) | 0–1 min |
| 2 Mongo Emergent→Atlas | Yes — `cutover_mongo_final.sh` | Paste URI into `cutover.env` once | 2–5 min |
| 3 GA4/GTM env | Yes — writes `backend/.env` + restart | Paste IDs into `cutover.env` once | 30s |
| 4 Origin SSL | Yes — `cutover_ssl_apply.sh` | Create Origin Cert in CF UI + paste PEMs once | 2 min |
| 5 DNS `@`/`www`→EIP | Yes **if** CF API token | Else: 2 A records + purge (table above) | 0–2 min |
| 6 Public AWS origin proof | Yes — `cutover_verify_live.sh` | None | 30s |
| 7 Backend API live | Yes — in verify script | None | — |
| 8 Frontend live | Yes — in verify script | None | — |
| 9 Live SEO | Yes — prerender/canonical checks | None | — |
| 10 Search Console | No (Google login) | Resubmit sitemap + inspect `/locations` | 2 min |
| 11 GA4 | Partial (sets IDs; verifies `ga_id`) | Realtime confirm in GA UI | 1 min |
| 12 Google Ads | Partial (fires `lead_submit` via test lead) | Tag Assistant / Ads UI confirm | 3 min |
| 13 Mongo prod | Yes — health + lead create | None (check Atlas UI optional) | — |
| 14 SES email | Partial — creates lead | Confirm inbox received mail | 1 min |
| 15 AI chat | Yes — streams SSE | None | 30s |
| 16 Rollback | Yes — instructions + CF API rollback | Restore DNS if needed | 2 min |
| 17 Emergent off | No | Cancel Emergent at T+72h | 2 min |

**Your irreducible manual budget today (with CF API token + origin cert pasted):** ~6–8 min Google UI + 72h wait.  
**Without CF API token:** add ~2 min DNS clicks.

---

## PASS gate (script prints this when green)

`cutover_verify_live.sh` exit 0 requires:

- `/api/health` contains `"mongo":"ok"`
- `/api/health/mongo` → 200  
- No `__emg_*` cookies  
- `/locations` ≠ home body; canonical is `/locations`  
- robots + sitemap OK; lead + chat OK  

Then finish GSC/GA/Ads clicks, wait 72h:

> **Emergent is no longer serving production traffic and can be safely shut down.**

---

## Rollback

```bash
# With API token:
sudo bash deploy/scripts/cutover_dns_cloudflare.sh rollback
# Or restore A records from:
#   /var/backups/carenest/cutover-*/rollback-dns.txt
# Then: Cloudflare → Purge Everything
```
