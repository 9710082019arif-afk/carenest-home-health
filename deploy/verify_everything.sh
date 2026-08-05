#!/usr/bin/env bash
# CareNest — one-command post-deploy verification + safe auto-fixes
# Usage: sudo bash deploy/verify_everything.sh
set -euo pipefail

DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="$(cd "${DEPLOY_DIR}/.." && pwd)"
DOCROOT="/var/www/carenest/frontend"
DOMAIN="${CARENEST_DOMAIN:-carenesthomehealth.in}"
WWW_DOMAIN="${CARENEST_WWW_DOMAIN:-www.${DOMAIN}}"
CARENEST_USER="${CARENEST_USER:-carenest}"

if [[ -f /etc/carenest/deploy.env ]]; then
  # shellcheck disable=SC1091
  source /etc/carenest/deploy.env
  DOMAIN="${DOMAIN:-carenesthomehealth.in}"
  WWW_DOMAIN="${WWW_DOMAIN:-www.${DOMAIN}}"
  SSL_MODE="${SSL_MODE:-}"
fi
SSL_MODE="${CARENEST_SSL_MODE:-${SSL_MODE:-}}"

PASS=0
FAIL=0
WARN=0
MANUAL=()
FIXED=()

if [[ "${EUID}" -ne 0 ]]; then
  echo "Deployment Failed"
  echo "Run as root: sudo bash deploy/verify_everything.sh"
  exit 1
fi

pass() { echo "PASS  $*"; PASS=$((PASS + 1)); }
fail() { echo "FAIL  $*"; FAIL=$((FAIL + 1)); }
warn() { echo "WARN  $*"; WARN=$((WARN + 1)); }
manual() { MANUAL+=("$*"); warn "$* — MANUAL ACTION REQUIRED"; }
fixed() { FIXED+=("$*"); echo "FIXED $*"; }

echo "=============================================="
echo " CareNest deployment verification"
echo " APP_ROOT=${APP_ROOT}"
echo " DOMAIN=${DOMAIN}"
echo " $(date -u +'%Y-%m-%d %H:%M:%S UTC')"
echo "=============================================="
echo

# ---------------------------------------------------------------------------
# Safe auto-fixes (run before checks)
# ---------------------------------------------------------------------------
echo "==> Safe auto-fixes"

# Permissions
if [[ -f "${APP_ROOT}/backend/.env" ]]; then
  chmod 600 "${APP_ROOT}/backend/.env" || true
  chown "${CARENEST_USER}:${CARENEST_USER}" "${APP_ROOT}/backend/.env" || true
  fixed "backend/.env mode 600 + owner ${CARENEST_USER}"
fi
if [[ -f "${APP_ROOT}/frontend/.env" ]]; then
  chmod 600 "${APP_ROOT}/frontend/.env" || true
  chown "${CARENEST_USER}:${CARENEST_USER}" "${APP_ROOT}/frontend/.env" || true
fi
mkdir -p /var/log/carenest /var/www/carenest/frontend /var/backups/carenest
chown -R "${CARENEST_USER}:${CARENEST_USER}" /var/log/carenest /var/backups/carenest || true
if [[ -d "${DOCROOT}" ]]; then
  chown -R www-data:www-data "${DOCROOT}" || true
fi

# Enable units
systemctl enable carenest-api >/dev/null 2>&1 || true
systemctl enable nginx >/dev/null 2>&1 || true

# Port 8000 conflict: if carenest-api is inactive/failed but something listens, clear orphans
_free_stale_8000() {
  local pids
  if systemctl is-active --quiet carenest-api; then
    return 0
  fi
  pids="$(ss -tlnp 2>/dev/null | awk '/:8000 /{print}' || true)"
  if [[ -z "${pids}" ]]; then
    return 0
  fi
  # Collect PIDs listening on 8000
  local pid_list
  pid_list="$(ss -tlnp 2>/dev/null | sed -n 's/.*pid=\([0-9]*\).*/\1/p' | sort -u || true)"
  # Prefer lsof if available
  if command -v lsof >/dev/null 2>&1; then
    pid_list="$(lsof -t -iTCP:8000 -sTCP:LISTEN 2>/dev/null || true)"
  fi
  if [[ -z "${pid_list}" ]]; then
    return 0
  fi
  local pid
  for pid in ${pid_list}; do
    local cmd
    cmd="$(ps -o cmd= -p "${pid}" 2>/dev/null || true)"
    if echo "${cmd}" | grep -Eq 'uvicorn|server:app|/opt/carenest/app/backend'; then
      kill "${pid}" 2>/dev/null || true
      sleep 1
      if kill -0 "${pid}" 2>/dev/null; then
        kill -9 "${pid}" 2>/dev/null || true
      fi
      fixed "stopped stale port-8000 process pid=${pid}"
    fi
  done
}
_free_stale_8000

