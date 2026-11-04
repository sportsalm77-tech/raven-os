/** Engine 5 — operational plans, immutable approved versions, initiatives, and programs. */
import type { SchoolScoped, DomainValidation } from "./shared";
import { result, validateRequired, assertSchoolScope, assertTransition } from "./shared";

export type PlanState="draft"|"submitted"|"approved"|"active"|"closed"|"rejected";
export type OperationalPlanVersion=Readonly<{
 version:number; title:string; academicYear:string; objectives:readonly PlanObjective[];
 sourceImportBatchId:string|null; basedOnVersion:number|null; state:PlanState;
 createdAt:string; createdBy:string; approvedAt:string|null; approvedBy:string|null;
}>;
export type PlanObjective=Readonly<{id:string;title:string;indicatorIds:readonly string[];ownerStaffId:string|null;dueAt:string|null}>;
export type OperationalPlan=SchoolScoped&Readonly<{
 currentVersion:number; versions:readonly OperationalPlanVersion[];
 administrativeActionRefs:readonly string[]; evidenceRefs:readonly string[];
}>;
export type PlanChild=SchoolScoped&Readonly<{
 planId:string; planVersion:number; kind:"initiative"|"program"; title:string;
 objectiveId:string; ownerStaffId:string|null; dueAt:string|null;
 administrativeActionRef:string|null; evidenceRefs:readonly string[];
}>;
const transitions:Readonly<Record<PlanState,readonly PlanState[]>>={
 draft:["submitted"],submitted:["approved","rejected"],approved:["active"],active:["closed"],closed:[],rejected:["draft"]
};
export function validatePlan(p:OperationalPlan):DomainValidation{
 const errors:string[]=[];validateRequired(p.id,"id",errors);validateRequired(p.schoolId,"schoolId",errors);
 if(!p.versions.length)errors.push("plan must contain at least one version");
 const current=p.versions.find(v=>v.version===p.currentVersion);
 if(!current)errors.push("currentVersion must reference an existing version");
 if(current?.state==="approved"&&(!current.approvedBy||!current.approvedAt))errors.push("approved plan version requires approver and timestamp");
 const seen=new Set<number>();for(const v of p.versions){if(seen.has(v.version))errors.push("plan version numbers must be unique");seen.add(v.version);}
 return result(errors);
}
export function transitionPlanVersion(p:OperationalPlan,next:PlanState,actorId:string,at:string):OperationalPlan{
 const current=p.versions.find(v=>v.version===p.currentVersion);if(!current)throw new Error("RAVEN_PLAN_VERSION_NOT_FOUND");
 assertTransition(current.state,next,transitions);
 if(next==="approved"&&(!actorId||!Number.isFinite(Date.parse(at))))throw new Error("RAVEN_PLAN_APPROVAL_REQUIRED");
 const versions=p.versions.map(v=>v.version===current.version?Object.freeze({...v,state:next,approvedBy:next==="approved"?actorId:v.approvedBy,approvedAt:next==="approved"?at:v.approvedAt}):v);
 return Object.freeze({...p,versions:Object.freeze(versions),updatedBy:actorId,updatedAt:at,version:p.version+1});
}
/** Changes to an approved/active plan create a new draft version; approved baseline remains immutable. */
export function proposePlanRevision(p:OperationalPlan,actorId:string,at:string,changes:Partial<Pick<OperationalPlanVersion,"title"|"academicYear"|"objectives">>):OperationalPlan{
 const current=p.versions.find(v=>v.version===p.currentVersion);if(!current)throw new Error("RAVEN_PLAN_VERSION_NOT_FOUND");
 const nextVersion=Math.max(...p.versions.map(v=>v.version))+1;
 const draft:OperationalPlanVersion=Object.freeze({...current,...changes,version:nextVersion,basedOnVersion:current.version,state:"draft",createdAt:at,createdBy:actorId,approvedAt:null,approvedBy:null});
 return Object.freeze({...p,currentVersion:nextVersion,versions:Object.freeze([...p.versions,draft]),updatedBy:actorId,updatedAt:at,version:p.version+1});
}
export function validatePlanChild(child:PlanChild):DomainValidation{
 const errors:string[]=[];validateRequired(child.id,"id",errors);validateRequired(child.schoolId,"schoolId",errors);validateRequired(child.planId,"planId",errors);validateRequired(child.objectiveId,"objectiveId",errors);validateRequired(child.title,"title",errors);
 if(!Number.isInteger(child.planVersion)||child.planVersion<1)errors.push("planVersion must be a positive integer");
 return result(errors);
}
export function assertPlanSchool(p:OperationalPlan,actorSchoolId:string|null):void{assertSchoolScope(p.schoolId,actorSchoolId);}
