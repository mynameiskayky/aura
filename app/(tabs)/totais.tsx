import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Screen, Divider } from '@/components/ui';
import { MonthHeader, TypeBadge } from '@/components/finance';
import { formatCurrency } from '@/core/utils/currency';
import { TRANSACTION_TYPES } from '@/core/constants/transaction-types';
import type { TransactionType } from '@/core/types';
import { useMonthlyProjection } from '@/features/finance/useMonthlyProjection';
import { colors } from '@/theme/colors';

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
  const router = useRouter();
  const { totals, hasConfiguredProjection } = useMonthlyProjection();

  return (
    <Screen withTabBarInset>
      <MonthHeader showGrid={false} />

      <ScrollView className="flex-1 px-s3" showsVerticalScrollIndicator={false}>
        {!hasConfiguredProjection ? (
          <View className="mt-s2 rounded-[20px] border border-border-subtle bg-panel p-s4">
            <Text className="text-card-title font-extrabold text-text-primary">
              Falta configurar a base da conta
            </Text>
            <Text className="mt-2 text-body text-text-secondary">
              O dashboard depende do saldo atual e do diário mensal. Sem isso,
              performance, custo de vida e diário médio não representam a sua realidade.
            </Text>
            <Pressable
              onPress={() => router.push('/settings/account')}
              className="mt-s4 self-start rounded-pill bg-accent px-s4 py-3"
            >
              <Text className="text-body font-bold text-white">
                Configurar conta
              </Text>
            </Pressable>
          </View>
        ) : null}

        <Pressable
          onPress={() => router.push('/settings/account')}
          className="bg-panel rounded-lg p-s4 mb-s3 mt-s2 border border-border-subtle"
        >
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-s3">
              <Text className="text-overline text-text-muted mb-2">
                Conta e parâmetros
              </Text>
              <Text className="text-body text-text-secondary">
                Saldo atual
              </Text>
              <Text className="text-card-title font-extrabold text-text-primary mb-3">
                {formatCurrency(totals.currentBalance)}
              </Text>

              <View className="flex-row gap-s4">
                <View className="flex-1">
                  <Text className="text-tiny text-text-muted">Diário do mês</Text>
                  <Text className="text-body font-bold text-text-primary mt-1">
                    {formatCurrency(totals.monthlyDailyBudget)}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-tiny text-text-muted">Cota diária</Text>
                  <Text className="text-body font-bold text-text-primary mt-1">
                    {formatCurrency(totals.dailyBudgetTarget)}
                  </Text>
                </View>
              </View>
            </View>

            <ChevronRight size={18} color={colors.textMuted} />
          </View>
        </Pressable>

        <Text className="text-header font-extrabold text-text-primary mb-s4 mt-s2">
          Cálculos do mês
        </Text>

        <MetricCard
          title="Performance"
          value={totals.performance}
          label={totals.performanceLabel}
          formula="[K] - [↗] - [D] - [E] - [C] - [D̃]"
        />

        <MetricCard
          title="Economizado"
          value={totals.economized}
          label={totals.economizedLabel}
          formula="[E] / [K]"
        />

        <MetricCard
          title="Custo de vida"
          value={totals.costOfLife}
          label={totals.costOfLifeLabel}
          formula="[↗] + [D] + [C] + [D̃]"
        />

        <View className="bg-panel rounded-lg p-s4 mb-s4 border border-border-subtle">
          <Text className="text-overline text-text-muted mb-1">Diário médio</Text>
          <View className="flex-row items-baseline gap-2">
            <Text className="text-hero-sm font-extrabold text-text-primary">
              {formatCurrency(totals.dailyAverage)}
            </Text>
            <Text className="text-body text-text-muted">
              / {formatCurrency(totals.dailyBudgetTarget)}
            </Text>
          </View>
          <Text className="text-tiny text-text-muted mt-s1">
            Média real gasta por dia decorrido no mês
          </Text>
        </View>

        <Divider className="mb-s3" />

        <Text className="text-card-title font-extrabold text-text-primary mb-s2">
          Movimentações do mês
        </Text>

        {(Object.entries(totals.movements) as [TransactionType, number][]).map(
          ([type, amount]) => (
            <MovementRow key={type} type={type} amount={amount} />
          )
        )}

        <View className="h-8" />
      </ScrollView>
    </Screen>
  );
}
