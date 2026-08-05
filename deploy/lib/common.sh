#!/usr/bin/env bash
# Shared helpers for CareNest deploy/install.sh
set -euo pipefail

log() { echo "==> $*"; }
warn() { echo "WARNING: $*" >&2; }

fail() {
  echo
  echo "Deployment Failed"
  echo "$*"
  exit 1
}

care_trap_errors() {
  trap 'rc=$?; echo; echo "Deployment Failed"; echo "Command failed (exit ${rc}) at line ${LINENO}: ${BASH_COMMAND}"; exit ${rc}' ERR
}

require_root() {
  if [[ "${EUID}" -ne 0 ]]; then
    fail "Run as root: sudo bash deploy/install.sh"
  fi
}

detect_runtime() {
  if ! command -v python3 >/dev/null 2>&1; then
    fail "python3 not found after package install"
  fi
  PYTHON_BIN="$(command -v python3)"
  PYTHON_VER="$("${PYTHON_BIN}" -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')"
  PYTHON_FULL="$("${PYTHON_BIN}" -c 'import sys; print(sys.version.split()[0])')"
  export PYTHON_BIN PYTHON_VER PYTHON_FULL
  log "Python ${PYTHON_FULL} (${PYTHON_BIN})"

  if ! "${PYTHON_BIN}" -c 'import venv' 2>/dev/null; then
    fail "python3-venv missing for ${PYTHON_BIN}"
  fi

  if ! command -v node >/dev/null 2>&1; then
    fail "node not found after package install"
  fi
  if ! command -v npm >/dev/null 2>&1; then
    fail "npm not found after package install"
  fi
  NODE_BIN="$(command -v node)"
  NODE_VER="$(node -v)"
  export NODE_BIN NODE_VER
  log "Node ${NODE_VER} (${NODE_BIN})"

  mkdir -p /etc/carenest
  cat > /etc/carenest/python.env <<EOF
PYTHON_BIN=${PYTHON_BIN}
PYTHON_VERSION=${PYTHON_VER}
EOF
  chmod 644 /etc/carenest/python.env
}

ensure_yarn() {
  if command -v yarn >/dev/null 2>&1; then
    log "Yarn $(yarn -v)"
    return 0
  fi
  log "Installing Yarn Classic 1.22.22"
  if command -v corepack >/dev/null 2>&1; then
    corepack enable || true
    if corepack prepare yarn@1.22.22 --activate; then
      log "Yarn $(yarn -v) via corepack"
      return 0
    fi
  fi
  npm install -g yarn@1.22.22
  command -v yarn >/dev/null 2>&1 || fail "yarn install failed"
  log "Yarn $(yarn -v)"
}

ensure_carenest_user_and_dirs() {
  if ! id "${CARENEST_USER}" >/dev/null 2>&1; then
    useradd -m -s /bin/bash "${CARENEST_USER}"
    log "Created user ${CARENEST_USER}"
  else
    log "User ${CARENEST_USER} exists"
  fi

  mkdir -p \
    /opt/carenest \
    /opt/carenest/app \
    /var/www/carenest/frontend \
    /var/log/carenest \
    /var/backups/carenest \
    /etc/carenest \
    /var/www/html

  # If installer is running from a clone already under /opt/carenest/app, keep it.
  # Otherwise ensure APP_ROOT is owned correctly.
  chown -R "${CARENEST_USER}:${CARENEST_USER}" /opt/carenest /var/log/carenest /var/backups/carenest || true
  chown -R "${CARENEST_USER}:${CARENEST_USER}" /var/www/carenest || true
  if [[ -n "${APP_ROOT:-}" && -d "${APP_ROOT}" ]]; then
    chown -R "${CARENEST_USER}:${CARENEST_USER}" "${APP_ROOT}" || true
  fi

  if [[ -d /etc/sudoers.d ]]; then
    cat > /etc/sudoers.d/carenest-api <<EOF
${CARENEST_USER} ALL=(root) NOPASSWD: /bin/systemctl restart carenest-api, /bin/systemctl status carenest-api, /bin/systemctl reload nginx, /bin/systemctl restart nginx
EOF
    chmod 440 /etc/sudoers.d/carenest-api
  fi
}
