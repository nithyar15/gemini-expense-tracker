
export enum TransactionType {
  INCOME = 'Income',
  EXPENSE = 'Expense',
}

export enum ExpenseCategory {
  FOOD = 'Food',
  TRAVEL = 'Travel',
  UBER = 'Uber/Taxi',
  RENT = 'Rent',
  ELECTRICITY = 'Electricity',
  GROCERIES = 'Groceries',
  HEALTH = 'Health',
  GYM = 'Gym',
  ENTERTAINMENT = 'Entertainment',
  SHOPPING = 'Shopping',
  OTHER = 'Other',
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category?: ExpenseCategory;
  date: string; // ISO string date
}
