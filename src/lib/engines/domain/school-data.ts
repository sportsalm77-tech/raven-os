/** Engine 1 — canonical school data and source-preserving import batches. */
import type { SchoolScoped, SourceReference, DomainValidation } from "./shared";
import { result, validateRequired, validateIsoDate, assertSchoolScope, assertTransition } from "./shared";

export type ImportBatchState = "received" | "parsed" | "validated" | "approved" | "rejected";
export type SchoolImportBatch = SchoolScoped & Readonly<{
  originalFileRef: string;
  fileName: string;
  mediaType: "application/pdf" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" | "application/vnd.openxmlformats-officedocument.presentationml.presentation";
  sha256: string;
  state: ImportBatchState;
  sourceReferences: readonly SourceReference[];
  parsedRecordCount: number;
  validationErrors: readonly string[];
  reviewedBy: string | null;
  reviewedAt: string | null;
  committedRecordIds: readonly string[];
}>;
const transitions: Readonly<Record<ImportBatchState, readonly ImportBatchState[]>> = {
  received: ["parsed", "rejected"], parsed: ["validated", "rejected"],
  validated: ["approved", "rejected"], approved: [], rejected: [],
};
export function validateImportBatch(batch: SchoolImportBatch): DomainValidation {
  const errors: string[] = [];
  validateRequired(batch.id, "id", errors); validateRequired(batch.schoolId, "schoolId", errors);
  validateRequired(batch.originalFileRef, "originalFileRef", errors); validateRequired(batch.fileName, "fileName", errors);
  if (!/^[a-f0-9]{64}$/i.test(batch.sha256)) errors.push("sha256 must be a 64-character hexadecimal digest");
  if (!Number.isInteger(batch.parsedRecordCount) || batch.parsedRecordCount < 0) errors.push("parsedRecordCount must be a non-negative integer");
  if (batch.state === "approved" && (!batch.reviewedBy || !batch.reviewedAt)) errors.push("approved imports require reviewer and review timestamp");
  if (batch.state === "approved" && batch.validationErrors.length) errors.push("imports with validation errors cannot be approved");
  return result(errors);
}
export function transitionImportBatch(batch: SchoolImportBatch, next: ImportBatchState, reviewerId?: string, at?: string): SchoolImportBatch {
  assertTransition(batch.state, next, transitions);
  if (next === "approved" && (!reviewerId || !at || batch.validationErrors.length)) throw new Error("RAVEN_IMPORT_REVIEW_REQUIRED");
  return Object.freeze({ ...batch, state: next, reviewedBy: next === "approved" ? reviewerId! : batch.reviewedBy, reviewedAt: next === "approved" ? at! : batch.reviewedAt, updatedBy: reviewerId ?? batch.updatedBy, updatedAt: at ?? batch.updatedAt, version: batch.version + 1 });
}
export function assertImportSchool(batch: SchoolImportBatch, actorSchoolId: string | null): void { assertSchoolScope(batch.schoolId, actorSchoolId); }
