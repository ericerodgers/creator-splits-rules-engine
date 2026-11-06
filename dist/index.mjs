// src/matchers.ts
var PLATFORM_MATCHERS = {
  onlyfans: ["Fenix", "Fenix Internet", "Fenix International", "OnlyFans"],
  fansly: ["Select Media"],
  fanvue: ["fanvue.com"],
  youtube: ["Google", "Google LLC"]
};
function detectPlatform(name, merchantName) {
  for (const [platform, matchers] of Object.entries(PLATFORM_MATCHERS)) {
    for (const matcher of matchers) {
      if (name === matcher || merchantName === matcher) {
        return platform;
      }
    }
  }
  return null;
}
function isEligibleDeposit(tx) {
  return !tx.pending && tx.amount < 0 && detectPlatform(tx.name, tx.merchantName) !== null;
}

// src/calculate.ts
function calculateCharge(depositAmountCents, percentageBps) {
  return depositAmountCents * BigInt(percentageBps) / 10000n;
}

// src/eligibility.ts
function canGenerateCharge(splitStatus, creatorStatus) {
  return splitStatus === "active" && creatorStatus === "active";
}
function resolveOverlappingSplits(splits) {
  if (splits.length === 0) return null;
  return [...splits].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
  )[0];
}
export {
  PLATFORM_MATCHERS,
  calculateCharge,
  canGenerateCharge,
  detectPlatform,
  isEligibleDeposit,
  resolveOverlappingSplits
};
