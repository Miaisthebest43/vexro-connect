# VEXRO Connect - Threat Model (Sprint 1)

## Assets
- User credentials, session tokens, device public keys
- Message content (future), community metadata (future)

## Threats & Mitigations

| Threat | Mitigation | Status |
|---|---|---|
| Credential stuffing | Rate limit + strong password rules | Sprint 1 |
| XSS | Helmet CSP + input validation | Sprint 1 |
| Clickjacking | frame-ancestors none | Sprint 1 |
| CSRF | @fastify/csrf-protection | Sprint 1 |
| Brute force login | Per-IP + per-account limits | Sprint 2 |
| Session hijack | HttpOnly + SameSite cookies | Sprint 2 |
| SIM swap | Prefer Passkeys, warn users | Sprint 2 |
| Message tampering | E2EE (MLS) | Sprint 7+ |
| Metadata leakage | Sealed sender, minimal logs | Sprint 7+ |

## Out of Scope (Sprint 1)
E2EE, voice/video, federation, mobile push.