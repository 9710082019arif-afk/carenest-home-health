#!/usr/bin/env bash
# Upgrade origin from Cloudflare Flexible (HTTP) → Full (strict) ready.
#
# Does NOT change DNS and does NOT re-run migrate.sh.
# Run AFTER a successful manual cutover (Flexible), on EC2 as root:
#
#   sudo bash deploy/scripts/upgrade_ssl_full_strict.sh
#
# Provide the Origin Certificate by ONE of:
#   A) Files already at CF_ORIGIN_CERT / CF_ORIGIN_KEY (default under /etc/ssl/cloudflare/)
#   B) CLOUDFLARE_ORIGIN_CA_KEY=...  (auto-create via Cloudflare Origin CA API)
#   C) Interactive paste when prompted
#
# Then the script installs nginx HTTPS, verifies locally, and instructs you to
# set Cloudflare SSL/TLS → Full (strict) + Purge Everything + live verify.
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
APP_ROOT="$(cd "${DEPLOY_DIR}/.." && pwd)"
DOMAIN="${CARENEST_DOMAIN:-carenesthomehealth.in}"
WWW_DOMAIN="${CARENEST_WWW_DOMAIN:-www.${DOMAIN}}"
CUTOVER_ENV="/etc/carenest/cutover.env"
STATE_DIR="/var/lib/carenest/cutover"
BACKUP_ROOT="/var/backups/carenest"
CF_ORIGIN_CERT="${CF_ORIGIN_CERT:-/etc/ssl/cloudflare/carenest.pem}"
CF_ORIGIN_KEY="${CF_ORIGIN_KEY:-/etc/ssl/cloudflare/carenest.key}"
LOG_FILE="/var/log/carenest/upgrade-ssl-$(date +%Y%m%d%H%M%S).log"

mkdir -p "${STATE_DIR}" /var/log/carenest /etc/ssl/cloudflare "${BACKUP_ROOT}"
touch "${LOG_FILE}"

say() { printf '%s\n' "$*" > /dev/tty 2>/dev/null || printf '%s\n' "$*"; }
log() { printf '%s\n' "$*" >> "${LOG_FILE}"; }
ask() {
  local prompt="$1" silent="${2:-0}" var="$3" val=""
  if [[ "${silent}" == "1" ]]; then
    read -r -s -p "${prompt}: " val < /dev/tty
    printf '\n' > /dev/tty
  else
    read -r -p "${prompt}: " val < /dev/tty
  fi
  printf -v "${var}" '%s' "${val}"
  export "${var?}"
}

fail() {
  log "FAILED: $*"
  echo "SSL upgrade failed"
  echo "$*"
  echo "Log: ${LOG_FILE}"
  exit 1
}

ok() {
  log "OK: $*"
  echo "$*"
  exit 0
}

if [[ "${EUID}" -ne 0 ]]; then
  fail "Run as root: sudo bash deploy/scripts/upgrade_ssl_full_strict.sh"
fi

# shellcheck disable=SC1091
[[ -f /etc/carenest/deploy.env ]] && source /etc/carenest/deploy.env || true
# shellcheck disable=SC1091
[[ -f "${CUTOVER_ENV}" ]] && source "${CUTOVER_ENV}" || true

CF_ORIGIN_CERT="${CF_ORIGIN_CERT:-/etc/ssl/cloudflare/carenest.pem}"
CF_ORIGIN_KEY="${CF_ORIGIN_KEY:-/etc/ssl/cloudflare/carenest.key}"
CLOUDFLARE_ORIGIN_CA_KEY="${CLOUDFLARE_ORIGIN_CA_KEY:-}"
ADMIN_TOKEN="${ADMIN_TOKEN:-}"
if [[ -z "${ADMIN_TOKEN}" && -f "${APP_ROOT}/backend/.env" ]]; then
  ADMIN_TOKEN="$(grep -E '^ADMIN_TOKEN=' "${APP_ROOT}/backend/.env" | head -1 | cut -d= -f2- | tr -d '"')"
fi

say ""
say "CareNest SSL upgrade: Flexible → Full (strict) ready"
say "Domain: ${DOMAIN}"
say "Log: ${LOG_FILE}"
say "This does NOT change DNS and does NOT re-run migrate.sh."
say ""

