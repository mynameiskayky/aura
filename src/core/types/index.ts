export type TransactionType = 'income' | 'fixed_expense' | 'daily_expense' | 'saving' | 'credit_card';

export type RiskLevel = 'safe' | 'warning' | 'danger';

export interface DailyBalanceRow {
  day: number;
  date: string;
  entries: DayEntry[];
  closingBalance: number;
  riskLevel: RiskLevel;
}

export interface DayEntry {
  type: TransactionType;
  amount: number;
  isProjected: boolean;
}

export interface MonthlySummaryData {
  performance: number;
  performanceLabel: string;
  economized: number;
  economizedLabel: string;
  costOfLife: number;
  costOfLifeLabel: string;
  dailyAverage: number;
  dailyBudgetTarget: number;
  movements: Record<TransactionType, number>;
}

export interface TagItem {
  id: string;
  name: string;
  color: string;
  totalAmount: number;
}

export interface MenuItem {
  id: string;
  icon: string;
  label: string;
  route?: string;
}
