# CareNest Home Health — Complete AWS Migration Plan
# Leave Emergent Forever

**Domain:** `carenesthomehealth.in` / `www.carenesthomehealth.in`  
**Current production:** Emergent (`elite-homecare-ui.emergent.host`) behind Cloudflare  
**Target:** Single AWS EC2 (Ubuntu), Nginx, systemd FastAPI, Atlas or local MongoDB, AWS SES + Anthropic

## One-command deploy (use this)

```bash
cd /opt/carenest/app
sudo bash deploy/install.sh
```

See [`deploy/README.md`](./README.md). The sections below are reference architecture and DNS/Mongo cutover notes — the installer performs package, env, systemd, nginx, SSL, build, and health verification automatically.

---

## 0. Architecture (target)

```
Internet
   │
   ▼
Cloudflare (DNS + orange-cloud proxy + SSL flexible/full)
   │
   ▼
EC2 Elastic IP  →  Nginx :443/:80
                      ├─ /api/*  →  127.0.0.1:8000  (uvicorn / FastAPI systemd)
                      └─ /*      →  /var/www/carenest/frontend  (React build)
MongoDB: same EC2 (dev/simple) OR MongoDB Atlas (recommended for production)
Email: AWS SES (replaces integrations.emergentagent.com)
Chat LLM: Anthropic API direct (replaces emergentintegrations / EMERGENT_LLM_KEY)
```

### What you permanently leave behind

| Emergent piece | AWS replacement |
|---|---|
| Emergent hosting / preview / deploy | EC2 + Nginx + systemd |
| Managed Mongo on Emergent | MongoDB on EC2 **or** Atlas |
| `EMERGENT_EMAIL_KEY` + `integrations.emergentagent.com` | **AWS SES** |
| `EMERGENT_LLM_KEY` + `emergentintegrations` | **Anthropic API key** + small code change (see §7 / `deploy/patches`) |
| `.emergent/` cron webhooks | Not required for CareNest core (omit) |
| `@emergentbase/visual-edits` | Omit in production builds |

---

## 1. AWS EC2 deployment guide

### 1.1 Create resources

1. **Region:** `ap-south-1` (Mumbai) recommended for India latency.
2. **EC2:**
   - AMI: **Ubuntu Server 24.04 LTS**
   - Instance: **t3.small** minimum (t3.medium if Mongo on-box + traffic grows)
   - Storage: **40 GB gp3**
   - Key pair: create/download `.pem`
3. **Security group** `carenest-sg`:

| Type | Port | Source |
|---|---|---|
| SSH | 22 | Your IP only |
| HTTP | 80 | `0.0.0.0/0` |
| HTTPS | 443 | `0.0.0.0/0` |
| MongoDB | 27017 | **Do not open publicly** (localhost or Atlas SG only) |

4. **Elastic IP:** Allocate and associate to the instance. Note it as `EC2_EIP`.
5. **IAM (optional but recommended for SES):**
   - Create IAM user `carenest-ses` with policy `AmazonSESFullAccess` (or tighter custom send-only).
   - Create access key → used only if sending via boto3; this guide uses SMTP SMTP credentials from SES (simpler).

### 1.2 First SSH login

```bash
chmod 400 carenest-aws.pem
ssh -i carenest-aws.pem ubuntu@EC2_EIP
```

### 1.3 Base packages

Prefer the automated bootstrap (detects system Python — do **not** hardcode `python3.12`):

```bash
sudo bash /opt/carenest/app/deploy/scripts/bootstrap_ec2.sh
# or from a cloned checkout:
# sudo bash deploy/scripts/bootstrap_ec2.sh
```

Manual equivalent (works on current AWS Ubuntu images with Python 3.12+ / 3.14):

```bash
sudo apt update && sudo apt -y upgrade
sudo apt -y install \
  nginx certbot python3-certbot-nginx \
  git curl build-essential \
  python3 python3-venv python3-pip \
  mongodb-org \
  ufw fail2ban
python3 --version   # e.g. 3.14.x — use this interpreter for venv
```

