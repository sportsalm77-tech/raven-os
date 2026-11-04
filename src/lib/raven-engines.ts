/**
 * Raven OS shared engine registry.
 * Architecture catalogue only: entries describe intended capabilities and activation gates.
 * This registry does not connect external systems or perform privileged operations.
 */
export type EngineStatus = "architecture" | "ui_scaffold" | "backend_pending" | "connected" | "verified";

export type EngineDomain =
  | "school_operations"
  | "assessment"
  | "intelligence_governance"
  | "external_integrations";

export type EngineDefinition = {
  id: string;
  number: number;
  nameAr: string;
  nameEn: string;
  domain: EngineDomain;
  purposeAr: string;
  purposeEn: string;
  capabilitiesAr: string[];
  capabilitiesEn: string[];
  consumers: Array<"platform" | "principal" | "teacher" | "family">;
  dataSources: string[];
  outputs: string[];
  humanApprovalRequired: boolean;
  externalConnection: boolean;
  status: EngineStatus;
  activationGates: string[];
};

export const RAVEN_ENGINE_REGISTRY_VERSION = "1.0.0";

export const RAVEN_ENGINE_REGISTRY: readonly EngineDefinition[] = [
  {
    id: "school-data",
    number: 1,
    nameAr: "محرك البيانات المدرسية",
    nameEn: "School Data Engine",
    domain: "school_operations",
    purposeAr: "إدارة البيانات المدرسية المرجعية من خلال مركز البيانات المدرسية الموحد بوصفه المصدر المركزي المعتمد.",
    purposeEn: "Govern canonical school data through the Unified School Data Center as the authoritative source.",
    capabilitiesAr: ["ملفات المدرسة والموظفين والطلاب والفصول", "استيراد الملفات والتحقق من بنيتها ومصدرها", "إدارة المهام واللجان والمسؤوليات", "منع ازدواجية السجلات وحفظ تاريخ التغييرات"],
    capabilitiesEn: ["School, staff, student, and class records", "File intake and source-aware validation", "Tasks, committees, and responsibilities", "Duplicate prevention and change history"],
    consumers: ["platform", "principal", "teacher", "family"],
    dataSources: ["Unified School Data Center", "approved educational connectors"],
    outputs: ["canonical school records", "validated import batches", "governed data events"],
    humanApprovalRequired: true,
    externalConnection: false,
    status: "architecture",
    activationGates: ["server-side identity and school_id isolation", "canonical schema and validation", "audit trail and authorized commit workflow"]
  },
  {
    id: "decisions-assignments",
    number: 2,
    nameAr: "محرك القرارات والتكليفات",
    nameEn: "Decisions & Assignments Engine",
    domain: "school_operations",
    purposeAr: "إدارة دورة حياة القرارات والتكليفات والتعاميم والخطابات والبرامج والزيارات من الإنشاء حتى الإغلاق والأرشفة.",
    purposeEn: "Manage decisions, assignments, circulars, letters, programs, and visits from creation through closure and archiving.",
    capabilitiesAr: ["إنشاء المسودات", "تحديد المسؤول والمدة والمخرجات", "الإحالة والمتابعة والإغلاق", "الربط المرجعي بالخطة دون تكرار السجل"],
    capabilitiesEn: ["Draft creation", "Owner, duration, and deliverable assignment", "Routing, follow-up, and closure", "Reference links to plans without duplicate master records"],
    consumers: ["principal", "teacher"],
    dataSources: ["school-data", "approved plan records"],
    outputs: ["decision drafts", "assignment records", "closure and archive references"],
    humanApprovalRequired: true,
    externalConnection: false,
    status: "architecture",
    activationGates: ["principal authorization policy", "immutable decision history", "approval and closure workflow"]
  },
  {
    id: "workflow-followup",
    number: 3,
    nameAr: "محرك سير العمل والمتابعة",
    nameEn: "Workflow & Follow-up Engine",
    domain: "school_operations",
    purposeAr: "تنسيق الإجراءات والمراحل والمواعيد والمسؤوليات والتنبيهات ومتابعة التعثر.",
    purposeEn: "Orchestrate procedures, stages, deadlines, ownership, notifications, and delay monitoring.",
    capabilitiesAr: ["قوالب سير العمل", "توزيع المسؤوليات", "رصد التأخير والتعثر", "التنبيهات والتصعيد وفق السياسة"],
    capabilitiesEn: ["Workflow templates", "Responsibility routing", "Delay and blocker detection", "Policy-based alerts and escalation"],
    consumers: ["platform", "principal", "teacher"],
    dataSources: ["decisions-assignments", "operational-plans", "school-data"],
    outputs: ["workflow state", "follow-up events", "delay alerts"],
    humanApprovalRequired: true,
    externalConnection: false,
    status: "architecture",
    activationGates: ["workflow state model", "notification authorization", "audit logging"]
  },
  {
    id: "evidence-documentation-impact",
    number: 4,
    nameAr: "محرك الأدلة والتوثيق والأثر",
    nameEn: "Evidence, Documentation & Impact Engine",
    domain: "school_operations",
    purposeAr: "إدارة الشواهد وربطها بالأهداف والإجراءات والمعايير وتوثيق النتائج والأثر.",
    purposeEn: "Manage evidence linked to objectives, procedures, standards, outcomes, and impact.",
    capabilitiesAr: ["استقبال الشواهد وتصنيفها", "ربط الشاهد بمصدره وسياقه", "التحقق من الاكتمال والصلاحية", "توثيق الأثر ومرجع الأرشفة"],
    capabilitiesEn: ["Evidence intake and classification", "Source and context linkage", "Completeness and validity checks", "Impact records and archive references"],
    consumers: ["principal", "teacher"],
    dataSources: ["school-data", "workflow-followup", "approved external imports"],
    outputs: ["evidence records", "provenance references", "impact evidence"],
    humanApprovalRequired: true,
    externalConnection: false,
    status: "architecture",
    activationGates: ["secure file storage", "retention and access policy", "source provenance and review"]
  },
  {
    id: "operational-plans",
    number: 5,
    nameAr: "محرك الخطط التشغيلية",
    nameEn: "Operational Plans Engine",
    domain: "school_operations",
    purposeAr: "إدارة الخطط التشغيلية والتطويرية والبديلة ومبادراتها وبرامجها ومتابعة تنفيذها.",
    purposeEn: "Manage operational, development, and contingency plans, initiatives, programs, and execution.",
    capabilitiesAr: ["استيراد خطة قائمة عبر مركز البيانات", "إنشاء خطة ومسودة ذكية", "إدارة الأهداف والمؤشرات والمبادرات والبرامج", "إدارة النسخ والخطط البديلة والمتابعة"],
    capabilitiesEn: ["Import existing plans through the Data Center", "Create plans and intelligent drafts", "Manage objectives, indicators, initiatives, and programs", "Versioning, contingency plans, and follow-up"],
    consumers: ["principal", "teacher"],
    dataSources: ["school-data", "decisions-assignments", "workflow-followup", "evidence-documentation-impact"],
    outputs: ["plan versions", "initiative and program records", "progress and contingency status"],
    humanApprovalRequired: true,
    externalConnection: false,
    status: "architecture",
    activationGates: ["approved plan schema", "source-preserving import and human review", "baseline change authorization"]
  },
  {
    id: "school-evaluation-accreditation",
    number: 6,
    nameAr: "محرك التقويم والاعتماد المدرسي",
    nameEn: "School Evaluation & Accreditation Engine",
    domain: "assessment",
    purposeAr: "إدارة معايير التقويم الذاتي والخارجي ومتطلبات الاعتماد والتحسين والشواهد المرتبطة بها.",
    purposeEn: "Manage self/external evaluation standards, accreditation requirements, improvement, and related evidence.",
    capabilitiesAr: ["إدارة المجالات والمعايير والمؤشرات", "تحليل مستوى الاستيفاء والفجوات", "ربط الشواهد بالمعايير", "إعداد خطط التحسين ومتابعتها"],
    capabilitiesEn: ["Domains, standards, and indicators", "Compliance and gap analysis", "Evidence-to-standard mapping", "Improvement plans and follow-up"],
    consumers: ["principal", "teacher"],
    dataSources: ["school-data", "evidence-documentation-impact", "operational-plans"],
    outputs: ["evaluation results", "compliance gaps", "improvement requirements"],
    humanApprovalRequired: true,
    externalConnection: false,
    status: "architecture",
    activationGates: ["versioned standards catalogue", "traceable evidence mapping", "review and sign-off workflow"]
  },
  {
    id: "nafs-measurement",
    number: 7,
    nameAr: "محرك نافس والقياس",
    nameEn: "NAFS & Measurement Engine",
    domain: "assessment",
    purposeAr: "متابعة الاستعداد والنتائج والمؤشرات والفجوات التعليمية المرتبطة بقياس نافس.",
    purposeEn: "Track NAFS readiness, results, indicators, and learning gaps.",
    capabilitiesAr: ["متابعة الاستعداد", "تحليل النتائج المتاحة", "تحليل الفجوات حسب الصف والمجال", "اقتراح تدخلات ومتابعة أثرها"],
    capabilitiesEn: ["Readiness tracking", "Analysis of available results", "Grade and domain gap analysis", "Intervention suggestions and impact follow-up"],
    consumers: ["principal", "teacher"],
    dataSources: ["school-data", "approved assessment results", "evidence-documentation-impact"],
    outputs: ["measurement summaries", "learning gaps", "intervention recommendations"],
    humanApprovalRequired: true,
    externalConnection: false,
    status: "architecture",
    activationGates: ["authorized results source", "privacy-safe aggregation", "validated measurement definitions"]
  },
  {
    id: "security-protection",
    number: 8,
    nameAr: "محرك الأمان والحماية",
    nameEn: "Security & Protection Engine",
    domain: "intelligence_governance",
    purposeAr: "حماية الهوية والبيانات والجلسات والعمليات ومراقبة المخاطر والاستجابة للحوادث.",
    purposeEn: "Protect identity, data, sessions, and operations; monitor risks and support incident response.",
    capabilitiesAr: ["التحقق من الجلسات والهوية", "حماية البيانات وعزل المدارس", "مراقبة الأحداث والمخاطر", "إدارة الحوادث والتنبيهات الأمنية"],
    capabilitiesEn: ["Session and identity validation", "Data protection and tenant isolation", "Event and risk monitoring", "Security incidents and alerts"],
    consumers: ["platform", "principal", "teacher", "family"],
    dataSources: ["identity provider", "application security events", "audit events"],
    outputs: ["security decisions", "risk events", "incident records"],
    humanApprovalRequired: true,
    externalConnection: false,
    status: "architecture",
    activationGates: ["server-side enforcement", "secret management", "security testing and incident procedures"]
  },
  {
    id: "smart-assistant",
    number: 9,
    nameAr: "محرك المساعد الذكي",
    nameEn: "Smart Assistant Engine",
    domain: "intelligence_governance",
    purposeAr: "فهم طلب المستخدم وتحديد السياق المسموح وتوجيه الطلب للمحرك المناسب وإظهار مصادر الإجابة.",
    purposeEn: "Understand user requests, resolve permitted context, route to the right engine, and expose answer sources.",
    capabilitiesAr: ["فهم اللغة والنية", "توجيه المهام للمحركات", "إظهار المصادر ودرجة اليقين", "طلب موافقة بشرية للإجراءات الحساسة"],
    capabilitiesEn: ["Language and intent understanding", "Engine task routing", "Source and confidence disclosure", "Human approval for sensitive actions"],
    consumers: ["platform", "principal", "teacher", "family"],
    dataSources: ["authorized engine APIs only"],
    outputs: ["grounded responses", "task proposals", "review requests"],
    humanApprovalRequired: true,
    externalConnection: false,
    status: "architecture",
    activationGates: ["permission-aware retrieval", "prompt and tool isolation", "safety and evaluation tests"]
  },
  {
    id: "governance-permissions",
    number: 10,
    nameAr: "محرك الحوكمة والصلاحيات",
    nameEn: "Governance & Permissions Engine",
    domain: "intelligence_governance",
    purposeAr: "فرض الأدوار والسياسات والاعتمادات والفصل بين مسؤوليات المنصة والمدرسة.",
    purposeEn: "Enforce roles, policies, approvals, and separation between platform and school responsibilities.",
    capabilitiesAr: ["RBAC وسياسات أقل صلاحية", "عزل school_id خادميًا", "مسارات الاعتماد والتفويض", "سجل تدقيق غير قابل للتلاعب من الواجهة"],
    capabilitiesEn: ["RBAC and least-privilege policies", "Server-side school_id isolation", "Approval and delegation flows", "Audit trail protected from client-side tampering"],
    consumers: ["platform", "principal", "teacher", "family"],
    dataSources: ["identity provider", "policy registry", "school-data"],
    outputs: ["authorization decisions", "approval states", "audit events"],
    humanApprovalRequired: true,
    externalConnection: false,
    status: "architecture",
    activationGates: ["trusted identity source", "server-side policy enforcement", "negative authorization tests"]
  },
  {
    id: "data-interoperability",
    number: 11,
    nameAr: "محرك التكامل وتبادل البيانات",
    nameEn: "Data Interoperability Engine",
    domain: "intelligence_governance",
    purposeAr: "تنظيم تبادل البيانات بين محركات رافين ومراكزها وبواباتها عبر عقود بيانات واضحة.",
    purposeEn: "Coordinate data exchange among Raven engines, centers, and portals through explicit data contracts.",
    capabilitiesAr: ["واجهات موحدة وعقود بيانات", "توجيه الأحداث", "التحقق من التوافق والإصدارات", "منع التكرار والتعارض"],
    capabilitiesEn: ["Standard APIs and data contracts", "Event routing", "Compatibility and version validation", "Duplicate and conflict prevention"],
    consumers: ["platform", "principal", "teacher", "family"],
    dataSources: ["authorized internal engine APIs"],
    outputs: ["validated internal events", "integration health", "conflict reports"],
    humanApprovalRequired: true,
    externalConnection: false,
    status: "architecture",
    activationGates: ["API contracts", "event idempotency", "observability and retry policy"]
  },
  {
    id: "recommendations-decisions",
    number: 12,
    nameAr: "محرك التوصيات والقرارات",
    nameEn: "Recommendations & Decision Support Engine",
    domain: "intelligence_governance",
    purposeAr: "تحليل البيانات والنتائج واقتراح المعالجات والفرص والقرارات مع إبقاء سلطة الاعتماد والتنفيذ للمسؤول المخول.",
    purposeEn: "Analyze data and outcomes and recommend interventions and decisions while reserving approval and execution to authorized people.",
    capabilitiesAr: ["اكتشاف الأنماط والفجوات", "ترتيب التوصيات حسب الأثر والأولوية", "توضيح الأدلة والافتراضات", "إعداد مسودة قرار للمراجعة البشرية"],
    capabilitiesEn: ["Pattern and gap detection", "Prioritize recommendations by impact", "Explain evidence and assumptions", "Prepare decision drafts for human review"],
    consumers: ["platform", "principal", "teacher"],
    dataSources: ["school-data", "workflow-followup", "evidence-documentation-impact", "assessment engines"],
    outputs: ["ranked recommendations", "decision drafts", "explainability records"],
    humanApprovalRequired: true,
    externalConnection: false,
    status: "architecture",
    activationGates: ["validated source data", "explainability and bias evaluation", "human approval workflow"]
  },
  {
    id: "educational-platform-connectors",
    number: 13,
    nameAr: "محرك الربط التقني مع الأنظمة التعليمية",
    nameEn: "Educational Platform Connectivity Engine",
    domain: "external_integrations",
    purposeAr: "إدارة الموصلات الرسمية مع نور ومنصة مدرستي ومنصة رافد عند توافر واجهات وتفويضات معتمدة.",
    purposeEn: "Manage official connectors to Noor, Madrasati, and Rafid when approved interfaces and authorization are available.",
    capabilitiesAr: ["إدارة الموصلات وحالة الاتصال", "المصادقة والتفويض الرسمي", "مراقبة حدود الاستخدام والأخطاء", "تسجيل عمليات التكامل"],
    capabilitiesEn: ["Connector lifecycle and connection status", "Official authentication and authorization", "Rate-limit and error monitoring", "Integration operation logging"],
    consumers: ["platform", "principal", "teacher"],
    dataSources: ["Noor", "Madrasati", "Rafid"],
    outputs: ["connector status", "authorized data exchange", "integration logs"],
    humanApprovalRequired: true,
    externalConnection: true,
    status: "architecture",
    activationGates: ["written confirmation of supported API or official mechanism", "approved credentials and scopes", "vendor terms and security review"]
  },
  {
    id: "raven-external-tools",
    number: 14,
    nameAr: "محرك الربط التقني مع أدوات رافين الخارجية",
    nameEn: "Raven External Tools Connectivity Engine",
    domain: "external_integrations",
    purposeAr: "تشغيل أدوات رافين المتخصصة للاستيراد والتصدير والتحضير وجلب الشواهد عبر موصلات مصرح بها.",
    purposeEn: "Power Raven tools for import, export, lesson preparation, and evidence retrieval through authorized connectors.",
    capabilitiesAr: ["أداة تحضيري", "أداة تحضير الدروس لمنصة مدرستي", "أداة تصدير الغياب إلى نور ومدرستي", "أداة جلب الشواهد من نور ومدرستي", "أدوات استيراد وتصدير ومزامنة ومطابقة البيانات"],
    capabilitiesEn: ["Tahdeeri tool", "Lesson preparation for Madrasati", "Absence export to Noor and Madrasati", "Evidence retrieval from Noor and Madrasati", "Data import, export, synchronization, and reconciliation tools"],
    consumers: ["principal", "teacher"],
    dataSources: ["educational-platform-connectors", "school-data", "governed workflow records"],
    outputs: ["prepared lesson data", "validated import batches", "export packages", "evidence references", "reconciliation reports"],
    humanApprovalRequired: true,
    externalConnection: true,
    status: "architecture",
    activationGates: ["connector availability", "per-tool permission and user confirmation", "preview and validation before write", "idempotency and audit logs"]
  },
  {
    id: "rafeen-ecosystem-connectivity",
    number: 15,
    nameAr: "محرك الربط بين منصات مؤسسة رافيين",
    nameEn: "Rafeen Ecosystem Connectivity Engine",
    domain: "external_integrations",
    purposeAr: "تنظيم الربط وتبادل الخدمات والبيانات المصرح بها بين Raven OS ومتجر رافيين ومنصة رافيين للتدريب والتطوير المهني.",
    purposeEn: "Coordinate authorized service and data exchange between Raven OS, Rafeen Store, and Rafeen Professional Training & Development.",
    capabilitiesAr: ["ربط الهوية عند وجود أساس قانوني وتقني معتمد", "تبادل كتالوجات الخدمات والمنتجات", "الإحالات بين المنصات", "تسجيل الموافقات وحركة البيانات"],
    capabilitiesEn: ["Federated identity where formally approved", "Service and product catalogue exchange", "Cross-platform referrals", "Consent and data-flow logging"],
    consumers: ["platform", "principal", "teacher", "family"],
    dataSources: ["Rafeen Store", "Rafeen Professional Training & Development"],
    outputs: ["cross-platform service links", "approved referrals", "consent and exchange records"],
    humanApprovalRequired: true,
    externalConnection: true,
    status: "architecture",
    activationGates: ["separate product ownership and API contracts", "data minimization and consent", "security and commercial review"]
  },

] as const;

export const RAVEN_ENGINE_GROUPS: ReadonlyArray<{ id: EngineDomain; nameAr: string; nameEn: string }> = [
  { id: "school_operations", nameAr: "المحركات التشغيلية المدرسية", nameEn: "School Operations Engines" },
  { id: "assessment", nameAr: "محركات التقويم والقياس", nameEn: "Assessment & Measurement Engines" },
  { id: "intelligence_governance", nameAr: "محركات الذكاء والحوكمة والحماية", nameEn: "Intelligence, Governance & Protection Engines" },
  { id: "external_integrations", nameAr: "محركات الربط والتكامل الخارجي", nameEn: "External Connectivity Engines" }
];

export function getRavenEngine(id: string): EngineDefinition | undefined {
  return RAVEN_ENGINE_REGISTRY.find((engine) => engine.id === id);
}
