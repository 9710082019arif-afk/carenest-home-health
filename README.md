# CareNest Home Health

## New main website (Vercel) — in progress

The production-ready rebuild lives in **[`website/`](website/)**.

- Branch workflow: feature branches → PR → temporary Vercel preview
- **Do not** cut over `carenesthomehealth.in` until explicit approval
- **Do not** modify `care.carenesthomehealth.in` / `landing-page` deployment

See [`website/DELIVERY.md`](website/DELIVERY.md) and [`website/README.md`](website/README.md).

## Current live stack (unchanged)

`/frontend` + `/backend` remain the existing Emergent/AWS production codebase until cutover is approved.

AWS migration notes (legacy path): [`deploy/MIGRATION_AWS.md`](deploy/MIGRATION_AWS.md).
