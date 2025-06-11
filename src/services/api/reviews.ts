import { ENDPOINTS } from '../../constants/api';
import { Review } from '../../types/review';
import { BaseApiService, ApiResponse } from './base';

export class ReviewsApiService extends BaseApiService {
  // 店舗のレビュー取得
  static async getShopReviews(shopId: string): Promise<Review[]> {
    const response = await this.request<ApiResponse<Review[]>>(`${ENDPOINTS.SHOPS}/${shopId}/reviews`);
    return response.data;
  }

  // レビュー投稿
  static async createReview(shopId: string, rating: number, comment: string): Promise<Review> {
    const response = await this.request<ApiResponse<Review>>(`${ENDPOINTS.SHOPS}/${shopId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({
        rating,
        comment,
      }),
    });
    return response.data;
  }
} 