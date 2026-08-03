#!/usr/bin/env bash
# Post-cutover verification against production URL.
# Usage: BASE_URL=https://carenesthomehealth.in ADMIN_TOKEN=... ./cutover_verify.sh
set -euo pipefail

BASE_URL="${BASE_URL:-https://carenesthomehealth.in}"
API="$BASE_URL/api"
FAIL=0

check() {
  local name="$1"
  shift
  echo -n "• $name ... "
  if "$@"; then
    echo "OK"
  else
    echo "FAIL"
    FAIL=1
  fi
}

check "HTTPS home" curl -sfI "$BASE_URL/" >/dev/null
check "API health" curl -sf "$API/health" | grep -q healthy
check "API config" curl -sf "$API/config/public" | grep -q CareNest
check "robots.txt" curl -sf "$BASE_URL/robots.txt" | grep -q Sitemap
check "sitemap.xml" curl -sf "$BASE_URL/sitemap.xml" | grep -q '<urlset'
check "brand asset" curl -sfI "$BASE_URL/brand-kit/social/hero-banner.jpg" | grep -qi '200\|HTTP'

if [[ -n "${ADMIN_TOKEN:-}" ]]; then
  check "admin stats" curl -sf "$API/admin/stats" -H "X-Admin-Token: $ADMIN_TOKEN" | grep -q leads_total
else
  echo "• admin stats ... SKIP (set ADMIN_TOKEN)"
fi

# Non-destructive lead create (delete manually later if desired)
PHONE="9$(date +%s | tail -c 10)"
check "create lead" curl -sf -X POST "$API/leads" \
  -H 'Content-Type: application/json' \
  -d "{\"name\":\"Cutover Verify\",\"phone\":\"$PHONE\",\"city\":\"Pune\",\"service\":\"Home Nursing\"}" \
  | grep -q '"id"'

if [[ "${SKIP_CHAT:-0}" != "1" ]]; then
  echo -n "• chat stream ... "
  if curl -sf -N --max-time 45 -X POST "$API/chat/stream" \
      -H 'Content-Type: application/json' \
      -d '{"session_id":"cutover-verify","message":"Hi, do you offer home nursing in Pune?"}' \
      | head -c 200 | grep -q .; then
    echo "OK"
  else
    echo "FAIL"
    FAIL=1
  fi
fi

if [[ "$FAIL" -eq 0 ]]; then
  echo "All checks passed."
  exit 0
fi
echo "One or more checks failed." >&2
exit 1
