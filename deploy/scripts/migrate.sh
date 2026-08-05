#!/usr/bin/env bash
# CareNest — true one-command Emergent→AWS migration
#
#   cd /opt/carenest/app && sudo bash deploy/scripts/migrate.sh
#
# Prompts only for missing secrets, validates them, shows a checklist,
# then runs the full cutover. Final stdout is ONLY:
#
#   Migration Successful
# or
#   Migration Failed
#   <exact failed step>
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
APP_ROOT="$(cd "${DEPLOY_DIR}/.." && pwd)"
DOMAIN="${CARENEST_DOMAIN:-carenesthomehealth.in}"
WWW_DOMAIN="${CARENEST_WWW_DOMAIN:-www.${DOMAIN}}"
CUTOVER_ENV="/etc/carenest/cutover.env"
STATE_DIR="/var/lib/carenest/cutover"
LOG_DIR="/var/log/carenest"
LOG_FILE="${LOG_DIR}/migrate-$(date +%Y%m%d%H%M%S).log"
BACKUP_ROOT="/var/backups/carenest"
BACKUP_DIR=""
RESTORE_SCRIPT=""

mkdir -p "${STATE_DIR}" "${LOG_DIR}" "${BACKUP_ROOT}" /etc/carenest /etc/ssl/cloudflare
touch "${LOG_FILE}"
chmod 600 "${CUTOVER_ENV}" 2>/dev/null || true

# UI → terminal; detail → log only
say() { printf '%s\n' "$*" > /dev/tty; }
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

print_restore_commands() {
  local out="${1:-/dev/stdout}"
  {
    echo
    echo "=== RESTORE FROM BACKUP ==="
    if [[ -z "${BACKUP_DIR}" || ! -d "${BACKUP_DIR}" ]]; then
      echo "No preflight backup was created yet (failure before backup step)."
      echo "DNS rollback (if DNS was flipped): sudo bash ${SCRIPT_DIR}/cutover_dns_cloudflare.sh rollback"
      return 0
    fi
    if [[ -x "${RESTORE_SCRIPT}" ]]; then
      echo "Run:"
      echo "  sudo bash ${RESTORE_SCRIPT}"
      echo
    fi
    echo "Or manually:"
    echo "  BACKUP=${BACKUP_DIR}"
    [[ -f "${BACKUP_DIR}/backend.env" ]] && echo "  sudo cp \"\$BACKUP/backend.env\" ${APP_ROOT}/backend/.env && sudo chmod 600 ${APP_ROOT}/backend/.env"
    [[ -f "${BACKUP_DIR}/frontend.env" ]] && echo "  sudo cp \"\$BACKUP/frontend.env\" ${APP_ROOT}/frontend/.env && sudo chmod 600 ${APP_ROOT}/frontend/.env"
    [[ -d "${BACKUP_DIR}/nginx/sites-available" ]] && echo "  sudo cp -a \"\$BACKUP/nginx/sites-available/.\" /etc/nginx/sites-available/"
    [[ -d "${BACKUP_DIR}/nginx/sites-enabled" ]] && echo "  sudo rm -rf /etc/nginx/sites-enabled/* && sudo cp -a \"\$BACKUP/nginx/sites-enabled/.\" /etc/nginx/sites-enabled/"
    [[ -f "${BACKUP_DIR}/systemd/carenest-api.service" ]] && echo "  sudo cp \"\$BACKUP/systemd/carenest-api.service\" /etc/systemd/system/carenest-api.service && sudo systemctl daemon-reload"
    echo "  sudo nginx -t && sudo systemctl reload nginx"
    echo "  sudo systemctl restart carenest-api"
    echo "  # If DNS was flipped: sudo bash ${SCRIPT_DIR}/cutover_dns_cloudflare.sh rollback"
    echo "Backup path: ${BACKUP_DIR}"
  } > "${out}"
}

