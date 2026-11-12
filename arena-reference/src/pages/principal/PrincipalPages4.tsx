/* ═════════════════════════════════════════════════════════════
   بوابة مدير المدرسة — Part 4
   8 الصحة · 9 النشاط · 10 الموهوبون · 11 التربية الخاصة
   12 مصادر التعلم · 13 المختبرات · 14 التعلم الإلكتروني (ربط)
   15 المساعد الذكي · 16 الصلاحيات · 17 إعدادات المنصة · 18 التقارير
   ═════════════════════════════════════════════════════════════ */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Stethoscope, Trophy, Star, Accessibility, MonitorPlay, Compass, Plug, Bot, KeyRound,
  SlidersHorizontal, FileBarChart2, Search, Check, CheckCircle2, X, Plus, Send, RefreshCw,
  AlertTriangle, ShieldCheck, ChevronDown, Sparkles, FileText, Wifi, WifiOff, Archive, Inbox,
  BriefcaseMedical, Salad, Syringe, Dumbbell, Radio, Beaker, Laptop, PencilRuler, FlaskConical,
  Microscope, Cable, ExternalLink, FolderOpen, MessageSquare, Save, BellRing, Globe, Building2,
} from 'lucide-react';
import { useLang, L } from '../../lib/i18n';
import { useNavigate } from 'react-router-dom';
import { CLASSES, TEACHERS, LIBRARY_DOCS, COMMITTEES } from '../../lib/data';
import {
  PageHead, KpiCard, CardTitle, ProgressBar, Donut, TrendChart, Bars, Modal, EmptyState,
  TableShell, StatusDot, SampleBadge, useToasts, Toaster, BusyButton, useAsyncAction, ExportButton,
} from '../../components/raven';

/* ═══════════════ 8 · الصحة المدرسية ═══════════════ */
export function HealthPage() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const cases = [
    { time: 'اليوم 09:15', student: 'سارة القحطاني — 3-أ', issue: isAr ? 'صداع نصفي — قياس ضغط طبيعي — راحة + اتصال بالأسرة' : 'Migraine — normal BP — rest + family call', sev: 'green' as const },
    { time: 'اليوم 08:20', student: 'فهد الغامدي — 3-ب', issue: isAr ? 'دوار وحمى 38.4 — إرجاع للمنزل مع مرافق + خصم من حصص اليوم' : 'Dizziness & fever 38.4 — sent home with escort', sev: 'red' as const },
    { time: 'أمس 12:40', student: 'دانا الشهري — 1-ب', issue: isAr ? 'التواء كاحل أثناء الرياضة — كمادات وثلج + تقرير لولي الأمر' : 'Ankle sprain in PE — ice + report to guardian', sev: 'gold' as const },
    { time: 'أمس 10:05', student: isAr ? 'فحص دورية — 96 طالب' : 'Screening round — 96 students', issue: isAr ? 'الوزن والطول وفحص النظر — 3 طلاب أُحيلوا للصحة المدرسية' : 'Height/weight/vision — 3 referred to school health office', sev: 'blue' as const },
  ];
  const toneIcon = { green: 'chip-green', red: 'chip-red', gold: 'chip-gold', blue: 'chip-blue' } as const;
  return (
    <div>
      <PageHead icon={Stethoscope} eyebrow={isAr ? 'القسم 8' : 'SECTION 8'} title={isAr ? 'الصحة المدرسية' : 'School Health'}
        desc={isAr ? 'العيادة المدرسية — الحالات، الفحوصات الدورية، الأمصال، والتغطية التأمينية لكل طالب.' : 'School clinic — cases, periodic screenings, vaccinations and insurance coverage for every student.'}
        actions={<><SampleBadge /><button className="btn btn-primary !h-9" onClick={() => push(isAr ? 'فُتحت سجل حالة جديد — اختر الطالب والوصف' : 'New case opened — pick student & description', 'info')}><Plus size={15} />{isAr ? 'حالة جديدة' : 'New case'}</button></>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard tone="green" icon={BriefcaseMedical} label={isAr ? 'حالات هذا الشهر' : 'Cases this month'} value="28" foot={isAr ? '89% عولجت في المدرسة' : '89% treated on-site'} />
        <KpiCard tone="blue" icon={Syringe} label={isAr ? 'الأمصال المكتملة' : 'Vaccinations complete'} value="96%" />
        <KpiCard tone="gold" icon={Salad} label={isAr ? 'الطلاب في برنامج التغذية' : 'Nutrition program'} value="34" />
        <KpiCard tone="charcoal" icon={Dumbbell} label={isAr ? 'مؤشر كتلة الجسم الصحي' : 'Healthy BMI range'} value="78%" foot={<span className="!text-gold/80">{isAr ? 'الهدف 85% — نهاية الفصل' : 'Target 85% — term end'}</span>} />
      </div>
      <div className="raven-card mt-4 overflow-hidden">
        <CardTitle title={isAr ? 'سجل العيادة — الحالات الأخيرة' : 'Clinic Log — Recent Cases'} sub={isAr ? 'مربوط تلقائياً بملفات الطلاب والغياب' : 'Auto-linked to student files & absence records'} />
        <div className="divide-y divide-sand-soft/70">{cases.map((c, i) => <div key={i} className="px-5 py-3.5 flex items-start gap-3 hover:bg-ivory/50"><span className={`chip ${toneIcon[c.sev]} shrink-0 mt-0.5`}>{c.sev === 'red' ? (isAr ? 'عاجل' : 'URGENT') : c.sev === 'green' ? (isAr ? 'روتيني' : 'ROUTINE') : c.sev === 'gold' ? (isAr ? 'تنبيه' : 'WATCH') : (isAr ? 'فحص' : 'SCREEN')}</span><div className="min-w-0"><div className="text-[10px] text-charcoal/50 font-mono">{c.time}</div><div className="text-[11.5px] font-extrabold mt-0.5">{c.student}</div><p className="text-[10.5px] text-charcoal/75 leading-5 mt-0.5">{c.issue}</p></div></div>)}</div>
      </div>
      <Toaster toasts={toasts} />
    </div>
  );
}

