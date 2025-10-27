
import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Transaction, TransactionType, ExpenseCategory } from '../types';
import Card from './ui/Card';

interface DashboardProps {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  transactions: Transaction[];
}

const COLORS = ['#0ea5e9', '#0891b2', '#0d9488', '#10b981', '#65a30d', '#ca8a04', '#d97706', '#ea580c', '#e11d48', '#be123c', '#9f1239'];

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const Dashboard: React.FC<DashboardProps> = ({ balance, totalIncome, totalExpenses, transactions }) => {
  const expenseByCategory = useMemo(() => {
    const data = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => {
        const category = t.category || ExpenseCategory.OTHER;
        acc[category] = (acc[category] || 0) + t.amount;
        return acc;
        // FIX: Changed the accumulator type to ensure TypeScript knows the values are numbers.
      }, {} as Record<string, number>);

    return Object.entries(data)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);
  
  const savingsTrend = useMemo(() => {
    if (transactions.length === 0) return [];
    
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let cumulativeBalance = 0;
    const trendData = sortedTransactions.map(t => {
        cumulativeBalance += t.type === TransactionType.INCOME ? t.amount : -t.amount;
        return {
            date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            balance: cumulativeBalance
        };
    });

    // To make the graph more readable, we can group by day and take the last balance of the day
    const dailyBalance: { [key: string]: number } = trendData.reduce((acc, item) => {
        acc[item.date] = item.balance;
        return acc;
    }, {} as { [key: string]: number });
    
    return Object.entries(dailyBalance).map(([date, balance]) => ({ date, balance }));
    
  }, [transactions]);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-sm font-medium text-gray-400">Total Balance</h3>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {currencyFormatter.format(balance)}
          </p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-400">Total Income</h3>
          <p className="text-3xl font-bold text-green-400">{currencyFormatter.format(totalIncome)}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-400">Total Expenses</h3>
          <p className="text-3xl font-bold text-rose-400">{currencyFormatter.format(totalExpenses)}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-sky-300">Expense Distribution</h3>
          {expenseByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {expenseByCategory.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value: number) => currencyFormatter.format(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-500 text-center py-20">No expense data to display.</p>}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4 text-sky-300">Savings Trend</h3>
          {savingsTrend.length > 1 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={savingsTrend} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }} 
                  formatter={(value: number) => currencyFormatter.format(value)} />
                <Area type="monotone" dataKey="balance" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorBalance)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-500 text-center py-20">Not enough data for a trend.</p>}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;