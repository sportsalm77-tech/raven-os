"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpLeft, ChevronDown, Search, ShieldCheck, type LucideIcon } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { PORTAL_NAVS, PORTAL_META, type PortalId } from "@/lib/nav";

export function PortalCenterDashboard({portal,index}:{portal:PortalId;index:number}) {
 const {isAr}=useLang();
 const [query,setQuery]=useState("");
 const group=PORTAL_NAVS[portal][index];
 if(!group)return null;
 const t=(ar:string,en:string)=>isAr?ar:en;
 const items=group.items.filter(item=>`${item.ar} ${item.en}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
 return <div className="space-y-6 pb-8">
  <section className="rf-hero rounded-[28px] border border-[#D4AF37]/30 px-6 py-7 text-white md:px-8 md:py-9">
   <p className="mb-3 text-xs font-bold tracking-widest text-[#E8D6A5]">RAVEN OS · {t(PORTAL_META[portal].ar,PORTAL_META[portal].en)}</p>
   <h1 className="text-2xl font-black md:text-3xl">{t(group.ar,group.en)}</h1>
   <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85">{t("لوحة مركزية للخدمات والمهام؛ اختر الخدمة لتفتح مساحة العمل الخاصة بها.","A focused center for services and tasks; select a service to open its dedicated workspace.")}</p>
  </section>
  <div className="grid gap-3 sm:grid-cols-3">
   <div className="rf-card p-5"><span className="text-xs text-[#66736e]">{t("الخدمات المسجلة","Registered services")}</span><strong className="mt-2 block text-2xl font-black text-[#08794F]">{group.items.length}</strong></div>
   <div className="rf-card p-5"><span className="text-xs text-[#66736e]">{t("المهام قيد المتابعة","Pending tasks")}</span><strong className="mt-2 block text-2xl font-black text-[#111A18]">—</strong><p className="mt-1 text-xs text-[#66736e]">{t("بانتظار مصدر معتمد","Awaiting verified source")}</p></div>
   <div className="rf-card p-5"><span className="text-xs text-[#66736e]">{t("مؤشرات الأداء","Performance indicators")}</span><strong className="mt-2 block text-2xl font-black text-[#111A18]">—</strong><p className="mt-1 text-xs text-[#66736e]">{t("لا توجد بيانات موثقة","No verified data")}</p></div>
  </div>
  <section className="rf-panel p-5 md:p-6">
   <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-lg font-black text-[#111A18]">{t("خدمات المركز","Center services")}</h2><p className="mt-1 text-xs text-[#66736e]">{t("بطاقات ثابتة للوصول المباشر إلى محركات العمل الموجودة.","Direct links to the existing service workspaces.")}</p></div><label className="flex items-center gap-2 rounded-xl border border-[#08794F]/20 bg-white px-3 py-2"><Search size={16} className="text-[#08794F]"/><input type="search" value={query} onChange={e=>setQuery(e.target.value)} aria-label={t("البحث في خدمات المركز","Search center services")} placeholder={t("ابحث عن خدمة...","Search services...")} className="w-44 bg-transparent text-sm text-[#111A18] outline-none"/></label></div>
   <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{items.map(item=>{const Icon:LucideIcon=item.icon;return <Link href={item.to} key={item.to} className="rf-card group flex min-h-36 flex-col p-5"><div className="mb-5 flex items-start justify-between"><span className="rf-icon"><Icon size={21}/></span><ArrowUpLeft size={17} className="text-[#8b977f] group-hover:text-[#08794F]"/></div><strong className="text-sm font-black text-[#111A18]">{t(item.ar,item.en)}</strong><span className="mt-auto pt-3 text-xs font-bold text-[#08794F]">{t("فتح مساحة الخدمة","Open service workspace")}</span></Link>})}</div>
   {items.length===0&&<p role="status" className="rounded-xl bg-[#F5F3EC] p-5 text-sm text-[#53615b]">{t("لا توجد خدمات مطابقة.","No matching services.")}</p>}
  </section>
  <div className="flex items-center gap-2 rounded-2xl border border-[#D4AF37]/30 bg-white p-4 text-xs leading-6 text-[#53615b]"><ShieldCheck size={18} className="shrink-0 text-[#08794F]"/>{t("عرض الخدمات لا يعني تفعيل تكاملاتها أو منح صلاحيات إضافية. تعتمد العمليات على مصدر البيانات والتفويض الفعلي.","Service visibility does not activate integrations or grant extra permissions. Operations require verified data and authorization.")}</div>
  <Link href={`/${portal}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#08794F]"><ChevronDown size={16} className="rotate-90"/>{t("العودة إلى لوحة البوابة","Back to portal dashboard")}</Link>
 </div>;
}
