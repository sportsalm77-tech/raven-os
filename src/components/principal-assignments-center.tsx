"use client";

import { useState } from "react";
import Link from "next/link";
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
  const [reviewed,setReviewed] = useState<string[]>([]);
  const [showRequirements,setShowRequirements] = useState(false);
  const requirements = [
    {id:"identity",ar:"هوية موثقة لمدير المدرسة والمكلف",en:"Verified principal and assignee identity"},
    {id:"tenant",ar:"تحقق خادمي من المدرسة وعزل school_id",en:"Server-side school scope and school_id isolation"},
    {id:"audit",ar:"سجل تدقيق دائم للإنشاء والتعديل والإغلاق",en:"Durable audit trail for creation, changes, and closure"},
    {id:"storage",ar:"حفظ خادمي معتمد للتكليف والشواهد",en:"Approved server persistence for assignments and evidence"},
  ];
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
    <section className="my-5 rounded-2xl border border-[#08794F]/20 bg-white p-5" aria-label={isAr?"فحص جاهزية التكليفات":"Assignment readiness review"}>
      <h2 className="text-lg font-black text-[#111A18]">{isAr?"فحص جاهزية التفعيل":"Activation readiness review"}</h2>
      <p className="mt-2 text-sm leading-7 text-[#53615b]">{isAr?"قائمة مراجعة محلية للتخطيط فقط. تحديد أي بند لا يثبت تطبيقه ولا يفعّل الخدمة ولا يُحفظ بعد مغادرة الصفحة.":"A local planning checklist only. Checking an item does not verify implementation, enable the service, or persist after leaving this page."}</p>
      <button type="button" onClick={()=>setShowRequirements(value=>!value)} aria-expanded={showRequirements} className="mt-4 rounded-xl border border-[#08794F] px-4 py-2 text-sm font-bold text-[#08794F]">{showRequirements?(isAr?"إخفاء متطلبات التفعيل":"Hide requirements"):(isAr?"مراجعة متطلبات التفعيل":"Review activation requirements")}</button>
      {showRequirements&&<div className="mt-4 space-y-3">{requirements.map(item=><label key={item.id} className="flex items-start gap-3 rounded-xl border border-black/10 p-3 text-sm"><input type="checkbox" checked={reviewed.includes(item.id)} onChange={event=>setReviewed(current=>event.target.checked?[...current,item.id]:current.filter(id=>id!==item.id))} className="mt-1 accent-[#08794F]"/><span>{isAr?item.ar:item.en}</span></label>)}<p role="status" className="text-xs font-bold text-[#53615b]">{isAr?`بنود تمت مراجعتها محليًا: ${reviewed.length} من ${requirements.length} — لا يعني ذلك جاهزية تشغيلية.`:`Locally reviewed: ${reviewed.length} of ${requirements.length} — this does not imply operational readiness.`}</p><button type="button" onClick={()=>setReviewed([])} className="text-sm font-bold text-[#08794F] underline">{isAr?"إعادة تعيين المراجعة":"Reset review"}</button></div>}
      <div className="mt-5 flex flex-wrap gap-3"><Link href="/principal/decision-center" className="rounded-xl bg-[#08794F] px-4 py-2 text-sm font-bold text-white">{isAr?"مركز القرارات":"Decision center"}</Link><Link href="/principal/operational-plan" className="rounded-xl border border-black/15 px-4 py-2 text-sm font-bold">{isAr?"مركز الخطة التشغيلية":"Operational plan"}</Link><Link href="/principal/impact" className="rounded-xl border border-black/15 px-4 py-2 text-sm font-bold">{isAr?"قياس الأثر":"Impact measurement"}</Link></div>
    </section>
    <SectionCard title={isAr ? "قائمة التكليفات" : "Assignments list"} description={isAr ? "ستظهر هنا المهام الفعلية بعد ربط قاعدة البيانات." : "Real assignments will appear here after the database is connected."}>
      <EmptyState title={isAr ? "لا توجد تكليفات متصلة" : "No connected assignments"} description={isAr ? "لا توجد سجلات افتراضية في هذه الصفحة. ستتوفر أدوات الإنشاء والبحث والتصفية والمتابعة والاعتماد بعد بناء الخدمة وربط الصلاحيات." : "No sample records are shown. Creation, search, filters, follow-up, and approval tools will be enabled after the service and permissions are implemented."}/>
    </SectionCard>
  </div>;
}
