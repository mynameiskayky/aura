import { View, Text, Pressable } from 'react-native';
import { Delete } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/theme/colors';

interface MoneyKeyboardProps {
  onKeyPress: (key: string) => void;
  className?: string;
}

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', 'delete'],
];

export function MoneyKeyboard({ onKeyPress, className = '' }: MoneyKeyboardProps) {
  const handlePress = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onKeyPress(key);
  };

  return (
    <View className={`gap-2 px-4 ${className}`}>
      {KEYS.map((row, rowIndex) => (
        <View key={rowIndex} className="flex-row gap-2">
          {row.map((key) => (
            <Pressable
              key={key}
              onPress={() => handlePress(key)}
              className="flex-1 h-[60px] bg-elevated rounded-2xl items-center justify-center active:opacity-70"
            >
              {key === 'delete' ? (
                <Delete size={24} color={colors.textPrimary} />
              ) : (
                <Text className="text-2xl font-semibold text-text-primary">
                  {key}
                </Text>
              )}
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}
