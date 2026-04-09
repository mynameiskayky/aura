import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Rows3,
  SlidersHorizontal,
  FileText,
  AlignJustify,
  Plus,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { colors } from '@/theme/colors';
import { useUIStore } from '@/stores/ui-store';

const TAB_CONFIG: Record<
  string,
  { Icon: typeof Rows3; label: string }
> = {
  saldos: { Icon: Rows3, label: 'Saldos' },
  totais: { Icon: SlidersHorizontal, label: 'Totais' },
  tags: { Icon: FileText, label: 'Tags' },
  menu: { Icon: AlignJustify, label: 'Menu' },
};

const FAB_SIZE = 58;

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const openAddSheet = useUIStore((s) => s.openAddSheet);

  const handleFabPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    openAddSheet();
  };

  const leftRoutes = state.routes.slice(0, 2);
  const rightRoutes = state.routes.slice(2);

  const renderTab = (
    route: (typeof state.routes)[number],
    globalIndex: number,
  ) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === globalIndex;
    const routeName = route.name.toLowerCase();

    const config = TAB_CONFIG[routeName] ?? TAB_CONFIG.saldos;
    const { Icon, label } = config;
    const iconColor = isFocused ? colors.accentPrimary : colors.textMuted;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }
    };

    return (
      <Pressable
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        onPress={onPress}
        style={styles.tab}
      >
        {/* Active indicator line */}
        <View
          style={[
            styles.activeIndicator,
            isFocused && { backgroundColor: colors.accentPrimary },
          ]}
        />
        <Icon
          size={22}
          color={iconColor}
          strokeWidth={isFocused ? 2.2 : 1.6}
        />
        <Text
          style={[styles.tabLabel, { color: iconColor }]}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, 8) },
      ]}
    >
      {/* Tab row */}
      <View style={styles.tabRow}>
        {leftRoutes.map((route) =>
          renderTab(route, state.routes.indexOf(route)),
        )}

        {/* FAB spacer */}
        <View style={{ width: FAB_SIZE + 20 }} />

        {rightRoutes.map((route) =>
          renderTab(route, state.routes.indexOf(route)),
        )}
      </View>

      {/* FAB */}
      <Pressable
        onPress={handleFabPress}
        style={styles.fab}
        accessibilityRole="button"
        accessibilityLabel="Adicionar transação"
      >
        <Plus size={30} color="#1E1E1E" strokeWidth={2.8} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgPanel,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 54,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  activeIndicator: {
    width: 20,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: 'transparent',
    marginBottom: 6,
  },
  tabLabel: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    top: -(FAB_SIZE / 2),
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
});
