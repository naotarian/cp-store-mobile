// API設定
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
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
  },
};

// APIのベースURL
export const BASE_URL = API_CONFIG.BASE_URL;

// APIエンドポイント
export const ENDPOINTS = API_CONFIG.ENDPOINTS; 