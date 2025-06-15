import { Coupon } from './coupon';

export interface Shop {
  id: string;
  name: string;
  description: string;
  address: string;
  image: string;
  open_time: string;
  close_time: string;
  latitude: number;
  longitude: number;
  average_rating: string;
  review_count: number;
  created_at: string;
  updated_at: string;
  // API から返される距離（メートル単位）
  distance_meters?: number;
  // フロントエンド用の計算フィールド
  distance?: string;
  coupons?: Coupon[];
} 