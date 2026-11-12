"use client";

import Link from "next/link";
import {
  Activity, ArrowLeft, ArrowRight, BookOpenCheck, ClipboardCheck, FileText, Gauge,
  Landmark, ListChecks, ShieldCheck, Sparkles, Target, Users, Workflow,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { PrincipalWorkflowReview } from "@/components/principal-workflow-review";
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
    ? ["القرارات الإدارية والتعاميم والخطابات", "التكليفات الإدارية وتحديد المسؤولين", "ورش العمل وبرامج التطوير المهني", "الزيارات الميدانية والمتابعة", "الشواهد والإغلاق والأرشفة"]
    : ["Administrative decisions, circulars, and letters", "Administrative assignments and ownership", "Workshops and professional development", "Field visits and follow-up", "Evidence, closure, and archiving"];
  return (
    <div className="space-y-6">
      <PageHead icon={Landmark} eyebrow="RAVEN OS · PRINCIPAL · ADMINISTRATIVE ACTIONS" title={isAr ? "مركز القرارات والتكليفات الإدارية" : "Administrative Decisions & Assignments Center"} description={isAr ? "المركز الموحد لجميع الإجراءات الإدارية التي يصدرها مدير المدرسة داخل المنصة والمدرسة، من القرار والتكليف إلى المتابعة والتوثيق والإغلاق." : "The unified center for administrative actions issued by the principal, from decisions and assignments to follow-up, evidence, and closure."}/>
      <SectionCard title={isAr ? "دورة الإجراء الإداري" : "Administrative action lifecycle"} description={isAr ? "يشمل القرارات والتعاميم والخطابات والورش والبرامج والزيارات والتكليفات." : "Covers decisions, circulars, letters, workshops, programs, visits, and assignments."}>
        <ol className="grid gap-3 md:grid-cols-5">
          {stages.map((stage, i) => <li key={stage} className="rounded-xl border border-[var(--border)] p-4">
            <span className="mb-3 grid h-8 w-8 place-items-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-800">{i + 1}</span>
            <p className="text-sm font-semibold leading-6">{stage}</p>
          </li>)}
        </ol>
      </SectionCard>
      <div className="grid gap-4 md:grid-cols-2">
        <CenterLink href="/principal/assignments" icon={ClipboardCheck} ar="سجل التكليفات الإدارية" en="Administrative Assignments Register"/>
        <CenterLink href="/principal/operational-plan" icon={ListChecks} ar="الارتباط بالخطة التشغيلية" en="Link to Operational Plan"/>
        <CenterLink href="/principal/info-center" icon={FileText} ar="البيانات والشواهد المعتمدة" en="Approved Data & Evidence"/>
        <CenterLink href="/principal/impact" icon={Gauge} ar="قياس الأثر والتحسين" en="Impact Measurement & Improvement"/>
      </div>
      <PrincipalWorkflowReview kind="decisions" />
      <SectionCard title={isAr ? "سجل القرارات والإجراءات" : "Decisions & Actions Register"} description={isAr ? "ستظهر السجلات الفعلية بعد ربط مصدر البيانات وخدمة الاعتماد وسجل التدقيق." : "Live records will appear after connecting the data source, approval service, and audit log."}>
        <EmptyState title={isAr ? "لا توجد سجلات متصلة" : "No connected records"} description={isAr ? "لا توجد بيانات أو قرارات تجريبية. إنشاء القرار أو إصداره أو اعتماده غير متاح حتى تتصل الهوية والصلاحيات والحفظ الخادمي." : "No sample records or demo decisions. Creating or approving actions remains unavailable until identity, permissions, and server persistence are connected."}/>
      </SectionCard>
    </div>
  );
}