# Restart API if not active
if ! systemctl is-active --quiet carenest-api; then
  systemctl reset-failed carenest-api 2>/dev/null || true
  systemctl restart carenest-api || true
  sleep 2
  if systemctl is-active --quiet carenest-api; then
    fixed "started carenest-api"
  fi
fi

# Nginx config test + reload
if nginx -t >/dev/null 2>&1; then
  systemctl reload nginx 2>/dev/null || systemctl restart nginx || true
  if systemctl is-active --quiet nginx; then
    fixed "nginx reloaded"
  fi
else
  warn "nginx -t failed — will report in checks (not auto-rewriting site config)"
fi

echo

# ---------------------------------------------------------------------------
# Checks
# ---------------------------------------------------------------------------
section() { echo; echo "--- $* ---"; }

section "1. systemd"
if systemctl is-enabled --quiet carenest-api 2>/dev/null; then
  pass "carenest-api enabled"
else
  systemctl enable carenest-api >/dev/null 2>&1 && fixed "enabled carenest-api" && pass "carenest-api enabled" || fail "carenest-api not enabled"
fi
if systemctl is-active --quiet carenest-api; then
  pass "carenest-api active"
else
  systemctl restart carenest-api || true
  sleep 2
  if systemctl is-active --quiet carenest-api; then
    fixed "restarted carenest-api"
    pass "carenest-api active"
  else
    fail "carenest-api inactive — journalctl -u carenest-api -n 50 --no-pager"
  fi
fi
if systemctl is-active --quiet nginx; then
  pass "nginx active"
else
  systemctl restart nginx || true
  sleep 1
  systemctl is-active --quiet nginx && pass "nginx active" || fail "nginx inactive"
fi

section "2. Port 8000"
if ss -tlnp 2>/dev/null | grep -q ':8000 '; then
  if systemctl is-active --quiet carenest-api; then
    pass "port 8000 listening"
  else
    fail "port 8000 listening but carenest-api inactive (conflict)"
  fi
else
  fail "port 8000 not listening"
fi

section "3. Backend health"
# Do not use curl -f — /api/health returns 503 when Mongo is down; -f hides the body as "no response"
HEALTH_CODE="$(curl -s -o /tmp/carenest_health.json -w '%{http_code}' --max-time 12 http://127.0.0.1:8000/api/health || echo 000)"
HEALTH_JSON="$(cat /tmp/carenest_health.json 2>/dev/null || true)"
if [[ "${HEALTH_CODE}" == "200" ]] && echo "${HEALTH_JSON}" | grep -q '"status":"healthy"'; then
  pass "GET /api/health healthy"
else
  fail "GET /api/health HTTP ${HEALTH_CODE} (${HEALTH_JSON:-empty body})"
fi
if [[ "${HEALTH_CODE}" == "200" ]] && echo "${HEALTH_JSON}" | grep -q '"mongo":"ok"'; then
  pass "Mongo connected"
elif echo "${HEALTH_JSON}" | grep -qi 'mongo'; then
  fail "Mongo not ok — Atlas Network Access must allow this EC2 IP (or fix MONGO_URL)"
  manual "MongoDB Atlas → Network Access → Add IP Address → add this EC2 Elastic IP (or 0.0.0.0/0 temporarily), wait 1 minute, then: sudo systemctl restart carenest-api && sudo bash deploy/verify_everything.sh"
else
  if [[ "${HEALTH_CODE}" == "200" ]]; then
    warn "Mongo field missing in health JSON (API may be older build — restart after git pull)"
  else
    fail "Mongo not ok (health did not return 200)"
    manual "MongoDB Atlas → Network Access → allow this EC2 IP; confirm MONGO_URL in backend/.env; sudo systemctl restart carenest-api"
  fi
fi
if curl -sf --max-time 10 http://127.0.0.1:8000/api/config/public 2>/dev/null | grep -q 'CareNest Home Health'; then
  pass "GET /api/config/public"
else
  fail "GET /api/config/public"
fi
if [[ -f "${APP_ROOT}/backend/aws_integrations.py" ]]; then
  pass "aws_integrations.py present"
else
  fail "aws_integrations.py missing — pull latest main"
fi
if [[ -f "${APP_ROOT}/backend/.venv/bin/uvicorn" ]]; then
  pass "backend venv/uvicorn present"
