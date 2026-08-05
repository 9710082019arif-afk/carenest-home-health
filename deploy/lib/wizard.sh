#!/usr/bin/env bash
# Secrets wizard — prompts once or reads CARENEST_* env vars / existing files

_prompt() {
  local label="$1"
  local var="$2"
  local silent="${3:-0}"
  local current="${!var:-}"
  if [[ -n "${current}" ]]; then
    return 0
  fi
  if [[ ! -t 0 ]]; then
    return 1
  fi
  if [[ "${silent}" == "1" ]]; then
    read -r -s -p "${label}: " current
    echo
  else
    read -r -p "${label}: " current
  fi
  printf -v "${var}" '%s' "${current}"
  export "${var?}"
}

_load_existing_backend_env() {
  local f="${APP_ROOT}/backend/.env"
  [[ -f "${f}" ]] || return 0
  local line k v
  while IFS= read -r line || [[ -n "${line}" ]]; do
    [[ -z "${line}" || "${line}" =~ ^[[:space:]]*# ]] && continue
    [[ "${line}" =~ ^([A-Z0-9_]+)=(.*)$ ]] || continue
    k="${BASH_REMATCH[1]}"
    v="${BASH_REMATCH[2]}"
    # Strip surrounding quotes from generated files
    if [[ "${v}" =~ ^\"(.*)\"$ ]]; then
      v="${BASH_REMATCH[1]}"
      v="${v//\\\"/\"}"
      v="${v//\\\\/\\}"
    fi
    case "${k}" in
      MONGO_URL|ADMIN_TOKEN|ANTHROPIC_API_KEY|SES_SMTP_USER|SES_SMTP_PASS|SES_SMTP_HOST|SES_SMTP_PORT|SES_REGION|DB_NAME|EMAIL_FROM|EMAIL_FROM_NAME|LEAD_NOTIFY_EMAIL|CORS_ORIGINS|ANTHROPIC_MODEL|GA_MEASUREMENT_ID|GTM_ID|META_PIXEL_ID)
        if [[ -z "${!k:-}" ]]; then
          printf -v "${k}" '%s' "${v}"
          export "${k?}"
        fi
        ;;
    esac
  done < "${f}"
}

_print_missing_checklist() {
  echo
  echo "Deployment Failed"
  echo "Missing required secrets. Provide them interactively (TTY) or as env vars:"
  echo
  [[ -z "${MONGO_URL:-}" ]] && echo "  [ ] CARENEST_MONGO_URL          (MongoDB Atlas or local URI)"
  [[ -z "${ADMIN_TOKEN:-}" ]] && echo "  [ ] CARENEST_ADMIN_TOKEN        (admin dashboard token)"
  [[ -z "${ANTHROPIC_API_KEY:-}" ]] && echo "  [ ] CARENEST_ANTHROPIC_API_KEY  (sk-ant-... from console.anthropic.com)"
  [[ -z "${SES_SMTP_USER:-}" ]] && echo "  [ ] CARENEST_SES_SMTP_USER     (AWS SES SMTP username)"
  [[ -z "${SES_SMTP_PASS:-}" ]] && echo "  [ ] CARENEST_SES_SMTP_PASS     (AWS SES SMTP password)"
  [[ -z "${SSL_MODE:-}" ]] && echo "  [ ] CARENEST_SSL_MODE          (certbot | cloudflare | none)"
  echo
  echo "Example:"
  echo "  sudo CARENEST_MONGO_URL='mongodb+srv://...' \\"
  echo "       CARENEST_ADMIN_TOKEN='...' \\"
  echo "       CARENEST_ANTHROPIC_API_KEY='sk-ant-...' \\"
  echo "       CARENEST_SES_SMTP_USER='...' \\"
  echo "       CARENEST_SES_SMTP_PASS='...' \\"
  echo "       CARENEST_SSL_MODE=certbot \\"
  echo "       bash deploy/install.sh"
  exit 1
}

run_secrets_wizard() {
  log "Collecting secrets"

  MONGO_URL="${CARENEST_MONGO_URL:-${MONGO_URL:-}}"
  ADMIN_TOKEN="${CARENEST_ADMIN_TOKEN:-${ADMIN_TOKEN:-}}"
  ANTHROPIC_API_KEY="${CARENEST_ANTHROPIC_API_KEY:-${ANTHROPIC_API_KEY:-}}"
  SES_SMTP_USER="${CARENEST_SES_SMTP_USER:-${SES_SMTP_USER:-}}"
  SES_SMTP_PASS="${CARENEST_SES_SMTP_PASS:-${SES_SMTP_PASS:-}}"
  SSL_MODE="${CARENEST_SSL_MODE:-${SSL_MODE:-}}"
  CF_ORIGIN_CERT="${CARENEST_CF_ORIGIN_CERT:-${CF_ORIGIN_CERT:-}}"
  CF_ORIGIN_KEY="${CARENEST_CF_ORIGIN_KEY:-${CF_ORIGIN_KEY:-}}"
  export MONGO_URL ADMIN_TOKEN ANTHROPIC_API_KEY SES_SMTP_USER SES_SMTP_PASS SSL_MODE CF_ORIGIN_CERT CF_ORIGIN_KEY

  _load_existing_backend_env

  if [[ -f /etc/carenest/deploy.env ]]; then
    # shellcheck disable=SC1091
    source /etc/carenest/deploy.env
    SSL_MODE="${CARENEST_SSL_MODE:-${SSL_MODE:-}}"
  fi

  if [[ -t 0 ]]; then
    echo
    echo "CareNest setup wizard (writes backend/.env — never commit secrets)"
    echo
    _prompt "Mongo URI (MONGO_URL)" MONGO_URL 0 || true
    _prompt "Admin token (ADMIN_TOKEN)" ADMIN_TOKEN 1 || true
    _prompt "Anthropic API key (ANTHROPIC_API_KEY)" ANTHROPIC_API_KEY 1 || true
    _prompt "SES SMTP username (SES_SMTP_USER)" SES_SMTP_USER 0 || true
    _prompt "SES SMTP password (SES_SMTP_PASS)" SES_SMTP_PASS 1 || true
    if [[ -z "${SSL_MODE}" ]]; then
      echo "SSL mode: certbot | cloudflare | none"
      _prompt "SSL mode" SSL_MODE 0 || true
    fi
    if [[ "${SSL_MODE}" == "cloudflare" ]]; then
      _prompt "Path to Cloudflare origin cert PEM" CF_ORIGIN_CERT 0 || true
      _prompt "Path to Cloudflare origin key PEM" CF_ORIGIN_KEY 0 || true
    fi
  fi

  SSL_MODE="$(echo "${SSL_MODE:-}" | tr '[:upper:]' '[:lower:]' | tr -d '[:space:]')"
  case "${SSL_MODE}" in
    certbot|cloudflare|none) ;;
    *) SSL_MODE="" ;;
  esac

  export MONGO_URL ADMIN_TOKEN ANTHROPIC_API_KEY SES_SMTP_USER SES_SMTP_PASS SSL_MODE
  export CF_ORIGIN_CERT CF_ORIGIN_KEY

  local missing=0
  [[ -z "${MONGO_URL}" ]] && missing=1
  [[ -z "${ADMIN_TOKEN}" ]] && missing=1
  [[ -z "${ANTHROPIC_API_KEY}" ]] && missing=1
  [[ -z "${SES_SMTP_USER}" ]] && missing=1
  [[ -z "${SES_SMTP_PASS}" ]] && missing=1
  [[ -z "${SSL_MODE}" ]] && missing=1
  if [[ "${missing}" -eq 1 ]]; then
    _print_missing_checklist
  fi

  if [[ "${SSL_MODE}" == "cloudflare" ]]; then
    [[ -n "${CF_ORIGIN_CERT}" && -f "${CF_ORIGIN_CERT}" ]] || fail "CARENEST_CF_ORIGIN_CERT file missing for cloudflare SSL mode"
    [[ -n "${CF_ORIGIN_KEY}" && -f "${CF_ORIGIN_KEY}" ]] || fail "CARENEST_CF_ORIGIN_KEY file missing for cloudflare SSL mode"
  fi

  log "Secrets ready (SSL_MODE=${SSL_MODE})"
}
