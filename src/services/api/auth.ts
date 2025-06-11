import { ENDPOINTS } from '../../constants/api';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../../types/user';
import { BaseApiService } from './base';

export class AuthApiService extends BaseApiService {
  // ユーザー登録
  static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>(ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // ログイン
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>(ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // ログアウト
  static async logout(): Promise<{ status: string; message: string }> {
    return this.request(ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    });
  }

  // ユーザー情報取得
  static async getUser(): Promise<AuthResponse> {
    return this.request<AuthResponse>(ENDPOINTS.AUTH.USER);
  }

  // プロフィール更新
  static async updateProfile(updates: Partial<User>): Promise<AuthResponse> {
    return this.request<AuthResponse>(ENDPOINTS.AUTH.PROFILE, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }
} 