else
  fail "backend venv missing — re-run sudo bash deploy/install.sh"
fi

section "4. Frontend / Nginx"
# SSL mode=none must not HTTP→HTTPS redirect on localhost checks
_restore_http_nginx_if_needed() {
  local probe
  probe="$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 -H "Host: ${DOMAIN}" http://127.0.0.1/locations || echo 000)"
  if [[ "${probe}" != "301" && "${probe}" != "302" ]]; then
    return 0
  fi
  # cloudflare mode may intentionally redirect — do not clobber
  if [[ "${SSL_MODE}" == "cloudflare" ]]; then
    return 0
  fi
  # If a Let's Encrypt cert exists and SSL_MODE=certbot, leave redirects alone
  if [[ "${SSL_MODE}" == "certbot" && -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]]; then
    return 0
  fi
  local http_tmpl="${DEPLOY_DIR}/nginx/carenesthomehealth.in.http.conf"
  local site_avail="/etc/nginx/sites-available/${DOMAIN}"
  if [[ -f "${http_tmpl}" ]]; then
    sed \
      -e "s|__DOMAIN__|${DOMAIN}|g" \
      -e "s|__WWW_DOMAIN__|${WWW_DOMAIN}|g" \
      -e "s|__DOCROOT__|/var/www/carenest/frontend|g" \
      "${http_tmpl}" > "${site_avail}"
    ln -sfn "${site_avail}" "/etc/nginx/sites-enabled/${DOMAIN}"
    if nginx -t >/dev/null 2>&1; then
      systemctl reload nginx || systemctl restart nginx || true
      fixed "restored HTTP nginx site (removed HTTPS redirect for SSL mode=none)"
      mkdir -p /etc/carenest
      if [[ -f /etc/carenest/deploy.env ]]; then
        if grep -q '^SSL_MODE=' /etc/carenest/deploy.env; then
          sed -i 's/^SSL_MODE=.*/SSL_MODE=none/' /etc/carenest/deploy.env
        else
          echo 'SSL_MODE=none' >> /etc/carenest/deploy.env
        fi
      else
        echo "SSL_MODE=none" > /etc/carenest/deploy.env
      fi
      SSL_MODE=none
    fi
  fi
}
_restore_http_nginx_if_needed

if nginx -t >/dev/null 2>&1; then
  pass "nginx -t"
else
  fail "nginx -t failed"
fi
if [[ -f "${DOCROOT}/index.html" ]]; then
  pass "docroot index.html present"
else
  fail "docroot index.html missing at ${DOCROOT}"
fi
HOME_BODY="$(curl -s --max-time 10 -H "Host: ${DOMAIN}" http://127.0.0.1/ 2>/dev/null || true)"
if echo "${HOME_BODY}" | grep -qi 'CareNest'; then
  pass "frontend home via nginx (Host ${DOMAIN})"
else
  fail "frontend home via nginx"
fi
NGINX_API_CODE="$(curl -s -o /tmp/carenest_nginx_api.json -w '%{http_code}' --max-time 12 -H "Host: ${DOMAIN}" http://127.0.0.1/api/health || echo 000)"
NGINX_API_BODY="$(cat /tmp/carenest_nginx_api.json 2>/dev/null || true)"
if [[ "${NGINX_API_CODE}" == "200" ]] && echo "${NGINX_API_BODY}" | grep -q healthy; then
  pass "nginx proxies /api/health"
elif [[ "${NGINX_API_CODE}" == "503" ]]; then
  fail "nginx proxies /api/health but upstream returned 503 (Mongo) — not an nginx bug"
elif [[ "${NGINX_API_CODE}" == "301" || "${NGINX_API_CODE}" == "302" ]]; then
  fail "nginx redirects /api/health (HTTP ${NGINX_API_CODE}) — expected no redirect when SSL mode=none"
else
  fail "nginx /api/health HTTP ${NGINX_API_CODE}"
fi

section "5. SEO"
if [[ -f "${DOCROOT}/robots.txt" ]]; then
  pass "robots.txt on disk"
else
  fail "robots.txt missing"
fi
if [[ -f "${DOCROOT}/sitemap.xml" ]]; then
  pass "sitemap.xml on disk"
else
  fail "sitemap.xml missing"
fi
if grep -q 'carenest-seo-bootstrap' "${DOCROOT}/index.html" 2>/dev/null; then
  pass "soft-404 SEO bootstrap in index.html"
else
  fail "soft-404 SEO bootstrap missing"
