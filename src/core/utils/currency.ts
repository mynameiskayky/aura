export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export function formatCurrencyInput(cents: number): string {
  const absolute = Math.abs(cents) / 100;
  const formatted = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(absolute);

  return cents < 0 ? `-${formatted}` : formatted;
}

export function parseCurrencyInput(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) {
    return 0;
  }

  const isNegative = trimmed.startsWith('-');
  const normalized = trimmed.replace(/[^\d,.-]/g, '');
  const lastComma = normalized.lastIndexOf(',');
  const lastDot = normalized.lastIndexOf('.');
  const lastSeparator = Math.max(lastComma, lastDot);

  let cents = 0;

  if (lastSeparator >= 0) {
    const fractionalRaw = normalized.slice(lastSeparator + 1).replace(/\D/g, '');
    const hasExplicitDecimals = fractionalRaw.length > 0 && fractionalRaw.length <= 2;

    if (hasExplicitDecimals) {
      const integerPart = normalized.slice(0, lastSeparator).replace(/\D/g, '');
      const decimalPart = fractionalRaw.padEnd(2, '0').slice(0, 2);
      cents = Number(integerPart || '0') * 100 + Number(decimalPart || '0');
    } else {
      const digits = normalized.replace(/\D/g, '');
      cents = Number(digits || '0') * 100;
    }
  } else {
    const digits = normalized.replace(/\D/g, '');
    cents = Number(digits || '0') * 100;
  }

  return isNegative ? -cents : cents;
}

export function formatCompactCurrency(cents: number): string {
  const abs = Math.abs(cents / 100);
  const sign = cents < 0 ? '-' : '';

  if (abs >= 1000) {
    return `${sign}${(abs / 1000).toFixed(1)}K`;
  }
  return `${sign}${abs.toFixed(0)}`;
}
