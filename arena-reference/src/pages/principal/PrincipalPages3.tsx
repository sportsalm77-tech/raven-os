/* ═════════════════════════════════════════════════════════════
   بوابة مدير المدرسة — Part 3
   5 السلوك والمواظبة · 6 مكتبة رافين · 7 الجدول المدرسي
   ═════════════════════════════════════════════════════════════ */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Mic, ShieldAlert, Sparkles, Library, CalendarDays, FileText,
  Check, X, Plus, Eye, Wand2, Download, AlertTriangle, ThumbsUp,
  Volume2, Clock, UserCheck,
} from 'lucide-react';
import { useLang, L } from '../../lib/i18n';
import { STUDENTS, CLASSES, TEACHERS, LIBRARY_DOCS, TIMETABLE_TODAY, BEHAVIOR_RECORDS, ATTENDANCE_MONTH } from '../../lib/data';
import {
  PageHead, KpiCard, CardTitle, TableShell, StatusDot, SampleBadge, Modal, EmptyState,
  useToasts, Toaster, BusyButton, useAsyncAction, SearchInput,
} from '../../components/raven';
import { VoiceEntryModal } from './PrincipalPages';

/* ═══════════════ 5.1 تسجيل الغياب اليدوي والصوتي ═══════════════ */
export function BehaviorAbsence() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [absent, setAbsent] = useState<string[]>(['ST-3006', 'ST-3011']);
  const [approved, setApproved] = useState<string[]>([]);
  const [history] = useState([
    { d: isAr ? 'اليوم 07:35' : 'Today 07:35', t: 'فهد الغامدي — غياب سادس متتالي — إشعار ولي الأمر أُرسل وتم الرد: «عذر مرضي 3 أيام»', kind: 'alert' as const },
    { d: isAr ? 'اليوم 07:34' : 'Today 07:34', t: 'دانا الشهري — غياب أول هذا الشهر — إشعار تلقائي', kind: 'info' as const },
    { d: isAr ? 'أمس 07:31' : 'Yesterday 07:31', t: 'رصد صوتي: «فصل 2-ب اكتمل الحضور» — اعتماد مشرف الطابور', kind: 'success' as const },
    { d: isAr ? 'أمس 13:00' : 'Yesterday 13:00', t: 'اعتُمد سجل اليوم — 96.2% حضور — وُزّع على ملفات الطلاب تلقائياً', kind: 'success' as const },
  ]);
  const toggle = (id: string) => setAbsent(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  return (
    <div>
      <PageHead icon={Mic} eyebrow={isAr ? 'السلوك والمواظبة · 5.1' : 'BEHAVIOR & ATTENDANCE · 5.1'}
        title={isAr ? 'تسجيل الغياب اليدوي والصوتي' : 'Manual & Voice Absence Recording'}
        desc={isAr ? 'رصد الطابور يدوياً أو بصوتك — ثم يراجع المشرف ويعتمد. الغياب المتكرر يُشعر ولي الأمر فوراً.' : 'Capture assembly attendance manually or by voice — supervisor reviews and approves. Repeated absence notifies guardians instantly.'}
        actions={<><SampleBadge /><button className="btn btn-gold !h-9" onClick={() => setVoiceOpen(true)}><Mic size={15} />{isAr ? 'رصد صوتي' : 'Voice capture'}</button></>} />
      <div className="grid grid-cols-3 gap-2 mb-4">
        {([['today', isAr ? 'اليوم' : 'Today'], ['week', isAr ? 'هذا الأسبوع' : 'This week'], ['month', isAr ? 'هذا الشهر' : 'This month']] as const).map(([v, l]) => (
          <button key={v} onClick={() => setPeriod(v)} className={`h-11 rounded-2xl text-[12px] font-bold border transition-all ${period === v ? 'bg-charcoal text-gold border-charcoal' : 'bg-white border-sand-soft text-charcoal/70'}`}>{l}</button>
        ))}
      </div>

      <div className="grid xl:grid-cols-5 gap-4">
        {/* Manual marking grid */}
        <div className="raven-card overflow-hidden xl:col-span-3">
          <CardTitle title={isAr ? 'رصد الاصطفاف الصباحي — 3-أ' : 'Morning Assembly Roll Call — 3A'} sub={isAr ? 'اضغط على الطالب لتسجيل غيابه — ثم سلّم للمشرف للاعتماد' : 'Tap a student to mark absent — then submit for supervisor approval'}
            action={<span className="chip chip-red">{absent.length} {isAr ? 'غائب' : 'absent'}</span>} />
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {STUDENTS.filter(s => s.classId === 'C-3A').concat(STUDENTS.filter(s => s.classId === 'C-1A').slice(0, 3)).map(s => {
              const isAbsent = absent.includes(s.id);
              const isApproved = approved.includes(s.id);
              return (
                <button key={s.id} onClick={() => toggle(s.id)} disabled={isApproved}
                  className={`rounded-2xl border px-3 py-2.5 flex items-center gap-2 text-start transition-all ${isAbsent ? 'border-red-300 bg-red-50' : 'border-sand-soft bg-ivory hover:border-green/40'} ${isApproved ? 'opacity-60' : ''}`}>
                  <span className={`h-9 w-9 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${isAbsent ? 'bg-red-500 text-white' : 'bg-white border border-sand text-charcoal/70'}`}>{s.name.split(' ')[0].charAt(0)}</span>
                  <span className="min-w-0"><span className="block text-[10px] font-bold leading-4 truncate">{s.name}</span><span className="block text-[8px] font-mono text-charcoal/50">{s.id} · {CLASSES.find(c => c.id === s.classId)?.name}</span></span>
                  {isAbsent && <X size={14} className="text-red-500 ms-auto shrink-0" />}
                </button>
              );
            })}
          </div>
          <div className="px-4 pb-4 flex flex-wrap items-center gap-2">
            <button className="btn btn-primary !h-9" onClick={() => { setApproved(absent); push(isAr ? `اعتُمد غياب ${absent.length} طالباً — أُشعرت الأسر تلقائياً` : `${absent.length} absences approved — guardians auto-notified`); }}><UserCheck size={15} />{isAr ? 'اعتماد الغياب وإشعار الأسر' : 'Approve & notify guardians'}</button>
            <button className="btn btn-outline !h-9" onClick={() => { setAbsent([]); push(isAr ? 'تم تصفير الرصد' : 'Roll call cleared', 'info'); }}>{isAr ? 'مسح الكل' : 'Clear all'}</button>
          </div>
        </div>

        {/* History + monthly strip */}
        <div className="xl:col-span-2 space-y-4">
          <div className="raven-card overflow-hidden">
            <CardTitle title={isAr ? 'آخر أحداث المواظبة' : 'Recent Conduct Events'} sub={isAr ? 'سجل لحظي غير قابل للتعديل' : 'Immutable live log'} />
            <div className="divide-y divide-sand-soft/70 max-h-64 overflow-y-auto scrollbar-thin">
              {history.map((h, i) => <div key={i} className="px-4 py-2.5 flex gap-2.5"><span className={`mt-0.5 h-6 w-6 rounded-lg flex items-center justify-center shrink-0 ${h.kind === 'alert' ? 'bg-red-50 text-red-500' : h.kind === 'success' ? 'bg-green-soft text-green-deep' : 'bg-blue-soft text-deepblue'}`}>{h.kind === 'alert' ? <AlertTriangle size={13} /> : h.kind === 'success' ? <Check size={13} strokeWidth={3.5} /> : <Clock size={13} />}</span><div><p className="text-[10px] leading-5 text-charcoal/85">{h.t}</p><span className="text-[8px] font-mono text-charcoal/45">{h.d}</span></div></div>)}
            </div>
          </div>
          <div className="raven-card p-4">
            <div className="kpi-label mb-2">{isAr ? 'آخر 24 يوماً — نسبة الحضور' : 'Last 24 days — attendance %'}</div>
            <div className="flex items-end gap-[3px] h-16">{ATTENDANCE_MONTH.map((v, i) => <div key={i} title={`${v}%`} className={`flex-1 rounded-sm ${v >= 95 ? 'bg-green' : v >= 90 ? 'bg-gold' : 'bg-red-400'}`} style={{ height: `${v}%` }} />)}</div>
            <div className="flex justify-between mt-1.5 text-[8px] font-mono text-charcoal/45"><span>{isAr ? '1 أكتوبر' : 'Oct 1'}</span><span>{isAr ? 'اليوم' : 'Today'}</span></div>
          </div>
        </div>
      </div>
      <VoiceEntryModal open={voiceOpen} onClose={() => setVoiceOpen(false)} purpose={isAr ? 'قل مثال: «فهد الغامدي غاب اليوم — عذر مرضي من ولي الأمر» — رافين يربط الغياب بملف الطالب' : 'Say e.g. “Fahad Al-Ghamdi absent today — medical excuse” — Raven links it to the student file'} />
      <Toaster toasts={toasts} />
    </div>
  );
}

