/* ═════════════════════════════════════════════════════════════
   بوابة مدير المدرسة — 18 قسماً تشغيلياً
   Raven OS · Principal Portal — Part 1
   ═════════════════════════════════════════════════════════════ */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BarChart3, Info, ClipboardCheck, ListChecks, Target, Landmark, DoorOpen, UsersRound,
  GraduationCap, PenLine, ClipboardList, Mic, ShieldAlert, Sparkles, Library, CalendarDays,
  Stethoscope, Trophy, Star, Accessibility, MonitorPlay, Plug, Bot, KeyRound, SlidersHorizontal,
  FileBarChart2, Search, Upload, FileText, FileSpreadsheet, Trash2, Eye, Check, CheckCircle2,
  X, Plus, Filter, ChevronDown, Wand2, Download, Send, Volume2, Square, CircleDot, ThumbsUp,
  Ban, AlertTriangle, ArrowLeft, ArrowRight, RefreshCw, Clock, Archive, GaugeCircle, TrendingUp,
  BookOpenCheck, ShieldCheck, PhoneCall, MessageSquare, UserPlus, FolderOpen, ScanLine, BadgeCheck,
} from 'lucide-react';
import { useLang, L } from '../../lib/i18n';
import {
  CLASSES, STUDENTS, TEACHERS, TASKS, INITIATIVES, LIBRARY_DOCS, TIMETABLE_TODAY,
  MONTHS, MONTHS_EN, ATTENDANCE_TREND, AVG_TREND, COMMITTEES, ATTENDANCE_MONTH,
} from '../../lib/data';
import {
  PageHead, KpiCard, CardTitle, ProgressBar, Donut, TrendChart, Bars, Modal, EmptyState,
  TableShell, StatusDot, SampleBadge, useToasts, Toaster, BusyButton, useAsyncAction, SearchInput, ExportButton,
} from '../../components/raven';

const prioChip = { 'عالية': 'chip-red', 'متوسطة': 'chip-gold', 'منخفضة': 'chip-sand' } as const;

