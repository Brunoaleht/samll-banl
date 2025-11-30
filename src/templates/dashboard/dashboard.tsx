import React, { FormEvent, useEffect, useState } from "react";
import { BalanceDisplay } from "@/components/balance-display";
import { TransactionForm } from "@/components/transaction-form";
import { TransactionHistory } from "@/components/transaction-history";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import * as S from "./styles";

export interface DashboardProps {
  balance: number | null;
  accountId: string | null;
  onAccountIdChange: (id: string) => void;
  onLoadBalance: () => void;
  onReset: () => void;
  onLogout: () => void;
  loading?: boolean;
}

export function Dashboard({
  balance,
  accountId,
  onAccountIdChange,
  onLoadBalance,
  onReset,
  onLogout,
  loading,
}: DashboardProps) {
  return (
    <div className={S.getContainerClasses()}>
      <header className={S.getHeaderClasses()}>
        <h1 className={S.getHeaderTitleClasses()}>Sistema Bancário</h1>
        <div className={S.getHeaderActionsClasses()}>
          <Button variant="secondary" onClick={onLogout}>
            Sair
          </Button>
        </div>
      </header>

      <main className={S.getContentClasses()}>
        <section className={S.getSectionClasses()}>
          <h2 className={S.getSectionTitleClasses()}>Configurar Conta</h2>
          <div className={S.getAccountFormClasses()}>
            <Input
              label="ID da Conta"
              type="text"
              value={`${accountId}`}
              onChange={(e) => onAccountIdChange(e.target.value)}
              placeholder="Ex: 100"
              required
            />
            <Button type="submit" disabled={loading} onClick={onLoadBalance}>
              Conta
            </Button>
          </div>
        </section>

        {!!accountId && (
          <>
            <section className={S.getSectionClasses()}>
              <BalanceDisplay balance={balance} accountId={accountId} />
            </section>

            <div className={S.getOperationsGridClasses()}>
              <section className={S.getSectionClasses()}>
                <TransactionForm type="deposit" />
              </section>

              <section className={S.getSectionClasses()}>
                <TransactionForm type="withdraw" />
              </section>

              <section className={S.getSectionClasses()}>
                <TransactionForm type="transfer" />
              </section>
            </div>

            <section className={S.getSectionClasses()}>
              <TransactionHistory />
            </section>

            <section className={S.getSectionClasses()}>
              <Button variant="danger" onClick={onReset} disabled={loading}>
                Resetar Sistema
              </Button>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
