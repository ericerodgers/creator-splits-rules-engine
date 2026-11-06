import type { PlatformTransaction } from "./types.js";

export const PLATFORM_MATCHERS: Record<string, string[]> = {
  onlyfans: ["Fenix", "Fenix Internet", "Fenix International", "OnlyFans"],
  fansly: ["Select Media"],
  fanvue: ["fanvue.com"],
  youtube: ["Google", "Google LLC"],
};

/**
 * Returns the platform key for a transaction, or null if no match.
 * Case-sensitive. Checks both name and merchantName fields.
 */
export function detectPlatform(
  name: string,
  merchantName: string | null
): string | null {
  for (const [platform, matchers] of Object.entries(PLATFORM_MATCHERS)) {
    for (const matcher of matchers) {
      if (name === matcher || merchantName === matcher) {
        return platform;
      }
    }
  }
  return null;
}

/**
 * Returns true when a transaction is a settled credit from a known platform.
 * Convenience function for external consumers — the app's detect-deposits job
 * calls detectPlatform directly to retain the platform name.
 */
export function isEligibleDeposit(tx: PlatformTransaction): boolean {
  return (
    !tx.pending &&
    tx.amount < 0 &&
    detectPlatform(tx.name, tx.merchantName) !== null
  );
}
