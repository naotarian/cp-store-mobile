import { ENDPOINTS } from '../../constants/api';
import { Shop } from '../../types/shop';
import { BaseApiService } from './base';

// お気に入りAPIのレスポンス型定義
interface FavoriteItem {
  id: string;
  user_id: string;
  shop_id: string;
  created_at: string;
  shop: Shop;
}

interface FavoritesResponse {
  status: string;
  data: FavoriteItem[];
}

export class FavoritesApiService extends BaseApiService {
  // お気に入り一覧取得
  static async getFavorites(): Promise<Shop[]> {
    try {
      const response = await this.request<FavoritesResponse>(ENDPOINTS.FAVORITES.INDEX);
      
      // FavoriteオブジェクトからShopデータを抽出
      const shops = response.data.map(favorite => favorite.shop);
      return shops;
    } catch (error: any) {
      // 認証エラーの場合は空配列を返す
      if (error.status === 401) {
        console.warn('User not authenticated, returning empty favorites list');
        return [];
      }
      throw error;
    }
  }

  // お気に入りに追加
  static async addFavorite(shopId: string): Promise<{ status: string; message: string }> {
    try {
      return this.request(ENDPOINTS.FAVORITES.STORE, {
        method: 'POST',
        body: JSON.stringify({ shop_id: shopId }),
      });
    } catch (error: any) {
      if (error.status === 401) {
        throw new Error('お気に入りに追加するにはログインが必要です');
      }
      throw error;
    }
  }

  // お気に入りから削除
  static async removeFavorite(shopId: string): Promise<{ status: string; message: string }> {
    try {
      return this.request(`${ENDPOINTS.FAVORITES.DESTROY}/${shopId}`, {
        method: 'DELETE',
      });
    } catch (error: any) {
      if (error.status === 401) {
        throw new Error('お気に入りから削除するにはログインが必要です');
      }
      throw error;
    }
  }

  // お気に入りトグル
  static async toggleFavorite(shopId: string): Promise<{ 
    status: string; 
    message: string; 
    is_favorite: boolean 
  }> {
    try {
      return this.request(ENDPOINTS.FAVORITES.TOGGLE, {
        method: 'POST',
        body: JSON.stringify({ shop_id: shopId }),
      });
    } catch (error: any) {
      if (error.status === 401) {
        throw new Error('お気に入りの操作にはログインが必要です');
      }
      throw error;
    }
  }

  // お気に入り状態確認
  static async checkFavorite(shopId: string): Promise<{ 
    status: string; 
    is_favorite: boolean 
  }> {
    try {
      return this.request(`${ENDPOINTS.FAVORITES.CHECK}/${shopId}`);
    } catch (error: any) {
      // 認証エラーの場合はお気に入りではないとして扱う
      if (error.status === 401) {
        console.warn('User not authenticated, returning is_favorite: false');
        return { status: 'success', is_favorite: false };
      }
      throw error;
    }
  }
} 