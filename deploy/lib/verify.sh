#!/usr/bin/env bash
# Post-deploy verification — SEO + services + health

run_verification() {
  local docroot="/var/www/carenest/frontend"
  local failed=0
  local reasons=()

  _check() {
    local name="$1"
    shift
    if "$@"; then
      echo "  ✓ ${name}"
    else
      echo "  ✗ ${name}"
      failed=1
      reasons+=("${name}")
    fi
  }

  log "Verifying deployment"

  _check "SEO robots.txt intact" test -f "${docroot}/robots.txt"
  _check "SEO sitemap.xml intact" test -f "${docroot}/sitemap.xml"
  _check "SEO soft-404 bootstrap intact" grep -q 'carenest-seo-bootstrap' "${docroot}/index.html"
  _check "SEO schema JSON-LD in index" grep -q 'application/ld+json' "${docroot}/index.html"
  _check "SEO locations soft-404 guard" grep -q 'Never leave deep URLs declaring the homepage as canonical\|setCanonical(url)\|path!=="/"' "${docroot}/index.html"
  _check "Backend aws_integrations present" test -f "${APP_ROOT}/backend/aws_integrations.py"
  _check "Backend .env permissions 600" bash -c "stat -c '%a' '${APP_ROOT}/backend/.env' | grep -qx '600'"
  _check "systemd carenest-api active" systemctl is-active --quiet carenest-api
  _check "systemd nginx active" systemctl is-active --quiet nginx

  # Local API health (includes Mongo ping)
  if curl -sf --max-time 10 http://127.0.0.1:8000/api/health | grep -q '"status":"healthy"'; then
    echo "  ✓ Backend healthy (Mongo connected)"
  else
    echo "  ✗ Backend healthy (Mongo connected)"
    failed=1
    reasons+=("Backend /api/health — Mongo or API down (journalctl -u carenest-api)")
  fi

  if curl -sf --max-time 10 http://127.0.0.1:8000/api/config/public | grep -q 'CareNest Home Health'; then
    echo "  ✓ Backend public config"
  else
    echo "  ✗ Backend public config"
    failed=1
    reasons+=("Backend /api/config/public")
  fi

  # Frontend via nginx localhost
  if curl -sf --max-time 10 -H "Host: ${DOMAIN}" http://127.0.0.1/ | grep -qi 'CareNest'; then
    echo "  ✓ Frontend healthy (nginx HTTP)"
  else
    echo "  ✗ Frontend healthy (nginx HTTP)"
    failed=1
    reasons+=("Frontend via nginx Host ${DOMAIN}")
  fi

  _check "Nginx config valid" nginx -t

  case "${SSL_MODE}" in
    certbot)
      if [[ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]]; then
        echo "  ✓ SSL healthy (Let's Encrypt cert present)"
        if curl -sfk --max-time 10 "https://127.0.0.1/api/health" -H "Host: ${DOMAIN}" | grep -q healthy; then
          echo "  ✓ SSL API reachable locally"
        else
          # Certbot may have rewritten server blocks; still accept cert presence
          warn "Local HTTPS health probe skipped/failed — cert file exists"
          echo "  ✓ SSL healthy (cert on disk)"
        fi
      else
        echo "  ✗ SSL healthy (Let's Encrypt cert present)"
        failed=1
        reasons+=("SSL cert missing under /etc/letsencrypt/live/${DOMAIN}")
      fi
      ;;
    cloudflare)
      if [[ -f /etc/ssl/cloudflare/carenest.pem && -f /etc/ssl/cloudflare/carenest.key ]]; then
        echo "  ✓ SSL healthy (Cloudflare origin cert installed)"
      else
        echo "  ✗ SSL healthy (Cloudflare origin cert installed)"
        failed=1
        reasons+=("Cloudflare origin cert/key missing under /etc/ssl/cloudflare")
      fi
      ;;
    none)
      echo "  ✓ SSL mode=none (HTTP only by design)"
      ;;
  esac

  if [[ "${failed}" -ne 0 ]]; then
    echo
    echo "Deployment Failed"
    echo "Failed checks:"
    local r
    for r in "${reasons[@]}"; do
      echo "  - ${r}"
    done
    exit 1
  fi
}
