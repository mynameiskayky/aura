import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Calculator,
  Tag,
  Download,
  Bell,
  Palette,
  Info,
  LogOut,
} from 'lucide-react-native';
import { Screen, ListItemRow, Divider, Pill } from '@/components/ui';
import { colors } from '@/theme/colors';

const MENU_ITEMS = [
  { id: '1', icon: Calculator, label: 'Previsão de diário', route: '/settings/account' },
  { id: '2', icon: Tag, label: 'Categorias' },
  { id: '3', icon: Download, label: 'Exportar dados' },
  { id: '4', icon: Bell, label: 'Notificações' },
  { id: '5', icon: Palette, label: 'Aparência' },
  { id: '6', icon: Info, label: 'Sobre' },
];

export default function MenuScreen() {
  const router = useRouter();

  return (
    <Screen withTabBarInset>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile section */}
        <View className="items-center py-s5 px-s3">
          <View className="w-16 h-16 rounded-full bg-panel items-center justify-center mb-s3 border border-border-strong">
            <Text className="text-header font-extrabold text-text-primary">K</Text>
          </View>
          <Text className="text-card-title font-extrabold text-text-primary">
            Kayky
          </Text>
          <Text className="text-body text-text-secondary mt-1">
            kayky@email.com
          </Text>
          <Pill
            label="Assinatura ativa"
            colorClass="bg-income"
            className="mt-s2"
          />
        </View>

        <Divider />

        {/* Menu items */}
        <View className="py-s2">
          {MENU_ITEMS.map((item, index) => (
            <View key={item.id}>
              <ListItemRow
                icon={<item.icon size={20} color={colors.textSecondary} />}
                label={item.label}
                onPress={item.route ? () => router.push(item.route as '/settings/account') : undefined}
              />
              {index < MENU_ITEMS.length - 1 && <Divider className="ml-[56px]" />}
            </View>
          ))}
        </View>

        <Divider />

        <ListItemRow
          icon={<LogOut size={20} color={colors.dangerBalanceStrong} />}
          label="Sair"
          onPress={() => {}}
          showChevron={false}
        />

        <View className="h-8" />
      </ScrollView>
    </Screen>
  );
}
