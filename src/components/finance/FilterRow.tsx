import { View, Text, Pressable } from 'react-native';
import { ChevronDown, LayoutGrid } from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface FilterRowProps {
  className?: string;
}

export function FilterRow({ className = '' }: FilterRowProps) {
  return (
    <View className={`flex-row items-center px-s3 py-2 ${className}`}>
      {/* Dia label */}
      <View className="w-[46px]">
        <Text className="text-[13px] font-semibold text-text-muted">Dia</Text>
      </View>

      {/* Todas pill */}
      <Pressable
        className="flex-row items-center rounded-pill px-3 py-[6px] ml-1"
        style={{
          backgroundColor: 'rgba(255,255,255,0.06)',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.10)',
        }}
      >
        <LayoutGrid size={14} color={colors.textMuted} strokeWidth={2} />
        <Text className="text-[14px] font-semibold text-text-primary ml-2 mr-1">
          Todas
        </Text>
        <ChevronDown size={14} color={colors.textMuted} strokeWidth={2} />
      </Pressable>

      {/* Spacer */}
      <View className="flex-1" />

      {/* Saldos label */}
      <Text className="text-[13px] font-semibold text-text-muted">Saldos</Text>
    </View>
  );
}
