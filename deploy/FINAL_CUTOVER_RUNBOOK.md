# CareNest — Final Emergent → AWS Cutover Runbook

**Scope:** Remaining production cutover only.  
**Already done (do not repeat):** EC2 install, verify 36/0, Atlas on EC2, frontend build, nginx, SEO files on disk, PRs #2–#14.

**Current blocker:** Public `https://carenesthomehealth.in` still serves **Emergent** (`__emg_*` cookies, health without `mongo`, identical etag to `elite-homecare-ui.emergent.host`).

**Fill once before starting:**

```text
EC2_EIP=________________        # AWS Console → EC2 → Elastic IPs
ADMIN_TOKEN=____________________  # from /opt/carenest/app/backend/.env
MONGO_URL=______________________  # Atlas URI already on EC2
EMERGENT_MONGO_URL=_____________  # Emergent Mongo (final dump only)
GA_MEASUREMENT_ID=G-____________
GTM_ID=GTM-_____________________   # optional if using gtag-only
CERTBOT_EMAIL=info@carenesthomehealth.in
```

**Do not touch during cutover:** MX, SPF, DKIM, Titan mail, Google Site Verification TXT (`google-site-verification=…`).

---

## Step 0 — Save rollback DNS (mandatory before any DNS edit)

**Action:** Snapshot current public DNS.

**Commands** (laptop or EC2):

```bash
mkdir -p /tmp/carenest-cutover
cd /opt/carenest/app 2>/dev/null || true
bash deploy/scripts/save_rollback_dns.sh | tee /tmp/carenest-cutover/rollback-dns-$(date +%Y%m%d).txt
```

**Expected:** File lists current A/AAAA/CNAME for apex + www (today: Cloudflare anycast, not EC2).

**PASS:** File saved and copied off-box (email/Drive). You can restore Emergent targeting from it.

---

## Step 1 — Confirm EC2 Elastic IP

**Action:** Ensure the running instance has a permanent public IPv4.

**Commands:**

```bash
# On EC2
curl -sS --max-time 5 https://checkip.amazonaws.com; echo
```

**AWS Console:** EC2 → Elastic IPs → Associate `EC2_EIP` to this instance (if not already).

**Expected:** Printed IP equals `EC2_EIP` and is **not** `172.66.*` / `162.159.*` (those are Cloudflare).

**PASS:** `EC2_EIP` noted and associated.

---

## Step 2 — Final Mongo sync (Emergent → Atlas)

**Action:** One last dump from Emergent into the Atlas DB EC2 already uses (avoids losing leads created on Emergent after the last restore).

**Commands** (laptop with `mongodump` / `mongorestore`):

```bash
export EMERGENT_MONGO_URL='...'   # Emergent URI
export EMERGENT_DB_NAME='...'     # Emergent DB name
export MONGO_URL='...'            # same Atlas URI as EC2 backend/.env

mongodump --uri="$EMERGENT_MONGO_URL" --db="$EMERGENT_DB_NAME" --out=/tmp/final-emergent-dump

# Restore into Atlas (DROP replaces collections — take Atlas snapshot/backup first in Atlas UI)
mongorestore --drop --uri="$MONGO_URL" \
  --nsFrom="${EMERGENT_DB_NAME}.*" --nsTo="carenest.*" \
  /tmp/final-emergent-dump/${EMERGENT_DB_NAME}
```

**On EC2 after restore:**

```bash
sudo systemctl restart carenest-api
curl -sS http://127.0.0.1:8000/api/health
# Expect: {"status":"healthy","mongo":"ok",...}
```

**PASS:** Local health includes `"mongo":"ok"`; admin lead counts on AWS look sane vs Emergent admin (spot-check).

---

## Step 3 — Set analytics IDs on EC2 (before public flip)

**Action:** Live `/api/config/public` currently returns empty `ga_id`/`gtm_id`. Set them on AWS so Ads/GA work the moment traffic flips.

**Commands** (EC2 as root):

```bash
sudo nano /opt/carenest/app/backend/.env
# Set (no quotes drift):
# GA_MEASUREMENT_ID=G-XXXXXXXX
# GTM_ID=GTM-XXXXXXX          # if you use GTM
# META_PIXEL_ID=...             # optional

sudo systemctl restart carenest-api
curl -sS http://127.0.0.1:8000/api/config/public
```

**Expected:** JSON shows non-empty `"ga_id"` (and `gtm_id` if set).

**PASS:** `ga_id` matches your GA4 Measurement ID.

---

## Step 4 — Origin SSL on EC2 (pick ONE path)

Public Cloudflare today terminates TLS (Google Trust / CF). Origin must speak HTTPS for **Full (strict)**, or stay HTTP only with CF **Flexible** (not recommended).

