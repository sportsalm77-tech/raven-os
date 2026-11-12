"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, type LucideIcon } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { PORTAL_META, PORTAL_NAVS, type PortalId } from "@/lib/nav";
import { PortalSandbox } from "@/components/portal-sandbox";
import { PortalShell } from "@/components/portal-shell";
import { PortalOverviewPanels } from "@/components/portal-overview-panels";
import { PlatformCommandCenter } from "@/components/platform-command-center";
import { TeacherPortalHome } from "@/components/teacher-portal-workspace";

const COPY: Record<PortalId,{ar:string;en:string;noteAr:string;noteEn:string}> = {
 platform:{ar:"مركز الحوكمة والإدارة المركزية لمنظومة رافين ومدارسها، مع فصل واضح بين إدارة المنصة وإدارة كل مدرسة.",en:"The central governance workspace for Raven OS and its schools, with a clear boundary between platform administration and each school.",noteAr:"هذه النسخة لا تتصل بعد بمصدر المدارس أو الهوية أو سجل التدقيق. لا توجد سجلات تشغيلية أو أرقام افتراضية.",noteEn:"This build is not yet connected to school, identity, or audit services. No operational records or fabricated metrics are shown."},
 principal:{ar:"من مساحة واحدة تنتقل من التخطيط إلى التكليف والمتابعة والشواهد والتحسين.",en:"Move from planning to assignments, follow-up, evidence, and improvement in one workspace.",noteAr:"ابدأ من مركز المعلومات المدرسية بعد ربط مصدر بيانات المدرسة.",noteEn:"Start with the School Information Center once a school data source is connected."},
 teacher:{ar:"مساحة عمل منظمة لمهام المعلم وتنفيذها ومتابعة أثرها.",en:"An organized workspace for teacher tasks, execution, and impact follow-up.",noteAr:"لا توجد بيانات صفوف أو تكليفات متصلة حتى الآن.",noteEn:"No classes or assignments are connected yet."},
 family:{ar:"قناة واضحة وآمنة لمتابعة الأبناء والتواصل مع المدرسة.",en:"A clear, secure channel for following up with children and communicating with school.",noteAr:"لن تظهر بيانات أبناء قبل تفعيل ربط ولي الأمر والتحقق من العلاقة.",noteEn:"Child records remain hidden until guardian linking and relationship verification are active."},
};
function Tile({to,ar,en,Icon,isAr}:{to:string;ar:string;en:string;Icon:LucideIcon;isAr:boolean}) {
 return <Link href={to} className="group flex min-h-36 flex-col rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#08794F]/40 hover:shadow-md">
  <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-[#08794F]/10 text-[#08794F]"><Icon size={19}/></span>
  <strong className="text-sm text-[#111A18]">{isAr?ar:en}</strong>
  <span className="mt-auto flex items-center gap-2 pt-4 text-xs font-bold text-[#08794F]">{isAr?"فتح القسم":"Open section"} {isAr?<ArrowLeft size={14}/>:<ArrowRight size={14}/>}</span>
 </Link>;
}
export function PortalDashboard({portal}:{portal:PortalId}) {
 const {isAr}=useLang(); const [sectionQuery,setSectionQuery]=useState(""); const meta=PORTAL_META[portal]; const copy=COPY[portal]; const groups=PORTAL_NAVS[portal];
 const normalizedQuery=sectionQuery.trim().toLocaleLowerCase();
 const visibleGroups=groups.map(group=>({...group,items:group.items.filter(item=>`${item.ar} ${item.en} ${group.ar} ${group.en}`.toLocaleLowerCase().includes(normalizedQuery))})).filter(group=>group.items.length>0);
 return <PortalShell portal={portal}>
  {process.env.NEXT_PUBLIC_RAVEN_DEMO_ENABLED === "true" && <PortalSandbox portal={portal} />}
  {portal === "platform" ? <PlatformCommandCenter /> : portal === "teacher" ? <TeacherPortalHome /> : <>
  <section className="mb-7 rounded-3xl bg-[#111A18] p-6 text-white md:p-8">
   <div className="mb-3 text-xs font-extrabold tracking-widest text-[#D4AF37]">RAVEN OS · {portal.toUpperCase()}</div>
   <h1 className="text-2xl font-black md:text-3xl">{isAr?meta.ar:meta.en}</h1>
   <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">{isAr?copy.ar:copy.en}</p>
   <div className="mt-5 inline-flex items-start gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs leading-6 text-white/80">
    <AlertCircle size={16} className="mt-1 shrink-0 text-[#D4AF37]"/><span>{isAr?copy.noteAr:copy.noteEn}</span>
   </div>
  </section>
  <PortalOverviewPanels portal={portal} />
  <div className="mb-6 flex items-center justify-between gap-3">
   <div><h2 className="text-lg font-black text-[#111A18]">{isAr?"مراكز وأقسام البوابة":"Portal centers & sections"}</h2><p className="mt-1 text-xs text-[#66736e]">{isAr?"خريطة تنقل منظمة — لا تعني أن العمليات الخلفية مفعّلة":"Organized navigation — backend operations are not implied"}</p></div>
   <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-bold text-[#66736e]">{groups.reduce((n,g)=>n+g.items.length,0)} {isAr?"قسم":"sections"}</span>
  </div>
  <label className="mb-5 block max-w-xl text-xs font-bold text-[#53615b]"><span className="mb-2 block">{isAr?"البحث في جميع أقسام البوابة":"Search all portal sections"}</span><input type="search" value={sectionQuery} onChange={event=>setSectionQuery(event.target.value)} aria-label={isAr?"البحث في جميع أقسام البوابة":"Search all portal sections"} placeholder={isAr?"اسم القسم أو المجموعة...":"Section or group name..."} className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#08794F]"/></label>
  {visibleGroups.length===0&&<p role="status" className="mb-5 rounded-xl border border-black/10 bg-white p-4 text-sm text-[#53615b]">{isAr?"لا توجد أقسام مطابقة للبحث.":"No portal sections match your search."}</p>}
  <div className="space-y-7">{visibleGroups.map(group=><section key={group.ar}>
   <div className="mb-3 flex items-center gap-3"><h3 className="text-sm font-extrabold text-[#08794F]">{isAr?group.ar:group.en}</h3><span className="h-px flex-1 bg-black/10"/></div>
   <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{group.items.map(item=><Tile key={item.to} to={item.to} ar={item.ar} en={item.en} Icon={item.icon} isAr={isAr}/>)}</div>
  </section>)}</div>
  </>}
 </PortalShell>;
}
