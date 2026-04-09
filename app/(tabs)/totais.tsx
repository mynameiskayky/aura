import { View, Text, ScrollView } from 'react-native';
import { Screen, Divider } from '@/components/ui';
import { MonthHeader, TypeBadge } from '@/components/finance';
import { MOCK_TOTALS } from '@/mocks/totals';
import { formatCurrency } from '@/core/utils/currency';
import { TRANSACTION_TYPES } from '@/core/constants/transaction-types';
import type { TransactionType } from '@/core/types';

function MetricCard({
  title,
  value,
  label,
  formula,
}: {
  title: string;
  value: number;
  label: string;
  formula: string;
}) {
  const isNegative = value < 0;

  return (
    <View className="bg-panel rounded-lg p-s4 mb-s2 border border-border-subtle">
      <Text className="text-overline text-text-muted mb-1">{title}</Text>
      <Text
        className={`text-hero-sm font-extrabold ${
          isNegative ? 'text-danger-balance-strong' : 'text-income'
        }`}
      >
        {typeof value === 'number' && title !== 'Economizado'
          ? formatCurrency(value)
          : `${(value * 100).toFixed(1)}%`}
      </Text>
      <Text className="text-tiny text-text-muted mt-1">{label}</Text>
      <Text className="text-tiny text-text-muted mt-s1 opacity-60">{formula}</Text>
    </View>
  );
}

function MovementRow({ type, amount }: { type: TransactionType; amount: number }) {
  const config = TRANSACTION_TYPES[type];
  return (
    <View className="flex-row items-center py-3">
      <TypeBadge type={type} size="sm" />
      <Text className="text-body text-text-primary ml-3 flex-1">{config.label}</Text>
      <Text className="text-body font-bold text-text-primary">{formatCurrency(amount)}</Text>
    </View>
  );
}

export default function TotaisScreen() {
  const data = MOCK_TOTALS;

  return (
    <Screen withTabBarInset>
      <MonthHeader showGrid={false} />

      <ScrollView className="flex-1 px-s3" showsVerticalScrollIndicator={false}>
        <Text className="text-header font-extrabold text-text-primary mb-s4 mt-s2">
          Cálculos do mês
        </Text>

        <MetricCard
          title="Performance"
          value={data.performance}
          label={data.performanceLabel}
          formula="[K] - [↗] - [D] - [E] - [C] - [D̃]"
        />

        <MetricCard
          title="Economizado"
          value={data.economized}
          label={data.economizedLabel}
          formula="[E] / [K]"
        />

        <MetricCard
          title="Custo de vida"
          value={data.costOfLife}
          label={data.costOfLifeLabel}
          formula="[↗] + [D] + [C] + [D̃]"
        />

        <View className="bg-panel rounded-lg p-s4 mb-s4 border border-border-subtle">
          <Text className="text-overline text-text-muted mb-1">Diário médio</Text>
          <View className="flex-row items-baseline gap-2">
            <Text className="text-hero-sm font-extrabold text-text-primary">
              {formatCurrency(data.dailyAverage)}
            </Text>
            <Text className="text-body text-text-muted">
              / {formatCurrency(data.dailyBudgetTarget)}
            </Text>
          </View>
        </View>

        <Divider className="mb-s3" />

        <Text className="text-card-title font-extrabold text-text-primary mb-s2">
          Movimentações do mês
        </Text>

        {(Object.entries(data.movements) as [TransactionType, number][]).map(
          ([type, amount]) => (
            <MovementRow key={type} type={type} amount={amount} />
          )
        )}

        <View className="h-8" />
      </ScrollView>
    </Screen>
  );
}
