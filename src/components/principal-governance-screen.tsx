"use client";

import { KeyRound, SlidersHorizontal, FileBarChart2, ShieldCheck, AlertCircle, Lock, ClipboardList, Database, FileOutput } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { EmptyState, PageHead, SectionCard } from "@/components/raven-ui";

export type PrincipalGovernanceArea = "permissions" | "settings" | "reports";

type GovernanceDefinition = {
  titleAr: string; titleEn: string; descAr: string; descEn: string;
  icon: LucideIcon; eyebrow: string; sectionsAr: { title: string; body: string }[];
  sectionsEn: { title: string; body: string }[]; rulesAr: string[]; rulesEn: string[];
  emptyAr: string; emptyEn: string; detailAr: string; detailEn: string;
};

const DEFINITIONS: Record<PrincipalGovernanceArea, GovernanceDefinition> = {
  permissions: {
    titleAr: "الصلاحيات المدرسية", titleEn: "School Permissions",
    descAr: "مراجعة نطاق الأدوار المدرسية وطلب التعديلات وفق الحوكمة المعتمدة، دون منح صلاحيات فعلية من الواجهة.",
    descEn: "Review school-role scopes and request changes under approved governance, without granting live permissions from the interface.",
    icon: KeyRound, eyebrow: "PRINCIPAL · ACCESS GOVERNANCE",
    sectionsAr: [
      { title: "الأدوار المدرسية", body: "مدير المدرسة، وكيل المدرسة، قائد اللجنة، أمين الكنترول، المعلم، والموظفون المصرح لهم. تُحمّل الأدوار الفعلية من مصدر الهوية والصلاحيات، ولا تُعرض أعداد مستخدمين افتراضية." },
      { title: "مصفوفة القدرات", body: "تُحدد كل قدرة على مستوى الإجراء والبيانات ونطاق المدرسة، مع فصل صلاحيات الاطلاع والإضافة والتعديل والاعتماد والتصدير." },
      { title: "طلبات التغيير وسجل التدقيق", body: "أي تعديل يتطلب هوية منفذ موثقة، وسببًا، وموافقة الجهة المخولة، وسجلًا غير قابل للالتباس. لا يُنفذ أي تغيير من هذه الشاشة حاليًا." },
    ],
    sectionsEn: [
      { title: "School roles", body: "Principal, vice principal, committee lead, exam controller, teacher, and authorized staff. Live roles must come from the identity and permission source; no sample user counts are shown." },
      { title: "Capability matrix", body: "Define each capability by action, data, and school scope, separating view, create, update, approve, and export permissions." },
      { title: "Change requests and audit log", body: "Every change requires a verified actor, reason, authorized approval, and unambiguous audit record. This screen does not execute changes yet." },
    ],
    rulesAr: ["الصلاحيات الفعلية تُفرض من جهة الخادم، لا بمجرد إخفاء عناصر الواجهة.", "لا يجوز لمدير المدرسة تعديل الصلاحيات العالمية أو صلاحيات المنصة.", "تُطبق حدود school_id على جميع قراءات الصلاحيات وعملياتها."],
    rulesEn: ["Enforce permissions server-side; hiding interface elements is not access control.", "A principal cannot modify platform-global permissions.", "Apply school_id boundaries to every permission read and operation."],
    emptyAr: "مصدر الصلاحيات غير متصل", emptyEn: "Permission source not connected",
    detailAr: "لا توجد مصفوفة فعلية محملة في هذه النسخة. يلزم ربط RBAC ومصدر الهوية وسجل التدقيق قبل عرض أو تعديل الصلاحيات.",
    detailEn: "No live matrix is loaded in this build. Connect RBAC, identity, and audit logging before displaying or changing permissions.",
  },
  settings: {
    titleAr: "إعدادات المدرسة", titleEn: "School Settings",
    descAr: "إعدادات تشغيل محلية للمدرسة منفصلة عن الإعدادات العامة للمنصة.",
    descEn: "School-scoped operating settings kept separate from global platform configuration.",
    icon: SlidersHorizontal, eyebrow: "PRINCIPAL · SCHOOL CONFIGURATION",
    sectionsAr: [
      { title: "هوية المدرسة وبياناتها", body: "تُقرأ بيانات الاسم والموقع والمراحل والهوية الرسمية من مركز البيانات المدرسية الموحد، ويكون تعديل البيانات الأساسية من مصدرها المعتمد." },
      { title: "التقويم والدوام", body: "إعدادات العام والفصل الدراسي وأيام العمل وبنية اليوم والحصص، مع التحقق من عدم تعارضها مع الجداول والسجلات المرتبطة." },
      { title: "التنبيهات والأرشفة", body: "سياسات الإشعار والأرشفة تُعرض وفق الخدمات المتاحة، ولا تُفعّل رسائل أو مهام مجدولة قبل ربط خدمة الإرسال والجدولة وسجل الموافقات." },
    ],
    sectionsEn: [
      { title: "School identity and profile", body: "Name, location, stages, and official identity are read from the unified school data center. Core data changes belong to their approved source." },
      { title: "Calendar and school day", body: "Academic year, term, work days, day structure, and periods must be validated against timetables and related records." },
      { title: "Notifications and archiving", body: "Notification and archive policies reflect available services. Do not activate messaging or scheduled jobs before connecting delivery, scheduling, and approval logs." },
    ],
    rulesAr: ["كل إعداد يخص مدرسة واحدة ويُحفظ ضمن school_id الصحيح.", "لا تُعرض أسماء مدارس أو تواريخ أو إعدادات افتراضية.", "لا تُعلن رسالة أو أرشفة تلقائية على أنها مفعلة دون خدمة خلفية مثبتة."],
    rulesEn: ["Every setting is scoped to one school and its correct school_id.", "Do not show sample school names, dates, or settings.", "Do not claim automated messaging or archiving is active without a verified backend service."],
    emptyAr: "إعدادات المدرسة غير متصلة", emptyEn: "School settings not connected",
    detailAr: "يلزم ربط مركز البيانات المدرسية الموحد وخدمة الإعدادات والصلاحيات وسجل التغييرات قبل الحفظ الفعلي.",
    detailEn: "Connect the unified school data center, settings service, permissions, and change log before enabling persistence.",
  },
  reports: {
    titleAr: "التقارير والمؤشرات", titleEn: "Reports & Indicators",
    descAr: "مساحة لإعداد التقارير الرسمية وقراءة المؤشرات من البيانات الموحدة دون اختلاق نتائج أو نسب.",
    descEn: "A workspace for official reports and unified-data indicators without fabricating results or percentages.",
    icon: FileBarChart2, eyebrow: "PRINCIPAL · REPORTING",
    sectionsAr: [
      { title: "تقارير الأداء المدرسي", body: "تقارير دورية للأداء والحضور والتحصيل والسلوك والخطة التشغيلية، لا تظهر إلا عند توفر بيانات مصدرية معتمدة وفترة قياس واضحة." },
      { title: "تقارير الخطة والأثر", body: "تربط تقدم المبادرات والتكليفات بالشواهد ونتائج قياس الأثر، مع إظهار مصدر كل مؤشر وتاريخ تحديثه." },
      { title: "إصدار وتصدير الوثائق", body: "تُجهز التقارير من قوالب مكتبة رافين وتُصدر إلى الصيغ المدعومة بعد اكتمال التوليد والحفظ والصلاحيات." },
    ],
    sectionsEn: [
      { title: "School performance reports", body: "Periodic performance, attendance, achievement, behavior, and operational-plan reports appear only when approved source data and a defined measurement period are available." },
      { title: "Plan and impact reports", body: "Link initiative and assignment progress to evidence and impact results, showing each indicator's source and refresh date." },
      { title: "Document generation and export", body: "Prepare reports from Raven Library templates and export supported formats only after generation, storage, and permissions are implemented." },
    ],
    rulesAr: ["لا مؤشرات ولا نسب ولا أعداد افتراضية.", "كل مؤشر يحتاج تعريفًا ومصدرًا وفترة قياس وتاريخ تحديث.", "لا يُعلن توليد أو تصدير أو إرسال ناجح قبل إتمام العملية والتحقق من الملف."],
    rulesEn: ["No sample indicators, percentages, or counts.", "Every indicator needs a definition, source, measurement period, and refresh date.", "Never claim successful generation, export, or dispatch before the operation completes and the file is verified."],
    emptyAr: "مصادر التقارير غير متصلة", emptyEn: "Reporting sources not connected",
    detailAr: "لا توجد مؤشرات أو تقارير تشغيلية محملة في هذه النسخة. يلزم ربط مصادر البيانات الموحدة ومكتبة رافين وخدمات التصدير.",
    detailEn: "No live indicators or operational reports are loaded in this build. Connect unified data sources, Raven Library, and export services.",
  },
};