export function PrincipalOperationalPlan() {
  const { isAr } = useCopy();
  const branches = [
    { href: "/principal/operational-plan/management", icon: Target, ar: "إدارة الخطة التشغيلية", en: "Operational Plan Management", detailAr: "إنشاء الخطة يدويًا أو توليدها ذكيًا، ثم مراجعتها واعتماد نسختها وتحديثها.", detailEn: "Create manually or generate intelligently, then review, approve, and maintain the plan." },
    { href: "/principal/operational-plan/follow-up", icon: ClipboardCheck, ar: "متابعة الخطة التشغيلية", en: "Operational Plan Follow-up", detailAr: "متابعة التنفيذ والإنجاز والتأخر والمسؤوليات والشواهد والتقارير.", detailEn: "Track execution, progress, delays, ownership, evidence, and reports." },
    { href: "/principal/operational-plan/development", icon: Activity, ar: "الخطة التطويرية", en: "Development Plan", detailAr: "تحديد فرص التحسين والأولويات والمستهدفات ومشروعات التطوير.", detailEn: "Define improvement opportunities, priorities, targets, and development projects." },
    { href: "/principal/operational-plan/alternatives", icon: Workflow, ar: "الخطط البديلة", en: "Contingency Plans", detailAr: "خطة بديلة مرتبطة بكل خطة أصلية مع سبب التفعيل وشروط العودة.", detailEn: "A contingency plan linked to each original plan, with activation and return criteria." },
    { href: "/principal/operational-plan/initiatives", icon: Sparkles, ar: "مبادرات الخطة التشغيلية", en: "Operational Plan Initiatives", detailAr: "إدارة المبادرات وربط كل مبادرة بهدف ومؤشر ومسؤول وشواهد.", detailEn: "Manage initiatives linked to objectives, indicators, owners, and evidence." },
    { href: "/principal/operational-plan/programs", icon: BookOpenCheck, ar: "برامج الخطة التشغيلية", en: "Operational Plan Programs", detailAr: "بناء البرامج والأنشطة التنفيذية ومواعيدها ومخرجاتها وقياسها.", detailEn: "Build operational programs and activities with schedules, outputs, and measures." },
  ];
  return (
    <div className="space-y-6">
      <PageHead icon={ListChecks} eyebrow="RAVEN OS · PRINCIPAL · SCHOOL LEADERSHIP" title={isAr ? "مركز الخطة التشغيلية الذكية" : "Smart Operational Plan Center"} description={isAr ? "مركز مستقل لإدارة الخطة التشغيلية والخطط التطويرية والبديلة ومبادراتها وبرامجها ومتابعة تنفيذها." : "An independent center for operational and development plans, contingency plans, initiatives, programs, and execution follow-up."}/>
      <div className="rounded-xl border border-emerald-700/20 bg-emerald-50/60 p-4 text-sm leading-7 text-emerald-950">
        {isAr ? "الترابط المعتمد: هدف ← خطة ← مبادرة أو برنامج ← إجراء أو تكليف مرتبط ← تنفيذ ← شاهد ← متابعة وقياس أثر. تظل سجلات القرارات والتكليفات في مركزها الأصلي، ويُحفظ هنا مرجع الربط فقط." : "Approved chain: objective → plan → initiative or program → linked action or assignment → execution → evidence → follow-up and impact. Decision and assignment records remain in their source center; this center stores their references only."}
      </div>
      <SectionCard title={isAr ? "التوليد الذكي للخطة" : "Intelligent Plan Generation"} description={isAr ? "عندما يحتاج المدير إلى خطة، يطلب من رافين توليد مسودة مترابطة اعتمادًا على البيانات المعتمدة من مركز البيانات المدرسية ومركز القرارات والتكليفات الإدارية وسائر الأقسام ذات العلاقة." : "When the principal needs a plan, Raven can be asked to generate a connected draft from approved data in the Unified School Data Center, Administrative Decisions & Assignments Center, and other relevant sections."}>
        <div className="flex flex-col gap-3 rounded-xl border border-emerald-700/20 bg-emerald-50/50 p-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl text-sm leading-7 text-[var(--foreground)]">
            {isAr ? "يحلل النظام المدخلات المتاحة، ويكشف النواقص والتعارضات، ثم يقترح الأهداف والمبادرات والبرامج والمؤشرات والمسؤوليات والجدول الزمني. الناتج مسودة للمراجعة؛ ولا يعتمد أو يصدر تكليفات تلقائيًا." : "Raven analyzes available inputs, identifies gaps and conflicts, then proposes objectives, initiatives, programs, indicators, ownership, and timelines. The result is a reviewable draft; it is not approved and does not issue assignments automatically."}
          </div>
          <Link href="/principal/operational-plan/management" className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#08794F] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#066440]">
            {isAr ? "الانتقال إلى توليد الخطة" : "Go to plan generation"} <ArrowLeft size={16} className="ms-2"/>
          </Link>
        </div>
        <p className="mt-3 text-xs leading-6 text-[var(--muted)]">{isAr ? "التوليد الفعلي يتطلب محركًا متصلًا بمصادر البيانات والصلاحيات وسجل التدقيق. هذا المسار يوضح الوظيفة المستهدفة ولا ينفذ توليدًا وهميًا." : "Live generation requires a connected engine, governed data sources, authorization, and audit logging. This entry describes the intended capability and does not simulate generation."}</p>
      </SectionCard>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {branches.map(({ href, icon: Icon, ar, en, detailAr, detailEn }) => (
          <Link key={href} href={href} className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-emerald-600/40 hover:bg-emerald-50/30">
            <span className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-800"><Icon size={19}/></span>
            <h2 className="text-sm font-bold text-[var(--foreground)]">{isAr ? ar : en}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{isAr ? detailAr : detailEn}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-emerald-800">{isAr ? "فتح القسم" : "Open section"} <ArrowLeft size={14}/></span>
          </Link>
        ))}
      </div>
      <PrincipalWorkflowReview kind="planning" />
      <SectionCard title={isAr ? "ضوابط سلامة البيانات" : "Data integrity rules"} description={isAr ? "لا توجد خطط أو نسب إنجاز افتراضية؛ كل فرع ينتظر مصدرًا موثوقًا واعتمادًا بشريًا قبل احتساب النتائج." : "No sample plans or completion rates. Each branch requires a trusted source and human approval before results are calculated."}>
        <ul className="space-y-2 text-sm leading-6 text-[var(--muted)]">
          <li>{isAr ? "لكل خطة معرف مرجعي وإصدار وحالة اعتماد." : "Each plan has a reference ID, version, and approval status."}</li>
          <li>{isAr ? "لا تُكرر بيانات القرارات أو التكليفات؛ تُربط بمعرفاتها فقط." : "Decision and assignment data is never duplicated; link by reference ID only."}</li>
          <li>{isAr ? "تُحسب نسب الإنجاز من إجراءات وشواهد معتمدة فقط." : "Progress is calculated only from approved actions and evidence."}</li>
          <li>{isAr ? "تُسجل التعديلات والاعتمادات والإغلاق في سجل تدقيق عند تفعيل الخدمة." : "Changes, approvals, and closure must be audited when the service is activated."}</li>
        </ul>
      </SectionCard>
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
      <PrincipalWorkflowReview kind="impact" />
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
