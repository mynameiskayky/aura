import { View, Text, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface ListItemRowProps {
  icon?: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  className?: string;
}

export function ListItemRow({
  icon,
  label,
  value,
  onPress,
  showChevron = true,
  className = '',
}: ListItemRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center py-4 px-s3 ${className}`}
    >
      {icon && <View className="mr-s3">{icon}</View>}
      <Text className="flex-1 text-body text-text-primary">{label}</Text>
      {value && <Text className="text-body text-text-secondary mr-2">{value}</Text>}
      {showChevron && onPress && (
        <ChevronRight size={18} color={colors.textMuted} />
      )}
    </Pressable>
  );
}
