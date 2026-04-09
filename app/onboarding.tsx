import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ArrowRight, ArrowLeft, Check, Wallet, Calculator, Zap } from 'lucide-react-native';

import { MoneyKeyboard } from '@/components/forms/MoneyKeyboard';
import { useFinanceStore } from '@/stores/finance-store';
import { computeDailyBudget } from '@/domain/finance/engine';
import { formatCurrency } from '@/core/utils/currency';
import { colors } from '@/theme/colors';

type Step = 'welcome' | 'balance' | 'budget' | 'ready';
const STEPS: Step[] = ['welcome', 'balance', 'budget', 'ready'];

function digitsToCurrencyCents(value: string) {
  const digits = value.replace(/\D/g, '');
  return Number(digits || '0') * 100;
}

export default function OnboardingScreen() {
  const router = useRouter();
  const updateAccountConfig = useFinanceStore((s) => s.updateAccountConfig);
  const completeOnboarding = useFinanceStore((s) => s.completeOnboarding);

  const [step, setStep] = useState<Step>('welcome');
  const [balanceStr, setBalanceStr] = useState('0');
  const [isNegative, setIsNegative] = useState(false);
  const [budgetStr, setBudgetStr] = useState('0');

  const stepIndex = STEPS.indexOf(step);
  const balanceCents = digitsToCurrencyCents(balanceStr) * (isNegative ? -1 : 1);
  const budgetCents = digitsToCurrencyCents(budgetStr);
  const dailyQuota = computeDailyBudget(budgetCents);

  const goNext = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const next = STEPS[stepIndex + 1];
    if (next) setStep(next);
  }, [stepIndex]);

  const goBack = useCallback(() => {
    const prev = STEPS[stepIndex - 1];
    if (prev) setStep(prev);
  }, [stepIndex]);

  const handleKeyPress = useCallback(
    (key: string, target: 'balance' | 'budget') => {
      const setter = target === 'balance' ? setBalanceStr : setBudgetStr;
      if (key === 'delete') {
        setter((prev) => (prev.length <= 1 ? '0' : prev.slice(0, -1)));
      } else if (key === '.') {
        // ignore decimal
      } else {
        setter((prev) => {
          const next = prev === '0' ? key : prev + key;
          return next.length > 10 ? prev : next;
        });
      }
    },
    [],
  );

  const handleFinish = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const today = new Date();
    const anchor = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    updateAccountConfig({
      currentBalanceCents: balanceCents,
      balanceAnchorDate: anchor,
      monthlyDailyBudgetCents: budgetCents,
      warningThresholdCents: dailyQuota * 3,
      projectionMonths: 6,
    });
    completeOnboarding();

    router.replace('/(tabs)/saldos');
  }, [balanceCents, budgetCents, dailyQuota, updateAccountConfig, completeOnboarding, router]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressRow}>
        {STEPS.map((s, i) => (
          <View
            key={s}
            style={[
              styles.progressDot,
              i <= stepIndex && styles.progressDotActive,
            ]}
          />
        ))}
      </View>

      {/* Step content */}
      <View style={styles.content}>
        {step === 'welcome' && <WelcomeStep />}
        {step === 'balance' && (
          <BalanceStep
            balanceStr={balanceStr}
            isNegative={isNegative}
            balanceCents={balanceCents}
            onToggleSign={() => setIsNegative((p) => !p)}
            onKeyPress={(k) => handleKeyPress(k, 'balance')}
          />
        )}
        {step === 'budget' && (
          <BudgetStep
            budgetStr={budgetStr}
            budgetCents={budgetCents}
            dailyQuota={dailyQuota}
            onKeyPress={(k) => handleKeyPress(k, 'budget')}
          />
        )}
        {step === 'ready' && (
          <ReadyStep
            balanceCents={balanceCents}
            budgetCents={budgetCents}
            dailyQuota={dailyQuota}
          />
        )}
      </View>

      {/* Navigation */}
      <View style={styles.navRow}>
        {stepIndex > 0 ? (
          <Pressable onPress={goBack} style={styles.backButton} hitSlop={12}>
            <ArrowLeft size={20} color={colors.textSecondary} />
            <Text style={styles.backText}>Voltar</Text>
          </Pressable>
        ) : (
          <View style={{ width: 80 }} />
        )}

        {step === 'ready' ? (
          <Pressable onPress={handleFinish} style={styles.finishButton}>
            <Text style={styles.finishText}>Começar</Text>
            <Check size={20} color="#FFF" strokeWidth={3} />
          </Pressable>
        ) : (
          <Pressable
            onPress={goNext}
            style={[
              styles.nextButton,
              step === 'balance' && balanceStr === '0' && styles.nextButtonDisabled,
            ]}
            disabled={step === 'balance' && balanceStr === '0'}
          >
            <Text style={styles.nextText}>Próximo</Text>
            <ArrowRight size={20} color="#FFF" strokeWidth={2.5} />
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

// ─── Step Components ────────────────────────────────────────

function WelcomeStep() {
  return (
    <View style={styles.stepCenter}>
      <View style={styles.iconCircle}>
        <Zap size={36} color={colors.accentPrimary} strokeWidth={2} />
      </View>

      <Text style={styles.heroTitle}>Previsibilidade{'\n'}Financeira</Text>

      <Text style={styles.heroSubtitle}>
        Chega de contabilidade mental.{'\n'}
        A partir de agora, a matemática cuida do futuro.
      </Text>

      <View style={styles.pillRow}>
        <Pill text="Saldo exato" />
        <Pill text="Cota diária" />
        <Pill text="Projeção" />
      </View>

      <Text style={styles.methodNote}>
        Baseado na metodologia "Chá Revelação" de Breno Nogueira.{' '}
        O app calcula seu futuro financeiro a partir do momento{' '}
        que você começa — cada dia conta.
      </Text>
    </View>
  );
}

function BalanceStep({
  balanceStr,
  isNegative,
  balanceCents,
  onToggleSign,
  onKeyPress,
}: {
  balanceStr: string;
  isNegative: boolean;
  balanceCents: number;
  onToggleSign: () => void;
  onKeyPress: (key: string) => void;
}) {
  return (
    <View style={styles.stepFull}>
      <View style={styles.stepHeader}>
        <View style={[styles.iconCircleSm, { backgroundColor: 'rgba(92,191,107,0.12)' }]}>
          <Wallet size={22} color={colors.typeIncome} />
        </View>
        <Text style={styles.stepTitle}>Qual é o seu saldo agora?</Text>
        <Text style={styles.stepDesc}>
          Abra o app do banco e digite o valor exato.{'\n'}
          Até os centavos. Sem arredondar.
        </Text>
      </View>

      {/* Amount display */}
      <View style={styles.amountDisplay}>
        <Pressable onPress={onToggleSign} style={styles.signToggle}>
          <Text style={[styles.signText, isNegative && { color: colors.dangerBalanceStrong }]}>
            {isNegative ? '−' : '+'}
          </Text>
        </Pressable>
        <Text
          style={[
            styles.amountValue,
            isNegative && { color: colors.dangerBalanceStrong },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {formatCurrency(balanceCents)}
        </Text>
      </View>

      {isNegative && (
        <View style={styles.warningPill}>
          <Text style={styles.warningText}>Conta no negativo — sem julgamento, só verdade</Text>
        </View>
      )}

      <View style={styles.keyboardWrapper}>
        <MoneyKeyboard onKeyPress={onKeyPress} />
      </View>
    </View>
  );
}

function BudgetStep({
  budgetStr,
  budgetCents,
  dailyQuota,
  onKeyPress,
}: {
  budgetStr: string;
  budgetCents: number;
  dailyQuota: number;
  onKeyPress: (key: string) => void;
}) {
  return (
    <View style={styles.stepFull}>
      <View style={styles.stepHeader}>
        <View style={[styles.iconCircleSm, { backgroundColor: 'rgba(236,33,139,0.12)' }]}>
          <Calculator size={22} color={colors.typeDaily} />
        </View>
        <Text style={styles.stepTitle}>Quanto você gasta por mês{'\n'}no dia a dia?</Text>
        <Text style={styles.stepDesc}>
          Mercado, farmácia, combustível, alimentação...{'\n'}
          Tudo que é variável e não é conta fixa.
        </Text>
      </View>

      <View style={styles.amountDisplay}>
        <Text style={styles.amountValue} numberOfLines={1} adjustsFontSizeToFit>
          {formatCurrency(budgetCents)}
        </Text>
      </View>

      {dailyQuota > 0 && (
        <View style={styles.quotaPreview}>
          <Text style={styles.quotaLabel}>Sua cota diária será</Text>
          <Text style={styles.quotaValue}>{formatCurrency(dailyQuota)}/dia</Text>
          <Text style={styles.quotaHint}>
            Se gastar mais que isso, estará "consumindo dias" futuros
          </Text>
        </View>
      )}

      <View style={styles.keyboardWrapper}>
        <MoneyKeyboard onKeyPress={onKeyPress} />
      </View>
    </View>
  );
}

function ReadyStep({
  balanceCents,
  budgetCents,
  dailyQuota,
}: {
  balanceCents: number;
  budgetCents: number;
  dailyQuota: number;
}) {
  const isNegative = balanceCents < 0;

  return (
    <View style={styles.stepCenter}>
      <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,111,43,0.12)' }]}>
        <Zap size={36} color={colors.accentPrimary} strokeWidth={2} />
      </View>

      <Text style={styles.heroTitle}>Tudo pronto.</Text>
      <Text style={styles.heroSubtitle}>
        A partir de hoje, o Aura projeta{'\n'}cada dia do seu futuro financeiro.
      </Text>

      {/* Summary card */}
      <View style={styles.summaryCard}>
        <SummaryRow
          label="Saldo atual"
          value={formatCurrency(balanceCents)}
          valueColor={isNegative ? colors.dangerBalanceStrong : colors.typeIncome}
        />
        <View style={styles.summaryDivider} />
        <SummaryRow
          label="Diário do mês"
          value={formatCurrency(budgetCents)}
        />
        <View style={styles.summaryDivider} />
        <SummaryRow
          label="Cota diária"
          value={`${formatCurrency(dailyQuota)}/dia`}
          valueColor={colors.typeDaily}
        />
        <View style={styles.summaryDivider} />
        <SummaryRow
          label="Início da projeção"
          value="Hoje"
          valueColor={colors.accentPrimary}
        />
      </View>

      <Text style={styles.readyNote}>
        Dias anteriores a hoje ficam zerados —{'\n'}
        a projeção começa agora.
      </Text>
    </View>
  );
}

// ─── Small components ───────────────────────────────────────

function Pill({ text }: { text: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{text}</Text>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, valueColor ? { color: valueColor } : undefined]}>
        {value}
      </Text>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgApp,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  progressDot: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  progressDotActive: {
    backgroundColor: colors.accentPrimary,
  },
  content: {
    flex: 1,
  },

  // Steps
  stepCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  stepFull: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepHeader: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 28,
  },
  stepDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },

  // Icons
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,111,43,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  iconCircleSm: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Hero
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 38,
  },
  heroSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  methodNote: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 19,
    maxWidth: 300,
  },

  // Pills
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 28,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  // Amount display
  amountDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  signToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signText: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.typeIncome,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },

  // Warning
  warningPill: {
    alignSelf: 'center',
    backgroundColor: 'rgba(163,33,39,0.15)',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dangerBalanceStrong,
  },

  // Quota preview
  quotaPreview: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(236,33,139,0.08)',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginBottom: 8,
  },
  quotaLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  quotaValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.typeDaily,
    marginTop: 2,
  },
  quotaHint: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },

  // Keyboard
  keyboardWrapper: {
    marginTop: 'auto',
    paddingBottom: 8,
  },

  // Ready summary
  summaryCard: {
    width: '100%',
    backgroundColor: colors.bgPanel,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 20,
    marginTop: 28,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  summaryDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  readyNote: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 19,
  },

  // Navigation
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  backText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.accentPrimary,
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  nextButtonDisabled: {
    opacity: 0.4,
  },
  nextText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.typeIncome,
    borderRadius: 999,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  finishText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
