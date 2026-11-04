/**
 * Transactional command boundary for the first five operational engines.
 * A production adapter must implement the unit of work with one durable transaction
 * covering domain writes and audit append. No in-memory fallback is provided.
 */
import "server-only";
import { authorize, type RavenPermission, type TrustedActor } from "@/lib/security/access-control";
import { createAuditEvent, type AuditEventInput } from "@/lib/security/audit";

export type RavenOperationalTransaction = Readonly<{
  appendAudit(event: AuditEventInput): Promise<void>;
  /** Atomically reserve a scoped idempotency key; false means it was already used. */
  claimIdempotency(input: Readonly<{ key: string; actorId: string; schoolId: string; engineId: string; operation: string }>): Promise<boolean>;
  // Concrete repositories are supplied by the approved persistence adapter.
  repository<TRepository>(name: "school-data" | "decisions-assignments" | "workflow-followup" | "evidence-impact" | "operational-plans"): TRepository;
}>;

export interface RavenOperationalUnitOfWork {
  /** Must atomically commit or roll back domain writes and audit events together. */
  transaction<T>(work: (tx: RavenOperationalTransaction) => Promise<T>): Promise<T>;
}

export type OperationalCommand<TInput, TOutput> = Readonly<{
  engineId: "school-data" | "decisions-assignments" | "workflow-followup" | "evidence-documentation-impact" | "operational-plans";
  operation: string;
  permission: RavenPermission;
  schoolId: string;
  resourceType: string;
  resourceId: string | null;
  correlationId: string;
  idempotencyKey: string;
  input: TInput;
  execute: (tx: RavenOperationalTransaction, actor: TrustedActor, input: TInput) => Promise<TOutput>;
}>;

function auditEvent<TInput, TOutput>(actor: TrustedActor, command: OperationalCommand<TInput, TOutput>, outcome: AuditEventInput["outcome"], reasonCode?: string): AuditEventInput {
  return createAuditEvent({
    eventType: `${command.engineId}:${command.operation}`,
    outcome,
    actorId: actor.subjectId,
    actorRole: actor.role,
    schoolId: command.schoolId,
    resourceType: command.resourceType,
    resourceId: command.resourceId,
    correlationId: command.correlationId,
    occurredAt: new Date().toISOString(),
    reasonCode,
    sourceSystem: "raven-os",
  });
}

/**
 * The command's actor must come from the verified server session adapter.
 * The unit-of-work adapter is mandatory; no database adapter means no write path.
 */
export async function runOperationalCommand<TInput, TOutput>(
  command: OperationalCommand<TInput, TOutput>,
  actor: TrustedActor | null,
  unitOfWork: RavenOperationalUnitOfWork | null,
): Promise<TOutput> {
  if (!unitOfWork) throw new Error("RAVEN_PERSISTENCE_ADAPTER_NOT_CONFIGURED");
  if (!actor) throw new Error("RAVEN_UNAUTHENTICATED");
  const decision = authorize({ actor, permission: command.permission, targetSchoolId: command.schoolId });
  if (!decision.allowed) throw new Error(`RAVEN_AUTHORIZATION_DENIED:${decision.reason}`);
  if (actor.schoolId && actor.schoolId !== command.schoolId) throw new Error("RAVEN_TENANT_SCOPE_DENIED");
  if (!command.correlationId.trim() || !command.idempotencyKey.trim()) throw new Error("RAVEN_COMMAND_METADATA_REQUIRED");

  return unitOfWork.transaction(async (tx) => {
    const claimed = await tx.claimIdempotency({
      key: command.idempotencyKey,
      actorId: decision.actor.subjectId,
      schoolId: command.schoolId,
      engineId: command.engineId,
      operation: command.operation,
    });
    if (!claimed) throw new Error("RAVEN_DUPLICATE_COMMAND");
    await tx.appendAudit(auditEvent(decision.actor, command, "accepted"));
    const output = await command.execute(tx, decision.actor, command.input);
    await tx.appendAudit(auditEvent(decision.actor, command, "completed"));
    return output;
  });
}
