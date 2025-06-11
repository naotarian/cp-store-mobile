export interface Coupon {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expireDate: string;
  conditions: string;
  isNew: boolean;
} 