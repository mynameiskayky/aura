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

// ─── Date helpers ───────────────────────────────────────────

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

function isBefore(a: Date, b: Date) {
  return a < b && !sameDay(a, b);
}

// ─── Entry expansion ────────────────────────────────────────

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
    const cursor = startOfMonth(
      firstDate >= start ? firstDate : start,
    );
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

// ─── Core calculations ──────────────────────────────────────

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
  if (closingBalance < 0) return 'danger';
  if (closingBalance <= warningThresholdCents) return 'warning';
  return 'safe';
}

const EMPTY_TYPES: [DayTypeAmount, DayTypeAmount, DayTypeAmount, DayTypeAmount, DayTypeAmount] =
  DISPLAY_ORDER.map((type) => ({
    type,
    amountCents: 0,
    isProjected: false,
  })) as [DayTypeAmount, DayTypeAmount, DayTypeAmount, DayTypeAmount, DayTypeAmount];

/**
 * Build the 5-element types tuple for a single day.
 *
 * CRITICAL RULE: days BEFORE the anchor date have NO data and NO projections.
 * The user only started tracking from anchor date onward.
 * The configured balance is the opening balance of the anchor date.
 */
function buildDayTypes(
  entriesForDay: FinancialEntry[],
  dailyBudgetCents: number,
  currentDate: Date,
  anchorDate: Date,
  excludedDailyExpenseDates: Set<string>,
): [DayTypeAmount, DayTypeAmount, DayTypeAmount, DayTypeAmount, DayTypeAmount] {
  // ── Before anchor: no data exists ──
  if (isBefore(currentDate, anchorDate)) {
    return EMPTY_TYPES;
  }

  const totals = new Map<TransactionType, number>(
    DISPLAY_ORDER.map((type) => [type, 0]),
  );

  for (const entry of entriesForDay) {
    totals.set(entry.type, (totals.get(entry.type) ?? 0) + entry.amountCents);
  }

  const actualDailyExpense = totals.get('daily_expense') ?? 0;
  const hasRealDailyExpense = actualDailyExpense > 0;
  const currentDateKey = formatDate(currentDate);
  const isDailyProjectionExcluded = excludedDailyExpenseDates.has(currentDateKey);

  // Project daily budget on days from anchor onward when:
  // 1. No real daily expense was logged
  // 2. Budget is configured
  // 3. It's NOT the anchor date itself (anchor day = "today", user hasn't spent yet or will log)
  const shouldProjectDaily =
    !hasRealDailyExpense &&
    !isDailyProjectionExcluded &&
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
        isProjectionExcluded: isDailyProjectionExcluded && !hasRealDailyExpense,
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

// ─── Ledger builder ─────────────────────────────────────────

/**
 * Build the daily ledger for a given month.
 *
 * The anchor date divides time into two zones:
 * - BEFORE anchor: all types = 0, closing balance = configured balance (static)
 * - FROM anchor onward: real entries + projections, balance evolves
 *
 * For months entirely after anchor month: opening = end of previous month.
 * For the anchor month: opening = configured balance on anchor date.
 */
export function buildDailyLedger(
  config: AccountConfig,
  selectedMonth: Date,
  entries: FinancialEntry[],
): DailyBalanceRow[] {
  const anchorDate = parseDate(config.balanceAnchorDate);
  const anchorBalance = config.currentBalanceCents;
  const dailyBudgetCents = computeDailyBudget(config.monthlyDailyBudgetCents);
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const excludedDailyExpenseDates = new Set(config.dailyExpenseExcludedDates);

  // Expand entries for the range we need
  const expandedEntries = expandEntriesForRange(entries, monthStart, monthEnd);
  const entriesByDate = groupEntriesByDate(expandedEntries);

  // Determine opening balance for this month
  let runningBalance: number;

  if (sameMonth(selectedMonth, anchorDate)) {
    // Anchor month: balance before anchor is static at anchor value
    runningBalance = anchorBalance;
  } else if (monthStart > anchorDate) {
    // Future month: compute by running through all months from anchor forward
    const prevMonthEnd = endOfMonth(addMonths(monthStart, -1));
    const bridgeEntries = expandEntriesForRange(entries, anchorDate, prevMonthEnd);
    const bridgeByDate = groupEntriesByDate(bridgeEntries);

    runningBalance = anchorBalance;
    let cursor = anchorDate;
    while (cursor <= prevMonthEnd) {
      const types = buildDayTypes(
        bridgeByDate.get(formatDate(cursor)) ?? [],
        dailyBudgetCents,
        cursor,
        anchorDate,
        excludedDailyExpenseDates,
      );
      runningBalance += getNetEffect(types);
      cursor = addDays(cursor, 1);
    }
  } else {
    // Month before anchor: all static, no data
    runningBalance = anchorBalance;
  }

  // Build day-by-day rows
  const rows: DailyBalanceRow[] = [];
  let cursor = monthStart;

  // For anchor month, pre-anchor days are static
  const isAnchorMonth = sameMonth(selectedMonth, anchorDate);

  while (cursor <= monthEnd) {
    const dateKey = formatDate(cursor);
    const isBeforeAnchor = isBefore(cursor, anchorDate);

    if (isAnchorMonth && isBeforeAnchor) {
      // Pre-anchor: static row with no data
      rows.push({
        day: cursor.getDate(),
        date: dateKey,
        types: EMPTY_TYPES,
        openingBalance: anchorBalance,
        closingBalance: anchorBalance,
        riskLevel: computeRiskLevel(anchorBalance, config.warningThresholdCents),
      });
    } else if (!isAnchorMonth && monthStart < anchorDate) {
      // Entire month before anchor: static
      rows.push({
        day: cursor.getDate(),
        date: dateKey,
        types: EMPTY_TYPES,
        openingBalance: anchorBalance,
        closingBalance: anchorBalance,
        riskLevel: computeRiskLevel(anchorBalance, config.warningThresholdCents),
      });
    } else {
      // From anchor date onward: compute normally
      const types = buildDayTypes(
        entriesByDate.get(dateKey) ?? [],
        dailyBudgetCents,
        cursor,
        anchorDate,
        excludedDailyExpenseDates,
      );
      const openingBalance = runningBalance;
      runningBalance += getNetEffect(types);

      rows.push({
        day: cursor.getDate(),
        date: dateKey,
        types,
        openingBalance,
        closingBalance: runningBalance,
        riskLevel: computeRiskLevel(runningBalance, config.warningThresholdCents),
      });
    }

    cursor = addDays(cursor, 1);
  }

  return rows;
}

// ─── Monthly totals ─────────────────────────────────────────

export function buildMonthlyTotals(
  config: AccountConfig,
  selectedMonth: Date,
  ledger: DailyBalanceRow[],
): MonthlySummaryData {
  const dailyBudgetTarget = computeDailyBudget(config.monthlyDailyBudgetCents);
  const anchorDate = parseDate(config.balanceAnchorDate);

  // Count only days from anchor onward for averages
  let elapsedDays = 0;
  const today = new Date();

  const totals = {
    income: 0,
    fixed_expense: 0,
    daily_expense_real: 0,
    daily_expense_projected: 0,
    saving: 0,
    credit_card: 0,
  };

  for (const row of ledger) {
    const rowDate = parseDate(row.date);
    const [income, fixedExpense, dailyExpense, saving, creditCard] = row.types;

    // Skip pre-anchor days (they're empty)
    if (isBefore(rowDate, anchorDate)) continue;

    totals.income += income.amountCents;
    totals.fixed_expense += fixedExpense.amountCents;
    totals.saving += saving.amountCents;
    totals.credit_card += creditCard.amountCents;

    if (dailyExpense.isProjected) {
      totals.daily_expense_projected += dailyExpense.amountCents;
    } else {
      totals.daily_expense_real += dailyExpense.amountCents;
      // Count elapsed days: anchor date up to today (not future)
      if (rowDate <= today) {
        elapsedDays++;
      }
    }
  }

  const averageDailySpend =
    elapsedDays > 0
      ? Math.round(totals.daily_expense_real / elapsedDays)
      : 0;

  const performance =
    totals.income -
    totals.fixed_expense -
    totals.daily_expense_real -
    totals.saving -
    totals.credit_card -
    totals.daily_expense_projected;

  const costOfLife =
    totals.fixed_expense +
    totals.daily_expense_real +
    totals.credit_card +
    totals.daily_expense_projected;

  const economized =
    totals.income > 0 ? totals.saving / totals.income : 0;

  return {
    currentBalance: config.currentBalanceCents,
    monthlyDailyBudget: config.monthlyDailyBudgetCents,
    dailyBudgetTarget,
    dailyProjectedRemaining: totals.daily_expense_projected,
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
      fixed_expense: totals.fixed_expense,
      daily_expense: totals.daily_expense_real,
      saving: totals.saving,
      credit_card: totals.credit_card,
    },
  };
}

// ─── Horizon ────────────────────────────────────────────────

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
