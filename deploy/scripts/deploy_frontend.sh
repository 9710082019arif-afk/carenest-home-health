#!/usr/bin/env bash
# Build React app and publish to Nginx docroot.
# Usage: sudo -u carenest bash deploy/scripts/deploy_frontend.sh
set -euo pipefail

APP_ROOT="${APP_ROOT:-/opt/carenest/app}"
FRONTEND="$APP_ROOT/frontend"
DOCROOT="${DOCROOT:-/var/www/carenest/frontend}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/carenest}"

cd "$FRONTEND"
if [[ ! -f .env ]]; then
  echo "Missing $FRONTEND/.env — copy from deploy/env/frontend.env.example" >&2
  exit 1
fi

# Backup previous build
if [[ -d "$DOCROOT" ]] && [[ -f "$DOCROOT/index.html" ]]; then
  TS=$(date +%Y%m%d%H%M%S)
  mkdir -p "$BACKUP_DIR"
  tar -czf "$BACKUP_DIR/frontend-$TS.tgz" -C "$(dirname "$DOCROOT")" "$(basename "$DOCROOT")"
  echo "Backed up previous frontend → $BACKUP_DIR/frontend-$TS.tgz"
fi

yarn install --frozen-lockfile || yarn install
yarn build

rsync -a --delete build/ "$DOCROOT/"
echo "Frontend published to $DOCROOT"
