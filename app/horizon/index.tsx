import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Screen } from '@/components/ui';
import { colors } from '@/theme/colors';
import { MOCK_HORIZON } from '@/mocks/horizon';
import { formatCompactCurrency } from '@/core/utils/currency';

export default function HorizonScreen() {
  const router = useRouter();

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <Screen>
      {/* Header */}
      <View className="flex-row items-center px-s3 py-s2">
        <Pressable onPress={() => router.back()} className="p-2 mr-s2">
          <ArrowLeft size={22} color={colors.textPrimary} />
        </Pressable>
        <Text className="text-card-title font-extrabold text-text-primary">
          Horizonte de saldos
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Month headers */}
          <View className="flex-row">
            <View className="w-12 h-10 items-center justify-center">
              <Text className="text-tiny text-text-muted">Dia</Text>
            </View>
            {MOCK_HORIZON.map((month) => (
              <View key={month.monthLabel} className="w-20 h-10 items-center justify-center">
                <Text className="text-tiny font-bold text-text-secondary">
                  {month.monthLabel}
                </Text>
              </View>
            ))}
          </View>

          {/* Grid */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {days.map((day) => (
              <View key={day} className="flex-row border-b border-border-subtle">
                <View className="w-12 h-8 items-center justify-center">
                  <Text className="text-tiny text-text-muted">{day}</Text>
                </View>
                {MOCK_HORIZON.map((month) => {
                  const balance = month.dailyBalances[day - 1] ?? 0;
                  const isNegative = balance < 0;
                  return (
                    <View
                      key={`${month.monthLabel}-${day}`}
                      className={`w-20 h-8 items-center justify-center ${
                        isNegative ? 'bg-danger-balance' : ''
                      }`}
                    >
                      <Text
                        className={`text-[10px] font-semibold ${
                          isNegative ? 'text-white' : 'text-text-secondary'
                        }`}
                      >
                        {formatCompactCurrency(balance)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </Screen>
  );
}
