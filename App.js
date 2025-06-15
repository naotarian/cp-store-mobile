import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { View, ActivityIndicator } from 'react-native';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { ShopListScreen } from './src/screens/ShopListScreen';
import { FavoriteScreen } from './src/screens/FavoriteScreen';
import { MapScreen } from './src/screens/MapScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { MyCouponsScreen } from './src/screens/MyCouponsScreen';
import { ShopDetailScreen } from './src/screens/ShopDetailScreen';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { RegisterScreen } from './src/screens/auth/RegisterScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

// 認証画面のスタックナビゲーター
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

// メイン画面のスタックナビゲーター（店舗一覧タブ）
function ShopStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ShopList" 
        component={ShopListScreen} 
        options={{ title: '店舗一覧' }}
      />
      <Stack.Screen 
        name="ShopDetail" 
        component={ShopDetailScreen} 
        options={{ title: '店舗詳細' }}
      />
      <Stack.Screen 
        name="Auth" 
        component={AuthNavigator} 
        options={{ title: 'ログイン', headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// マップ画面のスタックナビゲーター
function MapStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MapMain" 
        component={MapScreen} 
        options={{ title: 'マップ' }}
      />
      <Stack.Screen 
        name="ShopDetail" 
        component={ShopDetailScreen} 
        options={{ title: '店舗詳細' }}
      />
    </Stack.Navigator>
  );
}

// メインアプリのタブナビゲーター
function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'store';
          } else if (route.name === 'Favorite') {
            iconName = 'favorite';
          } else if (route.name === 'Map') {
            iconName = 'place';
          } else if (route.name === 'MyCoupons') {
            iconName = 'confirmation-num';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200EA',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={ShopStackNavigator} 
        options={{ title: '店舗' }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapStackNavigator} 
        options={{ title: 'マップ' }}
      />
      {/* ログイン時のお気に入り、クーポン、プロフィールタブを表示 */}
      {isAuthenticated && (
        <>
          <Tab.Screen 
            name="Favorite" 
            component={FavoriteScreen} 
            options={{ title: 'お気に入り' }}
          />
          <Tab.Screen 
            name="MyCoupons" 
            component={MyCouponsScreen} 
            options={{ title: 'クーポン' }}
          />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options={{ title: 'プロフィール' }}
          />
        </>
      )}
    </Tab.Navigator>
  );
}

// アプリケーションナビゲーター
function AppNavigator() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6200EA" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
