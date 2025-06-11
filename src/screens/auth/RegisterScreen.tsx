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
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { register, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

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

  const handleRegister = async () => {
    clearErrors();

    // バリデーション
    const newErrors: typeof errors = {};
    
    if (!name.trim()) {
      newErrors.name = 'お名前を入力してください';
    } else if (name.trim().length < 2) {
      newErrors.name = 'お名前は2文字以上で入力してください';
    }
    
    if (!email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }
    
    if (!password.trim()) {
      newErrors.password = 'パスワードを入力してください';
    } else if (password.length < 6) {
      newErrors.password = 'パスワードは6文字以上で入力してください';
    }
    
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'パスワード確認を入力してください';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    const result = await register({
      name: name.trim(),
      email: email.trim(),
      password,
      password_confirmation: confirmPassword,
    });
    setIsLoading(false);

    if (result.success) {
      // 登録成功時にナビゲーションスタックをリセットして店舗一覧画面に遷移
      // AuthContextの状態更新後に遷移するため、少し待つ
      setTimeout(() => {
        try {
          navigation.getParent()?.reset({
            index: 0,
            routes: [{ name: 'ShopList' }],
          });
        } catch (error) {
          console.error('Navigation error:', error);
          // フォールバック: 通常のナビゲーション
          navigation.getParent()?.navigate('ShopList');
        }
      }, 100);
    } else {
      // ステータスコードとエラーメッセージを解析して適切な場所に表示
      const errorMessage = result.error || '登録に失敗しました';
      const status = result.status;
      
      console.log('Register failed - Status:', status, 'Message:', errorMessage);
      
      // ステータスコードに基づいてエラーを分類
      if (status === 409) {
        // メールアドレス重複
        setErrors({ email: 'このメールアドレスは既に登録されています' });
      } else if (status === 422) {
        // バリデーションエラー
        if (errorMessage.includes('メールアドレス') || errorMessage.includes('email')) {
          setErrors({ email: 'メールアドレスの形式が正しくありません' });
        } else if (errorMessage.includes('パスワード') || errorMessage.includes('password')) {
          setErrors({ password: 'パスワードの形式が正しくありません' });
        } else if (errorMessage.includes('名前') || errorMessage.includes('name')) {
          setErrors({ name: 'お名前の形式が正しくありません' });
        } else {
          setErrors({ general: errorMessage });
        }
      } else if (status === 0) {
        // ネットワークエラー
        setErrors({ general: 'サーバーに接続できません。ネットワークを確認してください。' });
      } else if (status === -1) {
        // JSON解析エラーやその他のエラー
        setErrors({ general: 'サーバーからの応答が正しくありません。' });
      } else {
        // その他のエラー（従来の文字列解析も含む）
        if (errorMessage.includes('メールアドレス') || errorMessage.includes('email')) {
          if (errorMessage.includes('既に') || errorMessage.includes('登録済み')) {
            setErrors({ email: 'このメールアドレスは既に登録されています' });
          } else {
            setErrors({ email: 'メールアドレスの形式が正しくありません' });
          }
        } else if (errorMessage.includes('パスワード') || errorMessage.includes('password')) {
          setErrors({ password: 'パスワードの形式が正しくありません' });
        } else if (errorMessage.includes('名前') || errorMessage.includes('name')) {
          setErrors({ name: 'お名前の形式が正しくありません' });
        } else {
          setErrors({ general: errorMessage });
        }
      }
    }
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
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <MaterialIcons name="person-add" size={64} color="#6200EA" />
            <Text style={styles.title}>新規登録</Text>
            <Text style={styles.subtitle}>アカウントを作成してカフェ巡りを始めよう</Text>
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
                name="person" 
                size={20} 
                color={errors.name ? "#F44336" : "#666"} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={[
                  styles.input,
                  errors.name && styles.inputError
                ]}
                placeholder="お名前"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) {
                    setErrors(prev => ({ ...prev, name: undefined }));
                  }
                }}
                autoCapitalize="words"
                autoComplete="name"
              />
            </View>
            {errors.name && (
              <Text style={styles.fieldErrorText}>{errors.name}</Text>
            )}

            <View style={[styles.inputContainer, { marginTop: errors.name ? 8 : 16 }]}>
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
                placeholder="パスワード（6文字以上）"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: undefined }));
                  }
                }}
                secureTextEntry={!showPassword}
                autoComplete="new-password"
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

            <View style={[styles.inputContainer, { marginTop: errors.password ? 8 : 16 }]}>
              <MaterialIcons 
                name="lock" 
                size={20} 
                color={errors.confirmPassword ? "#F44336" : "#666"} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={[
                  styles.input, 
                  styles.passwordInput,
                  errors.confirmPassword && styles.inputError
                ]}
                placeholder="パスワード確認"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) {
                    setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                  }
                }}
                secureTextEntry={!showConfirmPassword}
                autoComplete="new-password"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <MaterialIcons
                  name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={styles.fieldErrorText}>{errors.confirmPassword}</Text>
            )}

            <TouchableOpacity
              style={[
                styles.registerButton, 
                isLoading && styles.disabledButton,
                { marginTop: errors.confirmPassword ? 8 : 24 }
              ]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContent}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.loadingText}>登録中...</Text>
                </View>
              ) : (
                <Text style={styles.registerButtonText}>登録する</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>既にアカウントをお持ちの方</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.linkText}>ログイン</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
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
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: 32,
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
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  registerButton: {
    backgroundColor: '#6200EA',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  linkText: {
    fontSize: 16,
    color: '#6200EA',
    fontWeight: '600',
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
  fieldErrorText: {
    color: '#F44336',
    fontSize: 12,
    marginLeft: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
}); 