import { ENDPOINTS } from '../../constants/api';
import { Shop } from '../../types/shop';
import { BaseApiService, ApiResponse } from './base';

export class ShopsApiService extends BaseApiService {
  // 店舗一覧取得
  static async getShops(): Promise<Shop[]> {
    const response = await this.request<ApiResponse<Shop[]>>(ENDPOINTS.SHOPS);
    return response.data;
  }

  // 特定店舗取得
  static async getShop(id: string): Promise<Shop> {
    const response = await this.request<ApiResponse<Shop>>(`${ENDPOINTS.SHOPS}/${id}`);
    return response.data;
  }
} 