# RAVEN OS — Database Foundation Delivery
Date: 2026-11-12
Supabase project: `imoquechayktepndfmlt` (dedicated RAVEN OS project)
Region: `ap-south-1`
Migration: `raven_foundation_20261112`

## Applied and verified
Six public tables: raven_schools, raven_profiles, raven_school_memberships,
raven_platform_memberships, raven_guardian_child_links, raven_audit_events.
All six have RLS enabled and zero rows at verification.
Authenticated self-read policies exist only for profiles and membership tables.
No client write grants were given; sensitive schools, guardian links and audit
tables have no client policies (deny by default).

Supabase security advisor returned three INFO notices for RLS-enabled tables
without policies (schools, guardian-child links, audit). This is intentional
while they remain inaccessible to client roles. Do not resolve by adding broad
policies. Review access requirements when secure server handlers are built.

## Outstanding acceptance
No user accounts, server-side verified sessions, admin provisioning,
tenant-scoped operational records, guardian relationship resolver or durable
audit writer have been connected. Do not enable live login or production use
until these are built and tested. No production deployment was performed.
