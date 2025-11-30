import { DataSourceOptions } from "typeorm";
import { AccountEntity } from "@/lib/modules/account/account.entity";
import { TransactionEntity } from "@/lib/modules/transaction/transaction.entity";

export const typeormConfig: DataSourceOptions = {
  type: "postgres",
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT || "5432"),
  username: process.env.DATABASE_USER || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
  database: process.env.DATABASE_NAME || "small_bank",
  entities: [AccountEntity, TransactionEntity],
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV === "development",
};
