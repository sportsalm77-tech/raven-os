"use client";

import Link from "next/link";
import { PortalExecutiveHome } from "@/components/portal-executive-home";
import {
  Activity, ArrowLeft, ArrowRight, BellRing, Building2, ChartNoAxesCombined,
  ClipboardCheck, Cpu, Database, FileCheck2, Headset, LockKeyhole,
  Network, ScrollText, Settings2, ShieldCheck, Users, WalletCards,
} from "lucide-react";
import { useLang } from "@/lib/i18n";

const CENTERS = [
  { id:"executive", ar:"مركز القيادة التنفيذي", en:"Executive Command Center", descAr:"الرؤية العليا للمنظومة، ملخص الحالة، القرارات ذات الأولوية، ومحفظة منتجات المؤسسة.", descEn:"System-wide overview, verified status, priority decisions, and the foundation’s product portfolio.", href:null, icon:ChartNoAxesCombined, state:"current" },
  { id:"operations", ar:"مركز مراقبة التشغيل", en:"Operations Monitoring Center", descAr:"صحة الاستضافة والتطبيق والهوية والبيانات والتكاملات، كل طبقة بمصدر قياس مستقل.", descEn:"Hosting, application, identity, data, and integration health—each backed by its own telemetry source.", href:"/platform/security", icon:Activity, state:"current" },
  { id:"tenants", ar:"قسم إدارة المدارس والمستخدمين", en:"Schools & Users Administration", descAr:"قسم إداري واحد يضم ملفات المدارس ودورة حياتها وحسابات المستخدمين والعضويات والأدوار؛ وليس مركزًا مستقلًا أو بوابة إضافية.", descEn:"One administrative section for school profiles, lifecycle, user accounts, memberships, and roles—not a separate center or portal.", href:"/platform/schools", icon:Building2, state:"current" },
  { id:"communications", ar:"مركز الرسائل والتنبيهات", en:"Communications & Alerts Center", descAr:"التعاميم والإشعارات وقنوات التواصل، مع سجل إرسال وحالة تسليم موثقة.", descEn:"Circulars, notifications, and communication channels with verifiable delivery records.", href:"/platform/communications", icon:BellRing, state:"planned" },
  { id:"support", ar:"مركز الدعم الفني", en:"Technical Support Center", descAr:"التذاكر والأولويات والإسناد ووقت الاستجابة ومسار الحل والتصعيد.", descEn:"Support tickets, priorities, ownership, response times, resolution, and escalation.", href:"/platform/support", icon:Headset, state:"planned" },
  { id:"subscriptions", ar:"مركز الاشتراكات والتفعيل", en:"Subscriptions & Activation Center", descAr:"التراخيص والتجديد والتفعيل وحدود الوصول، ولا تنفيذ قبل خدمة تراخيص وسجل تدقيق.", descEn:"Licenses, renewals, activation, and access limits—disabled until licensing and audit services exist.", href:"/platform/subscriptions", icon:WalletCards, state:"planned" },
  { id:"intelligence", ar:"مركز الذكاء والتحليل", en:"Intelligence & Analytics Center", descAr:"سجل المحركات والتحليلات المؤسسية واكتشاف الفجوات، دون كشف بيانات الطلاب الفردية.", descEn:"Engine registry, institution-level analytics, and gap detection without exposing individual student data.", href:"/platform/engines", icon:Cpu, state:"current" },
  { id:"evidence", ar:"مركز الأدلة والاعتماد", en:"Evidence & Accreditation Center", descAr:"الشواهد والاعتماد والتقويم وبنك الأسئلة والاختبارات التفاعلية ضمن صلاحيات واضحة.", descEn:"Evidence, accreditation, evaluation, question banks, and interactive assessments under explicit access rules.", href:"/platform/evidence", icon:FileCheck2, state:"planned" },
  { id:"governance", ar:"مركز الحوكمة والسجلات", en:"Governance & Records Center", descAr:"الأدوار والسياسات وسجل التدقيق وقرارات مدير المنصة والتغييرات الحساسة.", descEn:"Roles, policies, audit records, platform decisions, and sensitive change control.", href:"/platform/roles", icon:ScrollText, state:"current" },
] as const;

const HEALTH_LAYERS = [
  { id:"hosting", ar:"الاستضافة وVercel", en:"Hosting & Vercel", detailAr:"لا توجد قراءة تشغيلية مباشرة موصولة في هذه النسخة.", detailEn:"No live operational feed is connected in this build." },
  { id:"application", ar:"تطبيق Raven OS", en:"Raven OS application", detailAr:"يلزم ربط مراقبة التطبيق ومعدلات الأخطاء وزمن الاستجابة.", detailEn:"Application monitoring, error rates, and latency telemetry are pending." },
  { id:"identity", ar:"الهوية والجلسات", en:"Identity & sessions", detailAr:"مزود الهوية والجلسات غير موصولين بعد.", detailEn:"Identity provider and session services are not connected yet." },
  { id:"data", ar:"قواعد البيانات وعزل المدارس", en:"Database & tenant isolation", detailAr:"لا توجد قاعدة بيانات تشغيلية متصلة أو شهادة عزل شاملة.", detailEn:"No operational database or comprehensive tenant-isolation certification is connected." },
  { id:"audit", ar:"سجل التدقيق", en:"Audit trail", detailAr:"عقد سجل التدقيق موجود؛ مخزن دائم غير موصول.", detailEn:"The audit event contract exists; durable storage is not connected." },
] as const;

