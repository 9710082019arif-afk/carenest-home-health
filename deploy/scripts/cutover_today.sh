#!/usr/bin/env bash
# CareNest — same-day Emergent→AWS cutover (minimize manual clicks)
#
# ONE COMMAND on EC2:
#   cd /opt/carenest/app && sudo bash deploy/scripts/cutover_today.sh
#
# Optional secrets file (preferred — no interactive .env editing):
#   sudo nano /etc/carenest/cutover.env
#   # EMERGENT_MONGO_URL=...
#   # EMERGENT_DB_NAME=...
#   # GA_MEASUREMENT_ID=G-...
#   # GTM_ID=GTM-...
#   # CLOUDFLARE_API_TOKEN=...
#   # CLOUDFLARE_ZONE_ID=...
#   # CF_ORIGIN_CERT=/etc/ssl/cloudflare/carenest.pem
#   # CF_ORIGIN_KEY=/etc/ssl/cloudflare/carenest.key
#   # CUTOVER_SSL_MODE=cloudflare
#
# Phases: sudo bash deploy/scripts/cutover_today.sh --phase mongo|analytics|ssl|dns|verify|all
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
APP_ROOT="$(cd "${DEPLOY_DIR}/.." && pwd)"
DOMAIN="${CARENEST_DOMAIN:-carenesthomehealth.in}"
WWW_DOMAIN="${CARENEST_WWW_DOMAIN:-www.${DOMAIN}}"
CUTOVER_ENV="/etc/carenest/cutover.env"
BACKUP_DIR="/var/backups/carenest/cutover-$(date +%Y%m%d%H%M%S)"
STATE_DIR="/var/lib/carenest/cutover"
MANUAL_FILE="${STATE_DIR}/MANUAL_CLICKS.txt"

PHASE="all"
if [[ "${1:-}" == "--phase" ]]; then
  PHASE="${2:?phase name required}"
fi

PASS=0
FAIL=0
WARN=0
pass() { echo "  PASS  $*"; PASS=$((PASS + 1)); }
fail() { echo "  FAIL  $*"; FAIL=$((FAIL + 1)); }
warn() { echo "  WARN  $*"; WARN=$((WARN + 1)); }
section() { echo; echo "======== $* ========"; }
want() { [[ "${PHASE}" == "all" || "${PHASE}" == "$1" ]]; }

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run as root: sudo bash deploy/scripts/cutover_today.sh"
  exit 1
fi

mkdir -p "${BACKUP_DIR}" "${STATE_DIR}" /etc/carenest
: > "${MANUAL_FILE}"
# shellcheck disable=SC1091
[[ -f /etc/carenest/deploy.env ]] && source /etc/carenest/deploy.env || true
# shellcheck disable=SC1091
[[ -f "${CUTOVER_ENV}" ]] && source "${CUTOVER_ENV}" || true

_backend_env_get() {
  local key="$1" line
  [[ -f "${APP_ROOT}/backend/.env" ]] || return 0
  line="$(grep -E "^${key}=" "${APP_ROOT}/backend/.env" | head -1 || true)"
  line="${line#${key}=}"; line="${line%\"}"; line="${line#\"}"
  printf '%s' "${line}"
}
_backend_env_set() {
  local key="$1" val="$2" envf="${APP_ROOT}/backend/.env" esc
  touch "${envf}"; chmod 600 "${envf}"
  esc="$(printf '%s' "${val}" | sed -e 's/[\/&]/s/\\&/g')"
  if grep -qE "^${key}=" "${envf}"; then
    sed -i "s/^${key}=.*/${key}=${esc}/" "${envf}"
  else
    printf '%s=%s\n' "${key}" "${val}" >> "${envf}"
  fi
}
_wait_enter() {
  echo; echo ">>> MANUAL ACTION REQUIRED <<<"; echo "$1"; echo
  echo "(Also in ${MANUAL_FILE})"
  [[ "${CUTOVER_NONINTERACTIVE:-0}" == "1" ]] && return 0
  read -r -p "Press ENTER when done (Ctrl-C to abort)... "
}

LIVE_RC=1

# ----- 0 rollback -----
if want all || want rollback; then
  section "0. Rollback DNS snapshot"
  bash "${SCRIPT_DIR}/save_rollback_dns.sh" | tee "${BACKUP_DIR}/rollback-dns.txt"
  cp "${BACKUP_DIR}/rollback-dns.txt" "${STATE_DIR}/rollback-dns.txt"
  pass "DNS rollback → ${BACKUP_DIR}/rollback-dns.txt"
fi

