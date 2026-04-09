import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps {
  children: React.ReactNode;
  className?: string;
  withTabBarInset?: boolean;
}

export function Screen({
  children,
  className = '',
  withTabBarInset = false,
}: ScreenProps) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} className={`flex-1 bg-app ${className}`}>
      <View className={`flex-1 ${withTabBarInset ? 'pb-24' : ''}`}>{children}</View>
    </SafeAreaView>
  );
}
