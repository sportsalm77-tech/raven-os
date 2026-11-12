"use client";

import Link from "next/link";
import { ArrowUpLeft, ShieldCheck, type LucideIcon } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { PORTAL_NAVS, type PortalId } from "@/lib/nav";

const CONTENT: Record<PortalId, { eyebrowAr:string;eyebrowEn:string;titleAr:string;titleEn:string;descriptionAr:string;descriptionEn:string;statusAr:string;statusEn:string }> = {
 platform:{eyebrowAr:"إدارة المنصة",eyebrowEn:"PLATFORM ADMINISTRATION",titleAr:"لوحة القيادة التنفيذية",titleEn:"Executive Dashboard",descriptionAr:"إدارة منظومة رافين والجهات والحوكمة والصلاحيات من مركز قيادة موحد.",descriptionEn:"Lead Raven's organizations, governance and access from a unified command center.",statusAr:"المؤشرات التشغيلية لا تعرض أرقامًا دون مصدر موثوق.",statusEn:"Operational metrics require verified sources."},
 principal:{eyebrowAr:"القيادة المدرسية",eyebrowEn:"SCHOOL LEADERSHIP",titleAr:"لوحة القيادة التنفيذية",titleEn:"Executive Dashboard",descriptionAr:"نظرة مركزة على أداء المدرسة وأولويات العمل.",descriptionEn:"A focused view of school performance and priorities.",statusAr:"المؤشرات من مصدر المدرسة المعتمد فقط.",statusEn:"Only school-approved metrics are shown."},
 teacher:{eyebrowAr:"مساحة المعلم",eyebrowEn:"TEACHER WORKSPACE",titleAr:"لوحة المعلم اليومية",titleEn:"Teacher Dashboard",descriptionAr:"جدولي وفصولي ومهامي ومتابعة الطلاب في مساحة واحدة.",descriptionEn:"My timetable, classes, tasks and student follow-up in one workspace.",statusAr:"تظهر بيانات الفصول والطلاب بعد التحقق من إسناد المعلم.",statusEn:"Class and student data requires verified teacher assignments."},
 family:{eyebrowAr:"بوابة الأسرة",eyebrowEn:"FAMILY PORTAL",titleAr:"لوحة متابعة الأبناء",titleEn:"Family Dashboard",descriptionAr:"متابعة الأبناء والحضور والطلبات والتواصل مع المدرسة في مساحة آمنة.",descriptionEn:"Follow children, attendance, requests and school messages in one secure place.",statusAr:"لا تُعرض بيانات الأبناء إلا بعد التحقق من علاقة ولي الأمر.",statusEn:"Children's records require verified guardian relationships."}
};

export function PortalExecutiveHome({portal}:{portal:PortalId}) {
 const {isAr}=useLang();
 const copy=CONTENT[portal];
 const items=PORTAL_NAVS[portal].flatMap(group=>group.items).filter(item=>item.to!==`/${portal}`&&item.to!==`/${portal}/assistant`).slice(0,4);
 const t=(ar:string,en:string)=>isAr?ar:en;
 return <div className="space-y-6">
  <section className="rf-hero rounded-[28px] border border-[#D4AF37]/30 px-6 py-7 text-white md:px-8 md:py-9">
   <div className="relative z-10">
    <p className="mb-3 text-xs font-extrabold tracking-wider text-[#E8D6A5]">RAVEN OS · {t(copy.eyebrowAr,copy.eyebrowEn)}</p>
    <h1 className="text-2xl font-black leading-relaxed md:text-3xl">{t(copy.titleAr,copy.titleEn)}</h1>
    <p className="mt-3 max-w-2xl text-sm leading-8 text-white/90">{t(copy.descriptionAr,copy.descriptionEn)}</p>
   </div>
  </section>
  <section aria-label={t("المراكز الرئيسية","Primary centers")}>
   <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
    <h2 className="rf-section-title text-lg">{t("المراكز الرئيسية","Primary centers")}</h2>
    <span className="text-xs text-[#64736d]">{t(copy.statusAr,copy.statusEn)}</span>
   </div>
   <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    {items.map(item=>{const Icon:LucideIcon=item.icon;return <Link href={item.to} key={item.to} className="rf-card group flex min-h-40 flex-col p-5">
     <div className="mb-5 flex items-start justify-between"><span className="rf-icon"><Icon size={22}/></span><ArrowUpLeft size={17} className="text-[#8b977f] transition group-hover:text-[#08794F]"/></div>
     <strong className="text-sm font-black leading-7 text-[#111A18]">{t(item.ar,item.en)}</strong>
     <span className="mt-auto pt-3 text-xs font-bold text-[#08794F]">{t("فتح المركز","Open center")}</span>
    </Link>})}
   </div>
  </section>
  <div className="flex items-start gap-3 rounded-2xl border border-[#D4AF37]/30 bg-white px-4 py-3 text-xs leading-6 text-[#56645d]"><ShieldCheck size={19} className="mt-0.5 shrink-0 text-[#08794F]"/><span>{t(copy.statusAr,copy.statusEn)}</span></div>
 </div>;
}
