export class Account {
  constructor(
    public id: string,
    public balance: number
  ) {}

  deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error("Deposit amount must be positive");
    }
    this.balance += amount;
  }

  withdraw(amount: number): void {
    if (amount <= 0) {
      throw new Error("Withdraw amount must be positive");
    }
    if (this.balance < amount) {
      throw new Error("Insufficient funds");
    }
    this.balance -= amount;
  }

  transfer(amount: number): void {
    this.withdraw(amount);
  }

  receive(amount: number): void {
    this.deposit(amount);
  }
}
