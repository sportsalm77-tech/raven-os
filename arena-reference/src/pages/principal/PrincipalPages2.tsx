/* ═════════════════════════════════════════════════════════════
   بوابة مدير المدرسة — Part 2
   التكليفات · الخطة التشغيلية · قياس الأثر · الشؤون · الفصول
   المعلمون · الطلاب · الاختبارات · السلوك والمواظبة
   ═════════════════════════════════════════════════════════════ */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Info, ClipboardCheck, ListChecks, Target, Landmark, DoorOpen, UsersRound,
  GraduationCap, PenLine, ClipboardList, Mic, ShieldAlert, Sparkles, Check, CheckCircle2,
  X, Plus, TrendingUp, ArrowLeft, ArrowRight, Archive, GaugeCircle, BookOpenCheck,
  ShieldCheck, PhoneCall, UserPlus, FolderOpen, Clock, AlertTriangle, Lock, ThumbsUp,
  MessageSquare, CalendarDays, Filter, Download, BadgeCheck, FileWarning, ChevronDown, ScanLine,
} from 'lucide-react';
import { useLang, L } from '../../lib/i18n';
import { CLASSES, STUDENTS, TEACHERS, TASKS, INITIATIVES, LIBRARY_DOCS, COMMITTEES, BEHAVIOR_RECORDS } from '../../lib/data';
import {
  PageHead, KpiCard, CardTitle, ProgressBar, Donut, Bars, Modal, EmptyState, TableShell,
  StatusDot, SampleBadge, useToasts, Toaster, BusyButton, useAsyncAction, SearchInput, ExportButton,
} from '../../components/raven';
import { VoiceEntryModal } from './PrincipalPages';

const prioChip = { 'عالية': 'chip-red', 'متوسطة': 'chip-gold', 'منخفضة': 'chip-sand' } as const;

/* ═══════════════ 1.3 مركز التكليفات والمهام ═══════════════ */
export function AssignmentsCenter() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const [filter, setFilter] = useState<'all' | 'inprogress' | 'pending' | 'done'>('all');
  const [create, setCreate] = useState(false);
  const [busy, run] = useAsyncAction(1400);
  const [form, setForm] = useState({ title: '', assignee: '', due: '', priority: 'متوسطة' });
  const filtered = TASKS.filter(t => filter === 'all' || t.status === filter);
  const counts = { all: TASKS.length, inprogress: TASKS.filter(t => t.status === 'inprogress').length, pending: TASKS.filter(t => t.status === 'pending').length, done: TASKS.filter(t => t.status === 'done').length };
  return (
    <div>
      <PageHead icon={ClipboardCheck} eyebrow={isAr ? 'القيادة المدرسية · 1.3' : 'SCHOOL LEADERSHIP · 1.3'}
        title={isAr ? 'مركز التكليفات والمهام' : 'Assignments & Tasks Center'}
        desc={isAr ? 'كل تكليف رسمي يصدر من الإدارة — من الإسناد إلى المتابعة حتى الإنجاز المُوثّق.' : 'Every official mandate issued by leadership — from assignment to follow-up to documented completion.'}
        actions={<><SampleBadge /><button className="btn btn-primary !h-9" onClick={() => setCreate(true)}><Plus size={15} />{isAr ? 'تكليف جديد' : 'New Assignment'}</button></>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[[isAr ? 'الكل' : 'All', counts.all, 'default'], [isAr ? 'قيد التنفيذ' : 'In progress', counts.inprogress, 'gold'], [isAr ? 'معلّقة' : 'Pending', counts.pending, 'red'], [isAr ? 'مكتملة' : 'Completed', counts.done, 'green']].map(([l, v, tone]) => (
          <KpiCard key={l as string} tone={tone as 'default' | 'gold' | 'red' | 'green'} label={l as string} value={v as number} icon={ClipboardCheck} />
        ))}
      </div>
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {([['all', isAr ? 'الكل' : 'All'], ['inprogress', isAr ? 'قيد التنفيذ' : 'In Progress'], ['pending', isAr ? 'معلّقة' : 'Pending'], ['done', isAr ? 'مكتملة' : 'Completed']] as const).map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} className={`h-9 px-4 rounded-xl text-[11.5px] font-bold border transition-all ${filter === v ? 'bg-charcoal text-gold border-charcoal' : 'bg-white border-sand-soft text-charcoal/70 hover:border-sand'}`}>{l} <span className="font-en text-[9px] opacity-70">{counts[v]}</span></button>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-3">
        {filtered.map(tk => (
          <div key={tk.id} className="raven-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1"><span className="font-mono text-[9px] text-charcoal/45">{tk.id}</span><span className={`chip ${prioChip[tk.priority]}`}>{tk.priority}</span>{tk.status === 'done' && <span className="chip chip-green"><Check size={9} strokeWidth={4} />{isAr ? 'مكتملة' : 'Done'}</span>}</div>
                <h3 className="text-[12px] font-extrabold leading-6">{tk.title}</h3>
                <div className="text-[9.5px] text-charcoal/55 mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5"><span className="flex items-center gap-1"><Clock size={10} />{tk.due}</span><span>{isAr ? 'المسؤول: ' : 'Owner: '}<b>{tk.assignee}</b></span></div>
              </div>
              {tk.status !== 'done' && <button className="btn btn-outline !h-8 !px-2.5 !text-[10px] shrink-0" onClick={() => push(isAr ? 'تم تسجيل إنجاز المهمة وإشعار الإدارة' : 'Task completion recorded & leadership notified')}><Check size={12} />{isAr ? 'إنجاز' : 'Done'}</button>}
            </div>
            <div className="flex items-center gap-2 mt-3"><ProgressBar value={tk.progress} tone={tk.progress === 100 ? 'green' : tk.progress > 50 ? 'gold' : 'blue'} /><span className="text-[9.5px] font-en font-bold text-charcoal/55 w-8">{tk.progress}%</span></div>
          </div>
        ))}
        {filtered.length === 0 && <div className="lg:col-span-2 raven-card"><EmptyState icon={ClipboardCheck} title={isAr ? 'لا توجد مهام في هذا التصنيف' : 'No tasks in this filter'} hint={isAr ? 'أنشئ تكليفاً جديداً ليظهر هنا' : 'Create a new assignment to see it here'} /></div>}
      </div>
      <Modal open={create} onClose={() => setCreate(false)} title={isAr ? 'إصدار تكليف رسمي' : 'Issue Official Assignment'} sub={isAr ? 'يصل إشعار فوري للمكلف عبر تطبيقه ورسائله' : 'Assignee is notified instantly via app & SMS'}
        footer={<><button className="btn btn-ghost" onClick={() => setCreate(false)}>{isAr ? 'إلغاء' : 'Cancel'}</button><BusyButton busy={busy} className="btn btn-primary" onClick={() => run(() => { setCreate(false); push(isAr ? `صدر التكليف إلى ${form.assignee || 'المكلف'} وأُشعر فورياً` : `Assignment issued to ${form.assignee || 'assignee'} & notified`); setForm({ title: '', assignee: '', due: '', priority: 'متوسطة' }); })}>{isAr ? 'إصدار وإرسال الإشعار' : 'Issue & notify'}</BusyButton></>}>
        <div className="grid gap-3">
          <div><label className="raven-label">{isAr ? 'نص التكليف' : 'Assignment text'} *</label><textarea className="raven-input !h-20 py-2.5" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder={isAr ? 'مثال: إعداد خطة استضافة المشرف العام…' : 'e.g. Prepare supervisor visit hosting plan…'} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="raven-label">{isAr ? 'المكلف' : 'Assignee'} *</label><select className="raven-input" value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })}><option value="">{isAr ? 'اختر…' : 'Select…'}</option>{TEACHERS.map(t => <option key={t.id}>{t.name}</option>)}<option>{isAr ? 'لجنة الصحة المدرسية' : 'Health Committee'}</option><option>{isAr ? 'لجنة الموهوبين' : 'Gifted Committee'}</option></select></div>
            <div><label className="raven-label">{isAr ? 'الموعد النهائي' : 'Due date'}</label><input type="date" className="raven-input" value={form.due} onChange={e => setForm({ ...form, due: e.target.value })} /></div>
          </div>
          <div><label className="raven-label">{isAr ? 'الأولوية' : 'Priority'}</label><div className="flex gap-1.5">{['عالية', 'متوسطة', 'منخفضة'].map(p => <button key={p} onClick={() => setForm({ ...form, priority: p })} className={`h-9 px-4 rounded-xl text-[11px] font-bold border ${form.priority === p ? 'bg-charcoal text-gold border-charcoal' : 'bg-white border-sand-soft'}`}>{p}</button>)}</div></div>
        </div>
      </Modal>
      <Toaster toasts={toasts} />
    </div>
  );
}

