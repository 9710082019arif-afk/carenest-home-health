#!/usr/bin/env bash
# Bootstrap a fresh Ubuntu 24.04 EC2 for CareNest.
# Usage: sudo bash deploy/scripts/bootstrap_ec2.sh
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run as root: sudo bash $0" >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt update
apt -y upgrade
apt -y install nginx git curl build-essential ufw fail2ban \
  python3.12 python3.12-venv python3-pip certbot python3-certbot-nginx rsync

# Node 20
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt -y install nodejs
fi
npm install -g yarn@1.22.22

# App user + dirs
id carenest >/dev/null 2>&1 || useradd -m -s /bin/bash carenest
mkdir -p /opt/carenest /var/www/carenest/frontend /var/log/carenest /var/backups/carenest
chown -R carenest:carenest /opt/carenest /var/www/carenest /var/log/carenest /var/backups/carenest

# Firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo "Bootstrap complete."
echo "Next:"
echo "  1) sudo -u carenest git clone <repo> /opt/carenest/app"
echo "  2) Configure backend/.env and frontend/.env from deploy/env/"
echo "  3) Install MongoDB or set Atlas MONGO_URL"
echo "  4) Run deploy_backend.sh && deploy_frontend.sh"
echo "  5) Install nginx site + certbot"
