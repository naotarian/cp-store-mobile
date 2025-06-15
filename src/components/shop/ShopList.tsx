import React from 'react';
import { FlatList, StyleSheet, RefreshControlProps, View } from 'react-native';
import { ShopCard } from './ShopCard';
import { Shop } from '../../types/shop';

interface ShopListProps {
  shops: Shop[];
  onShopPress?: (shop: Shop) => void;
  refreshControl?: React.ReactElement<RefreshControlProps>;
}

export const ShopList: React.FC<ShopListProps> = ({ shops, onShopPress, refreshControl }) => {
  const renderShopCard = ({ item }: { item: Shop }) => (
    <ShopCard 
      shop={item} 
      onPress={() => onShopPress?.(item)}
    />
  );

  // 奇数個の場合は最後に空のアイテムを追加して左寄せを実現
  const displayData = shops.length % 2 === 1 
    ? [...shops, { id: 'empty', isEmpty: true } as any]
    : shops;

  const renderItem = ({ item }: { item: Shop | { isEmpty: boolean } }) => {
    if ('isEmpty' in item && item.isEmpty) {
      // 空のアイテムは透明なViewを返す
      return <View style={{ width: '48%' }} />;
    }
    return renderShopCard({ item: item as Shop });
  };

  return (
    <FlatList
      key="two-columns"
      data={displayData}
      renderItem={renderItem}
      keyExtractor={(item) => 'isEmpty' in item ? 'empty' : item.id}
      contentContainerStyle={styles.container}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  columnWrapper: {
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  leftAlign: {
    justifyContent: 'flex-start',
  },
}); 