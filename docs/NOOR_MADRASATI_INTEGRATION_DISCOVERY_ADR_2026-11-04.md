# ADR — Noor and Madrasati Integration Discovery
Date: 2026-11-04
Status: Approved direction for discovery; connector implementation is blocked pending evidence and authorization.
Branch: `rescue/unified-arena-integration-2026-11-03`

## Context
The Unified School Data Center is the canonical school-data source. The owner has specified Noor and Madrasati as intended external sources from which a principal may retrieve permitted student and teacher data. The current rescue repository is a scaffold and contains no verified Noor/Madrasati connector, provider credentials, or documented integration mechanism.

## Decision
Treat Noor and Madrasati as target integration sources, not as currently connected services. Do not select an undocumented API, third-party intermediary, browser automation, or credential flow by assumption.

## Discovery required for each source
1. Identify the official system owner and current integration documentation.
2. Verify whether an official API, approved export/import, or other formally authorized mechanism is available to this school and user role.
3. Confirm authentication, authorization, consent/approval, tenant/school scoping, and permitted fields.
4. Establish student and teacher field dictionaries, stable external identifiers, and source update semantics.
5. Confirm rate limits, pagination, incremental/full sync options, failure behavior, and support contacts.
6. Review terms, privacy, data minimization, retention, and security obligations.
7. Define field-level source precedence and conflict resolution with canonical Raven records.
8. Document a synthetic-data proof of connectivity and tenant-isolation tests before any real school data is processed.

## Prohibited until separately approved
- Scraping authenticated web pages or reverse-engineering private endpoints.
- Asking principals to paste passwords, MFA codes, cookies, or session tokens into Raven or chat.
- Bypassing MFA, anti-bot protections, rate limits, or platform controls.
- Storing secrets in source code, client bundles, repository files, logs, or user-visible configuration.
- Automatically overwriting Raven canonical values or merging student/staff identities without review.
- Claiming that a connector is available, connected, synchronized, or production-ready without verified evidence.

## Required connector behavior after approval
- Server-side secret storage and server-resolved actor/school scope.
- Least-privilege read-only access initially, unless separately approved.
- Explicit field allowlist and provenance for every imported value.
- Preview, validation, duplicate/conflict review, authorized approval, idempotent commit, and audit trail.
- Sync ledger with run ID, source version/time, counts derived from real results, errors, retry state, and last successful sync.
- Tenant isolation and role/resource authorization tests using synthetic fixtures.
- No provider-specific implementation until the discovery gate is signed off.

## Consequences
The UI may show Noor and Madrasati as “Not connected” and explain the intended scope. No connect/sync action is enabled. File intake and principal-managed records continue through their separately gated workflows. Raven Library remains responsible for document generation.
