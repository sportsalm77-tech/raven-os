"use client";
import { useCallback, useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";

type Field={key:string;ar:string;en:string;kind?:"select"|"number"|"date"|"textarea"|"checkbox"|"json";options?:string[]};
const modules={
 schools:{ar:"إدارة المدارس",en:"Schools",fields:[{key:"name",ar:"اسم المدرسة",en:"School name"},{key:"status",ar:"الحالة",en:"Status",kind:"select",options:["active","inactive","suspended"]}]},
 plans:{ar:"الباقات",en:"Plans",fields:[{key:"code",ar:"رمز الباقة",en:"Plan code"},{key:"name",ar:"اسم الباقة",en:"Plan name"},{key:"price_sar",ar:"السعر بالريال",en:"Price (SAR)",kind:"number"},{key:"duration_days",ar:"المدة بالأيام",en:"Duration (days)",kind:"number"},{key:"active",ar:"مفعلة",en:"Active",kind:"checkbox"}]},
 subscriptions:{ar:"اشتراكات المدارس",en:"School subscriptions",fields:[{key:"school_id",ar:"معرف المدرسة",en:"School ID"},{key:"plan_id",ar:"معرف الباقة",en:"Plan ID"},{key:"starts_at",ar:"تاريخ البدء",en:"Starts at",kind:"date"},{key:"ends_at",ar:"تاريخ الانتهاء",en:"Ends at",kind:"date"},{key:"status",ar:"الحالة",en:"Status",kind:"select",options:["active","paused","cancelled"]}]},
 notices:{ar:"التعاميم والإشعارات",en:"Notices",fields:[{key:"title",ar:"العنوان",en:"Title"},{key:"body",ar:"نص التعميم",en:"Message",kind:"textarea"},{key:"school_id",ar:"معرف المدرسة (اختياري)",en:"School ID (optional)"}]},
 tickets:{ar:"تذاكر الدعم",en:"Support tickets",fields:[{key:"school_id",ar:"معرف المدرسة",en:"School ID"},{key:"subject",ar:"الموضوع",en:"Subject"},{key:"body",ar:"تفاصيل الطلب",en:"Description",kind:"textarea"},{key:"status",ar:"الحالة",en:"Status",kind:"select",options:["open","in_progress","resolved","closed"]}]},
 replies:{ar:"الردود على التذاكر",en:"Ticket replies",fields:[{key:"ticket_id",ar:"معرف التذكرة",en:"Ticket ID"},{key:"body",ar:"الرد",en:"Reply",kind:"textarea"}]},
 settings:{ar:"إعدادات المنصة",en:"Platform settings",fields:[{key:"key",ar:"مفتاح الإعداد",en:"Setting key"},{key:"value",ar:"القيمة JSON",en:"JSON value",kind:"json"}]},
 audit:{ar:"سجل التدقيق",en:"Audit log",fields:[]},
} satisfies Record<string,{ar:string;en:string;fields:Field[]}>;
type Module=keyof typeof modules;
const routes:Record<string,Module[]>={
 "/platform/schools":["schools"],"/platform/users":["schools"],
 "/platform/subscriptions":["plans","subscriptions"],"/platform/communications":["notices"],
 "/platform/support":["tickets","replies"],"/platform/settings":["settings"],
 "/platform/roles":["audit"],"/platform/security":["audit"],
};
export function PlatformAdminRecords({path}:{path:string}){
 const {isAr}=useLang();
 const [sectionKey,setModule]=useState<Module>((routes[path]||["schools"])[0]);
 const [records,setRecords]=useState<Record<string,unknown>[]>([]);
 const [form,setForm]=useState<Record<string,string|boolean>>({});
 const [editing,setEditing]=useState<string|null>(null);
 const [error,setError]=useState("");
 const [busy,setBusy]=useState(false);
 const [loaded,setLoaded]=useState(false);
 const t=(ar:string,en:string)=>isAr?ar:en;
 const load=useCallback(async()=>{
  setBusy(true);setError("");setLoaded(false);
  try{
   const r=await fetch(`/api/platform/records?sectionKey=${sectionKey}`,{credentials:"same-origin",cache:"no-store"});
   const j=await r.json();
   if(!r.ok||!Array.isArray(j.records))throw Error(r.status===401?t("يلزم تسجيل الدخول بحساب مدير منصة معتمد.","Sign in with an authorized platform admin account."):String(j.error||"Load failed"));
   setRecords(j.records);setLoaded(true);
  }catch(e){setError(e instanceof Error?e.message:String(e));setRecords([]);}
  finally{setBusy(false);}
 },[sectionKey,isAr]);
 useEffect(()=>{void load()},[load]);
 const config=modules[sectionKey];const fields=config.fields as Field[];
 function startEdit(item:Record<string,unknown>){
  setEditing(String(item[sectionKey==="settings"?"key":"id"]));
  const next:Record<string,string|boolean>={};
  for(const field of fields){if(field.key==="key"&&sectionKey==="settings")continue;const value=item[field.key];next[field.key]=field.kind==="json"?JSON.stringify(value):typeof value==="boolean"?value:String(value??"");}
  setForm(next);setError("");
 }
 async function save(e:React.FormEvent){e.preventDefault();setBusy(true);setError("");
  try{
   const payload:Record<string,unknown>={};
   for(const field of fields){if(editing&&sectionKey==="settings"&&field.key==="key")continue;const v=form[field.key];if(v===undefined||v===""&&field.key==="school_id"&&sectionKey==="notices")continue;if(v===undefined||v==="")continue;
    payload[field.key]=field.kind==="number"?Number(v):field.kind==="json"?JSON.parse(String(v)):field.kind==="date"?new Date(String(v)).toISOString():v;
   }
   const qs=new URLSearchParams({module:sectionKey});if(editing)qs.set("id",editing);
   const r=await fetch(`/api/platform/records?${qs}`,{method:editing?"PATCH":"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify(payload)});
   const j=await r.json();if(!r.ok)throw Error(String(j.error||"Save failed"));
   setForm({});setEditing(null);await load();
  }catch(e){setError(e instanceof Error?e.message:String(e));}finally{setBusy(false);}
 }
 const allowed=routes[path]||["schools"];
 return <section className="space-y-5 rounded-3xl border border-[#08794F]/15 bg-white p-5 md:p-7" aria-label={t("إدارة السجلات الفعلية","Live administration records")}>
  <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-black text-[#111A18]">{t("العمليات المتصلة بقاعدة البيانات","Database-backed operations")}</h2><p className="mt-1 text-xs text-[#66736e]">{t("البيانات الحقيقية فقط، وفق صلاحيات مدير المنصة.","Live records only, subject to platform administrator authorization.")}</p></div><button type="button" onClick={()=>void load()} disabled={busy} className="rounded-xl border border-[#08794F]/30 px-4 py-2 text-sm font-bold text-[#08794F]">{t("تحديث","Refresh")}</button></div>
  {allowed.length>1&&<div className="flex flex-wrap gap-2">{allowed.map(m=><button key={m} type="button" onClick={()=>{setModule(m);setForm({});setEditing(null)}} className={`rounded-xl px-4 py-2 text-sm font-bold ${m===sectionKey?"bg-[#08794F] text-white":"bg-[#F5F3EC] text-[#111A18]"}`}>{t(modules[m].ar,modules[m].en)}</button>)}</div>}
  {error&&<p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
  {loaded&&<div className="overflow-x-auto rounded-xl border border-[#08794F]/10"><table className="min-w-full text-start text-xs"><thead className="bg-[#F5F3EC]"><tr>{(fields.length?fields.slice(0,4):[{key:"event_type",ar:"الحدث",en:"Event"},{key:"occurred_at",ar:"الوقت",en:"Time"}]).map(f=><th key={f.key} className="p-3 text-start">{t(f.ar,f.en)}</th>)}<th className="p-3">{t("الإجراء","Action")}</th></tr></thead><tbody>{records.map((row,i)=><tr key={String(row.id||row.key||i)} className="border-t border-[#08794F]/10">{(fields.length?fields.slice(0,4):[{key:"event_type"},{key:"occurred_at"}]).map(f=><td key={f.key} className="max-w-52 truncate p-3" title={String(row[f.key]??"")}>{typeof row[f.key]==="object"?JSON.stringify(row[f.key]):String(row[f.key]??"—")}</td>)}<td className="p-3">{sectionKey!=="audit"&&sectionKey!=="replies"&&<button type="button" onClick={()=>startEdit(row)} className="font-bold text-[#08794F]">{t("تعديل","Edit")}</button>}</td></tr>)}</tbody></table>{!records.length&&<p className="p-5 text-sm text-[#66736e]">{t("لا توجد سجلات حتى الآن.","No records yet.")}</p>}</div>}
  {sectionKey!=="audit"&&sectionKey!=="replies"&&<form onSubmit={save} className="space-y-4 rounded-2xl bg-[#F5F3EC] p-4"><h3 className="font-black text-[#111A18]">{editing?t("تعديل السجل","Edit record"):t("إضافة سجل","Create record")}</h3><div className="grid gap-3 md:grid-cols-2">{fields.filter(f=>!(editing&&sectionKey==="settings"&&f.key==="key")).map(field=><label key={field.key} className="space-y-1 text-xs font-bold text-[#111A18]"><span>{t(field.ar,field.en)}</span>{field.kind==="select"?<select className="w-full rounded-lg border p-3" value={String(form[field.key]??"")} onChange={e=>setForm(v=>({...v,[field.key]:e.target.value}))}><option value="">{t("اختر","Choose")}</option>{field.options?.map(o=><option key={o}>{o}</option>)}</select>:field.kind==="checkbox"?<input type="checkbox" checked={Boolean(form[field.key])} onChange={e=>setForm(v=>({...v,[field.key]:e.target.checked}))}/>:field.kind==="textarea"||field.kind==="json"?<textarea rows={3} className="w-full rounded-lg border p-3" value={String(form[field.key]??"")} onChange={e=>setForm(v=>({...v,[field.key]:e.target.value}))}/>:<input type={field.kind==="number"?"number":field.kind==="date"?"datetime-local":"text"} step={field.kind==="number"?"any":undefined} className="w-full rounded-lg border p-3" value={String(form[field.key]??"")} onChange={e=>setForm(v=>({...v,[field.key]:e.target.value}))}/>}</label>)}</div><div className="flex gap-3"><button type="submit" disabled={busy} className="rounded-xl bg-[#08794F] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{busy?t("جارٍ الحفظ","Saving"):t("حفظ في قاعدة البيانات","Save to database")}</button>{editing&&<button type="button" onClick={()=>{setEditing(null);setForm({})}} className="rounded-xl border px-5 py-3 text-sm">{t("إلغاء","Cancel")}</button>}</div></form>}
 </section>;
}
