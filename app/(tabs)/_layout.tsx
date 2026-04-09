import { Tabs } from 'expo-router';
import { CustomTabBar } from '@/components/navigation/CustomTabBar';
import { AddTransactionSheet } from '@/components/sheets/AddTransactionSheet';

export const unstable_settings = {
  initialRouteName: 'saldos',
};

export default function TabsLayout() {
  return (
    <>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: '#1E1E1E' },
        }}
      >
        <Tabs.Screen name="saldos" options={{ title: 'Saldos' }} />
        <Tabs.Screen name="totais" options={{ title: 'Totais' }} />
        <Tabs.Screen name="tags" options={{ title: 'Tags' }} />
        <Tabs.Screen name="menu" options={{ title: 'Menu' }} />
      </Tabs>
      <AddTransactionSheet />
    </>
  );
}
