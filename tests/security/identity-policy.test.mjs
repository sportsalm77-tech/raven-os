import test from "node:test";
import assert from "node:assert/strict";
import {
  canUseQuickAccess,
  isAccountOperational,
  isRolePortalCompatible,
  matchesActiveSchoolScope,
  requiresStrongMfa,
} from "../../src/lib/security/identity-policy.ts";

test("only active accounts are operational", () => {
  assert.equal(isAccountOperational("active"), true);
  assert.equal(isAccountOperational("pending"), false);
  assert.equal(isAccountOperational("suspended"), false);
  assert.equal(isAccountOperational("disabled"), false);
});

test("platform roles require platform portal and no school tenant", () => {
  assert.equal(isRolePortalCompatible("platform_super_admin", "platform", null), true);
  assert.equal(isRolePortalCompatible("platform_system_admin", "platform", null), true);
  assert.equal(isRolePortalCompatible("platform_super_admin", "principal", "school-a"), false);
  assert.equal(isRolePortalCompatible("platform_system_admin", "platform", "school-a"), false);
});

test("school leaders, teachers, and guardians are bound to their portal and a school", () => {
  assert.equal(isRolePortalCompatible("principal", "principal", "school-a"), true);
  assert.equal(isRolePortalCompatible("school_admin", "principal", "school-a"), true);
  assert.equal(isRolePortalCompatible("vice_principal", "principal", "school-a"), true);
  assert.equal(isRolePortalCompatible("teacher", "teacher", "school-a"), true);
  assert.equal(isRolePortalCompatible("family_guardian", "family", "school-a"), true);
  assert.equal(isRolePortalCompatible("teacher", "principal", "school-a"), false);
  assert.equal(isRolePortalCompatible("family_guardian", "family", null), false);
});

test("student is an identity role without inventing a fifth portal", () => {
  assert.equal(isRolePortalCompatible("student", null, "school-a"), true);
  assert.equal(isRolePortalCompatible("student", "family", "school-a"), false);
  assert.equal(isRolePortalCompatible("student", "teacher", "school-a"), false);
});

test("strong MFA is required for platform and school administrative roles", () => {
  for (const role of ["platform_super_admin", "platform_system_admin", "school_admin", "principal", "vice_principal"]) {
    assert.equal(requiresStrongMfa(role), true);
  }
  assert.equal(requiresStrongMfa("teacher"), false);
  assert.equal(requiresStrongMfa("student"), false);
  assert.equal(requiresStrongMfa("family_guardian"), false);
});

test("Quick Access is allowed for teachers and students only by default", () => {
  assert.equal(canUseQuickAccess("teacher"), true);
  assert.equal(canUseQuickAccess("student"), true);
  assert.equal(canUseQuickAccess("platform_super_admin"), false);
  assert.equal(canUseQuickAccess("platform_system_admin"), false);
  assert.equal(canUseQuickAccess("school_admin"), false);
  assert.equal(canUseQuickAccess("principal"), false);
  assert.equal(canUseQuickAccess("vice_principal"), false);
  assert.equal(canUseQuickAccess("family_guardian"), false);
});

test("family Quick Access requires all four approval conditions", () => {
  const approved = {
    requestedByGuardian: true,
    identityVerified: true,
    schoolApproved: true,
    signedAcknowledgementRecorded: true,
  };
  assert.equal(canUseQuickAccess("family_guardian", approved), true);
  assert.equal(canUseQuickAccess("family_guardian", { ...approved, schoolApproved: false }), false);
  assert.equal(canUseQuickAccess("family_guardian", { ...approved, signedAcknowledgementRecorded: false }), false);
  assert.equal(canUseQuickAccess("family_guardian", { ...approved, identityVerified: false }), false);
  assert.equal(canUseQuickAccess("family_guardian", { ...approved, requestedByGuardian: false }), false);
});

test("school scope requires exact active tenant equality and never grants platform scope", () => {
  assert.equal(matchesActiveSchoolScope("teacher", "school-a", "school-a"), true);
  assert.equal(matchesActiveSchoolScope("family_guardian", "school-b", "school-b"), true);
  assert.equal(matchesActiveSchoolScope("principal", "school-a", "school-b"), false);
  assert.equal(matchesActiveSchoolScope("student", "school-a", null), false);
  assert.equal(matchesActiveSchoolScope("platform_super_admin", null, "school-a"), false);
});
