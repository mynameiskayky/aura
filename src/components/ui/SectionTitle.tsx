import { Text } from 'react-native';

interface SectionTitleProps {
  children: string;
  className?: string;
}

export function SectionTitle({ children, className = '' }: SectionTitleProps) {
  return (
    <Text className={`text-overline text-text-muted uppercase tracking-wider ${className}`}>
      {children}
    </Text>
  );
}
