import React from 'react';
import { Input } from '../input';
import { Button } from '../button';
import * as S from './styles';

interface TransactionFormProps {
  type: 'deposit' | 'withdraw' | 'transfer';
  onSubmit: (data: { amount: number; destination?: string }) => void;
  loading?: boolean;
  error?: string | null;
}

export function TransactionForm({ type, onSubmit, loading, error }: TransactionFormProps) {
  const [amount, setAmount] = React.useState('');
  const [destination, setDestination] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return;
    }

    if (type === 'transfer' && !destination) {
      return;
    }

    onSubmit({
      amount: amountNum,
      ...(type === 'transfer' && { destination }),
    });

    setAmount('');
    setDestination('');
  };

  const getTitle = () => {
    switch (type) {
      case 'deposit':
        return 'Depósito';
      case 'withdraw':
        return 'Saque';
      case 'transfer':
        return 'Transferência';
    }
  };

  return (
    <div className={S.getFormContainerClasses()}>
      <h3 className={S.getTitleClasses()}>{getTitle()}</h3>
      <form className={S.getFormClasses()} onSubmit={handleSubmit}>
        {type === 'transfer' && (
          <Input
            label="Conta Destino"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="ID da conta destino"
            required
          />
        )}
        <Input
          label="Valor"
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
        />
        {error && <span className={S.getErrorMessageClasses()}>{error}</span>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Processando...' : getTitle()}
        </Button>
      </form>
    </div>
  );
}