export function PrincipalGovernanceScreen({ area }: { area: PrincipalGovernanceArea }) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const item = DEFINITIONS[area];
  const Icon = item.icon;
  const sections = isAr ? item.sectionsAr : item.sectionsEn;
  return (
    <div className="space-y-5">
      <PageHead icon={Icon} eyebrow={`RAVEN OS · ${item.eyebrow}`}
        title={isAr ? item.titleAr : item.titleEn}
        description={isAr ? item.descAr : item.descEn} />
      <div className="flex items-start gap-3 rounded-2xl border border-amber-300/70 bg-amber-50 p-4 text-sm leading-7 text-amber-950">
        <AlertCircle className="mt-1 shrink-0" size={18} />
        <p>{isAr
          ? "حالة الشاشة: مساحة مراجعة وتجهيز. لا توجد عمليات حفظ أو اعتماد أو إصدار تقارير فعلية متصلة في هذه النسخة."
          : "Screen status: review and preparation workspace. No live save, approval, or report-issuing operations are connected in this build."}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {sections.map((section, index) => (
          <SectionCard key={section.title} title={section.title}
            description={section.body}>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#52645A]">
              {index === 0 ? <Database size={16} /> : index === 1 ? <ShieldCheck size={16} /> : <FileOutput size={16} />}
              <span>{isAr ? "يتطلب ربط المصدر والخدمة" : "Requires source and service integration"}</span>
            </div>
          </SectionCard>
        ))}
      </div>
      <SectionCard title={isAr ? "ضوابط الحوكمة" : "Governance Controls"}>
        <ul className="space-y-3">
          {(isAr ? item.rulesAr : item.rulesEn).map(rule => (
            <li key={rule} className="flex items-start gap-2 text-sm leading-7 text-[#34423B]">
              <Lock className="mt-1 shrink-0 text-[#08794F]" size={17} /><span>{rule}</span>
            </li>
          ))}
        </ul>
      </SectionCard>
      <EmptyState title={isAr ? item.emptyAr : item.emptyEn}
        description={isAr ? item.detailAr : item.detailEn} />
    </div>
  );
}
