import { View, Text, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight, Calendar, Grid3x3 } from 'lucide-react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { colors } from '@/theme/colors';
import { useUIStore } from '@/stores/ui-store';

interface MonthHeaderProps {
  onGridPress?: () => void;
  showGrid?: boolean;
  className?: string;
}

export function MonthHeader({ onGridPress, showGrid = true, className = '' }: MonthHeaderProps) {
  const { selectedMonth, nextMonth, prevMonth, setSelectedMonth } = useUIStore();

  const monthLabel = format(selectedMonth, "MMM/yy", { locale: ptBR });

  const goToToday = () => {
    setSelectedMonth(new Date());
  };

  return (
    <View className={`flex-row items-center justify-between px-s3 py-s2 ${className}`}>
      <Pressable onPress={goToToday} className="p-2">
        <Calendar size={22} color={colors.textPrimary} />
      </Pressable>

      <View className="flex-row items-center gap-4">
        <Pressable onPress={prevMonth} className="p-2">
          <ChevronLeft size={22} color={colors.textPrimary} />
        </Pressable>
        <Text className="text-card-title font-extrabold text-text-primary capitalize min-w-[80px] text-center">
          {monthLabel}
        </Text>
        <Pressable onPress={nextMonth} className="p-2">
          <ChevronRight size={22} color={colors.textPrimary} />
        </Pressable>
      </View>

      {showGrid ? (
        <Pressable onPress={onGridPress} className="p-2">
          <Grid3x3 size={22} color={colors.textPrimary} />
        </Pressable>
      ) : (
        <View className="w-[38px]" />
      )}
    </View>
  );
}