export function PlatformCommandCenter() {
  const { isAr } = useLang();
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  return (
    <main className="space-y-7">
      <PortalExecutiveHome portal="platform" />

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div><h2 className="text-lg font-black text-[#111A18]">{isAr?"مراكز وأقسام إدارة المنصة":"Platform centers & administration"}</h2><p className="mt-1 text-xs leading-6 text-[#66736e]">{isAr?"التقسيم التشغيلي المعتمد لتطوير البوابة على مراحل مترابطة.":"The operating structure for phased, connected development of the platform portal."}</p></div>
          <span className="shrink-0 rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-bold text-[#66736e]">09 {isAr?"وحدات إدارية":"governance units"}</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {CENTERS.map(center=>{
            const Icon=center.icon;
            const ready=center.state==="current";
            const content=<><div className="flex items-start justify-between gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#08794F]/10 text-[#08794F]"><Icon size={19}/></span><span className={ready?"rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-800":"rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-900"}>{ready?(isAr?"مسار قائم — يحتاج تطويرًا":"Existing route — enhancement pending"):(isAr?"ضمن دفعات التطوير":"Planned development batch")}</span></div><h3 className="mt-4 text-sm font-black text-[#111A18]">{isAr?center.ar:center.en}</h3><p className="mt-2 min-h-12 text-xs leading-6 text-[#66736e]">{isAr?center.descAr:center.descEn}</p>{center.href&&<span className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold text-[#08794F]">{isAr?"فتح المركز":"Open center"} <Arrow size={14}/></span>}</>;
            return center.href?<Link key={center.id} href={center.href} className="rf-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#08794F]/40 hover:shadow-md">{content}</Link>:<article key={center.id} className="rounded-2xl border border-dashed border-black/15 bg-white p-5">{content}</article>;
          })}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rf-card p-5">
          <div className="flex items-center gap-2"><Database size={18} className="text-[#08794F]"/><h2 className="font-black text-[#111A18]">{isAr?"مؤشرات المدارس والبيانات":"Schools & data indicators"}</h2></div>
          <p className="mt-2 text-xs leading-6 text-[#66736e]">{isAr?"لن تُعرض أعداد المدارس أو المستخدمين أو الحضور أو النشاط قبل ربط مستودع موثوق وتجميع آمن يحترم school_id.":"School, user, attendance, and activity counts remain hidden until a trusted repository and tenant-safe aggregation are connected."}</p>
          <div className="mt-4 rounded-xl bg-[#F5F3EC] p-3 text-xs leading-6 text-[#53615b]">{isAr?"قاعدة العرض: مؤشرات مجمعة على مستوى المؤسسة فقط، ولا تُكشف بيانات الطلاب الفردية في بوابة إدارة المنصة.":"Display rule: institution-level aggregates only. Individual student records are not exposed in Platform Management."}</div>
        </article>
        <article className="rf-card p-5">
          <div className="flex items-center gap-2"><LockKeyhole size={18} className="text-[#08794F]"/><h2 className="font-black text-[#111A18]">{isAr?"حدود الصلاحيات والتغيير":"Access & change boundaries"}</h2></div>
          <ul className="mt-3 space-y-2 text-xs leading-6 text-[#53615b]">
            <li className="flex gap-2"><ShieldCheck size={15} className="mt-1 shrink-0 text-[#08794F]"/>{isAr?"مالك المنصة ومسؤول التشغيل يظلان ضمن نموذج RBAC الحالي؛ لا تُنشأ أدوار جديدة قبل مراجعة السياسة.":"Platform ownership and operations remain within the current RBAC model; no new roles are introduced before policy review."}</li>
            <li className="flex gap-2"><ClipboardCheck size={15} className="mt-1 shrink-0 text-[#08794F]"/>{isAr?"التغييرات الحساسة تتطلب صلاحية خادمية وموافقة وسجل تدقيق دائم.":"Sensitive changes require server-side authorization, approval, and durable audit logging."}</li>
            <li className="flex gap-2"><Settings2 size={15} className="mt-1 shrink-0 text-[#08794F]"/>{isAr?"الأوامر الصوتية مستقبلية واختيارية؛ لا ميكروفون تلقائي ولا تنفيذ لأمر حساس دون تأكيد.":"Voice controls are optional future work; no automatic microphone and no sensitive action without confirmation."}</li>
          </ul>
        </article>
      </section>

      <section className="rounded-2xl border border-[#08794F]/15 bg-[#08794F]/5 p-5">
        <div className="flex items-center gap-2"><WalletCards size={18} className="text-[#08794F]"/><h2 className="font-black text-[#111A18]">{isAr?"محفظة منتجات المؤسسة":"Foundation product portfolio"}</h2></div>
        <p className="mt-2 text-xs leading-6 text-[#53615b]">{isAr?"تُعرض المنتجات وحالاتها من سجل مؤسسي مركزي بعد اعتماده. لن تُستنتج حالة النشاط أو الأولوية من واجهة تجريبية أو أرقام ثابتة.":"Products and their statuses will be sourced from an approved central portfolio registry. Activity and priority will not be inferred from demo UI or hard-coded figures."}</p>
      </section>
    </main>
  );
}