/* ═══════════════ 9 · النشاط الطلابي ═══════════════ */
export function ActivitiesPage() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const clubs = [
    { name: isAr ? 'نادي القرآن الكريم' : 'Quran Club', members: 46, events: 8, lead: 'أ. عمر الدوسري' },
    { name: isAr ? 'نادي الرياضيات واليوم مسابقات' : 'Math & Olympiad Club', members: 38, events: 12, lead: 'أ. سارة الحربي' },
    { name: isAr ? 'نادي المسرح والفنون' : 'Drama & Arts Club', members: 29, events: 6, lead: 'أ. رنا العتيبي' },
    { name: isAr ? 'نادي الروبوتيك والبرمجة' : 'Robotics Club', members: 54, events: 9, lead: 'أ. يوسف الغامدي' },
    { name: isAr ? 'نادي كرة القدم' : 'Football Club', members: 72, events: 15, lead: 'أ. لمى الزامل' },
    { name: isAr ? 'نادي الصحافة والإذاعة' : 'Press & Radio Club', members: 18, events: 10, lead: 'أ. هند المطيري' },
  ];
  return (
    <div>
      <PageHead icon={Trophy} eyebrow={isAr ? 'القسم 9' : 'SECTION 9'} title={isAr ? 'النشاط الطلابي' : 'Student Activities'}
        desc={isAr ? 'الأندية، المسابقات، الفعاليات، وشراكات المجتمع — كل نشاط يترك أثراً وشاهداً موثقاً.' : 'Clubs, competitions, events and community partnerships — every activity leaves evidence behind.'}
        actions={<><SampleBadge /><button className="btn btn-primary !h-9" onClick={() => push(isAr ? 'فُتح نموذج فعالية — التاريخ والمكان واللجنة' : 'New event form opened — date, venue, committee', 'info')}><Plus size={15} />{isAr ? 'فعالية جديدة' : 'New event'}</button></>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard tone="green" icon={Trophy} label={isAr ? 'أندية نشطة' : 'Active clubs'} value="6" />
        <KpiCard tone="gold" icon={Star} label={isAr ? 'جوائز وتكريمات' : 'Awards & honors'} value="12" foot={isAr ? 'منها 3 على مستوى المملكة' : '3 national level'} />
        <KpiCard label={isAr ? 'مشاركة الطلاب' : 'Student participation'} value="68%" />
        <KpiCard tone="blue" icon={Radio} label={isAr ? 'فعاليات هذا الفصل' : 'Events this term'} value="24" />
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-4">{clubs.map(c => <div key={c.name} className="raven-card p-4"><div className="flex items-center justify-between gap-2"><h3 className="text-[12px] font-extrabold leading-5">{c.name}</h3><span className="chip chip-green shrink-0">{isAr ? 'نشط' : 'Active'}</span></div><div className="mt-2.5 flex items-center gap-3 text-[10px] text-charcoal/60"><span><b className="font-en">{c.members}</b> {isAr ? 'عضواً' : 'members'}</span><span><b className="font-en">{c.events}</b> {isAr ? 'فعالية' : 'events'}</span></div><div className="text-[9px] text-charcoal/50 mt-1.5">{isAr ? 'المشرف: ' : 'Lead: '}{c.lead}</div><button className="mt-3 text-[10px] font-extrabold text-deepblue hover:underline" onClick={() => push(isAr ? `تقرير ${c.name}: الحضور والشواهد والميزانية — جاهز للطباعة` : `${c.name} report: attendance, evidence, budget — print-ready`, 'info')}>{isAr ? 'تقرير النادي والشواهد ←' : 'Club report & evidence ←'}</button></div>)}</div>
      <Toaster toasts={toasts} />
    </div>
  );
}

