import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Shop } from '../types/shop';
import { CouponSection } from '../components/coupon/CouponSection';
import { ReviewSection } from '../components/review/ReviewSection';
import { LoginPromptModal } from '../components/auth/LoginPromptModal';
import { useAuth } from '../contexts/AuthContext';
import { ApiService } from '../services/api/index';

interface ShopDetailScreenProps {
  route: {
    params: {
      shop: Shop;
    };
  };
  navigation: any;
}

export const ShopDetailScreen: React.FC<ShopDetailScreenProps> = ({ 
  route, 
  navigation 
}) => {
  const { shop } = route.params;
  const { isAuthenticated, toggleFavoriteShop } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  // お気に入り状態を取得
  const checkFavoriteStatus = async () => {
    if (!isAuthenticated) {
      setIsFavorite(false);
      return;
    }

    try {
      const response = await ApiService.checkFavorite(shop.id);
      setIsFavorite(response.is_favorite);
    } catch (error) {
      console.error('Failed to check favorite status:', error);
    }
  };

  useEffect(() => {
    checkFavoriteStatus();
  }, [isAuthenticated, shop.id]);

  const handleFavoritePress = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    try {
      setLoadingFavorite(true);
      await toggleFavoriteShop(shop.id);
      // トグル後の状態を再取得
      await checkFavoriteStatus();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      Alert.alert('エラー', 'お気に入りの更新に失敗しました');
    } finally {
      setLoadingFavorite(false);
    }
  };

  const handleLoginFromModal = () => {
    // 既にログイン済みの場合は何もしない
    if (isAuthenticated) return;
    navigation.navigate('Auth', { screen: 'Login' });
  };

  const handleMapPress = () => {
    Alert.alert('開発中', 'マップ機能は開発中です');
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
      <View style={styles.loginPrompt}>
        <View style={styles.loginPromptContent}>
          <MaterialIcons name="account-circle" size={20} color="#6200EA" />
          <Text style={styles.loginPromptText}>
            ログインしてクーポン取得・お気に入り登録をしよう
          </Text>
        </View>
        <View style={styles.loginPromptButtons}>
          <TouchableOpacity 
            style={styles.loginPromptButton} 
            onPress={handleLoginPress}
          >
            <MaterialIcons name="login" size={16} color="#fff" />
            <Text style={styles.loginPromptButtonText}>ログイン</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.registerPromptButton} 
            onPress={handleRegisterPress}
          >
            <MaterialIcons name="person-add" size={16} color="#6200EA" />
            <Text style={styles.registerPromptButtonText}>新規登録</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: shop.image }} style={styles.image} />
      
      <View style={styles.content}>
        <LoginPromptBanner />
        
        <Text style={styles.name}>{shop.name}</Text>
        
        <View style={styles.ratingRow}>
          <MaterialIcons name="star" size={20} color="#FFD700" />
          <Text style={styles.rating}>
            {shop.average_rating ? parseFloat(shop.average_rating).toFixed(1) : '未評価'}
          </Text>
          <Text style={styles.reviewCount}>
            ({shop.review_count}件)
          </Text>
          {shop.distance && (
            <>
              <MaterialIcons name="place" size={20} color="#666" style={styles.iconSpacing} />
              <Text style={styles.distance}>{shop.distance}</Text>
            </>
          )}
        </View>
        
        <Text style={styles.description}>{shop.description}</Text>
        
        <CouponSection shopId={shop.id} />
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>店舗情報</Text>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="access-time" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>営業時間</Text>
              <Text style={styles.infoText}>
                {shop.open_time?.substring(0, 5)} - {shop.close_time?.substring(0, 5)}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="place" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>住所</Text>
              <Text style={styles.infoText}>{shop.address}</Text>
            </View>
          </View>
        </View>

        <ReviewSection 
          shopId={shop.id}
          reviewCount={shop.review_count || 0}
        />
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[
              styles.favoriteButton,
              isFavorite && styles.favoriteButtonActive,
              loadingFavorite && styles.disabledButton
            ]}
            onPress={handleFavoritePress}
            disabled={loadingFavorite}
          >
            <MaterialIcons 
              name={isFavorite ? "favorite" : "favorite-border"} 
              size={24} 
              color={isFavorite ? "#fff" : "#FF6B6B"} 
            />
            <Text style={[
              styles.favoriteButtonText,
              isFavorite && styles.favoriteButtonTextActive
            ]}>
              {loadingFavorite ? "更新中..." : isFavorite ? "お気に入り済み" : "お気に入り"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.mapButton} onPress={handleMapPress}>
            <MaterialIcons name="directions" size={24} color="#4CAF50" />
            <Text style={styles.mapButtonText}>地図で見る</Text>
          </TouchableOpacity>
        </View>
      </View>

      <LoginPromptModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLoginFromModal}
        title="ログインが必要です"
        message="お気に入りに追加するにはログインが必要です。ログインしますか？"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 20,
  },
  loginPrompt: {
    backgroundColor: '#f8f6ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0d7ff',
  },
  loginPromptContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  loginPromptText: {
    fontSize: 13,
    color: '#6200EA',
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  loginPromptButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  loginPromptButton: {
    flex: 1,
    backgroundColor: '#6200EA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginPromptButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  registerPromptButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6200EA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerPromptButtonText: {
    color: '#6200EA',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    fontWeight: '600',
  },
  reviewCount: {
    fontSize: 14,
    color: '#999',
    marginLeft: 4,
  },
  iconSpacing: {
    marginLeft: 20,
  },
  distance: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  infoSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  favoriteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  favoriteButtonActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  favoriteButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  favoriteButtonTextActive: {
    color: '#fff',
  },
  disabledButton: {
    opacity: 0.6,
  },
  mapButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FFF5',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  mapButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 