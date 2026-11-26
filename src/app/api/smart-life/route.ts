import { NextRequest, NextResponse } from "next/server";
import { lookupIdentity, IdentityLookupError } from "@/lib/security/identity-lookup";
import { canEnterPortal, activeSchoolIds, type RavenPortal } from "@/lib/security/portal-authorization";
import { DEMO_COOKIE, verifyDemoSession } from "@/lib/security/demo-preview";

export const dynamic = "force-dynamic";
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const day=/^\d{4}-\d{2}-\d{2}$/;
const hhmm=/^([01]\d|2[0-3]):[0-5]\d$/;
type Role=RavenPortal;
type Identity=Awaited<ReturnType<typeof lookupIdentity>>;
type Context={demo:false;role:Role;userId:string;schoolId:string|null;token:string;identity:Identity}|{demo:true;role:Role;userId:null;schoolId:null};
type Input=Record<string,unknown>;
const response=(data:unknown,status=200)=>NextResponse.json(data,{status,headers:{"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff","Vary":"Cookie"}});
const string=(v:unknown)=>typeof v==="string"?v.trim():"";
const validDate=(s:string)=>day.test(s)&&!Number.isNaN(Date.parse(s+"T12:00:00Z"))&&new Date(s+"T12:00:00Z").toISOString().slice(0,10)===s;
const minute=(s:string)=>Number(s.slice(0,2))*60+Number(s.slice(3,5));
function span(b:Input){
 const date=string(b.on_date),weekday=b.weekday===null||b.weekday===undefined?null:Number(b.weekday);
 const start=string(b.starts_at),end=string(b.ends_at);
 if((date===""&&weekday===null)||(date!==""&&weekday!==null)|| (date&&!validDate(date))||
    (weekday!==null&&(!Number.isInteger(weekday)||weekday<0||weekday>6))||
    !hhmm.test(start)||!hhmm.test(end)||minute(end)<=minute(start))return null;
 return {on_date:date||null,weekday,starts_at:start,ends_at:end};
}
function meeting(mode:string,provider:string,raw:string){
 if(mode==="in_person")return provider==="none"&&!raw?null:false;
 if(mode!=="remote"||!["teams","meet"].includes(provider))return false;
 try{
  const u=new URL(raw);
  if(u.protocol!=="https:"||u.username||u.password||u.port)return false;
  const allowed=provider==="meet"?u.hostname==="meet.google.com":["teams.microsoft.com","teams.live.com"].includes(u.hostname);
  return allowed?u.href:false;
 }catch{return false;}
}
async function resolve(request:NextRequest):Promise<Context|NextResponse>{
 const role=request.nextUrl.searchParams.get("portal")??"teacher";
 if(!["platform","principal","teacher","family"].includes(role))return response({error:"invalid_portal"},400);
 const selected=role as Role;
 if(verifyDemoSession(request.cookies.get(DEMO_COOKIE)?.value,selected))
  return {demo:true,role:selected,userId:null,schoolId:null};
 if(process.env.RAVEN_AUTH_ENABLED!=="true")return response({error:"identity_service_disabled"},503);
 const token=request.cookies.get("raven_session")?.value;
 if(!token)return response({error:"unauthorized"},401);
 try{
  const identity=await lookupIdentity("Bearer "+token);
  if(selected==="platform"){
    if(!canEnterPortal(identity,"platform"))return response({error:"forbidden"},403);
    return {demo:false,role:selected,schoolId:null,userId:identity.user.id,identity,token};
  }
  const schools=activeSchoolIds(identity,selected);
  const requested=request.nextUrl.searchParams.get("school_id");
  const schoolId=requested??schools[0]??null;
  if(!schoolId||!uuid.test(schoolId)||!canEnterPortal(identity,selected,schoolId))return response({error:"school_forbidden"},403);
  return {demo:false,role:selected,schoolId,userId:identity.user.id,identity,token};
 }catch(error){
  if(error instanceof IdentityLookupError)return response({error:error.statusCode===401?"unauthorized":"identity_unavailable"},error.statusCode);
  return response({error:"identity_unavailable"},503);
 }
}
async function rest(ctx:Extract<Context,{demo:false}>,table:string,method:"GET"|"POST"|"PATCH",filters:Record<string,string>={},body?:Input){
 const base=process.env.RAVEN_SUPABASE_URL;
 const key=process.env.RAVEN_SUPABASE_PUBLISHABLE_KEY;
 if(!base||!key)throw Error("service_unavailable");
 const url=new URL("/rest/v1/"+table,base);
 for(const [k,v] of Object.entries(filters))url.searchParams.set(k,v);
 const headers:Record<string,string>={apikey:key,Authorization:"Bearer "+ctx.token,Accept:"application/json"};
 if(method!=="GET"){headers["Content-Type"]="application/json";headers["Prefer"]=table==="raven_smart_life_standards"&&filters.on_conflict?"resolution=merge-duplicates,return=representation":"return=representation";}
 const r=await fetch(url,{method,headers,body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(8000),cache:"no-store"});
 if(!r.ok)throw Error(r.status===403?"forbidden":"data_unavailable");
 const result:unknown=await r.json();
 if(!Array.isArray(result))throw Error("invalid_data");
 return result as Input[];
}
const query=(filters:Record<string,string>)=>Object.assign({limit:"250"},filters);
async function initial(ctx:Extract<Context,{demo:false}>){
 const standards=await rest(ctx,"raven_smart_life_standards","GET",query({select:"code,name_ar,name_en,default_minutes,notify_before_minutes",order:"code.asc"}));
 if(ctx.role==="platform")return {role:ctx.role,standards};
 const schoolId=ctx.schoolId!;
 const sessions=await rest(ctx,"raven_smart_life_sessions","GET",query({
  select:"id,class_code,teacher_id,standard_code,title,details,kind,mode,provider,meeting_url,on_date,weekday,starts_at,ends_at,status,origin",
  school_id:"eq."+schoolId,order:"starts_at.asc",
 }));
 const tasks=ctx.role==="family"?[]:await rest(ctx,"raven_smart_life_tasks","GET",query({
  select:"id,teacher_id,title,due_on,completed_at,origin",school_id:"eq."+schoolId,order:"created_at.desc"
 }));
 const roster=ctx.role==="family"||ctx.role==="principal"?await rest(ctx,"raven_smart_life_class_roster","GET",query({
  select:"child_ref,class_code",school_id:"eq."+schoolId
 })): [];
 return {role:ctx.role,school_id:schoolId,standards,sessions:sessions.filter(s=>ctx.role!=="family"||(s.status==="published"&&s.kind!=="duty")),tasks,roster};
}
export async function GET(request:NextRequest){
 const ctx=await resolve(request);if(ctx instanceof NextResponse)return ctx;
 if(ctx.demo)return response({demo:true,role:ctx.role,standards:[],sessions:[],tasks:[],roster:[]});
 try{return response(await initial(ctx));}
 catch{return response({error:"smart_life_schema_unavailable"},503);}
}
export async function POST(request:NextRequest){
 const origin=request.headers.get("origin");
 if(origin!==request.nextUrl.origin)return response({error:"invalid_origin"},403);
 if(!request.headers.get("content-type")?.startsWith("application/json"))return response({error:"invalid_content_type"},415);
 const bodyText=await request.text();
 if(bodyText.length>12000)return response({error:"payload_too_large"},413);
 let body:Input;
 try{const x:unknown=JSON.parse(bodyText);if(!x||typeof x!=="object"||Array.isArray(x))throw Error();body=x as Input;}
 catch{return response({error:"invalid_request"},400);}
 const ctx=await resolve(request);if(ctx instanceof NextResponse)return ctx;
 if(ctx.demo)return response({error:"preview_is_read_only"},403);
 const action=string(body.action);
 if(ctx.role==="family")return response({error:"family_read_only"},403);
 try{
  if(action==="standard-save"){
   if(ctx.role!=="platform")return response({error:"platform_only"},403);
   const code=string(body.code),ar=string(body.name_ar),en=string(body.name_en);
   const dur=Number(body.default_minutes),notice=Number(body.notify_before_minutes);
   if(!/^[a-z][a-z0-9_-]{2,39}$/.test(code)||ar.length<3||ar.length>120||en.length<3||en.length>120||
      !Number.isInteger(dur)||dur<5||dur>240||!Number.isInteger(notice)||notice<0||notice>60)return response({error:"invalid_standard"},400);
   const records=await rest(ctx,"raven_smart_life_standards","POST",{on_conflict:"code"},{code,name_ar:ar,name_en:en,default_minutes:dur,notify_before_minutes:notice});
   return response({saved:records.length>0},201);
  }
  if(ctx.role==="platform")return response({error:"platform_does_not_operate_schools"},403);
  const school_id=ctx.schoolId!;
  if(action==="session-create"){
   if(!["principal","teacher"].includes(ctx.role))return response({error:"forbidden"},403);
   const time=span(body),title=string(body.title),class_code=string(body.class_code),details=string(body.details);
   const kind=string(body.kind)||"lesson",mode=string(body.mode)||"in_person",provider=string(body.provider)||"none";
   const url=meeting(mode,provider,string(body.meeting_url));
   if(!time||title.length<3||title.length>180||class_code.length<2||class_code.length>80||
      details.length>1400||!["lesson","activity","duty"].includes(kind)||url===false)return response({error:"invalid_session"},400);
   let teacher_id=ctx.role==="teacher"?ctx.userId:string(body.teacher_id)||null;
   if(teacher_id&&!uuid.test(teacher_id))return response({error:"invalid_teacher"},400);
   const standard=string(body.standard_code)||null;
   if(standard&&!/^[a-z][a-z0-9_-]{2,39}$/.test(standard))return response({error:"invalid_standard"},400);
   const payload={school_id,class_code,teacher_id,standard_code:standard,title,details,kind,mode,provider,meeting_url:url,
    ...time,origin:ctx.role==="teacher"?"teacher_extra":"principal",status:ctx.role==="teacher"?"pending":body.publish===true?"published":"draft",created_by:ctx.userId};
   const records=await rest(ctx,"raven_smart_life_sessions","POST",{},payload);
   return response({record:records[0]??null},201);
  }
  if(action==="session-review"){
   if(ctx.role!=="principal")return response({error:"principal_only"},403);
   const id=string(body.id),status=string(body.status);
   if(!uuid.test(id)||!["draft","published","cancelled"].includes(status))return response({error:"invalid_review"},400);
   const records=await rest(ctx,"raven_smart_life_sessions","PATCH",{id:"eq."+id,school_id:"eq."+school_id},{status});
   return response({record:records[0]??null});
  }
  if(action==="task-create"){
   const title=string(body.title),due_on=string(body.due_on)||null;
   const teacher_id=ctx.role==="teacher"?ctx.userId:string(body.teacher_id);
   if(title.length<3||title.length>180||!teacher_id||!uuid.test(teacher_id)||due_on&&!validDate(due_on))
    return response({error:"invalid_task"},400);
   const records=await rest(ctx,"raven_smart_life_tasks","POST",{},{
    school_id,teacher_id,title,due_on,origin:ctx.role==="teacher"?"personal":"assigned",created_by:ctx.userId,
   });
   return response({record:records[0]??null},201);
  }
  if(action==="task-complete"){
   const id=string(body.id);
   if(!uuid.test(id)||typeof body.completed!=="boolean")return response({error:"invalid_task"},400);
   const filters:Record<string,string>={id:"eq."+id,school_id:"eq."+school_id};
   if(ctx.role==="teacher")filters.teacher_id="eq."+ctx.userId;
   const records=await rest(ctx,"raven_smart_life_tasks","PATCH",filters,{completed_at:body.completed?new Date().toISOString():null});
   return response({record:records[0]??null});
  }
  if(action==="roster-link"){
   if(ctx.role!=="principal")return response({error:"principal_only"},403);
   const child_ref=string(body.child_ref),class_code=string(body.class_code);
   if(!uuid.test(child_ref)||class_code.length<2||class_code.length>80)return response({error:"invalid_roster"},400);
   const records=await rest(ctx,"raven_smart_life_class_roster","POST",{},{
    school_id,child_ref,class_code,updated_by:ctx.userId
   });
   return response({record:records[0]??null},201);
  }
  return response({error:"unknown_action"},400);
 }catch(error){
  return response({error:error instanceof Error&&error.message==="forbidden"?"forbidden":"smart_life_write_unavailable"},error instanceof Error&&error.message==="forbidden"?403:503);
 }
}
