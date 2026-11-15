"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLang } from "@/lib/i18n";

type School = { id:string; name:string; status:"active"|"pending"|"suspended"; created_at:string };
const statuses = ["active","pending","suspended"] as const;
const labels:Record<string,string>={active:"نشطة",pending:"قيد التفعيل",suspended:"موقوفة"};
function validName(value:string){const n=value.trim().replace(/\s+/g," ");return n.length>=2&&n.length<=160&&!/[\u0000-\u001f\u007f]/.test(n)?n:null;}
async function request(url:string,options?:RequestInit){
 const r=await fetch(url,{credentials:"same-origin",cache:"no-store",...options});
 const j=await r.json().catch(()=>({error:"invalid_server_response"}));
 if(!r.ok)throw new Error(r.status===401?"يلزم تسجيل الدخول بمدير منصة معتمد":r.status===403?"ليس لديك صلاحية تنفيذ العملية":r.status===409?"تعارض في البيانات":r.status===503?"تعذر الاتصال بالخدمة، حاول لاحقًا":String(j.error||"فشلت العملية"));
 return j as {records:School[]};
}
export function PlatformSchools(){
 const {isAr}=useLang();
 const [schools,setSchools]=useState<School[]>([]);
 const [search,setSearch]=useState("");
 const [selected,setSelected]=useState<School|null>(null);
 const [editing,setEditing]=useState<string|null>(null);
 const [name,setName]=useState("");
 const [status,setStatus]=useState<School["status"]>("pending");
 const [busy,setBusy]=useState(false);
 const [loaded,setLoaded]=useState(false);
 const [error,setError]=useState("");
 const [notice,setNotice]=useState("");
 const t=(ar:string,en:string)=>isAr?ar:en;
 const load=useCallback(async()=>{
  setBusy(true);setError("");
  try{const j=await request("/api/platform/records?module=schools");if(!Array.isArray(j.records))throw new Error("استجابة غير صالحة");setSchools(j.records);setLoaded(true);setSelected(prev=>prev?j.records.find(s=>s.id===prev.id)||null:null);}
  catch(e){setError(e instanceof Error?e.message:"تعذر تحميل المدارس");setLoaded(false);}
  finally{setBusy(false);}
 },[]);
 useEffect(()=>{const timer=setTimeout(()=>{void load();},0);return ()=>clearTimeout(timer);},[load]);
 const visible=useMemo(()=>schools.filter(s=>s.name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())||s.id.includes(search.trim())),[schools,search]);
 function reset(){setEditing(null);setName("");setStatus("pending");}
 function edit(s:School){setEditing(s.id);setName(s.name);setStatus(s.status);setNotice("");setError("");}
 async function save(e:React.FormEvent){
  e.preventDefault();const normalized=validName(name);
  if(!normalized){setError(t("اسم المدرسة مطلوب بطول 2–160 حرفًا دون رموز تحكم.","School name must contain 2–160 valid characters."));return;}
  if(!statuses.includes(status)){setError("حالة المدرسة غير صالحة");return;}
  setBusy(true);setError("");setNotice("");
  try{
   const qs=new URLSearchParams({module:"schools"});if(editing)qs.set("id",editing);
   const j=await request("/api/platform/records?"+qs,{method:editing?"PATCH":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:normalized,status})});
   if(!Array.isArray(j.records)||j.records.length!==1)throw new Error("لم يؤكد الخادم حفظ السجل");
   const saved=j.records[0];const wasEditing=Boolean(editing);
   await load();
   setSelected(saved);reset();
   setNotice(wasEditing?t("تم تعديل المدرسة وحفظها في قاعدة البيانات.","School updated and saved."):t("تمت إضافة المدرسة وحفظها في قاعدة البيانات.","School created and saved."));
  }catch(e){setError(e instanceof Error?e.message:"تعذر الحفظ");}finally{setBusy(false);}
 }
 return <section className="space-y-5 rounded-3xl border border-[#08794F]/15 bg-white p-5 md:p-7" aria-label={t("إدارة المدارس","School management")}>
  <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-black text-[#111A18]">{t("إدارة المدارس","School management")}</h2><p className="text-sm text-[#66736e]">{t("المدارس المسجلة في قاعدة البيانات الفعلية وفق صلاحيات مدير المنصة.","Live schools subject to platform administrator permissions.")}</p></div><button type="button" onClick={()=>void load()} disabled={busy} className="rounded-xl border px-4 py-2">{t("تحديث","Refresh")}</button></div>
  {error&&<p role="alert" className="rounded-xl bg-red-50 p-3 text-red-800">{error}</p>}
  {notice&&<p role="status" className="rounded-xl bg-green-50 p-3 text-green-900">{notice}</p>}
  <label className="block space-y-1"><span>{t("البحث بالاسم أو المعرف","Search by name or ID")}</span><input aria-label={t("البحث عن مدرسة","Search schools")} className="w-full rounded-xl border p-3" value={search} onChange={e=>setSearch(e.target.value)}/></label>
  {loaded&&<div className="overflow-x-auto rounded-xl border"><table className="min-w-full text-sm"><thead><tr className="bg-[#F5F3EC]"><th className="p-3 text-start">{t("المدرسة","School")}</th><th className="p-3 text-start">{t("الحالة","Status")}</th><th className="p-3 text-start">{t("الإجراءات","Actions")}</th></tr></thead><tbody>{visible.map(s=><tr key={s.id} className="border-t"><td className="p-3">{s.name}</td><td className="p-3">{isAr?labels[s.status]:s.status}</td><td className="space-x-2 p-3"><button type="button" className="rounded-lg border px-3 py-2" onClick={()=>setSelected(s)}>{t("التفاصيل","Details")}</button><button type="button" className="rounded-lg border px-3 py-2" onClick={()=>edit(s)}>{t("تعديل","Edit")}</button></td></tr>)}</tbody></table>{!visible.length&&<p className="p-4">{t("لا توجد مدارس مطابقة.","No matching schools.")}</p>}</div>}
  {selected&&<section aria-label={t("تفاصيل المدرسة","School details")} className="rounded-xl border bg-[#F5F3EC] p-4"><h3 className="font-bold">{t("تفاصيل المدرسة","School details")}</h3><dl className="mt-2 space-y-2 break-all text-sm"><dt>ID</dt><dd>{selected.id}</dd><dt>{t("الاسم","Name")}</dt><dd>{selected.name}</dd><dt>{t("الحالة","Status")}</dt><dd>{isAr?labels[selected.status]:selected.status}</dd><dt>{t("تاريخ الإنشاء","Created")}</dt><dd>{selected.created_at}</dd></dl></section>}
  <form onSubmit={save} className="space-y-3 rounded-xl bg-[#F5F3EC] p-4"><h3 className="font-bold">{editing?t("تعديل المدرسة","Edit school"):t("إضافة مدرسة","Add school")}</h3><label className="block space-y-1"><span>{t("اسم المدرسة","School name")}</span><input required minLength={2} maxLength={160} className="w-full rounded-lg border p-3" value={name} onChange={e=>setName(e.target.value)}/></label><label className="block space-y-1"><span>{t("الحالة","Status")}</span><select className="w-full rounded-lg border p-3" value={status} onChange={e=>setStatus(e.target.value as School["status"])}>{statuses.map(s=><option key={s} value={s}>{isAr?labels[s]:s}</option>)}</select></label><div className="flex gap-2"><button type="submit" disabled={busy} className="rounded-xl bg-[#08794F] px-5 py-3 font-bold text-white disabled:opacity-50">{busy?t("جارٍ الحفظ","Saving"):t("حفظ","Save")}</button>{editing&&<button type="button" onClick={reset} className="rounded-xl border px-4 py-3">{t("إلغاء","Cancel")}</button>}</div></form>
 </section>;
}
