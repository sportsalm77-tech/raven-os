/**
 * Versioned, transport-neutral contracts for Raven's shared engine layer.
 * These schemas are deliberately dependency-free and reject unknown/malformed envelopes.
 */
export const RAVEN_API_CONTRACT_VERSION = "1.0.0";

export type RavenRequestContext = Readonly<{
  correlationId: string;
  requestedAt: string;
  actorId: string;
  actorRole: string;
  schoolId: string | null;
  portal: "platform" | "principal" | "teacher" | "family";
}>;

export type EngineCommand<TPayload = unknown> = Readonly<{
  contractVersion: typeof RAVEN_API_CONTRACT_VERSION;
  engineId: string;
  operation: string;
  context: RavenRequestContext;
  payload: TPayload;
  idempotencyKey: string;
}>;

export type EngineResult<TData = unknown> =
  | Readonly<{ ok: true; correlationId: string; engineId: string; data: TData; provenance: readonly string[] }>
  | Readonly<{ ok: false; correlationId: string; engineId: string; error: { code: string; message: string; retryable: boolean } }>;

const TOKEN = /^[a-zA-Z0-9:_./-]{1,160}$/;
const PORTALS = new Set(["platform", "principal", "teacher", "family"]);

export function validateEngineCommand(value: unknown): value is EngineCommand {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  const ctx = v.context as Record<string, unknown> | null;
  return v.contractVersion === RAVEN_API_CONTRACT_VERSION &&
    typeof v.engineId === "string" && TOKEN.test(v.engineId) &&
    typeof v.operation === "string" && TOKEN.test(v.operation) &&
    typeof v.idempotencyKey === "string" && TOKEN.test(v.idempotencyKey) &&
    !!ctx && typeof ctx === "object" &&
    typeof ctx.correlationId === "string" && TOKEN.test(ctx.correlationId) &&
    typeof ctx.requestedAt === "string" && Number.isFinite(Date.parse(ctx.requestedAt)) &&
    typeof ctx.actorId === "string" && TOKEN.test(ctx.actorId) &&
    typeof ctx.actorRole === "string" && TOKEN.test(ctx.actorRole) &&
    (ctx.schoolId === null || (typeof ctx.schoolId === "string" && TOKEN.test(ctx.schoolId))) &&
    typeof ctx.portal === "string" && PORTALS.has(ctx.portal) &&
    Object.prototype.hasOwnProperty.call(v, "payload");
}

export function successResult<T>(engineId: string, correlationId: string, data: T, provenance: readonly string[] = []): EngineResult<T> {
  return { ok: true, engineId, correlationId, data, provenance };
}

export function failureResult(engineId: string, correlationId: string, code: string, message: string, retryable = false): EngineResult<never> {
  return { ok: false, engineId, correlationId, error: { code, message, retryable } };
}
