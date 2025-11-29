import { createElement, FC } from "react";
import {
  TransactionHistory,
  TransactionHistoryProps,
} from "./transaction-history";
import { useAccountContext } from "@/contexts/account.context";

export const TransactionHistoryContainer: FC = () => {
  const { transactions } = useAccountContext();

  const props: TransactionHistoryProps = {
    transactions,
  };

  return createElement(TransactionHistory, props);
};