fi
if grep -q 'application/ld+json' "${DOCROOT}/index.html" 2>/dev/null; then
  pass "JSON-LD schema in index.html"
else
  fail "JSON-LD schema missing in index.html"
fi
if grep -Eq 'path!=="/"|setCanonical\(url\)' "${DOCROOT}/index.html" 2>/dev/null; then
  pass "locations soft-404 canonical guard"
else
  fail "locations soft-404 canonical guard missing"
fi
for path in /robots.txt /sitemap.xml /locations /services; do
  code="$(curl -s -o /tmp/carenest_verify_body -w '%{http_code}' --max-time 10 -H "Host: ${DOMAIN}" "http://127.0.0.1${path}" || echo 000)"
  # Follow one redirect only for reporting; success requires final 200 without HTTPS force when SSL=none
  if [[ "${code}" == "301" || "${code}" == "302" ]]; then
    _restore_http_nginx_if_needed
    code="$(curl -s -o /tmp/carenest_verify_body -w '%{http_code}' --max-time 10 -H "Host: ${DOMAIN}" "http://127.0.0.1${path}" || echo 000)"
  fi
  if [[ "${code}" == "200" ]]; then
    if [[ "${path}" == "/locations" || "${path}" == "/services" ]]; then
      if grep -qi 'CareNest\|carenest-seo-bootstrap\|<!doctype html>' /tmp/carenest_verify_body; then
        pass "HTTP 200 ${path}"
      else
        fail "HTTP ${code} ${path} but body unexpected"
      fi
    elif [[ "${path}" == "/robots.txt" ]]; then
      grep -qi 'Sitemap\|User-agent' /tmp/carenest_verify_body && pass "HTTP 200 ${path}" || fail "${path} body invalid"
    elif [[ "${path}" == "/sitemap.xml" ]]; then
      grep -qi 'urlset\|<url>' /tmp/carenest_verify_body && pass "HTTP 200 ${path}" || fail "${path} body invalid"
    else
      pass "HTTP 200 ${path}"
    fi
  else
    fail "HTTP ${code} ${path}"
  fi
done

section "6. Permissions"
if [[ -f "${APP_ROOT}/backend/.env" ]]; then
  mode="$(stat -c '%a' "${APP_ROOT}/backend/.env" 2>/dev/null || echo missing)"
  owner="$(stat -c '%U' "${APP_ROOT}/backend/.env" 2>/dev/null || echo missing)"
  if [[ "${mode}" == "600" ]]; then
    pass "backend/.env mode 600"
  else
    chmod 600 "${APP_ROOT}/backend/.env" && fixed "chmod 600 backend/.env" && pass "backend/.env mode 600" || fail "backend/.env mode ${mode}"
  fi
  if [[ "${owner}" == "${CARENEST_USER}" ]]; then
    pass "backend/.env owner ${CARENEST_USER}"
  else
    chown "${CARENEST_USER}:${CARENEST_USER}" "${APP_ROOT}/backend/.env" && fixed "chown backend/.env" && pass "backend/.env owner ${CARENEST_USER}" || fail "backend/.env owner ${owner}"
  fi
else
  fail "backend/.env missing — re-run install.sh wizard"
  manual "Create secrets via: sudo bash deploy/install.sh"
fi
if id "${CARENEST_USER}" >/dev/null 2>&1; then
  pass "user ${CARENEST_USER} exists"
else
  fail "user ${CARENEST_USER} missing"
fi
if [[ -d /opt/carenest ]]; then
  pass "/opt/carenest exists"
else
  fail "/opt/carenest missing"
fi

section "7. SSL"
has_le=0
has_cf=0
[[ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]] && has_le=1
[[ -f /etc/ssl/cloudflare/carenest.pem && -f /etc/ssl/cloudflare/carenest.key ]] && has_cf=1

if [[ "${has_le}" -eq 1 ]]; then
  pass "Let's Encrypt cert present for ${DOMAIN}"
  if curl -sfk --max-time 10 -H "Host: ${DOMAIN}" "https://127.0.0.1/api/health" 2>/dev/null | grep -q healthy; then
    pass "local HTTPS /api/health"
  else
    warn "local HTTPS probe failed (cert may still be valid behind Cloudflare)"
  fi
elif [[ "${has_cf}" -eq 1 ]]; then
  pass "Cloudflare origin cert present"
elif [[ "${SSL_MODE}" == "none" ]]; then
  pass "SSL mode=none (HTTP only by design)"
