export interface PlatformTransaction {
  name: string;
  merchantName: string | null;
  /** Plaid convention: negative = credit to account, positive = debit */
  amount: number;
  pending: boolean;
}

export type SplitStatus = "pending" | "active" | "disrupted" | "canceled";
export type CreatorStatus = "active" | "suspended" | "offboarded";
