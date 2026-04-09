export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export function formatCompactCurrency(cents: number): string {
  const abs = Math.abs(cents / 100);
  const sign = cents < 0 ? '-' : '';

  if (abs >= 1000) {
    return `${sign}${(abs / 1000).toFixed(1)}K`;
  }
  return `${sign}${abs.toFixed(0)}`;
}
