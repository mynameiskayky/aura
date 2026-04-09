import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

import { Screen } from '@/components/ui';
import { colors } from '@/theme/colors';
import { useFinanceStore } from '@/stores/finance-store';
import { computeDailyBudget } from '@/domain/finance/engine';
import {
  formatCurrency,
  formatCurrencyInput,
  parseCurrencyInput,
} from '@/core/utils/currency';

export default function AccountSettingsScreen() {
  const router = useRouter();
  const accountConfig = useFinanceStore((state) => state.accountConfig);
  const updateAccountConfig = useFinanceStore((state) => state.updateAccountConfig);

  const [balanceInput, setBalanceInput] = useState(
    formatCurrencyInput(accountConfig.currentBalanceCents),
  );
  const [monthlyBudgetInput, setMonthlyBudgetInput] = useState(
    formatCurrencyInput(accountConfig.monthlyDailyBudgetCents),
  );
  const [projectionMonthsInput, setProjectionMonthsInput] = useState(
    String(accountConfig.projectionMonths),
  );

  const preview = useMemo(() => {
    const currentBalanceCents = parseCurrencyInput(balanceInput);
    const monthlyDailyBudgetCents = parseCurrencyInput(monthlyBudgetInput);
    const projectionMonths = Math.max(1, Number(projectionMonthsInput.replace(/\D/g, '')) || 1);

    return {
      currentBalanceCents,
      monthlyDailyBudgetCents,
      dailyBudgetCents: computeDailyBudget(monthlyDailyBudgetCents),
      projectionMonths,
    };
  }, [balanceInput, monthlyBudgetInput, projectionMonthsInput]);

  const handleSave = () => {
    updateAccountConfig({
      currentBalanceCents: preview.currentBalanceCents,
      monthlyDailyBudgetCents: preview.monthlyDailyBudgetCents,
      warningThresholdCents: preview.dailyBudgetCents * 3,
      projectionMonths: preview.projectionMonths,
      balanceAnchorDate: new Date().toISOString().slice(0, 10),
    });
    router.back();
  };

  return (
    <Screen>
      <View className="flex-row items-center px-s3 py-s2">
        <Pressable onPress={() => router.back()} className="mr-s2 p-2">
          <ArrowLeft size={22} color={colors.textPrimary} />
        </Pressable>
        <Text className="text-card-title font-extrabold text-text-primary">
          Configuração da conta
        </Text>
      </View>

      <ScrollView className="flex-1 px-s3" showsVerticalScrollIndicator={false}>
        <View className="bg-panel rounded-lg border border-border-subtle p-s4 mt-s2">
          <Text className="text-overline text-text-muted mb-s2">Saldo atual</Text>
          <TextInput
            value={balanceInput}
            onChangeText={setBalanceInput}
            keyboardType="numbers-and-punctuation"
            placeholder="0"
            placeholderTextColor={colors.textMuted}
            className="rounded-md bg-app px-s3 py-4 text-body text-text-primary"
          />
          <Text className="mt-2 text-tiny text-text-muted">
            Ex.: `10000` = R$ 10.000,00
          </Text>
          <Text className="mt-s2 text-body text-text-secondary">
            {formatCurrency(preview.currentBalanceCents)}
          </Text>
        </View>

        <View className="bg-panel rounded-lg border border-border-subtle p-s4 mt-s3">
          <Text className="text-overline text-text-muted mb-s2">
            Diário do mês
          </Text>
          <TextInput
            value={monthlyBudgetInput}
            onChangeText={setMonthlyBudgetInput}
            keyboardType="numbers-and-punctuation"
            placeholder="0"
            placeholderTextColor={colors.textMuted}
            className="rounded-md bg-app px-s3 py-4 text-body text-text-primary"
          />
          <Text className="mt-2 text-tiny text-text-muted">
            Ex.: `1600` = R$ 1.600,00
          </Text>
          <Text className="mt-s2 text-body text-text-secondary">
            {formatCurrency(preview.monthlyDailyBudgetCents)}
          </Text>
        </View>

        <View className="bg-panel rounded-lg border border-border-subtle p-s4 mt-s3">
          <Text className="text-overline text-text-muted mb-s2">
            Horizonte de projeção
          </Text>
          <TextInput
            value={projectionMonthsInput}
            onChangeText={setProjectionMonthsInput}
            keyboardType="number-pad"
            placeholder="6"
            placeholderTextColor={colors.textMuted}
            className="rounded-md bg-app px-s3 py-4 text-body text-text-primary"
          />
          <Text className="mt-s2 text-body text-text-secondary">
            {preview.projectionMonths} meses
          </Text>
        </View>

        <View className="bg-panel rounded-lg border border-border-subtle p-s4 mt-s3">
          <Text className="text-overline text-text-muted mb-2">Resumo</Text>
          <View className="flex-row justify-between py-2">
            <Text className="text-body text-text-secondary">Cota diária</Text>
            <Text className="text-body font-bold text-text-primary">
              {formatCurrency(preview.dailyBudgetCents)}
            </Text>
          </View>
          <View className="flex-row justify-between py-2">
            <Text className="text-body text-text-secondary">Faixa de alerta</Text>
            <Text className="text-body font-bold text-text-primary">
              {formatCurrency(preview.dailyBudgetCents * 3)}
            </Text>
          </View>
          <View className="flex-row justify-between py-2">
            <Text className="text-body text-text-secondary">Horizonte</Text>
            <Text className="text-body font-bold text-text-primary">
              {preview.projectionMonths} meses
            </Text>
          </View>
          <Text className="mt-s2 text-tiny text-text-muted">
            A metodologia usa o diário mensal para derivar a cota fixa por dia e
            projetar o consumo quando você não lançou gasto real.
          </Text>
        </View>

        <Pressable
          onPress={handleSave}
          className="mb-10 mt-s4 items-center rounded-pill bg-accent px-s4 py-4 active:opacity-80"
        >
          <Text className="text-body font-bold text-white">
            Salvar configuração
          </Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}
