#!/usr/bin/env bash
# System packages for CareNest one-command deploy

install_system_packages() {
  export DEBIAN_FRONTEND=noninteractive
  log "Updating apt and installing packages"
  apt-get update -y
  apt-get -y upgrade
  apt-get -y install \
    nginx git curl ca-certificates gnupg build-essential ufw fail2ban \
    python3 python3-venv python3-pip \
    certbot python3-certbot-nginx rsync \
    openssl

  if ! command -v node >/dev/null 2>&1; then
    log "Installing Node.js 22.x"
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get -y install nodejs
  else
    log "Keeping existing Node $(node -v)"
  fi

  # Firewall: keep SSH + HTTP/HTTPS open
  if command -v ufw >/dev/null 2>&1; then
    ufw default deny incoming >/dev/null 2>&1 || true
    ufw default allow outgoing >/dev/null 2>&1 || true
    ufw allow OpenSSH >/dev/null 2>&1 || true
    ufw allow 'Nginx Full' >/dev/null 2>&1 || true
    ufw --force enable >/dev/null 2>&1 || true
  fi
}
