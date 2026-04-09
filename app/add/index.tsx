import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { X } from 'lucide-react-native';
import { Screen } from '@/components/ui';
import { TypeBadge } from '@/components/finance';
import { MoneyKeyboard } from '@/components/forms/MoneyKeyboard';
import { TRANSACTION_TYPES, TRANSACTION_TYPE_LIST } from '@/core/constants/transaction-types';
import type { TransactionTypeKey } from '@/core/constants/transaction-types';
import { colors } from '@/theme/colors';
import { formatCurrency } from '@/core/utils/currency';
import { Calendar, Repeat, Tag } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useFinanceStore } from '@/stores/finance-store';
import { useUIStore } from '@/stores/ui-store';

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function isValidDateInput(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00`);
  return !Number.isNaN(parsed.getTime()) && formatDate(parsed) === value;
}

export default function AddScreen() {
  const router = useRouter();
  const initialSelectedType = useUIStore((state) => state.selectedAddType);
  const [selectedType, setSelectedType] = useState<TransactionTypeKey>(initialSelectedType);
  const [amountStr, setAmountStr] = useState('0');
  const [description, setDescription] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(formatDate(new Date()));
  const [recurrence, setRecurrence] = useState<'none' | 'monthly'>('none');
  const addEntry = useFinanceStore((state) => state.addEntry);

  const typeConfig = TRANSACTION_TYPES[selectedType];
  const amountCents = parseInt(amountStr, 10);
  const displayValue = formatCurrency(amountCents);
  const canSave = amountCents > 0 && isValidDateInput(effectiveDate);

  const handleKeyPress = (key: string) => {
    if (key === 'delete') {
      setAmountStr((prev) => (prev.length <= 1 ? '0' : prev.slice(0, -1)));
    } else if (key === '.') {
      // Ignore decimal for cents-based input
    } else {
      setAmountStr((prev) => {
        const next = prev === '0' ? key : prev + key;
        if (next.length > 10) return prev;
        return next;
      });
    }
  };

  const handleSave = () => {
    if (!canSave) {
      return;
    }

    const recurrenceRule =
      recurrence === 'monthly'
        ? {
            frequency: 'monthly' as const,
            dayOfMonth: Number(effectiveDate.slice(-2)),
          }
        : null;

    addEntry({
      type: selectedType,
      amountCents,
      effectiveDate,
      description: description || typeConfig.label,
      recurrence: recurrenceRule,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <Screen>
      {/* Header */}
      <View className="flex-row items-center justify-between px-s3 py-s2">
        <Pressable onPress={() => router.back()} className="p-2">
          <X size={24} color={colors.textPrimary} />
        </Pressable>
        <Text className="text-card-title font-extrabold text-text-primary">
          {typeConfig.label}
        </Text>
        <View className="w-10" />
      </View>

      {/* Amount display */}
      <View className="items-center py-s5">
        <Text className="text-hero font-extrabold text-text-primary">{displayValue}</Text>
      </View>

      {/* Type selector */}
      <View className="flex-row justify-center gap-3 mb-s4">
        {TRANSACTION_TYPE_LIST.map((t) => (
          <Pressable
            key={t.key}
            onPress={() => {
              setSelectedType(t.key as TransactionTypeKey);
              Haptics.selectionAsync();
            }}
          >
            <TypeBadge
              type={t.key as TransactionTypeKey}
              size="lg"
              disabled={selectedType !== t.key}
            />
          </Pressable>
        ))}
      </View>

      {/* Form fields */}
      <ScrollView className="flex-1 px-s3">
        <InputRow
          icon={<Tag size={18} color={colors.textMuted} />}
          label="Descrição"
          value={description}
          onChangeText={setDescription}
          placeholder="Ex.: aluguel, salário, mercado"
        />

        <InputRow
          icon={<Calendar size={18} color={colors.textMuted} />}
          label="Data"
          value={effectiveDate}
          onChangeText={setEffectiveDate}
          placeholder="AAAA-MM-DD"
          keyboardType="numbers-and-punctuation"
          helperText={!isValidDateInput(effectiveDate) ? 'Use o formato AAAA-MM-DD' : undefined}
        />

        <View className="border-b border-border-subtle py-4">
          <View className="mb-3 flex-row items-center">
            <Repeat size={18} color={colors.textMuted} />
            <Text className="ml-s3 flex-1 text-body text-text-secondary">
              Repetição
            </Text>
          </View>

          <View className="flex-row gap-2">
            <Pressable
              onPress={() => setRecurrence('none')}
              className={`rounded-pill px-4 py-2 ${recurrence === 'none' ? 'bg-accent' : 'bg-elevated'}`}
            >
              <Text className={recurrence === 'none' ? 'text-white font-bold' : 'text-text-primary font-semibold'}>
                Não repete
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setRecurrence('monthly')}
              className={`rounded-pill px-4 py-2 ${recurrence === 'monthly' ? 'bg-accent' : 'bg-elevated'}`}
            >
              <Text className={recurrence === 'monthly' ? 'text-white font-bold' : 'text-text-primary font-semibold'}>
                Mensal
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="border-b border-border-subtle py-4">
          <View className="flex-row items-center">
            <Tag size={18} color={colors.textMuted} />
            <Text className="ml-s3 flex-1 text-body text-text-secondary">Tags</Text>
            <Text className="text-body text-text-muted">Em breve</Text>
          </View>
        </View>
      </ScrollView>

      {/* Save button */}
      <View className="px-s3 mb-s2">
        <Pressable
          onPress={handleSave}
          disabled={!canSave}
          className="w-full rounded-pill py-4 items-center active:opacity-80"
          style={{
            backgroundColor: canSave ? typeConfig.color : colors.bgElevated,
          }}
        >
          <Text className="text-body font-bold text-white">
            Adicionar {typeConfig.label}
          </Text>
        </Pressable>
      </View>

      {/* Custom keyboard */}
      <MoneyKeyboard onKeyPress={handleKeyPress} />
    </Screen>
  );
}

function InputRow({
  icon,
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  helperText,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numbers-and-punctuation';
  helperText?: string;
}) {
  return (
    <View className="border-b border-border-subtle py-4">
      <View className="mb-2 flex-row items-center">
        {icon}
        <Text className="ml-s3 text-body text-text-secondary">{label}</Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType ?? 'default'}
        className="rounded-2xl bg-elevated px-s3 py-3 text-body text-text-primary"
      />
      {helperText ? (
        <Text className="mt-2 text-tiny text-danger-balance-strong">{helperText}</Text>
      ) : null}
    </View>
  );
}
