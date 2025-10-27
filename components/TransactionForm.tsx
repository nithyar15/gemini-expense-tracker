
import React, { useState } from 'react';
import { Transaction, TransactionType, ExpenseCategory } from '../types';
import { EXPENSE_CATEGORIES } from '../constants';
import Card from './ui/Card';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.FOOD);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!description || !numericAmount || numericAmount <= 0) {
      alert("Please fill out all fields with valid values.");
      return;
    }

    onAddTransaction({
      description,
      amount: numericAmount,
      type,
      category: type === TransactionType.EXPENSE ? category : undefined,
      date,
    });

    // Reset form
    setDescription('');
    setAmount('');
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 text-sky-300">Add New Transaction</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <button type="button" onClick={() => setType(TransactionType.INCOME)} className={`p-2 rounded-md text-sm font-semibold transition-colors ${type === TransactionType.INCOME ? 'bg-emerald-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Income</button>
            <button type="button" onClick={() => setType(TransactionType.EXPENSE)} className={`p-2 rounded-md text-sm font-semibold transition-colors ${type === TransactionType.EXPENSE ? 'bg-rose-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Expense</button>
        </div>
        <Input
          id="description"
          label="Description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Coffee"
          required
        />
        <Input
          id="amount"
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
        />
        {type === TransactionType.EXPENSE && (
          <Select
            id="category"
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
          >
            {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </Select>
        )}
        <Input
          id="date"
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">Add Transaction</Button>
      </form>
    </Card>
  );
};

export default TransactionForm;
