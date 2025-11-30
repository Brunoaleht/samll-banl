import { BalanceDisplay } from "@/components/balance-display";
import { TransactionForm } from "@/components/transaction-form";
import { TransactionHistory } from "@/components/transaction-history";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import * as S from "./styles";
import { useState } from "react";

export interface DashboardProps {
  balance: number | null;
  accountId: number | null;
  onAccountIdChange: (id: number) => void;
  onLoadAccountData: (id: number) => void;
  onCreateAccount: (id: number, initialBalance?: number) => void;
  onLoadBalance: () => void;
  onExitAccount: () => void;
  onReset: () => void;
  onLogout: () => void;
  loading?: boolean;
}

export function Dashboard({
  balance,
  accountId,
  onAccountIdChange,
  onLoadAccountData,
  onCreateAccount,
  onLoadBalance,
  onExitAccount,
  onReset,
  onLogout,
  loading,
}: DashboardProps) {
  const [searchAccountId, setSearchAccountId] = useState("");
  const [newAccountId, setNewAccountId] = useState("");
  const [newAccountBalance, setNewAccountBalance] = useState("");

  const handleSearchAccount = () => {
    if (searchAccountId.trim()) {
      const accountId = parseInt(searchAccountId, 10);
      if (!isNaN(accountId)) {
        onLoadAccountData(accountId);
        setSearchAccountId("");
      }
    }
  };

  const handleCreateAccount = () => {
    if (newAccountId.trim()) {
      const accountId = parseInt(newAccountId, 10);
      if (!isNaN(accountId)) {
        const initialBalance = newAccountBalance
          ? parseFloat(newAccountBalance)
          : 0;
        onCreateAccount(accountId, initialBalance);
        setNewAccountId("");
        setNewAccountBalance("");
      }
    }
  };

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
        {!accountId ? (
          <>
            <section className={S.getSectionClasses()}>
              <h2 className={S.getSectionTitleClasses()}>Buscar Conta</h2>
              <div className={S.getAccountFormClasses()}>
                <Input
                  label="ID da Conta"
                  type="text"
                  value={searchAccountId}
                  onChange={(e) => setSearchAccountId(e.target.value)}
                  placeholder="Ex: 100"
                  required
                />
                <Button
                  type="submit"
                  disabled={loading}
                  onClick={handleSearchAccount}
                >
                  Buscar Conta
                </Button>
              </div>
            </section>

            <section className={S.getSectionClasses()}>
              <h2 className={S.getSectionTitleClasses()}>Criar Nova Conta</h2>
              <div className={S.getAccountFormClasses()}>
                <Input
                  label="ID da Conta"
                  type="text"
                  value={newAccountId}
                  onChange={(e) => setNewAccountId(e.target.value)}
                  placeholder="Ex: 100"
                  required
                />
                <Input
                  label="Saldo Inicial (opcional)"
                  type="number"
                  value={newAccountBalance}
                  onChange={(e) => setNewAccountBalance(e.target.value)}
                  placeholder="0"
                />
                <Button
                  type="submit"
                  disabled={loading}
                  onClick={handleCreateAccount}
                >
                  Criar Conta
                </Button>
              </div>
            </section>
          </>
        ) : (
          <>
            <section className={S.getSectionClasses()}>
              <div
                className={S.getAccountFormClasses()}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
                    Conta: {accountId}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  onClick={onExitAccount}
                  disabled={loading}
                >
                  Sair da Conta
                </Button>
              </div>
            </section>

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
