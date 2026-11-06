interface PlatformTransaction {
    name: string;
    merchantName: string | null;
    /** Plaid convention: negative = credit to account, positive = debit */
    amount: number;
    pending: boolean;
}
type SplitStatus = "pending" | "active" | "disrupted" | "canceled";
type CreatorStatus = "active" | "suspended" | "offboarded";

declare const PLATFORM_MATCHERS: Record<string, string[]>;
/**
 * Returns the platform key for a transaction, or null if no match.
 * Case-sensitive. Checks both name and merchantName fields.
 */
declare function detectPlatform(name: string, merchantName: string | null): string | null;
/**
 * Returns true when a transaction is a settled credit from a known platform.
 * Convenience function for external consumers — the app's detect-deposits job
 * calls detectPlatform directly to retain the platform name.
 */
declare function isEligibleDeposit(tx: PlatformTransaction): boolean;

/**
 * Calculates the agency charge amount for a deposit using basis points.
 * Uses BigInt arithmetic to avoid floating-point precision errors.
 * Division truncates toward zero (standard BigInt behavior).
 *
 * @param depositAmountCents - Deposit amount in cents (bigint)
 * @param percentageBps      - Split percentage in basis points (e.g. 3000 = 30%)
 */
declare function calculateCharge(depositAmountCents: bigint, percentageBps: number): bigint;

/**
 * Both the split AND creator must be active before any charge can be generated.
 */
declare function canGenerateCharge(splitStatus: SplitStatus, creatorStatus: CreatorStatus): boolean;
/**
 * Resolves a list of splits that all match the same platform by returning the
 * oldest one (earliest createdAt). Returns null for an empty list.
 * Used when a creator has multiple active splits for the same platform.
 */
declare function resolveOverlappingSplits<T extends {
    createdAt: Date;
}>(splits: T[]): T | null;

export { type CreatorStatus, PLATFORM_MATCHERS, type PlatformTransaction, type SplitStatus, calculateCharge, canGenerateCharge, detectPlatform, isEligibleDeposit, resolveOverlappingSplits };
