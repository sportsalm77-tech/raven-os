"use client";

import { Database, FileSpreadsheet, FileText, FolderKanban, UsersRound, ClipboardList, ShieldCheck, AlertCircle } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { PageHead, SectionCard, EmptyState } from "@/components/raven-ui";

const groups = [
  { Icon: Database, ar: "الملف الأساسي للمدرسة", en: "School master record", descAr: "البيانات التعريفية والتنظيمية المعتمدة للمدرسة.", descEn: "Approved school identity and organizational details." },
  { Icon: UsersRound, ar: "بيانات الكوادر", en: "Staff records", descAr: "بيانات المعلمين والموظفين وربطها بالأدوار المدرسية.", descEn: "Teacher and staff records mapped to school roles." },
  { Icon: ClipboardList, ar: "الخطط والفرق واللجان", en: "Plans, teams & committees", descAr: "مصادر الخطط التشغيلية والفرق واللجان والتكليفات.", descEn: "Sources for operational plans, teams, committees, and assignments." },
  { Icon: FolderKanban, ar: "مستودع ملفات المدرسة", en: "School file repository", descAr: "تنظيم الملفات المرجعية التي ستُستخدم في بناء النماذج والشواهد.", descEn: "Organize reference files used to prepare forms and evidence." },
];

export function PrincipalInfoCenter() {
  const { isAr } = useLang();
  return <div>
    <PageHead icon={Database} eyebrow="RAVEN OS · PRINCIPAL" title={isAr ? "مركز المعلومات المدرسية" : "School Information Center"}
      description={isAr ? "قاعدة بيانات مدير المدرسة: مصدر موحد للبيانات والملفات التي ستغذي أقسام رافين دون إعادة إدخالها." : "The principal's school data hub: one source for records and files used across Raven without repeated entry."} />
    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-300/70 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
      <AlertCircle className="mt-1 shrink-0" size={18}/>
      <p>{isAr ? "المركز في مرحلة تجهيز الواجهة. لم يتم ربط قاعدة بيانات أو صلاحيات أو استيراد فعلي بعد؛ لذلك لا يوجد رفع أو حفظ متاح في هذه النسخة." : "This center's interface is being prepared. Database, permissions, and actual imports are not connected yet; upload and save are therefore unavailable in this build."}</p>
    </div>
    <SectionCard title={isAr ? "مصادر معلومات المدرسة" : "School information sources"} description={isAr ? "تقسيم وظيفي لمصادر البيانات قبل ربطها تشغيليًا." : "A functional grouping of data sources before operational connection."}>
      <div className="grid gap-3 md:grid-cols-2">
        {groups.map(({Icon,ar,en,descAr,descEn}) => <article key={ar} className="rounded-2xl border border-black/10 bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#08794F]/10 text-[#08794F]"><Icon size={19}/></span>
            <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-800">{isAr ? "غير متصل" : "Not connected"}</span>
          </div>
          <h2 className="font-extrabold text-[#111A18]">{isAr ? ar : en}</h2>
          <p className="mt-2 text-xs leading-6 text-[#66736e]">{isAr ? descAr : descEn}</p>
        </article>)}
      </div>
    </SectionCard>
    <SectionCard title={isAr ? "أنواع الملفات المستهدفة" : "Planned file types"} description={isAr ? "تجهيز تصوري فقط؛ لم يتم تفعيل الرفع أو المعالجة." : "Planning reference only; upload and processing are not enabled."}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl bg-[#F5F3EC] p-3"><FileSpreadsheet className="text-[#08794F]"/><div><p className="text-sm font-bold">{isAr ? "جداول Excel" : "Excel workbooks"}</p><p className="text-xs text-[#66736e]">{isAr ? "لبيانات الكوادر والقوائم المنظمة" : "For staff records and structured lists"}</p></div></div>
        <div className="flex items-center gap-3 rounded-xl bg-[#F5F3EC] p-3"><FileText className="text-[#08794F]"/><div><p className="text-sm font-bold">{isAr ? "مستندات PDF" : "PDF documents"}</p><p className="text-xs text-[#66736e]">{isAr ? "للوثائق والخطط والملفات المرجعية" : "For documents, plans, and references"}</p></div></div>
      </div>
      <div className="mt-4"><EmptyState title={isAr ? "بانتظار ربط مصدر البيانات" : "Waiting for a connected data source"} description={isAr ? "لن نعرض سجلات افتراضية. عند تنفيذ الربط ستُحدد آلية التحقق من الملفات، ومعاينة البيانات، واعتماد الاستيراد قبل انعكاسها على بقية الأقسام." : "No sample records are shown. Once connected, file validation, data preview, and import approval will be defined before records flow into other sections."}/></div>
    </SectionCard>
    <p className="mt-4 flex items-center gap-2 text-xs text-[#66736e]"><ShieldCheck size={15}/>{isAr ? "مبدأ الحوكمة: بيانات كل مدرسة معزولة ولا تظهر إلا للمستخدم المخوّل بعد التحقق من صلاحياته." : "Governance: each school's data remains isolated and visible only to authorized users after permission checks."}</p>
  </div>;
}