# ----- 1 EIP -----
if want all || want eip; then
  section "1. Detect public IP (Elastic IP)"
  EC2_EIP="$(curl -sS --max-time 8 https://checkip.amazonaws.com 2>/dev/null | tr -d '[:space:]' || true)"
  EC2_EIP="${EC2_EIP:-}"
  if [[ -z "${EC2_EIP}" ]]; then
    fail "Could not detect public IP"
  else
    echo "  Detected public IP: ${EC2_EIP}"
    if [[ "${EC2_EIP}" =~ ^(172\.66\.|162\.159\.) ]]; then
      warn "Looks like Cloudflare anycast — confirm Elastic IP in AWS Console"
    else
      pass "Public IP ${EC2_EIP}"
    fi
    printf 'EC2_EIP=%s\nDOMAIN=%s\nWWW_DOMAIN=%s\n' "${EC2_EIP}" "${DOMAIN}" "${WWW_DOMAIN}" > "${STATE_DIR}/eip.env"
    if grep -q '^EC2_EIP=' "${CUTOVER_ENV}" 2>/dev/null; then
      sed -i "s/^EC2_EIP=.*/EC2_EIP=${EC2_EIP}/" "${CUTOVER_ENV}"
    else
      echo "EC2_EIP=${EC2_EIP}" >> "${CUTOVER_ENV}"
    fi
  fi
fi
# shellcheck disable=SC1091
[[ -f "${STATE_DIR}/eip.env" ]] && source "${STATE_DIR}/eip.env" || true
# shellcheck disable=SC1091
[[ -f "${CUTOVER_ENV}" ]] && source "${CUTOVER_ENV}" || true

ADMIN_TOKEN="${ADMIN_TOKEN:-$(_backend_env_get ADMIN_TOKEN)}"
MONGO_URL="${MONGO_URL:-$(_backend_env_get MONGO_URL)}"

# ----- 2 mongo -----
if want all || want mongo; then
  section "2. Final Mongo sync (Emergent → Atlas)"
  if [[ "${SKIP_MONGO:-0}" == "1" ]]; then
    warn "SKIP_MONGO=1"
  elif [[ -z "${EMERGENT_MONGO_URL:-}" ]]; then
    cat >> "${MANUAL_FILE}" <<'EOF'
MONGO — put URI in /etc/carenest/cutover.env then:
  sudo bash deploy/scripts/cutover_today.sh --phase mongo
Or skip if Atlas already final: SKIP_MONGO=1
EOF
    warn "EMERGENT_MONGO_URL not set — deferred"
  else
    bash "${SCRIPT_DIR}/cutover_mongo_final.sh"
    pass "Mongo final sync done"
  fi
fi

# ----- 3 analytics -----
if want all || want analytics; then
  section "3. Analytics IDs (GA4 / GTM)"
  [[ -n "${GA_MEASUREMENT_ID:-}" ]] && _backend_env_set GA_MEASUREMENT_ID "${GA_MEASUREMENT_ID}" && pass "GA_MEASUREMENT_ID written"
  [[ -n "${GTM_ID:-}" ]] && _backend_env_set GTM_ID "${GTM_ID}" && pass "GTM_ID written"
  [[ -n "${META_PIXEL_ID:-}" ]] && _backend_env_set META_PIXEL_ID "${META_PIXEL_ID}" && pass "META_PIXEL_ID written"
  systemctl restart carenest-api || true
  sleep 2
  CFG="$(curl -sS --max-time 10 http://127.0.0.1:8000/api/config/public || true)"
  echo "  ${CFG}"
  if echo "${CFG}" | grep -q '"ga_id":"[^"]\{1,\}"'; then
    pass "ga_id non-empty"
  else
    cat >> "${MANUAL_FILE}" <<'EOF'
ANALYTICS — add to /etc/carenest/cutover.env:
  GA_MEASUREMENT_ID=G-XXXX
  GTM_ID=GTM-XXXX
Then: sudo bash deploy/scripts/cutover_today.sh --phase analytics
EOF
    warn "ga_id still empty"
  fi
fi

# ----- 4 SSL -----
if want all || want ssl; then
  section "4. Origin SSL"
  SSL_CHOICE="${CUTOVER_SSL_MODE:-}"
  if [[ -z "${SSL_CHOICE}" ]]; then
    if [[ -n "${CF_ORIGIN_CERT:-}" && -f "${CF_ORIGIN_CERT:-}" && -n "${CF_ORIGIN_KEY:-}" && -f "${CF_ORIGIN_KEY:-}" ]]; then
      SSL_CHOICE="cloudflare"
    elif [[ -f /etc/ssl/cloudflare/carenest.pem && -f /etc/ssl/cloudflare/carenest.key ]]; then
      SSL_CHOICE="cloudflare"
      CF_ORIGIN_CERT=/etc/ssl/cloudflare/carenest.pem
      CF_ORIGIN_KEY=/etc/ssl/cloudflare/carenest.key
    else
      SSL_CHOICE="skip"
    fi
  fi
  case "${SSL_CHOICE}" in
    cloudflare)
      if [[ ! -f "${CF_ORIGIN_CERT:-/etc/ssl/cloudflare/carenest.pem}" ]]; then
        cat >> "${MANUAL_FILE}" <<EOF
