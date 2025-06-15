import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

interface LoginScreenProps {
  navigation: any;
  route: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, route }) => {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  // ナビゲーションパラメータを取得
  const returnTo = route.params?.returnTo;
  const returnParams = route.params?.returnParams;

  // 既にログイン済みの場合は店舗一覧に戻る（マウント時のみ）
  React.useEffect(() => {
    if (isAuthenticated) {
      navigation.getParent()?.reset({
        index: 0,
        routes: [{ name: 'ShopList' }],
      });
    }
  }, []); // 依存配列を空にしてマウント時のみ実行

  const clearErrors = () => {
    setErrors({});
  };

  const handleLogin = async () => {
    clearErrors();

    // バリデーション
    const newErrors: typeof errors = {};
    
    if (!email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }
    
    if (!password.trim()) {
      newErrors.password = 'パスワードを入力してください';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    const result = await login({ email: email.trim(), password });
    setIsLoading(false);

    if (result.success) {
      // ログイン成功時の遷移処理
      // AuthContextの状態更新後に遷移するため、少し待つ
      setTimeout(() => {
        try {
          if (returnTo === 'ShopDetail' && returnParams?.shop) {
            // 店舗詳細画面に戻る
            navigation.getParent()?.reset({
              index: 1,
              routes: [
                { name: 'ShopList' },
                { 
                  name: 'ShopDetail', 
                  params: { 
                    shop: returnParams.shop
                  } 
                }
              ],
            });
          } else {
            // デフォルト: 店舗一覧画面に遷移
            navigation.getParent()?.reset({
              index: 0,
              routes: [{ name: 'ShopList' }],
            });
          }
        } catch (error) {
          console.error('Navigation error:', error);
          // フォールバック: 通常のナビゲーション
          navigation.getParent()?.navigate('ShopList');
        }
      }, 1000);
    } else {
      // ステータスコードとエラーメッセージを解析して適切な場所に表示
      const errorMessage = result.error || 'ログインに失敗しました';
      const status = result.status;
      
      
      
      // ステータスコードに基づいてエラーを分類
      if (status === 401 || status === 404 || status === 422) {
        // 認証失敗（パスワード間違い）
        setErrors({ general: 'アカウント情報が正しくありません' });
      } else if (status === 0) {
        // ネットワークエラー
        setErrors({ general: 'サーバーに接続できません。ネットワークを確認してください。' });
      } else if (status === -1) {
        // JSON解析エラーやその他のエラー
        setErrors({ general: 'サーバーからの応答が正しくありません。' });
      } else {
        setErrors({ general: errorMessage });
      }
    }
  };

  const fillTestData = () => {
    clearErrors();
    setEmail('test@example.com');
    setPassword('password123');
  };

  // 既にログイン済みの場合は早期リターン
  if (isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <MaterialIcons name="check-circle" size={64} color="#4CAF50" />
            <Text style={styles.title}>ログイン済み</Text>
            <Text style={styles.subtitle}>店舗一覧に戻っています...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <MaterialIcons name="local-cafe" size={64} color="#6200EA" />
          <Text style={styles.title}>ログイン</Text>
          <Text style={styles.subtitle}>カフェ巡りを始めましょう</Text>
        </View>

        <View style={styles.form}>
          {/* 全般的なエラーメッセージ */}
          {errors.general && (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={20} color="#F44336" />
              <Text style={styles.errorText}>{errors.general}</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <MaterialIcons 
              name="email" 
              size={20} 
              color={errors.email ? "#F44336" : "#666"} 
              style={styles.inputIcon} 
            />
            <TextInput
              style={[
                styles.input,
                errors.email && styles.inputError
              ]}
              placeholder="メールアドレス"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: undefined }));
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>
          {errors.email && (
            <Text style={styles.fieldErrorText}>{errors.email}</Text>
          )}

          <View style={[styles.inputContainer, { marginTop: errors.email ? 8 : 16 }]}>
            <MaterialIcons 
              name="lock" 
              size={20} 
              color={errors.password ? "#F44336" : "#666"} 
              style={styles.inputIcon} 
            />
            <TextInput
              style={[
                styles.input, 
                styles.passwordInput,
                errors.password && styles.inputError
              ]}
              placeholder="パスワード"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors(prev => ({ ...prev, password: undefined }));
                }
              }}
              secureTextEntry={!showPassword}
              autoComplete="password"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialIcons
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={styles.fieldErrorText}>{errors.password}</Text>
          )}

          <TouchableOpacity
            style={[
              styles.loginButton, 
              isLoading && styles.disabledButton,
              { marginTop: errors.password ? 8 : 24 }
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContent}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.loadingText}>ログイン中...</Text>
              </View>
            ) : (
              <Text style={styles.loginButtonText}>ログイン</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.testButton} onPress={fillTestData}>
            <Text style={styles.testButtonText}>テストデータを入力</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>アカウントをお持ちでない方</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.linkText}>新規登録</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    marginBottom: 32,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 4,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#F44336',
    backgroundColor: '#fff5f5',
  },
  fieldErrorText: {
    color: '#F44336',
    fontSize: 12,
    marginLeft: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  loginButton: {
    backgroundColor: '#6200EA',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  testButton: {
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  testButtonText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  linkText: {
    fontSize: 16,
    color: '#6200EA',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
}); 