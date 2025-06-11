import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  FlatList,
  ActivityIndicator 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { ShopCard } from '../components/shop/ShopCard';
import { ApiService } from '../services/api/index';
import { Shop } from '../types/shop';

export const FavoriteScreen: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation<any>();
  const [favoriteShops, setFavoriteShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(false);

  // お気に入り店舗を取得
  const fetchFavoriteShops = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const shops = await ApiService.getFavorites();
      setFavoriteShops(shops);
    } catch (error) {
      console.error('Failed to fetch favorite shops:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavoriteShops();
    } else {
      setFavoriteShops([]);
    }
  }, [isAuthenticated]);

  // フォーカス時に再取得
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (isAuthenticated) {
        fetchFavoriteShops();
      }
    });

    return unsubscribe;
  }, [navigation, isAuthenticated]);

  const handleLoginPress = () => {
    navigation.navigate('Home', { 
      screen: 'Auth', 
      params: { screen: 'Login' } 
    });
  };

  const handleRegisterPress = () => {
    navigation.navigate('Home', { 
      screen: 'Auth', 
      params: { screen: 'Register' } 
    });
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notLoggedIn}>
          <MaterialIcons name="favorite-border" size={64} color="#ccc" />
          <Text style={styles.notLoggedInTitle}>ログインしてお気に入りを管理</Text>
          <Text style={styles.notLoggedInSubtitle}>
            お気に入りの店舗を保存して、いつでも簡単にアクセスできます
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
              <Text style={styles.loginButtonText}>ログイン</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.registerButton} onPress={handleRegisterPress}>
              <Text style={styles.registerButtonText}>新規登録</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const handleShopPress = (shop: Shop) => {
    navigation.navigate('Home', {
      screen: 'ShopDetail',
      params: { shop }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>お気に入り</Text>
        <Text style={styles.subtitle}>
          {favoriteShops.length}件のお気に入り店舗
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200EA" />
          <Text style={styles.loadingText}>お気に入り店舗を取得中...</Text>
        </View>
      ) : favoriteShops.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="favorite-border" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>お気に入りがありません</Text>
          <Text style={styles.emptySubtitle}>
            店舗詳細ページでハートマークをタップして、お気に入りに追加しましょう
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteShops}
          renderItem={({ item }) => (
            <ShopCard 
              shop={item} 
              onPress={() => handleShopPress(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          key="two-columns"
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
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
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
}); 