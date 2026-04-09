import { View, Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  LayoutGrid,
  Calculator,
  Tag,
  Menu,
  Plus,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { colors } from '@/theme/colors';
import { useUIStore } from '@/stores/ui-store';

const TAB_ICONS: Record<string, typeof LayoutGrid> = {
  saldos: LayoutGrid,
  totais: Calculator,
  tags: Tag,
  menu: Menu,
};

const TAB_LABELS: Record<string, string> = {
  saldos: 'Saldos',
  totais: 'Totais',
  tags: 'Tags',
  menu: 'Menu',
};

const FAB_SIZE = 56;

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

  // Split routes into left (before FAB) and right (after FAB)
  const leftRoutes = state.routes.slice(0, 2);
  const rightRoutes = state.routes.slice(2);

  const renderTab = (
    route: (typeof state.routes)[number],
    index: number,
  ) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === index;
    const routeName = route.name.toLowerCase();

    const Icon = TAB_ICONS[routeName] ?? LayoutGrid;
    const label = TAB_LABELS[routeName] ?? route.name;
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

    const onLongPress = () => {
      navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      });
    };

    return (
      <Pressable
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarButtonTestID}
        onPress={onPress}
        onLongPress={onLongPress}
        className="flex-1 items-center justify-center pt-2"
      >
        <Icon size={22} color={iconColor} strokeWidth={isFocused ? 2.2 : 1.8} />
        <Text
          className="mt-1 text-[10px]"
          style={{ color: iconColor }}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      className="bg-panel border-t"
      style={{
        borderTopColor: colors.borderSubtle,
        paddingBottom: insets.bottom,
      }}
    >
      {/* Tab row */}
      <View className="flex-row items-end h-14">
        {/* Left tabs */}
        {leftRoutes.map((route) => {
          const globalIndex = state.routes.indexOf(route);
          return renderTab(route, globalIndex);
        })}

        {/* FAB spacer */}
        <View style={{ width: FAB_SIZE + 16 }} />

        {/* Right tabs */}
        {rightRoutes.map((route) => {
          const globalIndex = state.routes.indexOf(route);
          return renderTab(route, globalIndex);
        })}
      </View>

      {/* FAB - positioned to overlap the tab bar */}
      <Pressable
        onPress={handleFabPress}
        className="absolute self-center items-center justify-center rounded-full"
        style={{
          width: FAB_SIZE,
          height: FAB_SIZE,
          backgroundColor: '#FFFFFF',
          top: -(FAB_SIZE / 2),
          // Shadow
          shadowColor: colors.accentPrimary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
          elevation: 8,
        }}
        accessibilityRole="button"
        accessibilityLabel="Adicionar transação"
      >
        <Plus size={28} color={colors.accentPrimary} strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}
