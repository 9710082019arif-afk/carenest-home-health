#!/usr/bin/env bash
# CareNest Home Health — one-command AWS installer
# Usage (on EC2):
#   git clone ... /opt/carenest/app
#   cd /opt/carenest/app
#   sudo bash deploy/install.sh
#
# Non-interactive secrets (optional):
#   CARENEST_MONGO_URL CARENEST_ADMIN_TOKEN CARENEST_ANTHROPIC_API_KEY
#   CARENEST_SES_SMTP_USER CARENEST_SES_SMTP_PASS
#   CARENEST_SSL_MODE=certbot|cloudflare|none
#   CARENEST_DOMAIN CARENEST_WWW_DOMAIN CARENEST_CERTBOT_EMAIL
set -euo pipefail

DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "${DEPLOY_DIR}/lib/common.sh"

care_trap_errors
require_root

APP_ROOT="$(cd "${DEPLOY_DIR}/.." && pwd)"
export APP_ROOT DEPLOY_DIR
export DOMAIN="${CARENEST_DOMAIN:-carenesthomehealth.in}"
export WWW_DOMAIN="${CARENEST_WWW_DOMAIN:-www.carenesthomehealth.in}"
export SITE_URL="https://${DOMAIN}"
export CERTBOT_EMAIL="${CARENEST_CERTBOT_EMAIL:-info@${DOMAIN}}"
export SSL_MODE="${CARENEST_SSL_MODE:-}"
export CARENEST_USER="${CARENEST_USER:-carenest}"

log "CareNest one-command deploy"
log "APP_ROOT=${APP_ROOT}"

# shellcheck source=lib/packages.sh
source "${DEPLOY_DIR}/lib/packages.sh"
# shellcheck source=lib/wizard.sh
source "${DEPLOY_DIR}/lib/wizard.sh"
# shellcheck source=lib/write_env.sh
source "${DEPLOY_DIR}/lib/write_env.sh"
# shellcheck source=lib/backend.sh
source "${DEPLOY_DIR}/lib/backend.sh"
# shellcheck source=lib/frontend.sh
source "${DEPLOY_DIR}/lib/frontend.sh"
# shellcheck source=lib/systemd.sh
source "${DEPLOY_DIR}/lib/systemd.sh"
# shellcheck source=lib/nginx.sh
source "${DEPLOY_DIR}/lib/nginx.sh"
# shellcheck source=lib/ssl.sh
source "${DEPLOY_DIR}/lib/ssl.sh"
# shellcheck source=lib/verify.sh
source "${DEPLOY_DIR}/lib/verify.sh"

install_system_packages
ensure_carenest_user_and_dirs
detect_runtime
ensure_yarn

run_secrets_wizard
write_env_files

install_backend
build_frontend
install_systemd_unit
install_nginx_site
configure_ssl
start_and_restart_services
run_verification

echo
echo "Deployment Successful"
exit 0
