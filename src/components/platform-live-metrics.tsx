"use client";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
type Metrics={schools:number;activeSchools:number;schoolMemberships:number;platformMemberships:null;plans:number;tickets:number;users:null;classes:null;students:null};
export function PlatformLiveMetrics(){
 const {isAr}=useLang();
 const [metrics,setMetrics]=useState<Metrics|null>(null);
 const [state,setState]=useState<"loading"|"connected"|"unavailable">("loading");
 useEffect(()=>{
  const controller=new AbortController();
  fetch("/api/platform/overview",{cache:"no-store",credentials:"same-origin",signal:controller.signal})
   .then(async r=>{if(!r.ok)throw Error("unavailable");return r.json()})
   .then(data=>{if(!controller.signal.aborted){setMetrics(data.metrics);setState("connected")}})
   .catch(()=>{if(!controller.signal.aborted)setState("unavailable")});
  return ()=>controller.abort();
 },[]);
 const t=(ar:string,en:string)=>isAr?ar:en;
 const items=[
  {ar:"المدارس المسجلة",en:"Registered schools",value:metrics?.schools},
  {ar:"المدارس النشطة",en:"Active schools",value:metrics?.activeSchools},
  {ar:"عضويات المدارس",en:"School memberships",value:metrics?.schoolMemberships},
  {ar:"مديرو المنصة",en:"Platform memberships",value:metrics?.platformMemberships},
  {ar:"الباقات",en:"Plans",value:metrics?.plans},
  {ar:"تذاكر الدعم",en:"Support tickets",value:metrics?.tickets},
  {ar:"المستخدمون الفريدون",en:"Unique users",value:metrics?.users},
  {ar:"الفصول",en:"Classes",value:metrics?.classes},
  {ar:"الطلاب",en:"Students",value:metrics?.students},
 ];
 return <section className="space-y-3" aria-label={t("المؤشرات المباشرة","Live metrics")}>
  <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-black text-[#111A18]">{t("المؤشرات التشغيلية من Supabase","Supabase operational metrics")}</h2><span role="status" className="text-xs text-[#53615b]">{state==="connected"?t("متصل ببيانات موثقة","Verified database connection"):state==="loading"?t("جارٍ الاتصال","Connecting"):t("الاتصال غير متاح؛ لا تُعرض أرقام غير موثقة","Unavailable; no unverified figures")}</span></div>
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{items.map(item=><div key={item.en} className="rf-card p-5"><p className="text-xs text-[#66736e]">{t(item.ar,item.en)}</p><strong className="mt-2 block text-2xl font-black tabular-nums text-[#08794F]">{state==="connected"&&typeof item.value==="number"?item.value.toLocaleString(isAr?"ar-SA":"en-US"):"—"}</strong>{state==="connected"&&item.value==null&&<p className="mt-1 text-xs text-[#66736e]">{t("مصدر البيانات غير متوفر بعد","Data source not available yet")}</p>}</div>)}</div>
 </section>;
}
