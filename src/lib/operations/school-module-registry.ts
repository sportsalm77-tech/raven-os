export const RAVEN_OPERATION_MODULES = {
  decisions: {
    table: "raven_school_decisions",
    portal: "principal",
    titleAr: "القرارات الإدارية",
    fields: ["school_id", "title", "details", "status", "created_by"],
  },
  assignments: {
    table: "raven_school_assignments",
    portal: "principal",
    titleAr: "التكليفات والمتابعة",
    fields: ["school_id", "decision_id", "title", "assignee_id", "due_at", "status", "created_by"],
  },
  plans: {
    table: "raven_school_plans",
    portal: "principal",
    titleAr: "الخطة التشغيلية والتطويرية",
    fields: ["school_id", "title", "plan_type", "status", "starts_on", "ends_on", "created_by"],
  },
  evidence: {
    table: "raven_school_evidence",
    portal: "principal",
    titleAr: "الشواهد والتوثيق",
    fields: ["school_id", "plan_id", "title", "description", "status", "created_by"],
  },
  impact: {
    table: "raven_school_impact",
    portal: "principal",
    titleAr: "قياس الأثر",
    fields: ["school_id", "plan_id", "indicator_name", "baseline", "target", "actual", "measured_on", "created_by"],
  },
  documents: {
    table: "raven_school_data_documents",
    portal: "principal",
    titleAr: "مركز البيانات المدرسية",
    fields: ["school_id", "title", "document_type", "storage_path", "created_by"],
  },
} as const;

export type RavenOperationModule = keyof typeof RAVEN_OPERATION_MODULES;

export function isRavenOperationModule(value: string): value is RavenOperationModule {
  return Object.prototype.hasOwnProperty.call(RAVEN_OPERATION_MODULES, value);
}

export function schoolOperationTable(module: RavenOperationModule): string {
  return RAVEN_OPERATION_MODULES[module].table;
}