> **Do not install `python3.12` / `python3.12-venv` by name** on images that only ship a newer `python3` — apt will fail with “Unable to locate package”.  
> **MongoDB on Ubuntu:** follow [MongoDB apt repo](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/) if `mongodb-org` is not in default apt.  
> **Preferred production:** skip on-box Mongo; use **MongoDB Atlas** M10+ and set `MONGO_URL` to the Atlas URI (see §6).

### 1.4 Node + Yarn

Bootstrap installs Yarn Classic if missing and keeps an existing Node (e.g. v22). Manual:

```bash
# Only if node is missing — Node 22 LTS example:
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt -y install nodejs
sudo npm install -g yarn@1.22.22
# or: sudo corepack enable && sudo corepack prepare yarn@1.22.22 --activate
node -v && yarn -v
```

### 1.5 App user and directories

```bash
sudo useradd -m -s /bin/bash carenest || true
sudo mkdir -p /opt/carenest /var/www/carenest/frontend /var/log/carenest
sudo chown -R carenest:carenest /opt/carenest /var/www/carenest /var/log/carenest
```

(`bootstrap_ec2.sh` creates `carenest`, `/opt/carenest`, and related dirs automatically.)
### 1.6 Clone repository

```bash
sudo -u carenest -H bash <<'EOF'
cd /opt/carenest
git clone https://github.com/9710082019arif-afk/carenest-home-health.git app
cd app
# Pin to the commit you validated; update as needed
git checkout main
EOF
```

### 1.7 Firewall

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
sudo ufw status
```

---

## 2. Nginx configuration

Copy `deploy/nginx/carenesthomehealth.in.conf` into place:

```bash
sudo cp /opt/carenest/app/deploy/nginx/carenesthomehealth.in.conf \
  /etc/nginx/sites-available/carenesthomehealth.in
sudo ln -sfn /etc/nginx/sites-available/carenesthomehealth.in \
  /etc/nginx/sites-enabled/carenesthomehealth.in
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

Full file contents are in [`deploy/nginx/carenesthomehealth.in.conf`](./nginx/carenesthomehealth.in.conf).

**Behaviour:**
- `/api/` → FastAPI on `127.0.0.1:8000` (SSE-safe: `proxy_buffering off` for chat)
- `/` → React static build with SPA `try_files`
- Security headers + gzip

---

## 3. SSL setup

### Option A — Certbot on EC2 (Cloudflare DNS-only / grey cloud during issue)

```bash
# Point A records to EC2_EIP first with Cloudflare proxy OFF (DNS only)
sudo certbot --nginx -d carenesthomehealth.in -d www.carenesthomehealth.in \
  --agree-tos -m info@carenesthomehealth.in --redirect -n
sudo systemctl status certbot.timer
```

Renewal is automatic via `certbot.timer`.

### Option B — Cloudflare Full (strict) with origin cert (recommended with orange cloud)

1. Cloudflare → SSL/TLS → **Full (strict)**
2. SSL/TLS → Origin Server → Create certificate (15 years) for `carenesthomehealth.in`, `www.carenesthomehealth.in`
3. Save as:

```bash
sudo mkdir -p /etc/ssl/cloudflare
sudo nano /etc/ssl/cloudflare/carenest.pem    # paste certificate
sudo nano /etc/ssl/cloudflare/carenest.key    # paste private key
sudo chmod 600 /etc/ssl/cloudflare/carenest.key
```

4. Use the Cloudflare origin paths already commented in the nginx conf (uncomment SSL server block variant).

### Email TLS note

Keep **Titan MX** records untouched when changing A/CNAME for the website (see §8).

---

## 4. FastAPI systemd service

```bash
sudo cp /opt/carenest/app/deploy/systemd/carenest-api.service \
  /etc/systemd/system/carenest-api.service
sudo systemctl daemon-reload
sudo systemctl enable carenest-api
# start after backend venv + .env exist (§5 / §7)
sudo systemctl start carenest-api
sudo systemctl status carenest-api
sudo journalctl -u carenest-api -f
```

Unit file: [`deploy/systemd/carenest-api.service`](./systemd/carenest-api.service).

### Backend Python install

