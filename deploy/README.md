# CareNest deploy — one-command AWS installer

## Deploy (only path you need)

On a fresh Ubuntu EC2 (Python 3.x + optional Node already fine):

```bash
sudo mkdir -p /opt/carenest
sudo useradd -m -s /bin/bash carenest 2>/dev/null || true
sudo chown -R carenest:carenest /opt/carenest
sudo -u carenest git clone --branch main --single-branch \
  https://github.com/9710082019arif-afk/carenest-home-health.git \
  /opt/carenest/app
cd /opt/carenest/app
sudo bash deploy/install.sh
```

The installer:

1. Detects system Python (no hardcoded 3.12) and Node  
2. Installs Yarn if missing  
3. Creates folders, `carenest` user, systemd, nginx  
4. Runs a **secrets wizard** (or reads `CARENEST_*` env vars)  
5. Writes `backend/.env` + `frontend/.env`  
6. Builds React, starts FastAPI, configures SSL  
7. Verifies SEO + health and prints **Deployment Successful** or **Deployment Failed**

### Secrets (asked once)

| Prompt / env var | Purpose |
|---|---|
| `CARENEST_MONGO_URL` | Atlas or local Mongo URI |
| `CARENEST_ADMIN_TOKEN` | Admin dashboard token |
| `CARENEST_ANTHROPIC_API_KEY` | Anthropic `sk-ant-...` |
| `CARENEST_SES_SMTP_USER` | SES SMTP username |
| `CARENEST_SES_SMTP_PASS` | SES SMTP password |
| `CARENEST_SSL_MODE` | `certbot` \| `cloudflare` \| `none` |

Cloudflare origin mode also needs:

- `CARENEST_CF_ORIGIN_CERT` — path to origin cert PEM  
- `CARENEST_CF_ORIGIN_KEY` — path to origin key PEM  

Non-interactive example:

```bash
sudo CARENEST_MONGO_URL='mongodb+srv://...' \
     CARENEST_ADMIN_TOKEN='...' \
     CARENEST_ANTHROPIC_API_KEY='sk-ant-...' \
     CARENEST_SES_SMTP_USER='...' \
     CARENEST_SES_SMTP_PASS='...' \
     CARENEST_SSL_MODE=certbot \
     bash deploy/install.sh
```

## Layout

| Path | Role |
|---|---|
| `install.sh` | **One-command deploy** |
| `verify_everything.sh` | **One-command post-deploy verification + safe fixes** |
| `lib/*.sh` | Installer modules |
| `nginx/*.conf` | HTTP / HTTPS / Cloudflare templates |
| `systemd/carenest-api.service` | FastAPI unit |
| `env/*.example` | Reference only (installer writes real `.env`) |
| `scripts/deploy_backend.sh` | Backend-only redeploy |
| `scripts/deploy_frontend.sh` | Frontend-only redeploy |
| `scripts/bootstrap_ec2.sh` | Alias → `install.sh` |

## Code notes

- Emergent LLM/email integrations are **removed** from `backend/server.py`.  
- Production uses `backend/aws_integrations.py` (Anthropic + SES SMTP).  
- `/api/health` pings Mongo and returns 503 if the DB is down.  
- SEO assets (`robots.txt`, `sitemap.xml`, soft-404 bootstrap, JSON-LD) are verified after build.
