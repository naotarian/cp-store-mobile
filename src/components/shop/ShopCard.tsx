import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Shop } from '../../types/shop';

interface ShopCardProps {
  shop: Shop;
  onPress?: () => void;
}

export const ShopCard: React.FC<ShopCardProps> = ({ shop, onPress }) => {
  // 営業時間の表示を整形
  const formatOpenHours = (openTime: string, closeTime: string) => {
    const formatTime = (time: string) => time?.substring(0, 5) || time;
    return `${formatTime(openTime)} - ${formatTime(closeTime)}`;
  };

  // 評価の表示（average_ratingは文字列なので数値に変換）
  const displayRating = shop.average_rating ? parseFloat(shop.average_rating).toFixed(1) : '未評価';
  
  // レビュー数の表示
  const reviewText = shop.review_count > 0 ? `(${shop.review_count}件)` : '';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: shop.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {shop.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {shop.description}
        </Text>
        
        <View style={styles.infoRow}>
          <MaterialIcons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{displayRating}</Text>
          {reviewText && <Text style={styles.reviewCount}>{reviewText}</Text>}
          {shop.distance && (
            <>
              <MaterialIcons name="place" size={16} color="#666" style={styles.iconSpacing} />
              <Text style={styles.distance}>{shop.distance}</Text>
            </>
          )}
        </View>
        
        <View style={styles.infoRow}>
          <MaterialIcons name="access-time" size={16} color="#666" />
          <Text style={styles.openHours}>
            {formatOpenHours(shop.open_time, shop.close_time)}
          </Text>
        </View>
        
        <Text style={styles.address} numberOfLines={1}>
          {shop.address}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 4,
    marginVertical: 6,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 12,
    color: '#333',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 10,
    color: '#999',
    marginLeft: 2,
  },
  iconSpacing: {
    marginLeft: 12,
  },
  distance: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  openHours: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  address: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
}); 