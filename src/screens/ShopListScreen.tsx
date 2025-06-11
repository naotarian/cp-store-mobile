import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ShopList } from '../components/shop/ShopList';
import { ApiService } from '../services/api/index';
import { Shop } from '../types/shop';
import { useAuth } from '../contexts/AuthContext';

interface ShopListScreenProps {
  navigation: any;
}

export const ShopListScreen: React.FC<ShopListScreenProps> = ({ navigation }) => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // データ取得関数
  const fetchShops = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const shopsData = await ApiService.getShops();
      setShops(shopsData);
    } catch (error) {
      console.error('Failed to fetch shops:', error);
      setError('店舗データの取得に失敗しました。ネットワーク接続を確認してください。');
      
      // エラー時はアラートを表示
      Alert.alert(
        'エラー',
        '店舗データの取得に失敗しました。ネットワーク接続を確認してください。',
        [
          { text: 'キャンセル', style: 'cancel' },
          { text: '再試行', onPress: () => fetchShops() }
        ]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 初回データ取得
  useEffect(() => {
    fetchShops();
  }, []);

  const onRefresh = React.useCallback(() => {
    fetchShops(true);
  }, []);

  const handleShopPress = (shop: Shop) => {
    navigation.navigate('ShopDetail', { shop });
  };

  const handleLoginPress = () => {
    // 既にログイン済みの場合は何もしない
    if (isAuthenticated) return;
    navigation.navigate('Auth', { screen: 'Login' });
  };

  const handleRegisterPress = () => {
    // 既にログイン済みの場合は何もしない
    if (isAuthenticated) return;
    navigation.navigate('Auth', { screen: 'Register' });
  };

  const LoginPromptBanner = () => {
    if (isAuthenticated) return null;

    return (
      <View style={styles.loginBanner}>
        <View style={styles.loginBannerContent}>
          <MaterialIcons name="local-cafe" size={24} color="#6200EA" />
          <View style={styles.loginBannerText}>
            <Text style={styles.loginBannerTitle}>もっと楽しく利用しよう！</Text>
            <Text style={styles.loginBannerSubtitle}>
              ログインでクーポン取得・お気に入り機能が使えます
            </Text>
          </View>
        </View>
        <View style={styles.loginBannerButtons}>
          <TouchableOpacity 
            style={styles.loginBannerButton} 
            onPress={handleLoginPress}
          >
            <Text style={styles.loginBannerButtonText}>ログイン</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.registerBannerButton} 
            onPress={handleRegisterPress}
          >
            <Text style={styles.registerBannerButtonText}>新規登録</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // ローディング表示
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <LoginPromptBanner />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200EA" />
          <Text style={styles.loadingText}>店舗情報を取得中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[{ key: 'content' }]}
        renderItem={() => (
          <View>
            <LoginPromptBanner />
            <ShopList
              shops={shops}
              onShopPress={handleShopPress}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </View>
        )}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
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
  loginBanner: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E8E1FF',
  },
  loginBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginBannerText: {
    marginLeft: 12,
    flex: 1,
  },
  loginBannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  loginBannerSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  loginBannerButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  loginBannerButton: {
    flex: 1,
    backgroundColor: '#6200EA',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginBannerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  registerBannerButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6200EA',
  },
  registerBannerButtonText: {
    color: '#6200EA',
    fontSize: 14,
    fontWeight: '600',
  },
}); 