### Path A — Cloudflare Origin Certificate (recommended with orange cloud)

**Action:**

1. Cloudflare → SSL/TLS → Origin Server → Create certificate (hosts: `carenesthomehealth.in`, `*.carenesthomehealth.in`). Save cert + key on EC2:

```bash
sudo mkdir -p /etc/ssl/cloudflare
sudo nano /etc/ssl/cloudflare/carenest.pem    # paste cert
sudo nano /etc/ssl/cloudflare/carenest.key    # paste key
sudo chmod 644 /etc/ssl/cloudflare/carenest.pem
sudo chmod 600 /etc/ssl/cloudflare/carenest.key
```

2. Install Cloudflare nginx site from repo:

```bash
cd /opt/carenest/app
sudo sed \
  -e 's|__DOMAIN__|carenesthomehealth.in|g' \
  -e 's|__WWW_DOMAIN__|www.carenesthomehealth.in|g' \
  -e 's|__DOCROOT__|/var/www/carenest/frontend|g' \
  -e 's|__CF_CERT__|/etc/ssl/cloudflare/carenest.pem|g' \
  -e 's|__CF_KEY__|/etc/ssl/cloudflare/carenest.key|g' \
  deploy/nginx/carenesthomehealth.in.cloudflare.conf \
  > /etc/nginx/sites-available/carenesthomehealth.in
sudo ln -sfn /etc/nginx/sites-available/carenesthomehealth.in \
  /etc/nginx/sites-enabled/carenesthomehealth.in
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx
```

3. Cloudflare → SSL/TLS → Overview → **Full (strict)**.

4. Persist mode:

```bash
grep -q '^SSL_MODE=' /etc/carenest/deploy.env \
  && sudo sed -i 's/^SSL_MODE=.*/SSL_MODE=cloudflare/' /etc/carenest/deploy.env \
  || echo 'SSL_MODE=cloudflare' | sudo tee -a /etc/carenest/deploy.env
```

**PASS:** `curl -sk --resolve carenesthomehealth.in:443:127.0.0.1 https://carenesthomehealth.in/api/health` returns `"mongo":"ok"`.

### Path B — Certbot Let’s Encrypt (DNS must hit EC2 on :80 first)

**Action:** Temporarily set DNS A `@`/`www` → `EC2_EIP` with **proxy OFF** (grey cloud / Hostinger A → EIP), then:

```bash
cd /opt/carenest/app
sudo CARENEST_SSL_MODE=certbot CERTBOT_EMAIL=info@carenesthomehealth.in \
  bash -c 'source deploy/lib/common.sh; source deploy/lib/ssl.sh; DOMAIN=carenesthomehealth.in WWW_DOMAIN=www.carenesthomehealth.in SSL_MODE=certbot CERTBOT_EMAIL=info@carenesthomehealth.in configure_ssl'
# Or re-run installer SSL only if you prefer: follow deploy/lib/ssl.sh certbot path after DNS grey→EIP
sudo certbot --nginx -d carenesthomehealth.in -d www.carenesthomehealth.in \
  --agree-tos -m info@carenesthomehealth.in --redirect -n
sudo nginx -t && sudo systemctl reload nginx
```

Then turn Cloudflare proxy **ON** and SSL mode **Full (strict)**.

**PASS:** Cert files exist under `/etc/letsencrypt/live/carenesthomehealth.in/` and local HTTPS health shows `"mongo":"ok"`.

---

## Step 5 — Cloudflare / Hostinger DNS flip (exact records)

**Where to edit:** Your public NS are `horizon.dns-parking.com` / `orbit.dns-parking.com` (Hostinger). Edit **A records where they are actually hosted** (Hostinger DNS **or** Cloudflare DNS if the zone is active there). Change only web records.

**Exact records after flip:**

| Type | Name | Value | Proxy / notes |
|------|------|-------|----------------|
| A | `@` | `EC2_EIP` | Cloudflare: **Proxied (orange)** after origin SSL works |
| A | `www` | `EC2_EIP` | Proxied (or CNAME `www` → `carenesthomehealth.in`) |
| — | MX / TXT / SPF / DKIM / `google-site-verification` | **unchanged** | Leave Titan + GSC alone |

**Action order:**

1. Set `@` and `www` → `EC2_EIP`.
2. Purge Cloudflare cache: Caching → Configuration → **Purge Everything**.
3. Wait 1–5 minutes (TTL often 300).

**Commands to confirm DNS:**

```bash
dig +short A carenesthomehealth.in @8.8.8.8
dig +short A www.carenesthomehealth.in @8.8.8.8
```

