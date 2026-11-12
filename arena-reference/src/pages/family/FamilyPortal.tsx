/* ═════════════════════════════════════════════════════════════
   بوابة الأسرة — متابعة الأبناء (12 قسماً) مع محدد الطفل
   Family Portal — multi-child, relationship-verified access
   ═════════════════════════════════════════════════════════════ */
import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, NavLink } from 'react-router-dom';
import {
  LayoutDashboard, UsersRound, ClipboardList, GaugeCircle, PenLine, ListChecks, Sparkles,
  CalendarDays, BellRing, Landmark, FileBarChart2, UserRound, Check, CheckCircle2, Clock,
  Download, Send, ShieldCheck, AlertTriangle, PhoneCall, Flame, TrendingUp, ThumbsUp,
} from 'lucide-react';
import { useLang, L } from '../../lib/i18n';
import { FAMILY_CHILDREN, FAMILY_GRADES, BEHAVIOR_RECORDS, ATTENDANCE_MONTH, TIMETABLE_TODAY, NOTIFICATIONS } from '../../lib/data';
import {
  PageHead, KpiCard, CardTitle, ProgressBar, Donut, TrendChart, Bars, Modal, EmptyState,
  TableShell, StatusDot, SampleBadge, useToasts, Toaster,
} from '../../components/raven';

type Child = typeof FAMILY_CHILDREN[number];

/* ── child context provided via outlet-like prop drilling ── */
function ChildSwitcher({ child, setChild }: { child: Child; setChild: (c: Child) => void }) {
  const { isAr } = useLang();
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-[10px] font-extrabold text-charcoal/55 uppercase tracking-wide flex items-center gap-1.5"><UsersRound size={12} />{isAr ? 'أطفالي:' : 'My children:'}</span>
      {FAMILY_CHILDREN.map(c => (
        <button key={c.id} onClick={() => setChild(c)}
          className={`flex items-center gap-2 h-11 ps-1.5 pe-4 rounded-2xl border transition-all ${c.id === child.id ? 'border-green bg-green-mist ring-1 ring-green shadow-sm' : 'border-sand-soft bg-white hover:border-sand'}`}
          aria-pressed={c.id === child.id}>
          <span className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-black text-white" style={{ background: c.color }}>{c.name.charAt(0)}</span>
          <span className="text-start leading-4">
            <span className="block text-[11px] font-extrabold">{c.name}</span>
            <span className="block text-[8px] text-charcoal/55 font-bold">{isAr ? c.gradeAr : c.gradeEn}</span>
          </span>
          {c.id === child.id && <Check size={14} className="text-green-deep" strokeWidth={3.5} />}
        </button>
      ))}
      <span className="chip chip-blue !h-7 ms-auto"><ShieldCheck size={11} />{isAr ? 'صلة قرابة موثقة — وصول مصرح' : 'Verified relationship — authorized access'}</span>
    </div>
  );
}