/* ═══════════════ 5.2 تسجيل المخالفات السلوكية ═══════════════ */
export function BehaviorViolations() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const [open, setOpen] = useState(false);
  const [busy, run] = useAsyncAction(1300);
  const [form, setForm] = useState({ student: STUDENTS[5].name, type: 'تأخر صباحي', severity: 'الأولى' });
  const violations = BEHAVIOR_RECORDS.filter(b => b.type === 'مخالفة');
  const CATEGORIES = [
    { ar: 'تأخر صباحي', n: 14, max: 20 }, { ar: 'عدم إكمال الواجبات', n: 11, max: 20 }, { ar: 'إزعاج داخل الحصة', n: 6, max: 20 }, { ar: 'استخدام الهاتف', n: 4, max: 20 }, { ar: 'خلاف مع زميل', n: 3, max: 20 },
  ];
  return (
    <div>
      <PageHead icon={ShieldAlert} eyebrow={isAr ? 'السلوك والمواظبة · 5.2' : 'BEHAVIOR & ATTENDANCE · 5.2'}
        title={isAr ? 'تسجيل المخالفات السلوكية' : 'Behavior Violations'}
        desc={isAr ? 'توثيق المخالفة — تصنيفها — تطبيق الدرجة وفق لائحة السلوك — إشعار ولي الأمر عند الحاجة.' : 'Document — classify — apply the behavior ladder — guardian notification when thresholds trigger.'}
        actions={<><SampleBadge /><button className="btn btn-primary !h-9" onClick={() => setOpen(true)}><Plus size={15} />{isAr ? 'تسجيل مخالفة' : 'Record violation'}</button></>} />
      <div className="grid md:grid-cols-3 gap-4">
        <div className="raven-card overflow-hidden">
          <CardTitle title={isAr ? 'أكثر المخالفات تكراراً — أكتوبر' : 'Most Frequent — October'} />
          <div className="p-4 space-y-2.5">{CATEGORIES.map(c => <div key={c.ar}><div className="flex justify-between text-[10px] font-bold text-charcoal/70 mb-1"><span>{c.ar}</span><span className="font-en">{c.n}</span></div><div className="h-1.5 rounded-full bg-sand-soft overflow-hidden"><div className="h-full bg-gold rounded-full" style={{ width: `${(c.n / c.max) * 100}%` }} /></div></div>)}</div>
        </div>
        <div className="raven-card md:col-span-2 overflow-hidden">
          <CardTitle title={isAr ? 'آخر المخالفات المسجلة' : 'Latest Recorded Violations'} sub={isAr ? 'كل مخالفة تُربط بملف السلوك وإشعار الأسرة' : 'Each violation links to conduct file & family notice'} />
          <TableShell minWidth={560} head={<tr><th className="th">{isAr ? 'التاريخ' : 'Date'}</th><th className="th">{isAr ? 'التفصيل' : 'Detail'}</th><th className="th">{isAr ? 'المسجل' : 'By'}</th><th className="th">{isAr ? 'النقاط' : 'Pts'}</th></tr>}>
            {violations.map(v => <tr key={v.id} className="hover:bg-ivory/60"><td className="td text-[10px] text-charcoal/60">{v.date}</td><td className="td text-[10.5px] leading-5 max-w-72">{v.text}</td><td className="td text-[10px]">{v.by}</td><td className="td font-en font-extrabold text-red-600">{v.pts}</td></tr>)}
            <tr className="bg-gold-soft/40"><td className="td text-[10px] font-bold">اليوم 08:40</td><td className="td text-[10.5px]">فهد الغامدي — الغياب 6 أيام متتالية (مستوى 3) — <b>اجتماع مع ولي الأمر مطلوب</b></td><td className="td text-[10px]">{isAr ? 'النظام تلقائياً' : 'System auto'}</td><td className="td font-en font-extrabold text-red-600">-10</td></tr>
          </TableShell>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title={isAr ? 'تسجيل مخالفة سلوكية' : 'Record Violation'} sub={isAr ? 'اللائحة: المستوى 1 تُنبه — المستوى 2 تخصم — المستوى 3 تستدعي الأسرة' : 'Ladder: Level 1 warns — Level 2 deducts — Level 3 summons family'}
        footer={<><button className="btn btn-ghost" onClick={() => setOpen(false)}>{isAr ? 'إلغاء' : 'Cancel'}</button><BusyButton busy={busy} className="btn btn-primary" onClick={() => run(() => { setOpen(false); push(isAr ? 'سُجلت المخالفة وأُشعر ولي الأمر حسب المستوى' : 'Violation recorded — guardian notified per level'); })}>{isAr ? 'تسجيل واحتساب' : 'Record & apply ladder'}</BusyButton></>}>
        <div className="grid gap-3">
          <div><label className="raven-label">{isAr ? 'الطالب' : 'Student'}</label><select className="raven-input" value={form.student} onChange={e => setForm({ ...form, student: e.target.value })}>{STUDENTS.map(s => <option key={s.id}>{s.name}</option>)}</select></div>
          <div><label className="raven-label">{isAr ? 'نوع المخالفة' : 'Violation type'}</label><select className="raven-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option>{isAr ? 'تأخر صباحي' : 'Morning lateness'}</option><option>{isAr ? 'عدم إكمال الواجبات' : 'Missing homework'}</option><option>{isAr ? 'إزعاج داخل الحصة' : 'Disruption'}</option><option>{isAr ? 'استخدام الهاتف' : 'Phone use'}</option><option>{isAr ? 'خلاف مع زميل' : 'Peer conflict'}</option></select></div>
          <div><label className="raven-label">{isAr ? 'المستوى' : 'Level'}</label><div className="flex gap-1.5">{['الأولى', 'الثانية', 'الثالثة'].map(s => <button key={s} onClick={() => setForm({ ...form, severity: s })} className={`h-9 px-4 rounded-xl text-[11px] font-bold border ${form.severity === s ? 'bg-charcoal text-gold border-charcoal' : 'bg-white border-sand-soft'}`}>{isAr ? `المستوى ${s}` : `Level ${s}`}</button>)}</div></div>
        </div>
      </Modal>
      <Toaster toasts={toasts} />
    </div>
  );
}

