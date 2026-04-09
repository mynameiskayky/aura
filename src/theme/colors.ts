export const colors = {
  // Base
  bgApp: '#1E1E1E',
  bgPanel: '#242424',
  bgElevated: '#2B2B2B',
  borderSubtle: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.14)',
  textPrimary: '#F5F5F5',
  textSecondary: 'rgba(255,255,255,0.72)',
  textMuted: 'rgba(255,255,255,0.42)',

  // Accent
  accentPrimary: '#FF6F2B',

  // Transaction types
  typeIncome: '#5CBF6B',
  typeFixedExpense: '#E86A00',
  typeDaily: '#EC218B',
  typeSaving: '#9BE30C',
  typeCreditCard: '#7B45F1',

  // States
  dangerBalance: '#8F1D22',
  dangerBalanceStrong: '#A32127',
  warningSoft: '#D7AA31',
  infoSoft: '#4B9DFF',
} as const;

export type ColorToken = keyof typeof colors;
