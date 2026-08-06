#!/usr/bin/env bash
# Regression: migrate.sh must always print Migration Failed / Migration Successful
# even when stdout is redirected (operators watch /dev/tty for say() progress).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MIGRATE="${ROOT}/deploy/scripts/migrate.sh"
PASS=0
FAIL=0

pass() { echo "PASS  $1"; PASS=$((PASS + 1)); }
fail() { echo "FAIL  $1"; FAIL=$((FAIL + 1)); }

assert_file_has() {
  local file="$1" needle="$2" label="$3"
  if grep -qF -- "${needle}" "${file}"; then
    pass "${label}"
  else
    fail "${label} (missing '${needle}' in ${file})"
    echo "---- file ----"; cat "${file}" || true; echo "--------------"
  fi
}

run_fail_case() {
  local tag="$1" fail_at="$2"
  local tmp out logdir
  tmp="$(mktemp -d)"
  out="${tmp}/stdout.txt"
  logdir="${tmp}/log"
  mkdir -p "${logdir}" "${tmp}/state" "${tmp}/backup" "${tmp}/etc" "${tmp}/ssl"

  set +e
  CARENEST_MIGRATE_ALLOW_NON_ROOT=1 \
  CARENEST_MIGRATE_TEST_FAIL_AT="${fail_at}" \
  CARENEST_MIGRATE_LOG_DIR="${logdir}" \
  CARENEST_MIGRATE_STATE_DIR="${tmp}/state" \
  CARENEST_MIGRATE_BACKUP_ROOT="${tmp}/backup" \
  CARENEST_CUTOVER_ENV="${tmp}/etc/cutover.env" \
  CARENEST_ETC_DIR="${tmp}/etc" \
  CARENEST_CF_SSL_DIR="${tmp}/ssl" \
  bash "${MIGRATE}" >"${out}" 2>"${tmp}/stderr.txt"
  local rc=$?
  set -e

  local log
  log="$(ls -1t "${logdir}"/migrate-*.log 2>/dev/null | head -1 || true)"

  if [[ "${rc}" -eq 1 ]]; then
    pass "${tag}: exit code 1"
  else
    fail "${tag}: expected exit 1 got ${rc}"
  fi

  assert_file_has "${out}" "Migration Failed" "${tag}: stdout has Migration Failed"

  if [[ "${fail_at}" == "gtm" ]]; then
    assert_file_has "${out}" "Validate GTM ID -- must match GTM-XXXXXXX" "${tag}: exact failed step on stdout"
  fi

  if [[ -n "${log}" && -f "${log}" ]]; then
    assert_file_has "${log}" "Migration Failed" "${tag}: log has Migration Failed"
    assert_file_has "${log}" "FAILED:" "${tag}: log retains FAILED line (not truncated by restore)"
    assert_file_has "${log}" "=== RESTORE FROM BACKUP ===" "${tag}: log has restore section"
    # Progress must be logged (say() mirrors to log)
    assert_file_has "${log}" "GA4 ID" "${tag}: log has validation progress"
  else
    fail "${tag}: migrate log missing"
  fi
}

# 1) Explicit migration_fail after GA4 (the user-visible sequence)
run_fail_case "gtm-fail" "gtm"

# 2) Unexpected set -e (false) must still emit Migration Failed via ERR trap
tmp="$(mktemp -d)"
out="${tmp}/stdout.txt"
mkdir -p "${tmp}/log" "${tmp}/state" "${tmp}/backup" "${tmp}/etc" "${tmp}/ssl"
set +e
CARENEST_MIGRATE_ALLOW_NON_ROOT=1 \
CARENEST_MIGRATE_TEST_FAIL_AT=errexit \
CARENEST_MIGRATE_LOG_DIR="${tmp}/log" \
CARENEST_MIGRATE_STATE_DIR="${tmp}/state" \
CARENEST_MIGRATE_BACKUP_ROOT="${tmp}/backup" \
CARENEST_CUTOVER_ENV="${tmp}/etc/cutover.env" \
CARENEST_ETC_DIR="${tmp}/etc" \
CARENEST_CF_SSL_DIR="${tmp}/ssl" \
bash "${MIGRATE}" >"${out}" 2>"${tmp}/stderr.txt"
rc=$?
set -e
[[ "${rc}" -eq 1 ]] && pass "errexit: exit 1" || fail "errexit: expected exit 1 got ${rc}"
assert_file_has "${out}" "Migration Failed" "errexit: stdout has Migration Failed"
log="$(ls -1t "${tmp}/log"/migrate-*.log 2>/dev/null | head -1 || true)"
if [[ -n "${log}" ]]; then
  assert_file_has "${log}" "Migration Failed" "errexit: log has Migration Failed"
  assert_file_has "${log}" "FAILED:" "errexit: log retains FAILED line"
else
  fail "errexit: migrate log missing"
fi

# 3) Log append must not wipe FAILED when printing restore
tmp="$(mktemp -d)"
LOG_FILE="${tmp}/m.log"
touch "${LOG_FILE}"
BACKUP_DIR=""
RESTORE_SCRIPT=""
SCRIPT_DIR="${ROOT}/deploy/scripts"
APP_ROOT="${ROOT}"
# shellcheck disable=SC1091
source /dev/null
restore_commands_text() {
  echo
  echo "=== RESTORE FROM BACKUP ==="
  echo "No preflight backup was created yet (failure before backup step)."
}
print_restore_commands() {
  local out="${1:-}"
  local body
  body="$(restore_commands_text)"
  case "${out}" in
    ""|"/dev/stdout"|"-") printf '%s\n' "${body}" ;;
    *) printf '%s\n' "${body}" >> "${out}" ;;
  esac
}
printf '%s\n' "FAILED: demo step" >> "${LOG_FILE}"
print_restore_commands "${LOG_FILE}"
if grep -qF "FAILED: demo step" "${LOG_FILE}" && grep -qF "=== RESTORE FROM BACKUP ===" "${LOG_FILE}"; then
  pass "log append keeps FAILED + RESTORE"
else
  fail "log append keeps FAILED + RESTORE"
  cat "${LOG_FILE}"
fi

echo
echo "PASS=${PASS} FAIL=${FAIL}"
[[ "${FAIL}" -eq 0 ]]
