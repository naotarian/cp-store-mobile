import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Coupon } from '../../types/coupon';

interface CouponCardProps {
  coupon: Coupon;
  onPress?: () => void;
}

export const CouponCard: React.FC<CouponCardProps> = ({ coupon, onPress }) => {
  const formatDiscount = () => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}%OFF`;
    } else if (coupon.discountValue === 0) {
      return '無料';
    } else {
      return `${coupon.discountValue}円OFF`;
    }
  };

  const formatExpireDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}まで`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.discountContainer}>
          <Text style={styles.discountText}>{formatDiscount()}</Text>
        </View>
        {coupon.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newText}>NEW</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.title}>{coupon.title}</Text>
      <Text style={styles.description}>{coupon.description}</Text>
      
      <View style={styles.footer}>
        <View style={styles.expireInfo}>
          <MaterialIcons name="schedule" size={14} color="#999" />
          <Text style={styles.expireText}>
            {formatExpireDate(coupon.expireDate)}
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={20} color="#999" />
      </View>
      
      <Text style={styles.conditions} numberOfLines={1}>
        {coupon.conditions}
      </Text>
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
}); 