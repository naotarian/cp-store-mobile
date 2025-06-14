import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Coupon } from '../../types/coupon';

interface CouponCardProps {
  coupon: Coupon;
  onPress?: () => void;
  isAcquired?: boolean;
}

export const CouponCard: React.FC<CouponCardProps> = ({ coupon, onPress, isAcquired = false }) => {
  const formatCreatedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return '今日作成';
    } else if (diffDays === 1) {
      return '昨日作成';
    } else if (diffDays < 7) {
      return `${diffDays}日前作成`;
    } else {
      return `${date.getMonth() + 1}/${date.getDate()}作成`;
    }
  };

  const isNew = () => {
    const createdDate = new Date(coupon.created_at);
    const now = new Date();
    const diffTime = now.getTime() - createdDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3; // 3日以内はNEW
  };

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        isAcquired && styles.acquiredCard
      ]} 
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={[
          styles.discountContainer,
          isAcquired && styles.acquiredDiscountContainer
        ]}>
          <Text style={styles.discountText}>クーポン</Text>
        </View>
        <View style={styles.badges}>
          {isAcquired && (
            <View style={styles.acquiredBadge}>
              <MaterialIcons name="check-circle" size={12} color="#fff" />
              <Text style={styles.acquiredText}>取得済み</Text>
            </View>
          )}
          {isNew() && !isAcquired && (
            <View style={styles.newBadge}>
              <Text style={styles.newText}>NEW</Text>
            </View>
          )}
        </View>
      </View>
      
      <Text style={styles.title}>{coupon.title}</Text>
      <Text style={styles.description}>{coupon.description}</Text>
      
      <View style={styles.footer}>
        <View style={styles.expireInfo}>
          <MaterialIcons name="schedule" size={14} color="#999" />
          <Text style={styles.expireText}>
            {formatCreatedDate(coupon.created_at)}
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={20} color="#999" />
      </View>
      
      {coupon.conditions && (
        <Text style={styles.conditions} numberOfLines={1}>
          {coupon.conditions}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  discountContainer: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  newBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expireInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expireText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  conditions: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
  acquiredCard: {
    borderLeftColor: '#4CAF50',
  },
  acquiredDiscountContainer: {
    backgroundColor: '#4CAF50',
  },
  acquiredBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  acquiredText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}); 