```bash
sudo -u carenest -H bash <<'EOF'
cd /opt/carenest/app/backend
# Use system python3 (version recorded in /etc/carenest/python.env by bootstrap)
python3 -m venv .venv
source .venv/bin/activatepip install --upgrade pip
pip install -r requirements.txt
# After applying Emergent-exit patch (§7):
# pip install anthropic boto3   # if not already pulled by requirements
EOF
```

Health check:

```bash
curl -sS http://127.0.0.1:8000/api/health
curl -sS http://127.0.0.1:8000/api/config/public
```

---

## 5. React production build deployment

```bash
sudo -u carenest -H bash <<'EOF'
cd /opt/carenest/app/frontend
# Create frontend env for build (see deploy/env/frontend.env.example)
cp /opt/carenest/app/deploy/env/frontend.env.example .env
# Edit REACT_APP_BACKEND_URL=https://carenesthomehealth.in
nano .env

yarn install --frozen-lockfile || yarn install
yarn build

rsync -a --delete build/ /var/www/carenest/frontend/
EOF

sudo chown -R www-data:www-data /var/www/carenest/frontend
sudo find /var/www/carenest/frontend -type d -exec chmod 755 {} \;
sudo find /var/www/carenest/frontend -type f -exec chmod 644 {} \;
```

Redeploy helper script:

```bash
sudo -u carenest /opt/carenest/app/deploy/scripts/deploy_frontend.sh
```

**Important:** CRA bakes `REACT_APP_*` at **build** time. Changing backend URL requires rebuild.

Generate and commit `yarn.lock` once on a clean machine before EC2 if missing from GitHub:

```bash
cd frontend && yarn install && git add yarn.lock && git commit -m "Add yarn.lock for reproducible AWS builds"
```

---

## 6. MongoDB migration

### 6.1 Export from Emergent (run where you have the Emergent `MONGO_URL`)

On a trusted machine with `mongodump` (or inside Emergent workspace if `mongodump` exists):

```bash
# From Emergent backend/.env — NEVER commit this
export EMERGENT_MONGO_URL='mongodb+srv://...emergent...'   # paste real value
export EMERGENT_DB_NAME='...'                              # paste real DB_NAME

mkdir -p ~/carenest-mongo-backup
mongodump --uri="$EMERGENT_MONGO_URL" --db="$EMERGENT_DB_NAME" \
  --out=~/carenest-mongo-backup/$(date +%Y%m%d)

tar -czf ~/carenest-mongo-backup.tgz -C ~/carenest-mongo-backup .
scp -i carenest-aws.pem ~/carenest-mongo-backup.tgz ubuntu@EC2_EIP:~/
```

Collections expected: `leads`, `appointments`, `contacts`, `careers`, `newsletter`, `chat_messages`.

### 6.2 Import on AWS (on-box Mongo)

```bash
# On EC2
sudo systemctl enable --now mongod
mongosh --eval 'db.runCommand({ connectionStatus: 1 })'

# Create app user
mongosh <<'EOF'
use carenest
db.createUser({
  user: "carenest",
  pwd: "CHANGE_ME_STRONG_PASSWORD",
  roles: [ { role: "readWrite", db: "carenest" } ]
})
EOF

cd ~
tar -xzf carenest-mongo-backup.tgz
# Adjust folder name to match dump layout
mongorestore --uri="mongodb://carenest:CHANGE_ME_STRONG_PASSWORD@127.0.0.1:27017/carenest" \
  --nsFrom="${EMERGENT_DB_NAME}.*" --nsTo="carenest.*" \
  ./YYYYMMDD/${EMERGENT_DB_NAME}
```

Set in backend `.env`:

```bash
MONGO_URL=mongodb://carenest:CHANGE_ME_STRONG_PASSWORD@127.0.0.1:27017/carenest?authSource=carenest
DB_NAME=carenest
```

### 6.3 Atlas alternative (recommended)

1. Create Atlas cluster (Mumbai).
2. Network access: EC2 Elastic IP only (or VPC peering).
3. Create DB user; get URI.
4. `mongorestore --uri="mongodb+srv://..."`.
5. Set `MONGO_URL` / `DB_NAME` accordingly.

