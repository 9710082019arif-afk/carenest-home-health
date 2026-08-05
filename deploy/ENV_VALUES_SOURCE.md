# CareNest backend `.env` — exact source of every value

Use this while editing `/opt/carenest/app/backend/.env` on EC2.  
Template: `deploy/env/backend.env.example`.

**Important (code vs env):** current `main` `backend/server.py` still calls **Emergent** (`EMERGENT_LLM_KEY`, `EMERGENT_EMAIL_KEY`). AWS SES + Anthropic only work after you apply `deploy/patches/` (`aws_integrations.py` + `server_patch.md`). Fill the AWS variables below **and** apply that patch before cutover, or chat/email will not use SES/Anthropic.

---

## How to open Emergent production secrets (needed for copy/migrate)

On the Emergent workspace machine (or Emergent shell):

```bash
cat /app/backend/.env
```

Also open **Emergent → Deployment → Secrets** for the **production** deployment of `carenesthomehealth.in`. Preview and Production secrets are separate; production may differ from `/app/backend/.env`.

Copy values out of band. Never commit them.

---

## 1. `MONGO_URL`

| | |
|---|---|
| **Source** | **Create new for AWS.** Do not point the EC2 app at Emergent’s Mongo URI long-term. |
| **Emergent value** | Exists in Emergent `.env` as `MONGO_URL` — use it **only** for `mongodump` (see `deploy/MIGRATION_AWS.md` §6.1). |
| **AWS value** | New connection string you create (Atlas recommended). |

### Retrieve Emergent URI (for dump only)

```bash
# On Emergent
grep '^MONGO_URL=' /app/backend/.env
# or Emergent → Deployment → Secrets → MONGO_URL
```

### Create AWS URI (Atlas — recommended)

1. AWS/Atlas: create a cluster in **Mumbai (`ap-south-1`)**.
2. Atlas → Database Access → Add user (e.g. `carenest`) + password you choose.
3. Atlas → Network Access → allow your **EC2 Elastic IP** only.
4. Atlas → Connect → Drivers → copy the `mongodb+srv://...` URI.
5. Put that URI in EC2 `.env` as `MONGO_URL`.

Example shape (your real user/password/cluster host):

```bash
MONGO_URL=mongodb+srv://carenest:YOUR_ATLAS_PASSWORD@YOUR_CLUSTER.xxxxx.mongodb.net/carenest?retryWrites=true&w=majority
```

### Create AWS URI (MongoDB on the same EC2)

1. Install/start `mongod` on the instance.
2. Create DB user (password you choose):

```bash
mongosh <<'EOF'
use carenest
db.createUser({
  user: "carenest",
  pwd: "YOUR_LOCAL_MONGO_PASSWORD",
  roles: [ { role: "readWrite", db: "carenest" } ]
})
EOF
```

3. Set:

```bash
MONGO_URL=mongodb://carenest:YOUR_LOCAL_MONGO_PASSWORD@127.0.0.1:27017/carenest?authSource=carenest
```

After dump/restore from Emergent (`deploy/scripts/mongo_migrate.sh` / MIGRATION §6), the app uses this **new** URI.

---

## 2. `DB_NAME`

| | |
|---|---|
| **Source** | Emergent: copy `DB_NAME` from Emergent secrets for dump. AWS app: use `carenest` if you restore with `--nsTo=carenest.*` as in the migration guide. |
| **Retrieve Emergent** | `grep '^DB_NAME=' /app/backend/.env` or Deployment → Secrets → `DB_NAME`. |
| **Set on AWS** | `DB_NAME=carenest` (matches `deploy/env/backend.env.example` and restore docs). |

If you restore into Atlas **keeping the Emergent database name**, then `DB_NAME` on AWS must equal that Emergent name exactly. Prefer renaming to `carenest` via `mongorestore --nsFrom=... --nsTo=carenest.*` so AWS stays consistent with the docs.

---

## 3. `ADMIN_TOKEN`

| | |
|---|---|
| **Source** | **Copy from Emergent production** (recommended so existing `/admin` logins keep working). |
| **Retrieve** | `grep '^ADMIN_TOKEN=' /app/backend/.env` **and** Emergent → Deployment → Secrets → `ADMIN_TOKEN`. Prefer the **production** Secrets value. |
| **Or create new** | Generate once on EC2: `openssl rand -base64 32` → paste into `.env`. Then every operator must use the new token in the Admin UI / `X-Admin-Token` header. |

Do not invent a short password. Do not commit the token. Ignore any token that may appear in test files; use Emergent production Secrets only.

---

## 4. `ANTHROPIC_API_KEY`

| | |
|---|---|
| **Source** | **Create new** at Anthropic. |
| **Not reusable** | Emergent’s `EMERGENT_LLM_KEY` is an Emergent-managed key. It is **not** a drop-in Anthropic `sk-ant-...` key. |

### How to create

1. Sign in at https://console.anthropic.com/
2. Go to **API keys** → **Create key**
3. Copy the `sk-ant-...` value into EC2 `.env` as `ANTHROPIC_API_KEY`
4. Also set (from template):

```bash
ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
```

### Emergent key (only if you have not applied the AWS patch yet)

Until `deploy/patches` is applied, running `server.py` still needs:

```bash
EMERGENT_LLM_KEY=<value from Emergent Secrets>
```

Retrieve: `grep '^EMERGENT_LLM_KEY=' /app/backend/.env` or Deployment → Secrets. After the patch, leave `EMERGENT_LLM_KEY` empty/unset and use `ANTHROPIC_API_KEY` only.

---

## 5. AWS SES SMTP credentials

