/**
 * Validated operational status transitions.
 * Authorizing the actor and persisting audit events are separate required steps.
 */
export type OperationStatus = "draft" | "submitted" | "approved" | "closed";
export type OperationTransition = Readonly<{
  from: OperationStatus;
  to: OperationStatus;
  action: "submit" | "approve" | "return" | "close";
}>;

const transitions: readonly OperationTransition[] = [
  { from: "draft", to: "submitted", action: "submit" },
  { from: "submitted", to: "approved", action: "approve" },
  { from: "submitted", to: "draft", action: "return" },
  { from: "approved", to: "closed", action: "close" },
];

export function getOperationTransition(
  current: string,
  action: string,
): OperationTransition | null {
  return transitions.find(t => t.from === current && t.action === action) ?? null;
}

export function isTerminalOperationStatus(status: string): boolean {
  return status === "closed";
}
