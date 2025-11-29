export interface Account {
  id: string;
  balance: number;
}

export interface Transaction {
  id: string;
  type: "deposit" | "withdraw" | "transfer";
  accountId: string;
  destinationAccountId?: string;
  amount: number;
  timestamp: Date;
}
