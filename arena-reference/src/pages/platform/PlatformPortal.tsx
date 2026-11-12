import { useEffect, useMemo, useRef, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, ShieldCheck, HeartPulse, Settings, Search, Plus, Mail,
  ShieldEllipsis, Crown, UserCog, Check, X, Ban, RefreshCw, Server, Database, Lock, Globe,
  Languages, Palette, BellRing, KeyRound, ToggleLeft, ToggleRight, FileWarning, ScrollText,
  Activity, ChevronRight, Building, Zap, AlertTriangle, CheckCircle2, Wifi, Save,
} from 'lucide-react';
import { useLang, L } from '../../lib/i18n';
import {
  SCHOOLS, PLATFORM_USERS, AUDIT_LOGS, HEALTH_STATS,
} from '../../lib/data';
import {
  PageHead, KpiCard, CardTitle, TableShell, StatusDot, SampleBadge, Modal, EmptyState,
  useToasts, Toaster, ProgressBar, Donut, BusyButton, useAsyncAction, SearchInput,
} from '../../components/raven';

const toneSev = { high: 'chip-red', medium: 'chip-gold', info: 'chip-blue' } as const;

/* ════════════════ 1 · نظرة عامة على المنصة ════════════════ */
function Overview() {
  const { isAr } = useLang();
  const navigate = useNavigate();
  const { toasts, push } = useToasts();
  const active = SCHOOLS.filter(s => s.status === 'active').length;
  const attention = SCHOOLS.filter(s => s.status === 'attention').length;
  return (
    <div>
      <PageHead icon={LayoutDashboard} eyebrow={isAr ? 'بوابة مدير المنصة — الإدارة العامة' : 'PLATFORM MANAGER PORTAL'}
        title={isAr ? 'نظرة عامة على المنصة' : 'Platform Overview'}
        desc={isAr ? 'صحة المستأجرين، النشاط المدرسي، والتنبيهات عبر منظومة رافيين — من تشغيل واحد.' : 'Tenant health, school activity and alerts across the Rafeeen ecosystem — from one control plane.'}
        actions={<><SampleBadge /><button className="btn btn-outline !h-9" onClick={() => push(isAr ? 'تم تحديث لقطة المنصة الآن' : 'Platform snapshot refreshed', 'info')}><RefreshCw size={14} />{isAr ? 'تحديث' : 'Refresh'}</button></>} />

      {/* Platform Owner vs Admin banner */}
      <div className="raven-card mb-4 overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="flex items-center gap-3 px-5 py-3.5 bg-charcoal">
            <span className="h-11 w-11 rounded-2xl bg-gold flex items-center justify-center shrink-0"><Crown size={21} className="text-charcoal" /></span>
            <div>
              <div className="text-[12px] font-black text-gold">{isAr ? 'مالك المنصة — Platform Owner' : 'Platform Owner'}</div>
              <div className="text-[9.5px] text-ivory/60 leading-4 mt-0.5">{isAr ? 'دخول كامل: الفوترة والصلاحيات الجذرية والإعدادات العالمية ونقاط الإيقاف الطارئ' : 'Full access: billing, root permissions, global config & emergency stop switches'}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-3.5 border-s border-gold/20">
            <span className="h-11 w-11 rounded-2xl bg-blue-soft flex items-center justify-center shrink-0"><UserCog size={21} className="text-deepblue" /></span>
            <div>
              <div className="text-[12px] font-black text-deepblue">{isAr ? 'مدير المنصة — Platform Admin' : 'Platform Admin'}</div>
              <div className="text-[9.5px] text-charcoal/60 leading-4 mt-0.5">{isAr ? 'تشغيل ودعم: المدارس والمستخدمون والصحة التقنية — بدون فوترة أو صلاحيات جذرية' : 'Operations & support: schools, users, tech health — no billing or root permission changes'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard tone="charcoal" icon={Building2} label={isAr ? 'مدارس مستضافة' : 'Hosted schools'} value="6" unit={isAr ? 'مستأجر' : 'tenants'} foot={<span className="!text-gold/80">{active} {isAr ? 'نشطة' : 'active'} · {attention} {isAr ? 'تحتاج تدخلاً' : 'need attention'}</span>} />
        <KpiCard tone="green" icon={Users} label={isAr ? 'مستخدمون فعّالون' : 'Active users'} value="2,140" delta={4.6} foot={isAr ? '+94 هذا الشهر' : '+94 this month'} />
        <KpiCard tone="gold" icon={Activity} label={isAr ? 'التوفرية الشهرية' : 'Monthly uptime'} value="99.98%" foot="SLA · target 99.9%" />
        <KpiCard tone="blue" icon={Zap} label={isAr ? 'طلبات اليوم' : 'Requests today'} value="1.28M" foot={isAr ? 'ذروة 09:40 ص — 3,412 ط/ث' : 'Peak 09:40 — 3,412 rps'} />
      </div>

      <div className="grid xl:grid-cols-3 gap-4 mt-4">
        {/* Schools activity */}
        <div className="raven-card xl:col-span-2 overflow-hidden">
          <CardTitle title={isAr ? 'نشاط المدارس — الحالة اللحظية' : 'Schools Activity — Live Status'} sub={isAr ? 'انقر مدرسة للانتقال إلى ملفها' : 'Click a school to open its profile'}
            action={<button className="text-[10.5px] font-bold text-green-deep hover:underline" onClick={() => navigate('/platform/schools')}>{isAr ? 'إدارة المدارس' : 'Manage schools'} ←</button>} />
          <div className="divide-y divide-sand-soft/70">
            {SCHOOLS.map(s => (
              <button key={s.id} onClick={() => navigate('/platform/schools')} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-ivory/70 text-start transition-colors">
                <span className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${s.status === 'active' ? 'bg-green-soft text-green-deep' : 'bg-gold-soft text-gold-deep'}`}><Building size={17} /></span>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-extrabold text-charcoal truncate">{isAr ? s.nameAr : s.nameEn}</div>
                  <div className="text-[9.5px] text-charcoal/55">{s.students} {isAr ? 'طالب' : 'students'} · {s.teachers} {isAr ? 'معلم' : 'teachers'} · {isAr ? s.city : s.cityEn} · {s.platform}</div>
                </div>
                <div className="hidden sm:block w-28">
                  <div className="flex justify-between text-[8.5px] font-bold text-charcoal/50 mb-1"><span>{isAr ? 'الصحة' : 'Health'}</span><span className="font-en">{s.health}</span></div>
                  <ProgressBar value={s.health} tone={s.health > 85 ? 'green' : s.health > 75 ? 'gold' : 'red'} />
                </div>
                <span className={`chip ${s.status === 'active' ? 'chip-green' : 'chip-gold'}`}>{s.status === 'active' ? (isAr ? 'نشطة' : 'Active') : (isAr ? 'انتباه' : 'Attention')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="raven-card overflow-hidden">
          <CardTitle title={isAr ? 'تنبيهات المنصة' : 'Platform Alerts'} sub={isAr ? 'مرتبة حسب الخطورة' : 'Sorted by severity'}
            action={<span className="chip chip-red">{isAr ? '2 حرجة' : '2 critical'}</span>} />
          <div className="p-4 space-y-2.5">
            {[
              { sev: 'high' as const, ar: 'مدرسة القمم: انخفاض الحضور إلى 88.6% — اقتراح «خطة تدخل» جاهزة للاعتماد', en: 'Al-Qimam: attendance at 88.6% — “Intervention Plan” ready for sign-off', act: isAr ? 'اعتماد الخطة' : 'Approve plan' },
              { sev: 'high' as const, ar: 'محاولة دخول فاشلة متكررة من جدة — IP 185.220.xx.xx (تم الحظر التلقائي)', en: 'Repeated failed login from Jeddah — IP blocked automatically', act: isAr ? 'عرض السجل' : 'View log' },
              { sev: 'medium' as const, ar: 'مدرسة القمم تعمل على إصدار قديم v4.1.8 — التحديث مؤجل من الإدارة', en: 'Al-Qimam on legacy v4.1.8 — upgrade deferred by admin', act: isAr ? 'جدولة التحديث' : 'Schedule upgrade' },
            ].map((a, i) => (
              <div key={i} className={`rounded-2xl border p-3 ${a.sev === 'high' ? 'border-red-200 bg-red-50/50' : 'border-gold/40 bg-gold-soft/40'}`}>
                <div className="flex items-start gap-2">
                  <AlertTriangle size={15} className={`${a.sev === 'high' ? 'text-red-500' : 'text-gold-deep'} shrink-0 mt-0.5`} />
                  <div className="min-w-0">
                    <p className="text-[10.5px] leading-5 text-charcoal/90">{isAr ? a.ar : a.en}</p>
                    <button className="mt-1.5 text-[9.5px] font-extrabold text-deepblue hover:underline" onClick={() => push(isAr ? 'تم إرسال الأمر إلى فريق التشغيل' : 'Command dispatched to ops team', 'info')}>{a.act} ←</button>
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full text-[10.5px] font-bold text-charcoal/60 hover:text-charcoal py-1.5" onClick={() => navigate('/platform/security')}>{isAr ? 'عرض كل التنبيهات — الصحة التقنية والأمان ←' : 'View all alerts — Tech Health & Security ←'}</button>
          </div>
        </div>
      </div>
      <Toaster toasts={toasts} />
    </div>
  );
}

/* ════════════════ 2 · إدارة المدارس والمؤسسات ════════════════ */
function Schools() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState<string | null>(null);
  const [onboard, setOnboard] = useState(false);
  const [busy, run] = useAsyncAction(1500);
  const filtered = SCHOOLS.filter(s => !query || `${s.nameAr} ${s.nameEn} ${s.city} ${s.id}`.toLowerCase().includes(query.toLowerCase()));
  const school = SCHOOLS.find(s => s.id === sel);
  const [form, setForm] = useState({ name: '', city: '', students: '', plan: 'الخطة الفضية' });

  return (
    <div>
      <PageHead icon={Building2} eyebrow={isAr ? 'المستأجرون — Multi-Tenant' : 'TENANTS'}
        title={isAr ? 'إدارة المدارس والمؤسسات' : 'Schools & Institutions'}
        desc={isAr ? 'ملفات المستأجرين، التفعيل، والإعداد — كل مدرسة بيئة معزولة ببياناتها وإعداداتها.' : 'Tenant profiles, activation and configuration — each school is an isolated environment.'}
        actions={<><SampleBadge /><button className="btn btn-primary !h-9" onClick={() => setOnboard(true)}><Plus size={15} />{isAr ? 'إضافة مدرسة' : 'Onboard School'}</button></>} />

      <div className="raven-card overflow-hidden">
        <CardTitle title={isAr ? 'المستأجرون النشطون على المنصة' : 'Active Tenants'} sub={`${filtered.length} / ${SCHOOLS.length}`}
          action={<SearchInput value={query} onChange={setQuery} placeholder={isAr ? 'ابحث بمدرسة أو مدينة أو رمز…' : 'Search school, city, ID…'} />} />
        <TableShell head={<tr>
          <th className="th">{isAr ? 'المدرسة' : 'School'}</th><th className="th">{isAr ? 'المدينة' : 'City'}</th>
          <th className="th">{isAr ? 'الطلاب' : 'Students'}</th><th className="th">{isAr ? 'الحضور' : 'Attend.'}</th>
          <th className="th">{isAr ? 'الخطة' : 'Plan'}</th><th className="th">{isAr ? 'آخر مزامنة' : 'Last sync'}</th><th className="th">{isAr ? 'الحالة' : 'Status'}</th><th className="th"></th>
        </tr>}>
          {filtered.map(s => (
            <tr key={s.id} className="hover:bg-ivory/60 transition-colors">
              <td className="td"><div className="font-extrabold text-[12px]">{isAr ? s.nameAr : s.nameEn}</div><div className="text-[9px] text-charcoal/50 font-en">{s.id} · {s.platform}</div></td>
              <td className="td text-[11.5px]">{isAr ? s.city : s.cityEn}</td>
              <td className="td font-en font-bold">{s.students}</td>
              <td className="td font-en font-bold">{s.attendance}%</td>
              <td className="td"><span className="chip chip-blue">{s.plan}</span></td>
              <td className="td text-[10px] text-charcoal/60">{s.lastSync}</td>
              <td className="td"><span className={`chip ${s.status === 'active' ? 'chip-green' : 'chip-gold'}`}><StatusDot tone={s.status === 'active' ? 'green' : 'gold'} />{s.status === 'active' ? (isAr ? 'نشطة' : 'Active') : (isAr ? 'انتباه' : 'Attention')}</span></td>
              <td className="td"><button className="text-[10.5px] font-extrabold text-deepblue hover:underline" onClick={() => setSel(s.id)}>{isAr ? 'الملف' : 'Profile'} ←</button></td>
            </tr>
          ))}
        </TableShell>
      </div>

      {/* School profile modal */}
      <Modal open={!!school} onClose={() => setSel(null)} wide title={school ? (isAr ? school.nameAr : school.nameEn) : ''} sub={school ? `${school.id} · ${isAr ? school.city : school.cityEn} · ${school.plan}` : ''}
        footer={<><button className="btn btn-outline" onClick={() => setSel(null)}>{isAr ? 'إغلاق' : 'Close'}</button>
          <button className="btn btn-primary" onClick={() => { setSel(null); push(isAr ? 'تم إرسال طلب المزامنة للمدرسة' : 'Sync request sent to school', 'info'); }}><RefreshCw size={14} />{isAr ? 'مزامنة الآن' : 'Sync now'}</button></>}>
        {school && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              {[[isAr ? 'طلاب' : 'Students', school.students], [isAr ? 'معلمون' : 'Teachers', school.teachers], [isAr ? 'مؤشر الصحة' : 'Health', school.health + '%']].map(([l, v]) => (
                <div key={String(l)} className="rounded-2xl bg-ivory border border-sand-soft py-3"><div className="font-en font-extrabold text-[18px]">{v}</div><div className="text-[9.5px] font-bold text-charcoal/55">{l}</div></div>
              ))}
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold text-charcoal/55 mb-1"><span>{isAr ? 'مؤشر صحة المستأجر' : 'Tenant health index'}</span><span className="font-en">{school.health}/100</span></div>
              <ProgressBar value={school.health} tone={school.health > 85 ? 'green' : 'gold'} />
            </div>
            <div className="grid sm:grid-cols-2 gap-2 text-[11px]">
              {[[isAr ? 'الربط مع نور' : 'Noor sync', isAr ? 'متصل — مزامنة كل 6 ساعات' : 'Connected — every 6h', true], [isAr ? 'منصة مدرستي' : 'Madrasati', isAr ? 'متصل — مزامنة يومية 02:00' : 'Connected — daily 02:00', true], [isAr ? 'برنامج حضوري' : 'Hudori', isAr ? 'قيد التفعيل — يحتاج اعتماد المدرسة' : 'Pending — needs school sign-off', false], [isAr ? 'النسخ الاحتياطي' : 'Backups', 'AES-256 · RTC 03:00', true]].map(([l, v, ok]) => (
                <div key={String(l)} className="flex items-center gap-2 rounded-xl border border-sand-soft px-3 py-2.5">
                  {ok ? <CheckCircle2 size={15} className="text-green shrink-0" /> : <AlertTriangle size={15} className="text-gold-deep shrink-0" />}
                  <div><div className="font-bold text-[10.5px]">{l}</div><div className="text-[9px] text-charcoal/55">{v}</div></div>
                </div>
              ))}
            </div>
            <p className="text-[9.5px] text-charcoal/50 bg-blue-soft/40 border border-deepblue/15 rounded-xl px-3 py-2 leading-5">{isAr ? 'بيانات تجريبية للعرض — تفعيل المستأجر الحقيقي يتطلب اتفاقية خدمات موقعة ومراجعة أمنية.' : 'Demonstration sample data — real tenant activation requires a signed service agreement and security review.'}</p>
          </div>
        )}
      </Modal>

      {/* Onboard modal */}
      <Modal open={onboard} onClose={() => setOnboard(false)} title={isAr ? 'تهيئة مدرسة جديدة' : 'Onboard New School'} sub={isAr ? 'إنشاء مستأجر معزول + بيئة أولية — خلال دقائق' : 'Provision an isolated tenant + baseline config — in minutes'}
        footer={<><button className="btn btn-ghost" onClick={() => setOnboard(false)}>{isAr ? 'إلغاء' : 'Cancel'}</button>
          <BusyButton busy={busy} className="btn btn-primary" onClick={() => run(() => { setOnboard(false); push(isAr ? 'تم إنشاء المستأجر مبدئياً — بانتظار توقيع الاتفاقية' : 'Tenant provisioned in draft — awaiting signed agreement'); setForm({ name: '', city: '', students: '', plan: 'الخطة الفضية' }); })}>{isAr ? 'إنشاء المستأجر' : 'Provision tenant'}</BusyButton></>}>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2"><label className="raven-label">{isAr ? 'اسم المدرسة' : 'School name'} *</label><input className="raven-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder={isAr ? 'مثال: مدرسة الرواد الأهلية' : 'e.g. Al-Rowad National School'} /></div>
          <div><label className="raven-label">{isAr ? 'المدينة' : 'City'} *</label><input className="raven-input" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="الرياض" /></div>
          <div><label className="raven-label">{isAr ? 'عدد الطلاب المتوقع' : 'Expected students'}</label><input className="raven-input" type="number" value={form.students} onChange={e => setForm({ ...form, students: e.target.value })} placeholder="650" /></div>
          <div className="sm:col-span-2"><label className="raven-label">{isAr ? 'خطة الاشتراك' : 'Subscription plan'}</label>
            <select className="raven-input" value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })}><option>الخطة الذهبية</option><option>الخطة الفضية</option><option>الخطة البرونزية</option></select>
          </div>
        </div>
      </Modal>
      <Toaster toasts={toasts} />
    </div>
  );
}

/* ════════════════ 3 · إدارة المستخدمين ════════════════ */
function UsersPage() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [invite, setInvite] = useState(false);
  const [busy, run] = useAsyncAction(1400);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'Teacher', scope: '' });
  const filtered = PLATFORM_USERS.filter(u =>
    (roleFilter === 'all' || u.role === roleFilter) &&
    (!query || `${u.name} ${u.email} ${u.scope}`.toLowerCase().includes(query.toLowerCase())));
  const roleChip: Record<string, string> = { 'Platform Owner': 'chip-gold', 'Platform Admin': 'chip-blue', Principal: 'chip-green', 'School Admin': 'chip-green', Teacher: 'chip-sand', Family: 'chip-sand' };

  return (
    <div>
      <PageHead icon={Users} eyebrow={isAr ? 'الحسابات والدعوات' : 'ACCOUNTS & INVITATIONS'}
        title={isAr ? 'إدارة المستخدمين' : 'User Management'}
        desc={isAr ? 'كل حساب على المنصة — بدعوة رسمية ونطاق وصول وحالة. لا حسابات بلا دور.' : 'Every account on the platform — official invitation, access scope and status. No roleless accounts.'}
        actions={<><SampleBadge /><button className="btn btn-primary !h-9" onClick={() => setInvite(true)}><Mail size={15} />{isAr ? 'دعوة مستخدم' : 'Invite User'}</button></>} />
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <SearchInput value={query} onChange={setQuery} placeholder={isAr ? 'ابحث باسم أو بريد أو مدرسة…' : 'Search name, email, school…'} />
        <div className="flex gap-1.5 flex-wrap">
          {[['all', isAr ? 'الكل' : 'All'], ['Platform Owner', isAr ? 'مالك المنصة' : 'Owner'], ['Platform Admin', isAr ? 'مدير المنصة' : 'Admin'], ['Principal', isAr ? 'مدير مدرسة' : 'Principal'], ['Teacher', isAr ? 'معلم' : 'Teacher'], ['Family', isAr ? 'أسرة' : 'Family']].map(([v, l]) => (
            <button key={v} onClick={() => setRoleFilter(v)} className={`h-9 px-3.5 rounded-xl text-[11px] font-bold border transition-all ${roleFilter === v ? 'bg-charcoal text-gold border-charcoal' : 'bg-white text-charcoal/70 border-sand-soft hover:border-sand'}`}>{l}</button>
          ))}
        </div>
      </div>
      <div className="raven-card overflow-hidden">
        <TableShell minWidth={860} head={<tr>
          <th className="th">{isAr ? 'المستخدم' : 'User'}</th><th className="th">{isAr ? 'الدور' : 'Role'}</th><th className="th">{isAr ? 'نطاق الوصول' : 'Scope'}</th><th className="th">{isAr ? 'آخر نشاط' : 'Last seen'}</th><th className="th">{isAr ? 'الحالة' : 'Status'}</th><th className="th"></th>
        </tr>}>
          {filtered.map(u => (
            <tr key={u.id} className="hover:bg-ivory/60">
              <td className="td"><div className="flex items-center gap-2.5"><span className="h-9 w-9 rounded-full bg-sand-soft flex items-center justify-center text-[12px] font-black text-charcoal/70 shrink-0">{u.name.replace(/^(أ\.|م\.|أم|Mr\.|Ms\.)\s*/, '').charAt(0)}</span><div><div className="font-extrabold text-[11.5px]">{u.name}</div><div className="text-[9px] text-charcoal/50 font-en">{u.email}</div></div></div></td>
              <td className="td"><span className={`chip ${roleChip[u.role] ?? 'chip-sand'}`}>{u.role === 'Platform Owner' && <Crown size={10} />}{isAr ? u.roleAr : u.role}</span></td>
              <td className="td text-[10.5px] text-charcoal/70">{u.scope}</td>
              <td className="td text-[9.5px] text-charcoal/55">{u.last}</td>
              <td className="td">{u.status === 'active' ? <span className="chip chip-green"><StatusDot tone="green" />{isAr ? 'نشط' : 'Active'}</span> : u.status === 'invited' ? <span className="chip chip-blue"><StatusDot tone="blue" />{isAr ? 'مدعو' : 'Invited'}</span> : <span className="chip chip-red"><Ban size={9} />{isAr ? 'موقوف' : 'Suspended'}</span>}</td>
              <td className="td">{u.status === 'active'
                ? <button className="text-[10px] font-extrabold text-red-700 hover:underline" onClick={() => push(isAr ? `تم إيقاف ${u.name} مؤقتاً` : `${u.name} suspended`, 'info')}>{isAr ? 'إيقاف' : 'Suspend'}</button>
                : <button className="text-[10px] font-extrabold text-green-deep hover:underline" onClick={() => push(isAr ? 'تم تفعيل الحساب وإرسال إشعار' : 'Account reactivated & notified')}>{isAr ? 'تفعيل' : 'Reactivate'}</button>}</td>
            </tr>
          ))}
          {filtered.length === 0 && <tr><td colSpan={6}><EmptyState title={isAr ? 'لا نتائج مطابقة' : 'No matching users'} hint={isAr ? 'جرّب تعديل البحث أو الفلتر' : 'Try adjusting search or filter'} /></td></tr>}
        </TableShell>
      </div>

      <Modal open={invite} onClose={() => setInvite(false)} title={isAr ? 'دعوة مستخدم جديد' : 'Invite New User'} sub={isAr ? 'الدعوة تُرسل برابط صالح 72 ساعة مع الدور والنطاق محددين مسبقاً' : 'Invitation sent with pre-assigned role & scope — link valid 72h'}
        footer={<><button className="btn btn-ghost" onClick={() => setInvite(false)}>{isAr ? 'إلغاء' : 'Cancel'}</button><BusyButton busy={busy} className="btn btn-primary" onClick={() => run(() => { setInvite(false); push(isAr ? `أُرسلت الدعوة إلى ${inviteForm.email || 'البريد المحدد'}` : `Invitation sent to ${inviteForm.email || 'the specified email'}`); setInviteForm({ name: '', email: '', role: 'Teacher', scope: '' }); })}>{isAr ? 'إرسال الدعوة' : 'Send invitation'}</BusyButton></>}>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2"><label className="raven-label">{isAr ? 'الاسم الكامل' : 'Full name'} *</label><input className="raven-input" value={inviteForm.name} onChange={e => setInviteForm({ ...inviteForm, name: e.target.value })} placeholder={isAr ? 'أ. سارة محمد' : 'Sarah Mohammed'} /></div>
          <div className="sm:col-span-2"><label className="raven-label">{isAr ? 'البريد الرسمي' : 'Official email'} *</label><input className="raven-input" type="email" value={inviteForm.email} onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })} placeholder="name@school.edu.sa" /></div>
          <div><label className="raven-label">{isAr ? 'الدور' : 'Role'}</label><select className="raven-input" value={inviteForm.role} onChange={e => setInviteForm({ ...inviteForm, role: e.target.value })}><option>Teacher</option><option>Principal</option><option>School Admin</option><option>Platform Admin</option><option>Family</option></select></div>
          <div><label className="raven-label">{isAr ? 'النطاق (مدرسة/فصول)' : 'Scope (school/classes)'}</label><input className="raven-input" value={inviteForm.scope} onChange={e => setInviteForm({ ...inviteForm, scope: e.target.value })} placeholder={isAr ? 'مدرسة المستقبل الأهلية' : 'Al-Mustaqbal School'} /></div>
        </div>
      </Modal>
      <Toaster toasts={toasts} />
    </div>
  );
}

/* ════════════════ 4 · الأدوار والصلاحيات ════════════════ */
const PERM_MATRIX = [
  { ar: 'عرض مؤشرات المدرسة', en: 'View school indicators', owner: true, admin: true, schoolAdmin: true, principal: true, teacher: false, family: false },
  { ar: 'تعديل الخطة التشغيلية', en: 'Edit operational plan', owner: true, admin: true, schoolAdmin: true, principal: true, teacher: false, family: false },
  { ar: 'اعتماد شواهد وأرشفة', en: 'Approve & archive evidence', owner: true, admin: true, schoolAdmin: true, principal: true, teacher: false, family: false },
  { ar: 'إدخال الدرجات وتحليلها', en: 'Enter & analyze grades', owner: true, admin: true, schoolAdmin: true, principal: true, teacher: true, family: false },
  { ar: 'تسجيل الحضور والغياب', en: 'Record attendance', owner: true, admin: true, schoolAdmin: true, principal: true, teacher: true, family: false },
  { ar: 'عرض بيانات الطلاب', en: 'View student data', owner: true, admin: true, schoolAdmin: true, principal: true, teacher: true, family: true },
  { ar: 'إدارة المستأجرين والتفعيل', en: 'Manage tenants', owner: true, admin: true, schoolAdmin: false, principal: false, teacher: false, family: false },
  { ar: 'تعديل مصفوفة الصلاحيات', en: 'Edit permission matrix', owner: true, admin: false, schoolAdmin: false, principal: false, teacher: false, family: false },
  { ar: 'الإعدادات والفوترة العالمية', en: 'Global config & billing', owner: true, admin: false, schoolAdmin: false, principal: false, teacher: false, family: false },
  { ar: 'تصدير التقارير الرسمية PDF', en: 'Export official PDF reports', owner: true, admin: true, schoolAdmin: true, principal: true, teacher: false, family: true },
];
function Roles() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const roles = [
    { icon: Crown, ar: 'مالك المنصة', en: 'Platform Owner', count: 1, tone: 'text-gold-deep bg-gold-soft border-gold/40' },
    { icon: ShieldEllipsis, ar: 'مدير المنصة', en: 'Platform Admin', count: 2, tone: 'text-deepblue bg-blue-soft border-deepblue/25' },
    { icon: UserCog, ar: 'مدير شؤون المدرسة', en: 'School Admin', count: 6, tone: 'text-green-deep bg-green-soft border-green/25' },
    { icon: Building2, ar: 'مدير المدرسة', en: 'Principal', count: 6, tone: 'text-green-deep bg-green-soft border-green/25' },
    { icon: Users, ar: 'معلم', en: 'Teacher', count: 368, tone: 'text-charcoal/70 bg-sand-soft border-sand' },
    { icon: UserParent, ar: 'أسرة', en: 'Family', count: 1757, tone: 'text-charcoal/70 bg-sand-soft border-sand' },
  ];
  return (
    <div>
      <PageHead icon={ShieldCheck} eyebrow={isAr ? 'فصل الواجبات — Separation of Duties' : 'SEPARATION OF DUTIES'}
        title={isAr ? 'الأدوار والصلاحيات' : 'Roles & Permissions'}
        desc={isAr ? 'مصفوفة الوصول للأدوار الستة — نقطة التحكم الوحيدة للتفويض عبر المنصة. التعديلات الجذرية حكراً على مالك المنصة.' : 'Access matrix for the six roles — the single delegation control plane. Root changes are exclusive to the Platform Owner.'}
        actions={<SampleBadge />} />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5 mb-4">
        {roles.map(r => (
          <div key={r.en} className={`rounded-2xl border p-3 flex flex-col items-center text-center gap-1.5 ${r.tone}`}>
            <r.icon size={20} />
            <div className="text-[10.5px] font-black leading-4">{isAr ? r.ar : r.en}</div>
            <div className="font-en text-[15px] font-extrabold">{r.count.toLocaleString()}</div>
            <div className="text-[8px] font-bold opacity-70">{isAr ? 'حساب' : 'accounts'}</div>
          </div>
        ))}
      </div>
      <div className="raven-card overflow-hidden">
        <CardTitle title={isAr ? 'مصفوفة الصلاحيات v2.4' : 'Permission Matrix v2.4'} sub={isAr ? 'آخر تعديل: مالك المنصة — اليوم 09:41 (مسجل في سجل التدقيق)' : 'Last edited by Platform Owner — today 09:41 (audit-logged)'}
          action={<button className="btn btn-outline !h-8 !text-[10.5px]" onClick={() => push(isAr ? 'صلاحيات المصفوفة مقفلة أثناء ساعات الدوام — تُفتح 00:00' : 'Matrix locked during school hours — unlocks at 00:00', 'info')}><Lock size={12} />{isAr ? 'قفل التحرير' : 'Edit locked'}</button>} />
        <TableShell minWidth={880} head={<tr>
          <th className="th">{isAr ? 'القدرة' : 'Capability'}</th>
          {['مالك', 'م.المنصة', 'م.المدرسة', 'مدير', 'معلم', 'أسرة'].map((h, i) => <th key={i} className="th !text-center">{isAr ? h : ['Owner', 'Pl.Admin', 'Sch.Admin', 'Principal', 'Teacher', 'Family'][i]}</th>)}
        </tr>}>
          {PERM_MATRIX.map(row => (
            <tr key={row.en} className="hover:bg-ivory/60">
              <td className="td font-bold text-[11px]">{isAr ? row.ar : row.en}</td>
              {[row.owner, row.admin, row.schoolAdmin, row.principal, row.teacher, row.family].map((v, i) => (
                <td key={i} className="td text-center">{v ? <span className="inline-flex h-6 w-6 rounded-full bg-green-soft items-center justify-center"><Check size={13} className="text-green-deep" strokeWidth={3} /></span> : <span className="inline-flex h-6 w-6 rounded-full bg-sand-soft/70 items-center justify-center"><X size={12} className="text-charcoal/35" /></span>}</td>
              ))}
            </tr>
          ))}
        </TableShell>
      </div>
      <Toaster toasts={toasts} />
    </div>
  );
}
const UserParent = (p: { size?: number }) => <Users size={p.size ?? 20} strokeWidth={1.7} />;

/* ════════════════ 5 · الصحة التقنية والأمان ════════════════ */
function Security() {
  const { isAr } = useLang();
  const [scanning, setScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const startScan = () => { setScanning(true); setScanDone(false); window.setTimeout(() => { setScanning(false); setScanDone(true); }, 2600); };

  return (
    <div>
      <PageHead icon={HeartPulse} eyebrow={isAr ? 'الأمن والمراقبة' : 'SECURITY & OBSERVABILITY'}
        title={isAr ? 'الصحة التقنية والأمان' : 'Technical Health & Security'}
        desc={isAr ? 'توفرية المنصة، مؤشرات الأمان، مراقبة الوصول وسجل التدقيق الكامل.' : 'Platform uptime, security posture, access monitoring and the full audit trail.'}
        actions={<><SampleBadge /><button className="btn btn-dark !h-9" onClick={startScan} disabled={scanning}>{scanning ? <RefreshCw size={14} className="animate-spin" /> : <ShieldCheck size={15} />}{isAr ? 'فحص أمني كامل' : 'Run full scan'}</button></>} />

      {(scanning || scanDone) && (
        <div className={`raven-card mb-4 px-5 py-4 flex items-center gap-4 ${scanDone ? 'border-green/40' : ''}`}>
          {scanning ? <RefreshCw size={22} className="animate-spin text-deepblue shrink-0" /> : <CheckCircle2 size={22} className="text-green shrink-0" />}
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-extrabold">{scanning ? (isAr ? 'جارٍ فحص 2,140 حساب، 6 مستأجرين، 38 نقطة نهاية API…' : 'Scanning 2,140 accounts, 6 tenants, 38 API endpoints…') : (isAr ? 'اكتمل الفحص: لا ثغرات حرجة — 2 توصيتان للتحسين (تدوير مفاتيح API كل 90 يوماً)' : 'Scan complete: no critical findings — 2 recommendations (rotate API keys every 90d)')}</div>
            {scanning && <div className="mt-2 h-1.5 rounded-full bg-sand-soft overflow-hidden"><div className="h-full bg-deepblue rounded-full shimmer" style={{ width: '100%' }} /></div>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {HEALTH_STATS.map(s => <KpiCard key={s.label} tone="green" icon={s.label.includes('p95') ? Zap : s.label.includes('API') ? Server : Database} label={s.label} value={s.value} />)}
      </div>

      <div className="grid xl:grid-cols-3 gap-4 mt-4">
        {/* Security posture */}
        <div className="raven-card overflow-hidden">
          <CardTitle title={isAr ? 'مؤشرات الحماية' : 'Security Posture'} sub={isAr ? 'تقييم آلي كل 15 دقيقة' : 'Automated assessment every 15 min'} />
          <div className="p-4 space-y-2.5">
            {[
              { ar: 'تشفير البيانات أثناء النقل والتخزين', en: 'Encryption in transit & at rest', v: 'TLS 1.3 · AES-256' },
              { ar: 'المصادقة متعددة العوامل (MFA)', en: 'Multi-Factor Authentication', v: '100% ' + (isAr ? 'للأدوار الإدارية' : 'for admin roles') },
              { ar: 'عزل بيانات المستأجرين (Tenant Isolation)', en: 'Tenant data isolation', v: isAr ? 'Row-Level Security مفعّلة' : 'RLS enabled' },
              { ar: 'الجلسات النشطة الآن', en: 'Active sessions now', v: '387' },
              { ar: 'محاولات دخول محظورة — 30 يوم', en: 'Blocked login attempts — 30d', v: '214' },
              { ar: 'آخر اختبار اختراق', en: 'Last penetration test', v: isAr ? 'سبتمبر 2026 — بلا حرج' : 'Sep 2026 — no criticals' },
            ].map(r => (
              <div key={r.en} className="flex items-center justify-between gap-3 border-b border-sand-soft/60 pb-2.5">
                <span className="text-[10.5px] font-bold text-charcoal/80 leading-4 flex items-center gap-1.5"><Lock size={11} className="text-green-deep shrink-0" />{isAr ? r.ar : r.en}</span>
                <span className="text-[9.5px] font-mono font-medium text-deepblue whitespace-nowrap">{r.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Access monitoring */}
        <div className="raven-card overflow-hidden">
          <CardTitle title={isAr ? 'مراقبة الوصول' : 'Access Monitoring'} sub={isAr ? 'آخر 30 يوم — عبر كل المستأجرين' : 'Last 30 days — all tenants'} />
          <div className="p-5 flex flex-col items-center">
            <Donut value={96} size={120} label={isAr ? 'جلسات سليمة' : 'healthy sessions'} color="#08794F" />
            <div className="grid grid-cols-3 gap-2 mt-4 w-full text-center">
              {[['387', isAr ? 'جلسة نشطة' : 'Active sessions'], ['5,412', isAr ? 'تسجيل دخول ناجح' : 'Successful logins'], ['214', isAr ? 'محاولة محظورة' : 'Blocked attempts']].map(([v, l]) => (
                <div key={l as string} className="rounded-xl bg-ivory border border-sand-soft py-2.5"><div className="font-en font-extrabold text-[15px]">{v}</div><div className="text-[8px] font-bold text-charcoal/55 leading-3 mt-0.5">{l}</div></div>
              ))}
            </div>
            <div className="mt-3 w-full rounded-xl bg-gold-soft/60 border border-gold/40 px-3 py-2 text-[9.5px] leading-5 text-charcoal/80"><span className="font-black text-gold-deep">{isAr ? 'توصية: ' : 'Recommendation: '}</span>{isAr ? 'فرض MFA لجميع المعلمين بنهاية نوفمبر 2026 — الالتزام الحالي 78%.' : 'Enforce MFA for all teachers by end of Nov 2026 — current adoption 78%.'}</div>
          </div>
        </div>

        {/* Audit log */}
        <div className="raven-card overflow-hidden xl:col-span-1 md:col-span-2">
          <CardTitle title={isAr ? 'سجل التدقيق' : 'Audit Log'} sub={isAr ? 'أحداث غير قابلة للتعديل — احتفاظ 7 سنوات' : 'Immutable events — 7-year retention'}
            action={<span className="chip chip-blue"><ScrollText size={10} />{isAr ? 'مُصدّر تلقائياً' : 'Auto-exported'}</span>} />
          <div className="divide-y divide-sand-soft/70 max-h-[330px] overflow-y-auto scrollbar-thin">
            {AUDIT_LOGS.map(a => (
              <div key={a.id} className="px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-charcoal/45">{a.time}</span>
                  <span className={`chip !h-5 !text-[8.5px] ${toneSev[a.severity]}`}>{a.severity === 'high' ? (isAr ? 'عالٍ' : 'HIGH') : a.severity === 'medium' ? (isAr ? 'متوسط' : 'MED') : (isAr ? 'معلومة' : 'INFO')}</span>
                </div>
                <p className="text-[10px] font-bold text-charcoal/85 leading-4 mt-1">{a.action}</p>
                <p className="text-[8.5px] font-mono text-charcoal/45 truncate">{a.actor} → {a.target}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════ 6 · الإعدادات العامة ════════════════ */
function SettingsPage() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const [cfg, setCfg] = useState({ arName: 'مؤسسة رافيين للخدمات التعليمية', enName: 'Rafeeen Foundation for Educational Services', tagline: 'نحن نصنع الفرق', email: 'platform@rafeeen.edu.sa', tz: 'Asia/Riyadh', country: 'SA', allowNewTenants: true, maintenanceMode: false, demoMode: true });
  const Toggle = ({ v, on }: { v: boolean; on: () => void }) => (
    <button onClick={on} role="switch" aria-checked={v} className={`transition-colors ${v ? 'text-green' : 'text-charcoal/30'}`}>{v ? <ToggleRight size={34} strokeWidth={1.6} /> : <ToggleLeft size={34} strokeWidth={1.6} />}</button>
  );
  return (
    <div>
      <PageHead icon={Settings} eyebrow={isAr ? 'التكوين العالمي' : 'GLOBAL CONFIGURATION'}
        title={isAr ? 'الإعدادات العامة' : 'Global Settings'}
        desc={isAr ? 'هوية المنصة، اللغات، والتفضيلات العالمية المطبقة على جميع المستأجرين.' : 'Platform identity, languages and global preferences applied across all tenants.'}
        actions={<><SampleBadge /><button className="btn btn-primary !h-9" onClick={() => push(isAr ? 'حُفظت الإعدادات العالمية وأُشعرت الفرق المعنية' : 'Global settings saved — teams notified')}><Save size={14} />{isAr ? 'حفظ الكل' : 'Save all'}</button></>} />
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="raven-card overflow-hidden">
          <CardTitle title={isAr ? 'الهوية الرسمية' : 'Official Identity'} sub={isAr ? 'تظهر في كل الترويسات والوثائق المولّدة' : 'Shown in every header & generated document'} />
          <div className="p-5 space-y-3">
            <div><label className="raven-label">{isAr ? 'الاسم الرسمي (عربي)' : 'Official name (AR)'}</label><input className="raven-input" value={cfg.arName} onChange={e => setCfg({ ...cfg, arName: e.target.value })} /></div>
            <div><label className="raven-label">{isAr ? 'الاسم الرسمي (إنجليزي)' : 'Official name (EN)'}</label><input className="raven-input font-en" value={cfg.enName} onChange={e => setCfg({ ...cfg, enName: e.target.value })} /></div>
            <div><label className="raven-label">{isAr ? 'التوقيع الرسمي' : 'Official signature'}</label><input className="raven-input font-bold" value={cfg.tagline} onChange={e => setCfg({ ...cfg, tagline: e.target.value })} /></div>
            <div className="rounded-2xl bg-charcoal p-4 flex items-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-gold flex items-center justify-center shrink-0"><Globe size={24} className="text-charcoal" /></div>
              <div className="min-w-0"><div className="text-[11px] font-black text-ivory truncate">{cfg.arName}</div><div className="text-[9px] text-gold font-bold mt-1 leading-4">«{cfg.tagline}» — {isAr ? 'التوقيع المعتمد في الوثائق' : 'approved signature across documents'}</div></div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="raven-card overflow-hidden">
            <CardTitle title={isAr ? 'اللغات والمنطقة' : 'Languages & Region'} sub="ar-SA · en-US · RTL/LTR" />
            <div className="p-5 grid sm:grid-cols-3 gap-3">
              <div><label className="raven-label">{isAr ? 'اللغة الافتراضية' : 'Default language'}</label><select className="raven-input" defaultValue="ar"><option value="ar">العربية (RTL)</option><option value="en">English (LTR)</option></select></div>
              <div><label className="raven-label">{isAr ? 'المنطقة الزمنية' : 'Timezone'}</label><select className="raven-input font-en" defaultValue={cfg.tz}><option>Asia/Riyadh</option><option>Asia/Dubai</option><option>Africa/Cairo</option></select></div>
              <div><label className="raven-label">{isAr ? 'الدولة' : 'Country'}</label><select className="raven-input" defaultValue={cfg.country}><option value="SA">السعودية</option><option value="AE">الإمارات</option><option value="EG">مصر</option></select></div>
              <div className="sm:col-span-3"><label className="raven-label">{isAr ? 'بريد الدعم المؤسسي' : 'Institutional support email'}</label><input className="raven-input font-en" value={cfg.email} onChange={e => setCfg({ ...cfg, email: e.target.value })} /></div>
            </div>
          </div>
          <div className="raven-card overflow-hidden">
            <CardTitle title={isAr ? 'مفاتيح التشغيل' : 'Feature Switches'} sub={isAr ? 'تُطبق على كل المستأجرين فوراً' : 'Applied to all tenants instantly'} />
            <div className="p-5 space-y-3">
              {([
                ['allowNewTenants', isAr ? 'السماح بتهيئة مدارس جديدة' : 'Allow new school onboarding', isAr ? 'مغلق = المنصة بوضع تدقيق' : 'Off = platform in review mode'],
                ['demoMode', isAr ? 'شارة البيانات التجريبية في كل الشاشات' : 'Sample-data badge everywhere', isAr ? 'وضع العرض — مسموح للعروض والمبيعات' : 'Demo mode — for showcases'],
                ['maintenanceMode', isAr ? 'وضع الصيانة (قراءة فقط)' : 'Maintenance mode (read-only)', isAr ? 'تفعيله يوقف الكتابة في كل المستأجرين' : 'Blocks writes platform-wide'],
              ] as [keyof typeof cfg & string, string, string][]).map(([key, title, hint]) => (
                <div key={key} className="flex items-center justify-between gap-4 border-b border-sand-soft/60 pb-3">
                  <div className="min-w-0"><div className="text-[11.5px] font-extrabold">{title}</div><div className="text-[9px] text-charcoal/55 mt-0.5">{hint}</div></div>
                  <Toggle v={cfg[key] as boolean} on={() => setCfg({ ...cfg, [key]: !cfg[key] })} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Toaster toasts={toasts} />
    </div>
  );
}

/* ════════════════ Router for platform portal ════════════════ */
export default function PlatformPortal() {
  return (
    <Routes>
      <Route index element={<Overview />} />
      <Route path="schools" element={<Schools />} />
      <Route path="users" element={<UsersPage />} />
      <Route path="roles" element={<Roles />} />
      <Route path="security" element={<Security />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="profile" element={<Navigate to="/platform/settings" replace />} />
      <Route path="*" element={<Navigate to="/platform" replace />} />
    </Routes>
  );
}
