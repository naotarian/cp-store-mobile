import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User, AuthState, LoginCredentials, RegisterCredentials } from '../types/user';
import { ApiService } from '../services/api/index';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string; status?: number }>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; error?: string; status?: number }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  toggleFavoriteShop: (shopId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // アプリ起動時にSecureStoreからユーザー情報を読み込む
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    console.log('Loading user from SecureStore...');
    
    try {
      const userJson = await SecureStore.getItemAsync('user');
      const token = await SecureStore.getItemAsync('api_token');
      console.log('Loaded from SecureStore - userJson exists:', !!userJson);
      console.log('Loaded from SecureStore - token exists:', !!token);
      
      if (userJson && token) {
        const user = JSON.parse(userJson);
        console.log('Parsed user:', user);
        
        // まずローカル情報でログイン状態を復元
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
        
        console.log('Login state restored from SecureStore');
        
        // バックグラウンドでAPIから最新のユーザー情報を取得（任意）
        // エラーハンドリングを改善
        try {
          console.log('Attempting to refresh user data from API...');
          const response = await ApiService.getUser();
          const updatedUser = response.data.user;
          await SecureStore.setItemAsync('user', JSON.stringify(updatedUser));
          setAuthState({
            user: updatedUser,
            isLoading: false,
            isAuthenticated: true,
          });
          console.log('✅ User data refreshed from API successfully');
        } catch (error: any) {
          console.log('⚠️ Failed to refresh user data (keeping local data):', error);
          
          // 401 Unauthorizedの場合のみログアウト（トークンが無効）
          if (error.status === 401) {
            console.log('❌ Token expired or invalid (401), logging out');
            await SecureStore.deleteItemAsync('user');
            await SecureStore.deleteItemAsync('api_token');
            setAuthState({
              user: null,
              isLoading: false,
              isAuthenticated: false,
            });
          } else {
            // その他のエラー（ネットワークエラー、500エラー等）はローカル情報を保持
            console.log('🔄 Network/Server error, keeping local login state');
            console.log('Error details - Status:', error.status, 'Message:', error.message);
            // ローカル状態は既に setAuthState で設定済みなので、何もしない
          }
        }
      } else {
        console.log('No user data or token found in SecureStore');
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error('Failed to load user from storage:', error);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string; status?: number }> => {
    try {
      const response = await ApiService.login(credentials);
      
      if (response.status === 'success') {
        const user = response.data.user;
        const token = response.data.token;
        
        console.log('Saving user to SecureStore:', user);
        console.log('Saving token to SecureStore:', !!token);
        console.log('🔑 Token details - length:', token?.length, 'first 10 chars:', token?.substring(0, 10));
        
        await SecureStore.setItemAsync('user', JSON.stringify(user));
        await SecureStore.setItemAsync('api_token', token);
        
        // 保存直後に読み取りテスト
        const savedUser = await SecureStore.getItemAsync('user');
        const savedToken = await SecureStore.getItemAsync('api_token');
        console.log('Verification - saved user exists:', !!savedUser);
        console.log('Verification - saved token exists:', !!savedToken);
        
        console.log('Successfully saved to SecureStore');
        
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });

        return { success: true, status: 200 };
      } else {
        console.log('Login error:', response);
        return { success: false, error: response.message || 'ログインに失敗しました', status: 400 };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // APIからのエラーレスポンスを解析
      if (error.status && error.data) {
        // APIサービスからのエラー（401, 422など）
        console.log('API Error - Status:', error.status, 'Message:', error.message);
        return { 
          success: false, 
          error: error.message || 'ログインに失敗しました',
          status: error.status 
        };
      } else if (error.message && error.message.includes('Failed to fetch')) {
        // ネットワークエラー（サーバーに到達できない）
        return { 
          success: false, 
          error: 'サーバーに接続できません。ネットワークを確認してください。',
          status: 0 
        };
      } else if (error.message && error.message.includes('JSON')) {
        // JSON解析エラー
        return { 
          success: false, 
          error: 'サーバーからの応答が正しくありません。',
          status: -1 
        };
      }
      
      return { 
        success: false, 
        error: error.message || 'ログインに失敗しました',
        status: error.status || -1 
      };
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<{ success: boolean; error?: string; status?: number }> => {
    try {
      const response = await ApiService.register(credentials);
      
      if (response.status === 'success') {
        const user = response.data.user;
        const token = response.data.token;
        
        console.log('Saving user to SecureStore (register):', user);
        console.log('Saving token to SecureStore (register):', !!token);
        
        await SecureStore.setItemAsync('user', JSON.stringify(user));
        if (token) {
          await SecureStore.setItemAsync('api_token', token);
        }
        
        console.log('Successfully saved to SecureStore (register)');
        
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });

        return { success: true, status: 201 };
      } else {
        return { success: false, error: response.message || '登録に失敗しました', status: 400 };
      }
    } catch (error: any) {
      console.error('Register error:', error);
      
      // APIからのエラーレスポンスを解析
      if (error.status && error.data) {
        // APIサービスからのエラー（422, 409など）
        console.log('API Error - Status:', error.status, 'Message:', error.message);
        return { 
          success: false, 
          error: error.message || '登録に失敗しました',
          status: error.status 
        };
      } else if (error.message && error.message.includes('Failed to fetch')) {
        // ネットワークエラー（サーバーに到達できない）
        return { 
          success: false, 
          error: 'サーバーに接続できません。ネットワークを確認してください。',
          status: 0 
        };
      } else if (error.message && error.message.includes('JSON')) {
        // JSON解析エラー
        return { 
          success: false, 
          error: 'サーバーからの応答が正しくありません。',
          status: -1 
        };
      }
      
      return { 
        success: false, 
        error: error.message || '登録に失敗しました',
        status: error.status || -1 
      };
    }
  };

  const logout = async () => {
    try {
      await ApiService.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // APIエラーに関係なくローカルからは削除
      await SecureStore.deleteItemAsync('user');
      await SecureStore.deleteItemAsync('api_token');
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!authState.user) return;

      const response = await ApiService.updateProfile(updates);
      
      if (response.status === 'success') {
        const updatedUser = response.data.user;
        await SecureStore.setItemAsync('user', JSON.stringify(updatedUser));
        
        setAuthState({
          ...authState,
          user: updatedUser,
        });
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  const toggleFavoriteShop = async (shopId: string) => {
    try {
      if (!authState.user) {
        throw new Error('ログインが必要です');
      }

      await ApiService.toggleFavorite(shopId);
    } catch (error) {
      console.error('Failed to toggle favorite shop:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateProfile,
        toggleFavoriteShop,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 