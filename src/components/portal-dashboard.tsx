"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, ArrowRight, type LucideIcon } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { PORTAL_META, PORTAL_NAVS, type PortalId } from "@/lib/nav";
import { PortalShell } from "@/components/portal-shell";

const COPY: Record<PortalId,{ar:string;en:string;noteAr:string;noteEn:string}> = {
 platform:{ar:"إدارة مركزية تحافظ على حوكمة المنظومة وتكامل مدارسها.",en:"Central administration for platform governance and school operations.",noteAr:"لا توجد بيانات مدارس متصلة في هذه النسخة.",noteEn:"No school records are connected in this build."},
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
 const {isAr}=useLang(); const meta=PORTAL_META[portal]; const copy=COPY[portal]; const groups=PORTAL_NAVS[portal];
 return <PortalShell portal={portal}>
  <section className="mb-7 rounded-3xl bg-[#111A18] p-6 text-white md:p-8">
   <div className="mb-3 text-xs font-extrabold tracking-widest text-[#D4AF37]">RAVEN OS · {portal.toUpperCase()}</div>
   <h1 className="text-2xl font-black md:text-3xl">{isAr?meta.ar:meta.en}</h1>
   <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">{isAr?copy.ar:copy.en}</p>
   <div className="mt-5 inline-flex items-start gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs leading-6 text-white/80">
    <AlertCircle size={16} className="mt-1 shrink-0 text-[#D4AF37]"/><span>{isAr?copy.noteAr:copy.noteEn}</span>
   </div>
  </section>
  <div className="mb-6 flex items-center justify-between gap-3">
   <div><h2 className="text-lg font-black text-[#111A18]">{isAr?"مراكز وأقسام البوابة":"Portal centers & sections"}</h2><p className="mt-1 text-xs text-[#66736e]">{isAr?"خريطة تنقل منظمة — لا تعني أن العمليات الخلفية مفعّلة":"Organized navigation — backend operations are not implied"}</p></div>
   <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-bold text-[#66736e]">{groups.reduce((n,g)=>n+g.items.length,0)} {isAr?"قسم":"sections"}</span>
  </div>
  <div className="space-y-7">{groups.map(group=><section key={group.ar}>
   <div className="mb-3 flex items-center gap-3"><h3 className="text-sm font-extrabold text-[#08794F]">{isAr?group.ar:group.en}</h3><span className="h-px flex-1 bg-black/10"/></div>
   <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{group.items.map(item=><Tile key={item.to} to={item.to} ar={item.ar} en={item.en} Icon={item.icon} isAr={isAr}/>)}</div>
  </section>)}</div>
 </PortalShell>;
}
