#!/usr/bin/env bash
# Final Emergent → Atlas mongodump/mongorestore using EC2 backend/.env MONGO_URL.
# Usage:
#   sudo EMERGENT_MONGO_URL='...' EMERGENT_DB_NAME='...' bash deploy/scripts/cutover_mongo_final.sh
set -euo pipefail

APP_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ENVF="${APP_ROOT}/backend/.env"

_get() {
  local key="$1"
  local line
  line="$(grep -E "^${key}=" "${ENVF}" 2>/dev/null | head -1 || true)"
  line="${line#${key}=}"
  line="${line%\"}"; line="${line#\"}"
  printf '%s' "${line}"
}

: "${EMERGENT_MONGO_URL:?Set EMERGENT_MONGO_URL}"
EMERGENT_DB_NAME="${EMERGENT_DB_NAME:-}"
MONGO_URL="${MONGO_URL:-$(_get MONGO_URL)}"
TARGET_DB="${TARGET_DB:-$(_get DB_NAME)}"
TARGET_DB="${TARGET_DB:-carenest}"
: "${MONGO_URL:?MONGO_URL missing (backend/.env)}"

if ! command -v mongodump >/dev/null 2>&1 || ! command -v mongorestore >/dev/null 2>&1; then
  echo "Installing mongodb-database-tools..."
  apt-get update -qq
  apt-get install -y -qq mongodb-database-tools 2>/dev/null \
    || apt-get install -y -qq mongo-tools 2>/dev/null \
    || true
fi
command -v mongodump >/dev/null 2>&1 || { echo "mongodump not found — install MongoDB Database Tools"; exit 1; }

OUT="/tmp/carenest-final-emergent-dump-$$"
mkdir -p "${OUT}"

if [[ -z "${EMERGENT_DB_NAME}" ]]; then
  # Best-effort: dump all DBs then prefer non-admin
  echo "==> EMERGENT_DB_NAME not set — dumping default DB from URI"
  mongodump --uri="${EMERGENT_MONGO_URL}" --out="${OUT}"
  # pick first directory that isn't admin/local/config
  EMERGENT_DB_NAME="$(find "${OUT}" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' \
    | grep -Ev '^(admin|local|config)$' | head -1 || true)"
  [[ -n "${EMERGENT_DB_NAME}" ]] || { echo "Could not detect Emergent DB name"; exit 1; }
  echo "==> Detected EMERGENT_DB_NAME=${EMERGENT_DB_NAME}"
else
  mongodump --uri="${EMERGENT_MONGO_URL}" --db="${EMERGENT_DB_NAME}" --out="${OUT}"
fi

echo "==> Restoring ${EMERGENT_DB_NAME}.* → ${TARGET_DB}.* (DROP)"
mongorestore --uri="${MONGO_URL}" --drop \
  --nsFrom="${EMERGENT_DB_NAME}.*" --nsTo="${TARGET_DB}.*" \
  "${OUT}/${EMERGENT_DB_NAME}"

systemctl restart carenest-api || true
sleep 2
curl -sf http://127.0.0.1:8000/api/health | grep -q '"mongo":"ok"'
echo "OK mongo sync + health"
rm -rf "${OUT}"
