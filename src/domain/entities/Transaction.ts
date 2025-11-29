export type TransactionType = "deposit" | "withdraw" | "transfer";

export class Transaction {
  constructor(
    public id: string,
    public type: TransactionType,
    public accountId: string,
    public amount: number,
    public timestamp: Date,
    public destinationAccountId?: string
  ) {}
}
