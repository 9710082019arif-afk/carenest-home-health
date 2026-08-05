#!/usr/bin/env bash
# Backend venv + dependencies

install_backend() {
  local backend="${APP_ROOT}/backend"
  [[ -f "${backend}/server.py" ]] || fail "Missing ${backend}/server.py"
  [[ -f "${backend}/aws_integrations.py" ]] || fail "Missing aws_integrations.py (AWS patch not in tree)"
  [[ -f "${backend}/.env" ]] || fail "Missing backend/.env — wizard did not write secrets"

  log "Creating Python venv with ${PYTHON_BIN}"
  sudo -u "${CARENEST_USER}" -H bash -c "
    set -euo pipefail
    cd '${backend}'
    '${PYTHON_BIN}' -m venv .venv
    # shellcheck disable=SC1091
    source .venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
  "

  # Quick import check (env loaded from .env by app; here just modules)
  sudo -u "${CARENEST_USER}" -H bash -c "
    set -euo pipefail
    cd '${backend}'
    source .venv/bin/activate
    python -c 'import fastapi, motor, anthropic, aiosmtplib, aws_integrations'
  " || fail "Backend Python imports failed"

  log "Backend dependencies installed"
}
