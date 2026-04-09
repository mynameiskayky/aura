import type { MonthlySummaryData } from '../core/types';

export const MOCK_TOTALS: MonthlySummaryData = {
  performance: -75154,
  performanceLabel: '-R$ 751,54',
  economized: 0.12,
  economizedLabel: '12%',
  costOfLife: 498700,
  costOfLifeLabel: 'R$ 4.987,00',
  dailyAverage: 7890,
  dailyBudgetTarget: 5333,
  movements: {
    income: 790000,
    fixed_expense: -499800,
    daily_expense: -201400,
    saving: -50000,
    credit_card: -89200,
  },
};
