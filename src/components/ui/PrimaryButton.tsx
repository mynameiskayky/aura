import { Text, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  colorClass?: string;
  className?: string;
  disabled?: boolean;
}

export function PrimaryButton({
  label,
  onPress,
  colorClass = 'bg-income',
  className = '',
  disabled = false,
}: PrimaryButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      className={`w-full rounded-pill py-4 items-center justify-center ${colorClass} ${
        disabled ? 'opacity-50' : 'active:opacity-80'
      } ${className}`}
    >
      <Text className="text-body font-bold text-white">{label}</Text>
    </Pressable>
  );
}