/* ═══════════════ 10 · الموهوبون ═══════════════ */
export function TalentedPage() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const gifted = [
    { name: 'سارة القحطاني — 3-أ', field: isAr ? 'الرياضيات' : 'Mathematics', score: 97, program: isAr ? 'الأولمبياد الوطني + مشروع بحثي' : 'National Olympiad + research project' },
    { name: 'ليان العتيبي — 1-أ', field: isAr ? 'اللغة العربية' : 'Arabic Language', score: 91, program: isAr ? 'نادي الشعر والقصة + إذاعة المدرسة' : 'Poetry club + school radio' },
    { name: 'ريان السبيعي — 3-أ', field: isAr ? 'الحاسب / الروبوتيك' : 'CS / Robotics', score: 85, program: isAr ? 'نادي الروبوتيك — بطولة المنطقة' : 'Robotics Club — regional finals' },
    { name: 'ريم المطيري — 2-أ', field: isAr ? 'العلوم' : 'Science', score: 93, program: 'ISEF ' + (isAr ? 'مبادرة بحثية — خلية شمسية' : 'research initiative — solar cell') },
  ];
  return (
    <div>
      <PageHead icon={Star} eyebrow={isAr ? 'القسم 10' : 'SECTION 10'} title={isAr ? 'الموهوبون' : 'Gifted Students'}
        desc={isAr ? 'اكتشاف، رعاية، وتحدي — برنامج رعاية الموهوبين المرتبط بالموهبة والقياس والمتابعة.' : 'Discover, nurture, challenge — the gifted program wired to talent, measurement and follow-through.'}
        actions={<><SampleBadge /><button className="btn btn-primary !h-9" onClick={() => push(isAr ? 'رُشّح الطالب للجنة الموهوبين بنجاح' : 'Student nominated to gifted committee')}><Plus size={15} />{isAr ? 'ترشيح موهوب' : 'Nominate student'}</button></>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard tone="gold" icon={Star} label={isAr ? 'طلاب موهوبون مسجلون' : 'Enrolled gifted'} value="18" />
        <KpiCard tone="green" label={isAr ? 'متوسط تحصيل الموهوبين' : 'Gifted avg. achievement'} value="93.5%" />
        <KpiCard label={isAr ? 'برامج رعاية نشطة' : 'Active care programs'} value="5" />
        <KpiCard tone="blue" label={isAr ? 'جوائز هذا العام' : 'Awards this year'} value="7" />
      </div>
      <div className="raven-card mt-4 overflow-hidden">
        <CardTitle title={isAr ? 'الطلاب الموهوبون — خطط الرعاية الفردية (IEP)' : 'Gifted Students — Individual Education Plans'} />
        <div className="divide-y divide-sand-soft/70">{gifted.map(g => <div key={g.name} className="px-5 py-3.5 flex items-center gap-3 hover:bg-ivory/50"><span className="h-11 w-11 rounded-2xl bg-gold-soft text-gold-deep flex items-center justify-center shrink-0"><Star size={19} fill="currentColor" /></span><div className="min-w-0 flex-1"><div className="text-[11.5px] font-extrabold">{g.name}</div><div className="text-[9px] text-charcoal/55">{g.field} · {g.program}</div></div><div className="text-end shrink-0"><div className="font-en font-extrabold text-[16px] text-gold-deep">{g.score}</div><div className="text-[8px] text-charcoal/50">{isAr ? 'درجة الموهبة' : 'talent index'}</div></div></div>)}</div>
      </div>
      <Toaster toasts={toasts} />
    </div>
  );
}

