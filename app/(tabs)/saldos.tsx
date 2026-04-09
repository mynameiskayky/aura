import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useCallback } from 'react';
import { Screen } from '@/components/ui';
import { MonthHeader, TypeBadge } from '@/components/finance';
import { MOCK_BALANCES } from '@/mocks/balances';
import { formatCurrency } from '@/core/utils/currency';
import type { DailyBalanceRow, TransactionType } from '@/core/types';

const ALL_TYPES: TransactionType[] = ['income', 'fixed_expense', 'daily_expense', 'saving', 'credit_card'];

function BalanceRow({ item }: { item: DailyBalanceRow }) {
  const isNegative = item.closingBalance < 0;
  const isDanger = item.riskLevel === 'danger';

  return (
    <View className="flex-row items-center px-s3 py-2 border-b border-border-subtle">
      {/* Day column */}
      <View className="w-10 items-center">
        <Text className="text-body font-bold text-text-secondary">{item.day}</Text>
      </View>

      {/* Entries column */}
      <View className="flex-1 flex-row items-center gap-1 px-2">
        {ALL_TYPES.map((type) => {
          const entry = item.entries.find((e) => e.type === type);
          const hasEntry = !!entry;
          return (
            <View key={type} className="items-center">
              <TypeBadge type={type} size="sm" disabled={!hasEntry} />
              {hasEntry && (
                <Text
                  className="text-[9px] mt-0.5 font-semibold"
                  style={{ color: hasEntry ? undefined : 'rgba(255,255,255,0.25)' }}
                >
                  {formatCurrency(entry.amount)}
                </Text>
              )}
            </View>
          );
        })}
      </View>

      {/* Balance column */}
      <View
        className={`w-28 items-end py-2 px-2 rounded-sm ${
          isDanger ? 'bg-danger-balance' : ''
        }`}
      >
        <Text
          className={`text-body font-bold ${
            isNegative ? 'text-white' : 'text-text-primary'
          }`}
        >
          {formatCurrency(item.closingBalance)}
        </Text>
      </View>
    </View>
  );
}

export default function SaldosScreen() {
  const router = useRouter();

  const renderItem = useCallback(
    ({ item }: { item: DailyBalanceRow }) => <BalanceRow item={item} />,
    []
  );

  return (
    <Screen withTabBarInset>
      <MonthHeader onGridPress={() => router.push('/horizon')} />

      {/* Column headers */}
      <View className="flex-row px-s3 py-s1 border-b border-border-strong">
        <View className="w-10 items-center">
          <Text className="text-overline text-text-muted">DIA</Text>
        </View>
        <View className="flex-1 px-2">
          <Text className="text-overline text-text-muted">LANÇAMENTOS</Text>
        </View>
        <View className="w-28 items-end px-2">
          <Text className="text-overline text-text-muted">SALDOS</Text>
        </View>
      </View>

      <FlashList
        data={MOCK_BALANCES}
        renderItem={renderItem}
        keyExtractor={(item) => item.date}
      />
    </Screen>
  );
}
