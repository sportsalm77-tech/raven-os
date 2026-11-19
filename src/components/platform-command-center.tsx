"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity, ArrowLeft, ArrowRight, BellRing, Building2, ChartNoAxesCombined,
  ClipboardCheck, Cpu, Database, FileCheck2, Headset, LockKeyhole,
  Network, ScrollText, Settings2, ShieldCheck, Users, WalletCards,
} from "lucide-react";
import { useLang } from "@/lib/i18n";

const CENTERS = [
  { id:"executive", ar:"مركز القيادة التنفيذي", en:"Executive Command Center", descAr:"الرؤية العليا للمنظومة، ملخص الحالة، القرارات ذات الأولوية، ومحفظة منتجات المؤسسة.", descEn:"System-wide overview, verified status, priority decisions, and the foundation’s product portfolio.", href:"/platform", icon:ChartNoAxesCombined, state:"current" },
  { id:"operations", ar:"مركز مراقبة التشغيل", en:"Operations Monitoring Center", descAr:"صحة الاستضافة والتطبيق والهوية والبيانات والتكاملات، كل طبقة بمصدر قياس مستقل.", descEn:"Hosting, application, identity, data, and integration health—each backed by its own telemetry source.", href:"/platform/security", icon:Activity, state:"current" },
  { id:"tenants", ar:"قسم إدارة المدارس والمستخدمين", en:"Schools & Users Administration", descAr:"قسم إداري واحد يضم ملفات المدارس ودورة حياتها وحسابات المستخدمين والعضويات والأدوار؛ وليس مركزًا مستقلًا أو بوابة إضافية.", descEn:"One administrative section for school profiles, lifecycle, user accounts, memberships, and roles—not a separate center or portal.", href:"/platform/schools", icon:Building2, state:"current" },
  { id:"communications", ar:"مركز الرسائل والتنبيهات", en:"Communications & Alerts Center", descAr:"التعاميم والإشعارات وقنوات التواصل، مع سجل إرسال وحالة تسليم موثقة.", descEn:"Circulars, notifications, and communication channels with verifiable delivery records.", href:"/platform/communications", icon:BellRing, state:"current" },
  { id:"support", ar:"مركز الدعم الفني", en:"Technical Support Center", descAr:"التذاكر والأولويات والإسناد ووقت الاستجابة ومسار الحل والتصعيد.", descEn:"Support tickets, priorities, ownership, response times, resolution, and escalation.", href:"/platform/support", icon:Headset, state:"current" },
  { id:"subscriptions", ar:"مركز الاشتراكات والتفعيل", en:"Subscriptions & Activation Center", descAr:"التراخيص والتجديد والتفعيل وحدود الوصول، ولا تنفيذ قبل خدمة تراخيص وسجل تدقيق.", descEn:"Licenses, renewals, activation, and access limits—disabled until licensing and audit services exist.", href:"/platform/subscriptions", icon:WalletCards, state:"current" },
  { id:"intelligence", ar:"مركز الذكاء والتحليل", en:"Intelligence & Analytics Center", descAr:"سجل المحركات والتحليلات المؤسسية واكتشاف الفجوات، دون كشف بيانات الطلاب الفردية.", descEn:"Engine registry, institution-level analytics, and gap detection without exposing individual student data.", href:"/platform/engines", icon:Cpu, state:"current" },
  { id:"evidence", ar:"مركز الأدلة والاعتماد", en:"Evidence & Accreditation Center", descAr:"الشواهد والاعتماد والتقويم وبنك الأسئلة والاختبارات التفاعلية ضمن صلاحيات واضحة.", descEn:"Evidence, accreditation, evaluation, question banks, and interactive assessments under explicit access rules.", href:"/platform/evidence", icon:FileCheck2, state:"current" },
  { id:"governance", ar:"مركز الحوكمة والسجلات", en:"Governance & Records Center", descAr:"الأدوار والسياسات وسجل التدقيق وقرارات مدير المنصة والتغييرات الحساسة.", descEn:"Roles, policies, audit records, platform decisions, and sensitive change control.", href:"/platform/roles", icon:ScrollText, state:"current" },
] as const;

