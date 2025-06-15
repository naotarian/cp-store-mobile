import { BASE_URL } from '../../constants/api';
import * as SecureStore from 'expo-secure-store';

// APIレスポンスの型定義
export interface ApiResponse<T> {
  status: string;
  data: T;
}

// ベースAPIクライアントクラス
export class BaseApiService {
  protected static baseUrl = BASE_URL;

  // HTTPリクエストの共通メソッド
  protected static async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      // options.headersが存在する場合、マージする
      if (options?.headers) {
        Object.assign(headers, options.headers);
      }

      // SecureStoreからトークンを取得してAuthorizationヘッダーに追加
      try {
        const token = await SecureStore.getItemAsync('api_token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.log('Token retrieval error:', error);
      }

      const response = await fetch(url, {
        credentials: 'include', // セッションクッキーを含める
        headers,
        ...options,
      });

      // レスポンスボディを読み取り
      const data = await response.json();

      if (!response.ok) {
        // エラーレスポンスの場合、APIからのエラーメッセージを含むエラーオブジェクトを作成
        const apiError = new Error(data.message || `HTTP error! status: ${response.status}`);
        (apiError as any).status = response.status;
        (apiError as any).data = data;
        throw apiError;
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // API疎通確認
  static async testConnection(): Promise<any> {
    const response = await this.request<any>('/test');
    return response;
  }
} 