/* ═══════════════ 11 · التربية الخاصة ═══════════════ */
export function SpecialEdPage() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const plans = [
    { student: 'زياد القحطاني — 2-أ', type: isAr ? 'صعوبات تعلم (عسر القراءة)' : 'Learning difficulties (dyslexia)', goal: isAr ? 'قراءة نص 100 كلمة بفهم 80%' : 'Read 100-word text with 80% comprehension', progress: 64 },
    { student: 'دانا الشهري — 1-ب', type: isAr ? 'صعوبات حساب (ديسكالكوليا)' : 'Dyscalculia', goal: isAr ? 'المهارة: الجمع/الطرح حتى 1000 بلا أخطاء' : 'Skill: +/− to 1000 error-free', progress: 48 },
    { student: 'فهد الغامدي — 3-ب', type: isAr ? 'تأخر لغوي بسيط' : 'Mild speech delay', goal: isAr ? 'جملة مركبة صحيحة في 8 من 10 مواقف' : 'Compound sentences correct 8/10 times', progress: 71 },
  ];
  return (
    <div>
      <PageHead icon={Accessibility} eyebrow={isAr ? 'القسم 11' : 'SECTION 11'} title={isAr ? 'التربية الخاصة' : 'Special Education'}
        desc={isAr ? 'خطط تربوية فردية (IEP) — أهداف قابلة للقياس، تقدم أسبوعي، وتكامل مع المعلمين والأسر.' : 'Individual Education Plans — measurable goals, weekly progress, integrated with teachers & families.'}
        actions={<><SampleBadge /><button className="btn btn-primary !h-9" onClick={() => push(isAr ? 'فُتحت خطة فردية جديدة — اربطها بتقرير تشخيصي' : 'New IEP opened — link a diagnostic report', 'info')}><Plus size={15} />{isAr ? 'خطة فردية جديدة' : 'New IEP'}</button></>} />
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map(p => <div key={p.student} className="raven-card p-4 flex flex-col"><div className="flex items-center gap-2"><Accessibility size={17} className="text-deepblue" /><span className="text-[11.5px] font-extrabold">{p.student}</span></div><div className="text-[9px] text-deepblue font-bold mt-1.5">{p.type}</div><p className="text-[10px] text-charcoal/70 leading-5 mt-2">{isAr ? 'الهدف: ' : 'Goal: '}{p.goal}</p><div className="mt-auto pt-3"><div className="flex justify-between text-[9px] font-bold text-charcoal/55 mb-1"><span>{isAr ? 'التقدم نحو الهدف' : 'Goal progress'}</span><span className="font-en">{p.progress}%</span></div><ProgressBar value={p.progress} tone={p.progress > 60 ? 'green' : 'gold'} /></div></div>)}
      </div>
      <div className="raven-card mt-4 p-4 flex items-center gap-3 bg-blue-soft/40 border-deepblue/15"><ShieldCheck size={20} className="text-deepblue shrink-0" /><p className="text-[10.5px] leading-6 text-charcoal/80">{isAr ? 'سرية تامة: خطط التربية الخاصة مرئية فقط لفريق التربية الخاصة ومدير المدرسة — لا تظهر لأي معلم أو أسرة في أي شاشة.' : 'Strict confidentiality: IEPs visible only to the special-ed team and principal — never to other teachers or families.'}</p></div>
      <Toaster toasts={toasts} />
    </div>
  );
}

/* ═══════════════ 12 · مصادر التعلم ═══════════════ */
export function ResourcesPage() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const resources = [
    { name: isAr ? 'منصة عين (Ain Education TV)' : 'Ain Education Platform', type: isAr ? 'محتوى فيديو تفاعلي' : 'Interactive video', users: '92%', state: 'green' as const },
    { name: isAr ? 'مكتبة المدرسة الذكية — 8,400 كتاب' : 'Smart Library — 8,400 titles', type: isAr ? 'إعارة رقمية وورقية' : 'Digital & physical lending', users: '64%', state: 'green' as const },
    { name: isAr ? 'بنك الأسئلة والاختبارات (رافين)' : 'Raven Question Bank', type: isAr ? '4,200 سؤال معتمد' : '4,200 approved items', users: '88%', state: 'green' as const },
    { name: isAr ? 'مختبرات افتراضية PhET' : 'PhET Virtual Labs', type: isAr ? 'محاكاة تفاعلية' : 'Interactive simulations', users: '41%', state: 'gold' as const },
    { name: isAr ? 'مصادر الأسرة (أدلة ومتابعات)' : 'Family resources hub', type: isAr ? 'أدلة وأشرطة بودكاست' : 'Guides & podcasts', users: '57%', state: 'gold' as const },
  ];
  return (
    <div>
      <PageHead icon={MonitorPlay} eyebrow={isAr ? 'القسم 12' : 'SECTION 12'} title={isAr ? 'مصادر التعلم' : 'Learning Resources'}
        desc={isAr ? 'كل ما بين يدي المعلم والطالب — محتوى، بنك أسئلة، مكتبة، محاكاة، ومصادر الأسرة.' : 'Everything within reach of teacher and student — content, question banks, library, simulations, family hub.'}
        actions={<SampleBadge />} />
      <div className="raven-card overflow-hidden">
        <TableShell minWidth={640} head={<tr><th className="th">{isAr ? 'المصدر' : 'Resource'}</th><th className="th">{isAr ? 'النوع' : 'Type'}</th><th className="th">{isAr ? 'الاستفادة' : 'Adoption'}</th><th className="th">{isAr ? 'الحالة' : 'Status'}</th><th></th></tr>}>
          {resources.map(r => <tr key={r.name} className="hover:bg-ivory/60"><td className="td font-bold text-[11.5px]">{r.name}</td><td className="td text-[10px] text-charcoal/65">{r.type}</td><td className="td font-en font-bold">{r.users}</td><td className="td"><StatusDot tone={r.state} /> {r.state === 'green' ? <span className="text-[10px] font-bold text-green-deep">{isAr ? 'ممتاز' : 'Excellent'}</span> : <span className="text-[10px] font-bold text-gold-deep">{isAr ? 'يحتاج تنشيط' : 'Boost adoption'}</span>}</td><td className="td"><button className="text-[10px] font-extrabold text-deepblue hover:underline" onClick={() => push(isAr ? 'فُتحت لوحة تبني المعلمين لهذا المصدر' : 'Teacher-adoption dashboard opened', 'info')}>{isAr ? 'تفاصيل ←' : 'Details ←'}</button></td></tr>)}
        </TableShell>
      </div>
      <Toaster toasts={toasts} />
    </div>
  );
}

