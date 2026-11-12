"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/lib/i18n";

type LinkItem = {href:string; ar:string; en:string};
const LINKS: Record<string,LinkItem[]> = {
  teachers: [{href:"/principal/assignments",ar:"التكليفات",en:"Assignments"},{href:"/principal/timetable",ar:"الجدول المدرسي",en:"Timetable"}],
  students: [{href:"/principal/classes",ar:"الفصول",en:"Classes"},{href:"/principal/behavior/absence",ar:"الغياب",en:"Absence"}],
  grades: [{href:"/principal/exams/control",ar:"لجان الاختبارات",en:"Exam control"},{href:"/principal/reports",ar:"التقارير",en:"Reports"}],
  "exam-control": [{href:"/principal/exams/grades",ar:"الدرجات",en:"Grades"},{href:"/principal/assignments",ar:"التكليفات",en:"Assignments"}],
  absence: [{href:"/principal/students",ar:"شؤون الطلاب",en:"Student affairs"},{href:"/principal/reports",ar:"التقارير",en:"Reports"}],
  violations: [{href:"/principal/behavior/positive",ar:"السلوك الإيجابي",en:"Positive behavior"},{href:"/principal/students",ar:"شؤون الطلاب",en:"Student affairs"}],
  positive: [{href:"/principal/behavior/violations",ar:"الملاحظات السلوكية",en:"Behavior observations"},{href:"/principal/impact",ar:"قياس الأثر",en:"Impact"}],
  library: [{href:"/principal/impact",ar:"قياس الأثر",en:"Impact"},{href:"/principal/operational-plan",ar:"الخطة التشغيلية",en:"Operational plan"}],
  timetable: [{href:"/principal/teachers",ar:"شؤون المعلمين",en:"Teacher affairs"},{href:"/principal/classes",ar:"الفصول",en:"Classes"}],
  health: [{href:"/principal/students",ar:"شؤون الطلاب",en:"Student affairs"},{href:"/principal/reports",ar:"التقارير",en:"Reports"}],
  activities: [{href:"/principal/operational-plan",ar:"الخطة التشغيلية",en:"Operational plan"},{href:"/principal/impact",ar:"قياس الأثر",en:"Impact"}],
  talented: [{href:"/principal/activities",ar:"الأنشطة",en:"Activities"},{href:"/principal/impact",ar:"قياس الأثر",en:"Impact"}],
  "special-ed": [{href:"/principal/students",ar:"شؤون الطلاب",en:"Student affairs"},{href:"/principal/teachers",ar:"شؤون المعلمين",en:"Teacher affairs"}],
  resources: [{href:"/principal/labs",ar:"المختبرات",en:"Labs"},{href:"/principal/operational-plan",ar:"الخطة التشغيلية",en:"Operational plan"}],
  labs: [{href:"/principal/resources",ar:"مصادر التعلم",en:"Learning resources"},{href:"/principal/activities",ar:"الأنشطة",en:"Activities"}],
  noor: [{href:"/principal/info-center",ar:"مركز المعلومات",en:"Information center"}],
  madrasati: [{href:"/principal/info-center",ar:"مركز المعلومات",en:"Information center"}],
  hudori: [{href:"/principal/info-center",ar:"مركز المعلومات",en:"Information center"}],
  assistant: [{href:"/principal/decision-center",ar:"القرارات",en:"Decisions"},{href:"/principal/operational-plan",ar:"الخطة التشغيلية",en:"Operational plan"}],
};
export function PrincipalAreaConnections({area}:{area:string}) {
  const {isAr}=useLang();
  const [show,setShow]=useState(true);
  const links=LINKS[area]??[];
  if(!links.length)return null;
  return <section className="rounded-2xl border border-[#08794F]/20 bg-white p-5" aria-label={isAr?"المسارات المرتبطة":"Related workflows"}>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-lg font-black text-[#111A18]">{isAr?"المسارات المرتبطة":"Related workflows"}</h2><p className="mt-1 text-xs leading-6 text-[#53615b]">{isAr?"روابط انتقال بين الأقسام فقط؛ لا تعني مشاركة سجلات أو تفعيل تكاملات.":"Navigation links only; no records are shared and no integrations are activated."}</p></div>
      <button type="button" aria-expanded={show} onClick={()=>setShow(v=>!v)} className="rounded-xl border border-black/15 px-3 py-2 text-xs font-bold text-[#08794F]">{show?(isAr?"إخفاء المسارات":"Hide workflows"):(isAr?"إظهار المسارات":"Show workflows")}</button>
    </div>
    {show&&<nav aria-label={isAr?"روابط الأقسام المرتبطة":"Related section links"} className="mt-4 flex flex-wrap gap-3">{links.map(link=><Link key={link.href} href={link.href} className="rounded-xl bg-[#08794F]/10 px-4 py-2 text-sm font-bold text-[#08794F] hover:bg-[#08794F]/20">{isAr?link.ar:link.en}</Link>)}</nav>}
  </section>;
}
