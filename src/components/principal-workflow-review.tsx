"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/lib/i18n";

type WorkflowKey = "decisions" | "planning" | "impact";
const CONFIG: Record<WorkflowKey, {
  titleAr: string; titleEn: string;
  stepsAr: string[]; stepsEn: string[];
  links: {href: string; ar: string; en: string}[];
}> = {
  decisions: {
    titleAr: "دليل مراجعة القرار الإداري", titleEn: "Administrative decision review guide",
    stepsAr: ["تحديد الغرض والجهة صاحبة الاختصاص", "مراجعة ارتباط القرار بالخطة", "تحديد المسؤول وآلية المتابعة", "تحديد الشواهد ومسار الإغلاق"],
    stepsEn: ["Define purpose and authorized owner", "Review links to the plan", "Identify accountable owner and follow-up", "Define evidence and closure path"],
    links: [{href:"/principal/assignments",ar:"التكليفات",en:"Assignments"},{href:"/principal/operational-plan",ar:"الخطة التشغيلية",en:"Operational plan"}],
  },
  planning: {
    titleAr: "دليل مراجعة الخطة التشغيلية", titleEn: "Operational plan review guide",
    stepsAr: ["تحديد الهدف والمصدر المعتمد", "تحديد المبادرة أو البرنامج والمؤشر", "مراجعة ارتباط الإجراءات والتكليفات", "تحديد الشواهد ودورية قياس الأثر"],
    stepsEn: ["Define objective and approved source", "Define initiative, program and indicator", "Review action and assignment references", "Define evidence and impact review cadence"],
    links: [{href:"/principal/decision-center",ar:"القرارات",en:"Decisions"},{href:"/principal/impact",ar:"قياس الأثر",en:"Impact measurement"}],
  },
  impact: {
    titleAr: "دليل مراجعة قياس الأثر", titleEn: "Impact measurement review guide",
    stepsAr: ["تعريف المؤشر ووحدة القياس", "تحديد الفترة والمصدر الموثوق", "التحقق من الشواهد والاعتماد", "توثيق الاستنتاج وفرصة التحسين"],
    stepsEn: ["Define indicator and unit", "Identify period and trusted source", "Validate evidence and approval", "Document interpretation and improvement opportunity"],
    links: [{href:"/principal/operational-plan",ar:"الخطة التشغيلية",en:"Operational plan"},{href:"/principal/assignments",ar:"التكليفات",en:"Assignments"}],
  },
};

export function PrincipalWorkflowReview({kind}:{kind:WorkflowKey}) {
  const {isAr}=useLang();
  const [checked,setChecked]=useState<number[]>([]);
  const config=CONFIG[kind];
  const steps=isAr?config.stepsAr:config.stepsEn;
  return <section aria-label={isAr?config.titleAr:config.titleEn} className="rounded-2xl border border-[#08794F]/20 bg-white p-5 md:p-6">
    <h2 className="text-lg font-black text-[#111A18]">{isAr?config.titleAr:config.titleEn}</h2>
    <p className="mt-2 text-xs leading-6 text-[#53615b]">{isAr?"أداة مراجعة محلية للتخطيط فقط؛ لا تنشئ سجلات ولا تحفظ أو تعتمد إجراءات، ولا تثبت جاهزية التشغيل.":"Local planning review only. It does not create, persist, approve, or verify operational records."}</p>
    <div className="mt-4 grid gap-3 md:grid-cols-2">{steps.map((step,index)=><label key={index} className="flex items-start gap-3 rounded-xl border border-black/10 p-3 text-sm leading-6">
      <input type="checkbox" checked={checked.includes(index)} onChange={event=>setChecked(current=>event.target.checked?[...current,index]:current.filter(value=>value!==index))} className="mt-1 accent-[#08794F]"/>
      <span>{step}</span>
    </label>)}</div>
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <p role="status" className="text-xs font-bold text-[#53615b]">{isAr?`مراجعة محلية: ${checked.length} من ${steps.length} — ليست اعتمادًا.`:`Local review: ${checked.length} of ${steps.length} — not an approval.`}</p>
      <button type="button" onClick={()=>setChecked([])} className="rounded-lg border border-black/15 px-3 py-2 text-xs font-bold text-[#08794F]">{isAr?"إعادة تعيين":"Reset"}</button>
    </div>
    <div className="mt-5 flex flex-wrap gap-3">{config.links.map(link=><Link key={link.href} href={link.href} className="rounded-xl bg-[#08794F]/10 px-4 py-2 text-xs font-bold text-[#08794F] hover:bg-[#08794F]/20">{isAr?link.ar:link.en}</Link>)}</div>
  </section>;
}
