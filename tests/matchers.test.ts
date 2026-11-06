import { describe, it, expect } from "vitest";
import {
  detectPlatform,
  PLATFORM_MATCHERS,
  isEligibleDeposit,
} from "../src/matchers.js";

describe("detectPlatform", () => {
  it('matches onlyfans via name "Fenix"', () => {
    expect(detectPlatform("Fenix", null)).toBe("onlyfans");
  });

  it('matches onlyfans via name "Fenix Internet"', () => {
    expect(detectPlatform("Fenix Internet", null)).toBe("onlyfans");
  });

  it('matches onlyfans via name "Fenix International"', () => {
    expect(detectPlatform("Fenix International", null)).toBe("onlyfans");
  });

  it('matches onlyfans via name "OnlyFans"', () => {
    expect(detectPlatform("OnlyFans", null)).toBe("onlyfans");
  });

  it('matches onlyfans via merchantName "Fenix Internet"', () => {
    expect(detectPlatform("some raw description", "Fenix Internet")).toBe("onlyfans");
  });

  it('matches fansly via name "Select Media"', () => {
    expect(detectPlatform("Select Media", null)).toBe("fansly");
  });

  it('matches fansly via merchantName "Select Media"', () => {
    expect(detectPlatform("raw desc", "Select Media")).toBe("fansly");
  });

  it('matches fanvue via name "fanvue.com"', () => {
    expect(detectPlatform("fanvue.com", null)).toBe("fanvue");
  });

  it('matches youtube via name "Google"', () => {
    expect(detectPlatform("Google", null)).toBe("youtube");
  });

  it('matches youtube via name "Google LLC"', () => {
    expect(detectPlatform("Google LLC", null)).toBe("youtube");
  });

  it('matches youtube via merchantName "Google LLC"', () => {
    expect(detectPlatform("ACH Credit", "Google LLC")).toBe("youtube");
  });

  it("returns null for no match with null merchantName", () => {
    expect(detectPlatform("Amazon", null)).toBeNull();
  });

  it("returns null when neither name nor merchantName match", () => {
    expect(detectPlatform("Walmart", "Walmart Inc")).toBeNull();
  });

  it("is case-sensitive and does not match lowercase variants", () => {
    expect(detectPlatform("fenix", null)).toBeNull();
    expect(detectPlatform("select media", null)).toBeNull();
    expect(detectPlatform("google", null)).toBeNull();
  });
});

describe("PLATFORM_MATCHERS", () => {
  it("exports all expected platforms", () => {
    expect(Object.keys(PLATFORM_MATCHERS)).toEqual(
      expect.arrayContaining(["onlyfans", "fansly", "fanvue", "youtube"])
    );
  });
});

describe("isEligibleDeposit", () => {
  it("returns true for a settled credit from a known platform", () => {
    expect(
      isEligibleDeposit({
        name: "Fenix Internet",
        merchantName: null,
        amount: -100,
        pending: false,
      })
    ).toBe(true);
  });

  it("returns false when pending=true", () => {
    expect(
      isEligibleDeposit({
        name: "Fenix Internet",
        merchantName: null,
        amount: -100,
        pending: true,
      })
    ).toBe(false);
  });

  it("returns false for a positive amount (debit, not credit)", () => {
    expect(
      isEligibleDeposit({
        name: "Fenix Internet",
        merchantName: null,
        amount: 100,
        pending: false,
      })
    ).toBe(false);
  });

  it("returns false when no platform matches", () => {
    expect(
      isEligibleDeposit({
        name: "Amazon",
        merchantName: null,
        amount: -100,
        pending: false,
      })
    ).toBe(false);
  });

  it("matches via merchantName when name does not match", () => {
    expect(
      isEligibleDeposit({
        name: "ACH CREDIT",
        merchantName: "Select Media",
        amount: -50,
        pending: false,
      })
    ).toBe(true);
  });
});
