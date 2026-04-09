import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  InteractionManager,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import { CircleOff, PencilLine, PlusCircle, RotateCcw, Trash2, X } from 'lucide-react-native';
import { Screen } from '@/components/ui';
import { MonthHeader, TypeBadge, FilterRow } from '@/components/finance';
import { formatCurrency } from '@/core/utils/currency';
import { colors } from '@/theme/colors';
import { useMonthlyProjection } from '@/features/finance/useMonthlyProjection';
import { useFinanceStore } from '@/stores/finance-store';
import { useUIStore } from '@/stores/ui-store';
import { TRANSACTION_TYPES } from '@/core/constants/transaction-types';
import type { DailyBalanceRow, DayTypeAmount, FinancialEntry, TransactionType } from '@/core/types';

const TYPE_ORDER: TransactionType[] = [
  'income',
  'fixed_expense',
  'daily_expense',
  'saving',
  'credit_card',
];

const TYPE_ROW_HEIGHT = 44;
const DAY_GROUP_HEIGHT = TYPE_ROW_HEIGHT * 5 + 16;

function isSameMonth(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth()
  );
}

function clampDay(year: number, monthIndex: number, dayOfMonth: number) {
  return Math.min(dayOfMonth, new Date(year, monthIndex + 1, 0).getDate());
}

function matchesEntryOnDate(entry: FinancialEntry, date: string) {
  if (!entry.recurrence) {
    return entry.effectiveDate === date;
  }

  if (entry.recurrence.frequency !== 'monthly') {
    return false;
  }

  const selected = new Date(`${date}T00:00:00`);
  const firstDate = new Date(`${entry.effectiveDate}T00:00:00`);

  if (selected < firstDate) {
    return false;
  }

  if (entry.recurrence.endDate) {
    const endDate = new Date(`${entry.recurrence.endDate}T00:00:00`);
    if (selected > endDate) {
      return false;
    }
  }

  return (
    selected.getDate() ===
    clampDay(selected.getFullYear(), selected.getMonth(), entry.recurrence.dayOfMonth)
  );
}