const HEALTH_LAYERS = [
  { id:"hosting", ar:"الاستضافة وVercel", en:"Hosting & Vercel", detailAr:"لا توجد قراءة تشغيلية مباشرة موصولة في هذه النسخة.", detailEn:"No live operational feed is connected in this build." },
  { id:"application", ar:"تطبيق Raven OS", en:"Raven OS application", detailAr:"يلزم ربط مراقبة التطبيق ومعدلات الأخطاء وزمن الاستجابة.", detailEn:"Application monitoring, error rates, and latency telemetry are pending." },
  { id:"identity", ar:"الهوية والجلسات", en:"Identity & sessions", detailAr:"مزود الهوية والجلسات غير موصولين بعد.", detailEn:"Identity provider and session services are not connected yet." },
  { id:"data", ar:"قواعد البيانات وعزل المدارس", en:"Database & tenant isolation", detailAr:"لا توجد قاعدة بيانات تشغيلية متصلة أو شهادة عزل شاملة.", detailEn:"No operational database or comprehensive tenant-isolation certification is connected." },
  { id:"audit", ar:"سجل التدقيق", en:"Audit trail", detailAr:"عقد سجل التدقيق موجود؛ مخزن دائم غير موصول.", detailEn:"The audit event contract exists; durable storage is not connected." },
] as const;

type MetricKey = "schools" | "activeSchools" | "schoolMemberships" | "plans" | "tickets" | "users" | "platformMemberships" | "classes" | "students";
type MetricStatus = "loading" | "available" | "empty" | "unavailable" | "unauthorized" | "error";
type MetricResult = { status: MetricStatus; value: number | null };
type OverviewState = "checking" | "verified" | "unauthorized" | "unverified";
const METRICS: { key: MetricKey; ar: string; en: string }[] = [
  { key: "schools", ar: "إجمالي المدارس", en: "Total schools" },
  { key: "activeSchools", ar: "المدارس النشطة", en: "Active schools" },
  { key: "schoolMemberships", ar: "عضويات المدارس", en: "School memberships" },
  { key: "plans", ar: "الخطط", en: "Plans" },
  { key: "tickets", ar: "التذاكر", en: "Tickets" },
  { key: "users", ar: "المستخدمون", en: "Users" },
  { key: "platformMemberships", ar: "عضويات المنصة", en: "Platform memberships" },
  { key: "classes", ar: "الفصول", en: "Classes" },
  { key: "students", ar: "الطلاب", en: "Students" },
];
const UNAVAILABLE_KEYS = new Set<MetricKey>(["users", "platformMemberships", "classes", "students"]);
function makeMetrics(status: MetricStatus): Record<MetricKey, MetricResult> {
  return Object.fromEntries(METRICS.map(({ key }) => [key, { status, value: null }])) as Record<MetricKey, MetricResult>;
}
function readMetrics(payload: unknown): Record<MetricKey, MetricResult> | null {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as { source?: unknown; metrics?: unknown; unavailable?: unknown; failed?: unknown };
  if (data.source !== "supabase" || !data.metrics || typeof data.metrics !== "object") return null;
  const raw = data.metrics as Record<string, unknown>;
  const unavailable = Array.isArray(data.unavailable) ? data.unavailable : [];
  const failed = Array.isArray(data.failed) ? data.failed : [];
  return Object.fromEntries(METRICS.map(({ key }) => {
    const value = raw[key];
    const status: MetricStatus = failed.includes(key) ? "error"
      : unavailable.includes(key) || UNAVAILABLE_KEYS.has(key) ? "unavailable"
      : typeof value === "number" && Number.isSafeInteger(value) && value >= 0
        ? (value === 0 ? "empty" : "available") : "error";
    return [key, { status, value: status === "available" || status === "empty" ? value as number : null }];
  })) as Record<MetricKey, MetricResult>;
}
function usePlatformMetrics() {
  const [state, setState] = useState<OverviewState>("checking");
  const [metrics, setMetrics] = useState<Record<MetricKey, MetricResult>>(() => makeMetrics("loading"));
  const [lastSuccess, setLastSuccess] = useState<Date | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    async function check() {
      try {
        const response = await fetch("/api/platform/overview", {
          credentials: "same-origin", cache: "no-store", signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        if (response.status === 401 || response.status === 403) {
          setState("unauthorized"); setMetrics(makeMetrics("unauthorized")); return;
        }
        if (!response.ok) { setState("unverified"); setMetrics(makeMetrics("error")); return; }
        const parsed = readMetrics(await response.json());
        if (controller.signal.aborted) return;
        if (!parsed) { setState("unverified"); setMetrics(makeMetrics("error")); return; }
        setMetrics(parsed);
        const hasError = METRICS.some(({ key }) => !UNAVAILABLE_KEYS.has(key) && parsed[key].status === "error");
        const hasSuccess = METRICS.some(({ key }) => !UNAVAILABLE_KEYS.has(key) && (parsed[key].status === "available" || parsed[key].status === "empty"));
        setState(hasSuccess ? "verified" : "unverified");
        if (hasSuccess && !hasError) setLastSuccess(new Date());
      } catch {
        if (!controller.signal.aborted) { setState("unverified"); setMetrics(makeMetrics("error")); }
      }
    }
    void check();
    return () => controller.abort();
  }, []);
  return { state, metrics, lastSuccess };
}

