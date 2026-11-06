# Raven OS — Engineering Decision Governance
**Document type:** Project governance rule
**Status:** Owner-aligned working rule
**Applies to:** All Raven OS engineering, architecture, security, data, integration, and delivery work
**Primary working branch:** `rescue/unified-arena-integration-2026-11-03`

## 1. Governing rule

**No material engineering decision is considered durably adopted until it is recorded in the Raven OS GitHub repository.**

A decision discussed or approved in a conversation must be converted into a version-controlled Markdown record on the active approved working branch. The record is the durable project reference across conversations, sessions, and contributors.

A conversational agreement remains useful context, but it is not a substitute for the repository record.

## 2. Decisions that must be recorded

Record decisions that materially affect any of the following:
- System architecture, boundaries, modules, portals, engines, or data flows.
- Identity, authentication, sessions, authorization, roles, and permissions.
- Data ownership, canonical sources, schemas, tenant isolation, and retention.
- Security, privacy, auditability, and threat controls.
- External integrations, APIs, imports, exports, and automation.
- User workflows, business rules, lifecycle states, and operational responsibilities.
- Technology choices, infrastructure, hosting, deployment, and environments.
- Scope, sequencing, acceptance criteria, release gates, and explicit exclusions.
- Any approved exception, reversal, replacement, or material correction to an earlier decision.

Minor implementation details that do not alter an approved boundary may be documented in code comments, tests, or implementation notes instead of a separate decision record.

## 3. Required decision-record contents

Each material decision record must include, as applicable:
1. Title and stable document path.
2. Decision date and status.
3. Decision owner / approval authority.
4. Context and problem being resolved.
5. The exact approved decision, stated unambiguously.
6. Scope and affected Raven OS components.
7. Consequences and implementation implications.
8. Constraints, dependencies, and prerequisites.
9. Explicit non-decisions: what this record does not authorize.
10. Acceptance criteria and verification evidence.
11. Related records and superseded decisions.
12. Commit SHA and branch reference in the handover/report that announces the record.

Never place passwords, tokens, API keys, private credentials, student personal data, or other secrets in decision records.

## 4. Approval and status discipline

Use clear status labels and never blur proposals with approvals:
- **Proposed:** under discussion; not approved for implementation.
- **Owner-approved:** explicitly approved by the project owner; implementation may still be gated.
- **Implemented — unverified:** code exists, but required verification is incomplete.
- **Verified:** specified checks passed and evidence is recorded.
- **Superseded:** replaced by a newer decision; retain the historical record and link the replacement.
- **Rejected / withdrawn:** not approved or no longer pursued; retain the reason where useful.

Only an explicit owner approval can turn a proposal into an owner-approved decision. Technical feasibility, a successful build, or an assistant recommendation does not itself constitute owner approval.

## 5. Repository and branch procedure

1. Confirm the repository, active approved branch, and current branch head before writing.
2. Preserve the approved working branch and existing project history.
3. Add or update the relevant Markdown record under `docs/` using a descriptive, stable filename.
4. Use a focused commit message, for example: `docs: record <decision subject>`.
5. Verify the resulting file on the target branch and capture its commit SHA and browser URL.
6. Report exactly what was recorded, where it was recorded, and what remains unverified.
7. Keep changes isolated to the approved branch. Do not modify `main`, merge, or deploy without explicit owner authorization.

If the branch head changes during the operation, re-check the latest head and reconcile before retrying. Never force-push or overwrite unrelated work to make a documentation change fit.

## 6. Updating or reversing a decision

Do not silently rewrite history or erase an approved decision.

When a decision changes:
- Create a new dated decision record or a clearly versioned replacement.
- State which earlier record is superseded.
- Explain why the change is necessary.
- Identify affected architecture, code, tests, data, and documents.
- Define migration or compatibility requirements where relevant.
- Preserve the earlier record as historical evidence.

A correction to a factual error may update an existing record, but the correction must be visible in the commit history and described in the handover.

## 7. Implementation and verification are separate

A recorded decision does not prove that the system implements it.

Every implementation report must distinguish:
- Decision recorded / owner-approved.
- Code changed.
- Automated checks run and their actual results.
- Manual or browser verification completed.
- Security, authorization, and tenant-isolation evidence.
- Remaining gaps, blocked work, and unverified claims.

Never describe a feature as connected, secure, persistent, production-ready, or complete based only on a UI state, mock response, successful commit, or passing build.

## 8. Conversation handover rule

At the end of a material work session, provide a concise repository handover containing:
- Active branch and verified HEAD commit.
- Decision documents added or updated, with paths and commit references.
- Implementation files changed.
- Checks performed and exact outcomes.
- Decisions still awaiting owner approval.
- Known limitations and the next safe step.

The next session must inspect the repository record and current branch state before continuing material work. Do not rely on conversational recollection when a repository source of truth exists.

## 9. Existing decision records

The following record is an example of this rule in practice and remains governed by its own scope:
- `docs/RAVEN_OS_IDENTITY_AND_DATA_SOURCE_OWNER_DECISION_2026-11-05.md`

This governance document does not itself select an identity provider, database, ORM, storage provider, external integration mechanism, or authorize production data operations.

---

**مؤسسة رافيين للخدمات التعليمية**  
**نحن نصنع الفرق**
