/* ═════════════════════════════════════════════════════════════
   بوابة المعلم — مساحة العمل اليومية (14 قسماً)
   Teacher Portal — routed sub-paths
   ═════════════════════════════════════════════════════════════ */
import { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, NavLink } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, ClipboardCheck, BookOpenCheck, GraduationCap, ClipboardList,
  PenLine, ListChecks, Sparkles, Trophy, Library, BellRing, UserRound, Check,
  Clock, Plus, Mic, Send, Flame, Lock,
} from 'lucide-react';
import { useLang, L } from '../../lib/i18n';
import {
  TEACHER_CLASSES, TEACHER_GRADEBOOK, TIMETABLE_TODAY, HOMEWORK_ITEMS, NOTIFICATIONS, TEACHERS,
} from '../../lib/data';
import {
  PageHead, KpiCard, CardTitle, ProgressBar, Donut, Bars, Modal, EmptyState, TableShell,
  StatusDot, SampleBadge, useToasts, Toaster, BusyButton, useAsyncAction, SearchInput,
} from '../../components/raven';
import { VoiceEntryModal } from '../principal/PrincipalPages';

const me = TEACHERS[0]; // أ. سارة الحربي — معلمة رياضيات

function TeacherHome() {
  const { isAr, dir } = useLang();
  const navigate = useNavigate();
  const now = TIMETABLE_TODAY.find(p => p.state === 'now');
  const done = TIMETABLE_TODAY.filter(p => p.state === 'done').length;
  return (
    <div>
      <PageHead icon={LayoutDashboard} eyebrow={isAr ? 'الخميس 29 أكتوبر 2026 — الفصل الثاني' : 'Thursday, Oct 29 2026 — Term 2'}
        title={isAr ? 'مساء الخير، أ. سارة' : 'Good evening, Ms. Sarah'}
        desc={isAr ? 'إليك يومك في لمحة: حصصك، مهامك، درجاتك المعلّقة، وإشعارات مدرستك.' : 'Your day at a glance: classes, tasks, pending grades and school notices.'}
        actions={<SampleBadge />} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard tone="charcoal" icon={CalendarDays} label={isAr ? 'حصصي اليوم' : 'My classes today'} value={TIMETABLE_TODAY.filter(p => !['break'].includes(p.state) && p.subject.includes('رياضيات')).length} foot={<span className="!text-gold/85">{isAr ? `${done} منجزة · الحصة 4 الآن` : `${done} done · Period 4 now`}</span>} />
        <KpiCard tone="gold" icon={ClipboardCheck} label={isAr ? 'مهام بانتظارك' : 'Tasks awaiting you'} value="3" foot={isAr ? 'أقربها: مراجعة نتائج اختبار الرياضيات — اليوم 12:30' : 'Next: Math exam results review — today 12:30'} />
        <KpiCard tone="blue" icon={PenLine} label={isAr ? 'درجات لم تُعتمد' : 'Unapproved grades'} value="18" foot={isAr ? 'اختبار الشهر — بانتظار اعتماد المدير' : 'Monthly exam — awaiting principal sign-off'} />
        <KpiCard tone="green" icon={Flame} label={isAr ? 'سلسلة إنجاز' : 'Evidence streak'} value="12" unit={isAr ? 'يوماً' : 'days'} foot={isAr ? 'شاهد كل حصة — ولا تنسَ حصة اليوم 204' : 'Evidence habit — today: Room 204'} />
      </div>

      <div className="grid xl:grid-cols-3 gap-4 mt-4">
        <div className="raven-card xl:col-span-2 overflow-hidden">
          <CardTitle title={isAr ? 'حصصي اليوم' : 'Today’s Timetable'} sub={isAr ? 'الأحد 29 أكتوبر — الجدول المعتمد' : 'Today — approved schedule'}
            action={<button className="text-[10.5px] font-bold text-green-deep hover:underline" onClick={() => navigate('/teacher/timetable')}>{isAr ? 'الجدول الكامل' : 'Full timetable'} ←</button>} />
          <div className="divide-y divide-sand-soft/70">
            {TIMETABLE_TODAY.map(p => (
              <div key={p.period} className={`flex items-center gap-3 px-5 py-2.5 ${p.state === 'now' ? 'bg-gold-soft/60' : ''}`}>
                <span className="font-en text-[11px] font-extrabold text-charcoal/50 w-6">{p.period}</span>
                <span className="font-mono text-[9.5px] text-charcoal/55 w-24 shrink-0 hidden sm:block">{p.time}</span>
                <div className="min-w-0 flex-1"><span className={`text-[11px] ${p.subject === '— فراغ —' ? 'text-charcoal/40' : 'font-bold'}`}>{p.subject}</span>{p.subject !== '— فراغ —' && <span className="text-[9px] text-charcoal/55"> · {p.cls === 'فراغ مدرسي' ? isAr ? 'فراغ' : 'free' : `${isAr ? 'فصل' : 'Class'} ${p.cls}`} · {p.room !== '—' ? `${isAr ? 'قاعة' : 'Rm'} ${p.room}` : ''}</span>}</div>
                {p.state === 'now' && <span className="chip chip-gold ping-soft">{isAr ? 'الآن' : 'NOW'}</span>}
                {p.state === 'done' && <Check size={15} className="text-green" strokeWidth={3} />}
                {p.state === 'upcoming' && <Clock size={14} className="text-charcoal/35" />}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="raven-card overflow-hidden">
            <CardTitle title={isAr ? 'تسليمات حديثة' : 'Recent Submissions'} action={<button className="text-[10px] font-bold text-green-deep hover:underline" onClick={() => navigate('/teacher/homework')}>{isAr ? 'الكل' : 'All'} ←</button>} />
            <div className="divide-y divide-sand-soft/70">{HOMEWORK_ITEMS.map(h => <div key={h.id} className="px-4 py-2.5 flex items-center gap-2.5"><span className="h-8 w-8 rounded-lg bg-blue-soft text-deepblue flex items-center justify-center shrink-0"><ListChecks size={15} /></span><div className="min-w-0 flex-1"><div className="text-[10px] font-bold leading-4 truncate">{h.title}</div><div className="text-[8.5px] text-charcoal/55">{h.cls} · {h.submitted}/{h.total} {isAr ? 'سلّموا' : 'submitted'}</div></div><span className={`font-en text-[11px] font-extrabold ${h.submitted === h.total ? 'text-green-deep' : 'text-charcoal/70'}`}>{Math.round(h.submitted / h.total * 100)}%</span></div>)}</div>
          </div>
          <div className="raven-card p-4">
            <div className="kpi-label mb-2">{isAr ? 'شواهد اليوم' : 'Today’s Evidence'}</div>
            <p className="text-[10px] text-charcoal/65 leading-5">{isAr ? 'سجّل شاهد حصتك في 3 خطوات: صورة أو فيديو ← اعتماد المدير ← أُرشفت تلقائياً في ملفك وملف المدرسة.' : 'Log your lesson evidence in 3 steps — captured, approved by the principal, archived into your portfolio & the school file.'}</p>
            <button className="btn btn-gold !h-9 w-full justify-center mt-2.5" onClick={() => navigate('/teacher/achievements')}><Trophy size={15} />{isAr ? 'أضف شاهد اليوم' : 'Add today’s evidence'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeacherTimetable() {
  const { isAr } = useLang();
  const days = isAr ? ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'];
  const grid: Record<string, { s: string; c: string }> = {
    [days[0]]: { s: '3-أ · 1-أ · 2-أ', c: '3 حصص' }, [days[1]]: { s: '1-أ · 2-أ · 3-أ · 1-أ', c: '4 حصص' },
    [days[2]]: { s: '2-أ · 3-أ · 1-أ · 2-أ', c: '4 حصص' }, [days[3]]: { s: '1-أ · 2-أ · 3-أ', c: '3 حصص + نادي رياضيات' },
    [days[4]]: { s: '3-أ · 1-أ · 2-أ', c: '3 حصص + مذاكرة' },
  };
  return (
    <div>
      <PageHead icon={CalendarDays} eyebrow={isAr ? 'القسم 2' : 'SECTION 2'} title={isAr ? 'جدول المعلم والحصص' : 'Timetable & Classes'}
        desc={isAr ? 'جدولي الأسبوعي — 18 حصة ومناصب إشرافي الثلاثة. الحصص محدثة لحظياً من الجدول المعتمد.' : 'My weekly schedule — 18 periods and 3 supervision posts. Periods sync live from the approved timetable.'}
        actions={<SampleBadge />} />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">{days.map(d => (
        <div key={d} className={`raven-card p-4 text-center ${d === days[0] ? 'ring-2 ring-gold border-gold' : ''}`}>
          <div className="font-black text-[12px]">{d}{d === days[0] && <span className="block text-[8px] font-en text-gold-deep">{isAr ? 'اليوم' : 'TODAY'}</span>}</div>
          <div className="font-en font-extrabold text-[15px] mt-2 text-charcoal">{grid[d].c}</div>
          <div className="text-[9.5px] text-charcoal/60 mt-1">{grid[d].s}</div>
        </div>
      ))}</div>
      <div className="raven-card mt-4 overflow-hidden"><CardTitle title={isAr ? 'حصصي اليوم — التفاصيل والقاعات' : 'Today — Details & Rooms'} /><div className="divide-y divide-sand-soft/70">{TIMETABLE_TODAY.map(p => <div key={p.period} className="flex items-center gap-3 px-5 py-3"><span className="h-9 w-9 rounded-xl bg-ivory border border-sand-soft font-en font-extrabold text-[13px] flex items-center justify-center">{p.period}</span><div className="flex-1 min-w-0"><div className="text-[11.5px] font-bold">{p.subject}</div><div className="text-[9px] text-charcoal/55 font-mono">{p.time} · {p.room !== '—' ? `${isAr ? 'قاعة' : 'Room'} ${p.room}` : ''}</div></div>{p.state === 'now' ? <span className="chip chip-gold">{isAr ? 'جارية الآن' : 'In session'}</span> : p.state === 'done' ? <span className="chip chip-green"><Check size={9} strokeWidth={4} />{isAr ? 'منجزة' : 'Done'}</span> : <span className="chip chip-sand"><Clock size={9} />{p.time.split('–')[0]}</span>}</div>)}</div></div>
    </div>
  );
}

function TeacherTasks() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const mine = [
    { id: 'MK-31', t: isAr ? 'اعتماد خطة أسبوع 4 — الرياضيات (3 فصول)' : 'Approve week-4 Math plans (3 classes)', due: isAr ? 'اليوم 12:00' : 'Today 12:00', state: 'now' as const },
    { id: 'MK-30', t: isAr ? 'مراجعة نموذج اختبار الشهر — التعديل الثالث' : 'Review monthly exam draft #3', due: isAr ? 'غداً 09:00' : 'Tomorrow 09:00', state: 'upcoming' as const },
    { id: 'MK-29', t: isAr ? 'رصد درجات اختبار الشهر — 1-أ (18 درجة بانتظارك)' : 'Enter October grades — 1A (18 pending)', due: isAr ? 'غداً 14:00' : 'Tomorrow 14:00', state: 'upcoming' as const },
  ];
  const [done, setDone] = useState<string[]>([]);
  return (
    <div>
      <PageHead icon={ClipboardCheck} eyebrow={isAr ? 'القسم 3' : 'SECTION 3'} title={isAr ? 'المهام والتكليفات' : 'Tasks & Assignments'}
        desc={isAr ? 'كل ما كلفتك به الإدارة أو طلبته منك لجنة — مع المواعيد والاعتماد.' : 'Everything leadership assigned to you or your committee — with deadlines and sign-off.'}
        actions={<SampleBadge />} />
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="raven-card overflow-hidden">
          <CardTitle title={isAr ? 'بانتظارك الآن' : 'Waiting on You'} sub={`${mine.length - done.length} ${isAr ? 'مهمة' : 'open'}`} />
          <div className="divide-y divide-sand-soft/70">{mine.map(tk => (
            <div key={tk.id} className={`px-4 py-3.5 flex items-start gap-3 ${done.includes(tk.id) ? 'opacity-55' : ''}`}>
              <button onClick={() => { setDone(p => [...p, tk.id]); push(isAr ? 'أنجزت — أُشعر مدير المدرسة تلقائياً' : 'Completed — principal auto-notified'); }} className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${done.includes(tk.id) ? 'bg-green border-green text-white' : 'border-sand hover:border-green'}`} aria-label="complete">{done.includes(tk.id) && <Check size={13} strokeWidth={4} />}</button>
              <div className="min-w-0"><p className="text-[11.5px] font-bold leading-5">{tk.t}</p><div className="text-[9px] text-charcoal/55 mt-1 flex gap-2 font-mono"><span>{tk.id}</span>·<span className="text-red-600 font-sans font-bold">{tk.due}</span></div></div>
            </div>
          ))}</div>
        </div>
        <div className="raven-card p-5">
          <div className="kpi-label mb-2">{isAr ? 'معدل إنجازي هذا الشهر' : 'My completion rate — this month'}</div>
          <div className="flex items-center gap-5"><Donut value={92} size={110} label={isAr ? 'إنجاز' : 'done'} color="#08794F" /><div className="text-[10.5px] leading-6 text-charcoal/70"><b className="font-en">24/26</b> {isAr ? 'مهمة منجزة في موعدها' : 'tasks done on time'}<br /><b className="font-en">+8%</b> {isAr ? 'عن الشهر الماضي' : 'vs last month'}<br /><span className="text-green-deep font-bold">{isAr ? 'أنت من أعلى 3 معلمين دقةً في المواعيد' : 'Top-3 on deadline accuracy'}</span></div></div>
        </div>
      </div>
      <Toaster toasts={toasts} />
    </div>
  );
}

function LessonPlans() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const [open, setOpen] = useState(false);
  const [busy, run] = useAsyncAction(1600);
  const plans = [
    { t: isAr ? 'الجبر: حل المعادلات التربيعية بالتحليل' : 'Algebra: solving quadratics by factoring', cls: '1-أ', state: isAr ? 'معتمدة' : 'Approved', tone: 'chip-green', feedback: isAr ? 'ممتاز — أضف نشاط تمايزي للطلاب المتقدمين' : 'Excellent — add a differentiation task for advanced learners' },
    { t: isAr ? 'الهندسة: المسافة بين نقطتين في المستوى' : 'Geometry: distance between two points', cls: '2-أ', state: isAr ? 'بانتظار مراجعة المدير' : 'Awaiting principal review', tone: 'chip-gold', feedback: '' },
    { t: isAr ? 'الإحصاء: مقاييس النزعة المركزية' : 'Statistics: measures of central tendency', cls: '3-أ', state: isAr ? 'قيد التحضير' : 'Drafting', tone: 'chip-sand', feedback: '' },
  ];
  return (
    <div>
      <PageHead icon={BookOpenCheck} eyebrow={isAr ? 'القسم 4' : 'SECTION 4'} title={isAr ? 'التحضير والخطط الدراسية' : 'Lesson Plans'}
        desc={isAr ? 'خططك الأسبوعية — تُنشأ من مكتبة رافين للقوالب، تُرسل للاعتماد، وتؤرشف تلقائياً مع شواهدها.' : 'Your weekly plans — drafted from Raven templates, submitted for approval, auto-archived with evidence.'}
        actions={<><SampleBadge /><button className="btn btn-primary !h-9" onClick={() => setOpen(true)}><Plus size={15} />{isAr ? 'تحضير جديد' : 'New lesson plan'}</button></>} />
      <div className="grid lg:grid-cols-3 gap-4">{plans.map((p, i) => (
        <div key={i} className="raven-card p-4 flex flex-col">
          <div className="flex items-center justify-between"><span className="chip chip-blue">{isAr ? 'فصل' : 'Class'} {p.cls}</span><span className={`chip ${p.tone}`}>{p.state}</span></div>
          <h3 className="text-[12px] font-extrabold leading-6 mt-2.5">{p.t}</h3>
          {p.feedback && <p className="text-[9.5px] leading-5 text-charcoal/65 bg-gold-soft/50 border border-gold/30 rounded-xl px-3 py-2 mt-2"><b className="text-gold-deep">{isAr ? 'ملاحظة المدير: ' : 'Principal’s note: '}</b>{p.feedback}</p>}
          <button className="btn btn-outline !h-8 !text-[10px] mt-auto self-start" style={{ marginTop: 'auto' }} onClick={() => push(isAr ? 'فُتحت الخطة في المحرر — عدّل وحفظ كمسودة في أي وقت' : 'Plan opened in editor — edit & save as draft anytime', 'info')}>{isAr ? 'فتح المحرر ←' : 'Open editor ←'}</button>
        </div>
      ))}</div>
      <Modal open={open} onClose={() => setOpen(false)} title={isAr ? 'تحضير درس جديد' : 'New Lesson Plan'} sub={isAr ? 'اختر قالباً — رافين يملأ الأهداف والأنشطة من مكتبة المادة' : 'Pick a template — Raven fills objectives & activities from the subject library'}
        footer={<><button className="btn btn-ghost" onClick={() => setOpen(false)}>{isAr ? 'إلغاء' : 'Cancel'}</button><BusyButton busy={busy} className="btn btn-primary" onClick={() => run(() => { setOpen(false); push(isAr ? 'حُفظت الخطة كمسودة — أرسلها للاعتماد عندما تجهز' : 'Draft saved — submit for approval when ready'); })}>{isAr ? 'حفظ المسودة' : 'Save draft'}</BusyButton></>}>
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3"><div><label className="raven-label">{isAr ? 'الفصل' : 'Class'}</label><select className="raven-input"><option>1-أ</option><option>2-أ</option><option>3-أ</option></select></div><div><label className="raven-label">{isAr ? 'القالب' : 'Template'}</label><select className="raven-input"><option>{isAr ? 'القالب القياسي — 5 خطوات' : 'Standard — 5E model'}</option><option>{isAr ? 'التعلم القائم على المشاريع' : 'Project-based learning'}</option><option>{isAr ? 'استراتيجية التمايز' : 'Differentiation'}</option></select></div></div>
          <div><label className="raven-label">{isAr ? 'عنوان الدرس' : 'Lesson title'}</label><input className="raven-input" placeholder={isAr ? 'مثال: حل المعادلات التربيعية بالتحليل' : 'e.g. Solving quadratics by factoring'} /></div>
          <div><label className="raven-label">{isAr ? 'الأهداف (1-3)' : 'Objectives (1-3)'}</label><textarea className="raven-input !h-20 py-2.5" placeholder={isAr ? '• يحل المعادلة بالتحليل على الأقل في 8 من 10 أمثلة…' : '• Solves by factoring at least 8 of 10 examples…'} /></div>
        </div>
      </Modal>
      <Toaster toasts={toasts} />
    </div>
  );
}

function TeacherClasses() {
  const { isAr } = useLang();
  const [sel, setSel] = useState<string | null>(null);
  const navigate = useNavigate();
  const cls = TEACHER_CLASSES.find(c => c.id === sel);
  return (
    <div>
      <PageHead icon={GraduationCap} eyebrow={isAr ? 'القسم 5' : 'SECTION 5'} title={isAr ? 'فصولي وطلابي' : 'My Classes & Students'}
        desc={isAr ? 'فصولك الثلاثة — تُرى فقط الفصول التي أسندت إليك. خصوصية طلابك بين يديك وحدك.' : 'Your three classes — only the classes assigned to you are visible. Your students’ privacy is yours alone.'}
        actions={<SampleBadge />} />
      <div className="grid sm:grid-cols-3 gap-3">{TEACHER_CLASSES.map(c => (
        <button key={c.id} onClick={() => setSel(c.id)} className="raven-card p-5 text-start hover:-translate-y-1 hover:border-green/40 transition-all">
          <span className="h-12 w-12 rounded-2xl bg-charcoal text-gold font-en font-extrabold text-[15px] flex items-center justify-center">{c.id}</span>
          <div className="mt-3 text-[12px] font-extrabold">{isAr ? c.grade : c.gradeEn}</div>
          <div className="text-[9px] font-mono text-charcoal/55 mt-0.5">{isAr ? 'قاعة' : 'Room'} {c.room}</div>
          <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">{[[c.students, isAr ? 'طالب' : 'students'], [`${c.avg}%`, isAr ? 'متوسط' : 'avg'], [`${c.attendance}%`, isAr ? 'حضور' : 'attend.']].map(([v, l]) => <div key={l as string} className="rounded-xl bg-ivory border border-sand-soft py-2"><div className="font-en font-extrabold text-[13px]">{v}</div><div className="text-[8px] text-charcoal/55 font-bold">{l}</div></div>)}</div>
        </button>
      ))}</div>
      <Modal open={!!cls} onClose={() => setSel(null)} title={cls ? `${isAr ? 'فصل' : 'Class'} ${cls.id}` : ''} sub={cls ? `${isAr ? cls.grade : cls.gradeEn} · ${isAr ? 'قاعة' : 'Room'} ${cls.room}` : ''}
        footer={<><button className="btn btn-outline" onClick={() => setSel(null)}>{isAr ? 'إغلاق' : 'Close'}</button><button className="btn btn-primary" onClick={() => { setSel(null); navigate('/teacher/grades'); }}><PenLine size={14} />{isAr ? 'رصد درجات الفصل' : 'Enter class grades'}</button></>}>
        {cls && <div className="text-[10.5px] text-charcoal/70 leading-7">{isAr ? 'القائمة الكاملة للطلاب مع الحلقات البيانية للتحصيل والحضور تظهر داخل نموذج الرصد — لا تُعرض كاملة في هذه المعاينة حماية لخصوصية الطلاب.' : 'The full roster with achievement and attendance charts renders inside the grading form — not shown in this preview to protect student privacy.'}</div>}
      </Modal>
    </div>
  );
}

function TeacherAttendance() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const roster = [
    ['ريان السبيعي', 'ST-3008'], ['ليان العتيبي', 'ST-3003'], ['سارة القحطاني', 'ST-3001'],
    ['عبدالله الشمري', 'ST-3002'], ['ريم المطيري', 'ST-3007'], ['لمى الحربي', 'ST-3009'],
  ];
  const [absent, setAbsent] = useState<string[]>(['لمى الحربي']);
  const toggle = (n: string) => setAbsent(p => p.includes(n) ? p.filter(x => x !== n) : [...p, n]);
  return (
    <div>
      <PageHead icon={ClipboardList} eyebrow={isAr ? 'القسم 6' : 'SECTION 6'} title={isAr ? 'الحضور والغياب — 2-أ اليوم' : 'Attendance — 2A Today'}
        desc={isAr ? 'رصد سريع لغياب الحصة الحالية — يصل فوراً لغياب المدرسة والإشعار التلقائي للأسرة.' : 'Quick roll call for the current period — syncs instantly to school absence and family auto-notification.'}
        actions={<><SampleBadge /><span className="chip chip-gold !h-7"><Clock size={11} />{isAr ? 'الحصة 4 · 2-أ · 10:15' : 'Period 4 · 2A · 10:15'}</span></>} />
      <div className="raven-card overflow-hidden">
        <CardTitle title={isAr ? 'اضغط الغائبين فقط' : 'Tap absentees only'} sub={`${roster.length - absent.length} / ${roster.length} ${isAr ? 'حاضر' : 'present'}`} />
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2">{roster.map(([n, id]) => {
          const a = absent.includes(n);
          return <button key={id} onClick={() => toggle(n)} className={`rounded-2xl border px-3 py-3 flex flex-col items-center gap-1.5 transition-all ${a ? 'border-red-300 bg-red-50' : 'border-sand-soft bg-ivory hover:border-green/40'}`}><span className={`h-11 w-11 rounded-full flex items-center justify-center text-[13px] font-black ${a ? 'bg-red-500 text-white' : 'bg-white border border-sand text-charcoal/60'}`}>{n.charAt(0)}</span><span className="text-[10px] font-bold">{n}</span><span className="text-[8px] font-mono text-charcoal/45">{id}</span></button>;
        })}</div>
        <div className="px-4 pb-4 flex gap-2"><button className="btn btn-primary !h-9" onClick={() => push(isAr ? `اعتُمد حضور 2-أ: ${roster.length - absent.length} حاضراً${absent.length ? ` و${absent.length} غائباً أُشعرت أسرهم` : ''}` : `2A attendance approved: ${roster.length - absent.length} present${absent.length ? `, ${absent.length} guardian(s) notified` : ''}`)}><Check size={15} />{isAr ? 'اعتماد وتحديث السجلات' : 'Approve & sync records'}</button><button className="btn btn-ghost !h-9" onClick={() => setAbsent([])}>{isAr ? 'الكل حاضر' : 'All present'}</button></div>
      </div>
      <Toaster toasts={toasts} />
    </div>
  );
}

function TeacherGrades() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const [rows, setRows] = useState(TEACHER_GRADEBOOK.map(r => ({ ...r })));
  const [saved, setSaved] = useState(false);
  const total = (r: typeof rows[0]) => r.quiz1 + r.quiz2 + r.mid + r.work;
  const setCell = (id: string, key: 'quiz1' | 'quiz2' | 'mid' | 'work', v: string) => {
    const n = Math.max(0, Math.min(key === 'mid' ? 20 : key === 'work' ? 10 : 10, Number(v) || 0));
    setRows(p => p.map(r => r.id === id ? { ...r, [key]: n } : r)); setSaved(false);
  };
  return (
    <div>
      <PageHead icon={PenLine} eyebrow={isAr ? 'القسم 7' : 'SECTION 7'} title={isAr ? 'إدخال الدرجات والتقييم — 1-أ' : 'Grades & Assessment — 1A'}
        desc={isAr ? 'رصد الدرجة بضغطة — المتوسط يُحتسب لحظياً، ويُقفل السجل بعد اعتماد المدير.' : 'Type once — averages compute live, then the register locks after principal sign-off.'}
        actions={<><SampleBadge /><button className="btn btn-primary !h-9" onClick={() => { setSaved(true); push(isAr ? 'حُفظت الدرجات — أُرسلت لمدير المدرسة للاعتماد' : 'Grades saved — sent to principal for sign-off'); }}><Check size={15} />{isAr ? 'حفظ وإرسال للاعتماد' : 'Save & submit'}</button></>} />
      <div className="raven-card overflow-hidden">
        <TableShell minWidth={760} head={<tr><th className="th">{isAr ? 'الطالب' : 'Student'}</th><th className="th">{isAr ? 'قصيرة 1 (10)' : 'Quiz 1 (10)'}</th><th className="th">{isAr ? 'قصيرة 2 (10)' : 'Quiz 2 (10)'}</th><th className="th">{isAr ? 'اختبار الشهر (20)' : 'Monthly (20)'}</th><th className="th">{isAr ? 'أعمال فصلية (10)' : 'Coursework (10)'}</th><th className="th">{isAr ? 'المجموع /50' : 'Total /50'}</th><th className="th">{isAr ? '%' : '%'}</th></tr>}>
          {rows.map(r => <tr key={r.id} className="hover:bg-ivory/60"><td className="td font-bold text-[11px]">{r.name}<div className="text-[8px] font-mono font-normal text-charcoal/45">{r.id}</div></td>
            {(['quiz1', 'quiz2', 'mid', 'work'] as const).map(k => <td key={k} className="td"><input type="number" className="raven-input !h-9 !w-16 text-center font-en font-bold" value={r[k]} onChange={e => setCell(r.id, k, e.target.value)} aria-label={k} /></td>)}
            <td className="td font-en font-extrabold text-[13px]">{total(r)}</td><td className="td"><span className={`font-en font-extrabold ${total(r) / 50 >= 0.8 ? 'text-green-deep' : total(r) / 50 >= 0.6 ? 'text-gold-deep' : 'text-red-600'}`}>{Math.round(total(r) / 50 * 100)}%</span></td>
          </tr>)}
        </TableShell>
        {saved && <div className="px-5 py-3 border-t border-green/30 bg-green-mist flex items-center gap-2 text-[10.5px] font-bold text-green-deep"><Lock size={13} />{isAr ? 'قُدّم السجل للاعتماد — سيتصل عليك بعد اعتماد المدير.' : 'Register submitted — you’ll be notified upon principal sign-off.'}</div>}
      </div>
      <Toaster toasts={toasts} />
    </div>
  );
}

function TeacherExams() {
  const { isAr } = useLang();
  const exams = [
    { t: isAr ? 'اختبار الشهر — الرياضيات 1-أ' : 'Monthly Math Exam — 1A', date: isAr ? '2 نوفمبر 2026 · 09:00' : 'Nov 2, 2026 · 09:00', state: isAr ? 'نموذج معتمد — ورقة الأسئلة جاهزة' : 'Approved paper — ready', tone: 'chip-green' },
    { t: isAr ? 'اختبار الشهر — الرياضيات 2-أ' : 'Monthly Math Exam — 2A', date: isAr ? '2 نوفمبر 2026 · 09:00' : 'Nov 2, 2026 · 09:00', state: isAr ? 'نموذج معتمد — ورقة الأسئلة جاهزة' : 'Approved paper — ready', tone: 'chip-green' },
    { t: isAr ? 'اختبار قصير — الرياضيات 3-أ (الإحصاء)' : 'Quiz — Math 3A (Statistics)', date: isAr ? '5 نوفمبر 2026' : 'Nov 5, 2026', state: isAr ? 'مسودة — بانتظار اعتماد المدير' : 'Draft — principal approval pending', tone: 'chip-gold' },
  ];
  return (
    <div>
      <PageHead icon={ClipboardList} eyebrow={isAr ? 'القسم 8' : 'SECTION 8'} title={isAr ? 'الاختبارات' : 'Exams'} desc={isAr ? 'اختباراتك القادمة وأوراق الأسئلة المعتمدة من الكنترول.' : 'Your upcoming exams and control-approved papers.'} actions={<SampleBadge />} />
      <div className="grid md:grid-cols-3 gap-3">{exams.map((e, i) => <div key={i} className="raven-card p-4"><div className="chip chip-blue w-fit"><CalendarDays size={10} />{e.date}</div><h3 className="text-[12px] font-extrabold leading-6 mt-2">{e.t}</h3><div className={`chip ${e.tone} mt-2`}>{e.state}</div></div>)}</div>
    </div>
  );
}

function TeacherHomework() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const [create, setCreate] = useState(false);
  const [busy, run] = useAsyncAction(1400);
  return (
    <div>
      <PageHead icon={ListChecks} eyebrow={isAr ? 'القسم 9' : 'SECTION 9'} title={isAr ? 'الواجبات والأنشطة' : 'Homework & Activities'}
        desc={isAr ? 'انشر واجباً أو نشاطاً — تتابع التسليم وتُصحح وتعيد الدرجات تلقائياً.' : 'Publish homework or an activity — track submissions, grade and return scores automatically.'}
        actions={<><SampleBadge /><button className="btn btn-primary !h-9" onClick={() => setCreate(true)}><Plus size={15} />{isAr ? 'واجب جديد' : 'New homework'}</button></>} />
      <div className="raven-card overflow-hidden">
        <TableShell minWidth={680} head={<tr><th className="th">{isAr ? 'الواجب' : 'Assignment'}</th><th className="th">{isAr ? 'الفصل' : 'Class'}</th><th className="th">{isAr ? 'التسليم' : 'Due'}</th><th className="th">{isAr ? 'سلّموا' : 'Submitted'}</th><th></th></tr>}>
          {HOMEWORK_ITEMS.map(h => <tr key={h.id} className="hover:bg-ivory/60"><td className="td font-bold text-[10.5px] max-w-72 leading-5">{h.title}</td><td className="td font-en font-bold">{h.cls}</td><td className="td text-[10px]">{h.due}</td><td className="td"><div className="flex items-center gap-2"><ProgressBar value={h.submitted / h.total * 100} tone="blue" /><span className="font-en text-[10px] font-bold">{h.submitted}/{h.total}</span></div></td><td className="td"><button className="text-[10px] font-extrabold text-deepblue hover:underline" onClick={() => push(isAr ? `فُتحت قائمة تصحيح ${h.cls} — ${h.submitted} تسليماً` : `Grading list opened — ${h.submitted} submissions`, 'info')}>{isAr ? 'تصحيح ←' : 'Grade ←'}</button></td></tr>)}
        </TableShell>
      </div>
      <Modal open={create} onClose={() => setCreate(false)} title={isAr ? 'نشر واجب جديد' : 'Publish New Homework'} sub={isAr ? 'يصل إشعار فوري لطلاب الفصل وأولياء أمورهم' : 'Students & guardians notified instantly'}
        footer={<><button className="btn btn-ghost" onClick={() => setCreate(false)}>{isAr ? 'إلغاء' : 'Cancel'}</button><BusyButton busy={busy} className="btn btn-primary" onClick={() => run(() => { setCreate(false); push(isAr ? 'نُشر الواجب — وصل إشعار للفصل والأسر' : 'Homework published — class & families notified'); })}>{isAr ? 'نشر للطلاب' : 'Publish'}</BusyButton></>}>
        <div className="grid gap-3"><div><label className="raven-label">{isAr ? 'العنوان' : 'Title'}</label><input className="raven-input" placeholder={isAr ? 'مثال: ورقة عمل — المسافة بين نقطتين' : 'e.g. Worksheet — distance between two points'} /></div><div className="grid grid-cols-2 gap-3"><div><label className="raven-label">{isAr ? 'الفصل' : 'Class'}</label><select className="raven-input"><option>1-أ</option><option>2-أ</option><option>3-أ</option></select></div><div><label className="raven-label">{isAr ? 'موعد التسليم' : 'Due'}</label><input type="date" className="raven-input font-en" defaultValue="2026-11-02" /></div></div><div><label className="raven-label">{isAr ? 'الدرجة' : 'Max points'}</label><input type="number" className="raven-input font-en" defaultValue={10} /></div></div>
      </Modal>
      <Toaster toasts={toasts} />
    </div>
  );
}

function TeacherBehavior() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const [voice, setVoice] = useState(false);
  return (
    <div>
      <PageHead icon={Sparkles} eyebrow={isAr ? 'القسم 10' : 'SECTION 10'} title={isAr ? 'السلوك والمواظبة — فصولي' : 'Behavior & Conduct — My Classes'}
        desc={isAr ? 'وثّق الموقف المتميز أو المخالفة داخل حصتك — تستخدم الإدخال الصوتي من السبورة أو يدوياً بعد الحصة.' : 'Document positive moments or violations from your class — voice capture from the board or manual entry after class.'}
        actions={<><SampleBadge /><button className="btn btn-gold !h-9" onClick={() => setVoice(true)}><Mic size={15} />{isAr ? 'توثيق صوتي' : 'Voice note'}</button></>} />
      <div className="grid md:grid-cols-2 gap-4">
        <div className="raven-card p-5"><div className="kpi-label mb-3">{isAr ? 'المواقف المتميزة التي وثقتها' : 'Positive Moments You Logged'}</div><div className="space-y-2">{[['ريان السبيعي (3-أ)', 'نقاش خوارزمي مميز في مسألة الإحصاء', '+5'], ['ليان العتيبي (1-أ)', 'ساعدت زميلتها في مراجعة الجبر قبل الاختبار', '+5'], ['عبدالله الشمري (3-أ)', 'التزم برفع النموذج الورقي مبكراً', '+5']].map((r, i) => <div key={i} className="flex items-center gap-2.5 rounded-xl border border-sand-soft px-3 py-2.5"><Sparkles size={15} className="text-gold-deep shrink-0" /><div className="min-w-0"><div className="text-[10px] font-bold">{r[0]}</div><div className="text-[9px] text-charcoal/60">{r[1]}</div></div><span className="font-en font-extrabold text-green-deep ms-auto">{r[2]}</span></div>)}</div></div>
        <div className="raven-card p-5 flex flex-col"><div className="kpi-label">{isAr ? 'توثيق سريع أثناء الحصة' : 'Quick Capture During Class'}</div><p className="text-[10.5px] text-charcoal/65 leading-6 mt-2">{isAr ? 'اضغط الميكروفون واذكر الموقف والطالب — رافين يربطه بملف الطالب ويُشعر ولي الأمر إن كان يستحق.' : 'Hit the mic and name the moment & student — Raven links it to the student file and notifies the guardian when warranted.'}</p><button className="btn btn-dark !h-10 mt-auto" onClick={() => setVoice(true)}><Mic size={16} />{isAr ? 'افتح الإدخال الصوتي الآن' : 'Open voice entry now'}</button></div>
      </div>
      <VoiceEntryModal open={voice} onClose={() => setVoice(false)} purpose={isAr ? 'مثال: «ريان السبيعي اكتشف خطأ في حل المسألة — مشاركة مميزة»' : 'e.g. “Rayan Al-Subaie spotted an error in the solution — outstanding participation”'} />
      <Toaster toasts={toasts} />
    </div>
  );
}

function TeacherAchievements() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const [uploading, setUploading] = useState(false);
  const evidence = [
    { t: isAr ? 'حصة نانو — الجبر عبر الألعاب التفاعلية' : 'Nano Lesson — Algebra via games', meta: isAr ? 'فيديو 4:12 · 2-أ · بانتظار اعتماد المدير' : 'Video 4:12 · 2A · Awaiting principal sign-off', tone: 'chip-gold' },
    { t: isAr ? 'معرض نماذج الطلاب — الدوال التربيعية' : 'Student Models Exhibition — Quadratics', meta: isAr ? '12 صورة · 1-أ و2-أ · معتمدة ✓' : '12 photos · 1A & 2A · Approved ✓', tone: 'chip-green' },
    { t: isAr ? 'ورقة عمل مبتكرة — المسافة بين نقطتين' : 'Original Worksheet — Point-to-Point Distance', meta: isAr ? 'PDF · معتمدة ✓ أُضيفت لملف الأداء' : 'PDF · Approved ✓ added to performance file', tone: 'chip-green' },
  ];
  return (
    <div>
      <PageHead icon={Trophy} eyebrow={isAr ? 'القسم 11' : 'SECTION 11'} title={isAr ? 'الشواهد والإنجازات' : 'Evidence & Achievements'}
        desc={isAr ? 'ملفك المهني الحي — كل شاهد ترفعه يبني ملف أدائك للترقية والاعتماد المهني.' : 'Your living professional portfolio — every item you file builds your performance record for licensing & promotion.'}
        actions={<><SampleBadge /><button className="btn btn-primary !h-9" onClick={() => { setUploading(true); window.setTimeout(() => { setUploading(false); push(isAr ? 'رُفع الشاهد — أُشعر مدير المدرسة للاعتماد' : 'Evidence uploaded — principal notified for sign-off'); }, 1800); }}>{uploading ? <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> : <Plus size={15} />}{isAr ? 'رفع شاهد' : 'Upload evidence'}</button></>} />
      <div className="grid md:grid-cols-3 gap-4">{evidence.map((e, i) => <div key={i} className="raven-card p-4"><span className="h-11 w-11 rounded-2xl bg-gold-soft text-gold-deep flex items-center justify-center"><Trophy size={19} /></span><h3 className="text-[11.5px] font-extrabold leading-6 mt-2.5">{e.t}</h3><div className={`chip ${e.tone} mt-2`}>{e.meta}</div></div>)}</div>
      <div className="raven-card mt-4 p-5 flex flex-col sm:flex-row items-center gap-5"><Donut value={78} size={96} label={isAr ? 'اكتمال الملف' : 'portfolio'} color="#D4AF37" /><div className="text-[11px] leading-7 text-charcoal/75"><b className="text-charcoal">{isAr ? 'ملف الأداء المهني — السنة الثالثة' : 'Professional Performance File — Year 3'}</b><br />{isAr ? 'لديك 18 شاهداً معتمداً من 23 مطلوبة لدورة الترقية. المتبقية: حضور 3 دورات + 5 حصص نانو موثقة.' : 'You hold 18 of 23 approved evidence items for promotion. Remaining: 3 trainings + 5 documented nano lessons.'}</div><button className="btn btn-gold shrink-0" onClick={() => push(isAr ? 'خطة الترقية أُنشئت — تصلك الذكريات كل أسبوعين' : 'Promotion plan created — bi-weekly reminders scheduled', 'info')}>{isAr ? 'خطة الترقية الذكية ←' : 'Smart promotion plan ←'}</button></div>
      <Toaster toasts={toasts} />
    </div>
  );
}

function GenericSimple({ title, titleEn, icon: Icon, children }: { title: string; titleEn: string; icon: typeof BellRing; children: React.ReactNode }) {
  return (
    <div>
      <PageHead icon={Icon} title={title} eyebrow={titleEn} actions={<SampleBadge />} />
      {children}
    </div>
  );
}

function TeacherLibrary() {
  const { isAr } = useLang();
  const items = [
    { t: isAr ? 'خطط جاهزة — الجبر والهندسة (الصفوف 1-3)' : 'Ready plans — Algebra & Geometry (1-3)', tag: isAr ? '14 خطة' : '14 plans' },
    { t: isAr ? 'أوراق عمل معتمدة — الرياضيات' : 'Approved worksheets — Math', tag: isAr ? '32 ورقة' : '32 sheets' },
    { t: isAr ? ' بنك أسئلة الاختبارات — الوحدة الثانية' : 'Question bank — Unit 2', tag: isAr ? '220 سؤال' : '220 items' },
    { t: isAr ? 'شواهد ممتازة من زملائي (بإذن)' : 'Excellent peer evidence (with consent)', tag: isAr ? '18 شاهداً' : '18 items' },
  ];
  return (
    <GenericSimple title={isAr ? 'مكتبة رافين — للمعلمين' : 'Raven Library — For Teachers'} titleEn="SECTION 12" icon={Library}>
      <div className="grid sm:grid-cols-2 gap-3">{items.map((it, i) => <button key={i} className="raven-card p-5 text-start hover:border-gold transition-colors flex items-center gap-3"><span className="h-11 w-11 rounded-xl bg-green-soft text-green-deep flex items-center justify-center shrink-0"><Library size={20} /></span><span><span className="block text-[11.5px] font-bold leading-5">{it.t}</span><span className="chip chip-sand mt-1.5">{it.tag}</span></span></button>)}</div>
    </GenericSimple>
  );
}

function TeacherNotices() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const items = NOTIFICATIONS.teacher;
  return (
    <GenericSimple title={isAr ? 'الإشعارات والتواصل' : 'Notifications & Messages'} titleEn="SECTION 13" icon={BellRing}>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="raven-card overflow-hidden"><CardTitle title={isAr ? 'إشعاراتي' : 'My Notifications'} /><div className="divide-y divide-sand-soft/70">{items.map(n => <div key={n.id} className="px-4 py-3 text-[11px] leading-6 text-charcoal/85">{isAr ? n.ar : n.en}<div className="text-[8.5px] text-charcoal/45 font-bold mt-0.5">{isAr ? n.time : n.timeEn}</div></div>)}</div></div>
        <form className="raven-card p-4 flex flex-col gap-2.5" onSubmit={e => { e.preventDefault(); push(isAr ? 'وصلت رسالتك لمدير المدرسة — سيرد خلال الدوام' : 'Message delivered to the principal — reply expected during school hours'); }}>
          <div className="kpi-label">{isAr ? 'أرسل لأ. خالد المطيري (مدير المدرسة)' : 'Message the Principal'}</div>
          <textarea className="raven-input !h-36 py-3" placeholder={isAr ? 'اكتب رسالتك — ستُرفق هويتك ودورك تلقائياً…' : 'Type your message — your identity and role attach automatically…'} required />
          <button type="submit" className="btn btn-primary self-start"><Send size={15} />{isAr ? 'إرسال' : 'Send'}</button>
        </form>
      </div>
      <Toaster toasts={toasts} />
    </GenericSimple>
  );
}

function TeacherProfile() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  return (
    <GenericSimple title={isAr ? 'الملف الشخصي والإعدادات' : 'Profile & Settings'} titleEn="SECTION 14" icon={UserRound}>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="raven-card p-6 flex flex-col items-center text-center"><span className="h-20 w-20 rounded-full bg-charcoal text-gold text-[26px] font-black flex items-center justify-center">س</span><h3 className="font-black text-[16px] mt-3">{me.name}</h3><div className="text-[10px] text-green-deep font-bold mt-0.5">{isAr ? 'معلمة رياضيات — الصفوف الثانوية' : 'Mathematics Teacher — Secondary'}</div><div className="text-[9px] text-charcoal/55 mt-2 leading-5">s.harbi@mustaqbal.edu.sa<br />{me.specialty} · {isAr ? 'منذ 2019' : 'since 2019'}</div></div>
        <div className="raven-card lg:col-span-2 p-5">
          <div className="kpi-label mb-3">{isAr ? 'تفضيلات الإشعارات' : 'Notification Preferences'}</div>
          <div className="space-y-2.5">{[isAr ? 'إشعار فوري عند اعتماد درجة' : 'Grades approved', isAr ? 'تذكير بموعد تسليم الواجبات قبلها بيوم' : 'Homework due in 1 day', isAr ? 'تنبيه حصة الآن (قبل 5 دقائق)' : 'Class starting in 5 minutes', isAr ? 'ملخص صباحي لمهامي اليوم 06:30' : 'Morning task digest at 06:30'].map((l, i) => <label key={i} className="flex items-center justify-between gap-4 border-b border-sand-soft/60 pb-2.5"><span className="text-[11px] font-bold text-charcoal/85">{l}</span><input type="checkbox" defaultChecked className="h-4.5 w-4.5 accent-[#08794F]" /></label>)}</div>
          <button className="btn btn-primary !h-9 mt-4" onClick={() => push(isAr ? 'حُفظت تفضيلاتك' : 'Preferences saved')}>{isAr ? 'حفظ' : 'Save'}</button>
        </div>
      </div>
      <Toaster toasts={toasts} />
    </GenericSimple>
  );
}

export default function TeacherPortal() {
  return (
    <Routes>
      <Route index element={<TeacherHome />} />
      <Route path="timetable" element={<TeacherTimetable />} />
      <Route path="tasks" element={<TeacherTasks />} />
      <Route path="lesson-plans" element={<LessonPlans />} />
      <Route path="classes" element={<TeacherClasses />} />
      <Route path="attendance" element={<TeacherAttendance />} />
      <Route path="grades" element={<TeacherGrades />} />
      <Route path="exams" element={<TeacherExams />} />
      <Route path="homework" element={<TeacherHomework />} />
      <Route path="behavior" element={<TeacherBehavior />} />
      <Route path="achievements" element={<TeacherAchievements />} />
      <Route path="library" element={<TeacherLibrary />} />
      <Route path="notices" element={<TeacherNotices />} />
      <Route path="profile" element={<TeacherProfile />} />
      <Route path="settings" element={<TeacherProfile />} />
      <Route path="*" element={<Navigate to="/teacher" replace />} />
    </Routes>
  );
}
