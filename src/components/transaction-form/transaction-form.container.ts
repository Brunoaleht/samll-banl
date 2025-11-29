import { TransactionForm } from './transaction-form';
import { useAccountContext } from '@/contexts/account.context';

interface TransactionFormContainerProps {
  type: 'deposit' | 'withdraw' | 'transfer';
}

export function TransactionFormContainer({ type }: TransactionFormContainerProps) {
  const { deposit, withdraw, transfer, loading, error } = useAccountContext();

  const handleSubmit = async (data: { amount: number; destination?: string }) => {
    try {
      if (type === 'deposit') {
        await deposit(data.amount);
      } else if (type === 'withdraw') {
        await withdraw(data.amount);
      } else if (type === 'transfer' && data.destination) {
        await transfer(data.destination, data.amount);
      }
    } catch (err) {
      console.error('Transaction error:', err);
    }
  };

  return <TransactionForm type={type} onSubmit={handleSubmit} loading={loading} error={error} />;
}