SSL — Cloudflare UI (one time, ~2 min):
  1. SSL/TLS → Origin Server → Create certificate (${DOMAIN}, *.${DOMAIN})
  2. On EC2:
       sudo mkdir -p /etc/ssl/cloudflare
       sudo tee /etc/ssl/cloudflare/carenest.pem > /dev/null   # paste cert, Ctrl-D
       sudo tee /etc/ssl/cloudflare/carenest.key > /dev/null   # paste key, Ctrl-D
       sudo chmod 600 /etc/ssl/cloudflare/carenest.key
  3. sudo CUTOVER_SSL_MODE=cloudflare bash deploy/scripts/cutover_today.sh --phase ssl
  4. Cloudflare → SSL/TLS → Full (strict)
EOF
        fail "Origin cert missing — see MANUAL_CLICKS"
      else
        export CF_ORIGIN_CERT CF_ORIGIN_KEY
        bash "${SCRIPT_DIR}/cutover_ssl_apply.sh" cloudflare
        pass "Cloudflare origin SSL installed"
      fi
      ;;
    certbot)
      bash "${SCRIPT_DIR}/cutover_ssl_apply.sh" certbot
      pass "Certbot SSL installed"
      ;;
    skip|*)
      cat >> "${MANUAL_FILE}" <<'EOF'
SSL still HTTP-only. Before Full (strict), create Origin Cert (see SSL section) or use certbot after grey-cloud DNS.
EOF
      warn "SSL skipped"
      ;;
  esac
fi

# ----- 5 DNS -----
if want all || want dns; then
  section "5. DNS flip → EC2_EIP=${EC2_EIP:-unknown}"
  if [[ "${SKIP_DNS:-0}" == "1" ]]; then
    warn "SKIP_DNS=1"
  elif [[ -n "${CLOUDFLARE_API_TOKEN:-}" && -n "${CLOUDFLARE_ZONE_ID:-}" ]]; then
    bash "${SCRIPT_DIR}/cutover_dns_cloudflare.sh" apply
    pass "Cloudflare DNS + purge via API"
  else
    cat >> "${MANUAL_FILE}" <<EOF

DNS FLIP — exact records (Hostinger DNS or Cloudflare DNS):
  Type  Name  Value                Proxy
  A     @     ${EC2_EIP:-<EC2_EIP>}  Proxied after origin SSL
  A     www   ${EC2_EIP:-<EC2_EIP>}  Proxied

DO NOT CHANGE: MX, SPF, DKIM, google-site-verification TXT
Then: Cloudflare → Caching → Purge Everything
Then: SSL/TLS → Full (strict)

ZERO-CLICK next run — add to /etc/carenest/cutover.env:
  CLOUDFLARE_API_TOKEN=...
  CLOUDFLARE_ZONE_ID=...
EOF
    echo
    grep -A20 'DNS FLIP' "${MANUAL_FILE}" || true
    _wait_enter "Set A @ and www to ${EC2_EIP:-EIP}, purge cache, Full (strict)."
  fi
fi

# ----- verify -----
if want all || want verify; then
  section "6–9 + 13–15. Live AWS verification"
  sleep 2
  set +e
  ADMIN_TOKEN="${ADMIN_TOKEN}" bash "${SCRIPT_DIR}/cutover_verify_live.sh"
  LIVE_RC=$?
  set -e
fi

# ----- Google UI -----
if want all; then
  section "10–12. Google consoles (login required)"
  cat >> "${MANUAL_FILE}" <<'EOF'

GSC (~2 min): resubmit sitemap.xml; inspect /locations canonical
GA4 (~1 min): Realtime/DebugView after visiting the site
ADS (~3 min): test lead → Tag Assistant shows lead_submit
EOF
  warn "GSC/GA4/Ads = your Google login only"

  cat > "${STATE_DIR}/ROLLBACK.txt" <<EOF
Rollback: restore A records from ${BACKUP_DIR}/rollback-dns.txt
Or: sudo bash deploy/scripts/cutover_dns_cloudflare.sh rollback
EOF
  cat >> "${MANUAL_FILE}" <<'EOF'

EMERGENT OFF at T+72h only if live verify keeps PASSing:
  Cancel Emergent hosting; revoke Emergent keys; remove custom domain
EOF
fi

echo
echo "=============================================="
echo " CUTOVER REPORT  PASS=${PASS} FAIL=${FAIL} WARN=${WARN}"
echo " EIP=${EC2_EIP:-unknown}"
echo " Manual file: ${MANUAL_FILE}"
echo "=============================================="

if want verify || want all; then
  if [[ "${LIVE_RC}" -eq 0 && "${FAIL}" -eq 0 ]]; then
    echo
    echo "Live AWS origin checks PASSED."
    echo "Finish Google clicks in ${MANUAL_FILE}, wait 72h, then:"
    echo "Emergent is no longer serving production traffic and can be safely shut down."
    exit 0
  fi
  echo
  echo "AWS origin not fully proven yet. Finish: ${MANUAL_FILE}"
  echo "Re-check: sudo bash deploy/scripts/cutover_verify_live.sh"
  exit 1
fi
exit 0
