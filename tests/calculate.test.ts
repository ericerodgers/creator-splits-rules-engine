import { describe, it, expect } from "vitest";
import { calculateCharge } from "../src/calculate.js";

describe("calculateCharge", () => {
  it("calculates 30% of $100.00 as $30.00", () => {
    expect(calculateCharge(10000n, 3000)).toBe(3000n);
  });

  it("calculates 20% of $500.00 as $100.00", () => {
    expect(calculateCharge(50000n, 2000)).toBe(10000n);
  });

  it("calculates 100% of $100.00 as $100.00", () => {
    expect(calculateCharge(10000n, 10000)).toBe(10000n);
  });

  it("truncates toward zero (1 cent at 33.33%)", () => {
    // (1n * 3333n) / 10000n = 0n — BigInt division truncates
    expect(calculateCharge(1n, 3333)).toBe(0n);
  });

  it("returns 0n for zero deposit amount", () => {
    expect(calculateCharge(0n, 3000)).toBe(0n);
  });

  it("returns 0n for zero percentage", () => {
    expect(calculateCharge(10000n, 0)).toBe(0n);
  });
});