### 6.4 Verify counts

```bash
mongosh "$MONGO_URL" --eval '
  ["leads","appointments","contacts","careers","newsletter","chat_messages"].forEach(c => {
    print(c, db.getCollection(c).countDocuments({}))
  })
'
```

Compare to Emergent admin stats before cutover.

Scripted helper: `deploy/scripts/mongo_migrate.sh`.

---

## 7. Environment variables

### 7.1 Export from Emergent before cutover

From Emergent workspace (do **not** commit):

```bash
# Preview/workspace
cat /app/backend/.env
cat /app/frontend/.env
# Also copy Production secrets from Emergent → Deployment → Secrets UI
```

### 7.2 Backend `/opt/carenest/app/backend/.env`

Template: [`deploy/env/backend.env.example`](./env/backend.env.example)

```bash
sudo -u carenest cp /opt/carenest/app/deploy/env/backend.env.example \
  /opt/carenest/app/backend/.env
sudo -u carenest nano /opt/carenest/app/backend/.env
sudo chmod 600 /opt/carenest/app/backend/.env
```

| Variable | Purpose | Emergent → AWS |
|---|---|---|
| `MONGO_URL` | DB connection | New Atlas/local URI |
| `DB_NAME` | DB name | Often `carenest` |
| `ADMIN_TOKEN` | Admin dashboard | **Copy same value** (or rotate & update ops) |
| `ANTHROPIC_API_KEY` | AI chat | **New** — replaces `EMERGENT_LLM_KEY` |
| `SES_SMTP_USER` / `SES_SMTP_PASS` | Lead emails | **New** — replaces `EMERGENT_EMAIL_KEY` |
| `EMAIL_FROM` | Verified SES identity | e.g. `CareNest Home Health <info@carenesthomehealth.in>` |
| `LEAD_NOTIFY_EMAIL` | Inbox for leads | Keep `info@carenesthomehealth.in` |
| `CORS_ORIGINS` | CORS | `https://carenesthomehealth.in,https://www.carenesthomehealth.in` |
| `GA_MEASUREMENT_ID` | GA4 | Set real ID if you have one |
| `GTM_ID` / `META_PIXEL_ID` | Optional | |

### 7.3 Frontend build `.env`

Template: [`deploy/env/frontend.env.example`](./env/frontend.env.example)

```bash
REACT_APP_BACKEND_URL=https://carenesthomehealth.in
```

### 7.4 Required code changes to leave Emergent APIs

Current `backend/server.py` calls:
- `emergentintegrations` + `EMERGENT_LLM_KEY` for chat
- `https://integrations.emergentagent.com` + `EMERGENT_EMAIL_KEY` for email

Apply the patch under [`deploy/patches/README.md`](./patches/README.md) **before** production cutover, or chat/email will die when Emergent keys stop working.

Summary of patch:
1. Chat: use Anthropic Messages streaming API with `ANTHROPIC_API_KEY`.
2. Email: send via SES SMTP (or boto3 `ses:SendEmail`).
3. Remove runtime dependency on `emergentintegrations` for production.

---

## 8. Cloudflare / Hostinger DNS changes

**Current state (audited):**
- NS: `horizon.dns-parking.com` / `orbit.dns-parking.com` (Hostinger)
- A records resolve through Cloudflare proxy IPs (`162.159.142.117`, `172.66.2.113`)
- MX must remain Titan (`mx1.titan.email` / `mx2.titan.email`) — **do not touch MX/SPF/DKIM**

### 8.1 Pre-cutover (staging verification)

1. In Cloudflare DNS (or Hostinger DNS if records are there):
   - Add temporary record: `Type A`, `Name staging`, `Value EC2_EIP`, **Proxy OFF** (grey cloud)
2. Test: `https://staging.carenesthomehealth.in` after Certbot **or** HTTP-only first.
3. Run checklist §9.3 against staging.

### 8.2 Production cutover DNS

Update:

