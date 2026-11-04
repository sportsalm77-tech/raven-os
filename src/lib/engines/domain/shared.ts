/** Shared domain primitives for the first five Raven operational engines. */
export type RecordId = string;
export type SchoolScoped = Readonly<{ id: RecordId; schoolId: string; createdAt: string; createdBy: string; updatedAt: string; updatedBy: string; version: number }>;
export type SourceReference = Readonly<{ sourceType: "data_center_file" | "canonical_record" | "approved_connector" | "manual_entry"; sourceId: string; sourceVersion?: number; locator?: string }>;
export type ReviewState = "draft" | "submitted" | "approved" | "rejected" | "archived";
export type DomainValidation = Readonly<{ valid: boolean; errors: readonly string[] }>;

export function validateRequired(value: unknown, field: string, errors: string[]): void {
  if (typeof value !== "string" || !value.trim()) errors.push(`${field} is required`);
}
export function validateIsoDate(value: string, field: string, errors: string[]): void {
  if (!Number.isFinite(Date.parse(value))) errors.push(`${field} must be a valid date`);
}
export function result(errors: string[]): DomainValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]) });
}
export function assertSchoolScope(recordSchoolId: string, actorSchoolId: string | null): void {
  if (!actorSchoolId || recordSchoolId !== actorSchoolId) throw new Error("RAVEN_TENANT_SCOPE_DENIED");
}
export function assertTransition<T extends string>(current: T, next: T, allowed: Readonly<Record<T, readonly T[]>>): void {
  if (!allowed[current]?.includes(next)) throw new Error(`RAVEN_INVALID_TRANSITION:${current}->${next}`);
}
