/**
 * Safe engine catalogue service. It reports registry metadata only.
 * No engine operation is executed until a server-side implementation is explicitly registered.
 */
import "server-only";
import { RAVEN_ENGINE_REGISTRY, getRavenEngine } from "@/lib/raven-engines";
import { authorize, type RavenPermission, type TrustedActor } from "@/lib/security/access-control";

export type EngineOperation = Readonly<{
  engineId: string;
  operation: string;
  requiredPermission: RavenPermission;
  targetSchoolId: string | null;
}>;

export type EngineRuntimeHandler = (input: unknown, actor: TrustedActor) => Promise<unknown>;

const handlers = new Map<string, EngineRuntimeHandler>();

function operationKey(engineId: string, operation: string): string {
  return `${engineId}:${operation}`;
}

/** Registration is intended for trusted server bootstrap modules only. */
export function registerEngineHandler(engineId: string, operation: string, handler: EngineRuntimeHandler): void {
  if (!getRavenEngine(engineId)) throw new Error("Unknown Raven engine");
  if (!/^[a-zA-Z0-9:_-]{1,80}$/.test(operation)) throw new Error("Invalid engine operation");
  const key = operationKey(engineId, operation);
  if (handlers.has(key)) throw new Error("Engine operation already registered");
  handlers.set(key, handler);
}

export function getEngineCatalogue() {
  return RAVEN_ENGINE_REGISTRY.map(({ id, number, nameAr, nameEn, domain, status, externalConnection }) => ({
    id, number, nameAr, nameEn, domain, status, externalConnection,
    executableOperations: [] as string[],
  }));
}

/** Fail closed: an operation without a registered server handler is unavailable. */
export async function executeEngineOperation(
  operation: EngineOperation,
  actor: TrustedActor | null,
  input: unknown,
): Promise<unknown> {
  const definition = getRavenEngine(operation.engineId);
  if (!definition) throw new Error("Unknown Raven engine");
  const decision = authorize({ actor, permission: operation.requiredPermission, targetSchoolId: operation.targetSchoolId });
  if (!decision.allowed) throw new Error("Raven authorization denied");
  const handler = handlers.get(operationKey(operation.engineId, operation.operation));
  if (!handler) throw new Error("Raven engine operation is not implemented");
  return handler(input, decision.actor);
}