migration_fail() {
  local step="$1"
  log "FAILED: ${step}"
  print_restore_commands "${LOG_FILE}"
  # Final stdout contract + restore hints for the operator
  printf '%s\n%s\n' "Migration Failed" "${step}"
  print_restore_commands /dev/stdout
  # Also show on TTY during interactive runs
  print_restore_commands /dev/tty 2>/dev/null || true
  exit 1
}

migration_ok() {
  log "OK: Migration Successful"
  log "Preflight backup retained at ${BACKUP_DIR:-none}"
  printf '%s\n' "Migration Successful"
  exit 0
}

create_preflight_backup() {
  BACKUP_DIR="${BACKUP_ROOT}/$(date +%Y%m%d-%H%M%S)"
  RESTORE_SCRIPT="${BACKUP_DIR}/RESTORE.sh"
  mkdir -p "${BACKUP_DIR}/nginx/sites-available" "${BACKUP_DIR}/nginx/sites-enabled" \
    "${BACKUP_DIR}/systemd" "${BACKUP_DIR}/etc-carenest"

  # 1) backend/.env
  if [[ -f "${APP_ROOT}/backend/.env" ]]; then
    cp -a "${APP_ROOT}/backend/.env" "${BACKUP_DIR}/backend.env"
    chmod 600 "${BACKUP_DIR}/backend.env"
  fi

  # 2) frontend/.env (if present)
  if [[ -f "${APP_ROOT}/frontend/.env" ]]; then
    cp -a "${APP_ROOT}/frontend/.env" "${BACKUP_DIR}/frontend.env"
    chmod 600 "${BACKUP_DIR}/frontend.env"
  fi

  # 3) all nginx site configs
  if [[ -d /etc/nginx/sites-available ]]; then
    cp -a /etc/nginx/sites-available/. "${BACKUP_DIR}/nginx/sites-available/" 2>/dev/null || true
  fi
  if [[ -d /etc/nginx/sites-enabled ]]; then
    # Copy symlinks and targets metadata; also snapshot resolved files
    cp -a /etc/nginx/sites-enabled/. "${BACKUP_DIR}/nginx/sites-enabled/" 2>/dev/null || true
  fi
  if [[ -f /etc/nginx/nginx.conf ]]; then
    cp -a /etc/nginx/nginx.conf "${BACKUP_DIR}/nginx/nginx.conf"
  fi

  # 4) systemd service
  if [[ -f /etc/systemd/system/carenest-api.service ]]; then
    cp -a /etc/systemd/system/carenest-api.service "${BACKUP_DIR}/systemd/carenest-api.service"
  elif [[ -f /lib/systemd/system/carenest-api.service ]]; then
    cp -a /lib/systemd/system/carenest-api.service "${BACKUP_DIR}/systemd/carenest-api.service"
  fi
  systemctl cat carenest-api > "${BACKUP_DIR}/systemd/carenest-api.service.cat" 2>/dev/null || true

  # Extra useful state
  [[ -f /etc/carenest/deploy.env ]] && cp -a /etc/carenest/deploy.env "${BACKUP_DIR}/etc-carenest/deploy.env" || true
  [[ -f /etc/carenest/cutover.env ]] && cp -a /etc/carenest/cutover.env "${BACKUP_DIR}/etc-carenest/cutover.env" || true
  bash "${SCRIPT_DIR}/save_rollback_dns.sh" > "${BACKUP_DIR}/rollback-dns.txt" 2>/dev/null || true
  echo "${BACKUP_DIR}" > "${STATE_DIR}/last-backup-dir"
  ln -sfn "${BACKUP_DIR}" "${STATE_DIR}/last-backup"

  cat > "${RESTORE_SCRIPT}" <<EOF
#!/usr/bin/env bash
# Auto-generated by migrate.sh — restore pre-migration state
set -euo pipefail
BACKUP="${BACKUP_DIR}"
APP_ROOT="${APP_ROOT}"
SCRIPT_DIR="${SCRIPT_DIR}"
if [[ "\${EUID}" -ne 0 ]]; then
  echo "Run as root: sudo bash \$0"
  exit 1
fi
echo "Restoring from \${BACKUP}"
if [[ -f "\${BACKUP}/backend.env" ]]; then
  cp -a "\${BACKUP}/backend.env" "\${APP_ROOT}/backend/.env"
  chmod 600 "\${APP_ROOT}/backend/.env"
  echo "  restored backend/.env"
fi
if [[ -f "\${BACKUP}/frontend.env" ]]; then
  cp -a "\${BACKUP}/frontend.env" "\${APP_ROOT}/frontend/.env"
  chmod 600 "\${APP_ROOT}/frontend/.env"
  echo "  restored frontend/.env"
fi
if [[ -d "\${BACKUP}/nginx/sites-available" ]]; then
  cp -a "\${BACKUP}/nginx/sites-available/." /etc/nginx/sites-available/
  echo "  restored nginx sites-available"
fi
if [[ -d "\${BACKUP}/nginx/sites-enabled" ]]; then
  find /etc/nginx/sites-enabled -mindepth 1 -maxdepth 1 -exec rm -rf {} +
  cp -a "\${BACKUP}/nginx/sites-enabled/." /etc/nginx/sites-enabled/
  echo "  restored nginx sites-enabled"
fi
if [[ -f "\${BACKUP}/nginx/nginx.conf" ]]; then
  cp -a "\${BACKUP}/nginx/nginx.conf" /etc/nginx/nginx.conf
  echo "  restored nginx.conf"
fi
if [[ -f "\${BACKUP}/systemd/carenest-api.service" ]]; then
  cp -a "\${BACKUP}/systemd/carenest-api.service" /etc/systemd/system/carenest-api.service
  systemctl daemon-reload
  echo "  restored carenest-api.service"
fi
if [[ -f "\${BACKUP}/etc-carenest/deploy.env" ]]; then
  mkdir -p /etc/carenest
  cp -a "\${BACKUP}/etc-carenest/deploy.env" /etc/carenest/deploy.env
fi
if [[ -f "\${BACKUP}/etc-carenest/cutover.env" ]]; then
  mkdir -p /etc/carenest
  cp -a "\${BACKUP}/etc-carenest/cutover.env" /etc/carenest/cutover.env
  chmod 600 /etc/carenest/cutover.env
fi
nginx -t
systemctl reload nginx || systemctl restart nginx
systemctl restart carenest-api || true
if [[ -f "\${SCRIPT_DIR}/cutover_dns_cloudflare.sh" ]] && [[ -f /etc/carenest/cutover.env ]]; then
  echo "Attempting Cloudflare DNS rollback (if token present)..."
  # shellcheck disable=SC1091
  source /etc/carenest/cutover.env || true
  if [[ -n "\${CLOUDFLARE_API_TOKEN:-}" && -n "\${CLOUDFLARE_ZONE_ID:-}" ]]; then
    bash "\${SCRIPT_DIR}/cutover_dns_cloudflare.sh" rollback || echo "DNS rollback skipped/failed — restore A records from \${BACKUP}/rollback-dns.txt"
  else
    echo "Set DNS A records from \${BACKUP}/rollback-dns.txt manually if needed"
  fi
fi
echo "Restore complete from \${BACKUP}"
EOF
  chmod 700 "${RESTORE_SCRIPT}"

  log "Preflight backup → ${BACKUP_DIR}"
  say "  ✓ Preflight backup → ${BACKUP_DIR}"
}

