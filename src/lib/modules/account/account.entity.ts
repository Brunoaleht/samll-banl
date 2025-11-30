import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("accounts")
export class AccountEntity {
  @PrimaryColumn({ type: "varchar", length: 255 })
  id!: string;

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  balance!: number;
}
