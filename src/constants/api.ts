// API設定
export const API_CONFIG = {
  // 開発環境用API URL
  // iOS Simulator: localhost または実際のIPアドレス
  // Android Emulator: 10.0.2.2
  // 実機: 実際のIPアドレス（例: 192.168.1.100）
  BASE_URL: __DEV__ 
    ? 'http://localhost:8080/api'  // 開発時はlocalhost（iOS Simulator用）
    : 'http://your-production-api.com/api', // 本番環境のURL
  ENDPOINTS: {
    // 店舗関連
    SHOPS: '/shops',
    REVIEWS: '/reviews',
    TEST: '/test',
    
    // 認証関連
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      USER: '/auth/user',
      PROFILE: '/auth/profile',
    },
    
    // お気に入り関連
    FAVORITES: {
      INDEX: '/favorites',
      STORE: '/favorites',
      DESTROY: '/favorites',
      TOGGLE: '/favorites/toggle',
      CHECK: '/favorites/check',
    },
    
    // クーポン関連
    COUPONS: {
      SHOP_COUPONS: '/shops/{shopId}/coupons',
      ACTIVE_ISSUES: '/shops/{shopId}/active-issues',
      ACQUIRE: '/coupon-issues/{issueId}/acquire',
      USER_COUPONS: '/user/coupons',
      USE_COUPON: '/user/coupons/{acquisitionId}/use',
    },
  },
};

// APIのベースURL
export const BASE_URL = API_CONFIG.BASE_URL;

// APIエンドポイント
export const ENDPOINTS = API_CONFIG.ENDPOINTS; 