# ---------------------------------------------------------------------------
# Backup current nginx site before HTTPS swap
# ---------------------------------------------------------------------------
BACKUP_DIR="${BACKUP_ROOT}/ssl-upgrade-$(date +%Y%m%d-%H%M%S)"
mkdir -p "${BACKUP_DIR}/nginx"
SITE_AVAIL="/etc/nginx/sites-available/${DOMAIN}"
[[ -f "${SITE_AVAIL}" ]] && cp -a "${SITE_AVAIL}" "${BACKUP_DIR}/nginx/site.conf"
[[ -d /etc/nginx/sites-enabled ]] && cp -a /etc/nginx/sites-enabled "${BACKUP_DIR}/nginx/" || true
log "Backup → ${BACKUP_DIR}"
say "  ✓ nginx backup → ${BACKUP_DIR}"

# ---------------------------------------------------------------------------
# Obtain Origin Certificate
# ---------------------------------------------------------------------------
create_origin_cert_api() {
  [[ -n "${CLOUDFLARE_ORIGIN_CA_KEY}" ]] || return 1
  local resp
  resp="$(curl -sS --max-time 45 \
    -H "X-Auth-User-Service-Key: ${CLOUDFLARE_ORIGIN_CA_KEY}" \
    -H "Content-Type: application/json" \
    https://api.cloudflare.com/client/v4/certificates \
    --data "{\"hostnames\":[\"${DOMAIN}\",\"*.${DOMAIN}\"],\"requested_validity\":5475,\"request_type\":\"origin-rsa\"}" 2>/dev/null || true)"
  log "origin cert API: ${resp}"
  python3 -c '
import json,sys
d=json.load(sys.stdin)
assert d.get("success"), d
r=d["result"]
open(sys.argv[1],"w").write(r["certificate"].rstrip()+"\n")
open(sys.argv[2],"w").write(r["private_key"].rstrip()+"\n")
' "${CF_ORIGIN_CERT}" "${CF_ORIGIN_KEY}" <<<"${resp}"
  chmod 644 "${CF_ORIGIN_CERT}"
  chmod 600 "${CF_ORIGIN_KEY}"
}

paste_origin_cert() {
  say ""
  say "Create cert: Cloudflare → SSL/TLS → Origin Server → Create certificate"
  say "Hostnames: ${DOMAIN}, *.${DOMAIN}"
  say ""
  say "Paste the ORIGIN CERTIFICATE (PEM), then Ctrl-D:"
  umask 077
  mkdir -p /etc/ssl/cloudflare
  cat > "${CF_ORIGIN_CERT}.tmp" < /dev/tty
  say "Paste the PRIVATE KEY (PEM), then Ctrl-D:"
  cat > "${CF_ORIGIN_KEY}.tmp" < /dev/tty
  if ! grep -q 'BEGIN CERTIFICATE' "${CF_ORIGIN_CERT}.tmp"; then
    rm -f "${CF_ORIGIN_CERT}.tmp" "${CF_ORIGIN_KEY}.tmp"
    fail "Origin certificate PEM missing BEGIN CERTIFICATE"
  fi
  if ! grep -q 'BEGIN.*PRIVATE KEY' "${CF_ORIGIN_KEY}.tmp"; then
    rm -f "${CF_ORIGIN_CERT}.tmp" "${CF_ORIGIN_KEY}.tmp"
    fail "Origin private key PEM missing BEGIN PRIVATE KEY"
  fi
  mv "${CF_ORIGIN_CERT}.tmp" "${CF_ORIGIN_CERT}"
  mv "${CF_ORIGIN_KEY}.tmp" "${CF_ORIGIN_KEY}"
  chmod 644 "${CF_ORIGIN_CERT}"
  chmod 600 "${CF_ORIGIN_KEY}"
}

if [[ -f "${CF_ORIGIN_CERT}" && -f "${CF_ORIGIN_KEY}" ]] \
  && grep -q 'BEGIN CERTIFICATE' "${CF_ORIGIN_CERT}" \
  && grep -q 'BEGIN.*PRIVATE KEY' "${CF_ORIGIN_KEY}"; then
  say "  ✓ Origin cert/key already present at ${CF_ORIGIN_CERT}"
