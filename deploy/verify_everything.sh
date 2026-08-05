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

# Defer nginx reload to the try_files fix below — reloading here then again
# there caused curl races (HTTP 000 / "000000") on /locations and /services.
if ! nginx -t >/dev/null 2>&1; then
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
HEALTH_JSON="$(curl -sf --max-time 10 http://127.0.0.1:8000/api/health 2>/dev/null || true)"
if echo "${HEALTH_JSON}" | grep -q '"status":"healthy"'; then
  pass "GET /api/health healthy"
else
  fail "GET /api/health not healthy (${HEALTH_JSON:-no response})"
fi
if echo "${HEALTH_JSON}" | grep -q '"mongo":"ok"'; then
  pass "Mongo connected"
else
  # older health without mongo field still ok if healthy
  if echo "${HEALTH_JSON}" | grep -q '"status":"healthy"'; then
    warn "Mongo field missing in health JSON (API may be older build)"
  else
    fail "Mongo not ok"
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
# Prerender writes locations/index.html + services/index.html. Old nginx
# `try_files $uri $uri/ /index.html` 301s /locations → /locations/. Fix in place.
_http_code() {
  # curl writes "000" on connect failure AND exits non-zero — never append
  # another "000" via `|| echo 000` (that produced the bogus "000000" FAILs).
  local url="$1"
  local out="${2:-/dev/null}"
  local code
  code="$(curl -sS -o "${out}" -w '%{http_code}' --connect-timeout 2 --max-time 10 \
    -H "Host: ${DOMAIN}" "${url}" 2>/dev/null || true)"
  # Trim whitespace; collapse accidental double "000000"
  code="$(printf '%s' "${code}" | tr -d '[:space:]')"
  if [[ "${code}" == "000000" ]]; then
    code="000"
  fi
  if [[ -z "${code}" || ! "${code}" =~ ^[0-9]{3}$ ]]; then
    code="000"
  fi
  printf '%s' "${code}"
}
_wait_nginx_ready() {
  # Wait until nginx answers with a real status (not connect-fail 000).
  local i code
  for i in $(seq 1 20); do
    code="$(_http_code "http://127.0.0.1/" /dev/null)"
    if [[ "${code}" != "000" ]]; then
      return 0
    fi
    sleep 0.25
  done
  return 0
}
_nginx_listening_80() {
  ss -tln 2>/dev/null | grep -qE ':80\s' || ss -tlnp 2>/dev/null | grep -qE ':80\s'
}
# SSL_MODE=none: force the HTTP site onto :80.
# Root cause of "frontend home via nginx" + "nginx /api/health HTTP 000":
# nginx.service can be active while sites-enabled has no server listening on
# port 80 (prior verify deleted sites-enabled/$DOMAIN after linking it, or
# HTTPS leftover config failed to bind). Symlink recreate without restart
# left the master process with zero :80 listeners.
_ensure_ssl_none_http_nginx() {
  if [[ "${SSL_MODE}" != "none" && -n "${SSL_MODE}" ]]; then
    return 0
  fi
  local site_avail="/etc/nginx/sites-available/${DOMAIN}"
  local site_enabled="/etc/nginx/sites-enabled/${DOMAIN}"
  local http_tmpl="${DEPLOY_DIR}/nginx/carenesthomehealth.in.http.conf"
  local need_apply=0
  local tmp_new backup=""
  [[ -f "${http_tmpl}" ]] || { warn "missing ${http_tmpl}"; return 0; }

  tmp_new="$(mktemp)"
  sed \
    -e "s|__DOMAIN__|${DOMAIN}|g" \
    -e "s|__WWW_DOMAIN__|${WWW_DOMAIN}|g" \
    -e "s|__DOCROOT__|/var/www/carenest/frontend|g" \
    "${http_tmpl}" > "${tmp_new}"

  if [[ ! -f "${site_avail}" ]] || ! cmp -s "${tmp_new}" "${site_avail}"; then
    need_apply=1
  fi

  # Enable canonical site; never rm sites-enabled/${DOMAIN} afterward.
  if [[ ! -e "${site_enabled}" ]] || \
     [[ "$(readlink -f "${site_enabled}" 2>/dev/null || true)" != "$(readlink -f "${site_avail}" 2>/dev/null || true)" ]]; then
    need_apply=1
  fi

  # Heal: no :80 socket, or curl cannot connect (HTTP 000)
  if ! _nginx_listening_80; then
    need_apply=1
  fi
  if [[ "$(_http_code "http://127.0.0.1/" /dev/null)" == "000" ]]; then
    need_apply=1
  fi

  if [[ "${need_apply}" -eq 1 ]]; then
    if [[ -f "${site_avail}" ]]; then
      backup="$(mktemp)"
      cp "${site_avail}" "${backup}"
    fi
    cp "${tmp_new}" "${site_avail}"
    ln -sfn "${site_avail}" "${site_enabled}"
    rm -f /etc/nginx/sites-enabled/default

    if nginx -t >/dev/null 2>&1; then
      # restart (not reload) so listen sockets are (re)bound after empty sites-enabled
      systemctl restart nginx || true
      _wait_nginx_ready
      if [[ "$(_http_code "http://127.0.0.1/" /dev/null)" != "000" ]] && _nginx_listening_80; then
        fixed "nginx HTTP site (SSL_MODE=none) listening on :80 for ${DOMAIN}"
      else
        # Last resort: kill lingering masters and start clean
        systemctl stop nginx 2>/dev/null || true
        sleep 1
        systemctl start nginx || true
        _wait_nginx_ready
        if [[ "$(_http_code "http://127.0.0.1/" /dev/null)" != "000" ]]; then
          fixed "nginx HTTP site restarted clean on :80"
        else
          warn "nginx still not answering on :80 after HTTP site install"
        fi
      fi
    else
      if [[ -n "${backup}" && -f "${backup}" ]]; then
        cp "${backup}" "${site_avail}"
      fi
      warn "nginx -t failed after installing HTTP site — restored previous config"
    fi
    [[ -n "${backup}" ]] && rm -f "${backup}"
  else
    # Idempotent: keep symlink healthy even when no apply needed
    ln -sfn "${site_avail}" "${site_enabled}"
  fi
  rm -f "${tmp_new}"
}
_fix_prerender_trailing_slash_301() {
  local site_avail="/etc/nginx/sites-available/${DOMAIN}"
  local changed=0
  local f
  for f in "/etc/nginx/sites-available/${DOMAIN}" /etc/nginx/sites-available/carenesthomehealth.in /etc/nginx/sites-available/default; do
    [[ -f "${f}" ]] || continue
    if grep -qE 'try_files \$uri \$uri/ /index\.html' "${f}"; then
      sed -i 's|try_files \$uri \$uri/ /index.html;|try_files $uri $uri/index.html /index.html;|g' "${f}"
      changed=1
    fi
  done
  if [[ "${changed}" -eq 1 ]]; then
    if nginx -t >/dev/null 2>&1; then
      systemctl reload nginx || systemctl restart nginx || true
      _wait_nginx_ready
      local loc_code svc_code
      loc_code="$(_http_code "http://127.0.0.1/locations" /tmp/carenest_verify_fix_loc)"
      svc_code="$(_http_code "http://127.0.0.1/services" /tmp/carenest_verify_fix_svc)"
      if [[ "${loc_code}" == "200" && "${svc_code}" == "200" ]]; then
        fixed "nginx try_files serves prerendered /locations and /services with HTTP 200 (no trailing-slash 301)"
      else
        fixed "nginx try_files config updated (post-reload /locations=${loc_code} /services=${svc_code})"
      fi
    else
      warn "nginx -t failed after try_files fix — left previous config"
    fi
  fi
}
_ensure_ssl_none_http_nginx
_fix_prerender_trailing_slash_301
_ensure_ssl_none_http_nginx
_wait_nginx_ready

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
# Confirm prerendered SEO dirs exist (root cause of old 301s)
if [[ -f "${DOCROOT}/locations/index.html" ]]; then
  pass "prerendered locations/index.html present"
else
  warn "prerendered locations/index.html missing — yarn build may have skipped prerender"
fi
if [[ -f "${DOCROOT}/services/index.html" ]]; then
  pass "prerendered services/index.html present"
else
  warn "prerendered services/index.html missing — yarn build may have skipped prerender"
fi
HOME_BODY=""
HOME_OK=0
for _try in 1 2 3 4 5; do
  HOME_BODY="$(curl -s --max-time 10 -H "Host: ${DOMAIN}" http://127.0.0.1/ 2>/dev/null || true)"
  if echo "${HOME_BODY}" | grep -qi 'CareNest'; then
    HOME_OK=1
    break
  fi
  # Heal empty/broken :80 listener under SSL_MODE=none
  _ensure_ssl_none_http_nginx
  sleep 0.35
done
if [[ "${HOME_OK}" -eq 1 ]]; then
  pass "frontend home via nginx (Host ${DOMAIN})"
else
  fail "frontend home via nginx"
fi
NGINX_API_CODE="000"
for _try in 1 2 3 4 5; do
  NGINX_API_CODE="$(_http_code "http://127.0.0.1/api/health" /tmp/carenest_nginx_api.json)"
  if [[ "${NGINX_API_CODE}" == "200" ]]; then
    break
  fi
  if [[ "${NGINX_API_CODE}" == "000" ]]; then
    _ensure_ssl_none_http_nginx
    sleep 0.35
  else
    break
  fi
done
NGINX_API_BODY="$(cat /tmp/carenest_nginx_api.json 2>/dev/null || true)"
if [[ "${NGINX_API_CODE}" == "200" ]] && echo "${NGINX_API_BODY}" | grep -q healthy; then
  pass "nginx proxies /api/health"
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
_check_seo_path() {
  local path="$1"
  local attempt code
  for attempt in 1 2 3 4 5 6 7 8; do
    code="$(_http_code "http://127.0.0.1${path}" /tmp/carenest_verify_body)"
    if [[ "${code}" == "200" ]]; then
      break
    fi
    if [[ "${code}" == "301" || "${code}" == "302" ]]; then
      _fix_prerender_trailing_slash_301
      _wait_nginx_ready
      sleep 0.25
    elif [[ "${code}" == "000" ]]; then
      # Transient: nginx reload / worker handoff — wait and retry
      sleep 0.35
      _wait_nginx_ready
    else
      break
    fi
  done
  if [[ "${code}" == "200" ]]; then
    if [[ "${path}" == "/locations" || "${path}" == "/services" ]]; then
      if grep -qiE 'CareNest|carenest-seo-bootstrap|<!doctype html>' /tmp/carenest_verify_body; then
        pass "HTTP 200 ${path}"
      else
        fail "HTTP 200 ${path} but body unexpected"
      fi
    elif [[ "${path}" == "/robots.txt" ]]; then
      grep -qiE 'Sitemap|User-agent' /tmp/carenest_verify_body && pass "HTTP 200 ${path}" || fail "${path} body invalid"
    elif [[ "${path}" == "/sitemap.xml" ]]; then
      grep -qiE 'urlset|<url>' /tmp/carenest_verify_body && pass "HTTP 200 ${path}" || fail "${path} body invalid"
    else
      pass "HTTP 200 ${path}"
    fi
  else
    fail "HTTP ${code} ${path}"
  fi
}
for path in /robots.txt /sitemap.xml /locations /services; do
  _check_seo_path "${path}"
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
