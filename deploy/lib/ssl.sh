#!/usr/bin/env bash
# SSL: certbot | cloudflare origin | none

configure_ssl() {
  case "${SSL_MODE}" in
    none)
      log "SSL mode=none — leaving HTTP site"
      return 0
      ;;
    certbot)
      _ssl_certbot
      ;;
    cloudflare)
      _ssl_cloudflare
      ;;
    *)
      fail "Unknown SSL_MODE=${SSL_MODE}"
      ;;
  esac
}

_ssl_certbot() {
  local https_tmpl="${DEPLOY_DIR}/nginx/carenesthomehealth.in.https.conf"
  local site_avail="/etc/nginx/sites-available/${DOMAIN}"

  log "Requesting Let's Encrypt cert via Certbot for ${DOMAIN} ${WWW_DOMAIN}"
  # Ensure HTTP site is up for ACME
  systemctl reload nginx || true

  if ! certbot --nginx \
      -d "${DOMAIN}" -d "${WWW_DOMAIN}" \
      --agree-tos -m "${CERTBOT_EMAIL}" \
      --redirect -n; then
    warn "certbot --nginx failed; installing HTTPS template if certs already exist"
    if [[ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]]; then
      sed \
        -e "s|__DOMAIN__|${DOMAIN}|g" \
        -e "s|__WWW_DOMAIN__|${WWW_DOMAIN}|g" \
        -e "s|__DOCROOT__|/var/www/carenest/frontend|g" \
        "${https_tmpl}" > "${site_avail}"
      nginx -t && systemctl reload nginx
    else
      fail "Certbot failed and no existing Let's Encrypt cert for ${DOMAIN}. Fix DNS A records to this host, then re-run install.sh"
    fi
  fi

  systemctl enable certbot.timer 2>/dev/null || true
  log "Certbot SSL configured"
}

_ssl_cloudflare() {
  local cf_tmpl="${DEPLOY_DIR}/nginx/carenesthomehealth.in.cloudflare.conf"
  local site_avail="/etc/nginx/sites-available/${DOMAIN}"
  local cert_dir="/etc/ssl/cloudflare"
  local cert_dst="${cert_dir}/carenest.pem"
  local key_dst="${cert_dir}/carenest.key"

  mkdir -p "${cert_dir}"
  cp "${CF_ORIGIN_CERT}" "${cert_dst}"
  cp "${CF_ORIGIN_KEY}" "${key_dst}"
  chmod 600 "${key_dst}"
  chmod 644 "${cert_dst}"

  sed \
    -e "s|__DOMAIN__|${DOMAIN}|g" \
    -e "s|__WWW_DOMAIN__|${WWW_DOMAIN}|g" \
    -e "s|__DOCROOT__|/var/www/carenest/frontend|g" \
    -e "s|__CF_CERT__|${cert_dst}|g" \
    -e "s|__CF_KEY__|${key_dst}|g" \
    "${cf_tmpl}" > "${site_avail}"

  nginx -t || fail "nginx -t failed for Cloudflare SSL config"
  systemctl reload nginx
  log "Cloudflare origin SSL configured"
}
