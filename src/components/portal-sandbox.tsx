"use client";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/lib/i18n";
import type { PortalId } from "@/lib/nav";
import { Plus, Pencil, CheckCircle2, Trash2, Search, X, RotateCcw } from "lucide-react";

type RecordItem = { id: string; title: string; owner: string; status: "pending"|"approved"|"done"; date: string };
const SEEDS: Record<PortalId, RecordItem[]> = {
 platform: [
 {id:"p1",title:"مراجعة طلب تفعيل مدرسة تجريبية",owner:"فريق التفعيل",status:"pending",date:"2026-11-12"},
 {id:"p2",title:"تذكرة دعم تسجيل الدخول",owner:"الدعم الفني",status:"approved",date:"2026-11-11"},
 {id:"p3",title:"مراجعة إعدادات عضوية المعلمين",owner:"فريق الحوكمة",status:"done",date:"2026-11-10"}],
 principal: [
 {id:"r1",title:"اعتماد خطة تحسين نواتج التعلم",owner:"وكيل الشؤون التعليمية",status:"pending",date:"2026-11-12"},
 {id:"r2",title:"متابعة ملف الاختبارات",owner:"لجنة الاختبارات",status:"approved",date:"2026-11-11"},
 {id:"r3",title:"تحديث شواهد الخطة التشغيلية",owner:"فريق الجودة",status:"done",date:"2026-11-10"}],
 teacher: [
 {id:"t1",title:"تجهيز نشاط إثرائي للصف الثاني",owner:"المعلم التجريبي",status:"pending",date:"2026-11-12"},
 {id:"t2",title:"مراجعة دفتر متابعة الطلاب",owner:"المعلم التجريبي",status:"approved",date:"2026-11-11"},
 {id:"t3",title:"رفع تحضير درس نموذجي",owner:"المعلم التجريبي",status:"done",date:"2026-11-10"}],
 family: [
 {id:"f1",title:"طلب موعد لقاء مع المعلم",owner:"ولي الأمر التجريبي",status:"pending",date:"2026-11-12"},
 {id:"f2",title:"متابعة إشعار نشاط مدرسي",owner:"ولي الأمر التجريبي",status:"approved",date:"2026-11-11"},
 {id:"f3",title:"تأكيد الاطلاع على رسالة المدرسة",owner:"ولي الأمر التجريبي",status:"done",date:"2026-11-10"}]
};
const enSeeds: Record<PortalId,string[]> = {
 platform:["Review sample school activation","Sign-in support ticket","Review teacher membership settings"],
 principal:["Approve learning improvement plan","Follow up examination records","Update operational plan evidence"],
 teacher:["Prepare enrichment activity","Review student follow-up notebook","Submit lesson preparation"],
 family:["Request a teacher meeting","Review school activity notice","Acknowledge school message"]
};
const STATUS: Record<RecordItem["status"],{ar:string;en:string}> = {pending:{ar:"قيد المراجعة",en:"Pending"},approved:{ar:"معتمد",en:"Approved"},done:{ar:"مكتمل",en:"Completed"}};
export function PortalSandbox({portal}:{portal:PortalId}) {
 const {isAr}=useLang();
 const key="raven-preview-sandbox-v1-"+portal;
 const [items,setItems]=useState<RecordItem[]>(()=>SEEDS[portal]);
 const [ready,setReady]=useState(false);
 const [search,setSearch]=useState("");
 const [filter,setFilter]=useState("all");
 const [editing,setEditing]=useState<RecordItem|null>(null);
 const [open,setOpen]=useState(false);
 const [title,setTitle]=useState("");
 const [owner,setOwner]=useState("");
 const [notice,setNotice]=useState("");
 const tr=(ar:string,en:string)=>isAr?ar:en;
 useEffect(()=>{try{const raw=window.localStorage.getItem(key);if(raw){const parsed:unknown=JSON.parse(raw);if(Array.isArray(parsed)&&parsed.length<=100&&parsed.every(x=>x&&typeof x.id==="string"&&typeof x.title==="string"&&typeof x.owner==="string"&&["pending","approved","done"].includes(x.status)&&typeof x.date==="string"))setItems(parsed as RecordItem[]);}}catch{}setReady(true)},[key]);
 useEffect(()=>{if(ready)try{window.localStorage.setItem(key,JSON.stringify(items))}catch{}},[items,key,ready]);
 const visible=useMemo(()=>items.filter(x=>(filter==="all"||x.status===filter)&&[x.title,x.owner].join(" ").toLowerCase().includes(search.toLowerCase())),[items,search,filter]);
 const counts={pending:items.filter(x=>x.status==="pending").length,approved:items.filter(x=>x.status==="approved").length,done:items.filter(x=>x.status==="done").length};
 function begin(item?:RecordItem){setEditing(item??null);setTitle(item?.title??"");setOwner(item?.owner??"");setOpen(true);setNotice("")}
 function save(e:React.FormEvent){e.preventDefault();if(!title.trim()||!owner.trim())return;const next={id:editing?.id??crypto.randomUUID(),title:title.trim().slice(0,160),owner:owner.trim().slice(0,100),status:editing?.status??"pending" as const,date:editing?.date??new Date().toISOString().slice(0,10)};setItems(old=>editing?old.map(x=>x.id===editing.id?next:x):[next,...old]);setOpen(false);setNotice(tr("تم حفظ السجل في مساحة التجربة","Saved to the demo workspace"))}
 function status(id:string,status:RecordItem["status"]){setItems(old=>old.map(x=>x.id===id?{...x,status}:x));setNotice(tr("تم تحديث حالة السجل التجريبي","Demo record status updated"))}
 function remove(id:string){if(!window.confirm(tr("حذف السجل التجريبي؟","Delete this demo record?")))return;setItems(old=>old.filter(x=>x.id!==id));setNotice(tr("تم الحذف","Deleted"))}
 return <section aria-label={tr("مساحة البيانات التجريبية","Demo data workspace")} className="my-6 rounded-3xl border border-[#08794F]/25 bg-white p-5 shadow-sm md:p-7">
  <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="mb-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-900">SANDBOX · {tr("بيانات وهمية","SAMPLE DATA")}</div><h2 className="text-xl font-black">{tr("مساحة العمليات التفاعلية","Interactive operations workspace")}</h2><p className="mt-2 text-sm text-[#66736e]">{tr("أضف وعدّل واعتمد سجلات تجريبية. تُحفظ التغييرات في هذا المتصفح فقط، ولا تُرسل إلى قواعد بيانات المدارس.","Create, edit and approve sample records. Changes stay in this browser only and never reach school databases.")}</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={()=>begin()} className="inline-flex items-center gap-2 rounded-xl bg-[#08794F] px-4 py-2 text-sm font-bold text-white"><Plus size={16}/>{tr("إضافة سجل","Add record")}</button><button type="button" onClick={()=>{setItems(SEEDS[portal]);setNotice(tr("تمت إعادة البيانات الافتراضية","Sample data restored"))}} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold"><RotateCcw size={16}/>{tr("إعادة ضبط","Reset")}</button></div></div>
  <div className="mt-5 grid gap-3 sm:grid-cols-3">{(["pending","approved","done"] as const).map(s=><button type="button" key={s} onClick={()=>setFilter(filter===s?"all":s)} className={`rounded-2xl border p-4 text-start ${filter===s?"border-[#08794F] bg-[#08794F]/10":"border-black/10 bg-[#F5F3EC]"}`}><span className="block text-2xl font-black">{counts[s]}</span><span className="text-sm">{tr(STATUS[s].ar,STATUS[s].en)}</span></button>)}</div>
  <div className="mt-5 flex flex-wrap gap-2"><label className="relative min-w-44 flex-1"><Search size={17} className="absolute start-3 top-3 text-[#66736e]"/><input className="w-full rounded-xl border px-9 py-2" aria-label={tr("بحث السجلات","Search records")} placeholder={tr("بحث...","Search...")} value={search} onChange={e=>setSearch(e.target.value)}/></label><select aria-label={tr("تصفية الحالة","Filter status")} className="rounded-xl border px-3 py-2" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">{tr("كل الحالات","All statuses")}</option>{(["pending","approved","done"] as const).map(s=><option key={s} value={s}>{tr(STATUS[s].ar,STATUS[s].en)}</option>)}</select></div>
  {notice&&<p role="status" className="mt-3 rounded-lg bg-[#08794F]/10 p-3 text-sm">{notice}</p>}
  <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[580px] text-start text-sm"><thead><tr className="border-b bg-[#F5F3EC]"><th className="p-3 text-start">{tr("السجل","Record")}</th><th className="p-3 text-start">{tr("المسؤول","Owner")}</th><th className="p-3 text-start">{tr("الحالة","Status")}</th><th className="p-3 text-start">{tr("التاريخ","Date")}</th><th className="p-3 text-start">{tr("الإجراءات","Actions")}</th></tr></thead><tbody>{visible.map(x=><tr key={x.id} className="border-b"><td className="p-3 font-semibold">{!isAr&&SEEDS[portal].some(z=>z.id===x.id)?enSeeds[portal][SEEDS[portal].findIndex(z=>z.id===x.id)]:x.title}</td><td className="p-3">{x.owner}</td><td className="p-3">{tr(STATUS[x.status].ar,STATUS[x.status].en)}</td><td className="p-3" dir="ltr">{x.date}</td><td className="p-3"><div className="flex gap-2"><button type="button" title={tr("تعديل","Edit")} aria-label={tr("تعديل","Edit")} onClick={()=>begin(x)} className="rounded-lg border p-2"><Pencil size={15}/></button><button type="button" title={tr("اعتماد","Approve")} aria-label={tr("اعتماد","Approve")} onClick={()=>status(x.id,"approved")} className="rounded-lg border p-2 text-[#08794F]"><CheckCircle2 size={15}/></button><button type="button" title={tr("حذف","Delete")} aria-label={tr("حذف","Delete")} onClick={()=>remove(x.id)} className="rounded-lg border p-2 text-red-700"><Trash2 size={15}/></button></div></td></tr>)}</tbody></table>{visible.length===0&&<p className="p-5 text-center">{tr("لا توجد سجلات مطابقة","No matching records")}</p>}</div>
  {open&&<div className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}><div role="dialog" aria-modal="true" aria-label={tr("تحرير سجل تجريبي","Edit demo record")} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-black">{editing?tr("تعديل السجل","Edit record"):tr("إضافة سجل","Add record")}</h3><button type="button" onClick={()=>setOpen(false)} aria-label={tr("إغلاق","Close")}><X/></button></div><form onSubmit={save} className="grid gap-4"><label className="grid gap-1 text-sm">{tr("عنوان السجل","Record title")}<input autoFocus required maxLength={160} className="rounded-xl border p-3" value={title} onChange={e=>setTitle(e.target.value)}/></label><label className="grid gap-1 text-sm">{tr("المسؤول","Owner")}<input required maxLength={100} className="rounded-xl border p-3" value={owner} onChange={e=>setOwner(e.target.value)}/></label><div className="flex justify-end gap-2"><button type="button" onClick={()=>setOpen(false)} className="rounded-xl border px-4 py-2">{tr("إلغاء","Cancel")}</button><button type="submit" className="rounded-xl bg-[#08794F] px-4 py-2 font-bold text-white">{tr("حفظ","Save")}</button></div></form></div></div>}
 </section>;
}