/* ═══════════════ 1.4 مركز الخطة التشغيلية ═══════════════ */
export function OperationalPlan() {
  const { isAr, dir } = useLang();
  const { toasts, push } = useToasts();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const chain = [
    { ar: 'الهدف الاستراتيجي', en: 'Strategic Goal', v: isAr ? 'رفع متوسط التحصيل إلى 90%' : 'Lift achievement avg. to 90%', done: true },
    { ar: 'المبادرة', en: 'Initiative', v: isAr ? 'التعلم القائم على المشاريع في العلوم' : 'Project-based learning in science', done: true },
    { ar: 'المهمة', en: 'Task', v: isAr ? 'تدريب 12 معلماً + إطلاق 6 مشاريع' : 'Train 12 teachers + launch 6 projects', done: true },
    { ar: 'المؤشر', en: 'Indicator', v: isAr ? 'نسبة الطلاب المشاركين ≥ 85%' : 'Participating students ≥ 85%', done: false },
    { ar: 'الشاهد', en: 'Evidence', v: isAr ? 'فيديوهات الحصص + صور النماذج + استبانات الأسر' : 'Lesson videos + models + family surveys', done: false },
    { ar: 'التقدم', en: 'Progress', v: '58%', done: false },
  ];
  return (
    <div>
      <PageHead icon={ListChecks} eyebrow={isAr ? 'القيادة المدرسية · 1.4' : 'SCHOOL LEADERSHIP · 1.4'}
        title={isAr ? 'مركز الخطة التشغيلية' : 'Operational Plan Center'}
        desc={isAr ? 'داخل الهيكل القيادي المعتمد — الأهداف مرتبطة بالمبادرات والمهام والمؤشرات والشواهد ومقاييس التقدم.' : 'Within the approved leadership structure — objectives wired to initiatives, tasks, indicators, evidence and progress.'}
        actions={<><SampleBadge /><ExportButton label={isAr ? 'PDF' : 'PDF'} /></>} />

      {/* Objective → Initiative → Task → Indicator → Evidence → Progress */}
      <div className="raven-card mb-4 p-4">
        <div className="text-[10px] font-extrabold text-charcoal/55 mb-2">{isAr ? 'سلسلة الربط الكاملة — اضغط أي عنصر لاستعراضه' : 'The full linkage chain — click any element to inspect'}</div>
        <div className="flex items-stretch gap-1 overflow-x-auto scrollbar-thin pb-1">
          {chain.map((c, i) => (
            <div key={i} className="flex items-center gap-1 shrink-0">
              <button onClick={() => push(`${isAr ? c.ar : c.en}: ${c.v}`, 'info')} className={`w-40 rounded-2xl border px-3 py-2.5 text-start transition-all ${c.done ? 'border-green/30 bg-green-mist' : i === 3 ? 'border-gold/50 bg-gold-soft/50 ring-1 ring-gold/40' : 'border-sand-soft bg-white hover:border-sand'}`}>
                <div className="text-[8.5px] font-extrabold uppercase tracking-wide text-green-deep">{isAr ? c.ar : c.en}</div>
                <div className="text-[9.5px] font-bold leading-4 mt-1 text-charcoal/85 line-clamp-2">{c.v}</div>
              </button>
              {i < chain.length - 1 && <Arrow size={14} className="text-sand shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-4">
        <div className="raven-card xl:col-span-2 overflow-hidden">
          <CardTitle title={isAr ? 'المبادرات والمشاريع — الفصل الثاني' : 'Initiatives — Term 2'} sub={isAr ? '4 مبادرات نشطة مرتبطة بمؤشرات معتمدة' : '4 active initiatives wired to approved indicators'} />
          <div className="divide-y divide-sand-soft/70">
            {INITIATIVES.map(ini => (
              <div key={ini.id} className="px-5 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2"><span className="font-mono text-[9px] text-charcoal/45">{ini.id}</span><span className="chip chip-sand">{ini.due}</span></div>
                    <h3 className="text-[11.5px] font-extrabold mt-1 leading-5">{ini.name}</h3>
                    <div className="text-[9px] text-charcoal/55 mt-1">{isAr ? 'المسؤول: ' : 'Owner: '}<b>{ini.owner}</b> · {isAr ? 'المؤشر: ' : 'Indicator: '}{ini.indicator}</div>
                  </div>
                  <div className="text-end shrink-0"><div className="font-en font-extrabold text-[17px] text-charcoal">{ini.progress}%</div></div>
                </div>
                <div className="mt-2"><ProgressBar value={ini.progress} tone={ini.progress > 75 ? 'green' : ini.progress > 45 ? 'gold' : 'red'} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="raven-card overflow-hidden">
          <CardTitle title={isAr ? 'ملخص الخطة التشغيلية' : 'Operational Plan Summary'} sub={isAr ? 'الفصل الدراسي الأول — 2026' : 'Term 1 — 2026'} />
          <div className="p-5 flex flex-col items-center">
            <Donut value={68} size={132} label={isAr ? 'إنجاز الخطة' : 'Plan completion'} color="#08794F" />
            <div className="w-full mt-4 space-y-2 text-[10.5px]">
              {[[isAr ? 'اهداف استراتيجية' : 'Strategic goals', '4 / 4'], [isAr ? 'مبادرات نشطة' : 'Active initiatives', '4'], [isAr ? 'مؤشرات معتمدة' : 'Approved indicators', '16 / 21'], [isAr ? 'شواهد مؤرشفة' : 'Evidence archived', '128'], [isAr ? 'مراجعات مجدولة' : 'Reviews scheduled', isAr ? 'كل أسبوعين — القادمة 12 نوفمبر' : 'Bi-weekly — next Nov 12']].map(([l, v]) => (
                <div key={l as string} className="flex items-center justify-between border-b border-sand-soft/60 pb-1.5"><span className="text-charcoal/65">{l}</span><span className="font-en font-bold">{v}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Toaster toasts={toasts} />
    </div>
  );
}

/* ═══════════════ 1.5 مركز قياس الأثر ═══════════════ */
export function ImpactCenter() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const [survey, setSurvey] = useState(false);
  return (
    <div>
      <PageHead icon={Target} eyebrow={isAr ? 'القيادة المدرسية · 1.5' : 'SCHOOL LEADERSHIP · 1.5'}
        title={isAr ? 'مركز قياس الأثر' : 'Impact Measurement Center'}
        desc={isAr ? 'هل أحدثت مبادراتنا فرقاً حقيقياً؟ قبل/بعد على مستوى الطالب، المعلم، الأسرة والمؤسسة.' : 'Did our initiatives move the needle? Before/after at student, teacher, family and institution level.'}
        actions={<><SampleBadge /><button className="btn btn-primary !h-9" onClick={() => setSurvey(true)}><GaugeCircle size={15} />{isAr ? 'إطلاق قياس جديد' : 'Launch measurement'}</button></>} />
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { ar: 'أثر الطالب — التحصيل', en: 'Student impact — achievement', before: 82.1, after: 88.4, unit: '%' },
          { ar: 'أثر الطالب — الحضور', en: 'Student impact — attendance', before: 93.5, after: 96.2, unit: '%' },
          { ar: 'أثر المعلم — رضا وظيفي', en: 'Teacher impact — job satisfaction', before: 71, after: 84, unit: '%' },
          { ar: 'أثر الأسرة — شراكة مفعلة', en: 'Family impact — engaged partnership', before: 58, after: 86, unit: '%' },
        ].map((m, i) => (
          <div key={i} className="raven-card p-4">
            <div className="kpi-label">{isAr ? m.ar : m.en}</div>
            <div className="mt-2 flex items-end gap-2"><span className="text-[24px] leading-7 font-black font-en text-charcoal">{m.after}{m.unit}</span><span className="chip chip-green mb-1"><TrendingUp size={10} />+{(m.after - m.before).toFixed(1)}</span></div>
            <div className="mt-2 text-[9.5px] text-charcoal/55">{isAr ? 'الأساس: أبريل 2026' : 'Baseline: Apr 2026'} <span className="font-en">{m.before}{m.unit}</span></div>
            <div className="mt-2"><ProgressBar value={m.after} tone="green" /></div>
          </div>
        ))}
      </div>
      <div className="raven-card mt-4 overflow-hidden">
        <CardTitle title={isAr ? 'أدوات قياس الأثر المعتمدة' : 'Approved Impact Instruments'} sub={isAr ? 'استبانات وأدوات قياس مرتبطة بأهداف الخطة التشغيلية' : 'Surveys wired to operational plan objectives'} />
        <TableShell minWidth={720} head={<tr><th className="th">{isAr ? 'الأداة' : 'Instrument'}</th><th className="th">{isAr ? 'العينة' : 'Sample'}</th><th className="th">{isAr ? 'الاستجابة' : 'Response'}</th><th className="th">{isAr ? 'آخر قياس' : 'Last run'}</th><th className="th">{isAr ? 'القرار المبني عليه' : 'Resulting decision'}</th></tr>}>
          {[
            [isAr ? 'استبانة رضا أولياء الأمور — منتصف الفصل' : 'Parent satisfaction — mid-term', '1,420 أسرة', '78%', isAr ? 'قبل أسبوعين' : '2 weeks ago', isAr ? 'تمديد ساعات الرد على الأسر — 4 مساءً' : 'Extended family response hours — 4 PM'],
            [isAr ? 'قياس الاحتراق الوظيفي للمعلمين (MBI)' : 'Teacher burnout (MBI)', '68 معلماً', '91%', isAr ? 'قبل شهر' : '1 month ago', isAr ? 'تخفيف الأعمال غير التدريسية يوم الخميس' : 'Reduced non-teaching load on Thursdays'],
            [isAr ? 'استبانة الانتماء المدرسي للطلاب (PSSM)' : 'Student belonging (PSSM)', '842 طالباً', '84%', isAr ? 'قبل شهرين' : '2 months ago', isAr ? 'إطلاق نادي «سفراء رافين» لكل فصل' : 'Launched “Raven Ambassadors” in every class'],
          ].map((r, i) => <tr key={i} className="hover:bg-ivory/60"><td className="td font-bold text-[11px] max-w-56">{r[0]}</td><td className="td text-[10.5px]">{r[1]}</td><td className="td font-en font-bold">{r[2]}</td><td className="td text-[10px] text-charcoal/60">{r[3]}</td><td className="td text-[10px] text-charcoal/75 max-w-64">{r[4]}</td></tr>)}
        </TableShell>
      </div>
      <Modal open={survey} onClose={() => setSurvey(false)} title={isAr ? 'إطلاق قياس أثر جديد' : 'Launch New Impact Measurement'} sub={isAr ? 'اختر الأداة والعينة — النتائج تعود مباشرة إلى مراكز القرار' : 'Pick instrument & sample — results flow straight to decision centers'}
        footer={<><button className="btn btn-ghost" onClick={() => setSurvey(false)}>{isAr ? 'إلغاء' : 'Cancel'}</button><button className="btn btn-primary" onClick={() => { setSurvey(false); push(isAr ? 'تمت جدولة القياس وإرسال إشعارات العينة' : 'Measurement scheduled & sample notified'); }}>{isAr ? 'جدولة وإطلاق' : 'Schedule & launch'}</button></>}>
        <div className="grid gap-3">
          <div><label className="raven-label">{isAr ? 'الأداة' : 'Instrument'}</label><select className="raven-input"><option>{isAr ? 'استبانة رضا أولياء الأمور' : 'Parent satisfaction survey'}</option><option>{isAr ? 'استبانة الانتماء المدرسي (PSSM)' : 'Student belonging (PSSM)'}</option><option>{isAr ? 'قياس الاحتراق الوظيفي (MBI)' : 'Teacher burnout (MBI)'}</option></select></div>
          <div><label className="raven-label">{isAr ? 'العينة' : 'Sample'}</label><select className="raven-input"><option>{isAr ? 'الكل — 1,420 أسرة' : 'All — 1,420 families'}</option><option>{isAr ? 'صف دراسي محدد' : 'Specific grade'}</option><option>{isAr ? 'معلمو مادة محددة' : 'Subject teachers'}</option></select></div>
          <div><label className="raven-label">{isAr ? 'موعد الإطلاق' : 'Launch date'}</label><input type="date" className="raven-input" defaultValue="2026-11-02" /></div>
        </div>
      </Modal>
      <Toaster toasts={toasts} />
    </div>
  );
}

/* ═══════════════ 1.6 مركز الشؤون المدرسية ═══════════════ */
export function SchoolAffairs() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const [mail, setMail] = useState(false);
  const [busy, run] = useAsyncAction(1600);
  return (
    <div>
      <PageHead icon={Landmark} eyebrow={isAr ? 'القيادة المدرسية · 1.6' : 'SCHOOL LEADERSHIP · 1.6'}
        title={isAr ? 'مركز الشؤون المدرسية' : 'School Affairs Center'}
        desc={isAr ? 'المراسلات الرسمية، اللجان، الاجتماعات، والخطابات — كل ما يصدر باسم المدرسة.' : 'Official correspondence, committees, meetings and letters — everything issued in the school’s name.'}
        actions={<><SampleBadge /><button className="btn btn-primary !h-9" onClick={() => setMail(true)}><Plus size={15} />{isAr ? 'خطاب / تعميم جديد' : 'New Letter / Circular'}</button></>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard tone="blue" icon={ClipboardList} label={isAr ? 'خطابات صادرة — الشهر' : 'Outgoing — this month'} value="34" foot={isAr ? 'منها 6 موجهة للإدارة العامة' : '6 addressed to district office'} />
        <KpiCard tone="default" icon={FolderOpen} label={isAr ? 'خطابات واردة بانتظار الرد' : 'Incoming awaiting reply'} value="5" foot={isAr ? 'أقدمها: كتاب المشرف العام — 3 أيام' : 'Oldest: supervisor letter — 3 days'} />
        <KpiCard tone="green" icon={UsersRound} label={isAr ? 'لجان نشطة' : 'Active committees'} value={COMMITTEES.length} foot={isAr ? '45 عضواً — اجتماع هذا الأسبوع: 3' : '45 members — 3 meetings this week'} />
        <KpiCard tone="gold" icon={CalendarDays} label={isAr ? 'اجتماعات مجدولة — الأسبوع' : 'Meetings this week'} value="4" foot={isAr ? 'القادم: لجنة الموهوبين — غداً 10:00' : 'Next: Gifted Committee — tomorrow 10:00'} />
      </div>
      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <div className="raven-card overflow-hidden lg:col-span-2">
          <CardTitle title={isAr ? 'المراسلات — الأحدث' : 'Correspondence — Latest'} sub={isAr ? 'الوارد والصادر — مع حالة المعالجة' : 'Inbound & outbound with handling status'} />
          <TableShell minWidth={640} head={<tr><th className="th">{isAr ? 'الموضوع' : 'Subject'}</th><th className="th">{isAr ? 'الجهة' : 'Party'}</th><th className="th">{isAr ? 'التاريخ' : 'Date'}</th><th className="th">{isAr ? 'الحالة' : 'Status'}</th></tr>}>
            {[
              [isAr ? 'دعوة زيارة المشرف العام للتربية الخاصة' : 'Supervisor visit invitation — special ed.', isAr ? 'الإدارة العامة' : 'District', isAr ? 'اليوم' : 'Today', 'chip-gold', isAr ? 'بانتظار التحضير' : 'Preparing'],
              [isAr ? 'اعتماد خطة استضافة ومعرض المدرسة المفتوح' : 'Open-school exhibition plan approval', isAr ? 'لجنة الأنشطة' : 'Activities Committee', isAr ? 'أمس' : 'Yesterday', 'chip-green', isAr ? 'معتمدة' : 'Approved'],
              [isAr ? 'خطاب شكر — بلدية الحي (حملة التشجير)' : 'Thanks letter — municipality (planting drive)', isAr ? 'صادر' : 'Outbound', isAr ? 'أمس' : 'Yesterday', 'chip-blue', isAr ? 'أُرسل' : 'Sent'],
              [isAr ? 'محضر اجتماع لجنة الصحة والسلامة — أكتوبر' : 'Health & Safety Committee minutes — Oct', isAr ? 'داخلي' : 'Internal', '28 أكتوبر', 'chip-green', isAr ? 'تم الأرشفة' : 'Archived'],
              [isAr ? 'إشعار جدولة اختبارات الشهر — الطلاب والأسر' : 'Monthly exam schedule notice — students & families', isAr ? 'صادر — تعميم 7' : 'Outbound — Circular 7', '27 أكتوبر', 'chip-green', isAr ? 'منشور' : 'Published'],
            ].map((r, i) => <tr key={i} className="hover:bg-ivory/60"><td className="td font-bold text-[11px] max-w-64 leading-5">{r[0]}</td><td className="td text-[10px]">{r[1]}</td><td className="td text-[10px] text-charcoal/60">{r[2]}</td><td className="td"><span className={`chip ${r[3]}`}>{r[4]}</span></td></tr>)}
          </TableShell>
        </div>
        <div className="raven-card overflow-hidden">
          <CardTitle title={isAr ? 'اللجان والفرق المدرسية' : 'Committees'} sub={isAr ? `${COMMITTEES.length} لجان — اضغط لإدارة العضوية` : 'Tap to manage membership'} />
          <div className="divide-y divide-sand-soft/70">
            {COMMITTEES.map(c => <button key={c.name} onClick={() => push(`${c.name}: ${c.members} ${isAr ? 'أعضاء — الاجتماع القادم مجدول' : 'members — next meeting scheduled'}`, 'info')} className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-ivory/70 text-start"><span className="h-8 w-8 rounded-lg bg-green-soft text-green-deep flex items-center justify-center shrink-0"><UsersRound size={15} /></span><span className="min-w-0 flex-1"><span className="block text-[10.5px] font-bold leading-4 truncate">{c.name}</span><span className="block text-[8.5px] text-charcoal/55">{c.chair} · {c.meetings} {isAr ? 'اجتماع' : 'meetings'}</span></span></button>)}
          </div>
        </div>
      </div>
      <Modal open={mail} onClose={() => setMail(false)} title={isAr ? 'إصدار خطاب رسمي' : 'Issue Official Letter'} sub={isAr ? 'يُولَّد الخطاب بترويسة المدرسة وتوقيع مديرها تلقائياً من بيانات النظام' : 'Auto-generated with school header & principal signature from system data'}
        footer={<><button className="btn btn-ghost" onClick={() => setMail(false)}>{isAr ? 'إلغاء' : 'Cancel'}</button><BusyButton busy={busy} className="btn btn-primary" onClick={() => run(() => { setMail(false); push(isAr ? 'وُلّّد الخطاب وحُفظ في الأرشيف الرسمي + أُشعر المستلم' : 'Letter generated, archived & recipient notified'); })}>{isAr ? 'توليد واعتماد' : 'Generate & approve'}</BusyButton></>}>
        <div className="grid gap-3">
          <div><label className="raven-label">{isAr ? 'إلى' : 'To'} *</label><input className="raven-input" placeholder={isAr ? 'مثال: مدير عام التعليم بالرياض' : 'e.g. General Director of Education'} /></div>
          <div><label className="raven-label">{isAr ? 'الموضوع' : 'Subject'} *</label><input className="raven-input" placeholder={isAr ? 'موضوع الخطاب' : 'Letter subject'} /></div>
          <div><label className="raven-label">{isAr ? 'التصنيف' : 'Classification'}</label><select className="raven-input"><option>{isAr ? 'خطاب رسمي' : 'Official letter'}</option><option>{isAr ? 'تعميم داخلي' : 'Internal circular'}</option><option>{isAr ? 'محضر اجتماع' : 'Meeting minutes'}</option><option>{isAr ? 'شكر وتقدير' : 'Thanks & appreciation'}</option></select></div>
          <p className="text-[9px] text-charcoal/50 bg-ivory border border-sand-soft rounded-xl px-3 py-2 leading-5">{isAr ? 'الترويسة والتوقيع والختم: تُسحب تلقائياً من إعدادات المنصة — لا حاجة لإرفاق شعار.' : 'Header, signature & stamp are pulled automatically from platform settings — no logo upload needed.'}</p>
        </div>
      </Modal>
      <Toaster toasts={toasts} />
    </div>
  );
}

/* ═══════════════ 1.7 مركز الفصول المدرسية ═══════════════ */
export function ClassesCenter() {
  const { isAr } = useLang();
  const [sel, setSel] = useState<string | null>(null);
  const cls = CLASSES.find(c => c.id === sel);
  const roster = STUDENTS.filter(s => s.classId === sel);
  return (
    <div>
      <PageHead icon={DoorOpen} eyebrow={isAr ? 'القيادة المدرسية · 1.7' : 'SCHOOL LEADERSHIP · 1.7'}
        title={isAr ? 'مركز الفصول المدرسية' : 'Classes Center'}
        desc={isAr ? 'كل فصل — قائمة الطلاب، التحصيل، الحضور، البيئة، والأداء الأكاديمي عبر الزمن.' : 'Every class — roster, achievement, attendance, environment and academic trajectory.'}
        actions={<SampleBadge />} />
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {CLASSES.map(c => (
          <button key={c.id} onClick={() => setSel(c.id)} className="raven-card p-4 text-start hover:border-green/45 hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between">
              <span className="h-12 w-12 rounded-2xl bg-charcoal text-gold font-en font-extrabold text-[15px] flex items-center justify-center">{c.name}</span>
              <span className={`chip ${c.avg >= 85 ? 'chip-green' : c.avg >= 75 ? 'chip-gold' : 'chip-red'}`}>{c.avg}% {isAr ? 'تحصيل' : 'avg'}</span>
            </div>
            <div className="mt-2.5 text-[12px] font-extrabold">{isAr ? c.grade : c.gradeEn}</div>
            <div className="text-[9px] text-charcoal/55 font-mono mt-0.5">{c.id} · {c.room}</div>
            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between text-[9px] font-bold text-charcoal/55"><span>{isAr ? 'الحضور' : 'Attendance'} <span className="font-en">{c.attendance}%</span></span><span>{isAr ? 'الطلاب' : 'Students'} <span className="font-en">{c.students}</span></span></div>
              <ProgressBar value={c.attendance} tone={c.attendance >= 94 ? 'green' : 'gold'} />
            </div>
          </button>
        ))}
      </div>
      <Modal open={!!cls} onClose={() => setSel(null)} wide title={cls ? `${isAr ? 'فصل' : 'Class'} ${cls.name} — ${isAr ? cls.grade : cls.gradeEn}` : ''} sub={cls ? `${cls.room} · ${cls.students} ${isAr ? 'طالباً' : 'students'}` : ''}>
        {cls && <>
          <TableShell minWidth={520} head={<tr><th className="th">{isAr ? 'الطالب' : 'Student'}</th><th className="th">{isAr ? 'المتوسط' : 'Avg'}</th><th className="th">{isAr ? 'الحضور' : 'Attend.'}</th><th className="th">{isAr ? 'الاتجاه' : 'Trend'}</th></tr>}>
            {(roster.length ? roster : STUDENTS.slice(0, 4)).map(s => <tr key={s.id}><td className="td font-bold text-[11px]">{s.name}</td><td className="td font-en font-bold">{s.avg}%</td><td className="td font-en">{s.attendance}%</td><td className="td"><span className={`font-en text-[10.5px] font-extrabold ${s.trend >= 0 ? 'text-green-deep' : 'text-red-600'}`}>{s.trend >= 0 ? '▲' : '▼'} {Math.abs(s.trend)}</span></td></tr>)}
          </TableShell>
          <p className="mt-3 text-[9.5px] text-charcoal/50">{isAr ? 'قائمة الطلاب الكاملة مع الحلقات البيانية تُعرض للمعلمين الحاملين للفصل فقط — صلاحيات موثقة.' : 'The full roster with trend charts renders only for teachers carrying this class — audited access.'}</p>
        </>}
      </Modal>
    </div>
  );
}

/* ═══════════════ 2 · شؤون المعلمين ═══════════════ */
export function TeachersAffairs() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const [sel, setSel] = useState<string | null>(null);
  const t = TEACHERS.find(x => x.id === sel);
  return (
    <div>
      <PageHead icon={UsersRound} eyebrow={isAr ? 'القسم 2' : 'SECTION 2'} title={isAr ? 'شؤون المعلمين' : 'Teacher Affairs'}
        desc={isAr ? 'الكادر التعليمي: الحمل التدريسي، التخصص، التقييم، الأداء، والخطط الوظيفية.' : 'Teaching staff: load, specialization, evaluation, performance and career plans.'}
        actions={<><SampleBadge /><ExportButton label={isAr ? 'Excel' : 'Excel'} /></>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <KpiCard tone="green" icon={UsersRound} label={isAr ? 'معلم على رأس العمل' : 'Active teachers'} value="7" />
        <KpiCard label={isAr ? 'متوسط الحمل' : 'Avg. load'} value="16.8" unit={isAr ? 'حصة/أسبوع' : 'pds/wk'} />
        <KpiCard tone="blue" label={isAr ? 'نسبة المؤهلين ماجستير+' : 'Master’s+'} value="62%" />
        <KpiCard tone="gold" label={isAr ? 'تقييمات هذا الفصل' : 'Evaluations this term'} value="5 / 8" foot={isAr ? 'المتبقية بحلول 20 نوفمبر' : 'Rest by Nov 20'} />
      </div>
      <div className="raven-card overflow-hidden"><TableShell minWidth={800} head={<tr><th className="th">{isAr ? 'المعلم' : 'Teacher'}</th><th className="th">{isAr ? 'المادة' : 'Subject'}</th><th className="th">{isAr ? 'الفصول' : 'Classes'}</th><th className="th">{isAr ? 'الحمل' : 'Load'}</th><th className="th">{isAr ? 'المؤهل' : 'Qualification'}</th><th className="th">{isAr ? 'التقييم الأخير' : 'Last review'}</th><th></th></tr>}>
        {TEACHERS.map(t => <tr key={t.id} className="hover:bg-ivory/60"><td className="td font-extrabold text-[11.5px]">{t.name}</td><td className="td">{isAr ? t.subject : t.subjectEn}</td><td className="td text-[10px]">{t.classes.join('، ')}</td><td className="td font-en font-bold">{t.load}</td><td className="td text-[9.5px] text-charcoal/65 max-w-44">{t.specialty}</td><td className="td text-[10px]">{isAr ? 'ممتاز' : 'Excellent'} <span className="text-green-deep font-en font-bold">94</span></td><td className="td"><button className="text-[10px] font-extrabold text-deepblue hover:underline" onClick={() => setSel(t.id)}>{isAr ? 'الملف' : 'Profile'} ←</button></td></tr>)}
      </TableShell></div>
      <Modal open={!!t} onClose={() => setSel(null)} wide title={t?.name ?? ''} sub={t ? `${isAr ? t.subject : t.subjectEn} · ${t.specialty}` : ''}
        footer={<><button className="btn btn-outline" onClick={() => setSel(null)}>{isAr ? 'إغلاق' : 'Close'}</button><button className="btn btn-primary" onClick={() => { setSel(null); push(isAr ? 'فُتحت نموذج زيارة صفية مجدولة' : 'Classroom observation form opened'); }}>{isAr ? 'جدولة زيارة صفية' : 'Schedule observation'}</button></>}>
        {t && <div className="grid grid-cols-2 gap-2 text-center">{[[isAr ? 'الحمل' : 'Load', `${t.load} ${isAr ? 'حصة' : 'pds'}`], [isAr ? 'الفصول' : 'Classes', String(t.classes.length)], [isAr ? 'التقييم' : 'Review', '94/100'], [isAr ? 'الشواهد' : 'Evidence', '18']].map(([l, v]) => <div key={l as string} className="rounded-2xl bg-ivory border border-sand-soft py-3"><div className="font-en font-extrabold text-[16px]">{v}</div><div className="text-[9px] font-bold text-charcoal/55">{l}</div></div>)}</div>}
      </Modal>
      <Toaster toasts={toasts} />
    </div>
  );
}

/* ═══════════════ 3 · شؤون الطلاب ═══════════════ */
export function StudentsAffairs() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const [query, setQuery] = useState('');
  const [riskOnly, setRiskOnly] = useState(false);
  const filtered = STUDENTS.filter(s => (!riskOnly || s.avg < 70 || s.attendance < 90) && (!query || s.name.includes(query)));
  const risk = STUDENTS.filter(s => s.avg < 70 || s.attendance < 90);
  return (
    <div>
      <PageHead icon={GraduationCap} eyebrow={isAr ? 'القسم 3' : 'SECTION 3'} title={isAr ? 'شؤون الطلاب' : 'Student Affairs'}
        desc={isAr ? 'ملفات الطلاب — أداء، سلوك، مواظبة، وخطط دعم. تدخل مبكر قبل أن يتعثر الطالب.' : 'Student files — achievement, behavior, conduct and support plans. Early intervention before students fall behind.'}
        actions={<><SampleBadge /><button className="btn btn-outline !h-9" onClick={() => setRiskOnly(v => !v)}><AlertTriangle size={14} />{riskOnly ? (isAr ? 'عرض الكل' : 'Show all') : (isAr ? `المعرضون للخطر (${risk.length})` : `At-risk (${risk.length})`)}</button></>} />
      <div className="raven-card overflow-hidden">
        <CardTitle title={isAr ? 'سجل الطلاب — المتابعة الفردية' : 'Student Registry — Individual Follow-up'} sub={`${filtered.length} ${isAr ? 'طالب معروض' : 'students shown'}`} action={<SearchInput value={query} onChange={setQuery} placeholder={isAr ? 'ابحث باسم الطالب…' : 'Search student…'} />} />
        <TableShell minWidth={720} head={<tr><th className="th">{isAr ? 'الطالب' : 'Student'}</th><th className="th">{isAr ? 'الفصل' : 'Class'}</th><th className="th">{isAr ? 'المتوسط' : 'Average'}</th><th className="th">{isAr ? 'الحضور' : 'Attend.'}</th><th className="th">{isAr ? 'السلوك' : 'Behavior'}</th><th className="th">{isAr ? 'الاتجاه' : 'Trend'}</th><th></th></tr>}>
          {filtered.map(s => (
            <tr key={s.id} className={`hover:bg-ivory/60 ${(s.avg < 70 || s.attendance < 90) ? 'bg-red-50/40' : ''}`}>
              <td className="td font-extrabold text-[11.5px]">{s.name}<div className="text-[8.5px] font-mono font-normal text-charcoal/45">{s.id}</div></td>
              <td className="td font-en font-bold">{CLASSES.find(c => c.id === s.classId)?.name}</td>
              <td className="td font-en font-bold"><span className={s.avg < 70 ? 'text-red-600' : ''}>{s.avg}%</span></td>
              <td className="td font-en">{s.attendance}%</td>
              <td className="td text-[10px]">{s.behavior}</td>
              <td className="td"><span className={`font-en text-[10.5px] font-extrabold ${s.trend >= 0 ? 'text-green-deep' : 'text-red-600'}`}>{s.trend >= 0 ? '▲' : '▼'} {Math.abs(s.trend)}%</span></td>
              <td className="td"><button className="text-[9.5px] font-extrabold text-deepblue hover:underline whitespace-nowrap" onClick={() => push(isAr ? `فُتحت خطة دعم ${s.name} — ولي الأمر سيُشعر` : `Support plan opened for ${s.name} — guardian notified`, 'info')}>{isAr ? 'خطة دعم' : 'Support plan'} ←</button></td>
            </tr>
          ))}
          {filtered.length === 0 && <tr><td colSpan={7}><EmptyState title={isAr ? 'لا توجد نتائج' : 'No results'} hint={isAr ? 'عدّل البحث أو الفلتر' : 'Adjust search or filter'} /></td></tr>}
        </TableShell>
      </div>
      <Toaster toasts={toasts} />
    </div>
  );
}

/* ═══════════════ 4.1 إدخال الدرجات وتحليلها ═══════════════ */
export function ExamsGrades() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const [stage, setStage] = useState<'idle' | 'analyzed'>('idle');
  const [busy, run] = useAsyncAction(1800);
  const rows = [
    { subject: isAr ? 'الرياضيات — 1-أ' : 'Math — 1A', n: 32, avg: 88.4, pass: 94, top: '20/20 · ليان العتيبي', low: isAr ? '11/20 · لمى الحربي' : '11/20 · Lama' },
    { subject: isAr ? 'العلوم — 2-ب' : 'Science — 2B', n: 29, avg: 84.1, pass: 90, top: '20/20 · ريان السبيعي', low: '12/20' },
    { subject: isAr ? 'اللغة العربية — 1-ب' : 'Arabic — 1B', n: 30, avg: 79.6, pass: 87, top: '19/20', low: '10/20 · دانا الشهري' },
    { subject: isAr ? 'الحاسب الآلي — 2-أ' : 'CS — 2A', n: 28, avg: 86.9, pass: 96, top: '20/20 · كامل الفصل', low: '15/20' },
  ];
  return (
    <div>
      <PageHead icon={PenLine} eyebrow={isAr ? 'الاختبارات · 4.1' : 'EXAMS · 4.1'} title={isAr ? 'إدخال الدرجات وتحليلها' : 'Grades Entry & Analysis'}
        desc={isAr ? 'رصد مباشر من المعلم — تحليل فوري للتوزيع، نسبة النجاح، والطلاب الذين يحتاجون تدخلاً.' : 'Direct teacher entry — instant distribution analysis, pass rates and students needing intervention.'}
        actions={<><SampleBadge /><ExportButton label={isAr ? 'Excel' : 'Excel'} /></>} />
      <div className="grid xl:grid-cols-5 gap-4">
        <div className="raven-card overflow-hidden xl:col-span-3">
          <CardTitle title={isAr ? 'نتائج اختبار الشهر — تحليل حسب المادة والفصل' : 'Monthly Exam — Analysis by Subject & Class'} sub={isAr ? 'الفصل الدراسي الثاني — أُدخلت 119 درجة' : 'Term 2 — 119 grades entered'}
            action={<BusyButton busy={busy} className="btn btn-dark !h-8 !text-[10.5px]" onClick={() => run(() => { setStage('analyzed'); push(isAr ? 'اكتمل التحليل الإحصائي — التوصيات جاهزة' : 'Statistical analysis complete — recommendations ready', 'info'); })}><BarChart3 size={13} />{isAr ? 'تحليل ذكي' : 'Smart analysis'}</BusyButton>} />
          <TableShell minWidth={620} head={<tr><th className="th">{isAr ? 'المادة — الفصل' : 'Subject — Class'}</th><th className="th">{isAr ? 'العدد' : 'N'}</th><th className="th">{isAr ? 'المتوسط' : 'Avg'}</th><th className="th">{isAr ? 'النجاح' : 'Pass'}</th><th className="th">{isAr ? 'الأعلى / الأدنى' : 'High / Low'}</th></tr>}>
            {rows.map(r => <tr key={r.subject} className="hover:bg-ivory/60"><td className="td font-bold text-[11px]">{r.subject}</td><td className="td font-en">{r.n}</td><td className="td font-en font-bold">{r.avg}%</td><td className="td font-en font-bold text-green-deep">{r.pass}%</td><td className="td text-[9px] text-charcoal/65">{r.top}<br /><span className="text-red-600">{r.low}</span></td></tr>)}
          </TableShell>
          <div className="p-4 border-t border-sand-soft"><Bars data={rows.map(r => r.avg)} labels={rows.map(r => r.subject.split('—')[0].trim())} color="#15445A" height={130} /></div>
        </div>
        <div className="xl:col-span-2 space-y-4">
          <div className="raven-card overflow-hidden">
            <CardTitle title={isAr ? 'توصيات التحليل الذكي' : 'Smart Analysis Recommendations'} sub={stage === 'analyzed' ? (isAr ? 'مولّدة الآن من بيانات الاختبار' : 'Generated now from exam data') : (isAr ? 'بانتظار تشغيل التحليل' : 'Awaiting analysis run')} />
            <div className="p-4 space-y-2 text-[10px] leading-5">
              {stage === 'analyzed' ? <>
                <div className="rounded-xl bg-gold-soft/60 border border-gold/40 p-2.5"><b>1-ب (عربي):</b> {isAr ? 'متوسط 10/20 في «الإملاء» — تُوصي حصة دعم يوم الخميس لكل من: دانا الشهري، لمى الحربي.' : 'Avg 10/20 on “Dictation” — Thursday support session recommended for Dana & Lama.'}</div>
                <div className="rounded-xl bg-green-mist border border-green/25 p-2.5"><b>{isAr ? 'التميز:' : 'Excellence:'}</b> {isAr ? '1-أ في الرياضيات لم يفقد أي درجة في «الجبر» للمرة الثانية — مرشح للمسابقة الوطنية.' : '1-A lost zero points on “Algebra” twice — national olympiad candidate pool.'}</div>
                <div className="rounded-xl bg-blue-soft/50 border border-deepblue/20 p-2.5"><b>2-ب (علوم):</b> {isAr ? '3 طلاب تجاوزوا الغياب 3 أيام في أسبوع الاختبار — ربط تلقائي بملفات الغياب.' : '3 students exceeded 3 absences during exam week — auto-linked to attendance files.'}</div>
              </> : <EmptyState icon={BarChart3} title={isAr ? 'التحليل لم يُشغَّل بعد' : 'Analysis not run yet'} hint={isAr ? 'اضغط «تحليل ذكي» — النتائج تُبنى على الدرجات المُدخلة فقط.' : 'Tap “Smart analysis” — results derive solely from entered grades.'} />}
            </div>
          </div>
          <div className="raven-card p-4">
            <div className="kpi-label mb-2">{isAr ? 'إجراء سريع' : 'Quick Action'}</div>
            <p className="text-[10.5px] text-charcoal/65 leading-6">{isAr ? 'اعتماد نتائج اختبار الشهر سيُشعر الأسر تلقائياً ويرفع الدرجات لملفات الطلاب.' : 'Approving monthly results notifies families and posts grades to student records.'}</p>
            <button className="btn btn-gold !h-9 w-full justify-center mt-3" onClick={() => push(isAr ? 'اعتُمدت النتائج — أُشعرت 1,420 أسرة عبر التطبيق والرسائل' : 'Results approved — 1,420 families notified via app & SMS')}><BadgeCheck size={15} />{isAr ? 'اعتماد النتائج وإشعار الأسر' : 'Approve & notify families'}</button>
          </div>
        </div>
      </div>
      <Toaster toasts={toasts} />
    </div>
  );
}

/* ═══════════════ 4.2 كنترول الاختبارات ═══════════════ */
export function ExamsControl() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const [schedule, setSchedule] = useState([
    { day: isAr ? 'الأحد 2 نوفمبر' : 'Sun Nov 2', exam: isAr ? 'رياضيات — 1-أ و2-أ' : 'Math — 1A & 2A', time: '09:00', hall: isAr ? 'القاعة 204 + 302' : 'Halls 204 & 302', ready: true },
    { day: isAr ? 'الاثنين 3 نوفمبر' : 'Mon Nov 3', exam: isAr ? 'علوم — 2-ب و3-ب' : 'Science — 2B & 3B', time: '09:00', hall: isAr ? 'القاعة 301 + 113' : 'Halls 301 & 113', ready: true },
    { day: isAr ? 'الثلاثاء 4 نوفمبر' : 'Tue Nov 4', exam: isAr ? 'لغة عربية — الجميع' : 'Arabic — All grades', time: '09:00', hall: isAr ? 'كل القاعات' : 'All halls', ready: false },
    { day: isAr ? 'الأربعاء 5 نوفمبر' : 'Wed Nov 5', exam: isAr ? 'حاسب آلي + إنجليزي' : 'CS + English', time: '09:00', hall: isAr ? 'معمل الحاسب + 302' : 'CS Lab & 302', ready: false },
  ]);
  return (
    <div>
      <PageHead icon={ClipboardList} eyebrow={isAr ? 'الاختبارات · 4.2' : 'EXAMS · 4.2'} title={isAr ? 'كنترول الاختبارات وإدارتها' : 'Exam Control & Management'}
        desc={isAr ? 'الجدولة، القاعات، نماذج الكنترول، سرية الأسئلة، والرصد — تحت إشراف الكنترول المدرسي.' : 'Scheduling, halls, control-room sheets, paper custody and marking — under school exam-control supervision.'}
        actions={<><SampleBadge /><button className="btn btn-primary !h-9" onClick={() => push(isAr ? 'وُلّّدت أوراق الكنترول الـ4 ونماذج الغياب والرصد' : '4 control sheets + absence & marking forms generated')}><ClipboardList size={15} />{isAr ? 'توليد نماذج الكنترول' : 'Generate control sheets'}</button></>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <KpiCard tone="gold" icon={ClipboardList} label={isAr ? 'اختبارات هذا الأسبوع' : 'Exams this week'} value="4" />
        <KpiCard tone="blue" label={isAr ? 'طلاب مشاركون' : 'Students sitting'} value="182" />
        <KpiCard tone="green" label={isAr ? 'قاعات مجهزة' : 'Halls ready'} value="6 / 8" foot={isAr ? 'قاعتا 204 و113 تجهيز نهائي' : 'Halls 204 & 113 in final setup'} />
        <KpiCard label={isAr ? 'سرية النماذج' : 'Paper custody'} value={isAr ? 'محكم' : 'Secure'} foot={isAr ? 'خزينة الكنترول — مفتاحان (المدير + أمين الكنترول)' : 'Vault — 2 keys (principal + control officer)'} />
      </div>
      <div className="raven-card overflow-hidden">
        <CardTitle title={isAr ? 'جدول اختبارات الشهر — الفصل الثاني' : 'Monthly Exam Schedule — Term 2'} sub={isAr ? 'اضغط «تأكيد» للاعتماد النهائي لكل يوم' : 'Tap “Confirm” to finalize each day'} />
        <TableShell minWidth={760} head={<tr><th className="th">{isAr ? 'اليوم' : 'Day'}</th><th className="th">{isAr ? 'المادة / الفصول' : 'Exam / Classes'}</th><th className="th">{isAr ? 'الوقت' : 'Time'}</th><th className="th">{isAr ? 'القاعة' : 'Hall'}</th><th className="th">{isAr ? 'الجاهزية' : 'Readiness'}</th><th></th></tr>}>
          {schedule.map((s, i) => (
            <tr key={i} className="hover:bg-ivory/60">
              <td className="td font-bold text-[11px]">{s.day}</td><td className="td text-[10.5px]">{s.exam}</td><td className="td font-en font-bold">{s.time}</td><td className="td text-[10px]">{s.hall}</td>
              <td className="td">{s.ready ? <span className="chip chip-green"><Check size={9} strokeWidth={4} />{isAr ? 'جاهز' : 'Ready'}</span> : <span className="chip chip-gold"><Clock size={9} />{isAr ? 'قيد التجهيز' : 'Setting up'}</span>}</td>
              <td className="td">{!s.ready && <button className="text-[10px] font-extrabold text-deepblue hover:underline" onClick={() => { setSchedule(p => p.map((x, j) => j === i ? { ...x, ready: true } : x)); push(isAr ? 'اعتُمد يوم الاختبار — أُشعرت الأسر والمعلمون' : 'Exam day confirmed — families & staff notified'); }}>{isAr ? 'تأكيد ←' : 'Confirm ←'}</button>}</td>
            </tr>
          ))}
        </TableShell>
      </div>
      <Toaster toasts={toasts} />
    </div>
  );
}
