"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { CalendarClock, CalendarDays, Check, Clock3, ExternalLink, Plus, RefreshCw, ShieldCheck, Video } from "lucide-react";
import { useLang } from "@/lib/i18n";
import type { PortalId } from "@/lib/nav";

type Role=PortalId;
type Standard={code:string;name_ar:string;name_en:string;default_minutes:number;notify_before_minutes:number};
type Lesson={id:string;class_code:string;teacher_id:string|null;standard_code:string|null;title:string;details:string;kind:string;mode:string;provider:string;meeting_url:string|null;on_date:string|null;weekday:number|null;starts_at:string;ends_at:string;status:string;origin:string};
type Task={id:string;title:string;teacher_id:string;due_on:string|null;completed_at:string|null;origin:string};
type Roster={child_ref:string;class_code:string};
type Payload={demo?:boolean;role:Role;school_id?:string;standards:Standard[];sessions?:Lesson[];tasks?:Task[];roster?:Roster[]};
const daysAr=["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
const daysEn=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const dateR=(now:Date)=>new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Riyadh",year:"numeric",month:"2-digit",day:"2-digit"}).format(now);
const timeR=(now:Date)=>new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Riyadh",hour:"2-digit",minute:"2-digit",hour12:false}).format(now);
const secondsR=(now:Date)=>Number(new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Riyadh",second:"2-digit"}).format(now));
const minute=(str:string)=>Number(str.slice(0,2))*60+Number(str.slice(3,5));
const dayNo=(date:string)=>new Date(date+"T12:00:00Z").getUTCDay();
const eqDate=(l:Lesson,date:string)=>l.on_date===date||(l.weekday!==null&&l.weekday===dayNo(date));
const printTime=(time:string)=>time.slice(0,5);
function displayTime(seconds:number){return String(Math.floor(seconds/60)).padStart(2,"0")+":"+String(seconds%60).padStart(2,"0");}
function demoPayload(portal:Role):Payload{
 const now=new Date(),d=dateR(now),mins=minute(timeR(now));
 const start=Math.max(0,mins-10),end=Math.min(1439,mins+25),nextStart=Math.min(1439,end+5);
 const clock=(n:number)=>String(Math.floor(n/60)).padStart(2,"0")+":"+String(n%60).padStart(2,"0");
 const sample=(id:string,title:string,a:number,b:number):Lesson=>({
  id,class_code:"DEMO-1",teacher_id:null,standard_code:null,title,details:"",
  kind:"lesson",mode:"in_person",provider:"none",meeting_url:null,
  on_date:d,weekday:null,starts_at:clock(a),ends_at:clock(b),status:"published",origin:"principal",
 });
 return {demo:true,role:portal,school_id:undefined,standards:[],sessions:[
  sample("demo-1","الرياضيات — نموذج توضيحي",start,end),
  sample("demo-2","لغتي — نموذج توضيحي",nextStart,Math.min(1439,nextStart+45))
 ],tasks:[{id:"demo-task",title:"تحضير الحصة القادمة — نموذج",teacher_id:"demo",due_on:d,completed_at:null,origin:"personal"}],
 roster:portal==="family"?[{child_ref:"demo-child",class_code:"DEMO-1"}]:[]};
}
const link=(url:string)=>{try{const u=new URL(url);return u.protocol==="https:"&&["teams.microsoft.com","teams.live.com","meet.google.com"].includes(u.hostname)?url:null;}catch{return null;}};
export function RavenSmartLifeWorkspace({portal,compact=false}:{portal:Role;compact?:boolean}){
 const {isAr}=useLang();
 const t=useCallback((ar:string,en:string)=>isAr?ar:en,[isAr]);
 const [now,setNow]=useState<Date|null>(null);
 const [selectedDate,setSelectedDate]=useState("");
 const [state,setState]=useState<"loading"|"ready"|"error">("loading");
 const [data,setData]=useState<Payload|null>(null);
 const [error,setError]=useState("");
 const [message,setMessage]=useState("");
 const [busy,setBusy]=useState(false);
 const [revision,setRevision]=useState(0);
 const [selectedChild,setSelectedChild]=useState("");
 const [title,setTitle]=useState("");
 const [classCode,setClassCode]=useState("");
 const [details,setDetails]=useState("");
 const [kind,setKind]=useState("lesson"),[mode,setMode]=useState("in_person"),[provider,setProvider]=useState("meet"),[meetingUrl,setMeetingUrl]=useState("");
 const [start,setStart]=useState("08:00"),[end,setEnd]=useState("08:45"),[weekday,setWeekday]=useState("0"),[oneTime,setOneTime]=useState(true);
 const [teacherId,setTeacherId]=useState("");
 const [published,setPublished]=useState(false);
 const [taskTitle,setTaskTitle]=useState("");
 const [taskDue,setTaskDue]=useState("");
 const [childRef,setChildRef]=useState("");
 const [stdCode,setStdCode]=useState(""),[stdAr,setStdAr]=useState(""),[stdEn,setStdEn]=useState(""),[stdMin,setStdMin]=useState(45),[stdNotice,setStdNotice]=useState(5);
 const [showWeek,setShowWeek]=useState(false);
 const today=now?dateR(now):"";
 const date=selectedDate||today;
 const preview=process.env.NEXT_PUBLIC_RAVEN_DEMO_ENABLED==="true";
 useEffect(()=>{const tick=()=>setNow(new Date());tick();const id=window.setInterval(tick,1000);return()=>window.clearInterval(id);},[]);
 useEffect(()=>{let cancelled=false;
  async function refresh(){
   setState("loading");
   try{
    const r=await fetch("/api/smart-life?portal="+portal,{credentials:"same-origin",cache:"no-store"});
    if(!r.ok)throw Error(r.status===503?"schema_unavailable":"unauthorized");
    const json=await r.json() as Payload;
    if(!cancelled){setData(json.demo?demoPayload(portal):json);setState("ready");setError("");}
   }catch(e){
    if(!cancelled){setData(null);setState("error");setError(e instanceof Error?e.message:"service_unavailable");}
   }
  }
  void refresh();return()=>{cancelled=true;};
 },[portal,revision]);
 useEffect(()=>{if(!selectedChild&&data?.roster?.[0])setSelectedChild(data.roster[0].child_ref);},[data,selectedChild]);
 const roster=data?.roster??[];
 const familyClass=roster.find(r=>r.child_ref===selectedChild)?.class_code;
 const periods=useMemo(()=>{
  const sessions=data?.sessions??[];
  return sessions.filter(s=>s.status!=="cancelled"&&portal!=="family" || false)
   .filter(s=>portal!=="family"||(s.status==="published"&&s.class_code===familyClass&&s.kind!=="duty"));
 },[data,portal,familyClass]);
 const currentDay=periods.filter(s=>!!date&&eqDate(s,date)).sort((a,b)=>a.starts_at.localeCompare(b.starts_at));
 const liveMinute=now?minute(timeR(now)):0,liveSecond=now?secondsR(now):0;
 const liveDate=date===today;
 const ongoing=liveDate?currentDay.find(s=>s.status==="published"&&minute(s.starts_at)<=liveMinute&&minute(s.ends_at)>liveMinute):undefined;
 const next=currentDay.find(s=>s.status==="published"&&(liveDate?minute(s.starts_at)>liveMinute:true));
 const remaining=ongoing?Math.max(0,(minute(ongoing.ends_at)-liveMinute)*60-liveSecond):0;
 const totalSeconds=ongoing?Math.max(60,(minute(ongoing.ends_at)-minute(ongoing.starts_at))*60):60;
 const tasks=data?.tasks??[];
 const visibleTasks=tasks.filter(x=>!x.due_on||x.due_on<=date);
 async function commit(body:Record<string,unknown>){
  setBusy(true);setMessage("");
  try{
   if(data?.demo)throw Error(t("المعاينة لا تحفظ التغييرات.","Preview changes are disabled."));
   const r=await fetch("/api/smart-life?portal="+portal,{
    method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)
   });
   const result=await r.json();
   if(!r.ok)throw Error(typeof result.error==="string"?result.error:"unable_to_save");
   setRevision(x=>x+1);setMessage(t("تم حفظ العملية في مصدر المدرسة المصرح به.","Saved to the authorized school source."));
   return true;
  }catch(e){setMessage(e instanceof Error?e.message:"unable_to_save");return false;}
  finally{setBusy(false);}
 }
 async function createSession(e:FormEvent){
  e.preventDefault();
  const ok=await commit({action:"session-create",title,class_code:classCode,details,kind,mode,provider:mode==="remote"?provider:"none",meeting_url:mode==="remote"?meetingUrl:"",
   starts_at:start,ends_at:end,on_date:oneTime?date:null,weekday:oneTime?null:Number(weekday),teacher_id:portal==="principal"?teacherId||null:undefined,publish:portal==="principal"&&published});
  if(ok){setTitle("");setDetails("");setMeetingUrl("");}
 }
 async function createTask(e:FormEvent){
  e.preventDefault();const ok=await commit({action:"task-create",title:taskTitle,due_on:taskDue||null,teacher_id:portal==="principal"?teacherId:undefined});if(ok)setTaskTitle("");
 }
 async function saveStandard(e:FormEvent){
  e.preventDefault();const ok=await commit({action:"standard-save",code:stdCode,name_ar:stdAr,name_en:stdEn,default_minutes:stdMin,notify_before_minutes:stdNotice});if(ok){setStdCode("");setStdAr("");setStdEn("");}
 }
 const label=portal==="platform"?t("أصل Smart Life ومعايير الجدول المدرسي","Smart Life master and timetable standards"):
  portal==="principal"?t("قيادة اليوم المدرسي الذكي","School smart day management"):
  portal==="teacher"?t("يومي الذكي وحصصي ومهامي","My smart day, lessons and tasks"):t("اليوم الذكي لأبنائي","My children's smart learning day");
 const empty=t("لا توجد حصص معتمدة لهذا اليوم. لا نعرض أوقاتًا أو مهامًا افتراضية.","No approved lessons for this date. No fabricated periods are shown.");
 return <section className="space-y-4" aria-label="RAVEN SMART LIFE">
  <header className="flex flex-wrap items-start justify-between gap-3">
   <div><p className="flex items-center gap-2 text-xs font-extrabold tracking-wider text-[#08794F]"><CalendarClock size={16}/> RAVEN SMART LIFE</p>
    <h2 className="mt-2 text-xl font-black text-[#111A18] md:text-2xl">{label}</h2>
    {!compact&&<p className="mt-2 max-w-2xl text-xs leading-6 text-[#53615b]">{t("مصدر واحد للجدول: معايير المنصة، اعتماد المدرسة، تنفيذ المعلم، ومتابعة الأسرة وفق الصلاحيات.","One timetable source: platform standards, school approval, teacher execution and authorized guardian view.")}</p>}
   </div>
   {compact?<Link href={"/"+portal+"/smart-life"} className="inline-flex items-center gap-2 rounded-xl border border-[#08794F]/25 bg-[#e7f4eb] px-3 py-2 text-xs font-extrabold text-[#064e3b]">{t("فتح Smart Life والجدول","Open Smart Life timetable")}<ExternalLink size={14}/></Link>:
   <button type="button" onClick={()=>setRevision(v=>v+1)} disabled={busy} className="inline-flex items-center gap-2 rounded-xl border border-[#08794F]/25 bg-white px-3 py-2 text-xs font-bold text-[#064e3b]"><RefreshCw size={15}/>{t("تحديث","Refresh")}</button>}
  </header>
  {data?.demo&&<p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-950" role="status">{t("معاينة مرئية ببيانات توضيحية فقط — لا حفظ ولا طلاب حقيقيون.","Preview with illustrative data only — no changes or real students.")}</p>}
  {state==="error"&&<div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">{t("Smart Life غير مفعّل في مصدر رافين حتى الآن. يلزم اختبار الترحيل وتفعيل الصلاحيات في بيئة آمنة.","Smart Life is not enabled in Raven data yet. Migration and permissions require staging verification.")}<small className="mt-1 block opacity-70">{error}</small></div>}
  {state==="loading"&&<p role="status" className="rf-card p-4 text-sm text-[#53615b]">{t("التحقق من بيانات Smart Life...","Verifying Smart Life data...")}</p>}
  {state==="ready"&&portal==="platform"&&<div className="grid gap-4 lg:grid-cols-2">
   <section className="rf-card p-4"><h3 className="font-black">{t("المعايير والأنشطة المرجعية","Central activity standards")}</h3>
    {(data?.standards??[]).length?<div className="mt-3 space-y-2">{data?.standards?.map(s=><div key={s.code} className="flex justify-between gap-2 border-b py-2 text-xs"><strong>{isAr?s.name_ar:s.name_en}</strong><span>{s.default_minutes} {t("دقيقة","min")} · {t("تنبيه","notice")} {s.notify_before_minutes}</span></div>)}</div>:<p className="mt-3 text-sm text-[#66736e]">{t("لا توجد معايير محفوظة بعد.","No standards saved yet.")}</p>}
   </section>
   {!compact&&<form className="rf-card grid gap-3 p-4" onSubmit={saveStandard}>
    <h3 className="font-black">{t("تعريف معيار جديد","New standard")}</h3>
    <label className="text-xs">{t("الرمز","Code")}<input required pattern="[a-z][a-z0-9_-]{2,39}" className="mt-1 w-full rounded-lg border p-2" value={stdCode} onChange={e=>setStdCode(e.target.value)}/></label>
    <label className="text-xs">{t("الاسم العربي","Arabic name")}<input required minLength={3} maxLength={120} className="mt-1 w-full rounded-lg border p-2" value={stdAr} onChange={e=>setStdAr(e.target.value)}/></label>
    <label className="text-xs">{t("الاسم الإنجليزي","English name")}<input required minLength={3} maxLength={120} className="mt-1 w-full rounded-lg border p-2" value={stdEn} onChange={e=>setStdEn(e.target.value)}/></label>
    <div className="grid grid-cols-2 gap-2"><label className="text-xs">{t("المدة بالدقائق","Minutes")}<input type="number" min={5} max={240} value={stdMin} onChange={e=>setStdMin(Number(e.target.value))} className="mt-1 w-full rounded-lg border p-2"/></label>
     <label className="text-xs">{t("التنبيه بالدقائق","Notice min")}<input type="number" min={0} max={60} value={stdNotice} onChange={e=>setStdNotice(Number(e.target.value))} className="mt-1 w-full rounded-lg border p-2"/></label></div>
    <button disabled={busy||data?.demo} type="submit" className="rounded-xl bg-[#08794F] px-4 py-3 text-sm font-bold text-white disabled:opacity-50">{t("حفظ المعيار","Save standard")}</button>
   </form>}
  </div>}
  {state==="ready"&&portal!=="platform"&&<>
   <div className="flex flex-wrap items-center gap-3 rounded-xl border border-black/10 bg-[#faf8f3] p-3">
    <label className="flex items-center gap-2 text-xs font-bold text-[#33483a]">{t("التاريخ","Date")}<input aria-label={t("تاريخ الجدول","Timetable date")} type="date" value={date} onChange={e=>setSelectedDate(e.target.value)} className="rounded-lg border bg-white p-2"/></label>
    <span className="ms-auto flex items-center gap-1 text-xs font-bold text-[#08794F]"><Clock3 size={15}/>{now?timeR(now):"—"} · {t("توقيت الرياض","Riyadh time")}</span>
   </div>
   {portal==="family"&&roster.length>1&&<label className="flex gap-2 text-sm font-bold">{t("الطفل المصرح به","Authorized child")}<select value={selectedChild} onChange={e=>setSelectedChild(e.target.value)} className="rounded-lg border px-2 py-1">{roster.map((c,i)=><option key={c.child_ref} value={c.child_ref}>{t("طفل","Child")} {i+1}</option>)}</select></label>}
   <div className="grid gap-3 sm:grid-cols-3">
    {[
     {name:t("الفترات المعتمدة","Approved periods"),value:String(currentDay.filter(x=>x.status==="published").length),sub:t("اليوم المحدد","Selected date")},
     {name:t("الحصة الحالية","Current lesson"),value:ongoing?.title??"—",sub:ongoing?t("الوقت المتبقي","Time remaining")+" "+displayTime(remaining):t("لا توجد حصة جارية","None in progress")},
     {name:t("الحصة القادمة","Next lesson"),value:next?.title??"—",sub:next?printTime(next.starts_at):t("لا توجد حصة قادمة","Nothing upcoming")}
    ].map(card=><article key={card.name} className="rounded-2xl border border-[#D4AF37]/25 bg-white p-4"><span className="text-xs font-bold text-[#63746b]">{card.name}</span><strong className="mt-2 block break-words text-lg font-black text-[#064e3b]">{card.value}</strong><small className="text-xs text-[#68786e]">{card.sub}</small></article>)}
   </div>
   {ongoing&&<div className="rounded-xl border border-[#08794F]/30 bg-[#eaf6ed] p-3"><div className="flex items-center justify-between gap-3 text-xs font-bold"><span>{ongoing.title}</span><time>{displayTime(remaining)}</time></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-[#08794F]" style={{width:Math.max(0,Math.min(100,(1-remaining/totalSeconds)*100))+"%"}}/></div></div>}
   <section className="rf-card p-4 md:p-5"><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h3 className="flex items-center gap-2 font-black"><CalendarDays size={18} className="text-[#08794F]"/>{t("الجدول الذكي","Smart timetable")}</h3>{!compact&&<button type="button" onClick={()=>setShowWeek(v=>!v)} className="rounded-lg border bg-[#eaf6ed] px-3 py-2 text-xs font-bold text-[#064e3b]">{showWeek?t("عرض اليوم","Daily view"):t("عرض الأسبوع","Weekly view")}</button>}</div>
    {portal==="family"&&!data?.demo&&!roster.length&&<p className="mb-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-950">{t("يلزم توثيق فصل كل طفل وربطه بولي الأمر في سجلات المدرسة قبل عرض الجدول.","Guardian-student and classroom links must be verified before a child's timetable is displayed.")}</p>}
    <div className="space-y-2">
    {(showWeek&&!compact?periods.filter(s=>s.status==="published"&&s.weekday!==null):currentDay).length?
     (showWeek&&!compact?periods.filter(s=>s.status==="published"&&s.weekday!==null).sort((a,b)=>(a.weekday??0)-(b.weekday??0)||a.starts_at.localeCompare(b.starts_at)):currentDay).slice(0,compact?4:200).map(s=><article key={s.id} className={"flex flex-wrap items-start gap-3 rounded-xl border px-3 py-3 "+(ongoing?.id===s.id?"border-[#d4af37] bg-[#fff9e8]":"border-[#e6ebe5] bg-white")}>
      <div className="min-w-[76px] rounded-lg bg-[#e9f5ed] px-2 py-2 text-center font-mono text-xs font-black text-[#075a3e]">{s.weekday!==null&&showWeek&&!compact?<span className="block">{isAr?daysAr[s.weekday]:daysEn[s.weekday]}</span>:null}{printTime(s.starts_at)}<span className="block text-[10px] font-medium">{printTime(s.ends_at)}</span></div>
      <div className="min-w-0 flex-1"><strong className="text-sm font-bold text-[#123f2c]">{s.title}</strong><p className="text-xs text-[#69786e]">{s.class_code} · {s.kind==="duty"?t("مناوبة","Duty"):s.kind==="activity"?t("نشاط","Activity"):t("حصة","Lesson")} · {s.status==="pending"?t("بانتظار الاعتماد","Awaiting approval"):s.status==="draft"?t("مسودة","Draft"):t("معتمد","Published")}</p></div>
      {s.mode==="remote"&&s.status==="published"&&s.meeting_url&&link(s.meeting_url)&&<a href={link(s.meeting_url)!} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-[#08794F]/30 p-2 text-xs font-bold text-[#08794F]"><Video size={15}/>{t("الانضمام","Join")}</a>}
      {portal==="principal"&&s.status==="pending"&&<button type="button" disabled={busy||data?.demo} onClick={()=>void commit({action:"session-review",id:s.id,status:"published"})} className="inline-flex items-center gap-1 rounded-lg bg-[#08794F] px-3 py-2 text-xs font-bold text-white disabled:opacity-50"><ShieldCheck size={14}/>{t("اعتماد","Approve")}</button>}
     </article>):<p className="rounded-xl bg-[#f7f8f5] p-5 text-center text-xs text-[#65746b]">{empty}</p>}
    </div>
   </section>
   {portal!=="family"&&<section className="rf-card p-4"><h3 className="mb-3 flex items-center gap-2 font-black"><Check size={16} className="text-[#08794F]"/>{t("المهام اليومية","Daily tasks")}</h3>
     {visibleTasks.length?<div className="space-y-2">{visibleTasks.slice(0,compact?3:50).map(x=><div key={x.id} className="flex items-center justify-between gap-2 border-b p-2 text-xs"><div><strong>{x.title}</strong><p className="text-[#69786e]">{x.due_on??t("بدون موعد","No due date")}{x.origin==="assigned"?" · "+t("تكليف","Assigned"):""}</p></div>{!compact&&<button type="button" disabled={busy||data?.demo} onClick={()=>void commit({action:"task-complete",id:x.id,completed:!x.completed_at})} className="rounded-lg border p-2 text-[#08794F]">{x.completed_at?t("إعادة فتح","Reopen"):t("إنجاز","Complete")}</button>}</div>)}</div>:<p className="text-xs text-[#647369]">{t("لا توجد مهام موثقة.","No verified tasks yet.")}</p>}
   </section>}
   {!compact&&portal!=="family"&&<div className="grid gap-4 lg:grid-cols-2">
    <form className="rf-card grid gap-3 p-4" onSubmit={createSession}>
     <h3 className="font-black">{portal==="teacher"?t("طلب حصة إضافية","Request additional lesson"):t("إعداد حصة أو نشاط","Create session")}</h3>
     <label className="text-xs">{t("الفصل أو المجموعة","Class or group")}<input required minLength={2} maxLength={80} value={classCode} onChange={e=>setClassCode(e.target.value)} className="mt-1 w-full rounded-lg border p-2" placeholder={t("رقم الفصل المعتمد","Verified class code")}/></label>
     <label className="text-xs">{t("اسم الدرس أو النشاط","Lesson or activity")}<input required minLength={3} maxLength={180} value={title} onChange={e=>setTitle(e.target.value)} className="mt-1 w-full rounded-lg border p-2"/></label>
     <label className="text-xs">{t("ملاحظات","Notes")}<input maxLength={1400} value={details} onChange={e=>setDetails(e.target.value)} className="mt-1 w-full rounded-lg border p-2"/></label>
     {portal==="principal"&&<label className="text-xs">{t("معرف المعلم الموثق (اختياري)","Verified teacher ID (optional)")}<input value={teacherId} onChange={e=>setTeacherId(e.target.value)} className="mt-1 w-full rounded-lg border p-2"/></label>}
     <div className="grid grid-cols-2 gap-2">
      <label className="text-xs">{t("النوع","Type")}<select value={kind} onChange={e=>setKind(e.target.value)} className="mt-1 w-full rounded-lg border p-2"><option value="lesson">{t("حصة","Lesson")}</option><option value="activity">{t("نشاط","Activity")}</option><option value="duty">{t("مناوبة","Duty")}</option></select></label>
      <label className="text-xs">{t("التنفيذ","Mode")}<select value={mode} onChange={e=>setMode(e.target.value)} className="mt-1 w-full rounded-lg border p-2"><option value="in_person">{t("حضوري","In person")}</option><option value="remote">{t("عن بُعد","Remote")}</option></select></label>
     </div>
     {mode==="remote"&&<div className="grid grid-cols-2 gap-2"><label className="text-xs">{t("البث","Provider")}<select value={provider} onChange={e=>setProvider(e.target.value)} className="mt-1 w-full rounded-lg border p-2"><option value="meet">Google Meet</option><option value="teams">Microsoft Teams</option></select></label><label className="text-xs">{t("رابط الحصة","Meeting URL")}<input type="url" required value={meetingUrl} onChange={e=>setMeetingUrl(e.target.value)} className="mt-1 w-full rounded-lg border p-2"/></label></div>}
     <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={oneTime} onChange={e=>setOneTime(e.target.checked)}/>{t("حصة بتاريخ محدد","One-time date")}</label>
     {!oneTime&&<label className="text-xs">{t("اليوم الأسبوعي","Weekday")}<select value={weekday} onChange={e=>setWeekday(e.target.value)} className="mt-1 w-full rounded-lg border p-2">{daysAr.map((v,i)=><option key={v} value={i}>{isAr?v:daysEn[i]}</option>)}</select></label>}
     <div className="grid grid-cols-2 gap-2">
      <label className="text-xs">{t("تبدأ","Starts")}<input type="time" required value={start} onChange={e=>setStart(e.target.value)} className="mt-1 w-full rounded-lg border p-2"/></label>
      <label className="text-xs">{t("تنتهي","Ends")}<input type="time" required value={end} onChange={e=>setEnd(e.target.value)} className="mt-1 w-full rounded-lg border p-2"/></label>
     </div>
     {portal==="principal"&&<label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={published} onChange={e=>setPublished(e.target.checked)}/>{t("اعتماد الحصة مباشرة بعد فحص التعارض","Publish after conflict check")}</label>}
     {portal==="teacher"&&<p className="text-xs text-[#657468]">{t("الحصة الإضافية لا تظهر للأسرة قبل موافقة مدير المدرسة، ويجب أن تكون لفصل معتمد ومسند إليك.","Extra lessons require a verified class assignment and school approval.")}</p>}
     <button disabled={busy||data?.demo} className="flex items-center justify-center gap-2 rounded-xl bg-[#08794F] p-3 text-xs font-bold text-white disabled:opacity-50"><Plus size={15}/>{portal==="teacher"?t("إرسال للاعتماد","Request approval"):t("حفظ الحصة","Save session")}</button>
    </form>
    <form className="rf-card grid content-start gap-3 p-4" onSubmit={createTask}>
     <h3 className="font-black">{portal==="teacher"?t("إضافة مهمة شخصية","Add personal task"):t("تكليف معلم بمهمة","Assign a task")}</h3>
     <label className="text-xs">{t("المهمة","Task")}<input required minLength={3} maxLength={180} value={taskTitle} onChange={e=>setTaskTitle(e.target.value)} className="mt-1 w-full rounded-lg border p-2"/></label>
     <label className="text-xs">{t("الموعد","Due date")}<input type="date" value={taskDue} onChange={e=>setTaskDue(e.target.value)} className="mt-1 w-full rounded-lg border p-2"/></label>
     {portal==="principal"&&<label className="text-xs">{t("معرف المعلم الموثق","Verified teacher ID")}<input required value={teacherId} onChange={e=>setTeacherId(e.target.value)} className="mt-1 w-full rounded-lg border p-2"/></label>}
     <button disabled={busy||data?.demo} className="rounded-xl bg-[#08794F] p-3 text-xs font-bold text-white disabled:opacity-50">{t("حفظ المهمة","Save task")}</button>
    </form>
   </div>}
   {!compact&&portal==="principal"&&<form className="rf-card grid gap-3 p-4" onSubmit={e=>{e.preventDefault();void commit({action:"roster-link",child_ref:childRef,class_code:classCode});}}>
     <h3 className="font-black">{t("ربط الجدول بطفل موثق","Link verified child to class timetable")}</h3>
     <p className="text-xs text-[#53615b]">{t("يقبل فقط مرجع طفل موجود في سجل العلاقة الموثقة بولي الأمر والمدرسة. لا تُنشأ ملفات أطفال مكررة.","Accepts only an existing verified guardian-child school record; no duplicate child profile.")}</p>
     <div className="grid gap-2 md:grid-cols-2"><label className="text-xs">{t("مرجع الطفل الموثق","Verified child reference")}<input required value={childRef} onChange={e=>setChildRef(e.target.value)} className="mt-1 w-full rounded-lg border p-2"/></label>
      <label className="text-xs">{t("رمز الفصل","Class code")}<input required value={classCode} onChange={e=>setClassCode(e.target.value)} className="mt-1 w-full rounded-lg border p-2"/></label></div>
     <button disabled={busy||data?.demo} className="w-fit rounded-xl bg-[#08794F] px-5 py-3 text-xs font-bold text-white disabled:opacity-50">{t("ربط مع التحقق","Link after verification")}</button>
    </form>}
  </>}
  {message&&<p role="status" className="rounded-xl border border-[#08794F]/20 bg-[#e7f4eb] p-3 text-xs text-[#064e3b]">{message}</p>}
 </section>;
}
