import React from 'react';
import { FlatList, StyleSheet, RefreshControlProps } from 'react-native';
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

  return (
    <FlatList
      key="two-columns"
      data={shops}
      renderItem={renderShopCard}
      keyExtractor={(item) => item.id}
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
}); 