| Type | Name | Value | Proxy |
|---|---|---|---|
| A | `@` | `EC2_EIP` | Proxied (orange) **after** origin SSL works |
| A or CNAME | `www` | `EC2_EIP` or `carenesthomehealth.in` | Proxied |
| A | `staging` | delete after cutover | — |

**SSL mode:** Cloudflare → SSL/TLS → **Full (strict)** once origin has a valid cert.

**Do not change:**
- MX records (Titan email)
- SPF / DKIM TXT for Titan
- Google Search Console verification TXT

### 8.3 TTL tip for zero-downtime

Set TTL to **300** (5 minutes) **24 hours before** cutover; raise again after stable.

### 8.4 Purge Cloudflare cache

After cutover:

```text
Cloudflare → Caching → Configuration → Purge Everything
```

---

## 9. Zero-downtime migration steps

### Timeline overview

```
T-7d   Export secrets, provision EC2, SES domain verify, Anthropic key
T-5d   Install stack, apply Emergent-exit patch, configure Nginx
T-3d   Mongo dump/restore, frontend build, staging DNS test
T-1d   Lower DNS TTL; freeze non-critical Emergent deploys
T-0    Final mongodump → restore delta → flip A records → verify → watch
T+2h   Confirm metrics; keep Emergent running as rollback
T+72h  Decommission Emergent if stable
```

### 9.1 T-7 to T-3 (build AWS cold)

1. Create EC2 + EIP + SG (§1).
2. Install Nginx, Node, Python, Mongo/Atlas (§1).
3. Clone repo; apply patches; install backend/frontend deps (§4–5, §7).
4. Configure SES: verify `carenesthomehealth.in`, create SMTP credentials, request production access if sandboxed.
5. Create Anthropic API key; set spend limits.
6. First `mongodump` from Emergent → restore to AWS; verify counts.
7. Point `staging` A record to EIP; obtain SSL; run full QA on staging.

### 9.2 T-1 (prepare cutover)

1. Announce short maintenance window (optional; with Cloudflare flip often <5 min).
2. Set DNS TTL 300.
3. Confirm Emergent still healthy (rollback source).
4. Snapshot EC2 (AWS console → Actions → Image and templates → Create image).

### 9.3 T-0 cutover procedure (execute in order)

```bash
# === ON LAPTOP: final data sync ===
export EMERGENT_MONGO_URL='...'
export EMERGENT_DB_NAME='...'
mongodump --uri="$EMERGENT_MONGO_URL" --db="$EMERGENT_DB_NAME" --out=/tmp/final-dump
tar -czf /tmp/final-dump.tgz -C /tmp/final-dump .
scp -i carenest-aws.pem /tmp/final-dump.tgz ubuntu@EC2_EIP:/tmp/

# === ON EC2: restore delta ===
cd /tmp && tar -xzf final-dump.tgz
# drop+restore or mongorestore --drop for cutover consistency
mongorestore --drop --uri="$MONGO_URL" ./...path...

sudo systemctl restart carenest-api
curl -sf http://127.0.0.1:8000/api/health
curl -sf http://127.0.0.1:8000/api/config/public
```

**DNS flip (Cloudflare):**
1. Change `@` and `www` A records → `EC2_EIP`.
2. Proxy: orange cloud ON with Full (strict), **or** grey during first Certbot then orange.
3. Purge Cloudflare cache.

**Verification (must all pass):**

```bash
curl -sSI https://carenesthomehealth.in/ | head -20
curl -sS https://carenesthomehealth.in/api/health
curl -sS https://carenesthomehealth.in/api/config/public
curl -sS -X POST https://carenesthomehealth.in/api/leads \
  -H 'Content-Type: application/json' \
  -d '{"name":"Migration Test","phone":"9999999999","city":"Pune","service":"Home Nursing"}'
# Admin
curl -sS https://carenesthomehealth.in/api/admin/stats -H "X-Admin-Token: $ADMIN_TOKEN"
# Chat SSE (first tokens)
curl -sS -N -X POST https://carenesthomehealth.in/api/chat/stream \
  -H 'Content-Type: application/json' \
  -d '{"session_id":"migrate-test","message":"Do you offer ICU at home in Pune?"}' | head
```

