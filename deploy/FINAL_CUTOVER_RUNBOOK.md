# CareNest — One-command Emergent → AWS migration

## Run this (on EC2)

```bash
cd /opt/carenest/app
sudo -u carenest git pull --ff-only origin main
sudo bash deploy/scripts/migrate.sh
```

The wizard:

1. **Creates** `/etc/carenest/cutover.env` if missing  
2. Detects values already in `backend/.env` / `cutover.env`  
3. **Rejects placeholder Mongo URIs** (`localhost`, `127.0.0.1`, `CHANGE_ME_*`, example templates) and prompts for real **Atlas** `mongodb+srv://…`  
4. Prompts **only** for other missing secrets  
5. Validates Atlas Mongo, Emergent Mongo (unless `SKIP_MONGO=1`), GA4, GTM, SES, Cloudflare token  
6. Writes Atlas URI into `backend/.env` + `cutover.env` automatically  
7. Creates timestamped backups under `/var/backups/carenest/YYYYMMDD-HHMMSS/`  
8. Shows a pre-flight checklist → type `YES`  
9. Runs Mongo sync (optional) → analytics → origin cert → SSL → DNS flip → live verify  

`SKIP_MONGO=1` skips **only** Emergent dump/restore. Atlas URI is always required.

**Final output is only:**

```text
Migration Successful
```

or

```text
Migration Failed
<exact failed step>
=== RESTORE FROM BACKUP ===
  sudo bash /var/backups/carenest/YYYYMMDD-HHMMSS/RESTORE.sh
```

Detail log: `/var/log/carenest/migrate-*.log`

### Backups (automatic, before any changes)

Each run saves:

- `backend.env` ← `backend/.env`
- `frontend.env` ← `frontend/.env` (if present)
- `nginx/sites-available/` + `nginx/sites-enabled/` + `nginx.conf`
- `systemd/carenest-api.service`
- `rollback-dns.txt`
- `RESTORE.sh` (one-command restore)

Path: `/var/backups/carenest/YYYYMMDD-HHMMSS/`

---

## What you may be prompted for (only if missing)

| Secret | Where to get it |
|--------|-----------------|
| Atlas `MONGO_URL` | Usually already on EC2 |
| Emergent Mongo URI (+ DB name) | Emergent backend `.env` |
| SES SMTP user/pass | Usually already on EC2 |
| `GA_MEASUREMENT_ID` | GA4 Admin → Data streams (`G-…`) |
| `GTM_ID` | GTM container (`GTM-…`) |
| Cloudflare API token | Zone DNS Edit + Cache Purge + Zone Settings Edit |
| Cloudflare Origin CA Key | My Profile → API Tokens → Origin CA Key |

Zone ID is auto-resolved. Origin certificate is auto-created via Origin CA Key.

---

## After `Migration Successful`

Still do once in Google UIs (cannot be API-automated here):

1. Search Console → resubmit sitemap  
2. GA4 Realtime → confirm a hit  
3. Ads Tag Assistant → test lead  

Keep Emergent unused **72 hours**, then cancel it.

> Emergent is no longer serving production traffic and can be safely shut down.

---

## Rollback

```bash
sudo bash deploy/scripts/cutover_dns_cloudflare.sh rollback
# or restore A records from /var/lib/carenest/cutover/rollback-dns.txt
```

## Helpers (used by migrate.sh)

| Script | Role |
|--------|------|
| `migrate.sh` | Wizard + full migration |
| `cutover_mongo_final.sh` | Emergent → Atlas |
| `cutover_ssl_apply.sh` | nginx SSL |
| `cutover_dns_cloudflare.sh` | DNS + purge + Full (strict) |
| `cutover_verify_live.sh` | Prove public origin is AWS |
