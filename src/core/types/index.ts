export type TransactionType = 'income' | 'fixed_expense' | 'daily_expense' | 'saving' | 'credit_card';

export type RiskLevel = 'safe' | 'warning' | 'danger';

/** Each day has exactly 5 type rows (one per TransactionType) */
export interface DayTypeAmount {
  type: TransactionType;
  /** Amount in cents (absolute). 0 means no activity. */
  amountCents: number;
  /** true = system-projected daily budget, not real spend */
  isProjected: boolean;
}

export interface DailyBalanceRow {
  day: number;
  date: string;
  /** Always 5 entries, one per type, in display order */
  types: [DayTypeAmount, DayTypeAmount, DayTypeAmount, DayTypeAmount, DayTypeAmount];
  /** Closing balance in cents (can be negative) */
  closingBalance: number;
  riskLevel: RiskLevel;
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

export interface HorizonMonth {
  monthLabel: string;
  dailyBalances: number[];
}
