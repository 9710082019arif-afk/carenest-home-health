# CareNest AWS deploy pack

**Start here:** [MIGRATION_AWS.md](./MIGRATION_AWS.md) — full leave-Emergent migration plan (EC2, Nginx, SSL, systemd, React, Mongo, env, Cloudflare DNS, zero-downtime cutover, rollback).

| Path | Purpose |
|---|---|
| `nginx/carenesthomehealth.in.conf` | Production Nginx site |
| `systemd/carenest-api.service` | FastAPI uvicorn unit |
| `env/backend.env.example` | Backend secrets template (SES + Anthropic) |
| `env/frontend.env.example` | CRA build-time env |
| `scripts/bootstrap_ec2.sh` | Fresh Ubuntu bootstrap (auto-detects system `python3`) |
| `EC2_FINAL_RUNBOOK.md` | **One-path** EC2 recovery: re-clone `main` as `carenest`, bootstrap, deploy |
| `scripts/deploy_backend.sh` | Install/restart API |
| `scripts/deploy_frontend.sh` | `yarn build` → docroot |
| `scripts/mongo_migrate.sh` | mongodump / mongorestore |
| `scripts/cutover_verify.sh` | Post-cutover health checks |
| `scripts/save_rollback_dns.sh` | Snapshot DNS before flip |
| `patches/` | Replace Emergent LLM + email with Anthropic + SES |

No Emergent runtime is required after this pack is applied on AWS.
