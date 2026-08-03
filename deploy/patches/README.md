# Patches required to leave Emergent forever

CareNest currently depends on two Emergent-hosted services:

1. **Chat:** `emergentintegrations` + `EMERGENT_LLM_KEY`
2. **Email:** `POST https://integrations.emergentagent.com/api/v1/email/send` + `EMERGENT_EMAIL_KEY`

Before AWS cutover, replace them with Anthropic + AWS SES.

Apply the drop-in module [`aws_integrations.py`](./aws_integrations.py) and the edits in [`server_patch.md`](./server_patch.md).

## Install

```bash
cd /opt/carenest/app/backend
source .venv/bin/activate
pip install 'anthropic>=0.40.0'
# aiosmtplib for async SMTP to SES
pip install 'aiosmtplib>=3.0.0'
# Pin in requirements.txt as well
```

Add to `requirements.txt`:

```
anthropic>=0.40.0
aiosmtplib>=3.0.0
```

Remove production dependency on:

```
emergentintegrations==0.2.0
```

(only after chat patch is live).

## Verify

```bash
# Email
# Submit a lead on staging → inbox info@carenesthomehealth.in

# Chat
curl -N -X POST https://staging.carenesthomehealth.in/api/chat/stream \
  -H 'Content-Type: application/json' \
  -d '{"session_id":"t1","message":"Do you offer ICU at home?"}'
```

## SES setup commands

```bash
# AWS console: SES → Verified identities → create domain carenesthomehealth.in
# Add DKIM CNAMEs in DNS (alongside Titan SPF — use include:amazonses.com in SPF)
# Create SMTP credentials → paste into backend/.env

# SPF example (merge carefully with Titan):
# v=spf1 include:spf.titan.email include:amazonses.com ~all
```
