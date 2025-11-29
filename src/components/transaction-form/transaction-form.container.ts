import { createElement, FC } from "react";
import { TransactionForm, TransactionFormProps } from "./transaction-form";
import { useAccountContext } from "@/contexts/account.context";

interface TransactionFormContainerProps {
  type?: "deposit" | "withdraw" | "transfer";
}

export const TransactionFormContainer: FC<TransactionFormContainerProps> = ({
  type,
}) => {
  const { deposit, withdraw, transfer, loading, error } = useAccountContext();

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
    } catch (err) {
      console.error("Transaction error:", err);
    }
  };

  const props: TransactionFormProps = {
    type: type || "deposit",
    onSubmit: handleSubmit,
    loading,
    error,
  };

  return createElement(TransactionForm, props);
};
