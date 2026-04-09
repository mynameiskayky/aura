import { View, Text } from 'react-native';
import { TRANSACTION_TYPES, type TransactionTypeKey } from '@/core/constants/transaction-types';

interface TypeBadgeProps {
  type: TransactionTypeKey;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { container: 'w-6 h-6', text: 'text-[10px]' },
  md: { container: 'w-8 h-8', text: 'text-[13px]' },
  lg: { container: 'w-10 h-10', text: 'text-[16px]' },
};

export function TypeBadge({ type, size = 'md', disabled = false, className = '' }: TypeBadgeProps) {
  const config = TRANSACTION_TYPES[type];
  const sizeConfig = sizeMap[size];

  return (
    <View
      className={`${sizeConfig.container} rounded-full items-center justify-center ${className}`}
      style={{
        backgroundColor: disabled ? 'rgba(255,255,255,0.08)' : config.color,
      }}
    >
      <Text
        className={`${sizeConfig.text} font-bold`}
        style={{
          color: disabled ? 'rgba(255,255,255,0.25)' : '#FFFFFF',
        }}
      >
        {config.letter}
      </Text>
    </View>
  );
}
