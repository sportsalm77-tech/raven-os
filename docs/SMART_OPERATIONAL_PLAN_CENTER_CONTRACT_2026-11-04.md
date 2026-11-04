# Smart Operational Plan Center — Structure & Data Hygiene Contract
Date: 2026-11-04
Status: Approved product structure; UI routing and descriptive workspaces updated in rescue branch. Backend remains unconnected.

## Ownership and navigation
The Smart Operational Plan Center is an independent center under School Leadership. It is not nested under the Administrative Decisions & Assignments Center.

Routes:
- /principal/operational-plan — center overview
- /principal/operational-plan/management — plan creation, intelligent generation proposal, review, versioning, approval, and updates
- /principal/operational-plan/follow-up — execution, progress, delay, owners, evidence, and reports
- /principal/operational-plan/development — development plan and improvement priorities
- /principal/operational-plan/alternatives — contingency plans linked to an original plan
- /principal/operational-plan/initiatives — initiatives linked to existing plan objectives and indicators
- /principal/operational-plan/programs — programs and activities linked to objectives or initiatives

## Data ownership and relationships
- Each operational plan has a stable identifier, school scope, period, version, approval state, owner, and audit history.
- Each development or contingency plan references its parent operational plan when applicable.
- A contingency plan must identify its original plan, activation trigger, activation authority, effective period, and return criteria.
- Initiatives and programs reference existing objectives/indicators; they must not create duplicate master objectives.
- Follow-up records reference plan items, responsible owners, due dates, status, validated evidence, and reporting periods.
- Decisions, circulars, letters, workshops, field visits, and administrative assignments remain owned by the Administrative Decisions & Assignments Center. The operational plan stores references to those records only; it must not copy their master data.
- The Unified School Data Center remains the canonical source for school, staff, student, class, and other approved master records. This center consumes references and does not create duplicate master records.

## Data hygiene / prohibited content
- Do not seed demo plans, objectives, initiatives, programs, owners, percentages, evidence, dates, or completion metrics.
- Do not carry forward obsolete wording that calls this a subsection of the decision center.
- Do not treat decorative UI states, local state, or a toast as persisted approval or execution.
- Do not enable create, update, approve, activate, or close operations until authenticated server-side authorization, school_id isolation, persistence, validation, and audit logging are implemented and tested.
- No live integration, migration, or deployment is included in this UI/navigation update.

## Workflow
Objective → plan → initiative/program → linked administrative action/assignment (reference only) → execution → validated evidence → follow-up → impact review.

## Current implementation boundary
The rescue branch now contains the center overview, six branch routes in principal navigation, bilingual route-specific workflow descriptions, and corrected administrative center labels. The branch pages are informational workspaces only until secure backend services are implemented.
