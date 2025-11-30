import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("accounts")
export class AccountEntity {
  @PrimaryColumn({ type: "int" })
  id!: number;

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  balance!: number;
}