function formatEntryDate(date: string) {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

/** Single type row inside a day group: badge + amount */
const TypeRow = React.memo(function TypeRow({
  entry,
  onPress,
}: {
  entry: DayTypeAmount;
  onPress?: () => void;
}) {
  const hasValue = entry.amountCents > 0;
  const isInteractive = Boolean(onPress) && (hasValue || entry.isProjected || entry.isProjectionExcluded);
  const amountLabel = entry.isProjectionExcluded ? 'Sem gasto' : formatCurrency(entry.amountCents);
  const actionLabel = entry.isProjected ? 'ajustar' : entry.isProjectionExcluded ? 'editar' : 'ver';
  const textColor = !hasValue
    ? entry.isProjectionExcluded
      ? colors.infoSoft
      : 'rgba(255,255,255,0.28)'
    : entry.isProjected
      ? colors.textSecondary
      : colors.textPrimary;

  return (
    <Pressable
      onPress={onPress}
      disabled={!isInteractive}
      hitSlop={6}
        style={[
          styles.typeRow,
          isInteractive && styles.typeRowInteractive,
          entry.isProjected && styles.typeRowProjected,
          entry.isProjectionExcluded && styles.typeRowExcluded,
        ]}
    >
      <TypeBadge
        type={entry.type}
        size="md"
        disabled={!hasValue}
      />
      <Text
        style={[styles.typeAmount, { color: textColor }]}
        numberOfLines={1}
      >
        {amountLabel}
      </Text>
      {isInteractive ? (
        <Text style={styles.typeActionText}>{actionLabel}</Text>
      ) : null}
    </Pressable>
  );
});

/** Full day group: day number (left) | 5 type rows (center) | balance (right) */
const DayGroup = React.memo(function DayGroup({
  item,
  onTypePress,
}: {
  item: DailyBalanceRow;
  onTypePress: (date: string, entry: DayTypeAmount) => void;
}) {
  const isNegative = item.closingBalance < 0;
  const isDanger = item.riskLevel === 'danger';

  return (
    <View style={styles.dayGroup}>
      {/* Day number column */}
      <View style={styles.dayCol}>
        <Text style={styles.dayText}>{item.day}</Text>
      </View>

      {/* Vertical separator */}
      <View style={styles.vSeparator} />

      {/* Types column: 5 stacked rows */}
      <View style={styles.typesCol}>
        {item.types.map((entry) => (
          <TypeRow
            key={entry.type}
            entry={entry}
            onPress={() => onTypePress(item.date, entry)}
          />
        ))}
      </View>

      {/* Vertical separator */}
      <View style={styles.vSeparator} />

      {/* Balance column (spans full height) */}
      <View
        style={[
          styles.balanceCol,
          isDanger && { backgroundColor: colors.dangerBalance },
        ]}
      >
        <Text
          style={[
            styles.balanceText,
            isNegative && { color: '#FFFFFF' },
          ]}
          numberOfLines={1}
        >
          {formatCurrency(item.closingBalance)}
        </Text>
      </View>
    </View>
  );
});

export default function SaldosScreen() {
  const router = useRouter();
  const { ledger, hasConfiguredProjection, selectedMonth } = useMonthlyProjection();
  const entries = useFinanceStore((state) => state.entries);
  const accountConfig = useFinanceStore((state) => state.accountConfig);
  const removeEntry = useFinanceStore((state) => state.removeEntry);
  const excludeDailyProjection = useFinanceStore((state) => state.excludeDailyProjection);
  const includeDailyProjection = useFinanceStore((state) => state.includeDailyProjection);
  const setSelectedMonth = useUIStore((state) => state.setSelectedMonth);
  const listRef = useRef<any>(null);
  const [pendingTodayFocus, setPendingTodayFocus] = useState(true);
  const [selectedInspector, setSelectedInspector] = useState<{
    date: string;
    type: TransactionType;
    entry: DayTypeAmount;
  } | null>(null);

  const inspectorEntries = useMemo(() => {
    if (!selectedInspector) {
      return [];
    }

    return entries
      .filter(
        (entry) =>
          entry.type === selectedInspector.type && matchesEntryOnDate(entry, selectedInspector.date),
      )
      .sort((left, right) => right.effectiveDate.localeCompare(left.effectiveDate));
  }, [entries, selectedInspector]);

  const scrollToDay = useCallback(
    (day: number, animated: boolean) => {
      if (ledger.length === 0) {
        return;
      }

      const targetIndex = Math.max(0, Math.min(day - 1, ledger.length - 1));
      const task = InteractionManager.runAfterInteractions(() => {
        requestAnimationFrame(() => {
          listRef.current?.scrollToIndex({
            animated,
            index: targetIndex,
            viewPosition: 0.18,
          });
        });
      });

      return () => task.cancel();
    },
    [ledger.length],
  );

  useFocusEffect(
    useCallback(() => {
      const today = new Date();
      setSelectedMonth(today);
      setPendingTodayFocus(true);
    }, [setSelectedMonth]),
  );

  useEffect(() => {
    if (!pendingTodayFocus || !isSameMonth(selectedMonth, new Date())) {
      return;
    }

    const cancel = scrollToDay(new Date().getDate(), false);
    setPendingTodayFocus(false);

    return cancel;
  }, [pendingTodayFocus, scrollToDay, selectedMonth]);

  const openInspector = useCallback(
    (date: string, entry: DayTypeAmount) => {
      const type = entry.type;
      const hasRealEntries = entries.some(
        (entry) => entry.type === type && matchesEntryOnDate(entry, date),
      );

      const canManageProjectedDaily =
        type === 'daily_expense' && (entry.isProjected || entry.isProjectionExcluded);

      if (!hasRealEntries && !canManageProjectedDaily) {
        return;
      }

      Haptics.selectionAsync();
      setSelectedInspector({ date, type, entry });
    },
    [entries],
  );

  const closeInspector = useCallback(() => {
    setSelectedInspector(null);
  }, []);

  const handleEditEntry = useCallback(
    (entryId: string) => {
      closeInspector();
      router.push({
        pathname: '/add',
        params: { entryId },
      });
    },
    [closeInspector, router],
  );

  const handleRemoveEntry = useCallback(
    (entryId: string) => {
      Alert.alert(
        'Remover lançamento',
        'Esse lançamento será removido do cálculo imediatamente.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Remover',
            style: 'destructive',
            onPress: () => {
              removeEntry(entryId);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              closeInspector();
            },
          },
        ],
      );
    },
    [closeInspector, removeEntry],
  );

  const handleAddRealSpend = useCallback(() => {
    if (!selectedInspector) {
      return;
    }

    closeInspector();
    router.push({
      pathname: '/add',
      params: {
        type: selectedInspector.type,
        date: selectedInspector.date,
      },
    });
  }, [closeInspector, router, selectedInspector]);

  const handleExcludeProjectedDaily = useCallback(() => {
    if (!selectedInspector) {
      return;
    }

    excludeDailyProjection(selectedInspector.date);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    closeInspector();
  }, [closeInspector, excludeDailyProjection, selectedInspector]);

  const handleRestoreProjectedDaily = useCallback(() => {
    if (!selectedInspector) {
      return;
    }

    includeDailyProjection(selectedInspector.date);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    closeInspector();
  }, [closeInspector, includeDailyProjection, selectedInspector]);

  const isDailyInspector = selectedInspector?.type === 'daily_expense';
  const inspectorHasRealEntries = inspectorEntries.length > 0;
  const inspectorIsProjected = Boolean(selectedInspector?.entry.isProjected);
  const inspectorIsExcluded = Boolean(selectedInspector?.entry.isProjectionExcluded);

  const renderItem = useCallback(
    ({ item }: { item: DailyBalanceRow }) => (
      <DayGroup item={item} onTypePress={openInspector} />
    ),
    [openInspector],
  );

  return (
    <Screen withTabBarInset>
      <MonthHeader
        onGridPress={() => router.push('/horizon')}
        onTodayPress={() => setPendingTodayFocus(true)}
      />
      <FilterRow />

      {hasConfiguredProjection ? (
        <FlashList
          ref={listRef}
          data={ledger}
          renderItem={renderItem}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={HorizontalDivider}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Configure a conta para iniciar a projeção</Text>
          <Text style={styles.emptyBody}>
            Defina saldo atual e diário mensal. Depois lance entradas, saídas, cartão e economia para o cálculo diário ficar real.
          </Text>
          <Pressable
            onPress={() => router.push('/settings/account')}
            style={styles.emptyButton}
          >
            <Text style={styles.emptyButtonText}>Configurar conta</Text>
          </Pressable>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent
        visible={Boolean(selectedInspector)}
        onRequestClose={closeInspector}
      >
        <View style={styles.sheetOverlay}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={closeInspector} />

          <View style={styles.sheetCard}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeaderCopy}>
                <Text style={styles.sheetTitle}>
                  {selectedInspector
                    ? TRANSACTION_TYPES[selectedInspector.type].label
                    : 'Lançamentos'}
                </Text>
                <Text style={styles.sheetSubtitle}>
                  {selectedInspector ? formatEntryDate(selectedInspector.date) : ''}
                </Text>
              </View>
              <Pressable onPress={closeInspector} hitSlop={12} style={styles.sheetCloseButton}>
                <X size={20} color={colors.textPrimary} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.sheetScroll}
              contentContainerStyle={styles.sheetScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {isDailyInspector && !inspectorHasRealEntries ? (
                <View style={styles.helperCard}>
                  <Text style={styles.helperTitle}>
                    {inspectorIsExcluded ? 'Dia marcado como sem gasto' : 'Diário flexível por dia'}
                  </Text>
                  <Text style={styles.helperBody}>
                    {inspectorIsExcluded
                      ? 'Esse dia não está consumindo a projeção diária. Se quiser, você pode registrar um gasto real ou religar a projeção automática.'
                      : `Hoje o app projetou ${formatCurrency(selectedInspector?.entry.amountCents ?? 0)} para o diário. Se você não gastou nada, pode zerar só este dia sem afetar os outros.`}
                  </Text>

                  <View style={styles.helperActions}>
                    <Pressable
                      onPress={handleAddRealSpend}
                      style={[styles.entryActionButton, styles.entryActionPrimary]}
                    >
                      <PlusCircle size={16} color="#FFFFFF" />
                      <Text style={styles.entryActionPrimaryText}>Lançar gasto real</Text>
                    </Pressable>
                    {inspectorIsExcluded ? (
                      <Pressable
                        onPress={handleRestoreProjectedDaily}
                        style={[styles.entryActionButton, styles.entryActionNeutral]}
                      >
                        <RotateCcw size={16} color={colors.textPrimary} />
                        <Text style={styles.entryActionNeutralText}>Reativar projeção</Text>
                      </Pressable>
                    ) : inspectorIsProjected ? (
                      <Pressable
                        onPress={handleExcludeProjectedDaily}
                        style={[styles.entryActionButton, styles.entryActionNeutral]}
                      >
                        <CircleOff size={16} color={colors.textPrimary} />
                        <Text style={styles.entryActionNeutralText}>Marcar sem gasto</Text>
                      </Pressable>
                    ) : null}
                  </View>
                </View>
              ) : null}

              {inspectorEntries.map((entry) => (
                <View key={entry.id} style={styles.entryCard}>
                  <View style={styles.entryCardTop}>
                    <View style={styles.entryCardCopy}>
                      <Text style={styles.entryTitle}>
                        {entry.description || TRANSACTION_TYPES[entry.type].label}
                      </Text>
                      <Text style={styles.entryMeta}>
                        {formatEntryDate(entry.effectiveDate)}
                        {entry.recurrence ? ' • mensal' : ' • avulso'}
                      </Text>
                    </View>
                    <Text style={styles.entryAmount}>{formatCurrency(entry.amountCents)}</Text>
                  </View>

                  <View style={styles.entryActions}>
                    <Pressable
                      onPress={() => handleEditEntry(entry.id)}
                      style={[styles.entryActionButton, styles.entryActionPrimary]}
                    >
                      <PencilLine size={16} color="#FFFFFF" />
                      <Text style={styles.entryActionPrimaryText}>Editar</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleRemoveEntry(entry.id)}
                      style={[styles.entryActionButton, styles.entryActionDanger]}
                    >
                      <Trash2 size={16} color={colors.dangerBalanceStrong} />
                      <Text style={styles.entryActionDangerText}>Remover</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

function HorizontalDivider() {
  return <View style={styles.hDivider} />;
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 16,
  },
  dayGroup: {
    flexDirection: 'row',
    minHeight: DAY_GROUP_HEIGHT,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.bgPanel,
    overflow: 'hidden',
  },
  dayCol: {
    width: 58,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
  },
  dayText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  vSeparator: {
    width: 1,
    backgroundColor: colors.borderStrong,
  },
  typesCol: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: TYPE_ROW_HEIGHT,
    gap: 12,
    borderRadius: 16,
    paddingHorizontal: 8,
  },
  typeRowInteractive: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  typeRowProjected: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  typeRowExcluded: {
    backgroundColor: 'rgba(75,157,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(75,157,255,0.26)',
  },
  typeAmount: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  typeActionText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  balanceCol: {
    width: 140,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 16,
    paddingLeft: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  balanceText: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  hDivider: {
    height: 10,
  },
  emptyState: {
    margin: 16,
    padding: 20,
    borderRadius: 20,
    backgroundColor: colors.bgPanel,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  emptyBody: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  emptyButton: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: colors.accentPrimary,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.42)',
  },
  sheetCard: {
    maxHeight: '76%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: '#202020',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 28,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 54,
    height: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginBottom: 14,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  sheetHeaderCopy: {
    flex: 1,
    gap: 4,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  sheetSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  sheetCloseButton: {
    minWidth: 44,
    minHeight: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  sheetScroll: {
    flexGrow: 0,
  },
  sheetScrollContent: {
    gap: 12,
    paddingBottom: 12,
  },
  helperCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.bgPanel,
    padding: 16,
    gap: 14,
  },
  helperTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  helperBody: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  helperActions: {
    gap: 10,
  },
  entryCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.bgPanel,
    padding: 16,
    gap: 14,
  },
  entryCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  entryCardCopy: {
    flex: 1,
    gap: 6,
  },
  entryTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  entryMeta: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  entryAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  entryActions: {
    flexDirection: 'row',
    gap: 10,
  },
  entryActionButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  entryActionPrimary: {
    backgroundColor: colors.accentPrimary,
    borderColor: colors.accentPrimary,
  },
  entryActionDanger: {
    backgroundColor: 'rgba(163,33,39,0.1)',
    borderColor: 'rgba(163,33,39,0.32)',
  },
  entryActionNeutral: {
    backgroundColor: colors.bgElevated,
    borderColor: colors.borderStrong,
  },
  entryActionPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  entryActionNeutralText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  entryActionDangerText: {
    color: colors.dangerBalanceStrong,
    fontSize: 14,
    fontWeight: '800',
  },
});
