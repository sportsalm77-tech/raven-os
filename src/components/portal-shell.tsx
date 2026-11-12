"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { useLang } from "@/lib/i18n";
import { ChevronDown, ChevronLeft, ChevronRight, House, LayoutGrid, Languages, Menu, Search, X } from "lucide-react";
import { PORTAL_META, PORTAL_NAVS, type PortalId } from "@/lib/nav";

export function PortalShell({ portal, children }: { portal: PortalId; children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAr, toggleLang } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const groups = PORTAL_NAVS[portal];
  const [expandedGroups, setExpandedGroups] = useState<string[]>(() => []);
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
  const mobilePrimary = groups.flatMap(group => group.items).filter(item => item.to !== `/${portal}`).slice(0, 2);
  const principalNav = portal === "principal";

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
          <span className="rf-brand-mark font-black text-xl">ر</span>
          <span><strong className="block tracking-wide">RAVEN OS</strong><small className="text-white/60">{isAr ? "منصة رافين التعليمية" : "Raven Educational Platform"}</small></span>
        </Link>
        <div className="mt-5 rounded-2xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 p-4 shadow-inner">
          <div className="text-xs text-[#D4AF37]">{isAr ? "البوابة الحالية" : "CURRENT PORTAL"}</div>
          <div className="mt-1 font-bold text-white">{isAr ? meta.ar : meta.en}</div>
          <div className="text-xs text-white/55">{isAr ? meta.roleAr : meta.roleEn}</div>
        </div>
      </div>
      <nav className="rf-sidebar-nav flex-1 space-y-2 overflow-y-auto px-3 py-4" aria-label={isAr ? "التنقل الرئيسي" : "Main navigation"}>
        <label className="relative mb-3 block">
          <Search size={16} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input value={navQuery} onChange={event => setNavQuery(event.target.value)}
            placeholder={isAr ? "ابحث في أقسام البوابة..." : "Search portal sections..."}
            aria-label={isAr ? "البحث في أقسام البوابة" : "Search portal sections"}
            className="h-10 w-full rounded-xl border border-white/10 bg-white/5 ps-9 pe-3 text-xs text-white outline-none placeholder:text-white/40 focus:border-[#D4AF37]/60 focus:bg-white/10" />
        </label>
        {principalNav && <div className="mb-3 flex items-center justify-between gap-2 border-b border-[#D4AF37]/20 pb-3 px-2"><span className="text-xs font-black tracking-wide text-[#E8D6A5]">{isAr?"المراكز الإدارية":"ADMINISTRATIVE CENTERS"}</span><span className="rounded-full border border-[#D4AF37]/35 px-2 py-0.5 text-[10px] font-bold text-[#D4AF37]">{groups.length}</span></div>}
        {filteredGroups.length === 0 && <p className="rounded-lg px-3 py-4 text-center text-xs text-white/50">{isAr ? "لا توجد أقسام مطابقة" : "No matching sections"}</p>}
        {filteredGroups.map((group,groupIndex) => {
          const groupHasActive = group.items.some(item => item.end
            ? pathname === item.to
            : pathname === item.to || pathname.startsWith(item.to + "/"));
          const expanded = !!navQuery.trim() || expandedGroups.includes(group.ar) || (groupHasActive && !collapsedGroups.includes(group.ar));
          return <section key={group.ar} className={`rounded-2xl border transition-colors ${principalNav ? (groupHasActive ? "border-[#D4AF37]/50 bg-white/10" : "border-white/10 bg-white/[.035] hover:border-[#D4AF37]/25") : "border-transparent"}`}>
            <button type="button" onClick={() => toggleGroup(group.ar)} aria-expanded={expanded} aria-controls={`portal-group-${portal}-${encodeURIComponent(group.ar)}`}
              className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-start text-xs font-bold transition-colors ${groupHasActive ? "text-[#F2D78E]" : "text-[#E5E7DE] hover:bg-white/5 hover:text-white"}`}>
              <span className="flex min-w-0 items-center gap-2.5">{principalNav && <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[11px] font-black text-[#E8D6A5]">{String(groupIndex+1).padStart(2,"0")}</span>}<span className="leading-5">{isAr ? group.ar : group.en}</span></span>
              <ChevronDown size={16} className={`shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
            </button>
            {expanded && <div id={`portal-group-${portal}-${encodeURIComponent(group.ar)}`} className="mx-2 mb-2 mt-1 space-y-1 border-s border-[#D4AF37]/30 py-1 ps-2">
              {group.items.map(item => {
                const active = item.end ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
                const Icon = item.icon;
                return <Link key={item.to} href={item.to} onClick={() => { setMobileOpen(false); setNavQuery(""); }} aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${active ? "border border-[#D4AF37]/45 bg-[#08794F] font-bold text-white shadow-sm" : "text-white/75 hover:bg-[#08794F]/25 hover:text-white"}`}>
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

  return <div className="raven-workspace rf-surface min-h-screen" dir={direction}>
    <aside className="rf-portal-sidebar fixed inset-y-0 start-0 z-30 hidden w-[300px] flex-col lg:flex">{navigation}</aside>
    {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden">
      <button aria-label="Close navigation" className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
      <aside className="rf-portal-sidebar absolute inset-y-0 start-0 w-[290px] shadow-2xl">{navigation}
        <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="absolute end-3 top-3 rounded-lg p-2 text-white"><X size={19}/></button>
      </aside>
    </div>}
    <div className="min-h-screen lg:ms-[300px]">
      <a href="#portal-main-content" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-2 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-[#08794F]">{isAr?"تخطي إلى المحتوى الرئيسي":"Skip to main content"}</a>
      <header className="rf-portal-top sticky top-0 z-20 flex min-h-[68px] items-center justify-between px-4 backdrop-blur md:px-7">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="rounded-lg border border-black/10 p-2 lg:hidden" aria-label="Open navigation"><Menu size={19}/></button>
          <div><div className="text-xs text-[#08794F]">{isAr ? "منظومة رافين التعليمية" : "Raven Educational System"}</div><div className="font-extrabold text-[#111A18]">{isAr ? meta.ar : meta.en}</div></div>
        </div>
        <button onClick={toggleLang} className="inline-flex items-center gap-2 rounded-lg border border-[#08794F]/30 px-3 py-2 text-sm font-bold text-[#08794F]" aria-label="Change language"><Languages size={16}/>{isAr ? "English" : "العربية"}</button>
      </header>
      <main id="portal-main-content" tabIndex={-1} className="raven-content px-4 pb-28 pt-6 md:px-7 md:py-9 lg:pb-9">
        <div className="mb-5 flex items-center gap-2 text-xs text-[#66736e]"><Link href="/" className="hover:text-[#08794F]">{isAr ? "الرئيسية" : "Home"}</Link><BackIcon size={13}/><span>{isAr ? meta.ar : meta.en}</span></div>
        {children}

      </main>
    </div>
    <nav className="rf-mobile-nav fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 items-stretch gap-1 px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 lg:hidden" aria-label={isAr?"تنقل التطبيق":"App navigation"}>
      <Link href={`/${portal}`} aria-current={pathname===`/${portal}`?"page":undefined} className={`rf-mobile-tab ${pathname===`/${portal}`?"rf-mobile-tab-active":""}`}><House size={21}/><span>{isAr?"الرئيسية":"Home"}</span></Link>
      {mobilePrimary.map((item,index)=>{const Icon=item.icon;const active=pathname===item.to||pathname.startsWith(item.to+"/");return <Link key={item.to} href={item.to} aria-current={active?"page":undefined} className={`rf-mobile-tab ${active?"rf-mobile-tab-active":""}`}><Icon size={21}/><span className="truncate max-w-full">{isAr?item.ar:item.en}</span></Link>})}
      {mobilePrimary.length<2&&<Link href={`/${portal}`} className="rf-mobile-tab"><LayoutGrid size={21}/><span>{isAr?"الأقسام":"Sections"}</span></Link>}
      <button type="button" onClick={()=>setMobileOpen(true)} aria-label={isAr?"جميع المراكز والأقسام":"All sections"} aria-expanded={mobileOpen} className="rf-mobile-tab"><Menu size={22}/><span>{isAr?"المزيد":"More"}</span></button>
    </nav>
  </div>;
}
