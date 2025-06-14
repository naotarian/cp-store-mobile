import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { ApiService } from '../services/api/index';
import { CouponAcquisition } from '../types/coupon';

interface MyCouponsScreenProps {
  navigation: any;
}

export const MyCouponsScreen: React.FC<MyCouponsScreenProps> = ({ navigation }) => {
  const { isAuthenticated } = useAuth();
  const [coupons, setCoupons] = useState<CouponAcquisition[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMyCoupons = async () => {
    try {
      const response = await ApiService.getUserCoupons();
      setCoupons(response.data?.acquisitions || []);
    } catch (error) {
      console.error('クーポン取得エラー:', error);
      Alert.alert('エラー', 'クーポンの取得に失敗しました');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyCoupons();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMyCoupons();
  };

  const getStatusColor = (item: CouponAcquisition) => {
    if (item.status === 'used') {
      return '#9E9E9E';
    } else if (item.status === 'active' && !isExpired(item.coupon_issue.end_datetime)) {
      return '#4CAF50';
    } else {
      return '#F44336'; // 期限切れまたは無効
    }
  };

  const getStatusText = (item: CouponAcquisition) => {
    if (item.status === 'used') {
      return '使用済み';
    } else if (item.status === 'active' && !isExpired(item.coupon_issue.end_datetime)) {
      return '利用可能';
    } else {
      return '期限切れ';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const timeString = date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    if (targetDate.getTime() === today.getTime()) {
      return `本日 ${timeString}まで`;
    }
    
    const dateString2 = date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      weekday: 'short'
    });
    
    return `${dateString2} ${timeString}まで`;
  };

  const isExpired = (endDateTime: string) => {
    const endDate = new Date(endDateTime);
    const now = new Date();
    return endDate <= now;
  };

  const isUsable = (item: CouponAcquisition) => {
    return item.status === 'active' && !isExpired(item.coupon_issue.end_datetime);
  };

  const renderCouponItem = ({ item }: { item: CouponAcquisition }) => (
    <TouchableOpacity style={styles.couponCard}>
      <View style={styles.couponHeader}>
        <View style={styles.couponInfo}>
          <Text style={styles.couponTitle} numberOfLines={2}>
            {item.coupon.title}
          </Text>
          <Text style={styles.shopName}>
            {item.shop.name}
          </Text>
          <Text style={styles.couponExpiry}>
            {formatDate(item.coupon_issue.end_datetime)}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item) }]}>
          <Text style={styles.statusText}>{getStatusText(item)}</Text>
        </View>
      </View>
      
      <View style={styles.couponBody}>
        {item.coupon.description && (
          <Text style={styles.couponDescription}>
            {item.coupon.description}
          </Text>
        )}
        
        {/* 利用条件 */}
        {item.coupon.conditions && (
          <View style={styles.conditionsContainer}>
            <Text style={styles.conditionsTitle}>利用条件</Text>
            <Text style={styles.conditionsText}>
              {item.coupon.conditions}
            </Text>
          </View>
        )}

        {/* 注意事項 */}
        {item.coupon.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesTitle}>注意事項</Text>
            <Text style={styles.notesText}>
              {item.coupon.notes}
            </Text>
          </View>
        )}
        
        {/* QRコード表示エリア（仮実装） */}
        {isUsable(item) && (
          <View style={styles.qrCodeContainer}>
            <View style={styles.qrCodePlaceholder}>
              <MaterialIcons name="qr-code" size={80} color="#ddd" />
              <Text style={styles.qrCodeText}>QRコード</Text>
              <Text style={styles.qrCodeSubText}>店員にこの画面を見せてください</Text>
            </View>
          </View>
        )}
        
        <View style={styles.couponFooter}>
          <Text style={styles.acquisitionDate}>
            取得日: {new Date(item.acquired_at).toLocaleDateString('ja-JP')}
          </Text>
          {item.used_at && (
            <Text style={styles.usedDate}>
              使用日: {new Date(item.used_at).toLocaleDateString('ja-JP')}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notLoggedIn}>
          <MaterialIcons name="login" size={64} color="#ddd" />
          <Text style={styles.notLoggedInTitle}>ログインが必要です</Text>
          <Text style={styles.notLoggedInSubtitle}>
            取得したクーポンを確認するには{'\n'}ログインしてください
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
            >
              <Text style={styles.loginButtonText}>ログイン</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate('Auth', { screen: 'Register' })}
            >
              <Text style={styles.registerButtonText}>新規登録</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200EA" />
          <Text style={styles.loadingText}>クーポンを読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>マイクーポン</Text>
        <Text style={styles.subtitle}>取得したクーポン一覧</Text>
      </View>
      
      {coupons.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="confirmation-num" size={64} color="#ddd" />
          <Text style={styles.emptyTitle}>クーポンがありません</Text>
          <Text style={styles.emptySubtitle}>
            店舗でクーポンを取得すると{'\n'}ここに表示されます
          </Text>
        </View>
      ) : (
        <FlatList
          data={coupons}
          renderItem={renderCouponItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  notLoggedIn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  notLoggedInTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  notLoggedInSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  loginButton: {
    backgroundColor: '#6200EA',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6200EA',
  },
  registerButtonText: {
    color: '#6200EA',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  listContainer: {
    padding: 16,
  },
  couponCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 12,
  },
  couponInfo: {
    flex: 1,
    marginRight: 12,
  },
  couponTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  shopName: {
    fontSize: 14,
    color: '#666',
  },
  couponExpiry: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  couponBody: {
    padding: 16,
    paddingTop: 0,
  },
  couponDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  conditionsContainer: {
    marginBottom: 16,
  },
  conditionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  conditionsText: {
    fontSize: 14,
    color: '#666',
  },
  notesContainer: {
    marginBottom: 16,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  qrCodePlaceholder: {
    alignItems: 'center',
  },
  qrCodeText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  qrCodeSubText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  couponFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  acquisitionDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  usedDate: {
    fontSize: 12,
    color: '#999',
  },
}); 