**Repo names (use these exact keys — not `SMTP_HOST` / `SMTP_USERNAME`):**

| Variable | Exact source |
|---|---|
| `SES_SMTP_HOST` | Fixed for Mumbai: `email-smtp.ap-south-1.amazonaws.com` (`deploy/env/backend.env.example`) |
| `SES_SMTP_PORT` | Fixed: `587` |
| `SES_REGION` | Fixed for this guide: `ap-south-1` |
| `SES_SMTP_USER` | **Create new** in AWS SES (SMTP username shown once at creation) |
| `SES_SMTP_PASS` | **Create new** in AWS SES (SMTP password shown once at creation) |

`EMERGENT_EMAIL_KEY` cannot be reused for SES.

### How to create SES SMTP user/password

1. AWS Console → region **ap-south-1** → **Amazon SES**
2. **Verified identities** → Create identity → **Domain** → `carenesthomehealth.in`
3. Add the SES **DKIM CNAME** records in DNS (Cloudflare/Hostinger). Keep Titan MX untouched. Merge SPF carefully: include both Titan and SES (`include:spf.titan.email` and `include:amazonses.com`) as in `deploy/patches/README.md`
4. If the account is in the SES sandbox: SES → Account dashboard → Request production access (required to mail `info@...` freely)
5. SES → **SMTP settings** → **Create SMTP credentials**
   - IAM user name suggestion: `carenest-ses-smtp`
   - Download/show credentials → that pair is `SES_SMTP_USER` and `SES_SMTP_PASS`

Also set (brand constants from repo — not secrets):

```bash
EMAIL_FROM_NAME=CareNest Home Health
EMAIL_FROM=info@carenesthomehealth.in
LEAD_NOTIFY_EMAIL=info@carenesthomehealth.in
```

`EMAIL_FROM` must be an address/domain **verified in SES**. Inbox `info@carenesthomehealth.in` is the Titan mailbox documented in `memory/PRD.md` / migration guide.

Until the AWS email patch is applied, `server.py` still needs Emergent:

```bash
EMERGENT_EMAIL_KEY=<from Emergent Secrets>
```

Retrieve: `grep '^EMERGENT_EMAIL_KEY=' /app/backend/.env` or Deployment → Secrets. After the patch, leave it empty and use SES vars only.

---

## 6. `CORS_ORIGINS`

| | |
|---|---|
| **Source** | Fixed production values from `deploy/env/backend.env.example` / `deploy/MIGRATION_AWS.md` §7.2. Not from Emergent (`CORS_ORIGINS=*` there). |

```bash
CORS_ORIGINS=https://carenesthomehealth.in,https://www.carenesthomehealth.in
```

If you test on staging first, temporarily use:

```bash
CORS_ORIGINS=https://staging.carenesthomehealth.in,https://carenesthomehealth.in,https://www.carenesthomehealth.in
```

---

## 7. Every other variable in `backend.env.example`

| Variable | Required? | Exact source |
|---|---|---|
| `EMAIL_FROM_NAME` | Yes (defaults exist in code) | Literal: `CareNest Home Health` (repo default) |
| `EMAIL_FROM` | Yes for SES patch | Literal: `info@carenesthomehealth.in` (must be SES-verified) |
| `LEAD_NOTIFY_EMAIL` | Yes for lead emails | Literal: `info@carenesthomehealth.in` — or copy Emergent `LEAD_NOTIFY_EMAIL` if you changed it (`grep` Emergent `.env`) |
| `ANTHROPIC_MODEL` | Yes with Anthropic patch | Literal from template: `claude-sonnet-4-5-20250929` |
| `GA_MEASUREMENT_ID` | Optional | Create in Google Analytics → Admin → Data streams → Measurement ID (`G-...`). Live site currently returns empty `ga_id`. Also check Emergent Secrets in case you already created one: `grep '^GA_MEASUREMENT_ID=' /app/backend/.env` |
| `GTM_ID` | Optional | Create in tagmanager.google.com → Container ID (`GTM-...`), or copy from Emergent Secrets if set |
| `META_PIXEL_ID` | Optional | Create in Meta Events Manager → Pixel ID, or copy from Emergent Secrets if set |
| `EMERGENT_LLM_KEY` | Only until AWS chat patch | Emergent Secrets — then remove |
| `EMERGENT_EMAIL_KEY` | Only until AWS email patch | Emergent Secrets — then remove |

---

## Frontend `.env` (build-time — separate file)

Path: `/opt/carenest/app/frontend/.env`  
Template: `deploy/env/frontend.env.example`

```bash
REACT_APP_BACKEND_URL=https://carenesthomehealth.in
```

That value is the public site origin (same host serving `/api`). Not from Emergent.

---

## Checklist: fill order on EC2

1. Open Emergent Secrets → copy `ADMIN_TOKEN`, `DB_NAME`, `MONGO_URL` (dump only), optional analytics IDs, and (if patch not applied yet) `EMERGENT_*` keys.  
2. Create Atlas (or local Mongo) → set new `MONGO_URL` + `DB_NAME=carenest`.  
3. Create Anthropic key → `ANTHROPIC_API_KEY`.  
4. Verify SES domain + create SMTP credentials → `SES_SMTP_USER` / `SES_SMTP_PASS` (+ fixed host/port/region).  
5. Set `CORS_ORIGINS` and email literals as above.  
6. Apply `deploy/patches` so the process actually reads Anthropic + SES.  
7. `chmod 600` the `.env`, then `deploy_backend.sh` / restart `carenest-api`.

No placeholder “CHANGE_ME” values should remain for required keys before cutover.
