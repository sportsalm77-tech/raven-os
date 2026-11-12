/* ═════════════════════════════════════════════════════════════
   بوابة مدير المدرسة — Part 5
   16 الصلاحيات · 17 إعدادات المنصة · 18 التقارير والمؤشرات
   ═════════════════════════════════════════════════════════════ */
import { useState } from 'react';
import {
  KeyRound, SlidersHorizontal, FileBarChart2, Check, X, Plus, Save, Globe,
  Building2, ShieldCheck, ChevronDown, Download, FileText, Printer, Inbox,
  BellRing, Lock, UsersRound, GraduationCap,
} from 'lucide-react';
import { useLang, L } from '../../lib/i18n';
import {
  PageHead, KpiCard, CardTitle, Bars, Donut, TableShell, SampleBadge,
  useToasts, Toaster, ExportButton, Modal, BusyButton, useAsyncAction,
} from '../../components/raven';
import { MONTHS, MONTHS_EN, ATTENDANCE_TREND, AVG_TREND } from '../../lib/data';

/* ═══════════════ 16 · الصلاحيات ═══════════════ */
const SCHOOL_ROLES = [
  { ar: 'مدير المدرسة', en: 'Principal', users: 1, noteAr: 'وصول كامل للبوابة', noteEn: 'Full portal access' },
  { ar: 'وكيل المدرسة', en: 'Vice Principal', users: 1, noteAr: 'القيادة التشغيلية اليومية', noteEn: 'Daily operational leadership' },
  { ar: 'قائد اللجنة', en: 'Committee Lead', users: 5, noteAr: 'إدارة لجنته وشواهدها فقط', noteEn: 'Own committee & evidence only' },
  { ar: 'أمين الكنترول', en: 'Control Officer', users: 1, noteAr: 'الاختبارات والنماذج والرصد', noteEn: 'Exams, forms & marking' },
  { ar: 'معلم', en: 'Teacher', users: 68, noteAr: 'فصوله وطلابه ومهامه فقط', noteEn: 'Own classes, students & tasks' },
  { ar: 'منسوبة إدارية', en: 'Admin Staff', users: 4, noteAr: 'الشؤون المدرسية والمراسلات', noteEn: 'School affairs & correspondence' },
  { ar: 'عامل', en: 'Support Staff', users: 9, noteAr: 'الورديات والسلامة فقط', noteEn: 'Shifts & safety only' },
];
const SCHOOL_PERMS = [
  { ar: 'اعتماد الخطة التشغيلية', en: 'Approve operational plan', principal: true, vice: true, lead: false, control: false, teacher: false, staff: false },
  { ar: 'اعتماد شواهد الأرشفة', en: 'Approve evidence archiving', principal: true, vice: true, lead: true, control: false, teacher: false, staff: false },
  { ar: 'إصدار تكليف رسمي', en: 'Issue official assignment', principal: true, vice: true, lead: false, control: false, teacher: false, staff: false },
  { ar: 'إدخال درجات فصله', en: 'Enter own class grades', principal: true, vice: true, lead: true, control: true, teacher: true, staff: false },
  { ar: 'رصد الحضور الصباحي', en: 'Morning attendance roll call', principal: true, vice: true, lead: true, control: true, teacher: true, staff: false },
  { ar: 'عرض تقارير المدرسة الكاملة', en: 'View full school reports', principal: true, vice: true, lead: false, control: false, teacher: false, staff: true },
  { ar: 'تعديل إعدادات المنصة للمدرسة', en: 'Edit school platform settings', principal: true, vice: false, lead: false, control: false, teacher: false, staff: false },
];
export function PermissionsPage() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const [selRole, setSelRole] = useState(0);
  const role = SCHOOL_ROLES[selRole];
  return (
    <div>
      <PageHead icon={KeyRound} eyebrow={isAr ? 'القسم 16' : 'SECTION 16'} title={isAr ? 'الصلاحيات' : 'Permissions'}
        desc={isAr ? 'من يفعل ماذا داخل مدرستك — مصفوفة الأدوار المدرسية تُطبق فوراً على كل شاشة. يملك مدير المدرسة التعديل، وينقل مدير المنصة الصلاحيات العالمية فقط.' : 'Who does what inside your school — school-role matrix applied live to every screen. The principal edits; platform-global permissions belong to the Platform Manager only.'}
        actions={<><SampleBadge /><button className="btn btn-outline !h-9" onClick={() => push(isAr ? 'فُتحت سجل تعديلات الصلاحيات — آخر تغيير مسجل ومدقق' : 'Permission change log opened — every edit audited', 'info')}><ShieldCheck size={14} />{isAr ? 'سجل التعديلات' : 'Change log'}</button></>} />
      <div className="grid lg:grid-cols-4 gap-4">
        <div className="raven-card overflow-hidden">
          <CardTitle title={isAr ? 'الأدوار المدرسية' : 'School Roles'} sub={isAr ? 'اضغط دوراً لمراجعته' : 'Select a role'} />
          <div className="p-2.5 space-y-1">{SCHOOL_ROLES.map((r, i) => (
            <button key={r.en} onClick={() => setSelRole(i)} className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-start transition-all ${i === selRole ? 'bg-charcoal text-gold' : 'hover:bg-ivory'}`}>
              <div className="min-w-0 flex-1"><div className={`text-[11px] font-extrabold ${i === selRole ? 'text-ivory' : ''}`}>{isAr ? r.ar : r.en}</div><div className={`text-[8.5px] leading-4 mt-0.5 ${i === selRole ? 'text-gold/80' : 'text-charcoal/55'}`}>{isAr ? r.noteAr : r.noteEn}</div></div>
              <span className={`font-en text-[12px] font-extrabold ${i === selRole ? 'text-gold' : 'text-charcoal/45'}`}>{r.users}</span>
            </button>
          ))}</div>
        </div>
        <div className="raven-card lg:col-span-3 overflow-hidden">
          <CardTitle title={isAr ? `مصفوفة قدرات: ${isAr ? role.ar : role.en}` : `Capabilities: ${role.en}`} sub={isAr ? 'صح = مسموح · صح محددة بلون ذهبي = تتطلب اعتماد المدير' : '✓ allowed · gold check = requires principal sign-off'} />
          <TableShell minWidth={560} head={<tr><th className="th">{isAr ? 'القدرة' : 'Capability'}</th>{SCHOOL_ROLES.slice(0, 6).map(r => <th key={r.en} className="th !text-center">{isAr ? r.ar : r.en}</th>)}</tr>}>
            {SCHOOL_PERMS.map(row => <tr key={row.en} className="hover:bg-ivory/60"><td className="td font-bold text-[10.5px]">{isAr ? row.ar : row.en}</td>{[row.principal, row.vice, row.lead, row.control, row.teacher, row.staff].map((v, i) => <td key={i} className="td text-center">{v ? <span className="inline-flex h-6 w-6 rounded-full bg-green-soft items-center justify-center"><Check size={12} strokeWidth={3.5} className="text-green-deep" /></span> : <span className="inline-flex h-6 w-6 rounded-full bg-sand-soft/60 items-center justify-center"><X size={11} className="text-charcoal/30" /></span>}</td>)}</tr>)}
          </TableShell>
          <div className="px-5 py-3 border-t border-sand-soft flex flex-wrap items-center justify-between gap-2">
            <p className="text-[9px] text-charcoal/55 flex items-center gap-1.5"><Lock size={10} />{isAr ? 'تعديل المصفوفة متاح لمدير المدرسة فقط — ويُسجَّل كل تغيير في سجل التدقيق' : 'Matrix editable by principal only — every change audit-logged'}</p>
            <button className="btn btn-dark !h-8 !text-[10.5px]" onClick={() => push(isAr ? 'قُدّم طلب تعديل الصلاحيات — بانتظار اعتماد مالك المنصة' : 'Permission change requested — awaiting Platform Owner sign-off', 'info')}><Plus size={12} />{isAr ? 'طلب تعديل مصفوفة' : 'Request matrix change'}</button>
          </div>
        </div>
      </div>
      <Toaster toasts={toasts} />
    </div>
  );
}

/* ═══════════════ 17 · إعدادات المنصة ═══════════════ */
export function PrincipalSettings() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const [cfg, setCfg] = useState({ schoolAr: 'مدرسة المستقبل الأهلية', schoolEn: 'Al-Mustaqbal National School', city: 'الرياض', gender: 'بنين', stages: 'متوسط + ثانوي', termStart: '2026-08-23', weekStart: 'الأحد', bells: 7, notifications: true, autoArchive: true, guardianSMS: true });
  const set = (k: keyof typeof cfg) => (v: string | boolean) => setCfg(c => ({ ...c, [k]: v }));
  return (
    <div>
      <PageHead icon={SlidersHorizontal} eyebrow={isAr ? 'القسم 17 — خاص بمدرستك فقط' : 'SECTION 17 — YOUR SCHOOL ONLY'} title={isAr ? 'إعدادات المنصة' : 'Platform Settings'}
        desc={isAr ? 'هوية مدرستك وإعدادات التشغيل — تنطبق على مدرستك فقط ولا تمتد لغيرها.' : 'Your school’s identity & operating preferences — scoped to your school alone.'}
        actions={<><SampleBadge /><button className="btn btn-primary !h-9" onClick={() => push(isAr ? 'حُفظت إعدادات المدرسة وأُشعرت الفرق المعنية' : 'School settings saved — teams notified')}><Save size={14} />{isAr ? 'حفظ التغييرات' : 'Save changes'}</button></>} />
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="raven-card overflow-hidden">
          <CardTitle title={isAr ? 'هوية المدرسة وملفها' : 'School Identity & Profile'} sub={isAr ? 'تظهر في الخطابات والتقارير والشهادات' : 'Shown on letters, reports & certificates'} />
          <div className="p-5 grid sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2"><label className="raven-label">{isAr ? 'اسم المدرسة (عربي)' : 'School name (AR)'}</label><input className="raven-input" value={cfg.schoolAr} onChange={e => set('schoolAr')(e.target.value)} /></div>
            <div className="sm:col-span-2"><label className="raven-label">{isAr ? 'اسم المدرسة (إنجليزي)' : 'School name (EN)'}</label><input className="raven-input font-en" value={cfg.schoolEn} onChange={e => set('schoolEn')(e.target.value)} /></div>
            <div><label className="raven-label">{isAr ? 'المدينة' : 'City'}</label><input className="raven-input" value={cfg.city} onChange={e => set('city')(e.target.value)} /></div>
            <div><label className="raven-label">{isAr ? 'الجنس' : 'Gender'}</label><select className="raven-input" value={cfg.gender} onChange={e => set('gender')(e.target.value)}><option>بنين</option><option>بنات</option><option>مختلط</option></select></div>
            <div><label className="raven-label">{isAr ? 'المراحل' : 'Stages'}</label><input className="raven-input" value={cfg.stages} onChange={e => set('stages')(e.target.value)} /></div>
            <div><label className="raven-label">{isAr ? 'بداية الفصل الدراسي' : 'Term start'}</label><input type="date" className="raven-input font-en" value={cfg.termStart} onChange={e => set('termStart')(e.target.value)} /></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="raven-card overflow-hidden">
            <CardTitle title={isAr ? 'يوم المدرسة' : 'School Day'} />
            <div className="p-5 grid grid-cols-2 gap-3">
              <div><label className="raven-label">{isAr ? 'بداية الأسبوع' : 'Week starts'}</label><select className="raven-input" value={cfg.weekStart} onChange={e => set('weekStart')(e.target.value)}><option>الأحد</option><option>الاثنين</option><option>السبت</option></select></div>
              <div><label className="raven-label">{isAr ? 'عدد الحصص' : 'Periods'}</label><input type="number" min={4} max={9} className="raven-input font-en" value={cfg.bells} onChange={e => set('bells')(e.target.value)} /></div>
            </div>
          </div>
          <div className="raven-card overflow-hidden">
            <CardTitle title={isAr ? 'الإشعارات الآلية' : 'Automated Notifications'} sub={isAr ? 'تعمل فوراً بعد الحفظ' : 'Live immediately after save'} />
            <div className="p-5 space-y-3">{([
              ['notifications', isAr ? 'إشعار الغياب الفوري لولي الأمر (بعد 15 دقيقة من الطابور)' : 'Instant absence notice to guardian (15 min after roll call)'],
              ['autoArchive', isAr ? 'أرشفة تلقائية للشواهد المعتمدة أسبوعياً' : 'Auto-archive approved evidence weekly'],
              ['guardianSMS', isAr ? 'رسائل SMS للأسر غير المفعّلة على التطبيق' : 'SMS fallback for families not on the app'],
            ] as [keyof typeof cfg, string][]).map(([key, label]) => (
              <label key={key} className="flex items-center justify-between gap-4 cursor-pointer border-b border-sand-soft/60 pb-3">
                <span className="text-[10.5px] font-bold leading-5 text-charcoal/85">{label}</span>
                <button role="switch" aria-checked={cfg[key] as boolean} onClick={() => set(key)(!cfg[key])} className={`relative h-6.5 w-12 shrink-0 rounded-full transition-colors ${cfg[key] ? 'bg-green' : 'bg-sand'}`} style={{ height: 26 }}><span className={`absolute top-[3px] h-5 w-5 rounded-full bg-white shadow transition-all ${cfg[key] ? (isAr ? 'start-[3px]' : 'start-[25px]') : (isAr ? 'start-[25px]' : 'start-[3px]')}`} /></button>
              </label>
            ))}</div>
          </div>
          <div className="raven-card p-4 bg-charcoal flex items-center gap-3"><Globe size={20} className="text-gold shrink-0" /><p className="text-[9.5px] leading-5 text-ivory/75">{isAr ? 'تغيير اللغة والمنطقة الزمنية والهوية العالمية يتم من بوابة مدير المنصة — هذه الإعدادات مدرسية فقط.' : 'Language, timezone & global identity are managed from the Platform Manager portal — these settings are school-scoped only.'}</p></div>
        </div>
      </div>
      <Toaster toasts={toasts} />
    </div>
  );
}

/* ═══════════════ 18 · التقارير والمؤشرات ═══════════════ */
const REPORTS = [
  { ar: 'تقرير الأداء المدرسي الشهري', en: 'Monthly School Performance', freqAr: 'شهري', freqEn: 'Monthly', icon: FileText, tone: 'blue' as const },
  { ar: 'تقرير الحضور والمواظبة', en: 'Attendance & Conduct Report', freqAr: 'أسبوعي', freqEn: 'Weekly', icon: FileText, tone: 'green' as const },
  { ar: 'تقرير التحصيل الدراسي حسب المادة', en: 'Achievement by Subject', freqAr: 'شهري', freqEn: 'Monthly', icon: FileText, tone: 'gold' as const },
  { ar: 'تقرير السلوك والمخالفات', en: 'Behavior & Violations', freqAr: 'شهري', freqEn: 'Monthly', icon: FileText, tone: 'gold' as const },
  { ar: 'تقرير الخطة التشغيلية — التقدم والشواهد', en: 'Operational Plan — Progress & Evidence', freqAr: 'ربع سنوي', freqEn: 'Quarterly', icon: FileText, tone: 'blue' as const },
  { ar: 'التقرير السنوي للمؤسسة (للاعتماد)', en: 'Annual Institutional Report (Accreditation)', freqAr: 'سنوي', freqEn: 'Annual', icon: FileText, tone: 'green' as const },
];
export function ReportsPage() {
  const { isAr } = useLang();
  const months = isAr ? MONTHS : MONTHS_EN;
  const { toasts, push } = useToasts();
  const [generating, setGenerating] = useState<string | null>(null);
  const [busy, run] = useAsyncAction(1700);
  const indicators: [string, string, string, string][] = [
    ['الحضور', '96.2%', '94.6%', '+1.6'], ['التحصيل', '88.4%', '85.8%', '+2.6'],
    ['السلوك', '94', '91', '+3'], ['رضا الأسر', '86%', '78%', '+8'],
    ['جاهزية الاعتماد', '87%', '79%', '+8'], ['الشواهد المؤرشفة', '128', '94', '+34'],
  ];
  return (
    <div>
      <PageHead icon={FileBarChart2} eyebrow={isAr ? 'القسم 18' : 'SECTION 18'} title={isAr ? 'التقارير والمؤشرات' : 'Reports & Indicators'}
        desc={isAr ? 'كل تقرير تُريده عن مدرستك — جاهز للتوليد والطباعة والإرسال، مبني على بيانات موحدة لحظية.' : 'Every report you need — ready to generate, print and dispatch, built on live unified data.'}
        actions={<><SampleBadge /><button className="btn btn-outline !h-9" onClick={() => window.print()}><Printer size={14} />{isAr ? 'طباعة الصفحة' : 'Print page'}</button></>} />
      <div className="grid xl:grid-cols-3 gap-4">
        <div className="raven-card overflow-hidden xl:col-span-2">
          <CardTitle title={isAr ? '21 مؤشراً معتمداً — مقارنة بالفصل الماضي' : '21 Approved Indicators — vs Last Term'} sub={isAr ? 'المصدر: البيانات الموحدة — حُدّثت اليوم 07:30' : 'Source: unified data — updated today 07:30'} action={<ExportButton label="Excel" />} />
          <TableShell minWidth={560} head={<tr><th className="th">{isAr ? 'المؤشر' : 'Indicator'}</th><th className="th">{isAr ? 'الحالي' : 'Current'}</th><th className="th">{isAr ? 'الفصل الماضي' : 'Last term'}</th><th className="th">{isAr ? 'التغير' : 'Delta'}</th></tr>}>
            {indicators.map(r => <tr key={r[0]} className="hover:bg-ivory/60"><td className="td font-bold text-[11px]">{r[0]}</td><td className="td font-en font-extrabold">{r[1]}</td><td className="td font-en text-charcoal/60">{r[2]}</td><td className="td font-en font-bold text-green-deep">{r[3]}</td></tr>)}
          </TableShell>
          <div className="p-4 grid md:grid-cols-2 gap-4 border-t border-sand-soft">
            <div><div className="text-[9.5px] font-extrabold text-charcoal/55 mb-1.5">{isAr ? 'اتجاه الحضور' : 'Attendance trend'}</div><Bars data={ATTENDANCE_TREND} labels={months} color="#08794F" height={110} /></div>
            <div><div className="text-[9.5px] font-extrabold text-charcoal/55 mb-1.5">{isAr ? 'اتجاه التحصيل' : 'Achievement trend'}</div><Bars data={AVG_TREND} labels={months} color="#15445A" height={110} /></div>
          </div>
        </div>
        <div className="raven-card overflow-hidden">
          <CardTitle title={isAr ? 'مكتبة التقارير الرسمية' : 'Official Reports Library'} sub={isAr ? 'اضغط توليد — من القالب إلى PDF في ثوانٍ' : 'Tap generate — template to PDF in seconds'} />
          <div className="divide-y divide-sand-soft/70">{REPORTS.map(r => (
            <div key={r.en} className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-ivory/60 transition-colors">
              <span className="h-9 w-9 rounded-xl bg-blue-soft text-deepblue flex items-center justify-center shrink-0"><r.icon size={17} /></span>
              <div className="min-w-0 flex-1"><div className="text-[10.5px] font-bold leading-5">{isAr ? r.ar : r.en}</div><div className="text-[8.5px] text-charcoal/50 font-en">{isAr ? r.freqAr : r.freqEn}</div></div>
              <button className="btn btn-outline !h-8 !px-2.5 !text-[10px] shrink-0" onClick={() => { setGenerating(r.en); run(() => { setGenerating(null); push(isAr ? `وُلّّد «${r.ar}» — حُفظ في مكتبة رافين وجاري إشعار المدير` : `“${r.en}” generated — saved to library & principal notified`); }); }}>{generating === r.en ? '…' : <Download size={12} />}{isAr ? 'توليد' : 'Generate'}</button>
            </div>
          ))}</div>
        </div>
      </div>
      <Toaster toasts={toasts} />
    </div>
  );
}