/* ═══════════════ 13 · المختبرات ═══════════════ */
export function LabsPage() {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const labs = [
    { name: isAr ? 'مختبر الفيزياء — مبنى B، الطابق 2' : 'Physics Lab — B2', capacity: 30, safety: 'ISO 17025', bookings: 12, icon: FlaskConical, state: 'green' as const },
    { name: isAr ? 'مختبر الكيمياء — مبنى B، الطابق 2' : 'Chemistry Lab — B2', capacity: 30, safety: isAr ? 'معتمد — 2026/03' : 'Certified — Mar 2026', bookings: 9, icon: Beaker, state: 'green' as const },
    { name: isAr ? 'مختبر الأحياء — مبنى B، الطابق 1' : 'Biology Lab — B1', capacity: 28, safety: 'ISO 17025', bookings: 7, icon: Microscope, state: 'green' as const },
    { name: isAr ? 'معمل الحاسب الآلي — الطابق 3' : 'CS Lab — Floor 3', capacity: 32, safety: isAr ? 'تجديد أجهزة — يناير 2027' : 'Refresh — Jan 2027', bookings: 15, icon: Laptop, state: 'gold' as const },
  ];
  return (
    <div>
      <PageHead icon={Compass} eyebrow={isAr ? 'القسم 13' : 'SECTION 13'} title={isAr ? 'المختبرات' : 'Laboratories'}
        desc={isAr ? 'المختبرات والمعامل — الحجز، السلامة، الاعتمادات، وجرد الأجهزة والكواشف.' : 'Labs & workshops — booking, safety, certifications and equipment inventory.'}
        actions={<SampleBadge />} />
      <div className="grid sm:grid-cols-2 gap-3">{labs.map(l => <div key={l.name} className="raven-card p-4"><div className="flex items-center gap-3"><span className="h-12 w-12 rounded-2xl bg-deepblue/10 text-deepblue flex items-center justify-center shrink-0"><l.icon size={22} /></span><div className="min-w-0"><h3 className="text-[12px] font-extrabold leading-5">{l.name}</h3><div className="text-[9px] text-charcoal/55 mt-0.5">{isAr ? 'السعة: ' : 'Capacity: '}{l.capacity} · {l.safety}</div></div></div><div className="mt-3 flex items-center justify-between"><span className="text-[10px] text-charcoal/60"><b className="font-en">{l.bookings}</b> {isAr ? 'حجز هذا الشهر' : 'bookings this month'}</span><button className="btn btn-outline !h-8 !text-[10px]" onClick={() => push(isAr ? 'فُتحت لوحة الحجز والجرد — اختر اليوم والفترة' : 'Booking & inventory board opened')}>{isAr ? 'الحجز والجرد ←' : 'Book & inventory ←'}</button></div></div>)}</div>
      <Toaster toasts={toasts} />
    </div>
  );
}

