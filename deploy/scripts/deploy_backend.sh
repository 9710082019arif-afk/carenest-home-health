#!/usr/bin/env bash
# Redeploy backend only (after code/env changes). Prefer full deploy/install.sh for first setup.
set -euo pipefail
APP_ROOT="${APP_ROOT:-/opt/carenest/app}"
DEPLOY_DIR="${APP_ROOT}/deploy"
# shellcheck source=../lib/common.sh
source "${DEPLOY_DIR}/lib/common.sh"
# shellcheck source=../lib/backend.sh
source "${DEPLOY_DIR}/lib/backend.sh"

if [[ -f /etc/carenest/python.env ]]; then
  # shellcheck disable=SC1091
  source /etc/carenest/python.env
fi
PYTHON_BIN="${PYTHON_BIN:-$(command -v python3)}"
CARENEST_USER="${CARENEST_USER:-carenest}"
export APP_ROOT DEPLOY_DIR PYTHON_BIN CARENEST_USER

[[ -f "${APP_ROOT}/backend/.env" ]] || fail "Missing backend/.env — run: sudo bash deploy/install.sh"
install_backend
if systemctl list-unit-files | grep -q carenest-api.service; then
  sudo systemctl restart carenest-api
  sleep 2
  curl -sf http://127.0.0.1:8000/api/health
  echo
fi
echo "Backend redeploy OK"
