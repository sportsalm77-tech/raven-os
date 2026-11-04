"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  DoorOpen, Search, Users, UserRound, CalendarDays, ClipboardList, Clock3,
  BookOpen, HeartPulse, Star, FileText, ShieldCheck, AlertCircle, Plus,
  ChevronLeft, ChevronRight, GraduationCap, CalendarClock, UserX,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { EmptyState, PageHead, SectionCard } from "@/components/raven-ui";

type ClassArea = "overview" | "students" | "leader" | "attendance" | "behavior" | "timetable" | "reports";
const areas: { id: ClassArea; ar: string; en: string; Icon: typeof DoorOpen }[] = [
  { id: "overview", ar: "نظرة عامة", en: "Overview", Icon: DoorOpen },
  { id: "students", ar: "الطلاب", en: "Students", Icon: Users },
  { id: "leader", ar: "رائد الصف", en: "Class Leader", Icon: UserRound },
  { id: "attendance", ar: "الغياب والتأخر", en: "Absence & Lateness", Icon: Clock3 },
  { id: "behavior", ar: "السلوك والمواظبة", en: "Behavior & Conduct", Icon: Star },
  { id: "timetable", ar: "الجدول الدراسي", en: "Timetable", Icon: CalendarDays },
  { id: "reports", ar: "تقارير الفصل", en: "Class Reports", Icon: FileText },
];

const planned = [
  { Icon: Users, ar: "إدارة قائمة الطلاب", en: "Student roster management", detailAr: "إضافة الطالب وتعديل بياناته ونقله أو إنهاء ارتباطه بالفصل وفق الصلاحية.", detailEn: "Add, edit, transfer, or remove a student's class membership under authorization." },
  { Icon: UserRound, ar: "إدارة رائد الصف", en: "Class leader assignment", detailAr: "تعيين رائد الصف وتعديله وإنهاء تكليفه مع حفظ سجل التغييرات.", detailEn: "Assign, change, or end the class-leader assignment with change history." },
  { Icon: ClipboardList, ar: "متابعة الحضور", en: "Attendance follow-up", detailAr: "تمييز الغياب والتأخر والاستئذان والعذر، مع الفصل بين الرصد والاعتماد.", detailEn: "Track absence, lateness, permission, and excuses, separating entry from approval." },
  { Icon: HeartPulse, ar: "السلوك والمواظبة", en: "Behavior & conduct", detailAr: "متابعة المخالفات والإجراءات التصحيحية والمواظبة دون كشف غير المصرح به.", detailEn: "Track incidents, interventions, and conduct with restricted visibility." },
  { Icon: Star, ar: "السلوك المتميز", en: "Positive behavior", detailAr: "توثيق المواقف الإيجابية والشواهد والتكريم بعد المراجعة.", detailEn: "Record positive conduct, evidence, and recognition after review." },
  { Icon: CalendarDays, ar: "الجدول وحالة المعلم", en: "Timetable & teacher status", detailAr: "عرض معلم الحصة الحالية والتالي والغائب والمنتظر وفق جدول معتمد وتحديثاته.", detailEn: "Show current, next, absent, and expected teachers from the approved timetable and updates." },
];

const statusLabels = {
  ar: ["المعلم الحالي", "المعلم التالي", "المعلم الغائب", "المعلم المنتظر"],
  en: ["Current teacher", "Next teacher", "Absent teacher", "Cover pending"],
};

