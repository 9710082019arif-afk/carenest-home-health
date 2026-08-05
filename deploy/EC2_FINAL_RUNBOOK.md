# CareNest EC2 — Final path (one command)

PR #2/#3/#4/#6 are on `main`. Use the one-command installer — do **not** run manual Nginx/systemd/env steps.

```bash
cd /opt/carenest/app
sudo bash deploy/install.sh
```

That script detects Python/Node, runs the secrets wizard, writes `.env` files, builds the frontend, configures systemd/nginx/SSL, and verifies SEO + health.

Full reference: [`deploy/README.md`](./README.md)