Browser checklist:
- [ ] Home, Services, Pricing, Book Appointment, Contact, FAQ, Admin login
- [ ] WhatsApp links
- [ ] Lead form email arrives at `info@carenesthomehealth.in`
- [ ] Chat widget streams
- [ ] `www` → apex redirect works
- [ ] Padlock / SSL valid

### 9.4 Post-cutover (T+0 to T+72h)

1. Monitor: `journalctl -u carenest-api -f`, Nginx error log, Cloudflare analytics.
2. Keep Emergent deployment **running but unused** for 72 hours.
3. After stability: cancel Emergent hosting subscription; revoke Emergent keys.
4. Raise DNS TTL back to 3600+.

Script: `deploy/scripts/cutover_verify.sh`.

---

## 10. Rollback plan

### 10.1 When to roll back

Roll back if within first 72 hours you see:
- Site down / 502 for >5 minutes after fix attempts
- Data loss or write failures to Mongo
- Chat/email completely broken and not quickly fixable
- SSL/DNS loop you cannot clear

### 10.2 DNS rollback (fastest — usually <10 minutes)

1. Cloudflare DNS: restore `@` / `www` to **previous Emergent targets**  
   (Emergent custom-domain A/CNAME values from Emergent dashboard — save these at T-1).
2. Purge Cloudflare cache.
3. Confirm `https://carenesthomehealth.in/api/health` responds from Emergent again.

```bash
# Record Emergent targets BEFORE cutover:
dig +short A carenesthomehealth.in
dig +short CNAME carenesthomehealth.in
# Save Emergent panel "Custom Domain" IP/hostname into rollback.txt
```

### 10.3 Data rollback

- If AWS received new leads after cutover, **export them** before DNS rollback:

```bash
mongodump --uri="$MONGO_URL" --db=carenest --out=/tmp/aws-postcutover
```

- Optionally `mongorestore` those documents into Emergent Mongo so no leads are lost.

### 10.4 EC2 service rollback (if DNS already correct but app bad)

```bash
sudo systemctl stop carenest-api
# restore previous git commit / build
sudo -u carenest -H bash -c 'cd /opt/carenest/app && git fetch && git checkout PREVIOUS_SHA'
# restore previous frontend build from backup
sudo rsync -a --delete /var/www/carenest/frontend.bak/ /var/www/carenest/frontend/
sudo systemctl start carenest-api
```

Always keep a previous frontend tarball:

```bash
sudo tar -czf /var/backups/carenest-frontend-$(date +%Y%m%d%H%M).tgz -C /var/www/carenest frontend
```

### 10.5 Hard rollback checklist

- [ ] DNS pointed back to Emergent
- [ ] Cloudflare purged
- [ ] Emergent app still running / not cancelled
- [ ] Post-cutover AWS leads exported and merged if needed
- [ ] Stakeholders notified
- [ ] Incident notes written for next attempt

---

## Quick command index

| Step | Command / file |
|---|---|
| Nginx site | `deploy/nginx/carenesthomehealth.in.conf` |
| systemd | `deploy/systemd/carenest-api.service` |
| Backend env | `deploy/env/backend.env.example` |
| Frontend env | `deploy/env/frontend.env.example` |
| Bootstrap EC2 | `deploy/scripts/bootstrap_ec2.sh` |
| Deploy API | `deploy/scripts/deploy_backend.sh` |
| Deploy UI | `deploy/scripts/deploy_frontend.sh` |
| Mongo migrate | `deploy/scripts/mongo_migrate.sh` |
| Verify | `deploy/scripts/cutover_verify.sh` |
| Emergent-exit patch notes | `deploy/patches/README.md` |

---

## Ownership contacts

- Domain / DNS: Hostinger NS + Cloudflare proxy  
- Email: Titan (`info@carenesthomehealth.in`) — keep MX  
- AWS account: (your account)  
- Repo: `https://github.com/9710082019arif-afk/carenest-home-health`

**End state:** CareNest runs only on AWS + Cloudflare + Titan + Anthropic + SES. Emergent is unused and can be cancelled after the rollback window.
