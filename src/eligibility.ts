import type { SplitStatus, CreatorStatus } from "./types.js";

/**
 * Both the split AND creator must be active before any charge can be generated.
 */
export function canGenerateCharge(
  splitStatus: SplitStatus,
  creatorStatus: CreatorStatus
): boolean {
  return splitStatus === "active" && creatorStatus === "active";
}

/**
 * Resolves a list of splits that match the same platform by returning the winner
 * according to the comparator (default: oldest createdAt wins).
 * Returns null for an empty list.
 */
export function resolveOverlappingSplits<T extends { createdAt: Date }>(
  splits: T[],
  comparator?: (a: T, b: T) => number
): T | null {
  if (splits.length === 0) return null;
  const cmp = comparator ?? ((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  return [...splits].sort(cmp)[0];
}
