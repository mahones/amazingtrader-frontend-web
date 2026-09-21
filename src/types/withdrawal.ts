export type WithdrawalStatus = "pending" | "approved" | "rejected";

export interface Withdrawal {
  id: number;
  amount: number;
  payment_method: string;
  receiving_identifier: string;
  status: WithdrawalStatus;
  reviewed_at: string | null;
  created_at: string;
  partner?: { code: string; user?: { name: string; email: string } };
}
