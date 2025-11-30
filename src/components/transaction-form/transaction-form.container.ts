"use client";

import { createElement, FC } from "react";
import { TransactionForm, TransactionFormProps } from "./transaction-form";
import { useAccountContext } from "@/contexts/account.context";
import { useAlertContext } from "@/contexts/alert.context";

interface TransactionFormContainerProps {
  type?: "deposit" | "withdraw" | "transfer";
}

export const TransactionFormContainer: FC<TransactionFormContainerProps> = ({
  type,
}) => {
  const { deposit, withdraw, transfer, loading } = useAccountContext();
  const { createAlert } = useAlertContext();

  const getTransactionTitle = () => {
    switch (type) {
      case "deposit":
        return "Depósito";
      case "withdraw":
        return "Saque";
      case "transfer":
        return "Transferência";
      default:
        return "Transação";
    }
  };

  const handleSubmit = async (data: {
    amount: number;
    destination?: string;
  }) => {
    try {
      if (type === "deposit") {
        await deposit(data.amount);
      } else if (type === "withdraw") {
        await withdraw(data.amount);
      } else if (type === "transfer" && data.destination) {
        await transfer(data.destination, data.amount);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Transaction error:", err);
      const httpCode = err.status || err.httpCode || 500;
      const apiMessage = err.error || "Erro desconhecido";

      createAlert({
        message: `Erro ao realizar ${getTransactionTitle().toLowerCase()}`,
        apiMessage,
        httpCode,
      });
    }
  };

  const props: TransactionFormProps = {
    type: type || "deposit",
    onSubmit: handleSubmit,
    loading,
  };

  return createElement(TransactionForm, props);
};
