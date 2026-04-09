import { create } from 'zustand';

import type { AccountConfig, FinancialEntry, TransactionType } from '@/core/types';
import { computeDailyBudget } from '@/domain/finance/engine';

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const initialConfig: AccountConfig = {
  currentBalanceCents: 0,
  balanceAnchorDate: formatDate(new Date()),
  monthlyDailyBudgetCents: 0,
  warningThresholdCents: 0,
  projectionMonths: 6,
};

const initialEntries: FinancialEntry[] = [];

interface FinanceStore {
  accountConfig: AccountConfig;
  entries: FinancialEntry[];
  updateAccountConfig: (partial: Partial<AccountConfig>) => void;
  setMonthlyDailyBudget: (valueCents: number) => void;
  setCurrentBalance: (valueCents: number) => void;
  addEntry: (input: {
    type: TransactionType;
    amountCents: number;
    effectiveDate?: string;
    description?: string;
    recurrence?: FinancialEntry['recurrence'];
  }) => void;
}

export const useFinanceStore = create<FinanceStore>((set) => ({
  accountConfig: initialConfig,
  entries: initialEntries,

  updateAccountConfig: (partial) =>
    set((state) => ({
      accountConfig: {
        ...state.accountConfig,
        ...partial,
        monthlyDailyBudgetCents:
          partial.monthlyDailyBudgetCents !== undefined
            ? Math.max(0, Math.abs(partial.monthlyDailyBudgetCents))
            : state.accountConfig.monthlyDailyBudgetCents,
        warningThresholdCents:
          partial.warningThresholdCents !== undefined
            ? Math.max(0, partial.warningThresholdCents)
            : state.accountConfig.warningThresholdCents,
        projectionMonths:
          partial.projectionMonths !== undefined
            ? Math.max(1, partial.projectionMonths)
            : state.accountConfig.projectionMonths,
      },
    })),

  setMonthlyDailyBudget: (valueCents) =>
    set((state) => ({
      accountConfig: {
        ...state.accountConfig,
        monthlyDailyBudgetCents: Math.max(0, Math.abs(valueCents)),
        warningThresholdCents: computeDailyBudget(Math.max(0, Math.abs(valueCents))) * 3,
      },
    })),

  setCurrentBalance: (valueCents) =>
    set((state) => ({
      accountConfig: {
        ...state.accountConfig,
        currentBalanceCents: valueCents,
        balanceAnchorDate: formatDate(new Date()),
        warningThresholdCents: Math.max(
          state.accountConfig.warningThresholdCents,
          computeDailyBudget(state.accountConfig.monthlyDailyBudgetCents) * 3,
        ),
      },
    })),

  addEntry: ({ type, amountCents, effectiveDate, description, recurrence }) =>
    set((state) => ({
      entries: [
        ...state.entries,
        {
          id: `${type}-${Date.now()}`,
          type,
          amountCents: Math.max(0, Math.abs(amountCents)),
          effectiveDate: effectiveDate ?? formatDate(new Date()),
          description: description?.trim() || undefined,
          recurrence: recurrence ?? null,
        },
      ],
    })),
}));