export function PlatformCommandCenter() {
  const { isAr } = useLang();
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const { state: overviewState, metrics, lastSuccess } = usePlatformMetrics();
  const statusLabel = overviewState === "verified" ? (isAr ? "قراءة جزئية أو كاملة من المصدر" : "Partial or complete source read") : overviewState === "checking" ? (isAr ? "جارٍ التحقق" : "Checking") : overviewState === "unauthorized" ? (isAr ? "غير مصرح" : "Unauthorized") : (isAr ? "غير متحقق" : "Unverified");
  return (
    <main className="space-y-7">
      <section className="overflow-hidden rounded-3xl bg-[#111A18] text-white">
        <div className="border-b border-white/10 px-6 py-5 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#D4AF37] text-[#111A18]"><Network size={22}/></span>
              <div><div className="text-[11px] font-extrabold tracking-widest text-[#D4AF37]">RAVEN OS · PLATFORM CONTROL PLANE</div><div className="mt-1 text-sm font-bold">{isAr?"مؤسسة رافيين للخدمات التعليمية":"Rafeeen Foundation for Educational Services"}</div></div>
            </div>
            <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1.5 text-[11px] font-bold text-amber-100">{overviewState === "verified" ? (isAr ? "جلسة مدير المنصة مُتحقق منها لهذا الطلب" : "Platform session verified for this request") : statusLabel}</span>
          </div>
          <h1 className="mt-6 text-2xl font-black md:text-3xl">{isAr?"مركز القيادة التنفيذي":"Executive Command Center"}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">{isAr?"مركز موحد لإدارة منظومة رافين ومدارسها. يعرض ما ثبت اتصاله فقط، ويفصل بوضوح بين الواجهة الجاهزة والخدمات التي تنتظر البناء أو الربط.":"A unified control plane for Raven OS and its schools. It shows only verified connections and clearly separates interface foundations from services still awaiting implementation or integration."}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-[11px]">
            <span className="rounded-lg border border-white/15 bg-white/5 px-3 py-2">{isAr?"أربع بوابات تشغيلية":"Four operational portals"} · /platform · /principal · /teacher · /family</span>
            <span className="rounded-lg border border-white/15 bg-white/5 px-3 py-2">{isAr?"عزل متعدد المدارس":"Multi-tenant isolation"} · school_id</span>
          </div>
        </div>
        <div className="grid gap-px bg-white/10 sm:grid-cols-2 xl:grid-cols-5">
          {HEALTH_LAYERS.map(layer => {
            const hasEvidence = overviewState === "verified";
            const isProbedLayer = layer.id === "identity" || layer.id === "data";
            const detail = isProbedLayer && hasEvidence
              ? layer.id === "identity"
                ? (isAr ? "تحقق الخادم من جلسة مدير المنصة وصلاحيته لهذا الطلب فقط." : "The server verified the platform session and role for this request only.")
                : (isAr ? "نجحت قراءة مؤشر مجمع واحد على الأقل؛ لم يُختبر عزل المدارس أو بقية الجداول." : "At least one aggregate read succeeded; tenant isolation and other tables were not tested.")
              : isProbedLayer
                ? (isAr ? "لا يوجد دليل خادمي كافٍ في هذه الجلسة." : "No sufficient server-side evidence for this session.")
                : (isAr ? layer.detailAr : layer.detailEn);
            return <div key={layer.id} className="bg-[#18231F] p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-white/85"><span className="h-2 w-2 rounded-full bg-amber-400"/>{isAr?layer.ar:layer.en}</div>
              <div className="mt-2 text-[11px] leading-5 text-white/55">{detail}</div>
              <div className="mt-3 text-[10px] font-extrabold text-amber-200">{isProbedLayer ? statusLabel : (isAr ? "غير متحقق" : "Unverified")}</div>
            </div>;
          })}
        </div>
      </section>

      <section aria-label={isAr ? "مؤشرات المنصة" : "Platform metrics"} className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-black text-[#111A18]">{isAr ? "مؤشرات المنصة" : "Platform metrics"}</h2>
          <div className="text-xs text-[#53615b]">
            {isAr ? "المصدر: واجهة مؤشرات المنصة المحمية" : "Source: protected platform overview API"}
            {" · "}{lastSuccess ? (isAr ? "آخر قراءة مكتملة ناجحة: " : "Last fully successful read: ") + lastSuccess.toLocaleString(isAr ? "ar-SA" : "en-US") : (isAr ? "لا توجد قراءة ناجحة بعد" : "No successful read yet")}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {METRICS.map(({ key, ar, en }) => {
            const metric = metrics[key];
            const statusText = metric.status === "loading" ? (isAr ? "جارٍ التحميل" : "Loading")
              : metric.status === "available" ? (isAr ? "بيانات متاحة" : "Available")
              : metric.status === "empty" ? (isAr ? "صفر حقيقي" : "Verified zero")
              : metric.status === "unavailable" ? (isAr ? "غير متاح من المصدر" : "Unavailable from source")
              : metric.status === "unauthorized" ? (isAr ? "غير مصرح" : "Unauthorized")
              : (isAr ? "تعذر جلب البيانات" : "Read failed");
            return <article key={key} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm" aria-live="polite">
              <h3 className="text-sm font-bold text-[#53615b]">{isAr ? ar : en}</h3>
              <div className="mt-3 text-3xl font-black tabular-nums text-[#111A18]">{metric.value === null ? "—" : metric.value.toLocaleString(isAr ? "ar-SA" : "en-US")}</div>
              <p className="mt-2 text-xs text-[#66736e]">{statusText}</p>
            </article>;
          })}
        </div>
        <p className="text-xs leading-6 text-[#66736e]">{isAr ? "نجاح قراءة المؤشرات لا يثبت سلامة عزل المدارس أو سياسات RLS." : "Successful metric reads do not certify tenant isolation or RLS policies."}</p>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div><h2 className="text-lg font-black text-[#111A18]">{isAr?"مراكز وأقسام إدارة المنصة":"Platform centers & administration"}</h2><p className="mt-1 text-xs leading-6 text-[#66736e]">{isAr?"المراكز التسعة المعتمدة؛ توفر المسار لا يعني اتصال الخدمة بقاعدة البيانات.":"The nine approved centers; a working route does not imply a connected backend service."}</p></div>
          <span className="shrink-0 rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-bold text-[#66736e]">09 {isAr?"وحدات إدارية":"governance units"}</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {CENTERS.map(center=>{
            const Icon=center.icon;
            const ready=center.state==="current";
            const content=<><div className="flex items-start justify-between gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#08794F]/10 text-[#08794F]"><Icon size={19}/></span><span className={ready?"rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-800":"rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-900"}>{ready?(isAr?"واجهة متاحة — الربط قيد التطوير":"Interface available — integration pending"):(isAr?"ضمن دفعات التطوير":"Planned development batch")}</span></div><h3 className="mt-4 text-sm font-black text-[#111A18]">{isAr?center.ar:center.en}</h3><p className="mt-2 min-h-12 text-xs leading-6 text-[#66736e]">{isAr?center.descAr:center.descEn}</p>{center.href&&<span className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold text-[#08794F]">{isAr?"فتح المركز":"Open center"} <Arrow size={14}/></span>}</>;
            return <Link key={center.id} href={center.href} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#08794F]/40 hover:shadow-md">{content}</Link>;
          })}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="flex items-center gap-2"><Database size={18} className="text-[#08794F]"/><h2 className="font-black text-[#111A18]">{isAr?"مؤشرات المدارس والبيانات":"Schools & data indicators"}</h2></div>
          <p className="mt-2 text-xs leading-6 text-[#66736e]">{isAr?"تعرض البطاقات أعلاه القراءات المتاحة من المصدر المحمي، وتبقى المؤشرات غير المتاحة دون قيمة رقمية.":"Cards above display available readings from the protected source; unavailable metrics have no numeric value."}</p>
          <div className="mt-4 rounded-xl bg-[#F5F3EC] p-3 text-xs leading-6 text-[#53615b]">{isAr?"قاعدة العرض: مؤشرات مجمعة على مستوى المؤسسة فقط، ولا تُكشف بيانات الطلاب الفردية في بوابة إدارة المنصة.":"Display rule: institution-level aggregates only. Individual student records are not exposed in Platform Management."}</div>
        </article>
        <article className="rounded-2xl border border-black/10 bg-white p-5">
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
