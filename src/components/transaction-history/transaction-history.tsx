import React from 'react';
import * as S from './styles';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'transfer';
  accountId: string;
  destinationAccountId?: string;
  amount: number;
  timestamp: Date;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  if (transactions.length === 0) {
    return (
      <div className={S.getContainerClasses()}>
        <h3 className={S.getTitleClasses()}>Histórico de Transações</h3>
        <p className={S.getEmptyMessageClasses()}>Nenhuma transação encontrada</p>
      </div>
    );
  }

  return (
    <div className={S.getContainerClasses()}>
      <h3 className={S.getTitleClasses()}>Histórico de Transações</h3>
      <ul className={S.getListClasses()}>
        {transactions.map((transaction) => (
          <li key={transaction.id} className={S.getTransactionItemClasses()}>
            <div className={S.getTransactionInfoClasses()}>
              <span className={S.getTransactionTypeClasses(transaction.type)}>
                {transaction.type === 'deposit' && 'Depósito'}
                {transaction.type === 'withdraw' && 'Saque'}
                {transaction.type === 'transfer' && 'Transferência'}
              </span>
              <span className={S.getTransactionDateClasses()}>
                {new Date(transaction.timestamp).toLocaleString()}
              </span>
            </div>
            <span className={S.getTransactionAmountClasses(transaction.type)}>
              {transaction.type === 'withdraw' ? '-' : '+'}R$ {transaction.amount.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

