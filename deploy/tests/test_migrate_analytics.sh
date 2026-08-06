#!/usr/bin/env bash
# Unit tests for deploy/lib/migrate_analytics.sh
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
# shellcheck source=../lib/migrate_analytics.sh
source "${ROOT}/deploy/lib/migrate_analytics.sh"

PASS=0
FAIL=0
pass() { echo "PASS  $1"; PASS=$((PASS + 1)); }
fail() { echo "FAIL  $1"; FAIL=$((FAIL + 1)); }

assert_ok() {
  local label="$1"
  shift
  if "$@" >/dev/null 2>&1; then
    pass "${label}"
  else
    fail "${label}"
  fi
}
assert_fail() {
  local label="$1"
  shift
  if "$@" >/dev/null 2>&1; then
    fail "${label} (expected failure)"
  else
    pass "${label}"
  fi
}

echo "=== validate_ga4 ==="
assert_ok   "GA4 G-ABC123" validate_ga4 "G-ABC123"
assert_fail "GA4 empty" validate_ga4 ""
assert_fail "GA4 GT- not accepted as GA4" validate_ga4 "GT-TQRJVHNK"
assert_fail "GA4 GTM- not accepted" validate_ga4 "GTM-ABC"

echo "=== validate_gtm (optional) ==="
assert_ok   "GTM blank" validate_gtm ""
assert_ok   "GTM whitespace" validate_gtm "   "
assert_ok   "GTM container" validate_gtm "GTM-ABC123"
assert_ok   "Google Tag GT-" validate_gtm "GT-TQRJVHNK"
assert_fail "GTM junk" validate_gtm "not-a-tag"
assert_fail "GTM G- is wrong field" validate_gtm "G-ABC123"

echo "=== normalize_optional_gtm ==="
[[ "$(normalize_optional_gtm '  GT-TQRJVHNK  ')" == "GT-TQRJVHNK" ]] && pass "normalize trim" || fail "normalize trim"
[[ "$(normalize_optional_gtm '   ')" == "" ]] && pass "normalize blank" || fail "normalize blank"

echo
echo "PASS=${PASS} FAIL=${FAIL}"
[[ "${FAIL}" -eq 0 ]]
