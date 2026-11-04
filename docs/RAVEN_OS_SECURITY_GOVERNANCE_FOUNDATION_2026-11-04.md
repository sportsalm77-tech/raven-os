# Raven OS — Security, Governance & Shared Service Foundation
**Baseline:** 1.0.0  
**Branch:** rescue/unified-arena-integration-2026-11-03  
**Status:** Foundation code and contracts only. No identity provider, database, audit persistence, or production security enforcement is connected.

## Deliverables
- `src/lib/security/access-control.ts`: fail-closed RBAC and school-tenant scope policy primitives.
- `src/lib/security/audit.ts`: typed audit envelope and mandatory durable-sink boundary.
- `src/lib/engines/contracts.ts`: versioned engine command/result contracts and input validation.
- `src/lib/engines/engine-service.ts`: registry/catalogue service and deny-by-default handler dispatch.
- `src/lib/raven-engines.ts`: canonical fifteen-engine registry.

## Security model
- Trusted identity must originate from a verified server-side session. Never accept `TrustedActor` from client JSON or UI state.
- Platform roles are global and carry no school ID. A platform role accessing school-scoped data must supply an explicit target school.
- School roles must carry a school ID. Any requested target school must match the actor's school ID.
- Authorization is evaluated server-side for every operation; hiding a navigation item is not authorization.
- Missing identity, malformed identity, missing school scope, and cross-school access fail closed.
- Role grants in this foundation are initial policy scaffolding, not an approved final permissions matrix. Principal/school-admin grants require owner review before production enforcement.

## Audit boundary
- Security-sensitive actions must create a typed event with actor, role, school scope, resource, correlation ID, timestamp, outcome, and reason.
- Secrets, passwords, session tokens, and unnecessary student personal data must never be placed in audit payloads.
- `writeAuditEvent` intentionally fails when no durable sink is configured. No in-memory or console-only audit is represented as compliance.

## Engine service boundary
- Catalogue metadata may be read from the canonical registry.
- Engine operations are unavailable unless a trusted server bootstrap explicitly registers a handler.
- Registration is not an endpoint and must not be exposed to client code.
- Each future handler must authorize actor, target school, permission, payload schema, idempotency, and audit before performing a write.
- No database mutations or external connections are implemented in this foundation.

## Engine command contract
Every command carries contract version, engine ID, operation, trusted request context, payload, and idempotency key. The request context must be assembled server-side after authentication; a client-provided context is untrusted and must be replaced.

## Non-goals / pending integration
- Authentication/session issuance and revocation.
- Database schema, row-level security, and persistent audit storage.
- File storage, encryption key management, secrets management, rate limiting, and security monitoring.
- Noor, Madrasati, Rafid, Raven tools, Rafeen Store, and training-platform connectors.
- Real engine handlers, imports, exports, notifications, or attendance writes.

## Acceptance checklist
- [ ] Connect a trusted identity provider and server-side session adapter.
- [ ] Approve role-to-permission matrix with platform owner.
- [ ] Implement database tenant isolation and negative cross-tenant tests.
- [ ] Configure durable append-only audit sink.
- [ ] Add payload schemas and idempotency persistence for each write operation.
- [ ] Add rate limits, CSRF/origin controls where applicable, secret storage, and monitoring.
- [ ] Run lint, TypeScript build, security tests, and route-level authorization tests.
- [ ] Verify that every protected route and server action calls the shared authorization layer.
