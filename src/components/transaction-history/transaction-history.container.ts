import { TransactionHistory } from './transaction-history';
import { useAccountContext } from '@/contexts/account.context';

export function TransactionHistoryContainer() {
  const { transactions } = useAccountContext();

  return <TransactionHistory transactions={transactions} />;
}

