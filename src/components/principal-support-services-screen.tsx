"use client";

import {
  Library, CalendarDays, HeartPulse, Trophy, Star, Accessibility,
  MonitorPlay, FlaskConical, Plug, Bot, AlertCircle, ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { PrincipalAreaConnections } from "@/components/principal-area-connections";
import { EmptyState, PageHead, SectionCard } from "@/components/raven-ui";

export type PrincipalSupportArea =
  | "library" | "timetable" | "health" | "activities" | "talented"
  | "special-ed" | "resources" | "labs" | "noor" | "madrasati" | "hudori" | "assistant";

type Definition = {
  titleAr: string; titleEn: string; descAr: string; descEn: string;
  icon: LucideIcon; eyebrow: string; stepsAr: string[]; stepsEn: string[];
  rulesAr: string[]; rulesEn: string[]; emptyAr: string; emptyEn: string;
  detailAr: string; detailEn: string;
};

const SCREENS: Record<PrincipalSupportArea, Definition> = {
  library: {
    titleAr: "مكتبة رافين", titleEn: "Raven Library",
    descAr: "إدارة الوثائق والنماذج والشواهد الرسمية وربطها بسجلات المدرسة ومراكز العمل.",
    descEn: "Manage official documents, templates, and evidence linked to school records and operational centers.",
    icon: Library, eyebrow: "PRINCIPAL · DOCUMENTS",
    stepsAr: ["اختيار نوع الوثيقة أو النموذج", "استدعاء البيانات المعتمدة من المصدر الموحد", "مراجعة المحتوى والحقول قبل الإصدار", "حفظ النسخة وربطها بالسجل والمرجع"],
    stepsEn: ["Select a document or template type", "Retrieve approved data from the unified source", "Review content and fields before issue", "Save the version and link it to its record"],
    rulesAr: ["لا تُنشأ بيانات مدرسية مكررة داخل المكتبة.", "لا يُعرض مستند على أنه صادر قبل اكتمال خدمة التوليد والحفظ.", "تُطبق صلاحيات الاطلاع والتنزيل على كل ملف."],
    rulesEn: ["Do not duplicate school data inside the library.", "A document is not issued until generation and storage are implemented.", "Apply access and download permissions to every file."],
    emptyAr: "مكتبة الوثائق غير متصلة", emptyEn: "Document library not connected",
    detailAr: "ستظهر الملفات بعد ربط مخزن الوثائق وقوالبها ومراجع السجلات والصلاحيات. لا توجد ملفات أو نماذج تجريبية.",
    detailEn: "Files will appear after connecting document storage, templates, record references, and permissions. No sample files or templates are shown.",
  },
  timetable: {
    titleAr: "الجدول المدرسي", titleEn: "School Timetable",
    descAr: "إدارة عرض الجداول وربطها بالفصول والكادر والحصص والتغييرات المعتمدة.",
    descEn: "Manage timetable views linked to classes, staff, periods, and approved changes.",
    icon: CalendarDays, eyebrow: "PRINCIPAL · SCHEDULING",
    stepsAr: ["تحديد الفصل أو المعلم أو اليوم", "قراءة الجدول المعتمد من مصدره", "مراجعة التعارضات والتغييرات", "توثيق التعديل والجهة المعتمدة"],
    stepsEn: ["Select class, teacher, or day", "Read the approved timetable from its source", "Review conflicts and changes", "Record amendments and approving authority"],
    rulesAr: ["لا تُنشأ حصص أو أسماء أو جداول افتراضية.", "لا يعتمد تعديل الجدول دون صلاحية ومسار تدقيق.", "تُراعى خصوصية نطاق المدرسة."],
    rulesEn: ["Do not fabricate periods, names, or timetables.", "No timetable change is approved without permission and audit workflow.", "Enforce school-level data scope."],
    emptyAr: "بيانات الجدول غير متصلة", emptyEn: "Timetable data not connected",
    detailAr: "يلزم ربط الجداول والفصول والكادر والتقويم قبل عرض أي جدول أو تعارض.",
    detailEn: "Connect timetables, classes, staff, and calendar before displaying schedules or conflicts.",
  },
  health: {
    titleAr: "الصحة المدرسية", titleEn: "School Health",
    descAr: "تنظيم إجراءات الصحة المدرسية والبلاغات والتوعية والمتابعة ضمن صلاحيات محددة.",
    descEn: "Coordinate school health procedures, reports, awareness, and follow-up under restricted permissions.",
    icon: HeartPulse, eyebrow: "PRINCIPAL · WELLBEING",
    stepsAr: ["استقبال البلاغ أو الإجراء الصحي", "التحقق من المصدر ونطاق الاطلاع", "إسناد المتابعة للجهة المخولة", "توثيق الإغلاق والشواهد اللازمة"],
    stepsEn: ["Receive a health report or procedure", "Verify source and access scope", "Assign follow-up to an authorized role", "Record closure and required evidence"],
    rulesAr: ["المعلومات الصحية حساسة ولا تظهر إلا للمخولين.", "لا تُعرض حالات أو أعداد افتراضية.", "لا تقدم الشاشة تشخيصًا طبيًا أو قرارًا علاجيًا."],
    rulesEn: ["Health information is sensitive and restricted to authorized roles.", "No sample cases or counts are displayed.", "The screen does not provide medical diagnosis or treatment decisions."],
    emptyAr: "سجل الصحة المدرسية غير متصل", emptyEn: "School health register not connected",
    detailAr: "يتطلب التشغيل مصدرًا معتمدًا وضوابط خصوصية وصلاحيات وسجل وصول.",
    detailEn: "Activation requires an approved source, privacy controls, permissions, and access logging.",
  },
  activities: {
    titleAr: "النشاط الطلابي", titleEn: "Student Activities",
    descAr: "تخطيط البرامج والفعاليات وتكليف فرق التنفيذ وتوثيق المشاركة والأثر.",
    descEn: "Plan programs and events, assign delivery teams, and document participation and impact.",
    icon: Trophy, eyebrow: "PRINCIPAL · ACTIVITIES",
    stepsAr: ["تسجيل مقترح البرنامج وأهدافه", "ربطه بالخطة أو المبادرة المعتمدة", "إسناد التنفيذ ومتابعة المواعيد", "توثيق المشاركة والشواهد وقياس الأثر"],
    stepsEn: ["Register the program proposal and objectives", "Link it to an approved plan or initiative", "Assign delivery and track dates", "Document participation, evidence, and impact"],
    rulesAr: ["ترتبط البرامج بالخطة التشغيلية ولا تنشئ خطة موازية.", "لا تُعرض مشاركات أو نتائج مختلقة.", "تُحفظ الشواهد في مكتبة رافين مع مرجع البرنامج."],
    rulesEn: ["Programs link to the operational plan; they do not create a parallel plan.", "Do not fabricate participation or outcomes.", "Store evidence in Raven Library with the program reference."],
    emptyAr: "سجل الأنشطة غير متصل", emptyEn: "Activities register not connected",
    detailAr: "ستظهر البرامج بعد ربط الخطة التشغيلية والتكليفات ومصدر المشاركات ومكتبة الشواهد.",
    detailEn: "Programs will appear after connecting the operational plan, assignments, participation source, and evidence library.",
  },
  talented: {
    titleAr: "الموهوبون", titleEn: "Gifted Students",
    descAr: "متابعة الترشيح والبرامج والرعاية والشواهد وفق إجراءات معتمدة وخصوصية مناسبة.",
    descEn: "Track nominations, programs, support, and evidence through approved procedures and privacy controls.",
    icon: Star, eyebrow: "PRINCIPAL · GIFTED",
    stepsAr: ["استقبال ترشيح من مصدر مخول", "التحقق من معايير الترشيح ومراجعها", "ربط الطالب بالبرنامج المعتمد", "متابعة الرعاية والشواهد والنتائج"],
    stepsEn: ["Receive a nomination from an authorized source", "Verify nomination criteria and references", "Link the student to an approved program", "Track support, evidence, and outcomes"],
    rulesAr: ["لا تُعرض أسماء أو تصنيفات افتراضية.", "تُقيد بيانات الطلاب حسب الدور والحاجة.", "لا يصدر تصنيف آلي دون مراجعة بشرية ومعايير معتمدة."],
    rulesEn: ["No sample names or classifications are displayed.", "Restrict student data by role and need.", "No automated classification without human review and approved criteria."],
    emptyAr: "ملف الموهوبين غير متصل", emptyEn: "Gifted students register not connected",
    detailAr: "يتطلب التشغيل مصدر ترشيح معتمدًا وربطًا بسجل الطالب وبرامج الرعاية والصلاحيات.",
    detailEn: "Activation requires an approved nomination source linked to student records, support programs, and permissions.",
  },
  "special-ed": {
    titleAr: "التربية الخاصة", titleEn: "Special Education",
    descAr: "تنظيم خدمات الدعم والخطط الفردية والإحالات والمتابعة مع حماية البيانات الحساسة.",
    descEn: "Coordinate support services, individual plans, referrals, and follow-up while protecting sensitive data.",
    icon: Accessibility, eyebrow: "PRINCIPAL · INCLUSION",
    stepsAr: ["استقبال إحالة موثقة ومصرح بها", "التحقق من نطاق الوصول والموافقة", "ربط الخدمة بالخطة الفردية المعتمدة", "متابعة التنفيذ والمراجعة الدورية"],
    stepsEn: ["Receive an authorized documented referral", "Verify access scope and consent", "Link services to the approved individual plan", "Track delivery and periodic review"],
    rulesAr: ["البيانات ذات الحساسية العالية مقيدة بأضيق نطاق.", "لا تُنشأ تشخيصات أو خطط افتراضية.", "تُحفظ الموافقات وسجلات الوصول والتعديلات."],
    rulesEn: ["Highly sensitive data is restricted to the narrowest scope.", "Do not fabricate diagnoses or individual plans.", "Preserve consent, access, and change logs."],
    emptyAr: "خدمات التربية الخاصة غير متصلة", emptyEn: "Special education services not connected",
    detailAr: "لا تعرض الشاشة ملفات حالات حتى يتوفر مصدر معتمد وضوابط موافقة وصلاحيات دقيقة.",
    detailEn: "No case files appear until an approved source, consent controls, and precise permissions are available.",
  },
  resources: {
    titleAr: "مصادر التعلم", titleEn: "Learning Resources",
    descAr: "إدارة مصادر التعلم والأجهزة والمواد والإعارة والحجوزات وسجلات الاستخدام.",
    descEn: "Manage learning resources, devices, materials, loans, reservations, and usage records.",
    icon: MonitorPlay, eyebrow: "PRINCIPAL · RESOURCES",
    stepsAr: ["استعراض سجل الموارد المعتمد", "التحقق من حالة المورد وموقعه", "تسجيل طلب الإعارة أو الحجز", "متابعة التسليم والإرجاع والصيانة"],
    stepsEn: ["Browse the approved resource register", "Verify resource status and location", "Record a loan or reservation request", "Track handover, return, and maintenance"],
    rulesAr: ["لا تُعرض أصول أو كميات تجريبية.", "تُفصل الطلبات عن عمليات التسليم المعتمدة.", "تُحفظ حركة العهدة بسجل تدقيق."],
    rulesEn: ["Do not display sample assets or quantities.", "Separate requests from approved handover operations.", "Keep an auditable custody history."],
    emptyAr: "سجل مصادر التعلم غير متصل", emptyEn: "Learning resources register not connected",
    detailAr: "يلزم ربط سجل الأصول والمواقع والطلبات والصيانة قبل إتاحة العمليات.",
    detailEn: "Connect asset, location, request, and maintenance records before enabling operations.",
  },
  labs: {
    titleAr: "المختبرات", titleEn: "Laboratories",
    descAr: "متابعة المختبرات والتجهيزات والسلامة والحجوزات والصيانة وسجلات الاستخدام.",
    descEn: "Track laboratories, equipment, safety, reservations, maintenance, and usage logs.",
    icon: FlaskConical, eyebrow: "PRINCIPAL · LABS",
    stepsAr: ["اختيار المختبر أو التجهيز", "مراجعة الجاهزية ومتطلبات السلامة", "تنظيم الحجز والاستخدام", "توثيق الملاحظات والصيانة والإغلاق"],
    stepsEn: ["Select a laboratory or equipment item", "Review readiness and safety requirements", "Coordinate reservations and use", "Record observations, maintenance, and closure"],
    rulesAr: ["لا تُعرض نتائج فحوص أو سجلات سلامة غير حقيقية.", "لا يُتاح الحجز قبل التحقق من الجاهزية.", "تُوثق الصيانة والمسؤولية عن كل إجراء."],
    rulesEn: ["Do not display fabricated test results or safety logs.", "Reservations require verified readiness.", "Document maintenance and ownership of each action."],
    emptyAr: "سجل المختبرات غير متصل", emptyEn: "Laboratories register not connected",
    detailAr: "يتطلب التشغيل ربط الأصول والحجوزات والسلامة والصيانة ومستخدمي المختبر.",
    detailEn: "Activation requires connected assets, reservations, safety, maintenance, and laboratory users.",
  },
  noor: {
    titleAr: "الربط مع نور", titleEn: "Noor Integration",
    descAr: "مساحة إعداد ومراجعة تكامل نور دون افتراض وجود اتصال أو صلاحية API.",
    descEn: "A configuration and review workspace for Noor integration without assuming a live connection or API access.",
    icon: Plug, eyebrow: "PRINCIPAL · INTEGRATIONS",
    stepsAr: ["تحديد نطاق البيانات المطلوب تبادلها", "التحقق من وسيلة التكامل المعتمدة", "مراجعة المطابقة قبل الاستيراد", "توثيق نتيجة المزامنة والأخطاء"],
    stepsEn: ["Define the data exchange scope", "Verify the approved integration method", "Review mapping before import", "Record synchronization results and errors"],
    rulesAr: ["لا تُطلب كلمات مرور المستخدمين أو تُخزن داخل الواجهة.", "لا تُعرض حالة اتصال ناجح دون فحص فعلي.", "تخضع البيانات المستوردة للتحقق والمراجعة البشرية."],
    rulesEn: ["Never request or store user passwords in the interface.", "Do not show a successful connection without an actual check.", "Imported data requires validation and human review."],
    emptyAr: "تكامل نور غير مفعّل", emptyEn: "Noor integration not enabled",
    detailAr: "لا يوجد اتصال مثبت في هذه النسخة. يلزم اعتماد آلية التكامل والهوية والصلاحيات قبل التفعيل.",
    detailEn: "No live connection is verified in this build. Integration method, identity, and permissions must be approved before activation.",
  },
  madrasati: {
    titleAr: "الربط مع مدرستي", titleEn: "Madrasati Integration",
    descAr: "مساحة إعداد ومراجعة تبادل البيانات مع مدرستي ضمن التكاملات المعتمدة.",
    descEn: "A workspace to configure and review data exchange with Madrasati through approved integrations.",
    icon: Plug, eyebrow: "PRINCIPAL · INTEGRATIONS",
    stepsAr: ["تحديد حالات الاستخدام ونطاق التبادل", "اعتماد وسيلة الربط ومصدر الهوية", "مطابقة الحقول والتحقق من السجلات", "مراجعة تقرير المزامنة والاستثناءات"],
    stepsEn: ["Define use cases and exchange scope", "Approve integration method and identity source", "Map fields and validate records", "Review synchronization and exception reports"],
    rulesAr: ["لا يُفترض وجود API أو اتصال قائم.", "لا تُنسخ بيانات الطلاب خارج النطاق المخول.", "لا تعتمد السجلات المستوردة تلقائيًا."],
    rulesEn: ["Do not assume an existing API or live connection.", "Never copy student data outside the authorized scope.", "Imported records are not automatically approved."],
    emptyAr: "تكامل مدرستي غير مفعّل", emptyEn: "Madrasati integration not enabled",
    detailAr: "يتطلب التفعيل آلية تكامل معتمدة واختبارًا محدود النطاق ومراجعة سجلات المزامنة.",
    detailEn: "Activation requires an approved integration method, a limited-scope test, and synchronization log review.",
  },
  hudori: {
    titleAr: "الربط مع حضوري", titleEn: "Hudori Integration",
    descAr: "مساحة مراجعة تكامل بيانات الحضور والانصراف مع التحقق من المصدر والمطابقة.",
    descEn: "A workspace for attendance integration review with source verification and record reconciliation.",
    icon: Plug, eyebrow: "PRINCIPAL · INTEGRATIONS",
    stepsAr: ["تحديد نطاق بيانات الحضور", "التحقق من هوية المصدر وآلية الربط", "مطابقة السجلات والفترات الزمنية", "مراجعة الاستثناءات قبل الاعتماد"],
    stepsEn: ["Define attendance data scope", "Verify source identity and integration method", "Reconcile records and time periods", "Review exceptions before approval"],
    rulesAr: ["لا تُعرض بيانات حضور افتراضية.", "لا تُعد المزامنة اعتمادًا نهائيًا للسجل.", "تُحفظ سجلات المطابقة والأخطاء."],
    rulesEn: ["No sample attendance data is displayed.", "Synchronization does not constitute final register approval.", "Preserve reconciliation and error logs."],
    emptyAr: "تكامل حضوري غير مفعّل", emptyEn: "Hudori integration not enabled",
    detailAr: "لا توجد مزامنة مثبتة. يلزم اختبار المصدر والتوقيت والمطابقة والصلاحيات قبل التشغيل.",
    detailEn: "No synchronization is verified. Source, timing, reconciliation, and permissions must be tested before activation.",
  },
  assistant: {
    titleAr: "المساعد الذكي", titleEn: "Smart Assistant",
    descAr: "واجهة مساعدة للاستعلام والتوجيه وصياغة المسودات مع إبقاء القرار والاعتماد بيد المستخدم.",
    descEn: "An assistance workspace for guidance, queries, and drafting while keeping decisions and approvals with the user.",
    icon: Bot, eyebrow: "PRINCIPAL · ASSISTANCE",
    stepsAr: ["تحديد المهمة والسياق المسموح", "استدعاء مصادر موثوقة ضمن صلاحية المستخدم", "مراجعة المخرجات ومراجعها", "اعتماد المستخدم قبل أي إجراء أو مشاركة"],
    stepsEn: ["Define the task and permitted context", "Use trusted sources within the user's permissions", "Review outputs and their references", "Require user approval before any action or sharing"],
    rulesAr: ["لا يكشف المساعد بيانات خارج صلاحية المستخدم.", "المخرجات اقتراحات وليست قرارات إدارية معتمدة.", "لا ينفذ إرسالًا أو تعديلًا دون تأكيد ومسار خادمي."],
    rulesEn: ["The assistant cannot expose data beyond the user's permissions.", "Outputs are suggestions, not approved administrative decisions.", "No dispatch or modification without confirmation and a server workflow."],
    emptyAr: "خدمات المساعد الذكي غير مفعّلة", emptyEn: "Smart assistant services not enabled",
    detailAr: "هذه واجهة تعريفية لمسار المساعدة فقط؛ لم يتم توصيل نموذج أو مصادر أو أدوات تنفيذ في هذه الشاشة.",
    detailEn: "This is an assistance workflow shell only; no model, data sources, or execution tools are connected to this screen.",
  },
};

export function PrincipalSupportServicesScreen({ area }: { area: PrincipalSupportArea }) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const screen = SCREENS[area];
  const Icon = screen.icon;
  return (
    <div className="space-y-5">
      <PageHead icon={Icon} eyebrow={`RAVEN OS · ${screen.eyebrow}`}
        title={isAr ? screen.titleAr : screen.titleEn}
        description={isAr ? screen.descAr : screen.descEn} />
      <div className="flex items-start gap-3 rounded-2xl border border-amber-300/70 bg-amber-50 p-4 text-sm leading-7 text-amber-950">
        <AlertCircle className="mt-1 shrink-0" size={18} />
        <p>{isAr
          ? "حالة الشاشة: واجهة ومسار عمل فقط. لم يثبت اتصال خدمة خلفية أو تنفيذ عمليات فعلية في هذه النسخة."
          : "Screen status: interface and workflow only. No backend connection or live operations are verified in this build."}</p>
      </div>
      <SectionCard title={isAr ? "مسار العمل" : "Workflow"}
        description={isAr ? "مراحل تشغيلية تنتظر ربط مصادر البيانات والخدمات والصلاحيات." : "Operational stages awaiting data-source, service, and permission integration."}>
        <ol className="grid gap-3 md:grid-cols-2">
          {(isAr ? screen.stepsAr : screen.stepsEn).map((step, index) => (
            <li key={step} className="flex items-start gap-3 rounded-xl border border-black/10 bg-white p-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#08794F]/10 text-sm font-black text-[#08794F]">{index + 1}</span>
              <span className="pt-1 text-sm font-semibold leading-6 text-[#26342D]">{step}</span>
            </li>
          ))}
        </ol>
      </SectionCard>
      <SectionCard title={isAr ? "ضوابط التشغيل والحوكمة" : "Operational & Governance Controls"}>
        <ul className="space-y-3">
          {(isAr ? screen.rulesAr : screen.rulesEn).map(rule => (
            <li key={rule} className="flex items-start gap-2 text-sm leading-7 text-[#34423B]">
              <ShieldCheck className="mt-1 shrink-0 text-[#08794F]" size={17} /><span>{rule}</span>
            </li>
          ))}
        </ul>
      </SectionCard>
      <PrincipalAreaConnections area={area} />
      <EmptyState title={isAr ? screen.emptyAr : screen.emptyEn}
        description={isAr ? screen.detailAr : screen.detailEn} />
    </div>
  );
}
