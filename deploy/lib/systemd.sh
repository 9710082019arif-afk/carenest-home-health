#!/usr/bin/env bash
# systemd unit for CareNest FastAPI

install_systemd_unit() {
  local unit_src="${DEPLOY_DIR}/systemd/carenest-api.service"
  local unit_dst="/etc/systemd/system/carenest-api.service"
  [[ -f "${unit_src}" ]] || fail "Missing ${unit_src}"

  # Rewrite paths if APP_ROOT is not /opt/carenest/app (should be, but be safe)
  sed \
    -e "s|/opt/carenest/app|${APP_ROOT}|g" \
    -e "s|User=carenest|User=${CARENEST_USER}|g" \
    -e "s|Group=carenest|Group=${CARENEST_USER}|g" \
    "${unit_src}" > "${unit_dst}"

  systemctl daemon-reload
  systemctl enable carenest-api
  log "systemd unit installed: carenest-api.service"
}

start_and_restart_services() {
  log "Starting carenest-api and nginx"
  systemctl restart carenest-api
  systemctl restart nginx
  sleep 2
  systemctl is-active --quiet carenest-api || fail "carenest-api failed to start — see journalctl -u carenest-api"
  systemctl is-active --quiet nginx || fail "nginx failed to start"
}
