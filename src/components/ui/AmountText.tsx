import { Text } from 'react-native';

interface AmountTextProps {
  value: number;
  size?: 'hero' | 'large' | 'default' | 'small';
  showSign?: boolean;
  className?: string;
}

export function AmountText({ value, size = 'default', showSign = false, className = '' }: AmountTextProps) {
  const isNegative = value < 0;

  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(Math.abs(value / 100));

  const sign = showSign ? (isNegative ? '-' : '+') : isNegative ? '-' : '';
  const display = `${sign}${formatted}`;

  const sizeClasses = {
    hero: 'text-hero',
    large: 'text-hero-sm',
    default: 'text-body',
    small: 'text-tiny',
  };

  const colorClass = isNegative ? 'text-danger-balance-strong' : 'text-text-primary';

  return (
    <Text className={`font-extrabold ${sizeClasses[size]} ${colorClass} ${className}`}>
      {display}
    </Text>
  );
}