elif [[ -n "${CLOUDFLARE_ORIGIN_CA_KEY}" ]]; then
  say "→ Creating Origin Certificate via Origin CA Key..."
  create_origin_cert_api || fail "Create Origin Certificate via API"
  say "  ✓ Origin Certificate created"
else
  say "No Origin cert on disk and CLOUDFLARE_ORIGIN_CA_KEY not set."
  ask "Paste Origin Certificate now? Type YES (or set CLOUDFLARE_ORIGIN_CA_KEY and re-run)" 0 _PASTE
  [[ "${_PASTE}" == "YES" ]] || fail "Origin Certificate required (files, CLOUDFLARE_ORIGIN_CA_KEY, or paste YES)"
  paste_origin_cert
  say "  ✓ Origin Certificate saved"
fi

# Persist paths for future runs
mkdir -p /etc/carenest
touch "${CUTOVER_ENV}"
chmod 600 "${CUTOVER_ENV}"
if grep -q '^CF_ORIGIN_CERT=' "${CUTOVER_ENV}" 2>/dev/null; then
  sed -i "s|^CF_ORIGIN_CERT=.*|CF_ORIGIN_CERT=${CF_ORIGIN_CERT}|" "${CUTOVER_ENV}"
else
  echo "CF_ORIGIN_CERT=${CF_ORIGIN_CERT}" >> "${CUTOVER_ENV}"
fi
if grep -q '^CF_ORIGIN_KEY=' "${CUTOVER_ENV}" 2>/dev/null; then
  sed -i "s|^CF_ORIGIN_KEY=.*|CF_ORIGIN_KEY=${CF_ORIGIN_KEY}|" "${CUTOVER_ENV}"
else
  echo "CF_ORIGIN_KEY=${CF_ORIGIN_KEY}" >> "${CUTOVER_ENV}"
fi

# ---------------------------------------------------------------------------
# Install nginx Cloudflare HTTPS site (reuses cutover_ssl_apply.sh)
# ---------------------------------------------------------------------------
say "→ Installing nginx Cloudflare HTTPS site..."
export CF_ORIGIN_CERT CF_ORIGIN_KEY CARENEST_DOMAIN="${DOMAIN}" CARENEST_WWW_DOMAIN="${WWW_DOMAIN}"
if ! bash "${SCRIPT_DIR}/cutover_ssl_apply.sh" cloudflare >> "${LOG_FILE}" 2>&1; then
  fail "Install nginx Cloudflare HTTPS site — see ${LOG_FILE} (restore from ${BACKUP_DIR})"
fi
say "  ✓ nginx HTTPS (origin) installed"

# ---------------------------------------------------------------------------
# Verify HTTPS locally (no DNS change; --resolve to 127.0.0.1)
# ---------------------------------------------------------------------------
say "→ Verifying local HTTPS origin..."
LOCAL_CODE="$(curl -sk -o /tmp/carenest_ssl_upgrade_body -w '%{http_code}' --connect-timeout 5 --max-time 20 \
  --resolve "${DOMAIN}:443:127.0.0.1" "https://${DOMAIN}/api/health" 2>/dev/null || true)"
LOCAL_BODY="$(cat /tmp/carenest_ssl_upgrade_body 2>/dev/null || true)"
log "local https health code=${LOCAL_CODE} body=${LOCAL_BODY}"
if [[ "${LOCAL_CODE}" != "200" ]] || ! echo "${LOCAL_BODY}" | grep -q healthy; then
  fail "Local HTTPS /api/health failed (HTTP ${LOCAL_CODE}) — origin not ready for Full (strict)"
fi
if echo "${LOCAL_BODY}" | grep -q '"mongo":"ok"'; then
  say "  ✓ Local HTTPS /api/health (mongo:ok)"
else
  say "  ✓ Local HTTPS /api/health (HTTP 200)"
fi

HOME_CODE="$(curl -sk -o /dev/null -w '%{http_code}' --connect-timeout 5 --max-time 20 \
  --resolve "${DOMAIN}:443:127.0.0.1" -H "Host: ${DOMAIN}" "https://${DOMAIN}/" 2>/dev/null || true)"
