# CareNest EC2 — Final migration runbook (one path)

**Verified on GitHub `main` (`e075069`):** `deploy/scripts/bootstrap_ec2.sh` installs `python3 python3-venv python3-pip` and detects system Python. It does **not** apt-install `python3.12`. PR #6 is merged into `main` (along with #2, #3, #4).

**Why EC2 still tried `python3.12`:** the machine is running a **stale checkout** from before PR #6. `git pull` failed because the repo was cloned with `sudo` (files owned by `root`), so the old script never updated.

**This runbook:** delete the root-owned tree → clone `main` as user `carenest` into `/opt/carenest/app` → bootstrap → deploy. That is the only path below.

SSH in as `ubuntu`, then run every block in order.

---

## 0) Confirm you are on the EC2 host

```bash
whoami
python3 --version
node -v
```

Expected: `ubuntu`, `Python 3.14.4`, `v22.22.1`.

---

## 1) Remove the broken root-owned clone and reset app layout

```bash
sudo systemctl stop carenest-api 2>/dev/null || true
sudo rm -rf /opt/carenest
sudo useradd -m -s /bin/bash carenest 2>/dev/null || true
sudo mkdir -p /opt/carenest /var/www/carenest/frontend /var/log/carenest /var/backups/carenest
sudo chown -R carenest:carenest /opt/carenest /var/www/carenest /var/log/carenest /var/backups/carenest
```

---

## 2) Clone current `main` as `carenest` (includes PRs #2, #3, #4, #6)

```bash
sudo -u carenest -H git clone --branch main --single-branch \
  https://github.com/9710082019arif-afk/carenest-home-health.git \
  /opt/carenest/app
```

---

## 3) Prove the fixed bootstrap is on disk (must pass before continuing)

```bash
grep -n 'python3 python3-venv python3-pip' /opt/carenest/app/deploy/scripts/bootstrap_ec2.sh
grep -n 'Detected Python' /opt/carenest/app/deploy/scripts/bootstrap_ec2.sh
! grep -E 'apt.*python3\.12|install python3\.12' /opt/carenest/app/deploy/scripts/bootstrap_ec2.sh
cd /opt/carenest/app && sudo -u carenest -H git rev-parse --short HEAD && sudo -u carenest -H git log -1 --oneline
```

You must see the `python3 python3-venv` install line and `Detected Python`. The `! grep` line must exit 0 (no apt install of python3.12).

---

## 4) Run bootstrap from the new clone

```bash
sudo bash /opt/carenest/app/deploy/scripts/bootstrap_ec2.sh
```

Expected log lines include:

- `Detected Python 3.14.x`
- `python3 -m venv OK`
- existing Node v22 kept
- Yarn OK
- `carenest` user / `/opt/carenest` ready

---

## 5) Backend environment

```bash
sudo -u carenest -H cp /opt/carenest/app/deploy/env/backend.env.example \
  /opt/carenest/app/backend/.env
sudo -u carenest -H nano /opt/carenest/app/backend/.env
sudo chmod 600 /opt/carenest/app/backend/.env
```

Fill at minimum: `MONGO_URL`, `DB_NAME`, `ADMIN_TOKEN`, `EMAIL_*` / SES SMTP, `ANTHROPIC_API_KEY`, `CORS_ORIGINS=https://carenesthomehealth.in,https://www.carenesthomehealth.in`.

---

## 6) Frontend environment

```bash
sudo -u carenest -H cp /opt/carenest/app/deploy/env/frontend.env.example \
  /opt/carenest/app/frontend/.env
sudo -u carenest -H bash -c 'echo "REACT_APP_BACKEND_URL=https://carenesthomehealth.in" > /opt/carenest/app/frontend/.env'
```

---

## 7) Install systemd unit

```bash
sudo cp /opt/carenest/app/deploy/systemd/carenest-api.service \
  /etc/systemd/system/carenest-api.service
sudo systemctl daemon-reload
sudo systemctl enable carenest-api
```

---

## 8) Deploy backend + frontend

```bash
sudo -u carenest -H bash /opt/carenest/app/deploy/scripts/deploy_backend.sh
sudo -u carenest -H bash /opt/carenest/app/deploy/scripts/deploy_frontend.sh
sudo chown -R www-data:www-data /var/www/carenest/frontend
sudo systemctl start carenest-api
curl -sf http://127.0.0.1:8000/api/health
```

---

## 9) Nginx site

```bash
sudo cp /opt/carenest/app/deploy/nginx/carenesthomehealth.in.conf \
  /etc/nginx/sites-available/carenesthomehealth.in
sudo ln -sfn /etc/nginx/sites-available/carenesthomehealth.in \
  /etc/nginx/sites-enabled/carenesthomehealth.in
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## 10) TLS (DNS already pointing at this EC2; Cloudflare proxy DNS-only while issuing)

```bash
sudo certbot --nginx -d carenesthomehealth.in -d www.carenesthomehealth.in \
  --agree-tos -m info@carenesthomehealth.in --redirect -n
```

---

## 11) Final verification

```bash
curl -sS https://carenesthomehealth.in/api/health
curl -sS https://carenesthomehealth.in/api/config/public
curl -sSI https://carenesthomehealth.in/ | head -20
sudo -u carenest -H git -C /opt/carenest/app status
ls -ld /opt/carenest /opt/carenest/app
```

`/opt/carenest` and `/opt/carenest/app` must be owned by `carenest:carenest`. Health must return OK.

---

## Later updates (same path forever)

```bash
sudo -u carenest -H git -C /opt/carenest/app fetch origin
sudo -u carenest -H git -C /opt/carenest/app checkout main
sudo -u carenest -H git -C /opt/carenest/app pull --ff-only origin main
sudo -u carenest -H bash /opt/carenest/app/deploy/scripts/deploy_backend.sh
sudo -u carenest -H bash /opt/carenest/app/deploy/scripts/deploy_frontend.sh
sudo chown -R www-data:www-data /var/www/carenest/frontend
sudo systemctl restart carenest-api
sudo systemctl reload nginx
```

Never run `git` or `yarn` as root inside `/opt/carenest/app`.
