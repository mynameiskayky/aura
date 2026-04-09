import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Screen } from '@/components/ui';
import { MonthHeader, TypeBadge, FilterRow } from '@/components/finance';
import { MOCK_BALANCES } from '@/mocks/balances';
import { formatCurrency } from '@/core/utils/currency';
import { colors } from '@/theme/colors';
import type { DailyBalanceRow, DayTypeAmount, TransactionType } from '@/core/types';

const TYPE_ORDER: TransactionType[] = [
  'income',
  'fixed_expense',
  'daily_expense',
  'saving',
  'credit_card',
];

const TYPE_ROW_HEIGHT = 36;
const DAY_GROUP_HEIGHT = TYPE_ROW_HEIGHT * 5;

/** Single type row inside a day group: badge + amount */
const TypeRow = React.memo(function TypeRow({
  entry,
}: {
  entry: DayTypeAmount;
}) {
  const hasValue = entry.amountCents > 0;
  const textColor = hasValue ? colors.textPrimary : 'rgba(255,255,255,0.28)';

  return (
    <View style={styles.typeRow}>
      <TypeBadge
        type={entry.type}
        size="sm"
        disabled={!hasValue}
      />
      <Text
        style={[styles.typeAmount, { color: textColor }]}
        numberOfLines={1}
      >
        {formatCurrency(entry.amountCents)}
      </Text>
    </View>
  );
});

/** Full day group: day number (left) | 5 type rows (center) | balance (right) */
const DayGroup = React.memo(function DayGroup({
  item,
}: {
  item: DailyBalanceRow;
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
          <TypeRow key={entry.type} entry={entry} />
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

  const renderItem = useCallback(
    ({ item }: { item: DailyBalanceRow }) => <DayGroup item={item} />,
    [],
  );

  return (
    <Screen withTabBarInset>
      <MonthHeader onGridPress={() => router.push('/horizon')} />
      <FilterRow />

      {/* Horizontal divider */}
      <View style={styles.hDivider} />

      <FlashList
        data={MOCK_BALANCES}
        renderItem={renderItem}
        keyExtractor={(item) => item.date}
        ItemSeparatorComponent={HorizontalDivider}
      />
    </Screen>
  );
}

function HorizontalDivider() {
  return <View style={styles.hDivider} />;
}

const styles = StyleSheet.create({
  dayGroup: {
    flexDirection: 'row',
    minHeight: DAY_GROUP_HEIGHT,
  },
  dayCol: {
    width: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  vSeparator: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  typesCol: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: TYPE_ROW_HEIGHT,
    gap: 10,
  },
  typeAmount: {
    fontSize: 14,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  balanceCol: {
    width: 130,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 16,
    paddingLeft: 8,
  },
  balanceText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  hDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
});
