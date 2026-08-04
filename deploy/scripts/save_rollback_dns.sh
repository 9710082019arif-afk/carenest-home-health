#!/usr/bin/env bash
# Record Emergent DNS targets BEFORE cutover for fast rollback.
# Usage: ./save_rollback_dns.sh > /var/backups/carenest/rollback-dns-$(date +%Y%m%d).txt
set -euo pipefail

echo "# CareNest DNS rollback snapshot — $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "# Restore these values in Cloudflare/Hostinger if AWS cutover fails."
echo
for host in carenesthomehealth.in www.carenesthomehealth.in elite-homecare-ui.emergent.host; do
  echo "## $host"
  echo "A:     $(dig +short A "$host" | tr '\n' ' ')"
  echo "AAAA:  $(dig +short AAAA "$host" | tr '\n' ' ')"
  echo "CNAME: $(dig +short CNAME "$host" | tr '\n' ' ')"
  echo "NS:    $(dig +short NS "$host" | tr '\n' ' ')"
  echo
done

echo "## MX / TXT (do not change during web cutover)"
echo "MX:  $(dig +short MX carenesthomehealth.in | tr '\n' ' ')"
echo "TXT: $(dig +short TXT carenesthomehealth.in | tr '\n' ' ')"
