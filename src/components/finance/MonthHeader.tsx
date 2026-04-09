import { View, Text, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { colors } from '@/theme/colors';
import { useUIStore } from '@/stores/ui-store';

interface MonthHeaderProps {
  onGridPress?: () => void;
  showGrid?: boolean;
  className?: string;
}

/** Custom calendar icon matching the reference: colored top bar + day number */
function CalendarIcon({ day }: { day: number }) {
  return (
    <View className="w-[38px] h-[40px] items-center">
      {/* Top colored bar */}
      <View className="w-[34px] h-[10px] rounded-t-[6px] bg-accent" />
      {/* Body */}
      <View
        className="w-[34px] flex-1 rounded-b-[6px] items-center justify-center"
        style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
      >
        <Text className="text-[16px] font-extrabold text-text-primary leading-[18px]">
          {day}
        </Text>
      </View>
    </View>
  );
}

/** Green filled grid icon matching the reference */
function GridIcon() {
  const dotSize = 7;
  const gap = 3;
  return (
    <View className="w-[38px] h-[38px] items-center justify-center">
      <View style={{ gap }} className="flex-col">
        {[0, 1, 2].map((row) => (
          <View key={row} style={{ gap }} className="flex-row">
            {[0, 1, 2].map((col) => (
              <View
                key={col}
                style={{
                  width: dotSize,
                  height: dotSize,
                  borderRadius: 2,
                  backgroundColor: colors.typeIncome,
                }}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

export function MonthHeader({ onGridPress, showGrid = true, className = '' }: MonthHeaderProps) {
  const { selectedMonth, nextMonth, prevMonth, setSelectedMonth } = useUIStore();

  const monthLabel = format(selectedMonth, "MMM/yy", { locale: ptBR });
  const today = new Date().getDate();

  const goToToday = () => {
    setSelectedMonth(new Date());
  };

  return (
    <View className={`flex-row items-center justify-between px-s3 py-s2 ${className}`}>
      <Pressable onPress={goToToday} hitSlop={8}>
        <CalendarIcon day={today} />
      </Pressable>

      <View className="flex-row items-center gap-5">
        <Pressable onPress={prevMonth} hitSlop={12} className="p-1">
          <ChevronLeft size={24} color={colors.textPrimary} strokeWidth={2.5} />
        </Pressable>
        <Text className="text-[22px] font-extrabold text-text-primary capitalize min-w-[88px] text-center">
          {monthLabel}
        </Text>
        <Pressable onPress={nextMonth} hitSlop={12} className="p-1">
          <ChevronRight size={24} color={colors.textPrimary} strokeWidth={2.5} />
        </Pressable>
      </View>

      {showGrid ? (
        <Pressable onPress={onGridPress} hitSlop={8}>
          <GridIcon />
        </Pressable>
      ) : (
        <View className="w-[38px]" />
      )}
    </View>
  );
}
