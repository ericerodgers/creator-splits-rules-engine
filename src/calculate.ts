/**
 * Calculates the agency charge amount for a deposit using basis points.
 * Uses BigInt arithmetic to avoid floating-point precision errors.
 * Division truncates toward zero (standard BigInt behavior).
 *
 * @param depositAmountCents - Deposit amount in cents (bigint)
 * @param percentageBps      - Split percentage in basis points (e.g. 3000 = 30%)
 */
export function calculateCharge(
  depositAmountCents: bigint,
  percentageBps: number
): bigint {
  return (depositAmountCents * BigInt(percentageBps)) / 10000n;
}
