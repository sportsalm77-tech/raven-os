/** Engine 4 — evidence intake, review, provenance, and impact linkage. */
import type { SchoolScoped, SourceReference, DomainValidation } from "./shared";
import { result, validateRequired, assertSchoolScope, assertTransition } from "./shared";

export type EvidenceState = "submitted" | "under_review" | "accepted" | "rejected" | "archived";
export type EvidenceRecord = SchoolScoped & Readonly<{
  title: string;
  description: string;
  fileRef: string;
  mimeType: string;
  sha256: string;
  source: SourceReference;
  linkedRecordType: "operational_plan" | "administrative_action" | "workflow" | "evaluation_standard" | "nafs_measurement";
  linkedRecordId: string;
  state: EvidenceState;
  reviewedBy: string | null;
  reviewedAt: string | null;
  impactMeasureRefs: readonly string[];
}>;
const transitions:Readonly<Record<EvidenceState,readonly EvidenceState[]>>={
 submitted:["under_review","rejected"],under_review:["accepted","rejected"],accepted:["archived"],rejected:["submitted","archived"],archived:[]
};
export function validateEvidence(e:EvidenceRecord):DomainValidation{
 const errors:string[]=[];validateRequired(e.id,"id",errors);validateRequired(e.schoolId,"schoolId",errors);validateRequired(e.title,"title",errors);
 validateRequired(e.fileRef,"fileRef",errors);validateRequired(e.linkedRecordId,"linkedRecordId",errors);
 if(!/^[a-f0-9]{64}$/i.test(e.sha256))errors.push("sha256 must be a 64-character hexadecimal digest");
 if(e.state==="accepted"&&(!e.reviewedBy||!e.reviewedAt))errors.push("accepted evidence requires reviewer and timestamp");
 return result(errors);
}
export function transitionEvidence(e:EvidenceRecord,next:EvidenceState,reviewerId:string,at:string):EvidenceRecord{
 assertTransition(e.state,next,transitions);
 if((next==="accepted"||next==="rejected")&&(!reviewerId||!Number.isFinite(Date.parse(at))))throw new Error("RAVEN_EVIDENCE_REVIEW_REQUIRED");
 return Object.freeze({...e,state:next,reviewedBy:next==="accepted"||next==="rejected"?reviewerId:e.reviewedBy,reviewedAt:next==="accepted"||next==="rejected"?at:e.reviewedAt,updatedBy:reviewerId,updatedAt:at,version:e.version+1});
}
export function assertEvidenceSchool(e:EvidenceRecord,actorSchoolId:string|null):void{assertSchoolScope(e.schoolId,actorSchoolId);}
