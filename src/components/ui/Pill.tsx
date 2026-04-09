import { View, Text } from 'react-native';

interface PillProps {
  label: string;
  colorClass?: string;
  textColorClass?: string;
  className?: string;
}

export function Pill({
  label,
  colorClass = 'bg-income',
  textColorClass = 'text-white',
  className = '',
}: PillProps) {
  return (
    <View className={`rounded-pill px-3 py-1 ${colorClass} ${className}`}>
      <Text className={`text-tiny font-semibold ${textColorClass}`}>{label}</Text>
    </View>
  );
}
