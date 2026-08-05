#!/usr/bin/env bash
# Frontend yarn build + publish to Nginx docroot

build_frontend() {
  local frontend="${APP_ROOT}/frontend"
  local docroot="/var/www/carenest/frontend"
  local backup="/var/backups/carenest"

  [[ -f "${frontend}/package.json" ]] || fail "Missing ${frontend}/package.json"
  [[ -f "${frontend}/.env" ]] || fail "Missing frontend/.env"

  if [[ -d "${docroot}" && -f "${docroot}/index.html" ]]; then
    mkdir -p "${backup}"
    tar -czf "${backup}/frontend-$(date +%Y%m%d%H%M%S).tgz" -C "$(dirname "${docroot}")" "$(basename "${docroot}")" || true
  fi

  log "Building React frontend (yarn)"
  sudo -u "${CARENEST_USER}" -H bash -c "
    set -euo pipefail
    cd '${frontend}'
    yarn install --frozen-lockfile || yarn install
    yarn build
  " || fail "Frontend yarn build failed"

  [[ -f "${frontend}/build/index.html" ]] || fail "Frontend build missing index.html"
  [[ -f "${frontend}/build/robots.txt" ]] || fail "Frontend build missing robots.txt (SEO)"
  [[ -f "${frontend}/build/sitemap.xml" ]] || fail "Frontend build missing sitemap.xml (SEO)"

  # Soft-404 / SEO bootstrap must remain in built index
  if ! grep -q 'carenest-seo-bootstrap' "${frontend}/build/index.html"; then
    fail "SEO soft-404 bootstrap missing from build/index.html"
  fi

  rsync -a --delete "${frontend}/build/" "${docroot}/"
  chown -R www-data:www-data "${docroot}"
  find "${docroot}" -type d -exec chmod 755 {} \;
  find "${docroot}" -type f -exec chmod 644 {} \;

  log "Frontend published to ${docroot}"
}
