/**
 * Typed audit event envelope. Persistence must be supplied by a trusted server-side
 * audit sink; this module deliberately does not log to console or persist in memory.
 */
import "server-only";

export type AuditOutcome = "accepted" | "denied" | "completed" | "failed";
export type AuditEventInput = Readonly<{
  eventType: string;
  outcome: AuditOutcome;
  actorId: string | null;
  actorRole: string | null;
  schoolId: string | null;
  resourceType: string;
  resourceId: string | null;
  correlationId: string;
  occurredAt: string;
  reasonCode?: string;
  sourceSystem?: string;
}>;

const SAFE_TOKEN = /^[a-zA-Z0-9:_./-]{1,160}$/;

export function createAuditEvent(input: AuditEventInput): AuditEventInput {
  if (!SAFE_TOKEN.test(input.eventType) ||
      !SAFE_TOKEN.test(input.resourceType) ||
      !SAFE_TOKEN.test(input.correlationId) ||
      !Number.isFinite(Date.parse(input.occurredAt))) {
    throw new Error("Invalid Raven audit event envelope");
  }
  if (input.actorId && !SAFE_TOKEN.test(input.actorId)) throw new Error("Invalid audit actor identifier");
  if (input.schoolId && !SAFE_TOKEN.test(input.schoolId)) throw new Error("Invalid audit school identifier");
  if (input.resourceId && !SAFE_TOKEN.test(input.resourceId)) throw new Error("Invalid audit resource identifier");
  if (input.reasonCode && !SAFE_TOKEN.test(input.reasonCode)) throw new Error("Invalid audit reason code");
  if (input.sourceSystem && !SAFE_TOKEN.test(input.sourceSystem)) throw new Error("Invalid audit source system");
  return Object.freeze({ ...input });
}

export type AuditSink = (event: AuditEventInput) => Promise<void>;

/** Fail closed if no durable audit sink has been wired into the server runtime. */
export async function writeAuditEvent(sink: AuditSink | null, event: AuditEventInput): Promise<void> {
  if (!sink) throw new Error("Raven audit sink is not configured");
  await sink(createAuditEvent(event));
}
