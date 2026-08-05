#!/usr/bin/env bash
# Redeploy frontend only. Prefer full deploy/install.sh for first setup.
set -euo pipefail
APP_ROOT="${APP_ROOT:-/opt/carenest/app}"
DEPLOY_DIR="${APP_ROOT}/deploy"
# shellcheck source=../lib/common.sh
source "${DEPLOY_DIR}/lib/common.sh"
# shellcheck source=../lib/frontend.sh
source "${DEPLOY_DIR}/lib/frontend.sh"

CARENEST_USER="${CARENEST_USER:-carenest}"
export APP_ROOT DEPLOY_DIR CARENEST_USER DOMAIN="${CARENEST_DOMAIN:-carenesthomehealth.in}"

[[ -f "${APP_ROOT}/frontend/.env" ]] || fail "Missing frontend/.env — run: sudo bash deploy/install.sh"
command -v yarn >/dev/null 2>&1 || fail "yarn missing — run: sudo bash deploy/install.sh"
build_frontend
sudo systemctl reload nginx || true
echo "Frontend redeploy OK"
