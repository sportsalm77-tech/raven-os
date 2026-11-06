"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, ArrowRight, type LucideIcon, Building2, Users, ShieldCheck, HeartPulse, Settings2, LockKeyhole, GitBranch, ClipboardList, Cpu } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { PORTAL_META, PORTAL_NAVS, type PortalId } from "@/lib/nav";
import { PortalShell } from "@/components/portal-shell";
import { PortalOverviewPanels } from "@/components/portal-overview-panels";
import { PlatformCommandCenter } from "@/components/platform-command-center";

const COPY: Record<PortalId,{ar:string;en:string;noteAr:string;noteEn:string}> = {
 platform:{ar:"مركز الحوكمة والإدارة المركزية لمنظومة رافين ومدارسها، مع فصل واضح بين إدارة المنصة وإدارة كل مدرسة.",en:"The central governance workspace for Raven OS and its schools, with a clear boundary between platform administration and each school.",noteAr:"هذه النسخة لا تتصل بعد بمصدر المدارس أو الهوية أو سجل التدقيق. لا توجد سجلات تشغيلية أو أرقام افتراضية.",noteEn:"This build is not yet connected to school, identity, or audit services. No operational records or fabricated metrics are shown."},
 principal:{ar:"من مساحة واحدة تنتقل من التخطيط إلى التكليف والمتابعة والشواهد والتحسين.",en:"Move from planning to assignments, follow-up, evidence, and improvement in one workspace.",noteAr:"ابدأ من مركز المعلومات المدرسية بعد ربط مصدر بيانات المدرسة.",noteEn:"Start with the School Information Center once a school data source is connected."},
 teacher:{ar:"مساحة عمل منظمة لمهام المعلم وتنفيذها ومتابعة أثرها.",en:"An organized workspace for teacher tasks, execution, and impact follow-up.",noteAr:"لا توجد بيانات صفوف أو تكليفات متصلة حتى الآن.",noteEn:"No classes or assignments are connected yet."},
 family:{ar:"قناة واضحة وآمنة لمتابعة الأبناء والتواصل مع المدرسة.",en:"A clear, secure channel for following up with children and communicating with school.",noteAr:"لن تظهر بيانات أبناء قبل تفعيل ربط ولي الأمر والتحقق من العلاقة.",noteEn:"Child records remain hidden until guardian linking and relationship verification are active."},
};
const PLATFORM_AREAS = [
 {to:"/platform/schools",ar:"حوكمة المدارس",en:"School governance",detailAr:"دورة حياة المدرسة، ملفها، التفعيل، والربط مع مديرها مع فرض عزل school_id.",detailEn:"School lifecycle, profile, activation, principal assignment, and school_id isolation.",icon:Building2},
 {to:"/platform/users",ar:"الهويات وإدارة المستخدمين",en:"Identity & users",detailAr:"الدعوات وربط الهوية بالمدرسة ومراجعة حالة الحساب دون إنشاء صلاحية من الواجهة.",detailEn:"Invitations, school identity links, and account review without granting access from the UI.",icon:Users},
 {to:"/platform/roles",ar:"حوكمة الأدوار والصلاحيات",en:"Roles & permissions",detailAr:"مبدأ أقل صلاحية، فصل مسؤوليات المنصة والمدرسة، والمنع الافتراضي حتى التحقق.",detailEn:"Least privilege, platform/school separation, and deny-by-default enforcement.",icon:ShieldCheck},
 {to:"/platform/security",ar:"الأمن وصحة النظام",en:"Security & system health",detailAr:"مصادر المراقبة وسجلات الأحداث والحوادث والتحديثات بعد ربطها فعليًا.",detailEn:"Monitoring sources, event logs, incidents, and updates once genuinely connected.",icon:HeartPulse},
 {to:"/platform/settings",ar:"الإعدادات العامة",en:"Global settings",detailAr:"إعدادات الهوية واللغة والجلسات والإشعارات ضمن مسار تغيير موثق.",detailEn:"Brand, locale, session, and notification settings under documented change control.",icon:Settings2},
];
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
  {portal === "platform" ? <PlatformCommandCenter /> : <>
  <section className="mb-7 rounded-3xl bg-[#111A18] p-6 text-white md:p-8">
   <div className="mb-3 text-xs font-extrabold tracking-widest text-[#D4AF37]">RAVEN OS · {portal.toUpperCase()}</div>
   <h1 className="text-2xl font-black md:text-3xl">{isAr?meta.ar:meta.en}</h1>
   <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">{isAr?copy.ar:copy.en}</p>
   <div className="mt-5 inline-flex items-start gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs leading-6 text-white/80">
    <AlertCircle size={16} className="mt-1 shrink-0 text-[#D4AF37]"/><span>{isAr?copy.noteAr:copy.noteEn}</span>
   </div>
  </section>
  <PortalOverviewPanels portal={portal} />
  {portal==="platform" && <>
   <section className="mb-7 rounded-2xl border border-[#08794F]/15 bg-white p-5 md:p-6">
    <div className="mb-4 flex items-center gap-2"><LockKeyhole size={18} className="text-[#08794F]"/><h2 className="font-black text-[#111A18]">{isAr?"نطاق مسؤولية مدير المنصة":"Platform administrator boundary"}</h2></div>
    <div className="grid gap-3 md:grid-cols-3">
     <div className="rounded-xl bg-[#F5F3EC] p-4"><GitBranch size={18} className="mb-2 text-[#08794F]"/><strong className="block text-sm">{isAr?"حوكمة مركزية":"Central governance"}</strong><p className="mt-2 text-xs leading-6 text-[#66736e]">{isAr?"إدارة المدارس والهوية والسياسات العامة على مستوى المنظومة.":"Manage schools, identity, and global policies at platform level."}</p></div>
     <div className="rounded-xl bg-[#F5F3EC] p-4"><ShieldCheck size={18} className="mb-2 text-[#08794F]"/><strong className="block text-sm">{isAr?"فصل الصلاحيات":"Permission boundaries"}</strong><p className="mt-2 text-xs leading-6 text-[#66736e]">{isAr?"لا تمنح واجهة المستخدم صلاحيات؛ القرار يجب أن يُفرض خادميًا.":"The interface never grants access; authorization must be enforced server-side."}</p></div>
     <div className="rounded-xl bg-[#F5F3EC] p-4"><ClipboardList size={18} className="mb-2 text-[#08794F]"/><strong className="block text-sm">{isAr?"حوكمة التغيير":"Change governance"}</strong><p className="mt-2 text-xs leading-6 text-[#66736e]">{isAr?"كل تغيير حساس يحتاج مصدرًا وصاحب صلاحية وسجل تدقيق.":"Sensitive changes require a source, authorized actor, and audit trail."}</p></div>
    </div>
   </section>
   <section className="mb-8">
    <div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-lg font-black text-[#111A18]">{isAr?"مجالات الإدارة الخمسة":"Five administration domains"}</h2><span className="rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-bold text-[#66736e]">5 {isAr?"مجالات":"domains"}</span></div>
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{PLATFORM_AREAS.map(area=><Link key={area.to} href={area.to} className="rounded-2xl border border-black/10 bg-white p-5 transition hover:border-[#08794F]/40 hover:shadow-sm"><div className="mb-3 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#08794F]/10 text-[#08794F]"><area.icon size={19}/></span><strong className="text-sm text-[#111A18]">{isAr?area.ar:area.en}</strong></div><p className="text-xs leading-6 text-[#66736e]">{isAr?area.detailAr:area.detailEn}</p><span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#08794F]">{isAr?"استعراض المجال":"Review domain"} {isAr?<ArrowLeft size={14}/>:<ArrowRight size={14}/>}</span></Link>)}</div>
   </section>
   <Link href="/platform/engines" className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-[#08794F]/20 bg-[#08794F]/5 p-5 transition hover:border-[#08794F]/50 hover:bg-[#08794F]/10">
    <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-[#08794F]"><Cpu size={21}/></span><div><strong className="block text-sm text-[#111A18]">{isAr?"مركز المحركات الذكية":"Intelligent Engines Center"}</strong><p className="mt-1 text-xs leading-5 text-[#66736e]">{isAr?"إدارة السجل المعماري للمحركات الخمسة عشر ومتابعة حالة التأسيس والتفعيل.":"Review the fifteen-engine architecture registry and its implementation readiness."}</p></div></div>
    <span className="shrink-0 text-xs font-bold text-[#08794F]">{isAr?"فتح المركز":"Open center"} {isAr?<ArrowLeft size={14} className="inline"/>:<ArrowRight size={14} className="inline"/>}</span>
   </Link>
  </>}
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
