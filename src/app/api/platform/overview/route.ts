import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { lookupIdentity } from "@/lib/security/identity-lookup";
import { canEnterPortal } from "@/lib/security/portal-authorization";

export const dynamic = "force-dynamic";

export async function GET() {
 const headers={"Cache-Control":"private, no-store","Vary":"Cookie"};
 try {
  const token=(await cookies()).get("raven_session")?.value;
  if(!token)return NextResponse.json({error:"unauthorized"},{status:401,headers});
  const identity=await lookupIdentity(`Bearer ${token}`);
  if(!canEnterPortal(identity,"platform"))return NextResponse.json({error:"forbidden"},{status:403,headers});
  const base=process.env.RAVEN_SUPABASE_URL;
  const key=process.env.RAVEN_SUPABASE_PUBLISHABLE_KEY;
  if(!base||!key)return NextResponse.json({error:"not_configured"},{status:503,headers});
  const count=async(table:string,filter?:string)=>{
   const url=new URL(`/rest/v1/${table}`,base);
   url.searchParams.set("select","*");
   if(filter)url.searchParams.set("status",filter);
   const r=await fetch(url,{method:"HEAD",headers:{apikey:key,Authorization:`Bearer ${token}`,Prefer:"count=exact"},cache:"no-store",signal:AbortSignal.timeout(8000)});
   if(!r.ok)throw new Error("count_failed");
   const range=r.headers.get("content-range");
   const total=range?.split("/").at(-1);
   if(!total||total==="*"||!/^\d+$/.test(total))throw new Error("count_unavailable");
   return Number(total);
  };
  const [schools,activeSchools,schoolMemberships,plans,tickets]=await Promise.all([
   count("raven_schools"),count("raven_schools","eq.active"),
   count("raven_school_memberships"),
   count("raven_platform_plans"),count("raven_support_tickets"),
  ]);
  return NextResponse.json({source:"supabase",metrics:{
   schools,activeSchools,schoolMemberships,platformMemberships:null,plans,tickets,
   users:null,classes:null,students:null,
  },unavailable:["users","platformMemberships","classes","students"]},{headers});
 }catch{return NextResponse.json({error:"service_unavailable"},{status:503,headers});}
}
