import { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { useUIStore } from '@/stores/ui-store';
import { TRANSACTION_TYPE_LIST } from '@/core/constants/transaction-types';
import { TypeBadge } from '@/components/finance/TypeBadge';
import type { TransactionTypeKey } from '@/core/constants/transaction-types';

export function AddTransactionSheet() {
  const router = useRouter();
  const { isAddSheetOpen, closeAddSheet } = useUIStore();
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(420)).current;

  const animationConfig = useMemo(
    () => ({
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }),
    [],
  );

  useEffect(() => {
    if (isAddSheetOpen) {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          ...animationConfig,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          ...animationConfig,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 180,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 420,
          duration: 180,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [animationConfig, isAddSheetOpen, overlayOpacity, translateY]);

  const handleTypePress = (type: TransactionTypeKey) => {
    closeAddSheet();
    router.push('/add');
  };

  return (
    <Modal
      animationType="none"
      transparent
      visible={isAddSheetOpen}
      onRequestClose={closeAddSheet}
    >
      <View className="flex-1 justify-end">
        <Animated.View
          pointerEvents="none"
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.52)',
            opacity: overlayOpacity,
          }}
        />

        <Pressable className="flex-1" onPress={closeAddSheet} />

        <Animated.View
          style={{
            transform: [{ translateY }],
          }}
          className="rounded-t-[30px] border border-white/10 bg-elevated px-5 pb-10 pt-4"
        >
          <View className="mb-4 items-center">
            <View className="h-1.5 w-14 rounded-full bg-white/15" />
          </View>

          <View className="mb-5 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-text-primary">Adicionar</Text>
            <Pressable onPress={closeAddSheet} className="p-2">
              <X size={22} color={colors.textPrimary} />
            </Pressable>
          </View>

          <View className="gap-3">
            {TRANSACTION_TYPE_LIST.map((type) => (
              <Pressable
                key={type.key}
                onPress={() => handleTypePress(type.key as TransactionTypeKey)}
                className="flex-row items-center gap-4 py-3 active:opacity-70"
              >
                <TypeBadge type={type.key as TransactionTypeKey} size="lg" />
                <View className="flex-1">
                  <Text className="text-base font-bold text-text-primary">
                    {type.label}
                  </Text>
                  <Text className="text-sm text-text-muted">
                    {type.description}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