**Expected:** Still Cloudflare anycast if orange-cloud; with grey cloud, must equal `EC2_EIP`.  
**Origin proof is Step 6** (not dig alone when proxied).

**PASS:** Records saved; purge done; no MX/TXT changed.

---

## Step 6 — Public domain = AWS (not Emergent)

**Action:** Prove public origin is EC2.

**Commands:**

```bash
# MUST include mongo — Emergent health does NOT
curl -sS https://carenesthomehealth.in/api/health
# PASS shape: {"status":"healthy","mongo":"ok","timestamp":"..."}

curl -sS -o /dev/null -w '%{http_code}\n' https://carenesthomehealth.in/api/health/mongo
# PASS: 200  (Emergent returns 404)

curl -sSI https://carenesthomehealth.in/ | grep -iE 'set-cookie|etag|server'
# PASS: NO __emg_vid / __emg_sid cookies
```

**PASS all three:**

1. Health JSON contains `"mongo":"ok"`
2. `/api/health/mongo` → **200**
3. No `__emg_*` cookies on homepage

---

## Step 7 — Backend API (public)

**Commands:**

```bash
curl -sS https://carenesthomehealth.in/api/health | grep -q '"mongo":"ok"' && echo PASS_health
curl -sS https://carenesthomehealth.in/api/config/public | grep -q 'CareNest Home Health' && echo PASS_config

export ADMIN_TOKEN='...'   # from EC2 backend/.env
curl -sS https://carenesthomehealth.in/api/admin/stats \
  -H "X-Admin-Token: $ADMIN_TOKEN" | grep -q leads_total && echo PASS_admin
```

**PASS:** `PASS_health`, `PASS_config`, `PASS_admin` all print.

---

## Step 8 — Frontend (public)

**Commands:**

```bash
curl -sS https://carenesthomehealth.in/ | grep -qi 'CareNest' && echo PASS_home
curl -sSI https://www.carenesthomehealth.in/ | head -15
# Expect 200 or 301→apex with CF/nginx

# Full automated suite
cd /opt/carenest/app
ADMIN_TOKEN="$ADMIN_TOKEN" BASE_URL=https://carenesthomehealth.in \
  bash deploy/scripts/cutover_verify.sh
```

**PASS:** `cutover_verify.sh` exits 0 (“All checks passed”). Browser: home, services, book, contact load with padlock.

---

## Step 9 — Technical SEO on LIVE public site

**Commands:**

```bash
curl -sS https://carenesthomehealth.in/robots.txt | grep -q 'Sitemap: https://carenesthomehealth.in/sitemap.xml' && echo PASS_robots
curl -sS https://carenesthomehealth.in/sitemap.xml | grep -q '<urlset' && echo PASS_sitemap

# Prerender: pages must DIFFER (Emergent SPA: identical shells)
curl -sS https://carenesthomehealth.in/locations -o /tmp/loc.html
curl -sS https://carenesthomehealth.in/services -o /tmp/svc.html
curl -sS https://carenesthomehealth.in/ -o /tmp/home.html
diff -q /tmp/home.html /tmp/loc.html >/dev/null && echo FAIL_still_spa || echo PASS_locations_prerender
diff -q /tmp/home.html /tmp/svc.html >/dev/null && echo FAIL_still_spa || echo PASS_services_prerender

# Canonical must NOT be homepage on /locations
grep -oP 'rel="canonical" href="\K[^"]+' /tmp/loc.html
# PASS: https://carenesthomehealth.in/locations  (or /locations/)

grep -q 'application/ld+json' /tmp/home.html && echo PASS_schema
curl -sS -o /dev/null -w '%{http_code}\n' https://carenesthomehealth.in/locations
curl -sS -o /dev/null -w '%{http_code}\n' https://carenesthomehealth.in/services
# PASS: 200 and 200
```

**PASS:** robots + sitemap OK; locations/services HTTP 200; home ≠ locations body; locations canonical is `/locations` (not `/`); JSON-LD present.

---

## Step 10 — Google Search Console

**Action (UI only — keep existing property):**

1. Confirm TXT verification record still present (do not delete).
2. URL Inspection → `https://carenesthomehealth.in/` → Request indexing (optional).
3. Sitemaps → submit/resubmit `https://carenesthomehealth.in/sitemap.xml`.
4. URL Inspection → `https://carenesthomehealth.in/locations` → confirm canonical is `/locations`, not homepage soft-404.

**PASS:** Sitemap shows “Success”; `/locations` inspection does not report homepage as selected canonical.

---

## Step 11 — GA4 / GTM

**Commands:**

```bash
curl -sS https://carenesthomehealth.in/api/config/public
# PASS: "ga_id":"G-..." non-empty
```

**Browser:**

