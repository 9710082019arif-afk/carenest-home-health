#!/usr/bin/env bash
# Unit tests for deploy/lib/migrate_mongo.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
# shellcheck source=../lib/migrate_mongo.sh
source "${ROOT}/deploy/lib/migrate_mongo.sh"

PASS=0
FAIL=0
assert_true() {
  local name="$1"
  shift
  if "$@"; then
    echo "PASS  ${name}"
    PASS=$((PASS + 1))
  else
    echo "FAIL  ${name}"
    FAIL=$((FAIL + 1))
  fi
}
assert_false() {
  local name="$1"
  shift
  if "$@"; then
    echo "FAIL  ${name} (expected false)"
    FAIL=$((FAIL + 1))
  else
    echo "PASS  ${name}"
    PASS=$((PASS + 1))
  fi
}
assert_eq() {
  local name="$1" got="$2" want="$3"
  if [[ "${got}" == "${want}" ]]; then
    echo "PASS  ${name}"
    PASS=$((PASS + 1))
  else
    echo "FAIL  ${name} got='${got}' want='${want}'"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== is_placeholder_mongo_uri ==="
assert_true "empty is placeholder" is_placeholder_mongo_uri ""
assert_true "localhost" is_placeholder_mongo_uri "mongodb://localhost:27017"
assert_true "127.0.0.1 with CHANGE_ME" is_placeholder_mongo_uri \
  'mongodb://carenest:CHANGE_ME_STRONG_PASSWORD@127.0.0.1:27017/carenest?authSource=carenest'
assert_true "quoted CHANGE_ME" is_placeholder_mongo_uri \
  '"mongodb://carenest:CHANGE_ME_STRONG_PASSWORD@127.0.0.1:27017/carenest?authSource=carenest"'
assert_true "example USER:PASS@CLUSTER" is_placeholder_mongo_uri \
  "mongodb+srv://USER:PASS@CLUSTER/carenest?retryWrites=true&w=majority"
assert_true "0.0.0.0" is_placeholder_mongo_uri "mongodb://user:pass@0.0.0.0:27017/db"
assert_true "changeme marker" is_placeholder_mongo_uri "mongodb+srv://u:changeme@x.mongodb.net/db"

assert_false "real atlas srv" is_placeholder_mongo_uri \
  "mongodb+srv://carenest_app:Secr3tPass@cluster0.abc12.mongodb.net/carenest?retryWrites=true&w=majority"
assert_false "real remote mongodb://" is_placeholder_mongo_uri \
  "mongodb://carenest:Secr3tPass@db.example-prod.net:27017/carenest?authSource=admin"

echo "=== looks_like_real_mongo_uri ==="
assert_false "placeholder not real" looks_like_real_mongo_uri \
  "mongodb://carenest:CHANGE_ME_STRONG_PASSWORD@127.0.0.1:27017/carenest"
assert_true "atlas srv is real format" looks_like_real_mongo_uri \
  "mongodb+srv://carenest_app:Secr3tPass@cluster0.abc12.mongodb.net/carenest?retryWrites=true&w=majority"

echo "=== reject_placeholder_mongo_url ==="
assert_eq "reject clears placeholder" \
  "$(reject_placeholder_mongo_url 'mongodb://carenest:CHANGE_ME_STRONG_PASSWORD@127.0.0.1:27017/carenest')" \
  ""
assert_eq "reject keeps real" \
  "$(reject_placeholder_mongo_url 'mongodb+srv://u:p@cluster0.abc12.mongodb.net/carenest')" \
  "mongodb+srv://u:p@cluster0.abc12.mongodb.net/carenest"

echo "=== message ==="
assert_eq "required message" "$(atlas_mongo_uri_required_message)" "Atlas Mongo URI required."

echo
echo "PASS=${PASS} FAIL=${FAIL}"
[[ "${FAIL}" -eq 0 ]]
