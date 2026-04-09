import type { DailyBalanceRow, DayTypeAmount } from '../core/types';

const DAILY_BUDGET = 5333; // R$ 53.33 projected daily expense

/** Shorthand: builds the 5-element types tuple for a day. */
function types(
  overrides: Partial<
    Record<
      'income' | 'fixed_expense' | 'daily_expense' | 'saving' | 'credit_card',
      Pick<DayTypeAmount, 'amountCents' | 'isProjected'>
    >
  > = {},
): [DayTypeAmount, DayTypeAmount, DayTypeAmount, DayTypeAmount, DayTypeAmount] {
  return [
    { type: 'income', amountCents: overrides.income?.amountCents ?? 0, isProjected: overrides.income?.isProjected ?? false },
    { type: 'fixed_expense', amountCents: overrides.fixed_expense?.amountCents ?? 0, isProjected: overrides.fixed_expense?.isProjected ?? false },
    { type: 'daily_expense', amountCents: overrides.daily_expense?.amountCents ?? DAILY_BUDGET, isProjected: overrides.daily_expense?.isProjected ?? true },
    { type: 'saving', amountCents: overrides.saving?.amountCents ?? 0, isProjected: overrides.saving?.isProjected ?? false },
    { type: 'credit_card', amountCents: overrides.credit_card?.amountCents ?? 0, isProjected: overrides.credit_card?.isProjected ?? false },
  ];
}

function row(
  day: number,
  closingBalance: number,
  riskLevel: 'safe' | 'warning' | 'danger' = 'danger',
  overrides: Parameters<typeof types>[0] = {},
): DailyBalanceRow {
  return {
    day,
    date: `2026-12-${String(day).padStart(2, '0')}`,
    types: types(overrides),
    closingBalance,
    riskLevel,
  };
}

export const MOCK_BALANCES: DailyBalanceRow[] = [
  // Day 1: starting balance R$ -8.229,36
  row(1, -822936),
  // Day 2: -822936 - 5333 = -828269
  row(2, -828269),
  // Day 3: -828269 - 5333 = -833602
  row(3, -833602),
  // Day 4: -833602 - 5333 = -838935
  row(4, -838935),
  // Day 5: user spent R$ 42.10 (real expense)
  row(5, -843145, 'danger', { daily_expense: { amountCents: 4210, isProjected: false } }),
  // Day 6: -843145 - 5333 = -848478
  row(6, -848478),
  // Day 7: small freelance income R$ 150.00
  row(7, -838811, 'danger', { income: { amountCents: 15000, isProjected: false } }),
  // Day 8: -838811 - 5333 = -844144
  row(8, -844144),
  // Day 9: -844144 - 5333 = -849477
  row(9, -849477),
  // Day 10: internet bill R$ 99.90 + daily projected
  row(10, -864300, 'danger', { fixed_expense: { amountCents: 9990, isProjected: false } }),
  // Day 11: -864300 - 5333 = -869633
  row(11, -869633),
  // Day 12: groceries R$ 78.50
  row(12, -877483, 'danger', { daily_expense: { amountCents: 7850, isProjected: false } }),
  // Day 13: -877483 - 5333 = -882816
  row(13, -882816),
  // Day 14: -882816 - 5333 = -888149
  row(14, -888149),
  // Day 15: salary R$ 3.200,00 + credit card R$ 890,00
  row(15, -857149, 'danger', {
    income: { amountCents: 320000, isProjected: false },
    credit_card: { amountCents: 89000, isProjected: false },
  }),
  // Day 16: -857149 - 5333 = -862482
  row(16, -862482),
  // Day 17: saving R$ 50.00
  row(17, -872815, 'danger', { saving: { amountCents: 5000, isProjected: false } }),
  // Day 18: -872815 - 5333 = -878148
  row(18, -878148),
  // Day 19: lunch R$ 31.90
  row(19, -881338, 'danger', { daily_expense: { amountCents: 3190, isProjected: false } }),
  // Day 20: -881338 - 5333 = -886671
  row(20, -886671),
  // Day 21: -886671 - 5333 = -892004
  row(21, -892004),
  // Day 22: phone plan R$ 55.00 + daily projected
  row(22, -902837, 'danger', { fixed_expense: { amountCents: 5500, isProjected: false } }),
  // Day 23: -902837 - 5333 = -908170
  row(23, -908170),
  // Day 24: Christmas eve dinner R$ 120.00
  row(24, -920170, 'danger', { daily_expense: { amountCents: 12000, isProjected: false } }),
  // Day 25: Christmas - no spending, projected daily only
  row(25, -925503),
  // Day 26: -925503 - 5333 = -930836
  row(26, -930836),
  // Day 27: side gig income R$ 80.00
  row(27, -928169, 'danger', { income: { amountCents: 8000, isProjected: false } }),
  // Day 28: -928169 - 5333 = -933502
  row(28, -933502),
  // Day 29: gas R$ 65.00
  row(29, -940002, 'danger', { daily_expense: { amountCents: 6500, isProjected: false } }),
  // Day 30: -940002 - 5333 = -945335
  row(30, -945335),
  // Day 31: New Year's Eve credit card R$ 200.00 + daily projected
  row(31, -970668, 'danger', { credit_card: { amountCents: 20000, isProjected: false } }),
];
