# Patches to leave Emergent — APPLIED IN TREE

As of the one-command deploy PR, these changes live in `backend/` directly:

- `backend/aws_integrations.py` — Anthropic streaming + SES SMTP  
- `backend/server.py` — wired to AWS integrations (no `emergentintegrations`)  
- `backend/requirements.txt` — `anthropic` + `aiosmtplib` (Emergent package removed)

**You do not need to copy patch files manually.**  
`sudo bash deploy/install.sh` deploys the AWS-native code as-is.

The files in this folder are retained only as historical reference.
