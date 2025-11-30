import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { AccountEntity } from "@/lib/modules/account/account.entity";

export type TransactionType = "deposit" | "withdraw" | "transfer";

@Entity("transactions")
export class TransactionEntity {
  @PrimaryColumn({ type: "varchar", length: 255 })
  id!: string;

  @Column({ type: "varchar", length: 50 })
  type!: TransactionType;

  @Column({ type: "varchar", length: 255, name: "account_id" })
  accountId!: string;

  @ManyToOne(() => AccountEntity)
  @JoinColumn({ name: "account_id" })
  account!: AccountEntity;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
    name: "destination_account_id",
  })
  destinationAccountId?: string;

  @ManyToOne(() => AccountEntity, { nullable: true })
  @JoinColumn({ name: "destination_account_id" })
  destinationAccount?: AccountEntity;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  amount!: number;

  @CreateDateColumn({ type: "timestamp", name: "timestamp" })
  timestamp!: Date;
}
