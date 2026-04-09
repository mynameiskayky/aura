import { View, TextInput } from 'react-native';
import { Search } from 'lucide-react-native';
import { colors } from '@/theme/colors';

interface SearchFieldProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  className?: string;
}

export function SearchField({
  placeholder = 'Buscar...',
  value,
  onChangeText,
  className = '',
}: SearchFieldProps) {
  return (
    <View className={`flex-row items-center bg-panel rounded-md px-s3 py-3 ${className}`}>
      <Search size={18} color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        className="flex-1 ml-s2 text-body text-text-primary"
      />
    </View>
  );
}
