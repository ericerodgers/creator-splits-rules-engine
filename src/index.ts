export { PLATFORM_MATCHERS, detectPlatform, isEligibleDeposit } from "./matchers.js";
export { calculateCharge } from "./calculate.js";
export { canGenerateCharge, resolveOverlappingSplits } from "./eligibility.js";
export type { PlatformTransaction, SplitStatus, CreatorStatus } from "./types.js";