/* ═══════════════ 14 · التعلم الإلكتروني — الربط ═══════════════ */
type IntKind = 'noor' | 'madrasati' | 'hudori';
const INT_META: Record<IntKind, { ar: string; en: string; icon: typeof Plug; desc: string; descEn: string; freq: string; rows: [string, string][] }> = {
  noor: { ar: 'الربط مع نور', en: 'Noor Integration', icon: Plug, desc: 'ربط ثنائي الاتجاه مع نظام نور: الطلاب، الفصول، الدرجات، الغياب — تُسحب وتُرفع تلقائياً.', descEn: 'Two-way sync with Noor: students, classes, grades, absence — pulled & pushed automatically.', freq: 'كل 6 ساعات', rows: [['عدد سجلات الطلاب المتزامنة', '842 / 842'], ['آخر مزامنة كاملة', 'اليوم 06:00'], ['الحقول المزودة', 'الهوية · الفصل · الدرجات · الغياب'], ['الحقول المرفوعة', 'الدرجات · السلوك · الحضور']] },
  madrasati: { ar: 'الربط مع منصة مدرستي', en: 'Madrasati Integration', icon: MonitorPlay, desc: 'مزامنة الحصص الافتراضية، الواجبات، والتقديرات مع منصة مدرستي — بلا إدخال مكرر.', descEn: 'Sync virtual classes, assignments and grading with Madrasati — zero duplicate entry.', freq: 'يومياً 02:00', rows: [['الحصص الافتراضية المجدولة', '34 حصة / أسبوع'], ['آخر مزامنة', 'اليوم 02:00'], ['الواجبات المنشورة', '128 هذا الشهر'], ['ربط المعلمين', '68 / 68 حساباً مربوطاً']] },
  hudori: { ar: 'الربط مع برنامج حضوري', en: 'Hudori Integration', icon: Radio, desc: 'مزامنة سجلات الحضور الرسمية من برنامج حضوري — للمطابقة مع رصد رافين الصباحي.', descEn: 'Sync official attendance logs from Hudori — to reconcile with Raven morning roll call.', freq: 'لحظي — عبر Webhook', rows: [['حالة الاتصال', 'قيد التفعيل — بانتظار اعتماد الإدارة العامة'], ['آخر اختبار اتصال', 'أمس 23:12 — نجح (184ms)'], ['نوع المزامنة', 'استلام فقط (read-only)'], ['الحقول', 'التاريخ · الفصل · الحضور · التأخر']] },
};
export function IntegrationPage({ kind }: { kind: IntKind }) {
  const { isAr } = useLang();
  const { toasts, push } = useToasts();
  const [testing, setTesting] = useState(false);
  const [lastTest, setLastTest] = useState<'none' | 'ok'>('none');
  const meta = INT_META[kind];
  const test = () => { setTesting(true); window.setTimeout(() => { setTesting(false); setLastTest('ok'); push(isAr ? 'اختبار الاتصال نجح — 184ms عبر TLS 1.3' : 'Connection test passed — 184ms over TLS 1.3'); }, 2200); };
  return (
    <div>
      <PageHead icon={meta.icon} eyebrow={isAr ? 'التعلم الإلكتروني · القسم 14' : 'E-LEARNING · SECTION 14'}
        title={isAr ? meta.ar : meta.en} desc={isAr ? meta.desc : meta.descEn}
        actions={<span className="chip chip-gold !h-7"><AlertTriangle size={11} />{isAr ? 'عرض توضيحي — الربط الحقيقي يتطلب اعتمادات رسمية' : 'Demo — real integration requires official credentials'}</span>} />
      <div className="grid lg:grid-cols-5 gap-4">
        <div className="raven-card lg:col-span-3 overflow-hidden">
          <CardTitle title={isAr ? 'حالة الاتصال والمزامنة' : 'Connection & Sync Status'} sub={`${isAr ? 'وتيرة المزامنة: ' : 'Sync frequency: '}${meta.freq}`} />
          <div className="p-5">
            <div className="flex items-center gap-4 rounded-2xl border border-green/30 bg-green-mist px-5 py-4">
              <span className="h-14 w-14 rounded-2xl bg-green text-white flex items-center justify-center shrink-0"><Wifi size={26} /></span>
              <div><div className="text-[13px] font-black text-green-deep">{isAr ? 'متصل — المزامنة تعمل' : 'Connected — sync operational'}</div><div className="text-[10px] text-charcoal/60 mt-0.5">{isAr ? 'آخر مزامنة: منذ دقائق · البيانات متطابقة 100%' : 'Last sync: minutes ago · Data 100% consistent'}</div></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5 mt-4">{meta.rows.map(([l, v]) => <div key={l} className="rounded-xl border border-sand-soft bg-ivory/60 px-3.5 py-3"><div className="text-[9px] font-bold text-charcoal/55">{l}</div><div className="text-[11.5px] font-extrabold mt-1">{v}</div></div>)}</div>
            <div className="flex flex-wrap gap-2 mt-4">
              <button className="btn btn-dark !h-9" onClick={test} disabled={testing}>{testing ? <RefreshCw size={14} className="animate-spin" /> : <Cable size={15} />}{isAr ? 'اختبار الاتصال الآن' : 'Test connection now'}</button>
              <button className="btn btn-outline !h-9" onClick={() => push(isAr ? 'بدأت مزامنة كاملة في الخلفية — ستصلك النتيجة خلال دقائق' : 'Full background sync started — result in minutes', 'info')}><RefreshCw size={14} />{isAr ? 'مزامنة كاملة الآن' : 'Full sync now'}</button>
              <button className="btn btn-outline !h-9" onClick={() => push(isAr ? 'فُتحت خريطة الحقول — عدّل الربط بلغة السحب والإفلات' : 'Field mapping opened — edit bindings visually', 'info')}><PencilRuler size={14} />{isAr ? 'خريطة الحقول' : 'Field mapping'}</button>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="raven-card overflow-hidden">
            <CardTitle title={isAr ? 'سجل المزامنة' : 'Sync Log'} />
            <div className="divide-y divide-sand-soft/70">{[[isAr ? 'اليوم 06:00' : 'Today 06:00', isAr ? 'مزامنة مجدولة — 1,247 سجلاً — 0 تعارض' : 'Scheduled sync — 1,247 records — 0 conflicts'], [isAr ? 'أمس 06:00' : 'Yesterday 06:00', isAr ? 'مزامنة مجدولة — 3 تعارضات صُححت تلقائياً (الفصل 3-ب)' : 'Scheduled sync — 3 conflicts auto-resolved (3-B)'], [isAr ? 'أمس 02:02' : 'Yesterday 02:02', isAr ? 'تحديث نماذج — إضافة حقل «أولياء أمور متعددين»' : 'Schema update — added “multiple guardians” field'], [isAr ? '26 أكتوبر' : 'Oct 26', isAr ? 'تصحيح يدوي — خطأ في رقم هوية ST-2988 — أُشعرت الأسرة' : 'Manual fix — ID error ST-2988 — family notified']].map((r, i) => <div key={i} className="px-4 py-2.5"><div className="text-[8.5px] font-mono text-charcoal/45">{r[0]}</div><p className="text-[10px] leading-5 text-charcoal/85 mt-0.5">{r[1]}</p></div>)}</div>
          </div>
          <div className="raven-card p-4 bg-charcoal">
            <div className="flex items-center gap-2 text-gold text-[10.5px] font-black"><ShieldCheck size={14} />{isAr ? 'أمان التكامل' : 'INTEGRATION SECURITY'}</div>
            <p className="text-[9.5px] text-ivory/70 leading-5 mt-1.5">{isAr ? 'لا تُخزن كلمات مرور الأنظمة الخارجية في رافين — تُستخدم مفاتيح خدمة موقعة وصلاحيات قراءة/كتابة محدودة النطاق تُدار مركزياً من بوابة مدير المنصة.' : 'No external-system passwords are stored in Raven — signed service keys with least-privilege scopes are managed centrally in the Platform Manager portal.'}</p>
          </div>
        </div>
      </div>
      <Toaster toasts={toasts} />
    </div>
  );
}

