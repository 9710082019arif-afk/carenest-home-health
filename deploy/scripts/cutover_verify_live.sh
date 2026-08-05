#!/usr/bin/env bash
# Prove public domain is AWS (not Emergent) + SEO + API + lead + chat.
# Usage: bash deploy/scripts/cutover_verify_live.sh
# Exit 0 only if AWS origin is proven.
set -euo pipefail

BASE_URL="${BASE_URL:-https://carenesthomehealth.in}"
ADMIN_TOKEN="${ADMIN_TOKEN:-}"
APP_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
if [[ -z "${ADMIN_TOKEN}" && -f "${APP_ROOT}/backend/.env" ]]; then
  ADMIN_TOKEN="$(grep -E '^ADMIN_TOKEN=' "${APP_ROOT}/backend/.env" | head -1 | cut -d= -f2- | tr -d '"')"
fi

PASS=0
FAIL=0
pass() { echo "  PASS  $*"; PASS=$((PASS + 1)); }
fail() { echo "  FAIL  $*"; FAIL=$((FAIL + 1)); }

echo "Verifying live origin at ${BASE_URL}"

HEALTH="$(curl -sS --max-time 20 "${BASE_URL}/api/health" || true)"
echo "  health: ${HEALTH}"
if echo "${HEALTH}" | grep -q '"mongo":"ok"'; then
  pass "health has mongo:ok (AWS build)"
else
  fail "health missing mongo:ok — still Emergent or old build"
fi

MONGO_CODE="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 "${BASE_URL}/api/health/mongo" || true)"
if [[ "${MONGO_CODE}" == "200" ]]; then
  pass "/api/health/mongo HTTP 200"
else
  fail "/api/health/mongo HTTP ${MONGO_CODE} (Emergent returns 404)"
fi

HDRS="$(curl -sSI --max-time 20 "${BASE_URL}/" || true)"
if echo "${HDRS}" | grep -qi '__emg_'; then
  fail "Emergent cookies (__emg_*) still present"
else
  pass "no Emergent __emg_* cookies"
fi

curl -sS --max-time 20 "${BASE_URL}/" -o /tmp/cutover_home.html || true
curl -sS --max-time 20 "${BASE_URL}/locations" -o /tmp/cutover_loc.html || true
curl -sS --max-time 20 "${BASE_URL}/services" -o /tmp/cutover_svc.html || true

if grep -qi 'CareNest' /tmp/cutover_home.html; then
  pass "frontend home contains CareNest"
else
  fail "frontend home"
fi

if curl -sS --max-time 20 "${BASE_URL}/robots.txt" | grep -q Sitemap; then
  pass "robots.txt"
else
  fail "robots.txt"
fi
if curl -sS --max-time 20 "${BASE_URL}/sitemap.xml" | grep -q '<urlset'; then
  pass "sitemap.xml"
else
  fail "sitemap.xml"
fi

LOC_CODE="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 "${BASE_URL}/locations" || true)"
SVC_CODE="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 "${BASE_URL}/services" || true)"
[[ "${LOC_CODE}" == "200" ]] && pass "/locations HTTP 200" || fail "/locations HTTP ${LOC_CODE}"
[[ "${SVC_CODE}" == "200" ]] && pass "/services HTTP 200" || fail "/services HTTP ${SVC_CODE}"

if diff -q /tmp/cutover_home.html /tmp/cutover_loc.html >/dev/null 2>&1; then
  fail "/locations identical to home (SPA soft-404 — not AWS prerender)"
else
  pass "/locations body differs from home (prerender)"
fi

CANON="$(grep -oP 'rel=\"canonical\" href=\"\K[^\"]+' /tmp/cutover_loc.html 2>/dev/null | head -1 || true)"
if echo "${CANON}" | grep -qE '/locations/?$'; then
  pass "locations canonical=${CANON}"
else
  fail "locations canonical='${CANON}' (want .../locations)"
fi

if grep -q 'application/ld+json' /tmp/cutover_home.html; then
  pass "JSON-LD schema present"
else
  fail "JSON-LD schema missing"
fi

CFG="$(curl -sS --max-time 20 "${BASE_URL}/api/config/public" || true)"
if echo "${CFG}" | grep -q 'CareNest Home Health'; then
  pass "config/public"
else
  fail "config/public"
fi
if echo "${CFG}" | grep -q '"ga_id":"[^"]\{1,\}"'; then
  pass "ga_id set"
else
  fail "ga_id empty — set GA_MEASUREMENT_ID on EC2"
fi

if [[ -n "${ADMIN_TOKEN}" ]]; then
  if curl -sS --max-time 20 "${BASE_URL}/api/admin/stats" -H "X-Admin-Token: ${ADMIN_TOKEN}" | grep -q leads_total; then
    pass "admin stats"
  else
    fail "admin stats"
  fi
else
  echo "  WARN  ADMIN_TOKEN unset — skip admin"
fi

if [[ "${SKIP_LEAD:-0}" != "1" ]]; then
  PHONE="9$(date +%s | tail -c 10)"
  if curl -sS --max-time 20 -X POST "${BASE_URL}/api/leads" \
      -H 'Content-Type: application/json' \
      -d "{\"name\":\"Cutover Live\",\"phone\":\"${PHONE}\",\"city\":\"Pune\",\"service\":\"Home Nursing\"}" \
      | grep -q '"id"'; then
    pass "lead create (check SES inbox for email)"
  else
    fail "lead create"
  fi
fi

if [[ "${SKIP_CHAT:-0}" != "1" ]]; then
  if curl -sS -N --max-time 45 -X POST "${BASE_URL}/api/chat/stream" \
      -H 'Content-Type: application/json' \
      -d '{"session_id":"cutover-live","message":"Do you offer home nursing in Pune?"}' \
      | head -c 200 | grep -q .; then
    pass "chat stream"
  else
    fail "chat stream"
  fi
fi

echo
echo "LIVE VERIFY PASS=${PASS} FAIL=${FAIL}"
[[ "${FAIL}" -eq 0 ]]
