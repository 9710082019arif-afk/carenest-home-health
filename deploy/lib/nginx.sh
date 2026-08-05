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

  ln -sfn "${site_avail}" "${site_enabled}"
  rm -f /etc/nginx/sites-enabled/default

  nginx -t || fail "nginx -t failed after HTTP site install"
  systemctl reload nginx || systemctl restart nginx
  log "Nginx HTTP site active"
}
