import { View, Text, Pressable, ScrollView } from 'react-native';
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
import { ChevronRight, Calendar, Repeat, Tag } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function AddScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<TransactionTypeKey>('daily_expense');
  const [amountStr, setAmountStr] = useState('0');

  const typeConfig = TRANSACTION_TYPES[selectedType];
  const amountCents = parseInt(amountStr, 10);
  const displayValue = formatCurrency(amountCents);

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
        <FormRow icon={<Tag size={18} color={colors.textMuted} />} label="Descrição" value="Adicionar" />
        <FormRow icon={<Calendar size={18} color={colors.textMuted} />} label="Data" value="Hoje" />
        <FormRow icon={<Repeat size={18} color={colors.textMuted} />} label="Repetição" value="Não repete" />
        <FormRow icon={<Tag size={18} color={colors.textMuted} />} label="Tags" value="Nenhuma" />
      </ScrollView>

      {/* Save button */}
      <View className="px-s3 mb-s2">
        <Pressable
          onPress={handleSave}
          className="w-full rounded-pill py-4 items-center active:opacity-80"
          style={{ backgroundColor: typeConfig.color }}
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

function FormRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Pressable className="flex-row items-center py-4 border-b border-border-subtle">
      {icon}
      <Text className="text-body text-text-secondary ml-s3 flex-1">{label}</Text>
      <Text className="text-body text-text-muted mr-2">{value}</Text>
      <ChevronRight size={16} color={colors.textMuted} />
    </Pressable>
  );
}
