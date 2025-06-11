import { ENDPOINTS } from '../../constants/api';
import { Shop } from '../../types/shop';
import { BaseApiService, ApiResponse } from './base';

export class FavoritesApiService extends BaseApiService {
  // お気に入り一覧取得
  static async getFavorites(): Promise<Shop[]> {
    const response = await this.request<ApiResponse<Shop[]>>(ENDPOINTS.FAVORITES.INDEX);
    return response.data;
  }

  // お気に入りに追加
  static async addFavorite(shopId: string): Promise<{ status: string; message: string }> {
    return this.request(ENDPOINTS.FAVORITES.STORE, {
      method: 'POST',
      body: JSON.stringify({ shop_id: shopId }),
    });
  }

  // お気に入りから削除
  static async removeFavorite(shopId: string): Promise<{ status: string; message: string }> {
    return this.request(`${ENDPOINTS.FAVORITES.DESTROY}/${shopId}`, {
      method: 'DELETE',
    });
  }

  // お気に入りトグル
  static async toggleFavorite(shopId: string): Promise<{ 
    status: string; 
    message: string; 
    is_favorite: boolean 
  }> {
    return this.request(ENDPOINTS.FAVORITES.TOGGLE, {
      method: 'POST',
      body: JSON.stringify({ shop_id: shopId }),
    });
  }

  // お気に入り状態確認
  static async checkFavorite(shopId: string): Promise<{ 
    status: string; 
    is_favorite: boolean 
  }> {
    return this.request(`${ENDPOINTS.FAVORITES.CHECK}/${shopId}`);
  }
} 