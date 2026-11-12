"use client";

import {
  UsersRound, GraduationCap, ClipboardList, PenLine, ShieldCheck, CalendarDays,
  HeartPulse, Star, FileText, LockKeyhole, Database, ClipboardCheck, AlertCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { PrincipalAreaConnections } from "@/components/principal-area-connections";
import { EmptyState, PageHead, SectionCard } from "@/components/raven-ui";

export type PrincipalOperationsArea =
  | "teachers"
  | "students"
  | "grades"
  | "exam-control"
  | "absence"
  | "violations"
  | "positive";

type ScreenDefinition = {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: LucideIcon;
  eyebrow: string;
  stagesAr: string[];
  stagesEn: string[];
  controlsAr: string[];
  controlsEn: string[];
  emptyTitleAr: string;
  emptyTitleEn: string;
  emptyDescriptionAr: string;
  emptyDescriptionEn: string;
};

const SCREENS: Record<PrincipalOperationsArea, ScreenDefinition> = {
  teachers: {
    titleAr: "شؤون المعلمين",
    titleEn: "Teacher Affairs",
    descriptionAr: "إدارة الملف المهني والتكليفات والأنصبة والاحتياج والمتابعة من مصدر بيانات المدرسة الموحد.",
    descriptionEn: "Manage professional records, assignments, teaching loads, staffing needs, and follow-up from the unified school data source.",
    icon: UsersRound, eyebrow: "PRINCIPAL · STAFF",
    stagesAr: ["استعراض سجل الكادر المعتمد", "مراجعة التخصص والمؤهل والارتباط الوظيفي", "متابعة النصاب والجدول والتكليفات", "توثيق التغيير وسببه والجهة المعتمدة"],
    stagesEn: ["Browse the approved staff register", "Review specialty, qualification, and employment links", "Track teaching load, timetable, and assignments", "Record each change, reason, and approving authority"],
    controlsAr: ["لا يُنشأ سجل معلم مكرر خارج مركز البيانات الموحد.", "تُعرض بيانات المعلم ضمن مدرسة المستخدم ونطاق صلاحياته.", "لا يُعتمد تكليف أو تعديل وظيفي دون مسار خادمي وسجل تدقيق."],
    controlsEn: ["Do not create duplicate teacher records outside the Unified School Data Center.", "Show staff records only within the user's school and permission scope.", "No assignment or employment change is approved without a server workflow and audit trail."],
    emptyTitleAr: "سجل الكادر غير متصل",
    emptyTitleEn: "Staff register not connected",
    emptyDescriptionAr: "ستظهر سجلات المعلمين بعد ربط مصدر البيانات المدرسية والتحقق من المدرسة والصلاحيات. لا توجد أسماء أو أنصبة تجريبية.",
    emptyDescriptionEn: "Teacher records will appear after connecting the school data source and verifying school scope and permissions. No sample names or teaching loads are shown.",
  },
  students: {
    titleAr: "شؤون الطلاب",
    titleEn: "Student Affairs",
    descriptionAr: "متابعة السجلات الطلابية والقبول والنقل والانتظام والحالات والإجراءات وفق الصلاحيات.",
    descriptionEn: "Manage student records, enrollment, transfers, attendance patterns, cases, and authorized procedures.",
    icon: GraduationCap, eyebrow: "PRINCIPAL · STUDENTS",
    stagesAr: ["الرجوع إلى سجل الطالب المركزي", "التحقق من القيد والفصل والمرحلة", "تسجيل الإجراء أو طلب التحديث", "مراجعة الاعتماد وحفظ الأثر التاريخي"],
    stagesEn: ["Read the central student record", "Verify enrollment, class, and stage", "Record a procedure or request an update", "Review approval and preserve historical trace"],
    controlsAr: ["لا تُنشأ نسخة مستقلة من سجل الطالب.", "النقل ينهي الارتباط السابق ويحفظ التاريخ ولا يمحو السجل.", "تُحجب البيانات الحساسة عن غير المخولين."],
    controlsEn: ["Never create a separate duplicate student record.", "A transfer ends the previous membership and preserves history; it does not erase the student record.", "Sensitive information is hidden from unauthorized roles."],
    emptyTitleAr: "سجل الطلاب غير متصل",
    emptyTitleEn: "Student register not connected",
    emptyDescriptionAr: "لن تظهر أسماء أو أعداد طلاب حتى يتصل مركز البيانات المدرسية الموحد بمصدر موثوق.",
    emptyDescriptionEn: "No student names or counts appear until the Unified School Data Center connects to a trusted source.",
  },
  grades: {
    titleAr: "إدخال الدرجات وتحليلها",
    titleEn: "Grades Entry & Analysis",
    descriptionAr: "مراجعة صلاحيات الرصد والفترات والمواد، ثم تحليل النتائج من سجلات معتمدة فقط.",
    descriptionEn: "Review grading permissions, periods, and subjects, then analyze results from approved records only.",
    icon: PenLine, eyebrow: "PRINCIPAL · ASSESSMENT",
    stagesAr: ["تحديد الفترة والمادة والصف", "التحقق من صلاحية الراصد ونطاقه", "استقبال الدرجات من مصدر الرصد المعتمد", "مراجعة الاكتمال والتدقيق قبل الاعتماد", "إظهار التحليل بعد اكتمال البيانات"],
    stagesEn: ["Select term, subject, and grade", "Verify the recorder's permission and scope", "Receive grades from the approved grading source", "Review completeness and audit before approval", "Show analysis only when data is complete"],
    controlsAr: ["لا تُعرض درجات أو متوسطات افتراضية.", "يُمنع تعديل درجات خارج نطاق الصلاحية والفترة.", "كل تعديل يحتاج هوية منفذة ووقتًا وسببًا وأثرًا تدقيقيًا."],
    controlsEn: ["No sample grades or averages are displayed.", "Editing outside the authorized scope or period is prohibited.", "Every change requires an authenticated actor, timestamp, reason, and audit trace."],
    emptyTitleAr: "بيانات الدرجات غير متصلة",
    emptyTitleEn: "Grade data not connected",
    emptyDescriptionAr: "تحتاج الشاشة إلى ربط مصدر الدرجات والفترات والمواد والصلاحيات قبل عرض النتائج أو المؤشرات.",
    emptyDescriptionEn: "Connect the grade source, terms, subjects, and permissions before displaying results or indicators.",
  },
  "exam-control": {
    titleAr: "كنترول الاختبارات",
    titleEn: "Examination Control",
    descriptionAr: "تنظيم لجان الاختبارات ومحاضرها ومهامها واستلام الأعمال ومراجعة الإغلاق.",
    descriptionEn: "Coordinate examination committees, minutes, duties, work submission, and closure review.",
    icon: ClipboardList, eyebrow: "PRINCIPAL · EXAMS",
    stagesAr: ["اعتماد جدول الاختبارات ومواقعها", "تشكيل اللجان وتحديد المسؤوليات", "إصدار التكليفات وربطها بمركز القرارات", "متابعة الاستلام والتنفيذ والملاحظات", "إغلاق الأعمال وأرشفة الشواهد"],
    stagesEn: ["Approve examination schedules and locations", "Form committees and assign responsibilities", "Issue duties linked to the Decisions Center", "Track submission, execution, and observations", "Close activities and archive evidence"],
    controlsAr: ["لا تُنشأ قرارات مكررة داخل الكنترول؛ ترتبط بمركز القرارات والتكليفات.", "لا يُعرض جدول غير معتمد على أنه نهائي.", "تُحفظ محاضر اللجان والشواهد وفق صلاحيات الوصول."],
    controlsEn: ["Do not duplicate decisions inside exam control; link to the Decisions & Assignments Center.", "Unapproved schedules must never appear as final.", "Committee minutes and evidence follow access permissions."],
    emptyTitleAr: "ملف الاختبارات غير متصل",
    emptyTitleEn: "Examination workspace not connected",
    emptyDescriptionAr: "ستظهر الجداول واللجان والتكليفات بعد ربط التقويم المدرسي ومركز القرارات ومصادر البيانات المعتمدة.",
    emptyDescriptionEn: "Schedules, committees, and duties will appear after connecting the school calendar, Decisions Center, and approved data sources.",
  },
  absence: {
    titleAr: "تسجيل الغياب اليدوي والصوتي",
    titleEn: "Manual & Voice Absence",
    descriptionAr: "تجهيز مسار رصد الغياب حسب اليوم والحصة، مع فصل الرصد عن المراجعة والاعتماد.",
    descriptionEn: "Prepare absence entry by day and period, separating recording from review and approval.",
    icon: CalendarDays, eyebrow: "PRINCIPAL · ATTENDANCE",
    stagesAr: ["اختيار اليوم والفترة والفصل", "استقبال الرصد من المستخدم المخول", "مراجعة الحالات والأعذار", "اعتماد السجل وإتاحة الإشعار وفق السياسة"],
    stagesEn: ["Select date, period, and class", "Receive entries from an authorized user", "Review cases and excuses", "Approve the register and enable notices under policy"],
    controlsAr: ["التسجيل الصوتي لا يعتمد تلقائيًا دون مراجعة بشرية.", "لا تُرسل إشعارات للأسرة قبل اعتماد الحالة وتفعيل قناة الإرسال.", "لا تُعرض أسماء أو أعداد غياب افتراضية."],
    controlsEn: ["Voice entries are not automatically approved; human review is required.", "Family notifications are not sent before approval and activation of the delivery channel.", "No sample absence names or counts are displayed."],
    emptyTitleAr: "سجل الحضور والغياب غير متصل",
    emptyTitleEn: "Attendance register not connected",
    emptyDescriptionAr: "يلزم ربط سجل الحضور والفصول والجدول وهوية الراصد قبل إتاحة الرصد أو التسجيل الصوتي.",
    emptyDescriptionEn: "Connect attendance, classes, timetable, and recorder identity before enabling manual or voice entry.",
  },
  violations: {
    titleAr: "المخالفات السلوكية",
    titleEn: "Behavior Incidents",
    descriptionAr: "توثيق الحالات السلوكية والإجراءات التصحيحية والمتابعة بسرية وتدرج إجرائي.",
    descriptionEn: "Document behavior incidents, corrective actions, and follow-up with confidentiality and procedural escalation.",
    icon: ShieldCheck, eyebrow: "PRINCIPAL · CONDUCT",
    stagesAr: ["استقبال بلاغ أو ملاحظة موثقة", "التحقق من الواقعة ومصدرها", "تحديد الإجراء المخول ومتابعته", "مراجعة الإغلاق وحفظ السجل"],
    stagesEn: ["Receive a documented report or observation", "Verify the incident and its source", "Select and track an authorized intervention", "Review closure and preserve the record"],
    controlsAr: ["تُفصل الواقعة عن الإجراء وعن نتيجة المتابعة.", "لا تُعرض التفاصيل إلا للأدوار المخولة.", "تُراعى سياسة المدرسة واللوائح المعتمدة ولا تصدر أحكام آلية."],
    controlsEn: ["Separate the incident, intervention, and follow-up outcome.", "Details are visible only to authorized roles.", "Follow school policy and approved regulations; do not issue automated judgments."],
    emptyTitleAr: "سجل السلوك غير متصل",
    emptyTitleEn: "Behavior register not connected",
    emptyDescriptionAr: "لا توجد حالات معروضة. يتطلب التشغيل مصدرًا معتمدًا وصلاحيات دقيقة وسجل تدقيق.",
    emptyDescriptionEn: "No cases are displayed. Activation requires an approved source, precise permissions, and an audit trail.",
  },
  positive: {
    titleAr: "السلوك المتميز",
    titleEn: "Positive Behavior",
    descriptionAr: "توثيق المواقف الإيجابية والشواهد والتكريم بعد المراجعة والاعتماد.",
    descriptionEn: "Record positive conduct, supporting evidence, and recognition after review and approval.",
    icon: Star, eyebrow: "PRINCIPAL · POSITIVE CONDUCT",
    stagesAr: ["تسجيل الموقف ومصدره وتاريخه", "إرفاق الشاهد أو مرجعه", "مراجعة التوثيق والتحقق من الخصوصية", "اعتماد الإجراء وربطه بالتقرير المناسب"],
    stagesEn: ["Record the event, source, and date", "Attach evidence or its reference", "Review documentation and privacy", "Approve and link to the appropriate report"],
    controlsAr: ["لا تُنشأ نقاط أو أوسمة أو أسماء تجريبية.", "الشاهد يحفظ في مكتبة رافين ويرتبط بسجل الواقعة.", "لا يُنشر أي محتوى قبل الاعتماد."],
    controlsEn: ["No sample points, badges, or names are fabricated.", "Evidence is stored in Raven Library and linked to the event record.", "Nothing is published before approval."],
    emptyTitleAr: "سجل الشواهد الإيجابية غير متصل",
    emptyTitleEn: "Positive evidence register not connected",
    emptyDescriptionAr: "ستظهر الشواهد المعتمدة بعد ربط مصدر البيانات ومكتبة رافين ومسار المراجعة.",
    emptyDescriptionEn: "Approved evidence will appear after connecting the data source, Raven Library, and review workflow.",
  },
};

export function PrincipalOperationsScreen({ area }: { area: PrincipalOperationsArea }) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const screen = SCREENS[area];
  const Icon = screen.icon;
  const stages = isAr ? screen.stagesAr : screen.stagesEn;
  const controls = isAr ? screen.controlsAr : screen.controlsEn;

  return (
    <div className="space-y-5">
      <PageHead
        icon={Icon}
        eyebrow={`RAVEN OS · ${screen.eyebrow}`}
        title={isAr ? screen.titleAr : screen.titleEn}
        description={isAr ? screen.descriptionAr : screen.descriptionEn}
      />
      <div className="flex items-start gap-3 rounded-2xl border border-amber-300/70 bg-amber-50 p-4 text-sm leading-7 text-amber-950">
        <AlertCircle className="mt-1 shrink-0" size={18} />
        <p>{isAr
          ? "حالة هذه الشاشة: تجهيز واجهة ومسار عمل فقط. لا توجد خدمة خلفية متصلة؛ لذلك لا تُنفذ عمليات حفظ أو اعتماد أو إرسال في هذه النسخة."
          : "Screen status: interface and workflow preparation only. No backend service is connected, so save, approval, and dispatch actions are not performed in this build."}</p>
      </div>

      <SectionCard title={isAr ? "مسار العمل" : "Workflow"} description={isAr ? "خطوات تشغيلية مقترحة تنتظر ربط الخدمات والصلاحيات." : "Operational stages awaiting service and permission integration."}>
        <ol className="grid gap-3 md:grid-cols-2">
          {stages.map((stage, index) => (
            <li key={stage} className="flex items-start gap-3 rounded-xl border border-black/10 bg-white p-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#08794F]/10 text-sm font-black text-[#08794F]">{index + 1}</span>
              <span className="pt-1 text-sm font-semibold leading-6 text-[#26342f]">{stage}</span>
            </li>
          ))}
        </ol>
      </SectionCard>

      <SectionCard title={isAr ? "السجلات والبيانات" : "Records & Data"} description={isAr ? "لن تُعرض بيانات تجريبية أو مؤشرات غير مستندة إلى مصدر موثوق." : "No demo records or indicators without a trusted source."}>
        <EmptyState icon={Database} title={isAr ? screen.emptyTitleAr : screen.emptyTitleEn} description={isAr ? screen.emptyDescriptionAr : screen.emptyDescriptionEn} />
      </SectionCard>

      <SectionCard title={isAr ? "ضوابط الحوكمة" : "Governance Controls"}>
        <ul className="space-y-3">
          {controls.map((control) => (
            <li key={control} className="flex items-start gap-2 text-sm leading-7 text-[#43514b]">
              <LockKeyhole size={17} className="mt-1 shrink-0 text-[#08794F]" />
              <span>{control}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <PrincipalAreaConnections area={area} />
      <SectionCard title={isAr ? "متطلبات التفعيل" : "Activation Requirements"}>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: Database, ar: "مصدر بيانات موحد", en: "Unified data source" },
            { icon: ShieldCheck, ar: "هوية وصلاحيات خادمية", en: "Server-side identity & permissions" },
            { icon: ClipboardCheck, ar: "سجل تدقيق واختبارات", en: "Audit trail & tests" },
          ].map(({ icon: RequirementIcon, ar, en }) => (
            <div key={en} className="flex items-center gap-2 rounded-xl border border-black/10 bg-[#F5F3EC]/70 p-3 text-sm font-semibold text-[#35423d]">
              <RequirementIcon size={18} className="shrink-0 text-[#08794F]" />
              <span>{isAr ? ar : en}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
