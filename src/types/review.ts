export interface Review {
  id: string;
  shop_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    name: string;
  };
} 