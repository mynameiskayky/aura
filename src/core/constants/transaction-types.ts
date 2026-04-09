import { colors } from '@/theme/colors';

export const TRANSACTION_TYPES = {
  income: {
    key: 'income',
    label: 'Entrada',
    letter: 'K',
    description: 'Salários, comissões, vales',
    color: colors.typeIncome,
    tailwindColor: 'income',
  },
  fixed_expense: {
    key: 'fixed_expense',
    label: 'Saída',
    letter: '↗',
    description: 'Gastos fixos, boletos, aluguel',
    color: colors.typeFixedExpense,
    tailwindColor: 'fixed-expense',
  },
  daily_expense: {
    key: 'daily_expense',
    label: 'Diário',
    letter: 'D',
    description: 'Gastos variáveis e compras do dia a dia',
    color: colors.typeDaily,
    tailwindColor: 'daily',
  },
  saving: {
    key: 'saving',
    label: 'Economia',
    letter: 'E',
    description: 'Reservas e investimentos',
    color: colors.typeSaving,
    tailwindColor: 'saving',
  },
  credit_card: {
    key: 'credit_card',
    label: 'Cartão',
    letter: 'C',
    description: 'Compras parceladas ou fatura',
    color: colors.typeCreditCard,
    tailwindColor: 'credit-card',
  },
} as const;

export type TransactionTypeKey = keyof typeof TRANSACTION_TYPES;

export const TRANSACTION_TYPE_LIST = Object.values(TRANSACTION_TYPES);
