import { Pool, QueryResult } from "pg";
import { IStorageAdapter } from "./adapter.interface";
import { Account, Transaction } from "./types";

export class PostgresAdapter implements IStorageAdapter {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DATABASE_HOST || "localhost",
      port: parseInt(process.env.DATABASE_PORT || "5432"),
      user: process.env.DATABASE_USER || "postgres",
      password: process.env.DATABASE_PASSWORD || "postgres",
      database: process.env.DATABASE_NAME || "small_bank",
    });

    this.initializeTables();
  }

  private async initializeTables(): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS accounts (
          id VARCHAR(255) PRIMARY KEY,
          balance DECIMAL(15, 2) NOT NULL DEFAULT 0
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS transactions (
          id VARCHAR(255) PRIMARY KEY,
          type VARCHAR(50) NOT NULL,
          account_id VARCHAR(255) NOT NULL,
          destination_account_id VARCHAR(255),
          amount DECIMAL(15, 2) NOT NULL,
          timestamp TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_transactions_account_id 
        ON transactions(account_id)
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_transactions_destination_account_id 
        ON transactions(destination_account_id)
      `);
    } finally {
      client.release();
    }
  }

  async getAccount(accountId: string): Promise<Account | null> {
    const result: QueryResult<Account> = await this.pool.query(
      "SELECT id, balance::numeric FROM accounts WHERE id = $1",
      [accountId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return {
      id: result.rows[0].id,
      balance: parseFloat(String(result.rows[0].balance)),
    };
  }

  async createAccount(
    accountId: string,
    initialBalance: number = 0
  ): Promise<Account> {
    await this.pool.query(
      "INSERT INTO accounts (id, balance) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING",
      [accountId, initialBalance]
    );

    const account = await this.getAccount(accountId);
    if (!account) {
      throw new Error("Failed to create account");
    }

    return account;
  }

  async updateAccountBalance(
    accountId: string,
    newBalance: number
  ): Promise<Account> {
    await this.pool.query("UPDATE accounts SET balance = $1 WHERE id = $2", [
      newBalance,
      accountId,
    ]);

    const account = await this.getAccount(accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    return account;
  }

  async addTransaction(
    transaction: Omit<Transaction, "id" | "timestamp">
  ): Promise<Transaction> {
    const id = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date();

    await this.pool.query(
      `INSERT INTO transactions (id, type, account_id, destination_account_id, amount, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        id,
        transaction.type,
        transaction.accountId,
        transaction.destinationAccountId || null,
        transaction.amount,
        timestamp,
      ]
    );

    return {
      id,
      ...transaction,
      timestamp,
    };
  }

  async getTransactions(
    accountId: string,
    limit: number = 10
  ): Promise<Transaction[]> {
    const result: QueryResult<Transaction> = await this.pool.query(
      `SELECT id, type, account_id as "accountId", destination_account_id as "destinationAccountId", 
              amount, timestamp
       FROM transactions
       WHERE account_id = $1 OR destination_account_id = $1
       ORDER BY timestamp DESC
       LIMIT $2`,
      [accountId, limit]
    );

    return result.rows.map((row) => ({
      id: row.id,
      type: row.type as "deposit" | "withdraw" | "transfer",
      accountId: row.accountId,
      destinationAccountId: row.destinationAccountId || undefined,
      amount: parseFloat(row.amount as any),
      timestamp: row.timestamp,
    }));
  }

  async reset(): Promise<void> {
    await this.pool.query(
      "TRUNCATE TABLE accounts, transactions RESTART IDENTITY"
    );
  }
}
