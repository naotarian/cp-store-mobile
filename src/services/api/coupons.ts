import { BaseApiService } from './base';
import { Coupon } from '../../types/coupon';

export interface CouponsResponse {
  status: 'success' | 'error';
  data: {
    coupons: Coupon[];
  };
  message?: string;
}

export interface ActiveIssuesResponse {
  status: 'success' | 'error';
  data: {
    active_issues: any[];
  };
  message?: string;
}

export interface CouponAcquisitionResponse {
  status: 'success' | 'error';
  data?: {
    acquisition_id: string;
    expires_at: string;
  };
  message?: string;
}

export class CouponsApiService extends BaseApiService {
  /**
   * 店舗の利用可能なクーポン一覧を取得
   */
  static async getShopCoupons(shopId: string): Promise<CouponsResponse> {
    try {
      const response = await this.request<CouponsResponse>(`/shops/${shopId}/coupons`);
      return response;
    } catch (error) {
      console.error('Failed to get shop coupons:', error);
      throw error;
    }
  }

  /**
   * 店舗の現在発行中のクーポン一覧を取得
   */
  static async getActiveIssues(shopId: string): Promise<ActiveIssuesResponse> {
    try {
      const response = await this.request<ActiveIssuesResponse>(`/shops/${shopId}/active-issues`);
      return response;
    } catch (error) {
      console.error('Failed to get active issues:', error);
      throw error;
    }
  }

  /**
   * クーポンを取得する
   */
  static async acquireCoupon(issueId: string): Promise<CouponAcquisitionResponse> {
    try {
      const response = await this.request<CouponAcquisitionResponse>(`/coupon-issues/${issueId}/acquire`, {
        method: 'POST'
      });
      return response;
    } catch (error) {
      console.error('Failed to acquire coupon:', error);
      throw error;
    }
  }

  /**
   * ユーザーの取得済みクーポン一覧を取得
   */
  static async getUserCoupons(): Promise<any> {
    try {
      const response = await this.request<any>('/user/coupons');
      return response;
    } catch (error) {
      console.error('Failed to get user coupons:', error);
      throw error;
    }
  }
} 