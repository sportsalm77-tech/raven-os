"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import type { PortalId } from "@/lib/nav";

const GATES = [
  {id:"identity",ar:"هوية وجلسة موثقتان",en:"Verified identity and session"},
  {id:"tenant",ar:"عزل school_id على الخادم",en:"Server-enforced school_id isolation"},
  {id:"permissions",ar:"صلاحيات الدور ونطاق السجل",en:"Role and record-level permissions"},
  {id:"data",ar:"مصدر بيانات موثوق وحفظ دائم",en:"Trusted data source and durable persistence"},
  {id:"audit",ar:"تدقيق دائم واختبارات قبول",en:"Durable audit and acceptance tests"},
] as const;
const EXTRA:Record<PortalId,{ar:string;en:string}>={
  platform:{ar:"بيانات مؤسسية مجمعة دون كشف سجلات الطلاب الفردية.",en:"Institutional aggregates without exposing individual student records."},
  principal:{ar:"لا اعتماد لقرار أو تكليف قبل التحقق الخادمي وسجل التدقيق.",en:"No decision or assignment approval without server checks and audit."},
  teacher:{ar:"الفصول والطلاب محصورون في إسناد المعلم الموثق.",en:"Classes and students are limited to verified teacher assignments."},
  family:{ar:"يجب إثبات علاقة ولي الأمر بكل طفل قبل قراءة أي سجل.",en:"Guardian relationship to each child must be verified before reading records."},
};
export function PortalReadinessPanel({portal}:{portal:PortalId}) {
  const {isAr}=useLang();
  const [expanded,setExpanded]=useState(false);
  return <section aria-label={isAr?"متطلبات التفعيل التشغيلي":"Operational activation requirements"} className="mt-7 rounded-2xl border border-amber-300/70 bg-white p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><h2 className="text-sm font-black text-[#111A18]">{isAr?"بوابة التحقق قبل التشغيل":"Pre-launch verification gate"}</h2>
      <p className="mt-2 text-xs leading-6 text-[#53615b]">{isAr?"الواجهة قيد التطوير، ولا يُعد وجود هذه المتطلبات دليلًا على تحققها.":"The interface is in development. Listing these requirements does not mean they have passed."}</p></div>
      <button type="button" aria-expanded={expanded} onClick={()=>setExpanded(v=>!v)} className="rounded-xl border border-[#08794F] px-4 py-2 text-xs font-bold text-[#08794F]">{expanded?(isAr?"إخفاء الضوابط":"Hide safeguards"):(isAr?"عرض ضوابط التشغيل":"Show safeguards")}</button>
    </div>
    {expanded&&<div className="mt-4">
      <p className="mb-3 rounded-xl bg-[#F5F3EC] p-3 text-xs leading-6 text-[#15445A]">{isAr?EXTRA[portal].ar:EXTRA[portal].en}</p>
      <ol className="grid gap-2 md:grid-cols-2">{GATES.map((gate,index)=><li key={gate.id} className="flex items-start gap-3 rounded-xl border border-black/10 p-3 text-xs leading-6"><span className="shrink-0 font-black text-amber-700">{index+1}.</span><span>{isAr?gate.ar:gate.en}</span><span className="ms-auto shrink-0 font-bold text-amber-800">{isAr?"غير متحقق هنا":"Not verified here"}</span></li>)}</ol>
      <p className="mt-3 text-xs leading-6 text-[#53615b]">{isAr?"لا تدخل بيانات حقيقية قبل استكمال اختبارات الأمان والربط والتفويض.":"Do not enter real data before security, integration, and authorization acceptance."}</p>
    </div>}
  </section>;
}