if [[ "${EUID}" -ne 0 ]]; then
  migration_fail "Run as root: sudo bash deploy/scripts/migrate.sh"
fi

# ---------------------------------------------------------------------------
# Load existing
# ---------------------------------------------------------------------------
_backend_get() {
  local key="$1" line
  [[ -f "${APP_ROOT}/backend/.env" ]] || return 0
  line="$(grep -E "^${key}=" "${APP_ROOT}/backend/.env" | head -1 || true)"
  line="${line#${key}=}"; line="${line%\"}"; line="${line#\"}"
  printf '%s' "${line}"
}
_backend_set() {
  local key="$1" val="$2" envf="${APP_ROOT}/backend/.env" esc
  touch "${envf}"; chmod 600 "${envf}"
  esc="$(printf '%s' "${val}" | sed -e 's/[\/&]/s/\\&/g')"
  if grep -qE "^${key}=" "${envf}"; then
    sed -i "s/^${key}=.*/${key}=${esc}/" "${envf}"
  else
    printf '%s=%s\n' "${key}" "${val}" >> "${envf}"
  fi
}
_cutover_set() {
  local key="$1" val="$2" esc
  touch "${CUTOVER_ENV}"; chmod 600 "${CUTOVER_ENV}"
  esc="$(printf '%s' "${val}" | sed -e 's/[\/&]/s/\\&/g')"
  if grep -qE "^${key}=" "${CUTOVER_ENV}" 2>/dev/null; then
    sed -i "s/^${key}=.*/${key}=${esc}/" "${CUTOVER_ENV}"
  else
    printf '%s=%s\n' "${key}" "${val}" >> "${CUTOVER_ENV}"
  fi
}

