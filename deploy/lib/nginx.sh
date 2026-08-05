#!/usr/bin/env bash
# Nginx site installation (HTTP bootstrap first; SSL layer applied by ssl.sh)

install_nginx_site() {
  local http_tmpl="${DEPLOY_DIR}/nginx/carenesthomehealth.in.http.conf"
  local site_avail="/etc/nginx/sites-available/${DOMAIN}"
  local site_enabled="/etc/nginx/sites-enabled/${DOMAIN}"

  [[ -f "${http_tmpl}" ]] || fail "Missing ${http_tmpl}"

  log "Installing Nginx HTTP site for ${DOMAIN}"
  sed \
    -e "s|__DOMAIN__|${DOMAIN}|g" \
    -e "s|__WWW_DOMAIN__|${WWW_DOMAIN}|g" \
    -e "s|__DOCROOT__|/var/www/carenest/frontend|g" \
    "${http_tmpl}" > "${site_avail}"

  # Enable canonical site only — never delete sites-enabled/${DOMAIN} after linking
  # (DOMAIN is often carenesthomehealth.in; deleting that name orphans :80).
  ln -sfn "${site_avail}" "${site_enabled}"
  rm -f /etc/nginx/sites-enabled/default

  nginx -t || fail "nginx -t failed after HTTP site install"
  # restart so listen sockets bind even if a prior empty sites-enabled was loaded
  systemctl restart nginx || systemctl start nginx
  # Confirm :80 is actually answering (active unit alone is not enough)
  local i code
  for i in 1 2 3 4 5 6 7 8; do
    code="$(curl -sS -o /dev/null -w '%{http_code}' --connect-timeout 2 --max-time 5 \
      -H "Host: ${DOMAIN}" "http://127.0.0.1/" 2>/dev/null || true)"
    code="$(printf '%s' "${code}" | tr -d '[:space:]')"
    if [[ "${code}" =~ ^[0-9]{3}$ && "${code}" != "000" ]]; then
      log "Nginx HTTP site active on :80 (HTTP ${code})"
      return 0
    fi
    sleep 0.5
  done
  fail "Nginx installed but not answering on :80 — check sites-enabled/${DOMAIN}"
}
