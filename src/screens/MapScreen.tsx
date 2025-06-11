import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

export const MapScreen: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation<any>();

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

  const LoginPromptBanner = () => {
    if (isAuthenticated) return null;

    return (
      <View style={styles.loginBanner}>
        <View style={styles.loginBannerContent}>
          <MaterialIcons name="place" size={24} color="#4CAF50" />
          <View style={styles.loginBannerText}>
            <Text style={styles.loginBannerTitle}>カフェマップをフル活用！</Text>
            <Text style={styles.loginBannerSubtitle}>
              ログインで訪問履歴・お気に入り店舗の表示ができます
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

  return (
    <SafeAreaView style={styles.container}>
      <LoginPromptBanner />
      
      <View style={styles.mapPlaceholder}>
        <MaterialIcons name="place" size={64} color="#4CAF50" />
        <Text style={styles.title}>マップ機能</Text>
        <Text style={styles.subtitle}>近くのカフェを地図で探そう</Text>
        <Text style={styles.devNote}>※ 地図機能は開発中です</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loginBanner: {
    backgroundColor: '#fff',
    margin: 16,
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
    borderColor: '#E8F5E8',
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
    backgroundColor: '#4CAF50',
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
    borderColor: '#4CAF50',
  },
  registerBannerButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  devNote: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
}); 