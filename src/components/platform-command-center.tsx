"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { PlatformLiveMetrics } from "@/components/platform-live-metrics";
import { Activity, BellRing, Building2, ChartNoAxesCombined, Cpu, FileCheck2, Headset, ScrollText, Settings2, ShieldCheck, Users, WalletCards, ArrowUpLeft } from "lucide-react";

const centers=[
 {ar:"مراقبة التشغيل",en:"Operations",href:"/platform/security",icon:Activity,subAr:"حالة الخدمات والأنظمة",subEn:"Services and system status"},
 {ar:"المدارس والمؤسسات",en:"Schools",href:"/platform/schools",icon:Building2,subAr:"الملفات والتفعيل",subEn:"Profiles and activation"},
 {ar:"المستخدمون والصلاحيات",en:"Users & roles",href:"/platform/users",icon:Users,subAr:"العضويات والتحكم بالوصول",subEn:"Memberships and access"},
 {ar:"الرسائل والتعاميم",en:"Communications",href:"/platform/communications",icon:BellRing,subAr:"التوزيع وسجلات التسليم",subEn:"Distribution and receipts"},
 {ar:"الدعم الفني",en:"Support",href:"/platform/support",icon:Headset,subAr:"التذاكر والردود",subEn:"Tickets and replies"},
 {ar:"الاشتراكات والباقات",en:"Subscriptions",href:"/platform/subscriptions",icon:WalletCards,subAr:"الباقات والصلاحية الزمنية",subEn:"Plans and expiry"},
 {ar:"الذكاء والتحليل",en:"Intelligence",href:"/platform/engines",icon:Cpu,subAr:"المحركات والتحليلات",subEn:"Engines and analytics"},
 {ar:"الأدلة والاعتماد",en:"Evidence",href:"/platform/evidence",icon:FileCheck2,subAr:"الشواهد والتقويم",subEn:"Evidence and evaluation"},
 {ar:"الحوكمة والتدقيق",en:"Governance",href:"/platform/roles",icon:ScrollText,subAr:"سجل التغييرات والسياسات",subEn:"Audit trail and policies"},
 {ar:"الإعدادات العامة",en:"Settings",href:"/platform/settings",icon:Settings2,subAr:"إعدادات المؤسسة",subEn:"Platform configuration"}
] as const;

export function PlatformCommandCenter(){
 const {isAr}=useLang();
 const t=(ar:string,en:string)=>isAr?ar:en;
 return <main className="space-y-5 pb-8">
  <header className="rf-hero relative overflow-hidden rounded-[24px] border border-[#D4AF37]/30 px-5 py-6 text-white md:px-8 md:py-8">
   <p className="text-xs font-bold tracking-wide text-[#E8D6A5]">RAVEN OS · {t("إدارة المنصة","Platform administration")}</p>
   <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
    <div><h1 className="text-xl font-black md:text-3xl">{t("لوحة القيادة التنفيذية","Executive command center")}</h1><p className="mt-2 text-xs leading-6 text-white/85 md:text-sm">{t("المؤشرات والمراكز والخدمات المؤسسية في مساحة عمل واحدة.","Institution-wide indicators, centers and services in one workspace.")}</p></div>
    <Link href="/platform/roles" className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-xs font-bold text-white"><ShieldCheck size={16}/>{t("الحوكمة","Governance")}</Link>
   </div>
  </header>
  <PlatformLiveMetrics />
  <section aria-label={t("مراكز المنصة","Platform centers")}>
   <div className="mb-3 flex items-center justify-between gap-2"><h2 className="text-lg font-black text-[#111A18]">{t("مراكز وخدمات المنصة","Platform centers & services")}</h2><span className="text-xs text-[#66736e]">{t("اختر المركز","Select a center")}</span></div>
   <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
    {centers.map(c=>{const Icon=c.icon;return <Link key={c.href} href={c.href} className="rf-card group flex min-h-[130px] flex-col items-start justify-between gap-2.5 rounded-2xl p-3.5 shadow-sm transition hover:border-[#08794F]/50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#08794F]">
      <div className="flex w-full items-start justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#08794F]/10 text-[#08794F]"><Icon size={19}/></span><ArrowUpLeft size={15} className="text-[#84918b] group-hover:text-[#08794F]"/></div>
      <div><h3 className="text-[12px] font-black leading-5 text-[#111A18] sm:text-sm">{t(c.ar,c.en)}</h3><p className="mt-1 text-[10px] leading-4 text-[#66736e] sm:text-xs">{t(c.subAr,c.subEn)}</p></div>
     </Link>})}
   </div>
  </section>
  <p className="flex items-start gap-2 text-xs leading-6 text-[#66736e]"><ChartNoAxesCombined size={16} className="mt-1 shrink-0 text-[#08794F]"/>{t("المؤشرات متصلة بمصادر البيانات المتاحة فقط. أي مؤشر بلا مصدر موثوق يظهر دون رقم، ولا تُعرض بيانات الطلاب الفردية هنا.","Metrics use available verified data only. Missing sources never display invented values, and student-level data is not shown here.")}</p>
 </main>;
}
