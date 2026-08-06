#!/usr/bin/env bash
# Shared GA4 / GTM / Google Tag validators for migrate.sh (sourced; safe under set -u).
# Test with: bash deploy/tests/test_migrate_analytics.sh

# GA4 Measurement ID (required for cutover): G-XXXXXXXX
validate_ga4() {
  local id="${1:-}"
  id="$(printf '%s' "${id}" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
  if [[ "${id}" =~ ^G-[A-Z0-9]+$ ]]; then
    return 0
  fi
  printf '%s' "must match G-XXXXXXXX"
  return 1
}

# GTM / Google Tag (OPTIONAL):
#   - blank / whitespace  → OK (GA4-only)
#   - GTM-XXXXXXX         → classic GTM container
#   - GT-XXXXXXX          → Google tag (gtag.js)
validate_gtm() {
  local id="${1:-}"
  id="$(printf '%s' "${id}" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
  [[ -z "${id}" ]] && return 0
  if [[ "${id}" =~ ^GTM-[A-Z0-9]+$ ]] || [[ "${id}" =~ ^GT-[A-Z0-9]+$ ]]; then
    return 0
  fi
  printf '%s' "optional; use blank, GTM-XXXXXXX, or GT-XXXXXXX"
  return 1
}

# Normalize optional GTM field (trim; empty if whitespace-only).
normalize_optional_gtm() {
  local id="${1:-}"
  printf '%s' "${id}" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//'
}