export function PrincipalClassesCenter() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<ClassArea>("overview");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return []; // Search becomes live when the approved class directory is connected.
  }, [query]);
  const currentArea = areas.find((item) => item.id === area) ?? areas[0];
  const BackIcon = isAr ? ChevronRight : ChevronLeft;

  return (
    <div className="space-y-6">
      <PageHead icon={DoorOpen} eyebrow="RAVEN OS · PRINCIPAL · CLASS OPERATIONS"
        title={isAr ? "مركز الفصول الدراسية" : "Classrooms Operations Center"}
        description={isAr ? "إدارة الفصل من تكوينه وقائمة طلابه إلى الحضور والسلوك والجدول ومتابعة المعلمين." : "Manage each class from its roster and leadership to attendance, conduct, timetable, and teacher coverage."} />
      <div className="flex flex-col gap-3 rounded-2xl border border-amber-300/70 bg-amber-50 p-4 text-sm leading-6 text-amber-950 sm:flex-row sm:items-start">
        <AlertCircle className="mt-1 shrink-0" size={18}/>
        <p>{isAr ? "هذه نسخة واجهة مطوّرة وتجهيز تشغيلي. لم تُربط بعد قاعدة بيانات أو هوية وصلاحيات خادمية؛ لذلك لا تُنفّذ الإضافة أو الحذف أو التعديل أو تسجيل الحضور فعليًا في هذه المرحلة." : "This is an enhanced interface and workflow preparation. Database, identity, and server-side permissions are not connected yet, so create, delete, edit, and attendance actions are not operational in this stage."}</p>
      </div>

      <SectionCard title={isAr ? "دليل الفصول" : "Class directory"} description={isAr ? "بطاقة مستقلة لكل فصل، وتُملأ من سجل المدرسة المعتمد بعد الربط." : "A dedicated card for every class, populated from the approved school register after connection."}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-[#66736e]" size={17}/>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={isAr ? "ابحث باسم الفصل أو الصف أو رائد الصف" : "Search class, grade, or class leader"} className="h-11 w-full rounded-xl border border-black/10 bg-white ps-10 pe-3 text-sm outline-none focus:border-emerald-700"/>
          </label>
          <button type="button" disabled className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#08794F] px-4 text-sm font-bold text-white opacity-50" title={isAr ? "يتطلب ربط قاعدة البيانات والصلاحيات" : "Requires database and permissions"}><Plus size={16}/>{isAr ? "إنشاء فصل" : "Create class"}</button>
        </div>
        {query.trim() && <p className="mb-3 text-xs text-[#66736e]">{isAr ? "البحث ينتظر ربط دليل الفصول المعتمد؛ لن تُعرض نتائج افتراضية." : "Search awaits the approved class directory; no sample results are shown."}</p>}
        <EmptyState icon={DoorOpen} title={isAr ? "دليل الفصول غير متصل" : "Class directory not connected"} description={isAr ? "ستظهر هنا بطاقات الفصول بعد ربط بيانات المدرسة. لن نضع أسماء فصول أو أعداد طلاب أو نسب حضور تجريبية." : "Class cards will appear after connecting the school's data. No demo class names, student counts, or attendance rates are fabricated."}/>
      </SectionCard>

      <SectionCard title={isAr ? "مؤشرات مركز الفصول" : "Class center indicators"} description={isAr ? "المؤشرات ستكون تفاعلية: اختيار المؤشر يفتح تفاصيله حسب الفصل والفترة ومصدر البيانات." : "Indicators will be interactive: selecting one opens detail by class, period, and data source."}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { Icon: GraduationCap, ar: "الفصول النشطة", en: "Active classes", hintAr: "حسب العام الدراسي", hintEn: "By academic year" },
            { Icon: Users, ar: "إجمالي الطلاب", en: "Total students", hintAr: "طلاب مرتبطون بفصولهم", hintEn: "Students assigned to classes" },
            { Icon: UserX, ar: "الغياب والتأخر", en: "Absence & lateness", hintAr: "حسب اليوم والفترة", hintEn: "By day and period" },
            { Icon: Star, ar: "السلوك المتميز", en: "Positive conduct", hintAr: "الشواهد المعتمدة", hintEn: "Approved evidence" },
          ].map(({Icon,ar,en,hintAr,hintEn}) => <button key={en} type="button" onClick={() => setArea(en === "Absence & lateness" ? "attendance" : en === "Positive conduct" ? "behavior" : "overview")} className="rounded-2xl border border-black/10 bg-white p-4 text-start transition hover:border-emerald-700/40 hover:bg-emerald-50/30">
            <span className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-800"><Icon size={19}/></span>
            <p className="text-sm font-extrabold">{isAr ? ar : en}</p>
            <p className="mt-1 text-xs text-[#66736e]">{isAr ? hintAr : hintEn}</p>
            <p className="mt-3 text-xs font-bold text-emerald-800">{isAr ? "استعراض التفاصيل" : "Explore details"} <BackIcon className="inline" size={14}/></p>
          </button>)}
        </div>
        <p className="mt-3 text-xs leading-6 text-[#66736e]">{isAr ? "القيم والرسوم ستُحسب من السجلات الفعلية فقط، مع إظهار الفترة وآخر تحديث ومصدر المؤشر." : "Values and charts will be calculated only from real records, showing period, last update, and indicator source."}</p>
      </SectionCard>

      <SectionCard title={isAr ? "ملف الفصل التشغيلي" : "Class operational profile"} description={isAr ? "اختر القسم لعرض هيكله ومتطلباته. اختيار الفصل الفعلي سيظهر عند اتصال دليل الفصول." : "Choose a domain to inspect its workflow and requirements. Actual class selection appears when the directory is connected."}>
        <div className="flex flex-wrap gap-2">
          {areas.map(({id,ar,en,Icon}) => <button key={id} type="button" onClick={() => setArea(id)} aria-pressed={area === id} className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition ${area === id ? "border-[#08794F] bg-[#08794F] text-white" : "border-black/10 bg-white text-[#35423d] hover:border-emerald-700/40"}`}><Icon size={15}/>{isAr ? ar : en}</button>)}
        </div>
        <div className="mt-4 rounded-2xl border border-black/10 bg-[#F5F3EC]/60 p-4">
          <h3 className="font-extrabold">{isAr ? currentArea.ar : currentArea.en}</h3>
          {area === "overview" ? <div className="mt-3 grid gap-3 md:grid-cols-2">
            {planned.map(({Icon,ar,en,detailAr,detailEn}) => <div key={en} className="rounded-xl border border-black/10 bg-white p-3"><div className="flex items-center gap-2 font-bold text-sm"><Icon size={17} className="text-emerald-800"/>{isAr ? ar : en}</div><p className="mt-2 text-xs leading-6 text-[#66736e]">{isAr ? detailAr : detailEn}</p></div>)}
          </div> : <div className="mt-3 space-y-3">
            {area === "leader" ? <p className="text-sm leading-7 text-[#66736e]">{isAr ? "يتضمن ملف رائد الصف: بيانات التكليف، تاريخ البداية والنهاية، سجل التغييرات، وحدود الصلاحية. لا يُفترض أن رائد الصف هو معلم المادة أو بديل المعلم." : "The class leader profile includes assignment details, start/end dates, change history, and permission boundaries. The class leader is not assumed to be the subject teacher or a substitute."}</p> : null}
            {area === "attendance" ? <p className="text-sm leading-7 text-[#66736e]">{isAr ? "يفصل النظام بين الغياب والتأخر والاستئذان والعذر، ويربط كل رصد باليوم والحصة والراصد والمراجع وسجل التعديل." : "The workflow distinguishes absence, lateness, permission, and excuses, linking each entry to date, period, recorder, reviewer, and change history."}</p> : null}
            {area === "behavior" ? <p className="text-sm leading-7 text-[#66736e]">{isAr ? "يفصل بين الملاحظة السلوكية والإجراء والشاهد الإيجابي، مع خصوصية السجلات وعدم إظهار التفاصيل إلا للمخول." : "Separate behavior incidents, interventions, and positive evidence, keeping sensitive records visible only to authorized roles."}</p> : null}
            {area === "timetable" ? <div className="grid gap-2 sm:grid-cols-2">{statusLabels[isAr ? "ar" : "en"].map((label) => <div key={label} className="rounded-xl border border-black/10 bg-white p-3"><p className="text-xs font-bold">{label}</p><p className="mt-1 text-xs text-[#66736e]">{isAr ? "تُحدد من الجدول المعتمد وحالة التكليف والتحديثات اليومية." : "Resolved from the approved timetable, assignment status, and daily updates."}</p></div>)}</div> : null}
            {area === "students" ? <p className="text-sm leading-7 text-[#66736e]">{isAr ? "تتضمن إدارة الطلاب الإضافة والتعديل والنقل والحذف المنطقي/إنهاء الارتباط، مع منع الحذف النهائي لسجل الطالب دون مسار حوكمة مستقل." : "Student management includes add, edit, transfer, and soft removal/end-of-membership; permanent student deletion requires a separate governance workflow."}</p> : null}
            {area === "reports" ? <p className="text-sm leading-7 text-[#66736e]">{isAr ? "تقارير الفصل: كشف الطلاب، ملخص الحضور والتأخر، السلوك والمواظبة، السلوك المتميز، الجدول، وتغيرات رائد الصف والمعلمين." : "Class reports: roster, attendance and lateness summary, behavior and conduct, positive conduct, timetable, and class-leader/teacher changes."}</p> : null}
            <EmptyState icon={currentArea.Icon} title={isAr ? "لا توجد سجلات فعلية متصلة" : "No live records connected"} description={isAr ? "هذا القسم مجهز هيكليًا فقط. ستظهر السجلات وأدوات الإجراء بعد تنفيذ خدمات الخادم وربط الصلاحيات ومصدر البيانات." : "This domain is structurally prepared only. Records and actions will appear after server services, permissions, and the data source are implemented."}/>
          </div>}
        </div>
      </SectionCard>

      <SectionCard title={isAr ? "ضوابط سلامة البيانات" : "Data integrity controls"}>
        <ul className="space-y-2 text-sm leading-7 text-[#35423d]">
          <li className="flex gap-2"><ShieldCheck size={17} className="mt-1 shrink-0 text-emerald-800"/>{isAr ? "كل استعلام أو تعديل مقيد بـ school_id من جلسة موثوقة، وليس من قيمة يرسلها المتصفح." : "Every query and mutation is scoped by school_id from a trusted session, never a browser-supplied value."}</li>
          <li className="flex gap-2"><ShieldCheck size={17} className="mt-1 shrink-0 text-emerald-800"/>{isAr ? "حذف الطالب يعني إنهاء ارتباطه بالفصل مع حفظ الأثر التاريخي، لا محو سجله المدرسي." : "Removing a student means ending class membership while preserving history, not erasing the school record."}</li>
          <li className="flex gap-2"><ShieldCheck size={17} className="mt-1 shrink-0 text-emerald-800"/>{isAr ? "حالة المعلم تُستنتج من الجدول والتكليف والغياب المعتمد، ولا تُكتب يدويًا كمعلومة مؤكدة." : "Teacher status is derived from timetable, assignment, and approved absence—not manually asserted as fact."}</li>
          <li className="flex gap-2"><ShieldCheck size={17} className="mt-1 shrink-0 text-emerald-800"/>{isAr ? "كل إضافة أو تعديل أو حذف أو اعتماد يسجل الفاعل والوقت والسبب في سجل تدقيق." : "Every create, edit, delete, or approval records actor, time, and reason in an audit log."}</li>
        </ul>
      </SectionCard>
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#66736e]">
        <span>{isAr ? "متطلبات التفعيل: دليل الفصول · هوية وصلاحيات خادمية · سجل تدقيق · جدول معتمد." : "Activation gates: class directory · server-side identity/permissions · audit log · approved timetable."}</span>
        <Link href="/principal/info-center" className="inline-flex items-center gap-2 font-bold text-emerald-800 hover:underline"><BackIcon size={15}/>{isAr ? "مركز المعلومات المدرسية" : "School Information Center"}</Link>
      </div>
    </div>
  );
}
