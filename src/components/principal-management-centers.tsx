"use client";

import Link from "next/link";
import {
  Activity, ArrowLeft, ArrowRight, ClipboardCheck, FileText, Gauge,
  Landmark, ListChecks, ShieldCheck, Target, Users, Workflow,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { EmptyState, PageHead, SectionCard } from "@/components/raven-ui";

function useCopy() {
  const { lang } = useLang();
  return { isAr: lang === "ar", Back: lang === "ar" ? ArrowRight : ArrowLeft };
}

function CenterLink({ href, icon: Icon, ar, en }: {
  href: string; icon: typeof Landmark; ar: string; en: string;
}) {
  const { isAr } = useCopy();
  return (
    <Link href={href} className="group flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-emerald-600/40 hover:bg-emerald-50/40">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-800"><Icon size={19}/></span>
      <span className="min-w-0 flex-1 text-sm font-semibold text-[var(--foreground)]">{isAr ? ar : en}</span>
      <span className="text-[var(--muted)]"><ArrowLeft size={16}/></span>
    </Link>
  );
}

export function PrincipalDecisionCenter() {
  const { isAr } = useCopy();
  const stages = isAr
    ? ["تحديد القضية والهدف", "جمع المعلومات والشواهد", "تحليل البدائل والمخاطر", "اعتماد القرار وتحديد المسؤوليات", "متابعة التنفيذ وقياس الأثر"]
    : ["Define the issue and objective", "Gather information and evidence", "Assess options and risks", "Approve the decision and assign ownership", "Follow execution and measure impact"];
  return (
    <div className="space-y-6">
      <PageHead icon={Landmark} eyebrow="RAVEN OS · PRINCIPAL · DECISION" title={isAr ? "مركز القرار الإداري" : "Administrative Decision Center"} description={isAr ? "المساحة المركزية لتحويل احتياج المدرسة إلى قرار موثق، وتكليف قابل للمتابعة، وشاهد، وأثر قابل للقياس." : "The central workspace for turning a school need into a documented decision, accountable assignment, evidence, and measurable impact."}/>
      <SectionCard title={isAr ? "دورة القرار" : "Decision lifecycle"} description={isAr ? "تسلسل العمل المعتمد؛ لا تمثل هذه المراحل إجراءات إلكترونية مفعلة بعد." : "The approved workflow; these stages are not yet live electronic actions."}>
        <ol className="grid gap-3 md:grid-cols-5">
          {stages.map((stage, i) => <li key={stage} className="rounded-xl border border-[var(--border)] p-4">
            <span className="mb-3 grid h-8 w-8 place-items-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-800">{i + 1}</span>
            <p className="text-sm font-semibold leading-6">{stage}</p>
          </li>)}
        </ol>
      </SectionCard>
      <div className="grid gap-4 md:grid-cols-2">
        <CenterLink href="/principal/info-center" icon={FileText} ar="مركز المعلومات والشواهد" en="Information & Evidence Center"/>
        <CenterLink href="/principal/assignments" icon={ClipboardCheck} ar="التكليفات ومتابعة التنفيذ" en="Assignments & Execution Follow-up"/>
        <CenterLink href="/principal/operational-plan" icon={ListChecks} ar="الخطة التشغيلية — قسم فرعي" en="Operational Plan — Subsection"/>
        <CenterLink href="/principal/impact" icon={Gauge} ar="قياس الأثر والتحسين" en="Impact Measurement & Improvement"/>
      </div>
      <SectionCard title={isAr ? "سجل القرارات" : "Decision register"} description={isAr ? "ستظهر القرارات بعد ربط مصدر البيانات وخدمة الاعتماد وسجل التدقيق." : "Decisions will appear after connecting the data source, approval service, and audit log."}>
        <EmptyState title={isAr ? "لا توجد قرارات متصلة" : "No connected decisions"} description={isAr ? "لا توجد بيانات افتراضية أو قرارات تجريبية. لن تتاح إضافة قرار أو اعتماده حتى تتصل الهوية والصلاحيات والحفظ الخادمي." : "No sample data or demo decisions are shown. Decision creation and approval remain unavailable until identity, permissions, and server persistence are connected."}/>
      </SectionCard>
    </div>
  );
}

export function PrincipalOperationalPlan() {
  const { isAr } = useCopy();
  const domains = [
    { icon: Target, ar: "الأهداف ومؤشرات الأداء", en: "Objectives & Performance Indicators", detailAr: "تعريف الهدف ومصدر المؤشر وخط الأساس والمستهدف.", detailEn: "Define the objective, indicator source, baseline, and target." },
    { icon: Workflow, ar: "المبادرات والإجراءات", en: "Initiatives & Actions", detailAr: "ربط المبادرة بالإجراء والنتيجة المتوقعة.", detailEn: "Link each initiative to actions and expected outcomes." },
    { icon: Users, ar: "المسؤولون والجداول الزمنية", en: "Owners & Timelines", detailAr: "تحديد المسؤوليات والفترات بعد اعتماد التكليف.", detailEn: "Assign ownership and timelines after assignment approval." },
    { icon: FileText, ar: "الشواهد ومراجعة الإنجاز", en: "Evidence & Progress Review", detailAr: "ربط الشواهد بمصدرها والتحقق منها قبل الاحتساب.", detailEn: "Link evidence to its source and validate it before counting progress." },
  ];
  return (
    <div className="space-y-6">
      <PageHead icon={ListChecks} eyebrow="RAVEN OS · PRINCIPAL · DECISION SUBSECTION" title={isAr ? "الخطة التشغيلية" : "Operational Plan"} description={isAr ? "قسم فرعي داخل مركز القرار الإداري، وليس مركزًا مستقلًا ضمن المراكز الرئيسية." : "A subsection within the Administrative Decision Center, not a separate primary center."}/>
      <Link href="/principal/decision-center" className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--surface)]">
        {isAr ? "العودة إلى مركز القرار الإداري" : "Back to Administrative Decision Center"} <ArrowLeft size={16}/>
      </Link>
      <div className="rounded-xl border border-emerald-700/20 bg-emerald-50/60 p-4 text-sm leading-7 text-emerald-950">
        {isAr ? "الترابط المعتمد: الهدف ← المبادرة ← الإجراء ← المسؤول والمدة ← الشاهد ← قياس الإنجاز والتحسين." : "Approved chain: objective → initiative → action → owner and timeline → evidence → progress measurement and improvement."}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {domains.map(({ icon: Icon, ar, en, detailAr, detailEn }) => <SectionCard key={en} title={isAr ? ar : en} description={isAr ? detailAr : detailEn}>
          <EmptyState title={isAr ? "بانتظار اعتماد مصدر البيانات" : "Awaiting approved data source"} description={isAr ? "لا توجد أهداف أو مبادرات أو نسب إنجاز افتراضية في هذا القسم." : "No sample objectives, initiatives, or completion percentages are displayed."}/>
        </SectionCard>)}
      </div>
    </div>
  );
}