function FamilyHome({ child, setChild }: { child: Child; setChild: (c: Child) => void }) {
  const { isAr } = useLang();
  const navigate = useNavigate();
  const homework = [
    { t: isAr ? 'حل تمارين الوحدة الثانية — الجبر' : 'Unit 2 exercises — Algebra', due: isAr ? 'غداً 07:30' : 'Tomorrow 07:30', done: false },
    { t: isAr ? 'كتابة الفقرة التعريفية — اللغة الإنجليزية' : 'Introductory paragraph — English', due: isAr ? 'غداً 07:30' : 'Tomorrow 07:30', done: false },
    { t: isAr ? 'قراءة نص «الطموح» ومناقشته' : 'Reading “Ambition” passage', due: isAr ? 'اليوم' : 'Today', done: true },
  ];
  return (
    <div>
      <PageHead icon={LayoutDashboard} eyebrow={isAr ? 'الخميس 29 أكتوبر 2026' : 'Thursday, Oct 29, 2026'}
        title={isAr ? `أهلاً أم ريان — ${child.name.split(' ')[0]} اليوم` : `Welcome, Mrs. Rayan's mom — today with ${child.name.split(' ')[0]}`}
        desc={isAr ? 'ملخص يوم طفلك الدراسي: الحضور، الدرجات، الواجبات، والإشعارات — كل ذلك في مكان واحد.' : 'Your child’s school day at a glance: attendance, grades, homework and alerts — all in one place.'}
        actions={<SampleBadge />} />
      <ChildSwitcher child={child} setChild={setChild} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard tone="green" icon={ClipboardList} label={isAr ? 'الحضور هذا الشهر' : 'Attendance this month'} value={`${child.attendance}%`} foot={isAr ? `${child.streak} يوماً متواصلاً بين العام الماضي والحالي` : `${child.streak} consecutive days`} />
        <KpiCard tone="gold" icon={TrendingUp} label={isAr ? 'متوسط التحصيل' : 'Avg. achievement'} value={`${child.avg}%`} delta={2.4} />
        <KpiCard tone="blue" icon={Sparkles} label={isAr ? 'رصيد السلوك المتميز' : 'Positive behavior points'} value={child.behaviorPts} unit={isAr ? 'نقطة' : 'pts'} />
        <KpiCard tone="charcoal" icon={Flame} label={isAr ? 'سلسلة الإنجاز' : 'Streak'} value={child.streak} unit={isAr ? 'يوماً' : 'days'} foot={<span className="!text-gold/80">{isAr ? 'أطول سلسلة لهذا العام في فصله' : 'Longest streak in class this year'}</span>} />
      </div>

      <div className="grid xl:grid-cols-3 gap-4 mt-4">
        <div className="raven-card xl:col-span-2 overflow-hidden">
          <CardTitle title={isAr ? `جدول ${child.name.split(' ')[0]} — اليوم` : `${child.name.split(' ')[0]}’s Timetable — Today`} action={<button className="text-[10.5px] font-bold text-green-deep hover:underline" onClick={() => navigate('/family/timetable')}>{isAr ? 'الجدول الكامل' : 'Full timetable'} ←</button>} />
          <div className="divide-y divide-sand-soft/70">{TIMETABLE_TODAY.filter(p => !['break'].includes(p.state)).slice(0, 6).map(p => (
            <div key={p.period} className="flex items-center gap-3 px-5 py-2.5"><span className="font-en text-[11px] font-extrabold text-charcoal/45 w-5">{p.period}</span><span className="font-mono text-[9px] text-charcoal/50 w-24 shrink-0 hidden sm:block">{p.time}</span><span className="text-[11px] font-bold flex-1">{p.subject}</span><span className="text-[9px] text-charcoal/55">{isAr ? 'القاعة' : 'Rm'} {p.room}</span></div>
          ))}</div>
        </div>
        <div className="space-y-4">
          <div className="raven-card overflow-hidden">
            <CardTitle title={isAr ? 'واجبات معلقة' : 'Pending Homework'} action={<button className="text-[10px] font-bold text-green-deep hover:underline" onClick={() => navigate('/family/homework')}>{isAr ? 'الكل' : 'All'} ←</button>} />
            <div className="p-4 space-y-2">{homework.map((h, i) => <div key={i} className="flex items-start gap-2">{h.done ? <CheckCircle2 size={15} className="text-green shrink-0 mt-0.5" /> : <Clock size={15} className="text-gold-deep shrink-0 mt-0.5" />}<div><p className={`text-[10.5px] leading-5 ${h.done ? 'line-through text-charcoal/45' : 'text-charcoal/85 font-bold'}`}>{h.t}</p><span className="text-[8.5px] text-charcoal/50">{h.due}</span></div></div>)}</div>
          </div>
          <div className="raven-card p-4 bg-charcoal"><div className="flex items-center gap-2 text-gold text-[10.5px] font-black"><BellRing size={13} />{isAr ? 'إشعار جديد' : 'NEW NOTICE'}</div><p className="text-[10.5px] leading-6 text-ivory/85 mt-1.5">{isAr ? 'اجتماع مجلس أولياء الأمور — الثلاثاء القادم 10:00 صباحاً عبر منصة مدرستي. سيحضره مدير المدرسة ومعلمو الفصل — لا يلزم الحضور الشخصي.' : 'Parents Council — next Tuesday 10:00 AM via Madrasati. Principal and class teachers will attend — no physical attendance needed.'}</p></div>
        </div>
      </div>
    </div>
  );
}

