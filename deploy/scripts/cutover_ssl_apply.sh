#!/usr/bin/env bash
# Apply origin SSL: cloudflare | certbot
# Usage: sudo bash deploy/scripts/cutover_ssl_apply.sh cloudflare|certbot
set -euo pipefail

MODE="${1:?usage: cutover_ssl_apply.sh cloudflare|certbot}"
DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOMAIN="${CARENEST_DOMAIN:-carenesthomehealth.in}"
WWW_DOMAIN="${CARENEST_WWW_DOMAIN:-www.${DOMAIN}}"
DOCROOT="/var/www/carenest/frontend"
SITE_AVAIL="/etc/nginx/sites-available/${DOMAIN}"

case "${MODE}" in
  cloudflare)
    CERT="${CF_ORIGIN_CERT:-/etc/ssl/cloudflare/carenest.pem}"
    KEY="${CF_ORIGIN_KEY:-/etc/ssl/cloudflare/carenest.key}"
    [[ -f "${CERT}" && -f "${KEY}" ]] || { echo "Missing ${CERT} or ${KEY}"; exit 1; }
    mkdir -p /etc/ssl/cloudflare
    if [[ "${CERT}" != "/etc/ssl/cloudflare/carenest.pem" ]]; then
      cp "${CERT}" /etc/ssl/cloudflare/carenest.pem
    fi
    if [[ "${KEY}" != "/etc/ssl/cloudflare/carenest.key" ]]; then
      cp "${KEY}" /etc/ssl/cloudflare/carenest.key
    fi
    chmod 644 /etc/ssl/cloudflare/carenest.pem
    chmod 600 /etc/ssl/cloudflare/carenest.key
    sed \
      -e "s|__DOMAIN__|${DOMAIN}|g" \
      -e "s|__WWW_DOMAIN__|${WWW_DOMAIN}|g" \
      -e "s|__DOCROOT__|${DOCROOT}|g" \
      -e "s|__CF_CERT__|/etc/ssl/cloudflare/carenest.pem|g" \
      -e "s|__CF_KEY__|/etc/ssl/cloudflare/carenest.key|g" \
      "${DEPLOY_DIR}/nginx/carenesthomehealth.in.cloudflare.conf" > "${SITE_AVAIL}"
    ln -sfn "${SITE_AVAIL}" "/etc/nginx/sites-enabled/${DOMAIN}"
    rm -f /etc/nginx/sites-enabled/default
    nginx -t
    systemctl restart nginx
    mkdir -p /etc/carenest
    if grep -q '^SSL_MODE=' /etc/carenest/deploy.env 2>/dev/null; then
      sed -i 's/^SSL_MODE=.*/SSL_MODE=cloudflare/' /etc/carenest/deploy.env
    else
      echo 'SSL_MODE=cloudflare' >> /etc/carenest/deploy.env
    fi
    echo "Cloudflare origin SSL active"
    ;;
  certbot)
    EMAIL="${CERTBOT_EMAIL:-info@${DOMAIN}}"
    # Ensure HTTP site first for ACME
    if [[ ! -f "${SITE_AVAIL}" ]] || ! grep -q 'listen 80' "${SITE_AVAIL}"; then
      sed \
        -e "s|__DOMAIN__|${DOMAIN}|g" \
        -e "s|__WWW_DOMAIN__|${WWW_DOMAIN}|g" \
        -e "s|__DOCROOT__|${DOCROOT}|g" \
        "${DEPLOY_DIR}/nginx/carenesthomehealth.in.http.conf" > "${SITE_AVAIL}"
      ln -sfn "${SITE_AVAIL}" "/etc/nginx/sites-enabled/${DOMAIN}"
      rm -f /etc/nginx/sites-enabled/default
      nginx -t && systemctl restart nginx
    fi
    certbot --nginx -d "${DOMAIN}" -d "${WWW_DOMAIN}" \
      --agree-tos -m "${EMAIL}" --redirect -n
    systemctl enable certbot.timer 2>/dev/null || true
    if grep -q '^SSL_MODE=' /etc/carenest/deploy.env 2>/dev/null; then
      sed -i 's/^SSL_MODE=.*/SSL_MODE=certbot/' /etc/carenest/deploy.env
    else
      echo 'SSL_MODE=certbot' >> /etc/carenest/deploy.env
    fi
    echo "Certbot SSL active"
    ;;
  *)
    echo "Unknown mode ${MODE}" >&2
    exit 1
    ;;
esac
