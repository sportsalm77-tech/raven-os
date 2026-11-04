# Raven OS — Shared Intelligent Engines Architecture
**Architecture baseline:** 1.0.0  
**Status:** Approved architectural direction; implementation and integrations remain pending verification.  
**Scope:** Shared services for the four Raven OS portals and approved Rafeen ecosystem connections.

## 1. Purpose
Build one coherent engine layer rather than fifteen duplicated mini-systems. Each engine has a bounded responsibility, explicit contracts, authorized data sources, consumers, outputs, approval policy, and activation gates.

## 2. Canonical engine catalogue
The source of truth for engine identifiers and metadata is `src/lib/raven-engines.ts`. It defines fifteen engines:

1. School Data Engine.
2. Decisions & Assignments Engine.
3. Workflow & Follow-up Engine.
4. Evidence, Documentation & Impact Engine.
5. Operational Plans Engine.
6. School Evaluation & Accreditation Engine.
7. NAFS & Measurement Engine.
8. Security & Protection Engine.
9. Smart Assistant Engine.
10. Governance & Permissions Engine.
11. Data Interoperability Engine.
12. Recommendations & Decision Support Engine.
13. Educational Platform Connectivity Engine (Noor, Madrasati, Rafid).
14. Raven External Tools Connectivity Engine (Tahdeeri, lesson preparation, absence export, evidence retrieval, import/export/reconciliation tools).
15. Rafeen Ecosystem Connectivity Engine (Raven OS, Rafeen Store, Rafeen Professional Training & Development).

## 3. Architectural boundaries
- The Unified School Data Center remains the sole canonical school-data intake and governance source. Engines consume governed records or submit validated commands; they must not create competing master records.
- Raven Library owns document generation and templates. Data Center file intake preserves source files and supports review/import; it is not a document-authoring engine.
- The Educational Platform Connectivity Engine owns authorized technical connectors. The Raven External Tools Engine owns user-facing operational tools built on those connectors. A connector being designed does not mean it is available or authorized.
- Rafeen ecosystem connectivity is separate from educational-system connectivity. Product identity, consent, API contracts, and ownership remain separate.
- The Operational Plans Engine owns plan records and versions. The Data Center provides intake for existing plan files. A re-upload creates a proposed version; it never silently overwrites an approved baseline.
- The Decisions & Assignments Engine owns administrative decision and assignment records. Plans may reference them; they do not duplicate them.
- Recommendations and the Smart Assistant may draft or advise, but cannot approve decisions, issue assignments, change approved plan baselines, or activate contingency plans without explicit authorized human action.

## 4. Shared engine contract
Every engine must declare:
- Stable identifier and versioned API contract.
- Purpose, capabilities, consumers, source allowlist, and output schemas.
- Tenant and role authorization requirements.
- Human approval policy for sensitive actions.
- Provenance, correlation/idempotency identifiers, and audit events.
- Error, retry, conflict, and rollback behavior.
- Operational health and observability requirements.
- Data retention, privacy, and security classification.

## 5. Cross-engine lifecycle
1. Request originates from an authorized portal section or user action.
2. Governance & Permissions validates identity, role, school scope, and action.
3. Security & Protection applies session, data, and risk controls.
4. The request is routed to the owning engine.
5. The engine reads only allowlisted canonical sources and validates its input contract.
6. The engine returns a draft, result, or proposed command with source provenance.
7. The owning section applies its own review and approval workflow.
8. Approved changes are committed through the canonical service and emitted as auditable events.
9. Consumers receive only the fields and events they are authorized to access.

## 6. External connectivity rules
- No scraping, credential collection, session impersonation, or control bypass.
- No external writes until the provider's official API or approved integration method, scopes, terms, and security requirements are confirmed.
- Imports are staged, previewed, validated, deduplicated, and reviewed before commit.
- Exports require a preview, explicit user confirmation, target-system validation, and an audit record.
- Conflicts never overwrite approved canonical data automatically.
- Every operation records source, target, actor, timestamp, payload fingerprint/reference, result, and error details without logging secrets or unnecessary personal data.

## 7. Status model
- `architecture`: catalogue and design only.
- `ui_scaffold`: visible interface scaffold, no live service.
- `backend_pending`: backend contract or implementation is incomplete.
- `connected`: connection established, not necessarily fully verified.
- `verified`: tested end-to-end with documented evidence and authorized scope.

All fifteen entries initially remain `architecture`. This is intentional and prevents the UI or documentation from claiming unavailable functionality.

## 8. Implementation sequence
**Foundation:** identity, tenant isolation, authorization, audit, engine registry, API/event contracts, observability.  
**Operational engines:** data, decisions/assignments, workflow, evidence/impact, operational plans.  
**Assessment engines:** school evaluation/accreditation and NAFS/measurement.  
**Intelligence:** assistant, recommendations, governance policy integration, security monitoring.  
**Connectivity:** Noor/Madrasati/Rafid connectors, Raven tools, then Rafeen ecosystem APIs after provider and ownership verification.

## 9. Non-goals of this foundation commit
This architecture registry does not connect databases, identity providers, Noor, Madrasati, Rafid, Rafeen Store, or training systems. It does not perform imports, exports, attendance writes, evidence retrieval, approvals, or AI generation. Those require separately implemented and tested services.

## 10. Acceptance criteria
- One registry contains exactly fifteen unique engine IDs and stable numbering.
- Engine names 12, 13, and 14 remain distinct: educational connectors; Raven operational tools; Rafeen product ecosystem.
- No engine duplicates canonical school records or bypasses approval policies.
- All engines expose status and activation gates.
- External integrations remain inactive until official mechanism and permissions are verified.
- Tests validate uniqueness, completeness, domain grouping, and key separation rules.
