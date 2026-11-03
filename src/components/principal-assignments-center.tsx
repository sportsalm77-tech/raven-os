"use client";

import { ClipboardCheck, CalendarClock, UserRoundCheck, FileCheck2, BellRing, ShieldCheck, AlertCircle, ListChecks, MessageSquareText } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { EmptyState, PageHead, SectionCard } from "@/components/raven-ui";

const stages = [
  { icon: ClipboardCheck, ar: "إعداد التكليف", en: "Create assignment", arDesc: "تحديد المطلوب والهدف ومصدر التكليف.", enDesc: "Define the request, objective, and source." },
  { icon: UserRoundCheck, ar: "تحديد المسؤول", en: "Assign ownership", arDesc: "ربط المهمة بمستخدم مخوّل من المدرسة.", enDesc: "Assign it to an authorized school user." },
  { icon: CalendarClock, ar: "الموعد والمتابعة", en: "Due date & follow-up", arDesc: "تحديد تاريخ الاستحقاق ونقاط المتابعة.", enDesc: "Set the due date and follow-up checkpoints." },
  { icon: FileCheck2, ar: "التنفيذ والشاهد", en: "Execution & evidence", arDesc: "إرفاق ما يثبت التنفيذ بعد تفعيل مكتبة الملفات.", enDesc: "Attach proof of completion when the file library is connected." },
  { icon: ShieldCheck, ar: "المراجعة والإغلاق", en: "Review & closure", arDesc: "مراجعة الإنجاز ثم الإغلاق أو إعادة المهمة.", enDesc: "Review completion, then close or return the task." },
];

export function PrincipalAssignmentsCenter() {
  const { isAr } = useLang();
  return <div>
    <PageHead icon={ClipboardCheck} eyebrow="RAVEN OS · PRINCIPAL · 1.3"
      title={isAr ? "مركز التكليفات والمهام" : "Assignments & Tasks Center"}
      description={isAr ? "مساحة موحدة لتكليف فرق العمل ومتابعة التنفيذ وربط الإنجاز بالشواهد والقرارات." : "A unified workspace for assigning teams, tracking execution, and connecting completion to evidence and decisions."} />
    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-300/70 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
      <AlertCircle className="mt-1 shrink-0" size={18}/>
      <p>{isAr ? "الواجهة قيد التجهيز. لم يتم ربط المستخدمين أو المهام بقاعدة بيانات وصلاحيات خادمية؛ لذلك لا يمكن إنشاء تكليف أو إرساله أو اعتماده في هذه النسخة." : "This interface is being prepared. Users, tasks, and server-side permissions are not connected; creating, sending, or approving assignments is unavailable in this build."}</p>
    </div>
    <SectionCard title={isAr ? "دورة التكليف" : "Assignment lifecycle"} description={isAr ? "تسلسل العمل المستهدف قبل تفعيل الإجراءات." : "The intended workflow before actions are enabled."}>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {stages.map(({icon: Icon, ar, en, arDesc, enDesc}, index) => <article key={ar} className="rounded-2xl border border-black/10 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#08794F]/10 text-[#08794F]"><Icon size={19}/></span>
            <span className="text-xs font-extrabold text-[#9A8A62]">{String(index + 1).padStart(2, "0")}</span>
          </div>
          <h2 className="font-extrabold text-[#111A18]">{isAr ? ar : en}</h2>
          <p className="mt-2 text-xs leading-6 text-[#66736e]">{isAr ? arDesc : enDesc}</p>
        </article>)}
      </div>
    </SectionCard>
    <div className="mt-5 grid gap-4 lg:grid-cols-2">
      <SectionCard title={isAr ? "تصنيفات التكليفات المستهدفة" : "Planned assignment categories"} description={isAr ? "تصنيف يساعد على تنظيم المهام عند ربطها تشغيليًا." : "Categories to organize tasks once operationally connected."}>
        <ul className="space-y-3 text-sm text-[#35423d]">
          <li className="flex items-center gap-3"><ListChecks size={17} className="text-[#08794F]"/>{isAr ? "مهام تشغيلية وإدارية" : "Operational and administrative tasks"}</li>
          <li className="flex items-center gap-3"><MessageSquareText size={17} className="text-[#08794F]"/>{isAr ? "متابعات وتوجيهات" : "Follow-ups and directions"}</li>
          <li className="flex items-center gap-3"><FileCheck2 size={17} className="text-[#08794F]"/>{isAr ? "شواهد وإنجازات" : "Evidence and achievements"}</li>
          <li className="flex items-center gap-3"><BellRing size={17} className="text-[#08794F]"/>{isAr ? "تنبيهات ومواعيد استحقاق" : "Alerts and due dates"}</li>
        </ul>
      </SectionCard>
      <SectionCard title={isAr ? "ضوابط الحوكمة" : "Governance controls"} description={isAr ? "متطلبات يجب تحققها قبل إطلاق التكليفات." : "Requirements to verify before assignments go live."}>
        <ul className="space-y-3 text-sm leading-6 text-[#35423d]">
          <li>{isAr ? "التحقق من هوية المكلف وصلاحية مدير المدرسة." : "Verify assignee identity and principal permissions."}</li>
          <li>{isAr ? "عزل مهام كل مدرسة وعدم إظهارها لمدرسة أخرى." : "Isolate each school's tasks from every other school."}</li>
          <li>{isAr ? "تسجيل تاريخ الإنشاء والتعديل والاعتماد في سجل تدقيق." : "Record creation, edits, and approvals in an audit log."}</li>
          <li>{isAr ? "ربط الشاهد بالمهمة دون إنشاء سجل إنجاز وهمي." : "Link evidence to the task without fabricating completion."}</li>
        </ul>
      </SectionCard>
    </div>
    <SectionCard title={isAr ? "قائمة التكليفات" : "Assignments list"} description={isAr ? "ستظهر هنا المهام الفعلية بعد ربط قاعدة البيانات." : "Real assignments will appear here after the database is connected."}>
      <EmptyState title={isAr ? "لا توجد تكليفات متصلة" : "No connected assignments"} description={isAr ? "لا توجد سجلات افتراضية في هذه الصفحة. ستتوفر أدوات الإنشاء والبحث والتصفية والمتابعة والاعتماد بعد بناء الخدمة وربط الصلاحيات." : "No sample records are shown. Creation, search, filters, follow-up, and approval tools will be enabled after the service and permissions are implemented."}/>
    </SectionCard>
  </div>;
}