# shellcheck disable=SC1091
[[ -f /etc/carenest/deploy.env ]] && source /etc/carenest/deploy.env || true
# shellcheck disable=SC1091
[[ -f "${CUTOVER_ENV}" ]] && source "${CUTOVER_ENV}" || true

MONGO_URL="${CARENEST_MONGO_URL:-${MONGO_URL:-$(_backend_get MONGO_URL)}}"
DB_NAME="${DB_NAME:-$(_backend_get DB_NAME)}"; DB_NAME="${DB_NAME:-carenest}"
ADMIN_TOKEN="${ADMIN_TOKEN:-$(_backend_get ADMIN_TOKEN)}"
SES_SMTP_USER="${CARENEST_SES_SMTP_USER:-${SES_SMTP_USER:-$(_backend_get SES_SMTP_USER)}}"
SES_SMTP_PASS="${CARENEST_SES_SMTP_PASS:-${SES_SMTP_PASS:-$(_backend_get SES_SMTP_PASS)}}"
SES_SMTP_HOST="${SES_SMTP_HOST:-$(_backend_get SES_SMTP_HOST)}"
SES_SMTP_HOST="${SES_SMTP_HOST:-email-smtp.ap-south-1.amazonaws.com}"
SES_SMTP_PORT="${SES_SMTP_PORT:-$(_backend_get SES_SMTP_PORT)}"
SES_SMTP_PORT="${SES_SMTP_PORT:-587}"
GA_MEASUREMENT_ID="${GA_MEASUREMENT_ID:-$(_backend_get GA_MEASUREMENT_ID)}"
GTM_ID="${GTM_ID:-$(_backend_get GTM_ID)}"
EMERGENT_MONGO_URL="${EMERGENT_MONGO_URL:-}"
EMERGENT_DB_NAME="${EMERGENT_DB_NAME:-}"
CLOUDFLARE_API_TOKEN="${CLOUDFLARE_API_TOKEN:-}"
CLOUDFLARE_ZONE_ID="${CLOUDFLARE_ZONE_ID:-}"
CLOUDFLARE_ORIGIN_CA_KEY="${CLOUDFLARE_ORIGIN_CA_KEY:-}"
CF_ORIGIN_CERT="${CF_ORIGIN_CERT:-/etc/ssl/cloudflare/carenest.pem}"
CF_ORIGIN_KEY="${CF_ORIGIN_KEY:-/etc/ssl/cloudflare/carenest.key}"
SKIP_MONGO="${SKIP_MONGO:-0}"

