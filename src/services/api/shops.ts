import { ENDPOINTS } from '../../constants/api';
import { Shop } from '../../types/shop';
import { BaseApiService, ApiResponse } from './base';
import { addFormattedDistance } from '../../utils/distance';

export class ShopsApiService extends BaseApiService {
  // 店舗一覧取得
  static async getShops(latitude?: number, longitude?: number): Promise<Shop[]> {
    let url = ENDPOINTS.SHOPS;
    if (latitude !== undefined && longitude !== undefined) {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString()
      });
      url = `${ENDPOINTS.SHOPS}?${params}`;
    }
    
    const response = await this.request<ApiResponse<Shop[]>>(url);
    return response.data.map(shop => addFormattedDistance(shop));
  }

  // 位置情報による店舗一覧取得
  static async getShopsByLocation(latitude: number, longitude: number, radiusKm: number = 1): Promise<Shop[]> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius: radiusKm.toString()
    });
    const response = await this.request<ApiResponse<Shop[]>>(`${ENDPOINTS.SHOPS}?${params}`);
    // console.log('APIレスポンス:', {
    //   status: response.status,
    //   dataCount: response.data.length,
    //   firstShop: response.data[0] ? {
    //     name: response.data[0].name,
    //     distance_meters: response.data[0].distance_meters,
    //     latitude: response.data[0].latitude,
    //     longitude: response.data[0].longitude
    //   } : null
    // });
    return response.data.map(shop => addFormattedDistance(shop));
  }

  // 特定店舗取得
  static async getShop(id: string): Promise<Shop> {
    const response = await this.request<ApiResponse<Shop>>(`${ENDPOINTS.SHOPS}/${id}`);
    return addFormattedDistance(response.data);
  }
} 