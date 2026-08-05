#!/usr/bin/env bash
# Shared Mongo URI helpers for migrate.sh (sourced; safe under set -u).
# Test with: bash deploy/tests/test_migrate_mongo.sh

# Return 0 if URI is empty or a known placeholder / example / local-only value.
is_placeholder_mongo_uri() {
  local uri="${1:-}"
  # trim whitespace
  uri="$(printf '%s' "${uri}" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
  [[ -z "${uri}" ]] && return 0

  # Strip surrounding quotes
  if [[ "${uri}" =~ ^\".*\"$ ]]; then
    uri="${uri:1:${#uri}-2}"
  elif [[ "${uri}" =~ ^\'.*\'$ ]]; then
    uri="${uri:1:${#uri}-2}"
  fi

  local lower
  lower="$(printf '%s' "${uri}" | tr '[:upper:]' '[:lower:]')"

  # Explicit placeholders / template markers
  case "${lower}" in
    *change_me*|*change-me*|*changeme*) return 0 ;;
    *your_*|*example.com*|*cluster0.xxxxx*|*cluster.mongodb.net/my*|*user:pass@*) return 0 ;;
    *mongodb+srv://user:pass@*) return 0 ;;
    *mongodb+srv://user:password@*) return 0 ;;
  esac

  # Local / loopback (not Atlas production)
  if [[ "${lower}" =~ (^|[/@])127\.0\.0\.1([:/?]|$) ]] \
    || [[ "${lower}" =~ (^|[/@])localhost([:/?]|$) ]] \
    || [[ "${lower}" =~ (^|[/@])0\.0\.0\.0([:/?]|$) ]] \
    || [[ "${lower}" =~ (^|[/@])::1([:/?]|$) ]]; then
    return 0
  fi

  # Template host leftovers from backend.env.example
  if [[ "${lower}" =~ @cluster(/|\?|$) ]] || [[ "${lower}" =~ //user:pass@ ]]; then
    return 0
  fi

  return 1
}

# Return 0 if URI looks like a real remote Mongo URI (format only; no network).
looks_like_real_mongo_uri() {
  local uri="${1:-}"
  is_placeholder_mongo_uri "${uri}" && return 1
  [[ "${uri}" =~ ^mongodb(\+srv)?://[^[:space:]]+$ ]] || return 1
  # Prefer Atlas-style for production migration; allow mongodb:// to non-localhost hosts
  local lower
  lower="$(printf '%s' "${uri}" | tr '[:upper:]' '[:lower:]')"
  if [[ "${lower}" =~ ^mongodb\+srv:// ]]; then
    return 0
  fi
  # Plain mongodb:// must not be loopback (already filtered) and must have a host
  [[ "${lower}" =~ ^mongodb://[^/@]+@[^/@]+ ]] || [[ "${lower}" =~ ^mongodb://[^/@]+/ ]]
}

# Clear MONGO_URL if placeholder. Echo reason to stdout when clearing.
# Usage: MONGO_URL="$(reject_placeholder_mongo_url "${MONGO_URL}")"
reject_placeholder_mongo_url() {
  local uri="${1:-}"
  if is_placeholder_mongo_uri "${uri}"; then
    return 0  # empty result via not printing? Better: print empty and return 0 meaning rejected
  fi
  printf '%s' "${uri}"
  return 0
}

# Sets global ATLAS_MONGO_MISSING=1 when URI unusable for Atlas production.
atlas_mongo_uri_required_message() {
  printf '%s' "Atlas Mongo URI required."
}
