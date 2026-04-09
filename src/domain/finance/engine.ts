import type {
  AccountConfig,
  DailyBalanceRow,
  DayTypeAmount,
  FinancialEntry,
  HorizonMonth,
  MonthlySummaryData,
  RiskLevel,
  TransactionType,
} from '@/core/types';

const DISPLAY_ORDER: TransactionType[] = [
  'income',
  'fixed_expense',
  'daily_expense',
  'saving',
  'credit_card',
];

function parseDate(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function minDate(a: Date, b: Date) {
  return a <= b ? a : b;
}

function maxDate(a: Date, b: Date) {
  return a >= b ? a : b;
}

function sameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function clampDay(year: number, monthIndex: number, dayOfMonth: number) {
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  return Math.min(dayOfMonth, lastDay);
}

function isWithinRange(date: Date, start: Date, end: Date) {
  return date >= start && date <= end;
}

function expandEntriesForRange(
  entries: FinancialEntry[],
  start: Date,
  end: Date,
): FinancialEntry[] {
  const expanded: FinancialEntry[] = [];

  for (const entry of entries) {
    if (!entry.recurrence) {
      const entryDate = parseDate(entry.effectiveDate);
      if (isWithinRange(entryDate, start, end)) {
        expanded.push(entry);
      }
      continue;
    }

    if (entry.recurrence.frequency !== 'monthly') {
      continue;
    }

    const firstDate = parseDate(entry.effectiveDate);
    const cursor = startOfMonth(maxDate(startOfMonth(firstDate), startOfMonth(start)));
    const limit = startOfMonth(end);

    while (cursor <= limit) {
      const day = clampDay(
        cursor.getFullYear(),
        cursor.getMonth(),
        entry.recurrence.dayOfMonth,
      );
      const occurrenceDate = new Date(cursor.getFullYear(), cursor.getMonth(), day);
      const endDate = entry.recurrence.endDate
        ? parseDate(entry.recurrence.endDate)
        : null;

      if (
        occurrenceDate >= firstDate &&
        isWithinRange(occurrenceDate, start, end) &&
        (!endDate || occurrenceDate <= endDate)
      ) {
        expanded.push({
          ...entry,
          effectiveDate: formatDate(occurrenceDate),
        });
      }

      cursor.setMonth(cursor.getMonth() + 1);
    }
  }

  return expanded;
}

export function computeDailyBudget(monthlyDailyBudgetCents: number) {
  return Math.round(monthlyDailyBudgetCents / 30);
}

function groupEntriesByDate(entries: FinancialEntry[]) {
  const map = new Map<string, FinancialEntry[]>();
  for (const entry of entries) {
    const current = map.get(entry.effectiveDate) ?? [];
    current.push(entry);
    map.set(entry.effectiveDate, current);
  }
  return map;
}

function computeRiskLevel(
  closingBalance: number,
  warningThresholdCents: number,
): RiskLevel {
  if (closingBalance < 0) {
    return 'danger';
  }
  if (closingBalance <= warningThresholdCents) {
    return 'warning';
  }
  return 'safe';
}

function buildDayTypes(
  entriesForDay: FinancialEntry[],
  dailyBudgetCents: number,
  currentDate: Date,
  anchorDate: Date,
): [DayTypeAmount, DayTypeAmount, DayTypeAmount, DayTypeAmount, DayTypeAmount] {
  const totals = new Map<TransactionType, number>(
    DISPLAY_ORDER.map((type) => [type, 0]),
  );

  for (const entry of entriesForDay) {
    totals.set(entry.type, (totals.get(entry.type) ?? 0) + entry.amountCents);
  }

  const actualDailyExpense = totals.get('daily_expense') ?? 0;
  const hasRealDailyExpense = actualDailyExpense > 0;
  const shouldProjectDaily =
    !hasRealDailyExpense &&
    dailyBudgetCents > 0 &&
    !sameDay(currentDate, anchorDate);

  return DISPLAY_ORDER.map((type) => {
    if (type === 'daily_expense') {
      return {
        type,
        amountCents: hasRealDailyExpense
          ? actualDailyExpense
          : shouldProjectDaily
            ? dailyBudgetCents
            : 0,
        isProjected: shouldProjectDaily,
      };
    }

    return {
      type,
      amountCents: totals.get(type) ?? 0,
      isProjected: false,
    };
  }) as [DayTypeAmount, DayTypeAmount, DayTypeAmount, DayTypeAmount, DayTypeAmount];
}

function getNetEffect(types: DailyBalanceRow['types']) {
  const income = types[0].amountCents;
  const fixed = types[1].amountCents;
  const daily = types[2].amountCents;
  const saving = types[3].amountCents;
  const creditCard = types[4].amountCents;

  return income - fixed - daily - saving - creditCard;
}

function getAnchorAdjustedMonthOpening(
  config: AccountConfig,
  monthStart: Date,
  expandedEntries: FinancialEntry[],
): number {
  const anchorDate = parseDate(config.balanceAnchorDate);
  const anchorBalance = config.currentBalanceCents;
  const dailyBudgetCents = computeDailyBudget(config.monthlyDailyBudgetCents);
  const entriesByDate = groupEntriesByDate(expandedEntries);

  if (monthStart > anchorDate) {
    return anchorBalance;
  }

  let totalEffectUntilAnchor = 0;
  let cursor = monthStart;

  while (cursor <= anchorDate) {
    const types = buildDayTypes(
      entriesByDate.get(formatDate(cursor)) ?? [],
      dailyBudgetCents,
      cursor,
      anchorDate,
    );
    totalEffectUntilAnchor += getNetEffect(types);
    cursor = addDays(cursor, 1);
  }

  return anchorBalance - totalEffectUntilAnchor;
}

export function buildDailyLedger(
  config: AccountConfig,
  selectedMonth: Date,
  entries: FinancialEntry[],
): DailyBalanceRow[] {
  const anchorDate = parseDate(config.balanceAnchorDate);
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const earliestMonthStart = startOfMonth(minDate(monthStart, anchorDate));
  const expandedEntries = expandEntriesForRange(entries, earliestMonthStart, monthEnd);
  const entriesByDate = groupEntriesByDate(expandedEntries);
  const dailyBudgetCents = computeDailyBudget(config.monthlyDailyBudgetCents);

  let runningBalance = getAnchorAdjustedMonthOpening(
    config,
    earliestMonthStart,
    expandedEntries,
  );

  const allRows: DailyBalanceRow[] = [];
  let cursor = earliestMonthStart;

  while (cursor <= monthEnd) {
    const dateKey = formatDate(cursor);
    const types = buildDayTypes(
      entriesByDate.get(dateKey) ?? [],
      dailyBudgetCents,
      cursor,
      anchorDate,
    );
    const openingBalance = runningBalance;
    runningBalance += getNetEffect(types);

    allRows.push({
      day: cursor.getDate(),
      date: dateKey,
      types,
      openingBalance,
      closingBalance: runningBalance,
      riskLevel: computeRiskLevel(runningBalance, config.warningThresholdCents),
    });

    cursor = addDays(cursor, 1);
  }

  return allRows.filter((row) => {
    const rowDate = parseDate(row.date);
    return sameMonth(rowDate, selectedMonth);
  });
}

export function buildMonthlyTotals(
  config: AccountConfig,
  selectedMonth: Date,
  ledger: DailyBalanceRow[],
): MonthlySummaryData {
  const dailyBudgetTarget = computeDailyBudget(config.monthlyDailyBudgetCents);
  const anchorDate = parseDate(config.balanceAnchorDate);
  const selectedMonthEnd = endOfMonth(selectedMonth);
  const monthIsCurrentOrFuture = selectedMonthEnd >= anchorDate;
  const effectiveElapsedDays = sameMonth(selectedMonth, anchorDate)
    ? anchorDate.getDate()
    : selectedMonth < anchorDate
      ? selectedMonthEnd.getDate()
      : 0;

  const totals = {
    income: 0,
    fixed_expense: 0,
    daily_expense_real: 0,
    daily_expense_projected_remaining: 0,
    saving: 0,
    credit_card: 0,
  };

  for (const row of ledger) {
    const rowDate = parseDate(row.date);
    const [income, fixedExpense, dailyExpense, saving, creditCard] = row.types;

    totals.income += income.amountCents;
    totals.fixed_expense += fixedExpense.amountCents;
    totals.saving += saving.amountCents;
    totals.credit_card += creditCard.amountCents;

    if (dailyExpense.isProjected) {
      if (
        rowDate > anchorDate ||
        (!sameMonth(selectedMonth, anchorDate) && monthIsCurrentOrFuture)
      ) {
        totals.daily_expense_projected_remaining += dailyExpense.amountCents;
      }
    } else {
      totals.daily_expense_real += dailyExpense.amountCents;
    }
  }

  const averageDailySpend =
    effectiveElapsedDays > 0
      ? Math.round(totals.daily_expense_real / effectiveElapsedDays)
      : 0;

  const performance =
    totals.income -
    totals.fixed_expense -
    totals.daily_expense_real -
    totals.saving -
    totals.credit_card -
    totals.daily_expense_projected_remaining;

  const costOfLife =
    totals.fixed_expense +
    totals.daily_expense_real +
    totals.credit_card +
    totals.daily_expense_projected_remaining;

  const economized =
    totals.income > 0 ? totals.saving / totals.income : 0;

  return {
    currentBalance: config.currentBalanceCents,
    monthlyDailyBudget: config.monthlyDailyBudgetCents,
    dailyBudgetTarget,
    dailyProjectedRemaining: totals.daily_expense_projected_remaining,
    performance,
    performanceLabel: performance < 0 ? 'Faltou dinheiro' : 'Sobrou dinheiro',
    economized,
    economizedLabel:
      economized > 0
        ? `${(economized * 100).toFixed(0)}% da renda guardada`
        : 'Nada guardado',
    costOfLife,
    costOfLifeLabel:
      totals.income > 0 && costOfLife > totals.income
        ? 'Acima da renda'
        : 'Dentro da renda',
    dailyAverage: averageDailySpend,
    movements: {
      income: totals.income,
      fixed_expense: Math.abs(totals.fixed_expense),
      daily_expense: Math.abs(totals.daily_expense_real),
      saving: Math.abs(totals.saving),
      credit_card: Math.abs(totals.credit_card),
    },
  };
}

export function buildHorizon(
  config: AccountConfig,
  selectedMonth: Date,
  entries: FinancialEntry[],
): HorizonMonth[] {
  return Array.from({ length: config.projectionMonths }, (_, index) => {
    const monthDate = addMonths(selectedMonth, index);
    const ledger = buildDailyLedger(config, monthDate, entries);
    const monthLabel = monthDate.toLocaleDateString('pt-BR', {
      month: 'short',
      year: '2-digit',
    });

    return {
      monthLabel: monthLabel.replace('.', ''),
      dailyBalances: ledger.map((row) => row.closingBalance),
    };
  });
}
