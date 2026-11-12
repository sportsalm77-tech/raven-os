/**
 * Cross-tenant integrity guard for school-scoped operations.
 * This function must be called after verifying a user's active membership.
 * It does not grant access or replace database RLS.
 */
export type SchoolScopedRecord = Readonly<{ school_id: string }>;

export class SchoolScopeViolation extends Error {
  constructor() {
    super("School scope mismatch");
    this.name = "SchoolScopeViolation";
  }
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function assertSchoolScope(schoolId: string, ...records: SchoolScopedRecord[]): void {
  if (!UUID_PATTERN.test(schoolId) || records.length === 0) {
    throw new SchoolScopeViolation();
  }
  for (const record of records) {
    if (!record || record.school_id !== schoolId) {
      throw new SchoolScopeViolation();
    }
  }
}

export function schoolScopedInsert<T extends Record<string, unknown>>(
  schoolId: string,
  input: T,
): T & { school_id: string } {
  if (!UUID_PATTERN.test(schoolId) || ("school_id" in input && input.school_id !== schoolId)) {
    throw new SchoolScopeViolation();
  }
  return { ...input, school_id: schoolId };
}
