"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Languages, Menu, X } from "lucide-react";
import { PORTAL_META, PORTAL_NAVS, type PortalId } from "@/lib/nav";

export function PortalShell({ portal, children }: { portal: PortalId; children: React.ReactNode }) {
  const pathname = usePathname();
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAr = lang === "ar";
  const direction = isAr ? "rtl" : "ltr";
  const meta = PORTAL_META[portal];
  const groups = PORTAL_NAVS[portal];
  const BackIcon = isAr ? ChevronLeft : ChevronRight;

  const navigation = (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-5 py-5">
        <Link href="/" className="flex items-center gap-3 text-white">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#08794F] font-black text-xl">ر</span>
          <span><strong className="block tracking-wide">RAVEN OS</strong><small className="text-white/60">{isAr ? "منصة رافين التعليمية" : "Raven Educational Platform"}</small></span>
        </Link>
        <div className="mt-5 rounded-xl border border-[#D4AF37]/30 bg-white/5 p-3">
          <div className="text-xs text-[#D4AF37]">{isAr ? "البوابة الحالية" : "CURRENT PORTAL"}</div>
          <div className="mt-1 font-bold text-white">{isAr ? meta.ar : meta.en}</div>
          <div className="text-xs text-white/55">{isAr ? meta.roleAr : meta.roleEn}</div>
        </div>
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4" aria-label={isAr ? "التنقل الرئيسي" : "Main navigation"}>
        {groups.map(group => <section key={group.ar}>
          <h2 className="mb-2 px-3 text-[10px] font-bold text-[#C1B489]">{isAr ? group.ar : group.en}</h2>
          <div className="space-y-1">{group.items.map(item => {
            const active = item.end ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return <Link key={item.to} href={item.to} onClick={() => setMobileOpen(false)}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${active ? "bg-[#08794F] text-white font-bold" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
              <Icon size={17} /><span>{isAr ? item.ar : item.en}</span>
            </Link>;
          })}</div>
        </section>)}
      </nav>
      <div className="border-t border-white/10 px-5 py-4 text-[10px] leading-5 text-white/55">
        <strong className="block text-[#D4AF37]">{isAr ? "مؤسسة رافيين للخدمات التعليمية" : "Rafeeen Foundation for Educational Services"}</strong>
        {isAr ? "نحن نصنع الفرق" : "We Make the Difference"}
      </div>
    </div>
  );

  return <div className="min-h-screen bg-[#F5F3EC]" dir={direction}>
    <aside className="fixed inset-y-0 start-0 z-30 hidden w-[270px] flex-col bg-[#111A18] lg:flex">{navigation}</aside>
    {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden">
      <button aria-label="Close navigation" className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
      <aside className="absolute inset-y-0 start-0 w-[290px] bg-[#111A18] shadow-2xl">{navigation}
        <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="absolute end-3 top-3 rounded-lg p-2 text-white"><X size={19}/></button>
      </aside>
    </div>}
    <div className="min-h-screen lg:ms-[270px]">
      <header className="sticky top-0 z-20 flex min-h-[68px] items-center justify-between border-b border-black/10 bg-[#F5F3EC]/95 px-4 backdrop-blur md:px-7">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="rounded-lg border border-black/10 p-2 lg:hidden" aria-label="Open navigation"><Menu size={19}/></button>
          <div><div className="text-xs text-[#08794F]">{isAr ? "منظومة رافين التعليمية" : "Raven Educational System"}</div><div className="font-extrabold">{isAr ? meta.ar : meta.en}</div></div>
        </div>
        <button onClick={() => setLang(isAr ? "en" : "ar")} className="inline-flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm font-bold" aria-label="Change language"><Languages size={16}/>{isAr ? "English" : "العربية"}</button>
      </header>
      <main className="px-4 py-7 md:px-7 md:py-9">
        <div className="mb-5 flex items-center gap-2 text-xs text-[#66736e]"><Link href="/" className="hover:text-[#08794F]">{isAr ? "الرئيسية" : "Home"}</Link><BackIcon size={13}/><span>{isAr ? meta.ar : meta.en}</span></div>
        {children}
        <div className="mt-8 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs leading-6 text-amber-900">
          {isAr ? "نسخة إنقاذ تجريبية: هذه الواجهة لا تملك مصادقة أو صلاحيات خادمية أو اتصالًا ببيانات المدارس حتى الآن. لا تدخل بيانات حقيقية." : "Rescue preview: server authentication, authorization, and school data services are not connected. Do not enter real data."}
        </div>
      </main>
    </div>
  </div>;
}
