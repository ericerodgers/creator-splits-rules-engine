"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  PLATFORM_MATCHERS: () => PLATFORM_MATCHERS,
  calculateCharge: () => calculateCharge,
  canGenerateCharge: () => canGenerateCharge,
  detectPlatform: () => detectPlatform,
  isEligibleDeposit: () => isEligibleDeposit,
  resolveOverlappingSplits: () => resolveOverlappingSplits
});
module.exports = __toCommonJS(index_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PLATFORM_MATCHERS,
  calculateCharge,
  canGenerateCharge,
  detectPlatform,
  isEligibleDeposit,
  resolveOverlappingSplits
});
