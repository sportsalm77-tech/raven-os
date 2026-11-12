# RAVEN OS — Three major batches, then verified preview
Date: 2026-11-12

## Approved cadence
1. Complete three meaningful integrated development batches on the rescue branch.
2. Run build, lint, security tests, Playwright, tenant authorization tests and manual acceptance appropriate to the touched features.
3. Only if required gates pass, manually deploy a **preview** of the exact tested commit to the dedicated Vercel project; provide the working preview URL and a concise change log.
4. Review user feedback, then repeat. No production publish or main merge without explicit owner approval.

## Current batch checkpoint
- Batch 1: document API response sanitization and cross-school fail-closed handling (commit 4a2b0a3).
- Batch 2: password sign-in API, role-scoped destinations, logout and login UI; password UI is disabled unless NEXT_PUBLIC_RAVEN_AUTH_ENABLED=true; server endpoint is disabled unless RAVEN_AUTH_ENABLED=true. These switches MUST only be enabled after session and route authorization tests are complete.
- Batch 3: pending — full server-side portal guards, session lifecycle, authenticated cross-school tests and private document storage authorization.

## Current risk and blocking criteria
- Authentication UI and API foundations are NOT equivalent to production-ready auth.
- Protected portal pages currently need server-side enforcement; no live credentials or real school data may be exposed in preview.
- A test suite that fails or lacks two-school authenticated coverage cannot be described as fully accepted.
- Never use real student/school records for preview.