/* ═══════════════════ 1.1 المؤشرات التفاعلية (Dashboard) ═══════════════════ */
export function PrincipalDashboard() {
  const { isAr, dir } = useLang();
  const months = isAr ? MONTHS : MONTHS_EN;
  const flow = ['الخطة', 'الإجراء', 'التكليف', 'المتابعة', 'التنفيذ', 'الشاهد', 'الأرشفة', 'المؤشر', 'القرار', 'التحسين'];
  const flowEn = ['Plan', 'Procedure', 'Assign', 'Follow-up', 'Execute', 'Evidence', 'Archive', 'Indicator', 'Decision', 'Improve'];
  const [voiceOpen, setVoiceOpen] = useState(false);
  return (
    <div>
      <PageHead icon={BarChart3} eyebrow={isAr ? 'القيادة المدرسية · 1.1' : 'SCHOOL LEADERSHIP · 1.1'}
        title={isAr ? 'المؤشرات التفاعلية' : 'Interactive Indicators'}
        desc={isAr ? 'مدرسة المستقبل الأهلية — حلقة تشغيلية واحدة: الخطة → الإجراء → التكليف → المتابعة → التنفيذ → الشاهد → الأرشفة → المؤشر → القرار → التحسين.' : 'Al-Mustaqbal National School — one operating loop: plan → procedure → assignment → follow-up → execution → evidence → archive → indicator → decision → improvement.'}
        actions={<><SampleBadge /><button className="btn btn-gold !h-9" onClick={() => setVoiceOpen(true)}><Mic size={15} />{isAr ? 'إدخال صوتي' : 'Voice entry'}</button></>} />

      {/* Operating loop strip */}
      <div className="raven-card mb-4 px-4 py-2.5 flex items-center gap-1 overflow-x-auto scrollbar-thin" aria-label={isAr ? 'الحلقة التشغيلية' : 'Operating loop'}>
        {(isAr ? flow : flowEn).map((s, i) => {
          const done = i < 6; const current = i === 6;
          return (
            <div key={i} className="flex items-center gap-1 shrink-0">
              <span className={`h-7 px-2.5 rounded-lg text-[9.5px] font-extrabold flex items-center gap-1 ${done ? 'bg-green-soft text-green-deep' : current ? 'bg-gold text-charcoal ring-2 ring-gold/40' : 'bg-ivory text-charcoal/45 border border-sand-soft'}`}>
                {done && <Check size={10} strokeWidth={3.5} />}{s}
              </span>
              {i < 9 && <ChevronDown size={11} className={`rotate-[-90deg] shrink-0 ${done ? 'text-green' : 'text-sand'}`} />}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard tone="green" icon={GraduationCap} label={isAr ? 'الحضور اليوم' : 'Attendance today'} value="96.2%" delta={1.6} foot={isAr ? 'غاب 32 طالباً — 24 بعذر' : '32 absent — 24 excused'} />
        <KpiCard tone="gold" icon={PenLine} label={isAr ? 'متوسط التحصيل' : 'Avg. achievement'} value="88.4%" delta={2.6} foot={isAr ? 'الفصل الثاني — الاختبارات القصيرة' : 'Term 2 — short assessments'} />
        <KpiCard tone="blue" icon={ClipboardCheck} label={isAr ? 'مهام بانتظار الاعتماد' : 'Awaiting sign-off'} value="7" foot={isAr ? '3 شواهد + 4 خطط تعديل' : '3 evidence + 4 plan edits'} />
        <KpiCard tone="charcoal" icon={GaugeCircle} label={isAr ? 'مؤشر جاهزية الاعتماد' : 'Accreditation readiness'} value="87%" foot={<span className="!text-gold/85">{isAr ? 'جهة الاعتماد تزور المدرسة 15 نوفمبر' : 'Accreditation visit Nov 15'}</span>} />
      </div>

      <div className="grid xl:grid-cols-3 gap-4 mt-4">
        <div className="raven-card xl:col-span-2 overflow-hidden">
          <CardTitle title={isAr ? 'اتجاه الحضور والتحصيل' : 'Attendance & Achievement Trends'} sub={isAr ? '5 أشهر — الفصل الدراسي الأول' : '5 months — first term'}
            action={<ExportButton label={isAr ? 'PDF' : 'PDF'} />} />
          <div className="p-4 grid md:grid-cols-2 gap-5">
            <div><div className="text-[10px] font-extrabold text-charcoal/55 mb-2 flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green" />{isAr ? 'الحضور %' : 'Attendance %'}</div><TrendChart data={ATTENDANCE_TREND} labels={months} color="#08794F" format={v => v.toFixed(1)} /></div>
            <div><div className="text-[10px] font-extrabold text-charcoal/55 mb-2 flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-deepblue" />{isAr ? 'متوسط التحصيل %' : 'Avg. achievement %'}</div><TrendChart data={AVG_TREND} labels={months} color="#15445A" format={v => v.toFixed(1)} /></div>
          </div>
        </div>

        <div className="raven-card overflow-hidden">
          <CardTitle title={isAr ? 'قرارات بانتظارك اليوم' : 'Decisions Pending Today'} sub={isAr ? 'مرتبة حسب الأولوية' : 'Sorted by priority'} />
          <div className="p-4 space-y-2">
            {[
              { ar: 'اعتماد أرشفة شواهد «حصة نانو» — أ. سارة الحربي', en: 'Approve “Nano Lesson” evidence archive — Sarah Al-Harbi', tag: isAr ? 'شواهد' : 'Evidence', tone: 'chip-gold' },
              { ar: 'أبو ريان يطلب موعداً لعرض خطة دعم فهد الغامدي', en: 'Abu Rayan requests a meeting on Fahad Al-Ghamdi’s support plan', tag: isAr ? 'ولي أمر' : 'Parent', tone: 'chip-blue' },
              { ar: 'موازنة المختبر الذكي: 18,500 ر.س — اعتماد أو إعادة تفاوض', en: 'Smart lab budget: 18,500 SAR — approve or renegotiate', tag: isAr ? 'موازنة' : 'Budget', tone: 'chip-sand' },
            ].map((d, i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-xl border border-sand-soft p-2.5 hover:border-gold transition-colors">
                <span className={`chip ${d.tone} shrink-0 mt-0.5`}>{d.tag}</span>
                <p className="text-[10.5px] leading-5 text-charcoal/85">{isAr ? d.ar : d.en}</p>
              </div>
            ))}
            <div className="flex items-center justify-between rounded-xl bg-green-mist border border-green/25 px-3 py-2">
              <span className="text-[10px] font-bold text-green-deep">{isAr ? '7 مهام محسومة اليوم' : '7 tasks closed today'}</span>
              <span className="font-en text-[11px] font-extrabold text-green-deep">+12%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <div className="raven-card overflow-hidden">
          <CardTitle title={isAr ? 'تحصيل الفصول — الشهر الحالي' : 'Class Achievement — This Month'} sub={isAr ? 'متوسط كل فصل — انقر للتفاصيل' : 'Per-class average'} />
          <div className="p-5"><Bars data={CLASSES.map(c => c.avg)} labels={CLASSES.map(c => c.name)} color="#08794F" height={160} /></div>
        </div>
        <div className="raven-card overflow-hidden">
          <CardTitle title={isAr ? 'مهام التكليف — تقدّم التنفيذ' : 'Assigned Tasks — Execution Progress'} sub={isAr ? `${TASKS.filter(t => t.status !== 'done').length} مهام نشطة` : `${TASKS.filter(t => t.status !== 'done').length} active tasks`}
            action={<a href="#/principal/assignments" className="text-[10.5px] font-bold text-green-deep hover:underline">{isAr ? 'مركز التكليفات' : 'Assignments Center'} ←</a>} />
          <div className="p-4 space-y-2.5">
            {TASKS.filter(t => t.status !== 'done').slice(0, 4).map(tk => (
              <div key={tk.id}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10.5px] font-bold text-charcoal/85 truncate">{tk.title}</span>
                  <span className={`chip ${prioChip[tk.priority]} shrink-0`}>{tk.priority}</span>
                </div>
                <div className="flex items-center gap-2"><ProgressBar value={tk.progress} tone={tk.progress > 60 ? 'green' : 'gold'} /><span className="text-[9px] font-en font-bold text-charcoal/55 w-8">{tk.progress}%</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <VoiceEntryModal open={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </div>
  );
}

/* ── مساعد الإدخال الصوتي المشترك ── */
export function VoiceEntryModal({ open, onClose, purpose }: { open: boolean; onClose: () => void; purpose?: string }) {
  const { isAr } = useLang();
  const [phase, setPhase] = useState<'idle' | 'listening' | 'done'>('idle');
  const [transcript, setTranscript] = useState('');
  useEffect(() => { if (open) { setPhase('idle'); setTranscript(''); } }, [open]);
  useEffect(() => {
    if (phase !== 'listening') return;
    const target = isAr ? 'فهد الغامدي غاب اليوم — عذر مرضي من ولي الأمر' : 'Fahad Al-Ghamdi absent today — medical excuse from guardian';
    let i = 0;
    const iv = window.setInterval(() => {
      i += 2 + Math.floor(Math.random() * 3);
      setTranscript(target.slice(0, i));
      if (i >= target.length) { window.clearInterval(iv); setPhase('done'); }
    }, 90);
    return () => window.clearInterval(iv);
  }, [phase, isAr]);
  const bars = Array.from({ length: 26 }, (_, i) => i);
  return (
    <Modal open={open} onClose={onClose} title={isAr ? 'الإدخال الصوتي الذكي' : 'Smart Voice Entry'}
      sub={purpose ?? (isAr ? 'تحدث — رافين يحوّل صوتك إلى سجل بيانات مهيكل بضغطة اعتماد' : 'Speak — Raven structures your voice into a reviewed record')}
      footer={phase === 'done' ? <><button className="btn btn-outline" onClick={onClose}>{isAr ? 'تجاهل' : 'Discard'}</button><button className="btn btn-primary" onClick={onClose}><Check size={15} />{isAr ? 'اعتماد وحفظ السجل' : 'Confirm & save record'}</button></> : <button className="btn btn-ghost" onClick={onClose}>{isAr ? 'إغلاق' : 'Close'}</button>}>
      <div className="flex flex-col items-center py-2">
        <button onClick={() => setPhase(p => p === 'listening' ? 'done' : 'listening')} aria-pressed={phase === 'listening'}
          className={`h-24 w-24 rounded-full flex items-center justify-center transition-all duration-300 ${phase === 'listening' ? 'bg-red-500 text-white ping-soft' : 'bg-charcoal text-gold hover:scale-105'}`}>
          {phase === 'listening' ? <Square size={30} fill="currentColor" /> : <Mic size={38} strokeWidth={1.7} />}
        </button>
        <div className="h-14 flex items-center gap-[3px] mt-5" aria-hidden={phase !== 'listening'}>
          {bars.map(i => (
            <span key={i} className={`w-[3.5px] rounded-full bg-green ${phase === 'listening' ? 'wavebar' : ''}`}
              style={{ height: `${10 + ((i * 37) % 34)}px`, animationDelay: `${(i % 9) * 0.08}s`, opacity: phase === 'listening' ? 1 : 0.18 }} />
          ))}
        </div>
        <div className="w-full min-h-[68px] rounded-2xl border border-sand-soft bg-white px-4 py-3 text-[12px] leading-6 text-charcoal/90">
          {transcript || <span className="text-charcoal/35">{phase === 'idle' ? (isAr ? 'اضغط الميكروفون وتحدث بوضوح… مثال: «سارة القحطاني انضمت للموهوبين»' : 'Press the mic and speak… e.g. “Sara Al-Qahtani joined the gifted program”') : ''}</span>}
        </div>
        {phase === 'done' && <div className="mt-3 flex items-center gap-2 text-[11px] font-bold text-green-deep"><CheckCircle2 size={15} />{isAr ? 'تم التحليل — السجل جاهز للاعتماد' : 'Parsed — record ready for confirmation'}</div>}
        <p className="mt-3 text-[9px] text-charcoal/45">{isAr ? 'معالجة الصوت تتم محلياً داخل الجلسة — لا تُرسل التسجيلات لأي خادم خارجي.' : 'Voice is processed within the session — recordings are never sent to external servers.'}</p>
      </div>
    </Modal>
  );
}

/* ═══════════════════ 1.2 مركز المعلومات المدرسية ═══════════════════ */
export function InfoCenter() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const [tab, setTab] = useState<'teachers' | 'students' | 'classes' | 'committees' | 'plans' | 'docs'>('teachers');
  const [importing, setImporting] = useState<'idle' | 'validating' | 'ready'>('idle');
  const [errors, setErrors] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const tabs = [
    { id: 'teachers' as const, ar: 'المعلمون', en: 'Teachers', n: TEACHERS.length },
    { id: 'students' as const, ar: 'الطلاب', en: 'Students', n: 842 },
    { id: 'classes' as const, ar: 'الفصول', en: 'Classes', n: CLASSES.length },
    { id: 'committees' as const, ar: 'اللجان والفرق', en: 'Committees', n: COMMITTEES.length },
    { id: 'plans' as const, ar: 'الخطط', en: 'Plans', n: 9 },
    { id: 'docs' as const, ar: 'وثائق المدرسة', en: 'School Documents', n: 23 },
  ];
  const startValidation = () => {
    setImporting('validating');
    window.setTimeout(() => { setImporting('ready'); setErrors(['الصف 118: رقم الهوية 1098xxxxxx مكرر (موجود مسبقاً)', 'الصف 203: تاريخ الميلاد بصيغة غير صحيحة (DD/MM/YYYY)']); }, 1800);
  };
  return (
    <div>
      <PageHead icon={Info} eyebrow={isAr ? 'القيادة المدرسية · 1.2' : 'SCHOOL LEADERSHIP · 1.2'}
        title={isAr ? 'مركز المعلومات المدرسية' : 'School Information Center'}
        desc={isAr ? 'البيانات المؤسسية المرجعية للمدرسة — مصدر الحقيقة الوحيد الذي تتغذى منه كل مراكز رافين الأخرى.' : 'The school’s institutional master data — the single source of truth feeding every other Raven center.'}
        actions={<><SampleBadge />
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv,.pdf" className="hidden" onChange={startValidation} />
          <button className="btn btn-outline !h-9" onClick={() => fileRef.current?.click()}><Upload size={14} />{isAr ? 'رفع Excel / PDF' : 'Upload Excel / PDF'}</button>
        </>} />

      {/* Import validation pipeline */}
      {importing !== 'idle' && (
        <div className="raven-card mb-4 p-4 border-deepblue/25">
          <div className="flex items-center gap-3">
            {importing === 'validating' ? <RefreshCw size={19} className="animate-spin text-deepblue shrink-0" /> : <ScanLine size={19} className="text-gold-deep shrink-0" />}
            <div className="min-w-0">
              <div className="text-[12px] font-extrabold">{importing === 'validating' ? (isAr ? 'جارٍ التحقق من الملف: الأعمدة، الهوية، التكرارات، التنسيقات…' : 'Validating file: columns, IDs, duplicates, formats…') : (isAr ? 'اكتمل التحقق — الملف جاهز للمراجعة والاعتماد' : 'Validation complete — ready for review & sign-off')}</div>
              {importing === 'validating' && <div className="text-[9.5px] text-charcoal/55 mt-0.5">{isAr ? 'فحص 1,247 صفاً عبر 4 أوراق عمل…' : 'Scanning 1,247 rows across 4 worksheets…'}</div>}
            </div>
            {importing === 'ready' && <button className="btn btn-ghost !h-8 ms-auto" onClick={() => { setImporting('idle'); setErrors([]); }}><X size={14} />{isAr ? 'تجاهل' : 'Dismiss'}</button>}
          </div>
          {importing === 'ready' && (
            <div className="mt-3 grid md:grid-cols-3 gap-2">
              <div className="rounded-xl bg-green-mist border border-green/25 px-3 py-2.5"><div className="font-en font-extrabold text-green-deep text-[16px]">1,244</div><div className="text-[9px] font-bold text-green-deep/80">{isAr ? 'سجل سليم وجاهز للاعتماد' : 'Valid records ready'}</div></div>
              <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2.5"><div className="font-en font-extrabold text-red-600 text-[16px]">2</div><div className="text-[9px] font-bold text-red-600/90">{isAr ? 'خطأ يمنع الاستيراد — يرجى التصحيح' : 'Blocking errors — please fix'}</div></div>
              <div className="rounded-xl bg-gold-soft/60 border border-gold/40 px-3 py-2.5 flex flex-col"><button className="btn btn-gold !h-8 !text-[10.5px] mt-auto" onClick={() => { setImporting('idle'); push(isAr ? 'تم اعتماد استيراد 1,244 سجلاً وتوزيعها على المراكز' : '1,244 records imported & routed to all centers'); setErrors([]); }}><BadgeCheck size={13} />{isAr ? 'اعتماد وتوزيع للأنظمة' : 'Approve & distribute'}</button></div>
            </div>
          )}
          {errors.length > 0 && <ul className="mt-2 space-y-1">{errors.map((e, i) => <li key={i} className="text-[9.5px] font-mono text-red-700 bg-red-50 rounded-lg px-3 py-1.5">{e}</li>)}</ul>}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-thin pb-1 mb-3">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`h-10 px-4 rounded-xl text-[11.5px] font-bold whitespace-nowrap border transition-all flex items-center gap-1.5 ${tab === t.id ? 'bg-charcoal text-gold border-charcoal' : 'bg-white text-charcoal/70 border-sand-soft hover:border-sand'}`}>
            {isAr ? t.ar : t.en}<span className={`font-en text-[9px] rounded-md px-1 ${tab === t.id ? 'bg-gold/25 text-gold' : 'bg-ivory text-charcoal/55'}`}>{t.n}</span>
          </button>
        ))}
      </div>

      {tab === 'teachers' && (
        <div className="raven-card overflow-hidden"><TableShell minWidth={820} head={<tr><th className="th">{isAr ? 'المعلم' : 'Teacher'}</th><th className="th">{isAr ? 'التخصص' : 'Subject'}</th><th className="th">{isAr ? 'الفصول' : 'Classes'}</th><th className="th">{isAr ? 'الحمل' : 'Load'}</th><th className="th">{isAr ? 'المؤهل' : 'Qualification'}</th><th className="th">{isAr ? 'الحالة' : 'Status'}</th></tr>}>
          {TEACHERS.map(t => <tr key={t.id} className="hover:bg-ivory/60"><td className="td font-extrabold text-[11.5px]">{t.name}</td><td className="td">{isAr ? t.subject : t.subjectEn}</td><td className="td text-[10px]">{t.classes.join('، ')}</td><td className="td font-en font-bold">{t.load} {isAr ? 'حصة' : 'pds'}</td><td className="td text-[10px] text-charcoal/65">{t.specialty}</td><td className="td">{t.status === 'active' ? <span className="chip chip-green"><StatusDot tone="green" />{isAr ? 'على رأس العمل' : 'Active'}</span> : <span className="chip chip-gold"><StatusDot tone="gold" />{isAr ? 'إجازة' : 'Leave'}</span>}</td></tr>)}
        </TableShell></div>
      )}
      {tab === 'students' && (
        <div className="raven-card overflow-hidden"><TableShell minWidth={760} head={<tr><th className="th">{isAr ? 'الطالب' : 'Student'}</th><th className="th">{isAr ? 'الفصل' : 'Class'}</th><th className="th">{isAr ? 'المتوسط' : 'Average'}</th><th className="th">{isAr ? 'الحضور' : 'Attend.'}</th><th className="th">{isAr ? 'السلوك' : 'Behavior'}</th></tr>}>
          {STUDENTS.map(s => <tr key={s.id} className="hover:bg-ivory/60"><td className="td"><div className="font-bold text-[11.5px]">{s.name}</div><div className="text-[8.5px] font-mono text-charcoal/45">{s.id}</div></td><td className="td font-en font-bold">{CLASSES.find(c => c.id === s.classId)?.name}</td><td className="td font-en font-bold">{s.avg}%</td><td className="td font-en">{s.attendance}%</td><td className="td text-[10.5px]">{s.behavior}</td></tr>)}
        </TableShell></div>
      )}
      {tab === 'classes' && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {CLASSES.map(c => <div key={c.id} className="raven-card p-4"><div className="flex items-center justify-between"><span className="h-11 w-11 rounded-2xl bg-charcoal text-gold font-en font-extrabold text-[14px] flex items-center justify-center">{c.name}</span><span className="chip chip-blue">{c.room}</span></div><div className="mt-2.5 text-[11px] font-extrabold">{isAr ? c.grade : c.gradeEn}</div><div className="mt-1.5 flex items-center gap-3 text-[10px] text-charcoal/60"><span><b className="font-en">{c.students}</b> {isAr ? 'طالب' : 'students'}</span><span><b className="font-en">{c.avg}%</b> {isAr ? 'تحصيل' : 'avg'}</span><span><b className="font-en">{c.attendance}%</b> {isAr ? 'حضور' : 'attend.'}</span></div></div>)}
        </div>
      )}
      {tab === 'committees' && (
        <div className="raven-card overflow-hidden"><TableShell minWidth={680} head={<tr><th className="th">{isAr ? 'اللجنة / الفريق' : 'Committee / Team'}</th><th className="th">{isAr ? 'الرئيس' : 'Chair'}</th><th className="th">{isAr ? 'الأعضاء' : 'Members'}</th><th className="th">{isAr ? 'الاجتماعات' : 'Meetings'}</th><th className="th">{isAr ? 'الحالة' : 'Status'}</th></tr>}>
          {COMMITTEES.map(c => <tr key={c.name} className="hover:bg-ivory/60"><td className="td font-bold text-[11px]">{c.name}</td><td className="td text-[10.5px]">{c.chair}</td><td className="td font-en font-bold">{c.members}</td><td className="td font-en">{c.meetings}</td><td className="td"><span className="chip chip-green"><StatusDot tone="green" />{c.status}</span></td></tr>)}
        </TableShell></div>
      )}
      {tab === 'plans' && (
        <EmptyState icon={ListChecks} title={isAr ? '9 خطط مدرسية مرجعية' : '9 reference school plans'} hint={isAr ? 'الخطة التشغيلية، خطة التحسين، خطة الأنشطة، خطة الموهوبين، خطة التربية الخاصة، خطة الطوارئ، خطة التواصل، خطة التعلم الإلكتروني، خطة الجودة — وتُدار من مركز الخطة التشغيلية.' : 'Operational, improvement, activities, gifted, special-ed, emergency, communication, e-learning and quality plans — managed from the Operational Plan Center.'}
          action={<a href="#/principal/operational-plan" className="btn btn-primary !h-9">{isAr ? 'فتح مركز الخطة التشغيلية' : 'Open Operational Plan Center'}</a>} />
      )}
      {tab === 'docs' && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {LIBRARY_DOCS.slice(0, 6).map(d => <div key={d.id} className="raven-card p-4 flex items-start gap-3"><span className="h-10 w-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0"><FileText size={18} /></span><div className="min-w-0"><div className="text-[11px] font-bold leading-5">{d.title}</div><div className="text-[9px] text-charcoal/55 mt-1 flex items-center gap-2"><span className="font-mono">{d.type}</span>·<span>{d.updated}</span><span className="chip chip-green !h-4 !text-[8px]">{d.status}</span></div></div></div>)}
        </div>
      )}
      <Toaster toasts={toasts} />
    </div>
  );
}