/* ═══════════════ 15 · المساعد الذكي ═══════════════ */
export function AssistantPage() {
  const { isAr, dir } = useLang();
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: isAr ? 'أهلاً أ. خالد — أنا مساعد رافين. اسألني عن التحصيل، الحضور، المهام، أو اطلب: «جهز تقرير مؤشرات أكتوبر».' : 'Welcome, Mr. Khalid — I’m Raven Assistant. Ask about achievement, attendance, tasks — or request: “Prepare the October indicators report”.' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const suggestions = isAr
    ? ['من الطلاب المعرضون لخطر التعثر حالياً؟', 'لخص أداء 3-أ هذا الأسبوع', 'جهز تقرير مؤشرات أكتوبر', 'كم مهمة متأخرة على فريقي؟']
    : ['Which students are at risk right now?', 'Summarize 3-A performance this week', 'Prepare the October indicators report', 'How many overdue tasks does my team have?'];
  const reply = (q: string): string => {
    const t = q.toLowerCase();
    if (t.includes('خطر') || t.includes('risk')) return isAr ? 'يوجد طالبان في نطاق خطر: فهد الغامدي (3-ب) — 61.8% تحصيل + غياب 6 أيام (مستوى 3 — اجتماع أسرة مطلوب)، ودانا الشهري (1-ب) — 67.5% مع اتجاه هابط -2.8. توصيتي: فعّل خطة دعم فهد اليوم — ولديّ مسودة جاهزة.' : 'Two at-risk students: Fahad Al-Ghamdi (3-B) — 61.8% + 6-day absence (Level 3 — family meeting required), and Dana Al-Shehri (1-B) — 67.5% with -2.8 trend. Recommend activating Fahad’s support plan today — I have a draft ready.';
    if (t.includes('3-أ') || t.includes('3-a') || t.includes('ثلاث')) return isAr ? '3-أ — الفصل الأقوى: متوسط 91.2% (+2.1 عن سبتمبر)، حضور 97.8%، صفر مخالفات هذا الشهر. سارة القحطاني تتفوق (96.2%) ومرشحة لبرنامج الموهوبين. اقتراح: كرّم الفصل في الإذاعة صباح الأحد.' : '3-A — top class: 91.2% avg (+2.1 vs Sep), 97.8% attendance, zero violations this month. Sara Al-Qahtani leads (96.2%) — gifted-program nominee. Suggestion: recognize the class at Sunday assembly.';
    if (t.includes('تقرير') || t.includes('report')) return isAr ? 'تقرير مؤشرات أكتوبر جاهز للتوليد من 18 مؤشراً معتمداً (الحضور 96.2%، التحصيل 88.4%، جاهزية الاعتماد 87%…). اضغط «توليد» في مكتبة رافين — القالب: تقرير الأداء المدرسي الشهري — وسأحفظه في الأرشيف الرسمي.' : 'October indicators report ready to generate from 18 approved indicators (attendance 96.2%, achievement 88.4%, readiness 87%…). Hit “Generate” in Raven Library — template: Monthly School Performance — I’ll archive it officially.';
    if (t.includes('متأخر') || t.includes('overdue') || t.includes('مهمة')) return isAr ? 'لديك 3 تكليفات متأخرة عن موعدها: اعتماد خطط الأسبوع الرابع (أ. محمد — 65%)، شواهد «مدرستي صحية» (لجنة الصحة — 30%)، واجتماع لجنة الموهوبين (معلّق — بانتظار اكتمال النصاب). أرسلتُ تذكيرات لطيفة قبل 20 دقيقة.' : 'Three overdue assignments: Week-4 plan approvals (Mohammed — 65%), “Healthy School” evidence (Health Committee — 30%), and gifted-committee meeting (pending quorum). I sent gentle nudges 20 minutes ago.';
    return isAr ? 'فهمت سؤالك — أبني الإجابة من بياناتك الموحدة (842 طالباً · 68 معلماً · 6 فصول · 21 مؤشراً). للإجابة الأعمق: جرّب «من الطلاب المعرضون للخطر؟» أو «لخص أداء فصل ما».' : 'Understood — I build answers from your unified data (842 students · 68 teachers · 6 classes · 21 indicators). For a deeper answer, try “Which students are at risk?” or “Summarize a class’s performance”.';
  };
  const send = (text?: string) => {
    const q = (text ?? input).trim(); if (!q || typing) return;
    setMessages(m => [...m, { role: 'user', text: q }]); setInput(''); setTyping(true);
    window.setTimeout(() => { setMessages(m => [...m, { role: 'ai', text: reply(q) }]); setTyping(false); }, 1200);
  };
  useEffect(() => { boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: 'smooth' }); }, [messages, typing]);
  return (
    <div>
      <PageHead icon={Bot} eyebrow={isAr ? 'القسم 15 — مدعوم ببياناتك' : 'SECTION 15 — GROUNDED IN YOUR DATA'} title={isAr ? 'المساعد الذكي' : 'Smart Assistant'}
        desc={isAr ? 'اسأل بالعربية أو الإنجليزية — الإجابات مبنية حصراً على بيانات مدرستك، لا من معرفة عامة.' : 'Ask in Arabic or English — answers grounded solely in your school’s data, never generic knowledge.'}
        actions={<span className="chip chip-blue"><Sparkles size={11} />{isAr ? 'معزز ببيانات 842 طالباً' : 'Grounded in 842 student records'}</span>} />
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="raven-card lg:col-span-2 flex flex-col h-[560px] overflow-hidden">
          <div ref={boxRef} className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {m.role === 'ai' && <span className="h-8 w-8 rounded-xl bg-charcoal text-gold flex items-center justify-center shrink-0"><Bot size={16} /></span>}
                <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-[11.5px] leading-6 ${m.role === 'user' ? 'bg-green text-white rounded-se-sm' : 'bg-ivory border border-sand-soft text-charcoal/90 rounded-ss-sm'}`}>{m.text}</div>
              </div>
            ))}
            {typing && <div className="flex gap-2"><span className="h-8 w-8 rounded-xl bg-charcoal text-gold flex items-center justify-center"><Bot size={16} /></span><div className="bg-ivory border border-sand-soft rounded-2xl px-4 py-3 flex gap-1.5">{[0, 1, 2].map(i => <span key={i} className="h-2 w-2 rounded-full bg-sand wavebar" style={{ animationDelay: `${i * 0.15}s` }} />)}</div></div>}
          </div>
          <form onSubmit={e => { e.preventDefault(); send(); }} className="p-3 border-t border-sand-soft flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder={isAr ? 'اسأل عن أي شيء في مدرستك…' : 'Ask anything about your school…'} className="raven-input flex-1" aria-label={isAr ? 'سؤالك' : 'Your question'} />
            <button type="submit" className="btn btn-primary !px-4" disabled={typing} aria-label="send"><Send size={16} /></button>
          </form>
        </div>
        <div className="space-y-4">
          <div className="raven-card p-4">
            <div className="kpi-label mb-2">{isAr ? 'اقتراحات جاهزة' : 'Ready Prompts'}</div>
            <div className="space-y-1.5">{suggestions.map(s => <button key={s} onClick={() => send(s)} className="w-full text-start text-[10.5px] font-bold leading-5 rounded-xl border border-sand-soft bg-white px-3 py-2.5 hover:border-green hover:bg-green-mist transition-all">{s}</button>)}</div>
          </div>
          <div className="raven-card p-4">
            <div className="kpi-label mb-2">{isAr ? 'حدود المساعد' : 'Assistant Boundaries'}</div>
            <ul className="text-[10px] leading-6 text-charcoal/70 space-y-1.5">
              <li>✓ {isAr ? 'يجيب من بيانات مدرستك فقط — لا يخترع رقماً' : 'Answers only from your school data — never invents numbers'}</li>
              <li>✓ {isAr ? 'يحترم صلاحياتك — لن يعرض ما لا تراه أنت' : 'Respects your permissions — never reveals what you cannot see'}</li>
              <li>✓ {isAr ? 'كل إجابة قابلة للتتبع إلى مصدرها' : 'Every answer traceable to its source'}</li>
              <li>✗ {isAr ? 'لا يتخذ قرارات نهائية — القرار لك دائماً' : 'Never makes final decisions — the call is always yours'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
