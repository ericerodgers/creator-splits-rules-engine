# @creator-splits/rules-engine

Deposit-matching and charge-calculation rules for creator split platforms.

The core logic that determines which bank deposits trigger a split charge, and how much to charge. Zero dependencies. TypeScript-first. Used by [payment-splits](https://github.com/ericerodgers/payment-splits).

## Install

```bash
npm install @creator-splits/rules-engine
```

## Usage

### Deposit matching

```ts
import { detectPlatform, isEligibleDeposit, PLATFORM_MATCHERS } from "@creator-splits/rules-engine";

// Check if a Plaid transaction is a known platform deposit
detectPlatform("Fenix Internet", null);     // → "onlyfans"
detectPlatform("Select Media", null);        // → "fansly"
detectPlatform("fanvue.com", null);          // → "fanvue"
detectPlatform("Google LLC", null);          // → "youtube"
detectPlatform("Amazon", null);              // → null

// Combined eligibility gate (settled + credit + known platform)
isEligibleDeposit({
  name: "Fenix Internet",
  merchantName: null,
  amount: -1000,   // Plaid convention: negative = credit
  pending: false,
}); // → true
```

### Charge calculation

```ts
import { calculateCharge } from "@creator-splits/rules-engine";

// percentageBps: basis points (3000 = 30%)
calculateCharge(100000n, 3000); // → 30000n  ($300 on a $1,000 deposit)
calculateCharge(100000n, 2000); // → 20000n  ($200 on a $1,000 deposit)
```

### Charge eligibility

```ts
import { canGenerateCharge } from "@creator-splits/rules-engine";

canGenerateCharge("active", "active");       // → true
canGenerateCharge("disrupted", "active");    // → false
canGenerateCharge("active", "suspended");    // → false
```

### Overlap resolution

```ts
import { resolveOverlappingSplits } from "@creator-splits/rules-engine";

// Returns the split that wins when multiple active splits match the same platform.
// Default: oldest (earliest createdAt) wins.
const winner = resolveOverlappingSplits(matchingSplits);

// Custom comparator (e.g. newest wins):
const winner = resolveOverlappingSplits(matchingSplits, (a, b) =>
  b.createdAt.getTime() - a.createdAt.getTime()
);
```

## API

### `detectPlatform(name, merchantName)`

Returns the platform key (`"onlyfans"`, `"fansly"`, `"fanvue"`, `"youtube"`) for a Plaid transaction, or `null` if no match. Case-sensitive. Checks both the raw `name` and Plaid-normalized `merchantName` fields.

### `isEligibleDeposit(tx)`

Returns `true` when a transaction is a settled (non-pending) credit from a known platform. Convenience function combining the pending filter, credit filter, and platform match.

### `PLATFORM_MATCHERS`

`Record<string, string[]>` — the full map of platform keys to their known bank memo strings. Extend or inspect directly.

### `calculateCharge(depositAmountCents, percentageBps)`

Computes the agency charge amount using BigInt arithmetic (no floating-point errors). `percentageBps` is basis points: 3000 = 30%. Division truncates toward zero.

### `canGenerateCharge(splitStatus, creatorStatus)`

Returns `true` only when both the split and creator are `"active"`. Guards the deposit detection path.

### `resolveOverlappingSplits(splits, comparator?)`

Returns the winning element from an array of splits that all match the same platform. Default policy: oldest `createdAt` wins. Pass a custom comparator to override. Returns `null` for an empty array.

## Types

```ts
interface PlatformTransaction {
  name: string;
  merchantName: string | null;
  amount: number;    // Plaid convention: negative = credit to account
  pending: boolean;
}

type SplitStatus   = "pending" | "active" | "disrupted" | "canceled";
type CreatorStatus = "active" | "suspended" | "offboarded";
```

## Supported platforms

| Platform | Memo strings |
|---|---|
| OnlyFans | `Fenix`, `Fenix Internet`, `Fenix International`, `OnlyFans` |
| Fansly | `Select Media` |
| FanVue | `fanvue.com` |
| YouTube | `Google`, `Google LLC` |

## License

MIT
