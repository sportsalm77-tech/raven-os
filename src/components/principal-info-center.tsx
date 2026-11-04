"use client";

import {
  AlertCircle,
  ArrowDownToLine,
  ArrowLeftRight,
  BookOpen,
  ClipboardList,
  Database,
  FileSpreadsheet,
  FileText,
  FileUp,
  GraduationCap,
  Library,
  ListChecks,
  School,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { EmptyState, PageHead, SectionCard } from "@/components/raven-ui";

const modules = [
  { Icon: School, ar: "بيانات المدرسة", en: "School profile", descAr: "الهوية المدرسية، العام الدراسي، المراحل، الهيكل التنظيمي والفصول.", descEn: "School identity, academic year, stages, organization, and classes." },
  { Icon: UsersRound, ar: "بيانات المعلمين والموظفين", en: "Teachers & staff", descAr: "السجلات الوظيفية والتخصصات والارتباطات والتكليفات.", descEn: "Staff records, specialties, memberships, and assignments." },
  { Icon: GraduationCap, ar: "بيانات الطلاب والفصول", en: "Students & classes", descAr: "السجلات الأساسية وعضويات الفصول وحركة النقل والتحديث.", descEn: "Master records, class memberships, transfers, and updates." },
  { Icon: ClipboardList, ar: "التكليفات والمهام", en: "Assignments & tasks", descAr: "إدخال التكليفات والمهام والمسؤوليات ومواعيدها وحالاتها.", descEn: "Enter assignments, tasks, owners, due dates, and statuses." },
  { Icon: ListChecks, ar: "البيانات التشغيلية", en: "Operational data", descAr: "مصادر الخطط والبرامج والمبادرات واللجان والإجراءات.", descEn: "Source data for plans, programs, initiatives, committees, and procedures." },
  { Icon: FileUp, ar: "رفع الملفات والمرفقات", en: "File uploads", descAr: "رفع ملفات المدرسة الموجودة وربطها بالسجلات ذات العلاقة.", descEn: "Upload existing school files and link them to relevant records." },
  { Icon: ShieldCheck, ar: "جودة البيانات ومراجعتها", en: "Data quality & review", descAr: "متابعة الاكتمال والصحة والتكرار والتعارض والبيانات القديمة.", descEn: "Track completeness, validity, duplicates, conflicts, and stale records." },
  { Icon: ArrowLeftRight, ar: "توزيع البيانات والتكامل", en: "Distribution & integration", descAr: "متابعة وصول البيانات المصرح بها إلى المراكز المستفيدة.", descEn: "Track delivery of authorized data to consuming centers." },
];

const fileTypes = [
  { Icon: FileText, ar: "Word", en: "Word", ext: ".doc · .docx" },
  { Icon: FileText, ar: "PDF", en: "PDF", ext: ".pdf" },
  { Icon: FileSpreadsheet, ar: "Excel", en: "Excel", ext: ".xls · .xlsx" },
  { Icon: BookOpen, ar: "PowerPoint", en: "PowerPoint", ext: ".ppt · .pptx" },
];

const indicators = [
  { ar: "إجمالي السجلات", en: "Total records" },
  { ar: "بيانات مكتملة", en: "Complete records" },
  { ar: "تحتاج إلى استكمال", en: "Needs completion" },
  { ar: "غير صحيحة أو متعارضة", en: "Invalid or conflicting" },
  { ar: "مؤرشفة أو محذوفة منطقيًا", en: "Archived or soft-deleted" },
  { ar: "توزيع ناجح أو متعثر", en: "Successful or failed deliveries" },
];

const consumers = [
  { ar: "الخطة التشغيلية ومركز القرار", en: "Operational Plan & Decision Center" },
  { ar: "شؤون المعلمين", en: "Teacher Affairs" },
  { ar: "شؤون الطلاب", en: "Student Affairs" },
  { ar: "صحة المدرسة", en: "School Health" },
  { ar: "مركز الفصول وأقسامه", en: "Class Operations and its sections" },
  { ar: "بقية مراكز مدير المدرسة", en: "Other Principal portal centers" },
  { ar: "مكتبة رافين", en: "Raven Library" },
];

export function PrincipalInfoCenter() {
  const { isAr } = useLang();
  const t = (ar: string, en: string) => isAr ? ar : en;

  return (
    <div className="space-y-5">
      <PageHead
        icon={Database}
        eyebrow="RAVEN OS · PRINCIPAL"
        title={t("مركز البيانات المدرسية الموحد", "Unified School Data Center")}
        description={t(
          "العصب المركزي لبيانات المدرسة: إدخال مرة واحدة، تحقق ومعالجة، ثم توزيع منضبط على مراكز المنصة.",
          "The school's central data backbone: enter once, validate and process, then distribute to platform centers under controlled permissions."
        )}
      />

      <div className="flex items-start gap-3 rounded-2xl border border-amber-300/70 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        <AlertCircle className="mt-1 shrink-0" size={18} />
        <p>{t(
          "هذه واجهة منظمة فقط في فرع الإنقاذ. لم تُربط بعد هوية المستخدم أو قاعدة البيانات أو صلاحيات الخادم أو خدمات الرفع والتوزيع؛ لذلك لا تعرض أرقامًا افتراضية ولا تتيح حفظًا أو رفعًا فعليًا.",
          "This is a structured interface in the rescue branch only. Identity, database, server permissions, upload, and distribution services are not connected; therefore no sample metrics are shown and real saving/upload is unavailable."
        )}</p>
      </div>

      <SectionCard
        title={t("مؤشرات صحة البيانات", "Data health indicators")}
        description={t(
          "ستُحسب المؤشرات من السجلات الفعلية وسجل المعالجة والتوزيع. عدم الاتصال يظهر كحالة غير متاحة، وليس صفرًا.",
          "Indicators will be calculated from persisted records and processing/distribution events. Disconnection is shown as unavailable, not zero."
        )}
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {indicators.map((item) => (
            <article key={item.en} className="rounded-xl border border-black/10 bg-[#F5F3EC] p-4">
              <p className="text-sm font-semibold text-[#26332e]">{t(item.ar, item.en)}</p>
              <p className="mt-2 text-lg font-extrabold text-[#66736e]">{t("غير متاح حتى ربط مصدر البيانات", "Unavailable until data source is connected")}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title={t("أقسام مركز البيانات", "Data center modules")}
        description={t(
          "أقسام وظيفية داخل مركز واحد؛ لا تنشئ مراكز رئيسية جديدة ولا قواعد بيانات متنافسة.",
          "Functional modules within one center; they do not create new top-level centers or competing data stores."
        )}
      >
        <div className="grid gap-3 md:grid-cols-2">
          {modules.map(({ Icon, ar, en, descAr, descEn }) => (
            <article key={en} className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#08794F]/10 text-[#08794F]">
                <Icon size={19} />
              </div>
              <h2 className="font-extrabold text-[#111A18]">{t(ar, en)}</h2>
              <p className="mt-2 text-xs leading-6 text-[#66736e]">{t(descAr, descEn)}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title={t("رفع الملفات الموجودة", "Upload existing files")}
        description={t(
          "المركز يرفع الملفات ويصنفها ويربطها بالبيانات؛ ولا ينشئ أو يصمم أو يصدر ملفات جديدة.",
          "The center uploads, classifies, and links files to records; it does not author, design, or generate new files."
        )}
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {fileTypes.map(({ Icon, ar, en, ext }) => (
            <div key={en} className="flex items-center gap-3 rounded-xl bg-[#F5F3EC] p-3">
              <Icon className="shrink-0 text-[#08794F]" size={22} />
              <div>
                <p className="text-sm font-bold text-[#111A18]">{t(ar, en)}</p>
                <p className="text-xs text-[#66736e]">{ext}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-dashed border-[#08794F]/40 bg-[#08794F]/5 p-5 text-center">
          <FileUp className="mx-auto mb-2 text-[#08794F]" size={26} />
          <p className="font-bold text-[#26332e]">{t("منطقة رفع الملفات", "File upload area")}</p>
          <p className="mt-1 text-xs leading-6 text-[#66736e]">{t(
            "سيُفعّل الرفع بعد ربط الهوية والصلاحيات والتحقق الآمن من نوع الملف وفحصه وتخزينه.",
            "Uploads will be enabled after identity, permissions, secure file-type validation, scanning, and storage are implemented."
          )}</p>
          <span className="mt-3 inline-flex rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
            {t("الرفع غير متصل حاليًا", "Upload not connected")}
          </span>
        </div>
      </SectionCard>

      <SectionCard
        title={t("المراكز المستفيدة من البيانات", "Data-consuming centers")}
        description={t(
          "تستقبل هذه المراكز البيانات المصرح بها من المصدر المركزي؛ ولا تنشئ نسخًا رئيسية مستقلة منها.",
          "These centers consume authorized data from the central source; they do not create independent master copies."
        )}
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {consumers.map((item) => (
            <div key={item.en} className="flex items-center gap-2 rounded-xl border border-black/10 p-3 text-sm font-semibold text-[#26332e]">
              <ArrowDownToLine className="shrink-0 text-[#08794F]" size={17} />
              <span>{t(item.ar, item.en)}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title={t("مكتبة رافين: جهة إنشاء الملفات", "Raven Library: document generation owner")}
        description={t(
          "مكتبة رافين تستهلك البيانات والملفات المرجعية المصرح بها من هذا المركز، وتتولى لاحقًا إنشاء النماذج والتقارير والملفات النهائية والشواهد.",
          "Raven Library consumes authorized data and source files from this center and will later create templates, reports, final documents, and evidence."
        )}
      >
        <div className="flex items-start gap-3 rounded-xl bg-[#F5F3EC] p-4">
          <Library className="mt-1 shrink-0 text-[#08794F]" size={23} />
          <div>
            <p className="font-bold text-[#111A18]">{t("فصل واضح للمسؤوليات", "Clear separation of responsibilities")}</p>
            <p className="mt-1 text-sm leading-6 text-[#66736e]">{t(
              "مركز البيانات: إدخال ورفع ومعالجة وتوزيع. مكتبة رافين: إنشاء وإصدار وأرشفة الملفات والشواهد.",
              "Data Center: enter, upload, process, distribute. Raven Library: create, issue, and archive documents and evidence."
            )}</p>
          </div>
        </div>
      </SectionCard>

      <EmptyState
        title={t("بانتظار ربط خدمات البيانات", "Waiting for connected data services")}
        description={t(
          "لن تظهر سجلات أو مؤشرات تجريبية. بعد اعتماد مصدر الهوية والبيانات والصلاحيات، تُفعّل الجداول وعمليات الإضافة والتعديل والأرشفة والرفع والتوزيع مع سجل تدقيق.",
          "No sample records or metrics will be displayed. Once identity, data sources, and permissions are approved, tables and create/edit/archive/upload/distribution operations can be enabled with audit history."
        )}
      />

      <p className="flex items-center gap-2 text-xs text-[#66736e]">
        <ShieldCheck size={15} />
        {t(
          "حوكمة المنصة: عزل بيانات كل مدرسة، وصلاحيات خادمية، وسجل تدقيق لكل عملية.",
          "Platform governance: tenant isolation, server-side authorization, and an audit trail for every operation."
        )}
      </p>
    </div>
  );
}