/* ═══════════════ 5.3 تسجيل السلوك المتميز ═══════════════ */
export function BehaviorPositive() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const positive = BEHAVIOR_RECORDS.filter(b => b.type === 'متميز');
  const leaders = [...STUDENTS].sort((a, b) => b.avg - a.avg).slice(0, 5);
  return (
    <div>
      <PageHead icon={Sparkles} eyebrow={isAr ? 'السلوك والمواظبة · 5.3' : 'BEHAVIOR & ATTENDANCE · 5.3'}
        title={isAr ? 'تسجيل السلوك المتميز' : 'Positive Behavior Recognition'}
        desc={isAr ? 'التوثيق أول بأول — كل موقف متميز يُضاف لرصيد الطالب ويُحتسب في شهادة التميز.' : 'Document as it happens — every outstanding moment adds to the student’s balance and excellence certificate.'}
        actions={<><SampleBadge /><button className="btn btn-gold !h-9" onClick={() => push(isAr ? 'أُضيفت 5 نقاط لسجل سارة القحطاني وأُشعر ولي الأمر بالموقف الرائع' : '+5 points to Sara Al-Qahtani — guardian notified of the wonderful moment')}><Plus size={15} />{isAr ? 'موقف متميز سريع' : 'Quick recognition'}</button></>} />
      <div className="grid md:grid-cols-3 gap-4">
        <div className="raven-card md:col-span-2 overflow-hidden">
          <CardTitle title={isAr ? 'المواقف المتميزة الموثقة' : 'Documented Positive Moments'} sub={isAr ? 'آخر 30 يوم — تُجمع تلقائياً في شهادة التميز' : 'Last 30 days — auto-compiled into excellence certificates'} />
          <div className="divide-y divide-sand-soft/70">{positive.map(p => <div key={p.id} className="px-4 py-3 flex gap-3"><span className="h-9 w-9 rounded-xl bg-gold-soft text-gold-deep flex items-center justify-center shrink-0"><ThumbsUp size={16} /></span><div className="min-w-0"><p className="text-[11px] leading-5 text-charcoal/90">{p.text}</p><div className="text-[8.5px] text-charcoal/55 mt-1 flex gap-2"><span>{p.date}</span>·<span>{p.by}</span><span className="font-en font-extrabold text-green-deep">+{p.pts} {isAr ? 'نقطة' : 'pts'}</span></div></div></div>)}</div>
        </div>
        <div className="raven-card overflow-hidden">
          <CardTitle title={isAr ? 'لوحة رصيد النقاط — الأعلى' : 'Points Leaderboard'} sub={isAr ? 'الفصل الثاني · يُحدّث لحظياً' : 'Term 2 · live'} />
          <div className="p-3 space-y-1.5">{leaders.map((s, i) => <div key={s.id} className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 hover:bg-ivory"><span className={`h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${i === 0 ? 'bg-gold text-charcoal' : 'bg-sand-soft text-charcoal/60'}`}>{i + 1}</span><span className="text-[10.5px] font-bold flex-1 truncate">{s.name}</span><span className="font-en font-extrabold text-[12px] text-green-deep">{Math.round(s.avg)}</span></div>)}</div>
        </div>
      </div>
      <Toaster toasts={toasts} />
    </div>
  );
}

/* ═══════════════ 6 · مكتبة رافين ═══════════════ */
export function LibraryPage() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('الكل');
  const [genFor, setGenFor] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, run] = useAsyncAction(2000);
  const cats = ['الكل', 'المحاضر', 'التقارير', 'شواهد الأداء', 'شواهد التدريس', 'الخطط', 'التكليفات', 'الاعتمادات'];
  const filtered = LIBRARY_DOCS.filter(d => (cat === 'الكل' || d.category === cat) && (!query || d.title.includes(query)));
  const statusChip = { 'معتمد': 'chip-green', 'قيد المراجعة': 'chip-gold', 'مسودة': 'chip-sand' } as const;
  const genTarget = LIBRARY_DOCS.find(d => d.id === genFor);
  return (
    <div>
      <PageHead icon={Library} eyebrow={isAr ? 'القسم 6' : 'SECTION 6'} title={isAr ? 'مكتبة رافين' : 'Raven Library'}
        desc={isAr ? 'قاعدة الشواهد والوثائق الذكية — ابحث، عاين، وولّد أي وثيقة من بياناتك بنقرة واحدة. «أدخل بياناتك مرة، ودع رافين يبني ملفاتك».' : 'The intelligent evidence library — search, preview, or generate any document from your data in one click.'}
        actions={<><SampleBadge /><button className="btn btn-gold !h-9" onClick={() => filePrompt(push, isAr)}><Wand2 size={15} />{isAr ? 'توليد وثيقة من البيانات' : 'Generate from data'}</button></>} />
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <SearchInput value={query} onChange={setQuery} placeholder={isAr ? 'ابحث في 23 وثيقة وشاهد…' : 'Search 23 documents & evidence…'} />
        <div className="flex gap-1.5 flex-wrap">{cats.map(c => <button key={c} onClick={() => setCat(c)} className={`h-9 px-3 rounded-xl text-[10.5px] font-bold border ${cat === c ? 'bg-charcoal text-gold border-charcoal' : 'bg-white border-sand-soft text-charcoal/70'}`}>{c}</button>)}</div>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map(d => (
          <div key={d.id} className="raven-card p-4 flex flex-col gap-2.5 hover:border-sand transition-colors">
            <div className="flex items-start gap-3">
              <span className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${d.type.startsWith('MP4') ? 'bg-deepblue text-ivory' : d.type === 'DOCX' ? 'bg-blue-soft text-deepblue' : 'bg-red-50 text-red-500'}`}>{d.type.startsWith('MP4') ? <Volume2 size={18} /> : <FileText size={19} />}</span>
              <div className="min-w-0"><div className="text-[11px] font-bold leading-5">{d.title}</div><div className="text-[8.5px] text-charcoal/55 mt-1 font-mono">{d.id} · {d.type} · {d.pages} {isAr ? 'صفحة' : 'pp.'}</div></div>
            </div>
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-sand-soft/70">
              <span className="text-[9px] text-charcoal/55">{d.updated} · {d.category}</span>
              <span className={`chip ${statusChip[d.status]}`}>{d.status}</span>
            </div>
            <div className="flex gap-1.5">
              <button className="btn btn-outline !h-8 !text-[10px] flex-1 justify-center" onClick={() => setPreview(d.title)}><Eye size={12} />{isAr ? 'معاينة' : 'Preview'}</button>
              <button className="btn btn-dark !h-8 !text-[10px] flex-1 justify-center" onClick={() => setGenFor(d.id)}><Wand2 size={12} />{isAr ? 'توليد نسخة' : 'Generate'}</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="sm:col-span-2 xl:col-span-3 raven-card"><EmptyState icon={Library} title={isAr ? 'لا توجد وثائق مطابقة' : 'No matching documents'} hint={isAr ? 'جرّب كلمة أخرى أو غيّر التصنيف' : 'Try another keyword or category'} /></div>}
      </div>

      {/* Preview modal */}
      <Modal open={!!preview} onClose={() => setPreview(null)} wide title={preview ?? ''} sub={isAr ? 'معاينة الوثيقة — النسخة المعتمدة' : 'Document preview — approved version'}
        footer={<><button className="btn btn-outline" onClick={() => setPreview(null)}>{isAr ? 'إغلاق' : 'Close'}</button><button className="btn btn-primary" onClick={() => push(isAr ? 'بدأ التحميل: PDF — ختم رقمي صالح' : 'Download started: PDF — valid digital seal')}><Download size={14} />PDF</button></>}>
        <div className="rounded-2xl border border-sand bg-white p-6 text-center shadow-inner">
          <div className="mx-auto h-12 w-12 rounded-xl bg-charcoal flex items-center justify-center text-gold font-en font-extrabold mb-3">R</div>
          <div className="text-[13px] font-black">{isAr ? 'مؤسسة رافيين للخدمات التعليمية' : 'Rafeeen Foundation for Educational Services'}</div>
          <div className="text-[9px] text-gold-deep font-bold mt-0.5">«{isAr ? 'نحن نصنع الفرق' : 'We Make the Difference'}»</div>
          <div className="my-4 h-px bg-sand" />
          <div className="text-[11px] font-bold leading-7 text-charcoal/85">{preview}</div>
          <div className="mt-4 text-[9px] font-mono text-charcoal/45">{isAr ? 'ختم رقمي: RVN-2026-10-29-8F3A · صالح للتحقق عبر موقع رافيين' : 'Digital seal: RVN-2026-10-29-8F3A · verifiable on Rafeeen registry'}</div>
        </div>
      </Modal>

      {/* Generate modal */}
      <Modal open={!!genFor} onClose={() => setGenFor(null)} title={isAr ? 'توليد وثيقة من بيانات رافين' : 'Generate Document from Raven Data'} sub={genTarget ? `${isAr ? 'القالب:' : 'Template:'} ${genTarget.title}` : ''}
        footer={<><button className="btn btn-ghost" onClick={() => setGenFor(null)}>{isAr ? 'إلغاء' : 'Cancel'}</button><BusyButton busy={busy} className="btn btn-gold" onClick={() => run(() => { setGenFor(null); push(isAr ? 'وُلّّدت الوثيقة وحُفظت في مكتبة رافين — جاهزة للتوقيع والختم' : 'Document generated & saved to Raven Library — ready for stamp'); })}><Wand2 size={14} />{isAr ? 'توليد وحفظ في المكتبة' : 'Generate & save'}</BusyButton></>}>
        <div className="grid gap-3">
          <div><label className="raven-label">{isAr ? 'الفترة' : 'Period'}</label><select className="raven-input"><option>{isAr ? 'الفصل الدراسي الثاني — 2026' : 'Term 2 — 2026'}</option><option>{isAr ? 'أكتوبر 2026' : 'October 2026'}</option><option>{isAr ? 'العام الدراسي كاملاً' : 'Full academic year'}</option></select></div>
          <div><label className="raven-label">{isAr ? 'التوقيع' : 'Signature'}</label><select className="raven-input"><option>{isAr ? 'مدير المدرسة — أ. خالد المطيري' : 'Principal — Khalid Al-Mutairi'}</option><option>{isAr ? 'بدون توقيع (مسودة)' : 'No signature (draft)'}</option></select></div>
          <p className="text-[9px] leading-5 text-charcoal/55 bg-gold-soft/50 border border-gold/30 rounded-xl px-3 py-2">{isAr ? 'تُسحب كل الأرقام والأسماء من قاعدة البيانات الموحدة — لا حاجة لإعادة الكتابة.' : 'Every figure and name is pulled from the unified data layer — zero retyping.'}</p>
        </div>
      </Modal>
      <Toaster toasts={toasts} />
    </div>
  );
}
function filePrompt(push: (m: string, k?: 'success' | 'info' | 'error') => void, isAr: boolean) {
  push(isAr ? 'اختر قالباً من البطاقات ثم «توليد نسخة»' : 'Pick a template card then “Generate”', 'info');
}

/* ═══════════════ 7 · الجدول المدرسي ═══════════════ */
export function TimetablePage() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const days = isAr ? ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'];
  const grid: Record<string, string[]> = {
    [days[0]]: ['3-أ رياضيات', '—', '1-أ رياضيات', '2-أ رياضيات', '—', 'إشراف ملعب', 'تصحيح'],
    [days[1]]: ['1-أ رياضيات', '2-أ رياضيات', '3-أ رياضيات', '—', '1-أ رياضيات', '—', 'تحضير'],
    [days[2]]: ['2-أ رياضيات', '3-أ رياضيات', '—', '1-أ رياضيات', '2-أ رياضيات', '—', 'تصحيح'],
    [days[3]]: ['—', '1-أ رياضيات', '2-أ رياضيات', '3-أ رياضيات', '—', 'نادي رياضيات', 'تحضير'],
    [days[4]]: ['3-أ رياضيات', '1-أ رياضيات', '—', '—', '2-أ رياضيات', '—', 'مذاكرة جماعية'],
  };
  return (
    <div>
      <PageHead icon={CalendarDays} eyebrow={isAr ? 'القسم 7' : 'SECTION 7'} title={isAr ? 'الجدول المدرسي' : 'School Timetable'}
        desc={isAr ? 'الجدول الأسبوعي الموحد — من الحصص الاحتياطية إلى الإشراف والمنافذ. تحديث لحظي للجميع.' : 'The unified weekly schedule — from reserve periods to supervision posts. Instant push to everyone.'}
        actions={<><SampleBadge /><button className="btn btn-primary !h-9" onClick={() => push(isAr ? 'نُشر الجدول المعتمد — وصل لكل المعلمين والأسر' : 'Approved timetable published — pushed to all staff & families')}>{isAr ? 'نشر الجدول للجميع' : 'Publish to all'}</button></>} />
      <div className="raven-card overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[860px]">
          <thead><tr><th className="th w-28">{isAr ? 'الحصة / اليوم' : 'Period / Day'}</th>{days.map(d => <th key={d} className="th text-center">{d}</th>)}</tr></thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6, 7].map(p => (
              <tr key={p} className="hover:bg-ivory/50">
                <td className="td"><div className="font-en font-extrabold text-[12px]">{isAr ? `الحصة ${p}` : `Period ${p}`}</div><div className="text-[8.5px] font-mono text-charcoal/50">{TIMETABLE_TODAY[p - 1]?.time}</div></td>
                {days.map(d => {
                  const v = grid[d][p - 1];
                  const current = d === days[0] && p === 4;
                  return <td key={d} className={`td text-center text-[9.5px] font-bold ${v === '—' ? 'text-charcoal/30' : ''} ${current ? 'bg-gold-soft/70 outline outline-2 outline-gold' : ''}`}>{v === '—' ? '·' : v}{current && <span className="block text-[8px] text-gold-deep font-black mt-0.5">{isAr ? 'الآن' : 'NOW'}</span>}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid sm:grid-cols-3 gap-3 mt-4">
        <KpiCard tone="blue" icon={CalendarDays} label={isAr ? 'حصص أسبوعية — أ. سارة الحربي' : 'Weekly periods — Sarah'} value="18" />
        <KpiCard label={isAr ? 'مناصب إشراف' : 'Supervision posts'} value="3" foot={isAr ? 'ملعب + مقصف + منفذ' : 'Playground + canteen + gate'} />
        <KpiCard tone="gold" label={isAr ? 'فراغات تمت تغطيتها' : 'Covered gaps'} value="11" foot={isAr ? 'بهذا الفصل — متوسط 5 دقائق لاستجابة التغطية' : 'This term — avg 5-min cover response'} />
      </div>
      <Toaster toasts={toasts} />
    </div>
  );
}
