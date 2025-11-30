export interface Account {
  id: number;
  balance: number;
}

export interface Transaction {
  id: string;
  type: "deposit" | "withdraw" | "transfer";
  accountId: number;
  destinationAccountId?: number;
  amount: number;
  timestamp: Date;
}