else
  warn "No local SSL cert detected (HTTP-only or certs managed elsewhere)"
  if [[ -z "${SSL_MODE}" || "${SSL_MODE}" == "certbot" ]]; then
    manual "If public HTTPS is required: point DNS A records to this EC2, then re-run with CARENEST_SSL_MODE=certbot sudo bash deploy/install.sh"
  fi
fi

section "8. DNS"
if command -v dig >/dev/null 2>&1; then
  A_RECORDS="$(dig +short A "${DOMAIN}" 2>/dev/null | tr '\n' ' ')"
  WWW_RECORDS="$(dig +short A "${WWW_DOMAIN}" 2>/dev/null; dig +short CNAME "${WWW_DOMAIN}" 2>/dev/null | tr '\n' ' ')"
  if [[ -n "${A_RECORDS// }" ]]; then
    pass "DNS A ${DOMAIN} → ${A_RECORDS}"
  else
    fail "DNS A ${DOMAIN} empty"
    manual "Set Cloudflare/Hostinger A record for ${DOMAIN} to this EC2 Elastic IP"
  fi
  if [[ -n "${WWW_RECORDS// }" ]]; then
    pass "DNS ${WWW_DOMAIN} → ${WWW_RECORDS}"
  else
    warn "DNS ${WWW_DOMAIN} empty"
    manual "Set www record for ${WWW_DOMAIN} to this EC2 (A or CNAME)"
  fi
  # Compare to local public IP if possible
  LOCAL_IP="$(curl -sf --max-time 5 https://checkip.amazonaws.com 2>/dev/null || curl -sf --max-time 5 https://ifconfig.me 2>/dev/null || true)"
  if [[ -n "${LOCAL_IP}" && -n "${A_RECORDS}" ]]; then
    if echo "${A_RECORDS}" | grep -q "${LOCAL_IP}"; then
      pass "DNS A matches this host public IP ${LOCAL_IP}"
    else
      # Cloudflare proxy uses CF IPs — not a hard fail
      if echo "${A_RECORDS}" | grep -Eq '104\.|172\.|162\.'; then
        pass "DNS appears Cloudflare-proxied (${A_RECORDS}) — origin IP check N/A"
      else
        warn "DNS A (${A_RECORDS}) does not match this host IP ${LOCAL_IP}"
        manual "If not using Cloudflare proxy, point ${DOMAIN} A record to ${LOCAL_IP}"
      fi
    fi
  fi
else
  apt-get install -y dnsutils >/dev/null 2>&1 || true
  if command -v dig >/dev/null 2>&1; then
    fixed "installed dnsutils"
    A_RECORDS="$(dig +short A "${DOMAIN}" 2>/dev/null | tr '\n' ' ')"
    [[ -n "${A_RECORDS// }" ]] && pass "DNS A ${DOMAIN} → ${A_RECORDS}" || fail "DNS A ${DOMAIN} empty"
  else
    warn "dig not available — skipped DNS checks"
  fi
fi

section "9. Secrets presence (values not printed)"
if [[ -f "${APP_ROOT}/backend/.env" ]]; then
  for key in MONGO_URL ADMIN_TOKEN ANTHROPIC_API_KEY SES_SMTP_USER SES_SMTP_PASS; do
    line="$(grep -E "^${key}=" "${APP_ROOT}/backend/.env" | head -1 || true)"
    val="${line#${key}=}"
    val="${val%\"}"
    val="${val#\"}"
    if [[ -n "${val}" ]]; then
      pass "${key} set"
    else
      fail "${key} missing/empty"
      manual "Set ${key} via: sudo bash deploy/install.sh"
    fi
  done
else
  fail "backend/.env missing"
fi

# ---------------------------------------------------------------------------
# Report
# ---------------------------------------------------------------------------
echo
echo "=============================================="
echo " DEPLOYMENT REPORT"
echo "=============================================="
echo "PASS:  ${PASS}"
echo "FAIL:  ${FAIL}"
echo "WARN:  ${WARN}"
if [[ "${#FIXED[@]}" -gt 0 ]]; then
  echo
  echo "Auto-fixed:"
  for x in "${FIXED[@]}"; do echo "  - ${x}"; done
fi
if [[ "${#MANUAL[@]}" -gt 0 ]]; then
  echo
  echo "Manual action required:"
  for x in "${MANUAL[@]}"; do echo "  - ${x}"; done
fi
echo

if [[ "${FAIL}" -eq 0 ]]; then
  echo "VERIFICATION PASSED"
  exit 0
fi

echo "VERIFICATION FAILED"
echo "Re-check failures above. Safe fixes already attempted."
echo "For API crashes: sudo journalctl -u carenest-api -n 100 --no-pager"
exit 1
