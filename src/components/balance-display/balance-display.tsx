import React, { FC } from "react";
import * as S from "./styles";

interface BalanceDisplayProps {
  balance: number | null;
  accountId: string | null;
}

export const BalanceDisplay: FC<BalanceDisplayProps> = ({
  balance,
  accountId,
}) => {
  if (balance === null) {
    return (
      <div className={S.getBalanceContainerClasses()}>
        <span className={S.getLabelClasses()}>Saldo</span>
        <span className={S.getBalanceValueClasses()}>Carregando...</span>
      </div>
    );
  }

  return (
    <div className={S.getBalanceContainerClasses()}>
      <span className={S.getLabelClasses()}>
        Saldo da Conta {accountId || "N/A"}
      </span>
      <span className={S.getBalanceValueClasses()}>
        R$ {balance.toFixed(2)}
      </span>
    </div>
  );
};
