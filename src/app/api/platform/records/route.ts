import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { lookupIdentity } from "@/lib/security/identity-lookup";
import { canEnterPortal } from "@/lib/security/portal-authorization";

export const dynamic = "force-dynamic";
const tables = {
 memberships: { table:"raven_school_memberships", fields:["user_id","school_id","role","status"], required:["user_id","school_id","role"], select:"id,user_id,school_id,role,status,created_at" },
 schools: { table:"raven_schools", fields:["name","status"], required:["name"], select:"id,name,status,created_at" },
 plans: { table:"raven_platform_plans", fields:["code","name","price_sar","duration_days","active"], required:["code","name","duration_days"], select:"id,code,name,price_sar,duration_days,active,created_at" },
 subscriptions: { table:"raven_school_subscriptions", fields:["school_id","plan_id","starts_at","ends_at","status"], required:["school_id","plan_id","starts_at","ends_at"], select:"id,school_id,plan_id,starts_at,ends_at,status,created_at" },
 notices: { table:"raven_platform_notices", fields:["title","body","school_id"], required:["title","body"], select:"id,title,body,school_id,author_id,created_at" },
 tickets: { table:"raven_support_tickets", fields:["school_id","subject","body","status"], required:["school_id","subject","body"], select:"id,school_id,created_by,subject,body,status,created_at,updated_at" },
 replies: { table:"raven_support_replies", fields:["ticket_id","body"], required:["ticket_id","body"], select:"id,ticket_id,author_id,body,created_at" },
 settings: { table:"raven_platform_settings", fields:["key","value"], required:["key","value"], select:"key,value,updated_by,updated_at" },
 audit: { table:"raven_audit_events", fields:[], required:[], select:"id,actor_id,school_id,event_type,outcome,correlation_id,occurred_at" },
} as const;
type Module = keyof typeof tables;
const validModule = (v:string|null):v is Module => !!v && Object.prototype.hasOwnProperty.call(tables,v);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const response=(data:unknown,status=200)=>NextResponse.json(data,{status,headers:{"Cache-Control":"private, no-store","Vary":"Cookie"}});
async function context() {
 const token=(await cookies()).get("raven_session")?.value;
 if(!token)return null;
 const identity=await lookupIdentity(`Bearer ${token}`);
 if(!canEnterPortal(identity,"platform"))return null;
 const url=process.env.RAVEN_SUPABASE_URL,key=process.env.RAVEN_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)return null;
 return {token,key,url,user:identity.user.id};
}
async function proxy(c:NonNullable<Awaited<ReturnType<typeof context>>>,sectionKey:Module,method:"GET"|"POST"|"PATCH",body?:Record<string,unknown>,id?:string) {
 const config=tables[sectionKey];
 const url=new URL(`/rest/v1/${config.table}`,c.url);
 url.searchParams.set("select",config.select);
 if(id)url.searchParams.set(sectionKey==="settings"?"key":"id",`eq.${id}`);
 if(method==="GET"){url.searchParams.set("order",sectionKey==="settings"?"key.asc":sectionKey==="audit"?"occurred_at.desc":"created_at.desc");url.searchParams.set("limit","100");}
 const result=await fetch(url,{method,headers:{"apikey":c.key,"Authorization":`Bearer ${c.token}`,"Accept":"application/json",...(method==="GET"?{}:{"Content-Type":"application/json","Prefer":"return=representation"})},body:body?JSON.stringify(body):undefined,cache:"no-store",signal:AbortSignal.timeout(8000)});
 if(!result.ok)return response({error:"database_operation_failed"},result.status===401?401:result.status===403?403:result.status===409?409:503);
 const records=await result.json() as unknown;
 return response({records},method==="POST"?201:200);
}
export async function GET(req:NextRequest) {
 const sectionKey=req.nextUrl.searchParams.get("module");
 if(!validModule(sectionKey))return response({error:"unknown_module"},400);
 try {const c=await context();if(!c)return response({error:"unauthorized"},401);return await proxy(c,sectionKey,"GET");}
 catch{return response({error:"service_unavailable"},503);}
}
async function write(req:NextRequest,method:"POST"|"PATCH") {
 const origin=req.headers.get("origin");
 if(!origin||origin!==req.nextUrl.origin)return response({error:"forbidden_origin"},403);
 const sectionKey=req.nextUrl.searchParams.get("module");
 if(!validModule(sectionKey)||sectionKey==="audit")return response({error:"unknown_or_read_only_module"},400);
 if(!/^application\/json(?:;|$)/i.test(req.headers.get("content-type")||""))return response({error:"json_required"},415);
 if(Number(req.headers.get("content-length")||"0")>16384)return response({error:"payload_too_large"},413);
 try {
  const c=await context();if(!c)return response({error:"unauthorized"},401);
  const raw:unknown=await req.json();
  if(JSON.stringify(raw).length>16384)return response({error:"payload_too_large"},413);
  if(!raw||typeof raw!=="object"||Array.isArray(raw))return response({error:"invalid_payload"},400);
  const input=raw as Record<string,unknown>;
  const config=tables[sectionKey];
  const fields=config.fields as readonly string[];
  const required=config.required as readonly string[];
  const id=method==="PATCH"?req.nextUrl.searchParams.get("id"):null;
  if(method==="PATCH"&&(!id||(sectionKey!=="settings"&&!uuid.test(id))||(sectionKey==="settings"&&(!/^[a-z][a-z0-9_.-]{1,99}$/.test(id)))))return response({error:"invalid_id"},400);
  if(!Object.keys(input).length||Object.keys(input).some(k=>!fields.includes(k))||method==="POST"&&required.some(k=>input[k]===undefined))return response({error:"invalid_fields"},400);
  for(const [key,value] of Object.entries(input)) {
   if(typeof value==="string"&&(value.length>10000||!value.trim()))return response({error:"invalid_field_value",field:key},400);
   if((key.endsWith("_id")||key==="ticket_id")&&value!==null&&(typeof value!=="string"||!uuid.test(value)))return response({error:"invalid_uuid",field:key},400);
  }
  if(sectionKey==="memberships"&&input.role!==undefined&&!["school_admin","principal","vice_principal","teacher","family_guardian"].includes(String(input.role)))return response({error:"invalid_role"},400);
  if(sectionKey==="memberships"&&input.status!==undefined&&!["invited","active","suspended","revoked"].includes(String(input.status)))return response({error:"invalid_membership_status"},400);
  if(sectionKey==="schools"&&input.status!==undefined&&!["active","pending","suspended"].includes(String(input.status)))return response({error:"invalid_status"},400);
  if(sectionKey==="subscriptions"&&input.status!==undefined&&!["active","paused","cancelled"].includes(String(input.status)))return response({error:"invalid_status"},400);
  if(sectionKey==="tickets"&&input.status!==undefined&&!["open","in_progress","resolved","closed"].includes(String(input.status)))return response({error:"invalid_status"},400);
  if(sectionKey==="plans"&&((input.duration_days!==undefined&&(!Number.isInteger(input.duration_days)||Number(input.duration_days)<1||Number(input.duration_days)>3650))||(input.price_sar!==undefined&&(typeof input.price_sar!=="number"||input.price_sar<0))))return response({error:"invalid_plan"},400);
  if(sectionKey==="settings"&&(typeof input.key!=="string"&&method==="POST"||input.value===undefined&&method==="POST"))return response({error:"invalid_setting"},400);
  if(sectionKey==="settings"&&method==="PATCH"&&input.key!==undefined)return response({error:"immutable_setting_key"},400);
  if(sectionKey==="subscriptions"&&input.starts_at&&input.ends_at&&Date.parse(String(input.starts_at))>=Date.parse(String(input.ends_at)))return response({error:"invalid_subscription_dates"},400);
  const payload:Record<string,unknown>={...input};
  if(method==="POST"&&(sectionKey==="notices"||sectionKey==="tickets"||sectionKey==="replies"))payload[sectionKey==="notices"?"author_id":"created_by"]=c.user;
  if(method==="POST"&&sectionKey==="replies"){delete payload.created_by;payload.author_id=c.user;}
  if(sectionKey==="settings"){payload.updated_by=c.user;payload.updated_at=new Date().toISOString();}
  if(sectionKey==="tickets"&&method==="PATCH")payload.updated_at=new Date().toISOString();
  if(method==="POST"&&sectionKey==="schools"&&!payload.status)payload.status="active";
  if(method==="POST"&&sectionKey==="memberships"&&!payload.status)payload.status="invited";
  if(method==="PATCH"&&sectionKey==="memberships"&&(payload.user_id!==undefined||payload.school_id!==undefined))return response({error:"immutable_membership_identity"},400);
  return await proxy(c,sectionKey,method,payload,id||undefined);
 }catch{return response({error:"invalid_request_or_service_unavailable"},503);}
}
export async function POST(req:NextRequest){return write(req,"POST");}
export async function PATCH(req:NextRequest){return write(req,"PATCH");}
