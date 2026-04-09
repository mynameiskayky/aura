import { Redirect } from 'expo-router';
import { useFinanceStore } from '@/stores/finance-store';

export default function Index() {
  const hasCompletedOnboarding = useFinanceStore((state) => state.hasCompletedOnboarding);

  return <Redirect href={hasCompletedOnboarding ? '/saldos' : '/onboarding'} />;
}