1. Open site → DevTools → Network → filter `google` / `gtm` → GA4/GTM scripts load.
2. GA4 Admin → DebugView (or Realtime): page_view on home.
3. If GTM: Tag Assistant shows container `GTM-…` firing.

**PASS:** Realtime/DebugView shows your hit from a test visit; config public non-empty `ga_id`.

---

## Step 12 — Google Ads conversions

**Action:**

1. Google Ads → Goals → Conversions: ensure actions exist for lead / appointment / calls (or GTM triggers on `lead_submit`, `appointment_booked`, `phone_click` from `frontend/src/lib/analytics.js`).
2. Submit a test lead on the live form.
3. Tag Assistant / Ads “Recent conversions” (may take minutes–hours).

**PASS:** Test `lead_submit` (or GTM equivalent) visible in Tag Assistant; conversion action linked to the GA4/GTM property that receives live hits.  
**Note:** Until Step 3 IDs are set, Ads stays blind — do not enable Maximize Conversions without this PASS.

---

## Step 13 — MongoDB production (via public API)

**Commands:**

```bash
curl -sS https://carenesthomehealth.in/api/health
# PASS: "mongo":"ok"

PHONE="9$(date +%s | tail -c 10)"
curl -sS -X POST https://carenesthomehealth.in/api/leads \
  -H 'Content-Type: application/json' \
  -d "{\"name\":\"Cutover Mongo Check\",\"phone\":\"$PHONE\",\"city\":\"Pune\",\"service\":\"Home Nursing\"}"
# PASS: JSON with "id"

curl -sS https://carenesthomehealth.in/api/admin/stats \
  -H "X-Admin-Token: $ADMIN_TOKEN" | grep -q leads_total && echo PASS_stats
```

**PASS:** Lead create returns `id`; admin stats readable; Atlas Metrics show connections from EC2 IP.

---

## Step 14 — Email (SES)

**Action:** Submit contact/lead on live site (or reuse Step 13 lead).

**PASS:**

1. API accepts lead (`id` returned).
2. Inbox `info@carenesthomehealth.in` receives SES notification within a few minutes.
3. EC2 logs show no SES auth errors:

```bash
sudo journalctl -u carenest-api -n 80 --no-pager | grep -iE 'SES|smtp|email|ERROR' || true
```

If SES still sandboxed: verify recipient identity in SES console first.

---

## Step 15 — AI chat

**Commands:**

```bash
curl -sS -N --max-time 45 -X POST https://carenesthomehealth.in/api/chat/stream \
  -H 'Content-Type: application/json' \
  -d '{"session_id":"cutover-final","message":"Do you offer home nursing in Pune?"}' \
  | head -c 400
```

**PASS:** SSE/text tokens stream (non-empty); browser chat widget answers. No Emergent LLM errors in journal.

---

## Step 16 — Rollback plan (if any Step 6–9 FAIL)

**Action:** Restore pre-cutover web DNS from Step 0 file; purge CF cache; keep EC2 running.

1. Set `@` / `www` back to values in `rollback-dns-*.txt` (Emergent / prior targets).
2. Cloudflare → Purge Everything.
3. Confirm Emergent fingerprints return:

```bash
curl -sS https://carenesthomehealth.in/api/health
# Emergent shape (no mongo field) is OK for rollback
curl -sSI https://carenesthomehealth.in/ | grep __emg_ || true
```

**PASS (rollback):** Site loads on Emergent again; MX untouched; EC2 left intact for a second attempt.

---

## Step 17 — Stability window, then Emergent off

| When | Action | PASS |
|------|--------|------|
| T+0 → T+2h | Watch `journalctl -u carenest-api -f`; spot-check leads/chat | No crash loops; new leads in Atlas |
| T+2h → T+72h | Keep **Emergent app running but unused** | AWS remains origin (Step 6 still PASSes) |
| **T+72h** | Cancel Emergent hosting; revoke Emergent LLM/email keys; remove Emergent custom domain | Step 6 still PASSes after revoke |

**Do not turn Emergent off before T+72h unless rollback is impossible and AWS has been stable with all PASSes below.**

---

## Final gate — all must PASS

- [ ] Step 6: public health has `"mongo":"ok"`; `/api/health/mongo` → 200; no `__emg_*`
- [ ] Step 7–8: API + `cutover_verify.sh` OK
- [ ] Step 9: live SEO prerender + correct `/locations` canonical
- [ ] Step 11–12: `ga_id` set; Ads/GA events observed
- [ ] Step 13–15: Mongo lead, SES email, chat stream OK
- [ ] T+72h stability with Emergent unused

When **every** box above is checked:

> **Emergent is no longer serving production traffic and can be safely shut down.**