function ChildrenPage({ child, setChild }: { child: Child; setChild: (c: Child) => void }) {
  const { isAr } = useLang();
  return (
    <div>
      <PageHead icon={UsersRound} eyebrow={isAr ? 'القسم 2' : 'SECTION 2'} title={isAr ? 'أبنائي' : 'My Children'}
        desc={isAr ? 'ملفات ريان ولمى — كل طفل ببياناته المستقلة: التحصيل، الحضور، السلوك.' : 'Profiles of Rayan and Lama — each child with independent data: achievement, attendance, conduct.'}
        actions={<SampleBadge />} />
      <div className="grid md:grid-cols-2 gap-4">{FAMILY_CHILDREN.map(c => (
        <div key={c.id} className={`raven-card overflow-hidden transition-all ${c.id === child.id ? 'ring-2 ring-green' : ''}`}>
          <div className="p-5 text-white" style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}DD)` }}>
            <div className="flex items-center gap-4"><span className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-[26px] font-black">{c.name.charAt(0)}</span><div><div className="text-[17px] font-black">{c.name}</div><div className="text-[10px] opacity-85 font-bold">{isAr ? c.gradeAr : c.gradeEn} · {isAr ? 'العمر' : 'Age'} {c.age}</div></div></div>
          </div>
          <div className="p-4 grid grid-cols-3 gap-2 text-center">{[[`${c.avg}%`, isAr ? 'التحصيل' : 'Avg'], [`${c.attendance}%`, isAr ? 'الحضور' : 'Attend.'], [String(c.behaviorPts), isAr ? 'نقاط السلوك' : 'Conduct pts']].map(([v, l]) => <div key={l as string} className="rounded-xl bg-ivory border border-sand-soft py-3"><div className="font-en font-extrabold text-[16px]">{v}</div><div className="text-[9px] font-bold text-charcoal/55">{l}</div></div>)}</div>
          <div className="px-4 pb-4"><button className="btn btn-primary !h-9 w-full justify-center" onClick={() => setChild(c)}>{c.id === child.id ? <><Check size={15} />{isAr ? 'معروض حالياً' : 'Currently viewing'}</> : (isAr ? `عرض بيانات ${c.name.split(' ')[0]}` : `View ${c.name.split(' ')[0]}’s data`)}</button></div>
        </div>
      ))}</div>
    </div>
  );
}

function AttendancePage({ child }: { child: Child }) {
  const { isAr } = useLang();
  const total = ATTENDANCE_MONTH.length;
  const present = ATTENDANCE_MONTH.filter(v => v >= 90).length;
  return (
    <div>
      <PageHead icon={ClipboardList} eyebrow={isAr ? 'القسم 3' : 'SECTION 3'} title={isAr ? `الحضور والغياب — ${child.name.split(' ')[0]}` : `Attendance — ${child.name.split(' ')[0]}`}
        desc={isAr ? 'سجل يومي تفاعلي للشهر الحالي — التأخير، الغياب، والاستثناءات بعذر.' : 'Interactive daily log for the current month — lateness, absence and excused exceptions.'}
        actions={<SampleBadge />} />
      <div className="grid xl:grid-cols-3 gap-4">
        <div className="raven-card xl:col-span-2 p-5">
          <div className="kpi-label mb-3">{isAr ? 'أكتوبر 2026 — يوم بيوم' : 'October 2026 — day by day'}</div>
          <div className="grid grid-cols-8 gap-1.5">{ATTENDANCE_MONTH.map((v, i) => <div key={i} className={`aspect-square rounded-xl flex flex-col items-center justify-center text-[9px] font-black ${v >= 96 ? 'bg-green text-white' : v >= 90 ? 'bg-gold text-charcoal' : 'bg-red-400 text-white'}`}><span className="font-en text-[8px] opacity-80">{i + 1}</span>{v >= 96 ? '✓' : v >= 90 ? 'ت' : 'غ'}</div>)}</div>
          <div className="flex flex-wrap gap-3 mt-4 text-[9.5px] font-bold text-charcoal/65"><span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-green" />{isAr ? 'حاضر' : 'Present'}</span><span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-gold" />{isAr ? 'تأخير' : 'Late'}</span><span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-red-400" />{isAr ? 'غياب' : 'Absent'}</span></div>
        </div>
        <div className="space-y-4">
          <KpiCard tone="green" label={isAr ? 'نسبة الحضور' : 'Attendance rate'} value={`${child.attendance}%`} icon={CheckCircle2} />
          <KpiCard label={isAr ? 'أيام الحضور' : 'Days present'} value={`${present} / ${total}`} icon={ClipboardList} />
          <KpiCard tone="gold" label={isAr ? 'تأخيرات مسجلة' : 'Recorded lates'} value="2" icon={Clock} foot={isAr ? 'التأخير 3 مرات يستدعي اجتماعاً مع المرشدة' : '3 lates triggers a counselor meeting'} />
          <button className="btn btn-outline w-full !h-11">{isAr ? 'تقديم عذر مرضي لغياب غد ←' : 'Submit medical excuse for tomorrow ←'}</button>
        </div>
      </div>
    </div>
  );
}

function ProgressPage({ child }: { child: Child }) {
  const { isAr } = useLang();
  const data = [82, 84, 85.8, 87.9, child.avg];
  const months = isAr ? ['يونيو', 'سبتمبر', 'أكتوبر', 'نوف', 'الآن'] : ['Jun', 'Sep', 'Oct', 'Nov', 'Now'];
  return (
    <div>
      <PageHead icon={GaugeCircle} eyebrow={isAr ? 'القسم 4' : 'SECTION 4'} title={isAr ? `المستوى والتقدم الدراسي — ${child.name.split(' ')[0]}` : `Progress & Level — ${child.name.split(' ')[0]}`}
        desc={isAr ? 'كيف يتطور طفلك عبر الأشهر — لكل مادة مقارنة بمتوسط فصله.' : 'How your child grows month over month — each subject vs. class average.'}
        actions={<SampleBadge />} />
      <div className="grid xl:grid-cols-3 gap-4">
        <div className="raven-card xl:col-span-2 p-5"><CardTitle title={isAr ? 'منحنى التحصيل العام' : 'Overall Achievement Curve'} /><div className="p-2"><TrendChart data={data} labels={months} color="#08794F" format={v => v.toFixed(0)} /></div></div>
        <div className="raven-card p-5 flex flex-col items-center justify-center"><Donut value={child.avg} size={130} label={isAr ? 'المتوسط العام' : 'Overall avg.'} color={child.color} /><p className="text-[10px] text-charcoal/60 mt-3 text-center leading-5">{isAr ? `مرتبته في الفصل: الثالث من ${child.id === 'ST-3008' ? 31 : 30}` : `Class rank: 3rd of ${child.id === 'ST-3008' ? 31 : 30}`}</p></div>
      </div>
      <div className="raven-card mt-4 overflow-hidden"><CardTitle title={isAr ? 'تفاصيل حسب المادة — مقارنة بمتوسط الفصل' : 'By Subject — vs Class Average'} />
        <TableShell minWidth={600} head={<tr><th className="th">{isAr ? 'المادة' : 'Subject'}</th><th className="th">{isAr ? 'الدرجة /20' : 'Score /20'}</th><th className="th">{isAr ? 'متوسط الفصل' : 'Class avg.'}</th><th className="th">{isAr ? 'التقييم' : 'Grade'}</th><th className="th">{isAr ? 'الفرق' : 'Gap'}</th></tr>}>
          {FAMILY_GRADES.map(g => <tr key={g.subject} className="hover:bg-ivory/60"><td className="td font-bold text-[11px]">{isAr ? g.subject : g.subjectEn}</td><td className="td font-en font-extrabold">{g.score}</td><td className="td font-en text-charcoal/60">{g.avg}</td><td className="td"><span className="chip chip-green">{g.letter}</span></td><td className="td font-en font-bold text-green-deep">+{(g.score - g.avg).toFixed(1)}</td></tr>)}
        </TableShell>
      </div>
    </div>
  );
}

function GradesPage({ child }: { child: Child }) {
  const { isAr } = useLang();
  return (
    <div>
      <PageHead icon={PenLine} eyebrow={isAr ? 'القسم 5' : 'SECTION 5'} title={isAr ? `الدرجات والتقييمات — ${child.name.split(' ')[0]}` : `Grades & Assessments — ${child.name.split(' ')[0]}`}
        desc={isAr ? 'نتائج كل الاختبارات والواجبات — تظهر فور اعتماد المعلم لها.' : 'Every quiz and exam — published the moment the teacher approves it.'}
        actions={<SampleBadge />} />
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">{FAMILY_GRADES.map(g => <div key={g.subject} className="raven-card p-4"><div className="flex items-center justify-between"><span className="text-[11px] font-extrabold">{isAr ? g.subject : g.subjectEn}</span><span className="chip chip-green">{g.letter}</span></div><div className="mt-2 flex items-end gap-2"><span className="font-en font-black text-[30px] leading-8">{g.score}</span><span className="text-[11px] font-bold text-charcoal/50 pb-0.5">/ {g.max}</span><span className="chip chip-sand ms-auto mb-0.5">{isAr ? 'اختبار شهري' : 'monthly exam'}</span></div><ProgressBar value={(g.score / g.max) * 100} tone="green" /></div>)}</div>
    </div>
  );
}

function HomeworkFamily({ child }: { child: Child }) {
  const { isAr } = useLang();
  const items = [
    { t: isAr ? 'حل تمارين الوحدة الثانية — الجبر' : 'Unit 2 exercises — Algebra', s: 'الرياضيات · أ. سارة الحربي', due: isAr ? 'غداً 07:30' : 'Tomorrow', state: 'open' as const },
    { t: isAr ? 'كتابة الفقرة التعريفية' : 'Introductory paragraph', s: 'اللغة الإنجليزية · أ. هند المطيري', due: isAr ? 'غداً 07:30' : 'Tomorrow', state: 'open' as const },
    { t: isAr ? 'قراءة نص «الطموح»' : 'Reading “Ambition”', s: 'اللغة العربية · أ. رنا العتيبي', due: isAr ? 'اليوم' : 'Today', state: 'done' as const },
    { t: isAr ? 'بحث: الدوال التربيعية في الحياة' : 'Research: quadratics in real life', s: 'الرياضيات · مشروع', due: isAr ? 'الخميس' : 'Thursday', state: 'open' as const },
  ];
  return (
    <div>
      <PageHead icon={ListChecks} eyebrow={isAr ? 'القسم 6' : 'SECTION 6'} title={isAr ? `الواجبات والمهام — ${child.name.split(' ')[0]}` : `Homework & Tasks — ${child.name.split(' ')[0]}`}
        desc={isAr ? 'كل ما يُتوقع من طفلك — مع التواريخ والحالة لحظة بلحظة.' : 'Everything expected of your child — dates and status, up to the minute.'}
        actions={<SampleBadge />} />
      <div className="raven-card divide-y divide-sand-soft/70 overflow-hidden">{items.map((h, i) => <div key={i} className="flex items-center gap-3 px-5 py-4">{h.state === 'done' ? <CheckCircle2 size={19} className="text-green shrink-0" /> : <Clock size={19} className="text-gold-deep shrink-0" />}<div className="min-w-0 flex-1"><p className={`text-[11.5px] font-bold leading-5 ${h.state === 'done' ? 'line-through text-charcoal/45' : ''}`}>{h.t}</p><div className="text-[9px] text-charcoal/55 mt-0.5">{h.s}</div></div><span className="chip chip-sand shrink-0">{h.due}</span></div>)}</div>
    </div>
  );
}

function BehaviorFamily({ child }: { child: Child }) {
  const { isAr } = useLang();
  return (
    <div>
      <PageHead icon={Sparkles} eyebrow={isAr ? 'القسم 7' : 'SECTION 7'} title={isAr ? `السلوك والمواظبة — ${child.name.split(' ')[0]}` : `Behavior & Conduct — ${child.name.split(' ')[0]}`}
        desc={isAr ? 'المواقف المتميزة والملاحظات — موثقة بأمانة كما يراها معلم حصة طفلك.' : 'Positive moments and notes — documented honestly as your child’s teacher saw them.'}
        actions={<SampleBadge />} />
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="raven-card p-6 flex flex-col items-center justify-center text-center"><Sparkles size={30} className="text-gold-deep mb-2" /><div className="font-en font-black text-[42px] leading-10 text-charcoal">{child.behaviorPts}</div><div className="text-[10px] font-bold text-charcoal/55 mt-1">{isAr ? 'رصيد النقاط هذا الفصل' : 'Points this term'}</div><div className="chip chip-green mt-3">{isAr ? 'ممتاز — ضمن أعلى 15% في فصله' : 'Excellent — top 15% of class'}</div></div>
        <div className="raven-card lg:col-span-2 overflow-hidden"><CardTitle title={isAr ? 'آخر التوثيقات' : 'Latest Entries'} /><div className="divide-y divide-sand-soft/70">{BEHAVIOR_RECORDS.map(b => <div key={b.id} className="px-4 py-3 flex gap-2.5"><span className={`mt-0.5 h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${b.type === 'متميز' ? 'bg-gold-soft text-gold-deep' : 'bg-red-50 text-red-500'}`}>{b.type === 'متميز' ? <ThumbsUp size={14} /> : <AlertTriangle size={14} />}</span><div><p className="text-[10.5px] leading-5 text-charcoal/85">{b.text}</p><div className="text-[8.5px] text-charcoal/50 mt-0.5 font-bold">{b.date} · {b.by} · <span className={b.pts > 0 ? 'text-green-deep' : 'text-red-600'}>{b.pts > 0 ? '+' : ''}{b.pts} {isAr ? 'نقطة' : 'pts'}</span></div></div></div>)}</div></div>
      </div>
    </div>
  );
}

function TimetableFamily({ child }: { child: Child }) {
  const { isAr } = useLang();
  const days = isAr ? ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'];
  return (
    <div>
      <PageHead icon={CalendarDays} eyebrow={isAr ? 'القسم 8' : 'SECTION 8'} title={isAr ? `الجدول المدرسي — ${child.name.split(' ')[0]}` : `Timetable — ${child.name.split(' ')[0]}`}
        desc={isAr ? 'جدول الفصل الأسبوعي — محدث لحظياً من إدارة المدرسة المعتمدة.' : 'Weekly class schedule — live from the principal-approved school timetable.'}
        actions={<SampleBadge />} />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">{days.map((d, di) => <div key={d} className={`raven-card p-4 ${di === 0 ? 'ring-2 ring-gold' : ''}`}><div className="font-black text-[11px] text-center">{d}{di === 0 && <span className="block text-[8px] text-gold-deep font-en">{isAr ? 'اليوم' : 'TODAY'}</span>}</div><div className="mt-2 space-y-1 text-[8.5px] text-center leading-4 text-charcoal/75">{['رياضيات', 'علوم', 'لغة عربية', 'حاسب', 'إنجليزي', 'تربية بدنية', 'دراسة ذاتية'].map((s, i) => <div key={i} className="bg-ivory rounded-md py-1">{i + 1} · {s}</div>)}</div></div>)}</div>
    </div>
  );
}

function NotificationsFamily() {
  const { isAr } = useLang();
  const items = NOTIFICATIONS.family;
  return (
    <div>
      <PageHead icon={BellRing} eyebrow={isAr ? 'القسم 9' : 'SECTION 9'} title={isAr ? 'الإشعارات والتنبيهات' : 'Notifications & Alerts'}
        desc={isAr ? 'كل ما تحتاجه الأسرة — الغياب، الدرجات، المدرسة، الطوارئ — في مكان واحد.' : 'Everything families need — absence, grades, school, emergencies — in one place.'}
        actions={<SampleBadge />} />
      <div className="max-w-2xl space-y-2">{items.map(n => <div key={n.id} className="raven-card flex gap-3 p-4"><span className="h-2 w-2 rounded-full bg-gold mt-1.5 shrink-0" /><div><p className="text-[11.5px] leading-6 text-charcoal/90">{isAr ? n.ar : n.en}</p><span className="text-[8.5px] font-bold text-charcoal/45">{isAr ? n.time : n.timeEn}</span></div></div>)}</div>
    </div>
  );
}

function ContactPage() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const [sent, setSent] = useState(false);
  return (
    <div>
      <PageHead icon={Landmark} eyebrow={isAr ? 'القسم 10' : 'SECTION 10'} title={isAr ? 'التواصل مع المدرسة' : 'Contact School'}
        desc={isAr ? 'راسل المرشدة أو مدير المدرسة — تصل رسالتك مع هوية علاقتك الموثقة بالطالب.' : 'Message the counselor or principal — your verified guardian identity travels with every message.'}
        actions={<SampleBadge />} />
      <div className="grid lg:grid-cols-5 gap-4">
        <form className="raven-card lg:col-span-3 p-5 flex flex-col gap-3" onSubmit={e => { e.preventDefault(); setSent(true); push(isAr ? 'وصلت رسالتك — سترد المرشدة خلال الدوام الرسمي' : 'Delivered — the counselor will reply during school hours'); }}>
          <div className="grid grid-cols-2 gap-3"><div><label className="raven-label">{isAr ? 'إلى' : 'To'}</label><select className="raven-input"><option>{isAr ? 'المرشدة الطلابية — أ. هند المطيري' : 'Counselor — Hind Al-Mutairi'}</option><option>{isAr ? 'مدير المدرسة — أ. خالد المطيري' : 'Principal — Khalid Al-Mutairi'}</option><option>{isAr ? 'معلم/معلمة المادة' : 'Subject teacher'}</option></select></div><div><label className="raven-label">{isAr ? 'بخصوص' : 'Regarding'}</label><select className="raven-input"><option>ريان السبيعي (3-أ)</option><option>لمى السبيعي (1-ب)</option></select></div></div>
          <div><label className="raven-label">{isAr ? 'الموضوع' : 'Subject'}</label><input className="raven-input" placeholder={isAr ? 'موضوع الرسالة' : 'Message subject'} required /></div>
          <div><label className="raven-label">{isAr ? 'رسالتك' : 'Your message'}</label><textarea className="raven-input !h-32 py-3" placeholder={isAr ? 'اكتب التفاصيل — كلما كانت أدق كان الرد أسرع…' : 'Write the details — the more precise, the faster the reply…'} required /></div>
          <button type="submit" className="btn btn-primary self-start"><Send size={15} />{isAr ? 'إرسال للمدرسة' : 'Send to school'}</button>
          {sent && <p className="text-[10px] font-bold text-green-deep flex items-center gap-1.5"><CheckCircle2 size={13} />{isAr ? 'آخر رسالة أُرسلت اليوم 10:42 — وصل إشعار استلام' : 'Last message sent today 10:42 — delivery receipt received'}</p>}
        </form>
        <div className="lg:col-span-2 space-y-3">
          <div className="raven-card p-5"><div className="kpi-label mb-2 flex items-center gap-1.5"><PhoneCall size={12} />{isAr ? 'قنوات التواصل المباشر' : 'Direct Channels'}</div><div className="space-y-2 text-[11px] leading-6"><div className="flex justify-between"><span className="text-charcoal/65">{isAr ? 'هاتف المدرسة' : 'School phone'}</span><a dir="ltr" className="font-mono font-bold text-deepblue" href="tel:+966112345678">+966 11 234 5678</a></div><div className="flex justify-between"><span className="text-charcoal/65">{isAr ? 'بريد المدرسة' : 'Email'}</span><a className="font-mono font-bold text-deepblue" href="mailto:info@mustaqbal.edu.sa">info@mustaqbal.edu.sa</a></div><div className="flex justify-between"><span className="text-charcoal/65">{isAr ? 'الدوام الرسمي' : 'School hours'}</span><span className="font-bold">{isAr ? 'الأحد–الخميس · 07:00–13:30' : 'Sun–Thu · 07:00–13:30'}</span></div></div></div>
          <div className="raven-card p-5 bg-blue-soft/40 border-deepblue/15"><div className="flex items-center gap-2 text-deepblue text-[10px] font-black"><ShieldCheck size={13} />{isAr ? 'خصوصيتك محمية' : 'YOUR PRIVACY'}</div><p className="text-[9.5px] leading-5 text-charcoal/75 mt-1.5">{isAr ? 'تصل رسائلك باسمك كولي أمر موثق — لا يرى أي معلم أو أسرة أخرى أي شيء يخص رسائلك.' : 'Messages arrive under your verified guardian identity — no teacher or other family ever sees your correspondence.'}</p></div>
        </div>
      </div>
      <Toaster toasts={toasts} />
    </div>
  );
}

function ReportsFamily({ child }: { child: Child }) {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const reports = [
    { t: isAr ? `التقرير الشهري — ${child.name.split(' ')[0]} · أكتوبر 2026` : `Monthly Report — ${child.name.split(' ')[0].split(' ')[0]} · Oct 2026`, meta: isAr ? 'يولَّد تلقائياً أول كل شهر' : 'Auto-generated the 1st of each month' },
    { t: isAr ? 'كشف درجات الفصل الثاني' : 'Term 2 Grade Transcript', meta: isAr ? 'يُتاح بعد اعتماد الكنترول — 15 نوفمبر' : 'Available after control-room sign-off — Nov 15' },
    { t: isAr ? 'شهادة التميز السلوكي — رصيد 94 نقطة' : 'Behavior Excellence Certificate — 94 pts', meta: isAr ? 'جاهزة للطباعة الآن' : 'Print-ready now' },
  ];
  return (
    <div>
      <PageHead icon={FileBarChart2} eyebrow={isAr ? 'القسم 11' : 'SECTION 11'} title={isAr ? `التقارير والملفات — ${child.name.split(' ')[0]}` : `Reports & Files — ${child.name.split(' ')[0]}`}
        desc={isAr ? 'تقارير طفلك الرسمية من مصدرها المعتمد — جاهزة للتحميل والطباعة.' : 'Your child’s official reports from their authoritative source — ready to download.'}
        actions={<SampleBadge />} />
      <div className="max-w-3xl space-y-2">{reports.map((r, i) => <div key={i} className="raven-card flex items-center gap-3 p-4"><span className="h-11 w-11 rounded-xl bg-blue-soft text-deepblue flex items-center justify-center shrink-0"><FileBarChart2 size={19} /></span><div className="min-w-0 flex-1"><div className="text-[11.5px] font-bold">{r.t}</div><div className="text-[9px] text-charcoal/55 mt-0.5">{r.meta}</div></div><button className="btn btn-outline !h-9 !text-[10.5px]" onClick={() => push(isAr ? 'بدأ تحميل PDF — ختم رقمي صالح' : 'Downloading PDF — valid digital seal')}><Download size={13} />PDF</button></div>)}</div>
      <Toaster toasts={toasts} />
    </div>
  );
}

function ProfileFamily() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  return (
    <div>
      <PageHead icon={UserRound} eyebrow={isAr ? 'القسم 12' : 'SECTION 12'} title={isAr ? 'الملف الشخصي والإعدادات' : 'Profile & Settings'}
        desc={isAr ? 'بياناتك كولي أمر — وتفضيلات الإشعارات واللغة.' : 'Your guardian profile — notification preferences and language.'}
        actions={<SampleBadge />} />
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="raven-card p-6 text-center"><span className="h-20 w-20 rounded-full bg-charcoal text-gold text-[24px] font-black flex items-center justify-center mx-auto">أم</span><h3 className="font-black text-[15px] mt-3">{isAr ? 'أم ريان السبيعي' : 'Mrs. Rayan Al-Subaie'}</h3><div className="text-[10px] text-green-deep font-bold mt-0.5">{isAr ? 'ولية أمر موثقة — ريان ولمى' : 'Verified guardian — Rayan & Lama'}</div><div className="text-[9px] text-charcoal/55 font-mono mt-2">family@alrowad.example · +966 5x xxx xxxx</div><div className="chip chip-blue mt-3"><ShieldCheck size={10} />{isAr ? 'صلة القرابة موثقة عبر نور' : 'Relationship verified via Noor'}</div></div>
        <div className="raven-card lg:col-span-2 p-5"><div className="kpi-label mb-3">{isAr ? 'تفضيلات الإشعارات' : 'Notification Preferences'}</div><div className="space-y-2.5">{[isAr ? 'تنبيه فوري عند غياب أو تأخير' : 'Instant alert on absence or lateness', isAr ? 'إشعار عند اعتماد درجة جديدة' : 'New grade approved', isAr ? 'الواجب يحل غداً — تذكير صباحي' : 'Homework due tomorrow — morning reminder', isAr ? 'ملخص أسبوعي عن تقدمه (الجمعة)' : 'Weekly progress digest (Friday)', isAr ? 'إشعارات الطوارئ المدرسية فقط دون غيرها' : 'Emergency-only mode'].map((l, i) => <label key={i} className="flex items-center justify-between gap-4 border-b border-sand-soft/60 pb-2.5"><span className="text-[10.5px] font-bold text-charcoal/85">{l}</span><input type="checkbox" defaultChecked={i < 4} className="h-4 w-4 accent-[#08794F]" /></label>)}</div><button className="btn btn-primary !h-9 mt-4" onClick={() => push(isAr ? 'حُفظت تفضيلاتك' : 'Preferences saved')}>{isAr ? 'حفظ' : 'Save'}</button></div>
      </div>
      <Toaster toasts={toasts} />
    </div>
  );
}

export default function FamilyPortal() {
  const [child, setChild] = useState<Child>(FAMILY_CHILDREN[0]);
  const common = { child, setChild };
  return (
    <Routes>
      <Route index element={<FamilyHome {...common} />} />
      <Route path="children" element={<ChildrenPage {...common} />} />
      <Route path="attendance" element={<AttendancePage child={child} />} />
      <Route path="progress" element={<ProgressPage child={child} />} />
      <Route path="grades" element={<GradesPage child={child} />} />
      <Route path="homework" element={<HomeworkFamily child={child} />} />
      <Route path="behavior" element={<BehaviorFamily child={child} />} />
      <Route path="timetable" element={<TimetableFamily child={child} />} />
      <Route path="notifications" element={<NotificationsFamily />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="reports" element={<ReportsFamily child={child} />} />
      <Route path="profile" element={<ProfileFamily />} />
      <Route path="settings" element={<ProfileFamily />} />
      <Route path="*" element={<Navigate to="/family" replace />} />
    </Routes>
  );
}
