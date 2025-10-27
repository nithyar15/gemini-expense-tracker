
import React from 'react';
import { Transaction, TransactionType } from '../types';
import Card from './ui/Card';
import TrashIcon from './icons/TrashIcon';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const TransactionItem: React.FC<{ transaction: Transaction; onDelete: (id: string) => void }> = ({ transaction, onDelete }) => {
  const isIncome = transaction.type === TransactionType.INCOME;
  const amountColor = isIncome ? 'text-emerald-400' : 'text-rose-400';
  const sign = isIncome ? '+' : '-';

  return (
    <li className="flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-md transition-colors">
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{transaction.description}</p>
        <p className="text-xs text-gray-400">
          {new Date(transaction.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          {transaction.category && ` • ${transaction.category}`}
        </p>
      </div>
      <div className="flex items-center ml-4">
        <p className={`font-mono font-semibold ${amountColor}`}>
          {sign}{currencyFormatter.format(transaction.amount)}
        </p>
        <button onClick={() => onDelete(transaction.id)} className="ml-4 text-gray-500 hover:text-red-500 transition-colors p-1">
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </li>
  );
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDeleteTransaction }) => {
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card className="flex-grow flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-sky-300">History</h3>
      {transactions.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-500">No transactions yet.</p>
        </div>
      ) : (
        <ul className="space-y-2 overflow-y-auto max-h-96 pr-2">
          {sortedTransactions.map(t => (
            <TransactionItem key={t.id} transaction={t} onDelete={onDeleteTransaction} />
          ))}
        </ul>
      )}
    </Card>
  );
};

export default TransactionList;
