import { describe, it, expect } from "vitest";
import { canGenerateCharge, resolveOverlappingSplits } from "../src/eligibility.js";

describe("canGenerateCharge", () => {
  it("returns true only when both split and creator are active", () => {
    expect(canGenerateCharge("active", "active")).toBe(true);
  });

  it("returns false when split is not active", () => {
    expect(canGenerateCharge("pending", "active")).toBe(false);
    expect(canGenerateCharge("disrupted", "active")).toBe(false);
    expect(canGenerateCharge("canceled", "active")).toBe(false);
  });

  it("returns false when creator is not active", () => {
    expect(canGenerateCharge("active", "suspended")).toBe(false);
    expect(canGenerateCharge("active", "offboarded")).toBe(false);
  });
});

describe("resolveOverlappingSplits", () => {
  it("returns null for an empty list", () => {
    expect(resolveOverlappingSplits([])).toBeNull();
  });

  it("returns the single element when list has one entry", () => {
    const split = { id: "a", createdAt: new Date("2024-06-01") };
    expect(resolveOverlappingSplits([split])).toBe(split);
  });

  it("returns the oldest split (earliest createdAt) from multiple", () => {
    const older = { id: "a", createdAt: new Date("2024-01-01") };
    const newer = { id: "b", createdAt: new Date("2024-06-01") };
    expect(resolveOverlappingSplits([newer, older])).toBe(older);
  });

  it("accepts a custom comparator (newest first)", () => {
    const older = { id: "a", createdAt: new Date("2024-01-01") };
    const newer = { id: "b", createdAt: new Date("2024-06-01") };
    const newestFirst = (a: typeof older, b: typeof older) =>
      b.createdAt.getTime() - a.createdAt.getTime();
    expect(resolveOverlappingSplits([older, newer], newestFirst)).toBe(newer);
  });

  it("does not mutate the input array", () => {
    const splits = [
      { id: "b", createdAt: new Date("2024-06-01") },
      { id: "a", createdAt: new Date("2024-01-01") },
    ];
    resolveOverlappingSplits(splits);
    expect(splits[0].id).toBe("b");
  });
});
