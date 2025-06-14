import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CouponCard } from './CouponCard';
import { CouponDetailModal } from './CouponDetailModal';
import { LoginPromptModal } from '../auth/LoginPromptModal';
import { Coupon, CouponIssue, CouponAcquisition } from '../../types/coupon';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CouponsApiService } from '../../services/api/coupons';

interface CouponSectionProps {
  shopId: string;
}

export const CouponSection: React.FC<CouponSectionProps> = ({ shopId }) => {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [activeIssues, setActiveIssues] = useState<CouponIssue[]>([]);
  const [userAcquisitions, setUserAcquisitions] = useState<CouponAcquisition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // クーポンデータを取得
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      
      // 店舗のクーポン一覧を取得
      const couponsResponse = await CouponsApiService.getShopCoupons(shopId);
      if (couponsResponse.status === 'success') {
        setCoupons(couponsResponse.data.coupons);
      }

      // 現在発行中のクーポン一覧を取得
      const activeIssuesResponse = await CouponsApiService.getActiveIssues(shopId);
      if (activeIssuesResponse.status === 'success') {
        setActiveIssues(activeIssuesResponse.data.active_issues);
      }

      // ログインしている場合は取得済みクーポン情報も取得
      if (isAuthenticated) {
        try {
          const userCouponsResponse = await CouponsApiService.getUserCoupons();
          if (userCouponsResponse.status === 'success') {
            setUserAcquisitions(userCouponsResponse.data.acquisitions || []);
          }
        } catch (error) {
          console.error('Failed to fetch user acquisitions:', error);
          // ユーザークーポンの取得に失敗してもアプリを止めない
          setUserAcquisitions([]);
        }
      } else {
        setUserAcquisitions([]);
      }
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
      // エラーが発生してもアプリを止めない
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [shopId, isAuthenticated]);

  // クーポンが取得済みかどうかを判定
  const isCouponAcquired = (couponId: string): boolean => {
    return userAcquisitions.some(acquisition => 
      acquisition.coupon_issue_id && 
      activeIssues.some(issue => 
        issue.id === acquisition.coupon_issue_id && 
        issue.coupon_id === couponId &&
        acquisition.status === 'active' // 有効な取得済みクーポンのみ
      )
    );
  };

  // 選択されたクーポンの関連情報を取得
  const getSelectedCouponInfo = () => {
    if (!selectedCoupon) return { activeIssue: null, userAcquisition: null };
    
    const activeIssue = activeIssues.find(issue => issue.coupon_id === selectedCoupon.id);
    const userAcquisition = userAcquisitions.find(acquisition => 
      acquisition.coupon_issue_id && 
      activeIssues.some(issue => 
        issue.id === acquisition.coupon_issue_id && 
        issue.coupon_id === selectedCoupon.id
      )
    );
    
    return { activeIssue: activeIssue || null, userAcquisition: userAcquisition || null };
  };

  const handleCouponPress = (coupon: Coupon) => {
    // ログイン状態に関係なく詳細モーダルを表示
    setSelectedCoupon(coupon);
    setModalVisible(true);
  };

  const handleLoginFromModal = () => {
    // 既にログイン済みの場合は何もしない
    if (isAuthenticated) return;
    
    // 現在のルートパラメータから店舗情報を取得
    const shop = route.params?.shop;
    
    // ログイン後に現在の店舗詳細画面に戻るようにパラメータを設定
    navigation.navigate('Auth', { 
      screen: 'Login',
      params: {
        returnTo: 'ShopDetail',
        returnParams: { shop }
      }
    });
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedCoupon(null);
  };

  const handleGetCoupon = async (coupon: Coupon) => {
    try {
      // 対応する発行中のクーポンを探す
      const activeIssue = activeIssues.find(issue => issue.coupon_id === coupon.id);
      
      if (!activeIssue) {
        Alert.alert('エラー', 'このクーポンは現在取得できません');
        return;
      }

      // クーポンを取得
      const response = await CouponsApiService.acquireCoupon(activeIssue.id);
      
      if (response.status === 'success') {
        Alert.alert(
          'クーポンを取得しました！',
          `${coupon.title}を取得しました。お会計時にご利用ください。`,
          [{ text: 'OK', style: 'default' }]
        );
        handleCloseModal();
        
        // 取得済み状態を更新するためにデータを再取得
        await fetchCoupons();
      } else {
        Alert.alert('エラー', response.message || 'クーポンの取得に失敗しました');
      }
    } catch (error: any) {
      console.error('Failed to acquire coupon:', error);
      Alert.alert('エラー', error.message || 'クーポンの取得に失敗しました');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialIcons name="local-offer" size={24} color="#FF6B6B" />
          <Text style={styles.sectionTitle}>利用できるクーポン</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#FF6B6B" />
          <Text style={styles.loadingText}>クーポンを読み込み中...</Text>
        </View>
      </View>
    );
  }

  // 発行中のクーポンのみを表示
  const availableCoupons = coupons.filter(coupon => 
    activeIssues.some(issue => issue.coupon_id === coupon.id && issue.is_available)
  );

  if (availableCoupons.length === 0) {
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
          <Text style={styles.countText}>{availableCoupons.length}</Text>
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
        {availableCoupons.map((coupon) => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            onPress={() => handleCouponPress(coupon)}
            isAcquired={isCouponAcquired(coupon.id)}
          />
        ))}
      </View>

      <CouponDetailModal
        coupon={selectedCoupon}
        visible={modalVisible}
        onClose={handleCloseModal}
        onGetCoupon={handleGetCoupon}
        onLogin={handleLoginFromModal}
        isAuthenticated={isAuthenticated}
        isAcquired={selectedCoupon ? isCouponAcquired(selectedCoupon.id) : false}
        activeIssue={getSelectedCouponInfo().activeIssue}
        userAcquisition={getSelectedCouponInfo().userAcquisition}
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
}); 