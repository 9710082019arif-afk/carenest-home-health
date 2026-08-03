# Day-of cutover checklist

Print this. Tick in order.

## Before flip (T-1)

- [ ] EC2 Elastic IP noted: `________________`
- [ ] `save_rollback_dns.sh` output saved
- [ ] Emergent custom-domain target saved for rollback
- [ ] Anthropic key set; SES domain verified; SMTP creds in `.env`
- [ ] Emergent-exit patch applied; chat + email tested on **staging**
- [ ] Mongo restored; collection counts match Emergent admin stats
- [ ] Frontend built with `REACT_APP_BACKEND_URL=https://carenesthomehealth.in`
- [ ] `carenest-api` healthy on localhost
- [ ] DNS TTL lowered to 300
- [ ] EC2 AMI snapshot taken
- [ ] Titan MX/SPF/DKIM untouched

## Flip (T-0)

- [ ] Final `mongodump` from Emergent → `mongorestore --drop` on AWS
- [ ] `systemctl restart carenest-api`
- [ ] Cloudflare A `@` + `www` → Elastic IP
- [ ] SSL mode Full (strict) or Certbot green
- [ ] Purge Cloudflare cache
- [ ] Run `cutover_verify.sh`
- [ ] Browser QA: home, book, lead email, chat, admin

## After (T+0…72h)

- [ ] Watch logs 2 hours
- [ ] Keep Emergent running
- [ ] At T+72h cancel Emergent if stable
- [ ] Raise DNS TTL
- [ ] Revoke Emergent API keys
