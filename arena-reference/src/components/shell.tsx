import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Search, Bell, ChevronDown, ChevronsUpDown, Menu, X, Languages, Check, LogOut, UserRound,
  Settings, AlertTriangle, Info, CheckCircle2, Sparkles, ChevronLeft, ChevronRight, FlaskConical,
} from 'lucide-react';
import { useLang } from '../lib/i18n';
import { PORTALS, PORTAL_NAVS, portalMeta, type PortalId } from '../lib/nav';
import { NOTIFICATIONS } from '../lib/data';
import { RavenMark } from './raven';

const kindIcon = { alert: AlertTriangle, info: Info, success: CheckCircle2, gold: Sparkles };
const kindTone = { alert: 'text-red-500 bg-red-50', info: 'text-deepblue bg-blue-soft', success: 'text-green-deep bg-green-soft', gold: 'text-gold-deep bg-gold-soft' };

export default function PortalShell({ portal, children }: { portal: PortalId; children: React.ReactNode }) {
  const { lang, dir, isAr, t, toggleLang } = useLang();
  const meta = portalMeta(portal);
  const nav = PORTAL_NAVS[portal];
  const [open, setOpen] = useState(false);
  const [switcher, setSwitcher] = useState(false);
  const [notif, setNotif] = useState(false);
  const [profile, setProfile] = useState(false);
  const [query, setQuery] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);
  const [readIds, setReadIds] = useState<number[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const switchRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setOpen(false); setNotif(false); setProfile(false); setSwitcher(false); setQuery(''); }, [location.pathname]);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!notifRef.current?.contains(e.target as Node)) setNotif(false);
      if (!profileRef.current?.contains(e.target as Node)) setProfile(false);
      if (!switchRef.current?.contains(e.target as Node)) setSwitcher(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const notes = NOTIFICATIONS[portal];
  const unread = notes.filter(n => !readIds.includes(n.id)).length;

  /* search filter across this portal's nav */
  const flat = useMemo(() => nav.flatMap(g => g.items.map(i => ({ ...i, group: isAr ? g.ar : g.en }))), [nav, isAr]);
  const results = query.trim()
    ? flat.filter(i => `${i.ar} ${i.en}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 7)
    : [];

  /* breadcrumb from current route */
  const current = flat.find(i => (i.end ? location.pathname === i.to : location.pathname.startsWith(i.to)));
  const Chev = dir === 'rtl' ? ChevronLeft : ChevronRight;

  const SidebarContent = (
    <div className="flex h-full flex-col">
      {/* Brand block */}
      <div className="px-5 pt-5 pb-4 border-b border-white/[0.07]">
        <div className="flex items-center gap-3">
          <RavenMark size={44} dark />
          <div className="min-w-0">
            <div className="font-en font-extrabold text-ivory text-[16px] leading-5 tracking-tight">RAVEN <span className="text-gold">OS</span></div>
            <div className="text-[9px] text-ivory/50 font-bold leading-4 mt-0.5">{isAr ? 'منصة رافين التعليمية' : 'Raven Educational Platform'}</div>
          </div>
        </div>
        {/* Portal badge */}
        <div className="mt-4 rounded-2xl border border-gold/25 bg-gradient-to-l from-gold/[0.13] to-transparent px-3.5 py-2.5 flex items-center gap-2.5">
          <span className="h-9 w-9 rounded-xl bg-gold flex items-center justify-center text-charcoal shrink-0"><meta.icon size={18} strokeWidth={2} /></span>
          <div className="min-w-0">
            <div className="text-[11.5px] font-black text-ivory leading-4 truncate">{isAr ? meta.ar : meta.en}</div>
            <div className="text-[9px] text-gold/90 font-bold mt-0.5 truncate">{isAr ? meta.userTitleAr : meta.userTitleEn}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-3 space-y-3.5" aria-label={isAr ? 'التنقل الرئيسي' : 'Main navigation'}>
        {nav.map(group => (
          <div key={group.ar}>
            <div className="px-3 mb-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-sand/60 font-en">{isAr ? group.ar : group.en}</div>
            <div className="space-y-0.5">
              {group.items.map(item => (
                <NavLink key={item.to} to={item.to} end={item.end}
                  className={({ isActive }) => `side-link ${isActive ? 'side-link-active' : ''}`}
                  title={isAr ? item.en : item.ar}>
                  <item.icon size={16} strokeWidth={1.9} className="shrink-0" />
                  <span className="truncate">{isAr ? item.ar : item.en}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Signature */}
      <div className="border-t border-white/[0.07] px-5 py-3">
        <div className="text-[9px] leading-4 text-ivory/45">
          <span className="text-gold font-bold">{isAr ? 'مؤسسة رافيين للخدمات التعليمية' : 'Rafeeen Foundation for Educational Services'}</span><br />
          {isAr ? 'نحن نصنع الفرق' : 'We Make the Difference'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full overflow-hidden bg-ivory flex" dir={dir}>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[268px] shrink-0 flex-col bg-charcoal relative">
        <div aria-hidden className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 15% 12%, #D4AF37 0, transparent 42%), radial-gradient(circle at 90% 85%, #08794F 0, transparent 40%)' }} />
        <div className="relative h-full">{SidebarContent}</div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 start-0 w-[280px] bg-charcoal shadow-2xl animate-[slideIn_.28s_ease]">
            <button className="absolute top-4 end-3 icon-btn !text-ivory/70 hover:!text-ivory hover:!bg-white/10" onClick={() => setOpen(false)} aria-label="close menu"><X size={20} /></button>
            <div className="h-full">{SidebarContent}</div>
          </aside>
          <style>{'@keyframes slideIn{from{transform:translateX(-30%);opacity:0}to{transform:none;opacity:1}}'}</style>
        </div>
      )}

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="h-16 shrink-0 bg-white/85 backdrop-blur-md border-b border-sand-soft flex items-center gap-2 px-3 sm:px-4 lg:px-5 relative z-30">
          <button className="icon-btn lg:hidden" onClick={() => setOpen(true)} aria-label="menu"><Menu size={21} /></button>

          {/* Portal switcher (visual demo) */}
          <div className="relative" ref={switchRef}>
            <button onClick={() => setSwitcher(v => !v)}
              className="flex items-center gap-2 h-10 ps-1.5 pe-2 sm:pe-2.5 rounded-xl border border-sand-soft hover:border-gold hover:bg-gold-soft/40 transition-all"
              aria-haspopup="listbox" aria-expanded={switcher}>
              <span className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: meta.accent }}>
                <meta.icon size={15} className="text-charcoal" strokeWidth={2.2} />
              </span>
              <span className="hidden md:block text-start leading-4">
                <span className="block text-[11px] font-black text-charcoal">{isAr ? meta.ar : meta.en}</span>
                <span className="block text-[8.5px] font-bold text-charcoal/50">{t('switchPortal')}</span>
              </span>
              <ChevronsUpDown size={14} className="text-charcoal/45" />
            </button>
            {switcher && (
              <div className="absolute top-12 start-0 w-[340px] max-w-[calc(100vw-24px)] raven-card !border-gold/40 p-2 z-50 shadow-2xl" role="listbox">
                <div className="flex items-center justify-between px-2 pt-1.5 pb-2 border-b border-sand-soft">
                  <span className="text-[10px] font-extrabold text-deepblue uppercase tracking-wide flex items-center gap-1.5"><FlaskConical size={11} /> {t('portalDemo')}</span>
                </div>
                {PORTALS.map(p => (
                  <button key={p.id} role="option" aria-selected={p.id === portal} onClick={() => navigate(p.to)}
                    className={`w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-start transition-colors ${p.id === portal ? 'bg-gold-soft/60' : 'hover:bg-ivory'}`}>
                    <span className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: p.accent }}>
                      <p.icon size={17} className="text-charcoal" strokeWidth={2} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11px] font-extrabold text-charcoal leading-4">{isAr ? p.ar : p.en}</span>
                      <span className="block text-[9px] text-charcoal/55 mt-0.5 truncate">{isAr ? p.userTitleAr : p.userTitleEn}</span>
                    </span>
                    {p.id === portal && <Check size={16} className="text-green-deep shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-md mx-auto hidden sm:block">
            <Search size={15} className="absolute top-1/2 -translate-y-1/2 start-3.5 text-charcoal/40 pointer-events-none" />
            <input value={query} onFocus={() => setSearchFocus(true)} onBlur={() => window.setTimeout(() => setSearchFocus(false), 180)}
              onChange={e => setQuery(e.target.value)} placeholder={t('search')} aria-label={t('search')}
              className="w-full h-10 ps-10 pe-4 rounded-xl border border-sand-soft bg-ivory/70 text-[12.5px] outline-none focus:border-green focus:bg-white focus:ring-2 focus:ring-green/15 transition-all" />
            {searchFocus && results.length > 0 && (
              <div className="absolute top-12 inset-x-0 raven-card p-1.5 z-50 shadow-2xl">
                {results.map(r => (
                  <button key={r.to} onMouseDown={() => navigate(r.to)}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-ivory text-start">
                    <r.icon size={15} className="text-green-deep shrink-0" />
                    <span className="text-[12px] font-bold text-charcoal flex-1 truncate">{isAr ? r.ar : r.en}</span>
                    <span className="text-[9px] text-charcoal/40 font-en truncate max-w-[110px]">{r.group}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1 sm:hidden" />

          {/* Actions */}
          <button className="icon-btn" onClick={toggleLang} title={isAr ? 'English' : 'العربية'} aria-label="toggle language">
            <Languages size={19} />
            <span className="absolute bottom-0.5 end-0.5 text-[7.5px] font-black text-green-deep font-en bg-green-soft rounded px-0.5">{lang === 'ar' ? 'EN' : 'ع'}</span>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button className="icon-btn" onClick={() => setNotif(v => !v)} aria-label={t('notifications')} aria-expanded={notif}>
              <Bell size={19} />
              {unread > 0 && <span className="absolute top-1.5 end-1.5 h-4.5 min-w-[18px] px-1 rounded-full bg-red-500 text-white text-[8.5px] font-black flex items-center justify-center border-2 border-white">{unread}</span>}
            </button>
            {notif && (
              <div className="absolute top-12 end-0 w-[380px] max-w-[calc(100vw-24px)] raven-card z-50 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-sand-soft bg-ivory/60">
                  <span className="text-[12px] font-black text-charcoal flex items-center gap-2"><Bell size={14} /> {t('notifications')} {unread > 0 && <span className="chip chip-red">{unread} {isAr ? 'جديدة' : 'new'}</span>}</span>
                  <button className="text-[10px] font-bold text-green-deep hover:underline" onClick={() => setReadIds(notes.map(n => n.id))}>{t('markAllRead')}</button>
                </div>
                <div className="max-h-[420px] overflow-y-auto scrollbar-thin divide-y divide-sand-soft/70">
                  {notes.map(n => {
                    const Ico = kindIcon[n.kind];
                    return (
                      <div key={n.id} className={`flex gap-2.5 px-4 py-2.5 hover:bg-ivory/70 transition-colors ${readIds.includes(n.id) ? 'opacity-55' : ''}`}>
                        <span className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${kindTone[n.kind]}`}><Ico size={15} /></span>
                        <div className="min-w-0">
                          <p className="text-[11px] leading-5 text-charcoal/90">{isAr ? n.ar : n.en}</p>
                          <span className="text-[9px] text-charcoal/45 font-bold">{isAr ? n.time : n.timeEn}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button onClick={() => setProfile(v => !v)} className="flex items-center gap-2 h-10 ps-1 pe-1.5 sm:pe-2 rounded-xl hover:bg-ivory transition-colors" aria-expanded={profile}>
              <span className="h-8 w-8 rounded-full bg-charcoal text-gold text-[11px] font-black flex items-center justify-center">{(isAr ? meta.userAr : meta.userEn).replace(/^(أ\.|م\.|أم|Mr\.|Ms\.|Mrs\.|Eng\.)\s*/,'').charAt(0)}</span>
              <span className="hidden xl:block text-start leading-4">
                <span className="block text-[11px] font-black text-charcoal max-w-[130px] truncate">{isAr ? meta.userAr : meta.userEn}</span>
                <span className="block text-[8.5px] text-green-deep font-bold">{isAr ? meta.roleAr : meta.roleEn}</span>
              </span>
              <ChevronDown size={14} className="text-charcoal/45 hidden sm:block" />
            </button>
            {profile && (
              <div className="absolute top-12 end-0 w-64 raven-card z-50 shadow-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-sand-soft bg-charcoal">
                  <div className="text-[12px] font-black text-ivory">{isAr ? meta.userAr : meta.userEn}</div>
                  <div className="text-[9.5px] text-gold font-bold mt-0.5">{isAr ? meta.userTitleAr : meta.userTitleEn}</div>
                  <div className="text-[8.5px] text-ivory/55 mt-1 leading-4">{meta.scopeAr}</div>
                </div>
                <div className="p-1.5">
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-bold text-charcoal/80 hover:bg-ivory" onClick={() => navigate(`${meta.to}/profile`)}><UserRound size={15} /> {t('myProfile')}</button>
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-bold text-charcoal/80 hover:bg-ivory" onClick={() => navigate(`${meta.to}/settings`)}><Settings size={15} /> {t('settings')}</button>
                  <div className="h-px bg-sand-soft my-1" />
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-bold text-red-700 hover:bg-red-50" onClick={() => navigate('/')}><LogOut size={15} /> {t('signOut')}</button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Breadcrumb strip */}
        <div className="h-9 shrink-0 bg-ivory border-b border-sand-soft/80 flex items-center gap-1.5 px-4 lg:px-6 text-[10.5px] font-bold text-charcoal/55 overflow-x-auto scrollbar-thin whitespace-nowrap">
          <Link to="/" className="hover:text-green-deep">{isAr ? 'رافين' : 'Raven'}</Link>
          <Chev size={12} className="shrink-0 text-sand" />
          <span className="text-charcoal/80">{isAr ? meta.ar : meta.en}</span>
          {current && <><Chev size={12} className="shrink-0 text-sand" /><span className="text-green-deep">{isAr ? current.ar : current.en}</span></>}
          <span className="hidden md:inline-flex ms-auto items-center gap-1.5 text-[9px] text-deepblue bg-blue-soft rounded-full px-2 py-0.5"><span className="h-1.5 w-1.5 rounded-full bg-green" />{t('verifiedAccess')}</span>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-[1500px] mx-auto p-4 sm:p-5 lg:p-6">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
