import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CouponCard } from './CouponCard';
import { CouponDetailModal } from './CouponDetailModal';
import { LoginPromptModal } from '../auth/LoginPromptModal';
import { Coupon } from '../../types/coupon';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

interface CouponSectionProps {
  coupons: Coupon[];
}

export const CouponSection: React.FC<CouponSectionProps> = ({ coupons = [] }) => {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation<any>();
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleCouponPress = (coupon: Coupon) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setSelectedCoupon(coupon);
    setModalVisible(true);
  };

  const handleLoginFromModal = () => {
    // 既にログイン済みの場合は何もしない
    if (isAuthenticated) return;
    navigation.navigate('Auth', { screen: 'Login' });
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedCoupon(null);
  };

  const handleGetCoupon = (coupon: Coupon) => {
    // TODO: 実際のアプリではクーポン取得のAPIを呼び出す
    Alert.alert(
      'クーポンを取得しました！',
      `${coupon.title}を取得しました。お会計時にご利用ください。`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  if (!coupons || coupons.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialIcons name="local-offer" size={24} color="#FF6B6B" />
          <Text style={styles.sectionTitle}>利用できるクーポン</Text>
        </View>
        <View style={styles.emptyCoupon}>
          <MaterialIcons name="info-outline" size={20} color="#999" />
          <Text style={styles.emptyText}>現在利用可能なクーポンはありません</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="local-offer" size={24} color="#FF6B6B" />
        <Text style={styles.sectionTitle}>利用できるクーポン</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{coupons.length}</Text>
        </View>
      </View>
      
      {!isAuthenticated && (
        <View style={styles.loginPrompt}>
          <MaterialIcons name="login" size={20} color="#6200EA" />
          <Text style={styles.loginPromptText}>
            クーポンを取得するにはログインが必要です
          </Text>
        </View>
      )}
      
      <View style={styles.couponList}>
        {coupons.map((coupon) => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            onPress={() => handleCouponPress(coupon)}
          />
        ))}
      </View>

      <CouponDetailModal
        coupon={selectedCoupon}
        visible={modalVisible}
        onClose={handleCloseModal}
        onGetCoupon={handleGetCoupon}
      />

      <LoginPromptModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLoginFromModal}
        title="ログインが必要です"
        message="クーポンを取得するにはログインが必要です。ログインしますか？"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  countBadge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  countText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loginPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#6200EA',
  },
  loginPromptText: {
    fontSize: 14,
    color: '#6200EA',
    marginLeft: 8,
    fontWeight: '500',
  },
  couponList: {
    // スタイル不要（各カードが個別にスタイル持ち）
  },
  emptyCoupon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 8,
  },
}); 