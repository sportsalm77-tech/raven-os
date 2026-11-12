"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { useLang } from "@/lib/i18n";
import { ChevronDown, ChevronLeft, ChevronRight, Languages, Menu, Search, X } from "lucide-react";
import { PORTAL_META, PORTAL_NAVS, type PortalId } from "@/lib/nav";
import { PortalReadinessPanel } from "@/components/portal-readiness-panel";

export function PortalShell({ portal, children }: { portal: PortalId; children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAr, toggleLang } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const groups = PORTAL_NAVS[portal];
  const [expandedGroups, setExpandedGroups] = useState<string[]>(() => portal === "principal" ? groups.map(group => group.ar) : []);
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);
  const [navQuery, setNavQuery] = useState("");
  const filteredGroups = useMemo(() => {
    const query = navQuery.trim().toLocaleLowerCase();
    if (!query) return groups;
    return groups.map(group => ({
      ...group,
      items: group.items.filter(item => `${item.ar} ${item.en}`.toLocaleLowerCase().includes(query)),
    })).filter(group => group.items.length > 0);
  }, [groups, navQuery]);
  const direction = isAr ? "rtl" : "ltr";
  const meta = PORTAL_META[portal];
  const BackIcon = isAr ? ChevronLeft : ChevronRight;

  const toggleGroup = (groupName: string) => {
    const isOpen = expandedGroups.includes(groupName) || (
      !collapsedGroups.includes(groupName) &&
      !!groups.find(group => group.ar === groupName)?.items.some(item =>
        item.end ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/")
      )
    );
    if (isOpen) {
      setExpandedGroups(current => current.filter(name => name !== groupName));
      setCollapsedGroups(current => current.includes(groupName) ? current : [...current, groupName]);
    } else {
      setCollapsedGroups(current => current.filter(name => name !== groupName));
      setExpandedGroups(current => current.includes(groupName) ? current : [...current, groupName]);
    }
  };

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
      <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-4" aria-label={isAr ? "التنقل الرئيسي" : "Main navigation"}>
        <label className="relative mb-3 block">
          <Search size={16} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input value={navQuery} onChange={event => setNavQuery(event.target.value)}
            placeholder={isAr ? "ابحث في أقسام البوابة..." : "Search portal sections..."}
            aria-label={isAr ? "البحث في أقسام البوابة" : "Search portal sections"}
            className="h-10 w-full rounded-xl border border-white/10 bg-white/5 ps-9 pe-3 text-xs text-white outline-none placeholder:text-white/40 focus:border-[#D4AF37]/60 focus:bg-white/10" />
        </label>
        {filteredGroups.length === 0 && <p className="rounded-lg px-3 py-4 text-center text-xs text-white/50">{isAr ? "لا توجد أقسام مطابقة" : "No matching sections"}</p>}
        {filteredGroups.map(group => {
          const groupHasActive = group.items.some(item => item.end
            ? pathname === item.to
            : pathname === item.to || pathname.startsWith(item.to + "/"));
          const expanded = !!navQuery.trim() || expandedGroups.includes(group.ar) || (groupHasActive && !collapsedGroups.includes(group.ar));
          return <section key={group.ar} className="rounded-xl">
            <button type="button" onClick={() => toggleGroup(group.ar)} aria-expanded={expanded} aria-controls={`portal-group-${portal}-${encodeURIComponent(group.ar)}`}
              className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-start text-xs font-bold transition-colors ${groupHasActive ? "bg-white/10 text-white" : "text-[#C1B489] hover:bg-white/5 hover:text-white"}`}>
              <span>{isAr ? group.ar : group.en}</span>
              <ChevronDown size={16} className={`shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
            </button>
            {expanded && <div id={`portal-group-${portal}-${encodeURIComponent(group.ar)}`} className="mt-1 space-y-1 border-s border-white/10 py-1 ps-2">
              {group.items.map(item => {
                const active = item.end ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
                const Icon = item.icon;
                return <Link key={item.to} href={item.to} onClick={() => { setMobileOpen(false); setNavQuery(""); }} aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${active ? "bg-[#08794F] font-bold text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
                  <Icon size={17} /><span>{isAr ? item.ar : item.en}</span>
                </Link>;
              })}
            </div>}
          </section>;
        })}
      </nav>
      <div className="border-t border-white/10 px-5 py-4 text-[10px] leading-5 text-white/55">
        <strong className="block text-[#D4AF37]">{isAr ? "مؤسسة رافين للخدمات التعليمية" : "Rafeeen Foundation for Educational Services"}</strong>
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
      <a href="#portal-main-content" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-2 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-[#08794F]">{isAr?"تخطي إلى المحتوى الرئيسي":"Skip to main content"}</a>
      <header className="sticky top-0 z-20 flex min-h-[68px] items-center justify-between border-b border-black/10 bg-[#F5F3EC]/95 px-4 backdrop-blur md:px-7">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="rounded-lg border border-black/10 p-2 lg:hidden" aria-label="Open navigation"><Menu size={19}/></button>
          <div><div className="text-xs text-[#08794F]">{isAr ? "منظومة رافين التعليمية" : "Raven Educational System"}</div><div className="font-extrabold">{isAr ? meta.ar : meta.en}</div></div>
        </div>
        <button onClick={toggleLang} className="inline-flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm font-bold" aria-label="Change language"><Languages size={16}/>{isAr ? "English" : "العربية"}</button>
      </header>
      <main id="portal-main-content" tabIndex={-1} className="px-4 py-7 md:px-7 md:py-9">
        <div className="mb-5 flex items-center gap-2 text-xs text-[#66736e]"><Link href="/" className="hover:text-[#08794F]">{isAr ? "الرئيسية" : "Home"}</Link><BackIcon size={13}/><span>{isAr ? meta.ar : meta.en}</span></div>
        {children}
        <PortalReadinessPanel portal={portal} />
        <div className="mt-8 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs leading-6 text-amber-900">
          {isAr ? "نسخة إنقاذ تجريبية: هذه الواجهة لا تملك مصادقة أو صلاحيات خادمية أو اتصالًا ببيانات المدارس حتى الآن. لا تدخل بيانات حقيقية." : "Rescue preview: server authentication, authorization, and school data services are not connected. Do not enter real data."}
        </div>
      </main>
    </div>
  </div>;
}