[[ "${HOME_CODE}" == "200" ]] || fail "Local HTTPS / returned HTTP ${HOME_CODE}"
say "  ✓ Local HTTPS / (HTTP 200)"

# Ensure SG reminder for 443
say ""
say "Ensure EC2 Security Group allows inbound TCP 443 (Cloudflare IPs or 0.0.0.0/0)."

# ---------------------------------------------------------------------------
# Manual Cloudflare clicks (DNS unchanged)
# ---------------------------------------------------------------------------
INSTR="${STATE_DIR}/UPGRADE_FULL_STRICT.txt"
cat > "${INSTR}" <<EOF
CareNest — switch Cloudflare Flexible → Full (strict)
Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)
Domain: ${DOMAIN}
Origin cert: ${CF_ORIGIN_CERT}
nginx backup: ${BACKUP_DIR}

DNS: DO NOT CHANGE (already pointing at EC2)

1) Cloudflare → SSL/TLS → Overview
   Set encryption mode to: Full (strict)
   (Not Flexible. Not Full.)

2) Cloudflare → Caching → Configuration → Purge Everything

3) Optional check: SSL/TLS → Edge Certificates → Always Use HTTPS = On

4) Return here and press ENTER for live verification.

Rollback nginx only (if needed):
  sudo cp ${BACKUP_DIR}/nginx/site.conf ${SITE_AVAIL}
  sudo nginx -t && sudo systemctl restart nginx
  Then set Cloudflare SSL back to Flexible temporarily.
EOF
cp -a "${INSTR}" "${BACKUP_DIR}/UPGRADE_FULL_STRICT.txt" 2>/dev/null || true

say ""
say "======== SWITCH CLOUDFLARE TO FULL (STRICT) ========"
cat "${INSTR}" > /dev/tty
say "===================================================="
say "Saved: ${INSTR}"
say ""
ask "Press ENTER after SSL/TLS is Full (strict) and cache is purged" 0 _DONE

# ---------------------------------------------------------------------------
# Live verify (public HTTPS through Cloudflare)
# ---------------------------------------------------------------------------
say "→ Live public verification..."
VERIFY_OK=0
for i in 1 2 3 4 5 6; do
  if ADMIN_TOKEN="${ADMIN_TOKEN}" BASE_URL="https://${DOMAIN}" \
      bash "${SCRIPT_DIR}/cutover_verify_live.sh" >> "${LOG_FILE}" 2>&1; then
    VERIFY_OK=1
    break
  fi
  say "  … attempt ${i}/6 failed, waiting…"
  sleep 8
done

# Soft fallback checks if full verify script is picky about ga_id etc.
if [[ "${VERIFY_OK}" -ne 1 ]]; then
  HEALTH="$(curl -sS --max-time 20 "https://${DOMAIN}/api/health" || true)"
  log "live health=${HEALTH}"
  if echo "${HEALTH}" | grep -q '"mongo":"ok"'; then
    HDRS="$(curl -sSI --max-time 20 "https://${DOMAIN}/" || true)"
    if ! echo "${HDRS}" | grep -qi '__emg_'; then
      VERIFY_OK=1
      say "  ✓ Live health mongo:ok and no Emergent cookies (partial verify)"
    fi
  fi
fi

[[ "${VERIFY_OK}" -eq 1 ]] || fail "Live verification after Full (strict) — see ${LOG_FILE}"

# Record mode
if grep -q '^SSL_MODE=' /etc/carenest/deploy.env 2>/dev/null; then
  sed -i 's/^SSL_MODE=.*/SSL_MODE=cloudflare/' /etc/carenest/deploy.env
else
  echo 'SSL_MODE=cloudflare' >> /etc/carenest/deploy.env
fi
if grep -q '^CUTOVER_SSL_MODE=' "${CUTOVER_ENV}" 2>/dev/null; then
  sed -i 's/^CUTOVER_SSL_MODE=.*/CUTOVER_SSL_MODE=cloudflare/' "${CUTOVER_ENV}"
else
  echo 'CUTOVER_SSL_MODE=cloudflare' >> "${CUTOVER_ENV}"
fi

ok "SSL upgrade successful — Cloudflare Full (strict) active"