VENV_PY="${APP_ROOT}/backend/.venv/bin/python3"
[[ -x "${VENV_PY}" ]] || VENV_PY="$(command -v python3)"

# ---------------------------------------------------------------------------
# Validators
# ---------------------------------------------------------------------------
validate_mongo_uri() {
  local uri="$1" label="$2" py out rc=0
  [[ -n "${uri}" ]] || { printf '%s' "${label} is empty"; return 1; }
  [[ "${uri}" =~ ^mongodb(\+srv)?:// ]] || { printf '%s' "${label} must start with mongodb:// or mongodb+srv://"; return 1; }
  py="$(mktemp)"
  cat > "${py}" <<'PY'
import sys
uri = sys.argv[1]
try:
    from pymongo import MongoClient
except Exception:
    sys.exit(0)
try:
    c = MongoClient(uri, serverSelectionTimeoutMS=10000)
    c.admin.command("ping")
    c.close()
except Exception as e:
    print(e)
    sys.exit(1)
sys.exit(0)
PY
  out="$("${VENV_PY}" "${py}" "${uri}" 2>&1)" || rc=$?
  rm -f "${py}"
  [[ "${rc}" -eq 0 ]] || { printf '%s' "${label} connection failed: ${out}"; return 1; }
  return 0
}

validate_ga4() {
  [[ "${1}" =~ ^G-[A-Z0-9]+$ ]] || { printf '%s' "must match G-XXXXXXXX"; return 1; }
}

validate_gtm() {
  [[ "${1}" =~ ^GTM-[A-Z0-9]+$ ]] || { printf '%s' "must match GTM-XXXXXXX"; return 1; }
}

validate_ses() {
  local py out rc=0
  py="$(mktemp)"
  cat > "${py}" <<'PY'
import smtplib, ssl, sys
host, port, user, password = sys.argv[1], int(sys.argv[2]), sys.argv[3], sys.argv[4]
try:
    with smtplib.SMTP(host, port, timeout=15) as s:
        s.ehlo()
        s.starttls(context=ssl.create_default_context())
        s.ehlo()
        s.login(user, password)
except Exception as e:
    print(e)
    sys.exit(1)
sys.exit(0)
PY
  out="$("${VENV_PY}" "${py}" "${SES_SMTP_HOST}" "${SES_SMTP_PORT}" "${SES_SMTP_USER}" "${SES_SMTP_PASS}" 2>&1)" || rc=$?
  rm -f "${py}"
  [[ "${rc}" -eq 0 ]] || { printf '%s' "SES SMTP login failed: ${out}"; return 1; }
  return 0
}

validate_cf_token() {
  local resp
  resp="$(curl -sS --max-time 15 -H "Authorization: Bearer ${1}" \
    "https://api.cloudflare.com/client/v4/user/tokens/verify" 2>/dev/null || true)"
  echo "${resp}" | grep -q '"status":"active"' || { printf '%s' "token inactive or invalid"; return 1; }
  return 0
}

resolve_cf_zone_id() {
  local resp
  resp="$(curl -sS --max-time 15 -H "Authorization: Bearer ${1}" \
    "https://api.cloudflare.com/client/v4/zones?name=${2}" 2>/dev/null || true)"
  python3 -c 'import json,sys; d=json.load(sys.stdin); r=d.get("result") or [];
print(r[0]["id"] if r and d.get("success") else "")' <<<"${resp}"
}

create_origin_cert() {
  [[ -f "${CF_ORIGIN_CERT}" && -f "${CF_ORIGIN_KEY}" ]] && return 0
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

run_step() {
  local name="$1"
  shift
  say "→ ${name}..."
  log "STEP START: ${name}"
  if "$@" >> "${LOG_FILE}" 2>&1; then
    log "STEP OK: ${name}"
    say "  ✓ ${name}"
    return 0
  fi
  migration_fail "${name}"
}

# ---------------------------------------------------------------------------
# Wizard
# ---------------------------------------------------------------------------
say ""
say "CareNest migration wizard (Emergent → AWS)"
say "Detail log: ${LOG_FILE}"
say ""

MISSING_LIST=()
[[ -z "${MONGO_URL}" ]] && MISSING_LIST+=("Atlas MONGO_URL")
[[ -z "${SES_SMTP_USER}" || -z "${SES_SMTP_PASS}" ]] && MISSING_LIST+=("SES SMTP user/pass")
[[ -z "${GA_MEASUREMENT_ID}" ]] && MISSING_LIST+=("GA4 ID")
[[ -z "${GTM_ID}" ]] && MISSING_LIST+=("GTM ID")
[[ -z "${CLOUDFLARE_API_TOKEN}" ]] && MISSING_LIST+=("Cloudflare API token")
[[ "${SKIP_MONGO}" != "1" && -z "${EMERGENT_MONGO_URL}" ]] && MISSING_LIST+=("Emergent Mongo URI")
if [[ (! -f "${CF_ORIGIN_CERT}" || ! -f "${CF_ORIGIN_KEY}") && -z "${CLOUDFLARE_ORIGIN_CA_KEY}" ]]; then
  MISSING_LIST+=("Cloudflare Origin CA Key")
fi

if [[ "${#MISSING_LIST[@]}" -gt 0 ]]; then
  say "Detected missing values — prompting only for these:"
  for item in "${MISSING_LIST[@]}"; do
    say "  • ${item}"
  done
  say ""
else
  say "All required secrets already present — validating…"
  say ""
fi

[[ -z "${MONGO_URL}" ]] && ask "MongoDB Atlas URI (mongodb+srv://...)" 0 MONGO_URL
[[ -z "${SES_SMTP_USER}" ]] && ask "SES SMTP username" 0 SES_SMTP_USER
[[ -z "${SES_SMTP_PASS}" ]] && ask "SES SMTP password" 1 SES_SMTP_PASS
[[ -z "${GA_MEASUREMENT_ID}" ]] && ask "GA4 Measurement ID (G-XXXXXXXX)" 0 GA_MEASUREMENT_ID
[[ -z "${GTM_ID}" ]] && ask "GTM Container ID (GTM-XXXXXXX)" 0 GTM_ID
[[ -z "${CLOUDFLARE_API_TOKEN}" ]] && ask "Cloudflare API token" 1 CLOUDFLARE_API_TOKEN
if [[ "${SKIP_MONGO}" != "1" && -z "${EMERGENT_MONGO_URL}" ]]; then
  ask "Emergent Mongo URI" 1 EMERGENT_MONGO_URL
  [[ -z "${EMERGENT_DB_NAME}" ]] && ask "Emergent DB name (blank = auto-detect)" 0 EMERGENT_DB_NAME
fi
if [[ (! -f "${CF_ORIGIN_CERT}" || ! -f "${CF_ORIGIN_KEY}") && -z "${CLOUDFLARE_ORIGIN_CA_KEY}" ]]; then
  say "Cloudflare → My Profile → API Tokens → Origin CA Key"
  ask "Cloudflare Origin CA Key" 1 CLOUDFLARE_ORIGIN_CA_KEY
fi

# ---------------------------------------------------------------------------
# Validate — hard refuse
# ---------------------------------------------------------------------------
say ""
say "Validating…"
ERR=""

if ! ERR="$(validate_mongo_uri "${MONGO_URL}" "Atlas MONGO_URL")"; then
  migration_fail "Validate Atlas MongoDB URI — ${ERR}"
fi
say "  ✓ Atlas MongoDB URI"

if [[ "${SKIP_MONGO}" != "1" ]]; then
  if ! ERR="$(validate_mongo_uri "${EMERGENT_MONGO_URL}" "Emergent MONGO_URL")"; then
    migration_fail "Validate Emergent MongoDB URI — ${ERR}"
  fi
  say "  ✓ Emergent MongoDB URI"
fi

if ! ERR="$(validate_ga4 "${GA_MEASUREMENT_ID}")"; then
  migration_fail "Validate GA4 ID — ${ERR}"
fi
say "  ✓ GA4 ID"

if ! ERR="$(validate_gtm "${GTM_ID}")"; then
  migration_fail "Validate GTM ID — ${ERR}"
fi
say "  ✓ GTM ID"

if ! ERR="$(validate_ses)"; then
  migration_fail "Validate SES credentials — ${ERR}"
fi
say "  ✓ SES credentials"

if ! ERR="$(validate_cf_token "${CLOUDFLARE_API_TOKEN}")"; then
  migration_fail "Validate Cloudflare API token — ${ERR}"
fi
say "  ✓ Cloudflare API token"

if [[ -z "${CLOUDFLARE_ZONE_ID}" ]]; then
  CLOUDFLARE_ZONE_ID="$(resolve_cf_zone_id "${CLOUDFLARE_API_TOKEN}" "${DOMAIN}")"
fi
[[ -n "${CLOUDFLARE_ZONE_ID}" ]] || migration_fail "Resolve Cloudflare zone ID for ${DOMAIN}"
say "  ✓ Cloudflare zone ${CLOUDFLARE_ZONE_ID}"

# ---------------------------------------------------------------------------
# Preflight backup BEFORE any file mutations
# ---------------------------------------------------------------------------
say ""
say "Creating preflight backups (before any changes)…"
create_preflight_backup

# Persist (after backup)
_backend_set MONGO_URL "${MONGO_URL}"
_backend_set DB_NAME "${DB_NAME}"
_backend_set SES_SMTP_USER "${SES_SMTP_USER}"
_backend_set SES_SMTP_PASS "${SES_SMTP_PASS}"
_backend_set SES_SMTP_HOST "${SES_SMTP_HOST}"
_backend_set SES_SMTP_PORT "${SES_SMTP_PORT}"
_backend_set GA_MEASUREMENT_ID "${GA_MEASUREMENT_ID}"
_backend_set GTM_ID "${GTM_ID}"
_cutover_set EMERGENT_MONGO_URL "${EMERGENT_MONGO_URL}"
[[ -n "${EMERGENT_DB_NAME}" ]] && _cutover_set EMERGENT_DB_NAME "${EMERGENT_DB_NAME}"
_cutover_set CLOUDFLARE_API_TOKEN "${CLOUDFLARE_API_TOKEN}"
_cutover_set CLOUDFLARE_ZONE_ID "${CLOUDFLARE_ZONE_ID}"
[[ -n "${CLOUDFLARE_ORIGIN_CA_KEY}" ]] && _cutover_set CLOUDFLARE_ORIGIN_CA_KEY "${CLOUDFLARE_ORIGIN_CA_KEY}"
_cutover_set CF_ORIGIN_CERT "${CF_ORIGIN_CERT}"
_cutover_set CF_ORIGIN_KEY "${CF_ORIGIN_KEY}"
_cutover_set CUTOVER_SSL_MODE cloudflare
_cutover_set GA_MEASUREMENT_ID "${GA_MEASUREMENT_ID}"
_cutover_set GTM_ID "${GTM_ID}"
_cutover_set SKIP_MONGO "${SKIP_MONGO}"

EC2_EIP="$(curl -sS --max-time 8 https://checkip.amazonaws.com 2>/dev/null | tr -d '[:space:]' || true)"
[[ -n "${EC2_EIP}" ]] || migration_fail "Detect EC2 public IP"
_cutover_set EC2_EIP "${EC2_EIP}"
printf 'EC2_EIP=%s\nDOMAIN=%s\nWWW_DOMAIN=%s\n' "${EC2_EIP}" "${DOMAIN}" "${WWW_DOMAIN}" > "${STATE_DIR}/eip.env"

# ---------------------------------------------------------------------------
# Checklist
# ---------------------------------------------------------------------------
say ""
say "======== PRE-FLIGHT CHECKLIST ========"
say "  [x] Domain              ${DOMAIN}"
say "  [x] EC2 Elastic IP      ${EC2_EIP}"
say "  [x] Preflight backup    ${BACKUP_DIR}"
say "  [x] Atlas Mongo         validated"
say "  [$([[ "${SKIP_MONGO}" == "1" ]] && echo ' ' || echo 'x')] Emergent Mongo       $([[ "${SKIP_MONGO}" == "1" ]] && echo skipped || echo validated)"
say "  [x] SES SMTP            validated"
say "  [x] GA4                 ${GA_MEASUREMENT_ID}"
say "  [x] GTM                 ${GTM_ID}"
say "  [x] Cloudflare token    validated"
say "  [x] Cloudflare zone     ${CLOUDFLARE_ZONE_ID}"
say "  [x] Origin cert         auto-create if missing"
say "  [x] DNS A @ + www    →  ${EC2_EIP}"
say "  [x] SSL                 Full (strict)"
say "======================================"
say ""
CONFIRM=""
ask "Type YES to start migration" 0 CONFIRM
[[ "${CONFIRM}" == "YES" ]] || migration_fail "Checklist confirmation — typed '${CONFIRM}' instead of YES"

# ---------------------------------------------------------------------------
# Execute
# ---------------------------------------------------------------------------
export MONGO_URL DB_NAME EMERGENT_MONGO_URL EMERGENT_DB_NAME
export GA_MEASUREMENT_ID GTM_ID ADMIN_TOKEN
export CLOUDFLARE_API_TOKEN CLOUDFLARE_ZONE_ID CLOUDFLARE_ORIGIN_CA_KEY
export CF_ORIGIN_CERT CF_ORIGIN_KEY EC2_EIP DOMAIN WWW_DOMAIN
export CUTOVER_SSL_MODE=cloudflare

run_step "Save DNS rollback snapshot" \
  bash -c "bash '${SCRIPT_DIR}/save_rollback_dns.sh' > '${STATE_DIR}/rollback-dns.txt'"

if [[ "${SKIP_MONGO}" != "1" ]]; then
  run_step "Final Mongo sync Emergent → Atlas" \
    bash "${SCRIPT_DIR}/cutover_mongo_final.sh"
fi

run_step "Restart API with analytics IDs" \
  bash -c "systemctl restart carenest-api && sleep 2 && curl -sf http://127.0.0.1:8000/api/config/public | grep -q '\"ga_id\":\"${GA_MEASUREMENT_ID}\"'"

say "→ Create Cloudflare Origin Certificate (if needed)..."
if create_origin_cert >> "${LOG_FILE}" 2>&1; then
  say "  ✓ Origin certificate ready"
else
  migration_fail "Create Cloudflare Origin Certificate"
fi

run_step "Install nginx Cloudflare SSL site" \
  bash "${SCRIPT_DIR}/cutover_ssl_apply.sh" cloudflare

run_step "Cloudflare DNS flip + cache purge + Full (strict)" \
  bash "${SCRIPT_DIR}/cutover_dns_cloudflare.sh" apply

say "→ Waiting for propagation…"
sleep 8

VERIFY_OK=0
for i in 1 2 3 4 5 6 7 8; do
  say "→ Live public verification (attempt ${i}/8)..."
  if ADMIN_TOKEN="${ADMIN_TOKEN}" BASE_URL="https://${DOMAIN}" \
      bash "${SCRIPT_DIR}/cutover_verify_live.sh" >> "${LOG_FILE}" 2>&1; then
    VERIFY_OK=1
    say "  ✓ Live public verification"
    break
  fi
  sleep 12
done
[[ "${VERIFY_OK}" -eq 1 ]] || migration_fail "Live public verification (AWS origin / SEO / API / lead / chat) — see ${LOG_FILE}"

migration_ok