export function PrincipalImpactCenter() {
  const { isAr } = useCopy();
  return (
    <div className="space-y-6">
      <PageHead icon={Activity} eyebrow="RAVEN OS · PRINCIPAL · IMPACT" title={isAr ? "مركز قياس الأثر" : "Impact Measurement Center"} description={isAr ? "تحويل نتائج التنفيذ والشواهد المعتمدة إلى مؤشرات تساعد على المراجعة والتحسين." : "Turn execution outcomes and approved evidence into indicators that support review and improvement."}/>
      <SectionCard title={isAr ? "منهجية قياس الأثر" : "Impact measurement method"} description={isAr ? "لا يُحتسب أي مؤشر دون تعريف ومصدر وفترة قياس وشاهد قابل للتحقق." : "No indicator is calculated without a definition, source, measurement period, and verifiable evidence."}>
        <div className="grid gap-3 md:grid-cols-4">
          {(isAr ? ["تعريف المؤشر", "تحديد مصدر البيانات", "التحقق من الشواهد", "المراجعة والتحسين"] : ["Define indicator", "Identify data source", "Validate evidence", "Review and improve"]).map((label, i) => <div key={label} className="rounded-xl border border-[var(--border)] p-4"><span className="text-xs font-bold text-emerald-800">{String(i + 1).padStart(2, "0")}</span><p className="mt-2 text-sm font-semibold">{label}</p></div>)}
        </div>
      </SectionCard>
      <SectionCard title={isAr ? "المؤشرات والنتائج" : "Indicators & Results"}>
        <EmptyState title={isAr ? "لا توجد مؤشرات مرتبطة" : "No connected indicators"} description={isAr ? "لن نعرض نسبًا أو رسومًا أو اتجاهات تجريبية. يلزم ربط مصدر موثوق وتعريف المؤشر والفترة قبل احتسابه." : "No sample percentages, charts, or trends are shown. A trusted source, indicator definition, and period are required before calculation."}/>
      </SectionCard>
    </div>
  );
}

export function PrincipalSchoolAffairsCenter() {
  const { isAr } = useCopy();
  const areas = [
    { icon: Landmark, ar: "التنظيم والشؤون المدرسية", en: "School Organization & Affairs", descAr: "القرارات والتنظيمات والتعاميم ذات الصلة.", descEn: "Relevant decisions, organization, and circulars." },
    { icon: Users, ar: "اللجان وفرق العمل", en: "Committees & Working Groups", descAr: "التشكيل والاختصاصات والمحاضر والتكليفات.", descEn: "Membership, responsibilities, minutes, and assignments." },
    { icon: ShieldCheck, ar: "المتابعة والالتزام", en: "Follow-up & Compliance", descAr: "متابعة الإجراءات والملاحظات والإغلاق الموثق.", descEn: "Track actions, observations, and documented closure." },
  ];
  return (
    <div className="space-y-6">
      <PageHead icon={Landmark} eyebrow="RAVEN OS · PRINCIPAL · SCHOOL AFFAIRS" title={isAr ? "مركز الشؤون المدرسية" : "School Affairs Center"} description={isAr ? "تنظيم أعمال المدرسة ولجانها وإجراءاتها ضمن مصدر موحد وسجل متابعة واضح." : "Organize school operations, committees, and procedures through a unified source and clear follow-up record."}/>
      <div className="grid gap-4 md:grid-cols-3">
        {areas.map(({ icon: Icon, ar, en, descAr, descEn }) => <SectionCard key={en} title={isAr ? ar : en} description={isAr ? descAr : descEn}><EmptyState title={isAr ? "لا توجد سجلات متصلة" : "No connected records"} description={isAr ? "لا توجد لجان أو محاضر أو إجراءات افتراضية. ستظهر السجلات بعد ربط مصدر المدرسة والصلاحيات." : "No sample committees, minutes, or actions are displayed. Records will appear after connecting the school source and permissions."}/></SectionCard>)}
      </div>
    </div>
  );
}
