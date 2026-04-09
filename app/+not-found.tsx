import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1E1E1E',
        padding: 24,
        gap: 12,
      }}
    >
      <Text style={{ color: '#F5F5F5', fontSize: 22, fontWeight: '800' }}>
        Rota não encontrada
      </Text>
      <Text style={{ color: 'rgba(255,255,255,0.72)', textAlign: 'center' }}>
        A árvore de navegação entrou em um estado inválido. Volte para o início.
      </Text>
      <Link href="/" style={{ color: '#FF6F2B', fontSize: 16, fontWeight: '700' }}>
        Ir para o início
      </Link>
    </View>
  );
}
