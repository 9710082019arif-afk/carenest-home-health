#!/usr/bin/env bash
# Cloudflare DNS A @ + www → EC2_EIP + purge cache (API).
# Requires: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ZONE_ID, EC2_EIP
# Usage:
#   sudo bash deploy/scripts/cutover_dns_cloudflare.sh apply
#   sudo bash deploy/scripts/cutover_dns_cloudflare.sh rollback
set -euo pipefail

CMD="${1:-apply}"
DOMAIN="${CARENEST_DOMAIN:-carenesthomehealth.in}"
STATE_DIR="/var/lib/carenest/cutover"
# shellcheck disable=SC1091
[[ -f /etc/carenest/cutover.env ]] && source /etc/carenest/cutover.env || true
# shellcheck disable=SC1091
[[ -f "${STATE_DIR}/eip.env" ]] && source "${STATE_DIR}/eip.env" || true

: "${CLOUDFLARE_API_TOKEN:?Set CLOUDFLARE_API_TOKEN}"
: "${CLOUDFLARE_ZONE_ID:?Set CLOUDFLARE_ZONE_ID}"

CF_API="https://api.cloudflare.com/client/v4"
AUTH=( -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" -H "Content-Type: application/json" )

_cf() {
  curl -sS "${AUTH[@]}" "$@"
}

_list_a() {
  local name="$1"
  _cf "${CF_API}/zones/${CLOUDFLARE_ZONE_ID}/dns_records?type=A&name=${name}"
}

_upsert_a() {
  local name="$1" ip="$2" proxied="${3:-true}"
  local json id
  json="$(_list_a "${name}")"
  id="$(python3 -c 'import json,sys; d=json.load(sys.stdin); r=d.get("result") or []; print(r[0]["id"] if r else "")' <<<"${json}")"
  local body
  body="$(python3 -c "import json; print(json.dumps({'type':'A','name':'${name}','content':'${ip}','ttl':1,'proxied':${proxied}}))")"
  if [[ -n "${id}" ]]; then
    _cf -X PUT "${CF_API}/zones/${CLOUDFLARE_ZONE_ID}/dns_records/${id}" --data "${body}" | python3 -c 'import json,sys; d=json.load(sys.stdin); assert d.get("success"), d; print("updated", d["result"]["name"], d["result"]["content"])'
  else
    _cf -X POST "${CF_API}/zones/${CLOUDFLARE_ZONE_ID}/dns_records" --data "${body}" | python3 -c 'import json,sys; d=json.load(sys.stdin); assert d.get("success"), d; print("created", d["result"]["name"], d["result"]["content"])'
  fi
}

_purge() {
  _cf -X POST "${CF_API}/zones/${CLOUDFLARE_ZONE_ID}/purge_cache" \
    --data '{"purge_everything":true}' \
    | python3 -c 'import json,sys; d=json.load(sys.stdin); assert d.get("success"), d; print("cache purged")'
}

_ssl_full_strict() {
  _cf -X PATCH "${CF_API}/zones/${CLOUDFLARE_ZONE_ID}/settings/ssl" \
    --data '{"value":"strict"}' \
    | python3 -c 'import json,sys; d=json.load(sys.stdin); assert d.get("success"), d; print("ssl mode", d["result"]["value"])' \
    || echo "WARN: could not set SSL strict (set Full (strict) in UI)"
}

case "${CMD}" in
  apply)
    : "${EC2_EIP:?Set EC2_EIP}"
    # Save current A contents for rollback
    mkdir -p "${STATE_DIR}"
    _list_a "${DOMAIN}" > "${STATE_DIR}/cf-a-apex-before.json"
    _list_a "www.${DOMAIN}" > "${STATE_DIR}/cf-a-www-before.json"
    _upsert_a "${DOMAIN}" "${EC2_EIP}" true
    _upsert_a "www.${DOMAIN}" "${EC2_EIP}" true
    _ssl_full_strict
    _purge
    echo "DNS apply done → ${EC2_EIP}"
    ;;
  rollback)
    ROLLBACK_IP="${ROLLBACK_IP:-}"
    if [[ -z "${ROLLBACK_IP}" && -f "${STATE_DIR}/cf-a-apex-before.json" ]]; then
      ROLLBACK_IP="$(python3 -c 'import json,sys; d=json.load(open(sys.argv[1])); r=d.get("result") or []; print(r[0]["content"] if r else "")' "${STATE_DIR}/cf-a-apex-before.json")"
    fi
    : "${ROLLBACK_IP:?Set ROLLBACK_IP or have cf-a-apex-before.json}"
    _upsert_a "${DOMAIN}" "${ROLLBACK_IP}" true
    _upsert_a "www.${DOMAIN}" "${ROLLBACK_IP}" true
    _purge
    echo "DNS rollback done → ${ROLLBACK_IP}"
    ;;
  *)
    echo "Usage: $0 apply|rollback" >&2
    exit 1
    ;;
esac
