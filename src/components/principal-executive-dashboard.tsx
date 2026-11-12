"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { ArrowUpLeft, CalendarCheck2, ClipboardCheck, GraduationCap, ListChecks, ShieldCheck, UsersRound, type LucideIcon } from "lucide-react";

type Metric = { ar: string; en: string; icon: LucideIcon; path: string; descriptionAr: string; descriptionEn: string };
const metrics: Metric[] = [
 {ar:"نسبة حضور الطلاب",en:"Student attendance",icon:GraduationCap,path:"/principal/behavior/absence",descriptionAr:"الحضور اليومي",descriptionEn:"Daily attendance"},
 {ar:"انتظام المعلمين",en:"Teacher attendance",icon:UsersRound,path:"/principal/teachers",descriptionAr:"المتابعة والانضباط",descriptionEn:"Attendance & consistency"},
 {ar:"إنجاز الخطة التشغيلية",en:"Operational plan completion",icon:ListChecks,path:"/principal/operational-plan",descriptionAr:"التقدم في التنفيذ",descriptionEn:"Execution progress"},
 {ar:"جاهزية الاختبارات",en:"Exam readiness",icon:CalendarCheck2,path:"/principal/exams/control",descriptionAr:"التحضير والاعتماد",descriptionEn:"Preparation & approval"},
];
const actions = [
 {ar:"مراجعة التكليفات والمهام",en:"Review assignments & tasks",to:"/principal/assignments",icon:ClipboardCheck},
 {ar:"متابعة الخطة التشغيلية",en:"Follow up operational plan",to:"/principal/operational-plan",icon:ListChecks},
 {ar:"الاطلاع على كنترول الاختبارات",en:"Open examination control",to:"/principal/exams/control",icon:CalendarCheck2},
 {ar:"مراجعة تقارير المدرسة",en:"Review school reports",to:"/principal/reports",icon:ShieldCheck},
];
type PreviewMetrics = { attendance:number; teachers:number; plan:number; exams:number };
const SAMPLE: PreviewMetrics = {attendance:93,teachers:96,plan:68,exams:82};
const metricKeys: (keyof PreviewMetrics)[] = ["attendance","teachers","plan","exams"];
export function PrincipalExecutiveDashboard() {
 const {isAr}=useLang();
 const preview = process.env.NEXT_PUBLIC_RAVEN_DEMO_ENABLED === "true";
 const [values,setValues]=useState<PreviewMetrics>(SAMPLE);
 const [edit,setEdit]=useState(false);
 useEffect(()=>{if(!preview)return;queueMicrotask(()=>{try{const raw=localStorage.getItem("raven-principal-preview-metrics-v1");if(raw){const data=JSON.parse(raw) as PreviewMetrics;if(metricKeys.every(k=>Number.isInteger(data[k])&&data[k]>=0&&data[k]<=100))setValues(data)}}catch{}})},[preview]);
 function change(k:keyof PreviewMetrics,n:number){setValues(old=>{const next={...old,[k]:Math.max(0,Math.min(100,n))};try{localStorage.setItem("raven-principal-preview-metrics-v1",JSON.stringify(next))}catch{}return next})}
 const t=(ar:string,en:string)=>isAr?ar:en;
 return <div className="space-y-6 pb-8">
  <section className="rf-hero relative rounded-[28px] border border-[#D4AF37]/30 px-6 py-7 text-white md:px-8 md:py-9">
   <div className="pointer-events-none absolute -end-12 -top-20 h-52 w-52 rounded-full border-[35px] border-[#08794F]/25"/>
   <div className="relative">
    <p className="mb-3 text-xs font-bold tracking-widest text-[#D4AF37]">RAVEN OS · {t("القيادة المدرسية","SCHOOL LEADERSHIP")}</p>
    <h1 className="text-2xl font-black md:text-3xl">{t("لوحة القيادة التنفيذية","Executive Dashboard")}</h1>
    <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">{t("نظرة مركزة على أداء المدرسة وأولويات العمل، مع وصول سريع للمراكز التشغيلية من القائمة الجانبية.","A focused view of school performance and priorities, with direct access to operational centers from the sidebar.")}</p>
   </div>
  </section>
  <section aria-label={t("المؤشرات الرئيسية","Key performance indicators")}>
   <div className="mb-3 flex items-center justify-between gap-3"><h2 className="rf-section-title text-base">{t("المؤشرات الرئيسية","Key indicators")}</h2><span className="text-xs text-[#64736d]">{preview?t("بيانات تدريبية قابلة للتعديل — ليست نتائج حقيقية","Editable training data — not real results"):t("آخر بيانات معتمدة","Latest verified data")}</span></div>
   <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric,index)=>{const Icon=metric.icon;const value=preview?values[metricKeys[index]]:null;return <Link key={metric.path} href={metric.path} className="rf-card group p-5">
    <div className="mb-5 flex items-start justify-between"><span className="rf-icon"><Icon size={21}/></span><ArrowUpLeft size={16} className="text-[#8b977f] transition group-hover:text-[#08794F]"/></div>
    <div className="text-sm font-bold text-[#111A18]">{t(metric.ar,metric.en)}</div>
    <div className="rf-metric-value mt-2 text-3xl font-black tabular-nums" aria-label={value===null?t("لا توجد قيمة موثقة","No verified value"):undefined}>{value===null?"—":`${value}%`}</div>
    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E9E7DE]"><div className="h-full rounded-full bg-[#08794F] transition-all" style={{width:`${value??0}%`}}/></div>
    <p className="mt-3 text-xs text-[#66736e]">{t(metric.descriptionAr,metric.descriptionEn)}</p>
   </Link>})}</div>
   {preview&&<div className="mt-3 rounded-xl border border-[#D4AF37]/35 bg-[#D4AF37]/10 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-bold text-[#5c4b19]">{t("وضع المعاينة: مؤشرات تدريبية منفصلة عن سجلات المدرسة","Preview mode: training indicators isolated from school records")}</p><button type="button" onClick={()=>setEdit(v=>!v)} className="rounded-lg bg-[#111A18] px-3 py-2 text-xs font-bold text-white">{edit?t("إغلاق المحرر","Close editor"):t("تعديل مؤشرات التجربة","Edit demo indicators")}</button></div>{edit&&<div className="mt-4 grid gap-4 sm:grid-cols-2">{metrics.map((m,i)=>{const k=metricKeys[i];return <label key={k} className="grid gap-2 text-xs font-bold">{t(m.ar,m.en)}: {values[k]}%<input type="range" min={0} max={100} value={values[k]} onChange={e=>change(k,Number(e.target.value))} className="accent-[#08794F]"/></label>})}<button type="button" onClick={()=>{setValues(SAMPLE);try{localStorage.removeItem("raven-principal-preview-metrics-v1")}catch{}}} className="rounded-lg border border-[#111A18]/20 bg-white px-3 py-2 text-xs font-bold">{t("استعادة القيم التدريبية","Reset training values")}</button></div>}</div>}

  </section>
  <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
   <section className="rf-panel p-5 md:p-6">
    <div className="mb-5 flex items-center justify-between gap-2"><div><h2 className="text-base font-black text-[#111A18]">{t("الإجراءات السريعة","Quick actions")}</h2><p className="mt-1 text-xs text-[#66736e]">{t("أهم مسارات العمل اليومية","Priority daily workflows")}</p></div><ClipboardCheck size={21} className="text-[#08794F]"/></div>
    <div className="grid gap-2 sm:grid-cols-2">{actions.map(a=>{const Icon=a.icon;return <Link href={a.to} key={a.to} className="rf-card flex items-center gap-3 p-4 text-sm font-bold text-[#111A18]"><Icon size={19} className="shrink-0 text-[#08794F]"/><span className="flex-1">{t(a.ar,a.en)}</span><ArrowUpLeft size={15} className="text-[#8b977f]"/></Link>})}</div>
   </section>
   <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm md:p-6">
    <div className="mb-5 flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#D4AF37]/15 text-[#927116]"><ShieldCheck size={19}/></span><div><h2 className="text-base font-black text-[#111A18]">{t("موجز المهام العاجلة","Urgent tasks overview")}</h2><p className="mt-1 text-xs text-[#66736e]">{t("القرارات التي تتطلب متابعة","Items requiring attention")}</p></div></div>
    <div className="rounded-xl border border-dashed border-[#C1B489] bg-[#F5F3EC]/70 px-5 py-7 text-center"><p className="text-sm font-bold text-[#111A18]">{t("لا توجد مهام عاجلة موثقة للعرض","No verified urgent tasks to display")}</p><p className="mt-2 text-xs leading-6 text-[#66736e]">{t("ستُعرض هنا المهام الفعلية عند توفرها من المصدر المصرح به.","Authorized tasks will appear here when available.")}</p></div>
    <Link href="/principal/assignments" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#08794F]">{t("فتح مركز التكليفات والمهام","Open assignments center")}<ArrowUpLeft size={16}/></Link>
   </section>
  </div>
  <section className="rounded-2xl border border-[#D4AF37]/30 bg-[#111A18] px-5 py-4 text-sm text-white/80"><div className="flex flex-wrap items-center justify-between gap-3"><span>{t("مؤشرات الأداء تعرض القيم الموثقة فقط؛ لا تُستخدم أرقام افتراضية.","Performance indicators display verified values only; no fabricated figures.")}</span><Link href="/principal/info-center" className="font-bold text-[#D4AF37]">{t("مركز المعلومات المدرسية","School Information Center")}</Link></div></section>
 </div>;
}
