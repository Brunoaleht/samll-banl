export function getContainerClasses(): string {
  return 'flex flex-col gap-4 p-6 bg-white rounded-xl border border-gray-200';
}

export function getTitleClasses(): string {
  return 'text-xl font-semibold text-gray-900 m-0';
}

export function getListClasses(): string {
  return 'list-none p-0 m-0 flex flex-col gap-3';
}

export function getTransactionItemClasses(): string {
  return 'flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200';
}

export function getTransactionInfoClasses(): string {
  return 'flex flex-col gap-1';
}

export function getTransactionTypeClasses(type: 'deposit' | 'withdraw' | 'transfer'): string {
  const colorClasses = {
    deposit: 'text-green-500',
    withdraw: 'text-red-500',
    transfer: 'text-blue-500',
  };
  return `font-semibold ${colorClasses[type] || 'text-gray-500'}`;
}

export function getTransactionDateClasses(): string {
  return 'text-sm text-gray-500';
}

export function getTransactionAmountClasses(type: 'deposit' | 'withdraw' | 'transfer'): string {
  const colorClasses = {
    deposit: 'text-green-500',
    withdraw: 'text-red-500',
    transfer: 'text-blue-500',
  };
  return `font-bold text-lg ${colorClasses[type] || 'text-gray-500'}`;
}

export function getEmptyMessageClasses(): string {
  return 'text-gray-500 text-center py-8 m-0';
}

