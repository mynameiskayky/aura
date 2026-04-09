import { View, Text } from 'react-native';
import { useState, useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';
import { Screen, SearchField, Divider } from '@/components/ui';
import { MonthHeader } from '@/components/finance';
import { formatCurrency } from '@/core/utils/currency';
import type { TagItem } from '@/core/types';

function TagRow({ item }: { item: TagItem }) {
  return (
    <View className="flex-row items-center px-s3 py-3">
      <View
        className="w-5 h-5 rounded-sm mr-s3"
        style={{ backgroundColor: item.color }}
      />
      <Text className="flex-1 text-body text-text-primary">{item.name}</Text>
      <Text className="text-body font-bold text-text-secondary">
        {formatCurrency(item.totalAmount)}
      </Text>
    </View>
  );
}

export default function TagsScreen() {
  const [search, setSearch] = useState('');

  const tags: TagItem[] = [];

  const filtered = tags.filter((tag) =>
    tag.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = useCallback(
    ({ item }: { item: TagItem }) => <TagRow item={item} />,
    []
  );

  return (
    <Screen withTabBarInset>
      <MonthHeader showGrid={false} />

      <View className="px-s3">
        <Text className="text-header font-extrabold text-text-primary mb-s3 mt-s2">
          Tags
        </Text>
        <SearchField
          placeholder="Filtrar tags"
          value={search}
          onChangeText={setSearch}
          className="mb-s3"
        />
      </View>

      <Divider />

      {filtered.length > 0 ? (
        <FlashList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <Divider className="ml-[52px]" />}
        />
      ) : (
        <View className="px-s3 py-s5">
          <Text className="text-card-title font-extrabold text-text-primary">
            Ainda sem tags reais
          </Text>
          <Text className="mt-2 text-body text-text-secondary">
            Os mocks foram removidos. A próxima etapa aqui é cadastrar tags
            nos lançamentos e consolidar os totais por tag de verdade.
          </Text>
        </View>
      )}
    </Screen>
  );
}
