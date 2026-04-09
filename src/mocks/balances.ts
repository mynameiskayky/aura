import type { DailyBalanceRow } from '../core/types';

export const MOCK_BALANCES: DailyBalanceRow[] = [
  {
    day: 1,
    date: '01/04',
    entries: [
      { type: 'income', amount: 320000, isProjected: false },
      { type: 'fixed_expense', amount: -150000, isProjected: false },
      { type: 'fixed_expense', amount: -89900, isProjected: false },
    ],
    closingBalance: 80100,
    riskLevel: 'safe',
  },
  {
    day: 2,
    date: '02/04',
    entries: [
      { type: 'daily_expense', amount: -4500, isProjected: false },
      { type: 'daily_expense', amount: -2390, isProjected: false },
    ],
    closingBalance: 73210,
    riskLevel: 'safe',
  },
  {
    day: 3,
    date: '03/04',
    entries: [
      { type: 'daily_expense', amount: -8900, isProjected: false },
      { type: 'daily_expense', amount: -3200, isProjected: false },
      { type: 'daily_expense', amount: -1500, isProjected: false },
    ],
    closingBalance: 59610,
    riskLevel: 'safe',
  },
  {
    day: 4,
    date: '04/04',
    entries: [
      { type: 'daily_expense', amount: -5333, isProjected: true },
    ],
    closingBalance: 54277,
    riskLevel: 'safe',
  },
  {
    day: 5,
    date: '05/04',
    entries: [
      { type: 'credit_card', amount: -42000, isProjected: false },
      { type: 'daily_expense', amount: -6700, isProjected: false },
    ],
    closingBalance: 5577,
    riskLevel: 'warning',
  },
  {
    day: 6,
    date: '06/04',
    entries: [
      { type: 'daily_expense', amount: -7800, isProjected: false },
    ],
    closingBalance: -2223,
    riskLevel: 'danger',
  },
  {
    day: 7,
    date: '07/04',
    entries: [
      { type: 'daily_expense', amount: -4200, isProjected: false },
      { type: 'daily_expense', amount: -3100, isProjected: false },
    ],
    closingBalance: -9523,
    riskLevel: 'danger',
  },
  {
    day: 8,
    date: '08/04',
    entries: [
      { type: 'daily_expense', amount: -5333, isProjected: true },
    ],
    closingBalance: -14856,
    riskLevel: 'danger',
  },
  {
    day: 9,
    date: '09/04',
    entries: [
      { type: 'daily_expense', amount: -2900, isProjected: false },
    ],
    closingBalance: -17756,
    riskLevel: 'danger',
  },
  {
    day: 10,
    date: '10/04',
    entries: [
      { type: 'income', amount: 150000, isProjected: false },
      { type: 'daily_expense', amount: -6400, isProjected: false },
      { type: 'fixed_expense', amount: -49900, isProjected: false },
    ],
    closingBalance: 75944,
    riskLevel: 'safe',
  },
  {
    day: 11,
    date: '11/04',
    entries: [
      { type: 'daily_expense', amount: -9800, isProjected: false },
      { type: 'daily_expense', amount: -4500, isProjected: false },
    ],
    closingBalance: 61644,
    riskLevel: 'safe',
  },
  {
    day: 12,
    date: '12/04',
    entries: [
      { type: 'daily_expense', amount: -12300, isProjected: false },
      { type: 'saving', amount: -20000, isProjected: false },
    ],
    closingBalance: 29344,
    riskLevel: 'warning',
  },
  {
    day: 13,
    date: '13/04',
    entries: [
      { type: 'daily_expense', amount: -7600, isProjected: false },
    ],
    closingBalance: 21744,
    riskLevel: 'warning',
  },
  {
    day: 14,
    date: '14/04',
    entries: [
      { type: 'daily_expense', amount: -5333, isProjected: true },
    ],
    closingBalance: 16411,
    riskLevel: 'warning',
  },
  {
    day: 15,
    date: '15/04',
    entries: [
      { type: 'fixed_expense', amount: -35000, isProjected: false },
      { type: 'daily_expense', amount: -8900, isProjected: false },
    ],
    closingBalance: -27489,
    riskLevel: 'danger',
  },
  {
    day: 16,
    date: '16/04',
    entries: [
      { type: 'daily_expense', amount: -3200, isProjected: false },
      { type: 'daily_expense', amount: -5100, isProjected: false },
    ],
    closingBalance: -35789,
    riskLevel: 'danger',
  },
  {
    day: 17,
    date: '17/04',
    entries: [
      { type: 'daily_expense', amount: -5333, isProjected: true },
    ],
    closingBalance: -41122,
    riskLevel: 'danger',
  },
  {
    day: 18,
    date: '18/04',
    entries: [
      { type: 'daily_expense', amount: -6700, isProjected: false },
      { type: 'credit_card', amount: -28500, isProjected: false },
    ],
    closingBalance: -76322,
    riskLevel: 'danger',
  },
  {
    day: 19,
    date: '19/04',
    entries: [
      { type: 'daily_expense', amount: -4100, isProjected: false },
    ],
    closingBalance: -80422,
    riskLevel: 'danger',
  },
  {
    day: 20,
    date: '20/04',
    entries: [
      { type: 'income', amount: 320000, isProjected: false },
      { type: 'fixed_expense', amount: -150000, isProjected: false },
    ],
    closingBalance: 89578,
    riskLevel: 'safe',
  },
  {
    day: 21,
    date: '21/04',
    entries: [
      { type: 'daily_expense', amount: -11200, isProjected: false },
      { type: 'daily_expense', amount: -3800, isProjected: false },
    ],
    closingBalance: 74578,
    riskLevel: 'safe',
  },
  {
    day: 22,
    date: '22/04',
    entries: [
      { type: 'daily_expense', amount: -5333, isProjected: true },
    ],
    closingBalance: 69245,
    riskLevel: 'safe',
  },
  {
    day: 23,
    date: '23/04',
    entries: [
      { type: 'daily_expense', amount: -15600, isProjected: false },
      { type: 'daily_expense', amount: -8900, isProjected: false },
      { type: 'saving', amount: -30000, isProjected: false },
    ],
    closingBalance: 14745,
    riskLevel: 'warning',
  },
  {
    day: 24,
    date: '24/04',
    entries: [
      { type: 'daily_expense', amount: -7200, isProjected: false },
    ],
    closingBalance: 7545,
    riskLevel: 'warning',
  },
  {
    day: 25,
    date: '25/04',
    entries: [
      { type: 'fixed_expense', amount: -25000, isProjected: false },
      { type: 'daily_expense', amount: -4300, isProjected: false },
    ],
    closingBalance: -21755,
    riskLevel: 'danger',
  },
  {
    day: 26,
    date: '26/04',
    entries: [
      { type: 'daily_expense', amount: -5333, isProjected: true },
    ],
    closingBalance: -27088,
    riskLevel: 'danger',
  },
  {
    day: 27,
    date: '27/04',
    entries: [
      { type: 'daily_expense', amount: -9100, isProjected: false },
      { type: 'daily_expense', amount: -2800, isProjected: false },
    ],
    closingBalance: -38988,
    riskLevel: 'danger',
  },
  {
    day: 28,
    date: '28/04',
    entries: [
      { type: 'daily_expense', amount: -5333, isProjected: true },
    ],
    closingBalance: -44321,
    riskLevel: 'danger',
  },
  {
    day: 29,
    date: '29/04',
    entries: [
      { type: 'daily_expense', amount: -6800, isProjected: false },
      { type: 'credit_card', amount: -18700, isProjected: false },
    ],
    closingBalance: -69821,
    riskLevel: 'danger',
  },
  {
    day: 30,
    date: '30/04',
    entries: [
      { type: 'daily_expense', amount: -5333, isProjected: true },
    ],
    closingBalance: -75154,
    riskLevel: 'danger',
  },
];
