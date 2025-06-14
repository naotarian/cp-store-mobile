export interface Coupon {
  id: string;
  title: string;
  description: string;
  conditions?: string;
  notes?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // 統計情報
  active_issues_count: number;
  schedules_count: number;
  total_issues_count: number;
}

export interface CouponIssue {
  id: string;
  coupon_id: string;
  issue_type: 'manual' | 'batch_generated';
  start_datetime: string;
  end_datetime: string;
  duration_minutes: number;
  max_acquisitions?: number;
  current_acquisitions: number;
  remaining_count: number;
  time_remaining: string;
  is_available: boolean;
  status: 'active' | 'expired' | 'full' | 'cancelled';
  issued_at: string;
  // リレーション
  coupon: {
    id: string;
    title: string;
    description?: string;
    conditions?: string;
    notes?: string;
  };
  issuer?: {
    id: string;
    name: string;
  };
}

export interface CouponAcquisition {
  id: string;
  coupon_issue_id: string;
  user_id: string;
  acquired_at: string;
  used_at?: string;
  expired_at: string;
  status: 'active' | 'used' | 'expired';
  processed_by?: string;
  usage_notes?: string;
  // 計算プロパティ
  is_expired: boolean;
  is_usable: boolean;
  time_until_expiry: string;
  // リレーション
  coupon_issue: {
    id: string;
    end_datetime: string;
    start_datetime: string;
    duration_minutes: number;
    status: string;
  };
  coupon: {
    id: string;
    title: string;
    description?: string;
    conditions?: string;
    notes?: string;
  };
  shop: {
    id: string;
    name: string;
  };
} 