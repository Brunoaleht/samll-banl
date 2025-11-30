import "reflect-metadata";
import { DataSource } from "typeorm";
import { AccountEntity } from "@/lib/modules/account/account.entity";
import { TransactionEntity } from "@/lib/modules/transaction/transaction.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST || "localhost",
  port: Number(process.env.DATABASE_PORT || 5432),
  username: process.env.DATABASE_USER || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
  database: process.env.DATABASE_NAME || "small_bank",
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV === "development",
  entities: [AccountEntity, TransactionEntity],
});

let initialized = false;

export async function getDataSource() {
  if (!initialized) {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    initialized = true;
  }

  return AppDataSource;
}
