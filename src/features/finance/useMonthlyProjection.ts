import { useMemo } from 'react';

import { buildDailyLedger, buildHorizon, buildMonthlyTotals } from '@/domain/finance/engine';
import { useFinanceStore } from '@/stores/finance-store';
import { useUIStore } from '@/stores/ui-store';

export function useMonthlyProjection() {
  const selectedMonth = useUIStore((state) => state.selectedMonth);
  const accountConfig = useFinanceStore((state) => state.accountConfig);
  const entries = useFinanceStore((state) => state.entries);

  return useMemo(() => {
    const ledger = buildDailyLedger(accountConfig, selectedMonth, entries);
    const totals = buildMonthlyTotals(accountConfig, selectedMonth, ledger);
    const horizon = buildHorizon(accountConfig, selectedMonth, entries);
    const hasConfiguredProjection =
      accountConfig.currentBalanceCents !== 0 ||
      accountConfig.monthlyDailyBudgetCents > 0 ||
      entries.length > 0;

    return {
      selectedMonth,
      accountConfig,
      hasConfiguredProjection,
      ledger,
      totals,
      horizon,
    };
  }, [accountConfig, entries, selectedMonth]);
}
