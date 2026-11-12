"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
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
export function PrincipalExecutiveDashboard() {
 const {isAr}=useLang();
 const t=(ar:string,en:string)=>isAr?ar:en;
 return <div className="space-y-6 pb-8">
  <section className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/30 bg-[#111A18] px-6 py-7 text-white md:px-8 md:py-9">
   <div className="pointer-events-none absolute -end-12 -top-20 h-52 w-52 rounded-full border-[35px] border-[#08794F]/25"/>
   <div className="relative">
    <p className="mb-3 text-xs font-bold tracking-widest text-[#D4AF37]">RAVEN OS · {t("القيادة المدرسية","SCHOOL LEADERSHIP")}</p>
    <h1 className="text-2xl font-black md:text-3xl">{t("لوحة القيادة التنفيذية","Executive Dashboard")}</h1>
    <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">{t("نظرة مركزة على أداء المدرسة وأولويات العمل، مع وصول سريع للمراكز التشغيلية من القائمة الجانبية.","A focused view of school performance and priorities, with direct access to operational centers from the sidebar.")}</p>
   </div>
  </section>
  <section aria-label={t("المؤشرات الرئيسية","Key performance indicators")}>
   <div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-base font-black text-[#111A18]">{t("المؤشرات الرئيسية","Key indicators")}</h2><span className="text-xs text-[#64736d]">{t("آخر بيانات معتمدة","Latest verified data")}</span></div>
   <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric)=>{const Icon=metric.icon;return <Link key={metric.path} href={metric.path} className="group rounded-2xl border border-[#111A18]/10 bg-white p-5 shadow-sm transition hover:border-[#08794F]/40 hover:shadow-md">
    <div className="mb-5 flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#08794F]/10 text-[#08794F]"><Icon size={21}/></span><ArrowUpLeft size={16} className="text-[#8b977f] transition group-hover:text-[#08794F]"/></div>
    <div className="text-sm font-bold text-[#111A18]">{t(metric.ar,metric.en)}</div>
    <div className="mt-2 text-3xl font-black tabular-nums text-[#111A18]" aria-label={t("لا توجد قيمة موثقة","No verified value")}>—</div>
    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E9E7DE]"><div className="h-full w-0 rounded-full bg-[#08794F]"/></div>
    <p className="mt-3 text-xs text-[#66736e]">{t(metric.descriptionAr,metric.descriptionEn)}</p>
   </Link>})}</div>
  </section>
  <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
   <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm md:p-6">
    <div className="mb-5 flex items-center justify-between gap-2"><div><h2 className="text-base font-black text-[#111A18]">{t("الإجراءات السريعة","Quick actions")}</h2><p className="mt-1 text-xs text-[#66736e]">{t("أهم مسارات العمل اليومية","Priority daily workflows")}</p></div><ClipboardCheck size={21} className="text-[#08794F]"/></div>
    <div className="grid gap-2 sm:grid-cols-2">{actions.map(a=>{const Icon=a.icon;return <Link href={a.to} key={a.to} className="flex items-center gap-3 rounded-xl border border-black/10 bg-[#F5F3EC]/60 p-4 text-sm font-bold text-[#111A18] transition hover:border-[#08794F]/40 hover:bg-[#08794F]/5"><Icon size={19} className="shrink-0 text-[#08794F]"/><span className="flex-1">{t(a.ar,a.en)}</span><ArrowUpLeft size={15} className="text-[#8b977f]"/></Link>})}</div>
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
