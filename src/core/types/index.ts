export type TransactionType = 'income' | 'fixed_expense' | 'daily_expense' | 'saving' | 'credit_card';

export type RiskLevel = 'safe' | 'warning' | 'danger';
export type RecurrenceFrequency = 'monthly';

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  dayOfMonth: number;
  endDate?: string | null;
}

export interface AccountConfig {
  currentBalanceCents: number;
  balanceAnchorDate: string;
  monthlyDailyBudgetCents: number;
  warningThresholdCents: number;
  projectionMonths: number;
  dailyExpenseExcludedDates: string[];
}

export interface FinancialEntry {
  id: string;
  type: TransactionType;
  amountCents: number;
  effectiveDate: string;
  description?: string;
  recurrence?: RecurrenceRule | null;
}

/** Each day has exactly 5 type rows (one per TransactionType) */
export interface DayTypeAmount {
  type: TransactionType;
  /** Amount in cents (absolute). 0 means no activity. */
  amountCents: number;
  /** true = system-projected daily budget, not real spend */
  isProjected: boolean;
  /** true = user explicitly marked this day as no daily spend */
  isProjectionExcluded?: boolean;
}

export interface DailyBalanceRow {
  day: number;
  date: string;
  /** Always 5 entries, one per type, in display order */
  types: [DayTypeAmount, DayTypeAmount, DayTypeAmount, DayTypeAmount, DayTypeAmount];
  openingBalance: number;
  /** Closing balance in cents (can be negative) */
  closingBalance: number;
  riskLevel: RiskLevel;
}

export interface MonthlySummaryData {
  currentBalance: number;
  monthlyDailyBudget: number;
  dailyBudgetTarget: number;
  dailyProjectedRemaining: number;
  performance: number;
  performanceLabel: string;
  economized: number;
  economizedLabel: string;
  costOfLife: number;
  costOfLifeLabel: string;
  dailyAverage: number;
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
