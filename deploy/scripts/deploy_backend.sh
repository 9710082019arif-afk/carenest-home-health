#!/usr/bin/env bash
# Deploy / update CareNest FastAPI backend on EC2.
# Usage: sudo -u carenest bash deploy/scripts/deploy_backend.sh
set -euo pipefail

APP_ROOT="${APP_ROOT:-/opt/carenest/app}"
BACKEND="$APP_ROOT/backend"

# Prefer interpreter recorded by bootstrap_ec2.sh; otherwise system python3.
if [[ -f /etc/carenest/python.env ]]; then
  # shellcheck disable=SC1091
  source /etc/carenest/python.env
fi
PYTHON_BIN="${PYTHON_BIN:-$(command -v python3)}"

if [[ -z "${PYTHON_BIN}" ]] || [[ ! -x "${PYTHON_BIN}" ]]; then
  echo "ERROR: python3 not found. Re-run deploy/scripts/bootstrap_ec2.sh" >&2
  exit 1
fi

cd "$BACKEND"
if [[ ! -f .env ]]; then
  echo "Missing $BACKEND/.env — copy from deploy/env/backend.env.example" >&2
  exit 1
fi

echo "Using ${PYTHON_BIN} ($("${PYTHON_BIN}" --version 2>&1))"
"${PYTHON_BIN}" -m venv .venv
# shellcheck disable=SC1091
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Optional: install Anthropic if patch applied and not in requirements yet
pip install 'anthropic>=0.40.0' || true

deactivate

if systemctl list-unit-files | grep -q carenest-api.service; then
  sudo systemctl restart carenest-api
  sleep 2
  curl -sf http://127.0.0.1:8000/api/health | tee /dev/stderr
  echo
else
  echo "systemd unit not installed yet. Copy deploy/systemd/carenest-api.service and enable it."
fi

echo "Backend deploy OK"
