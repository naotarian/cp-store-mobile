// 各機能のAPIサービスをエクスポート
export { BaseApiService } from './base';
export { AuthApiService } from './auth';
export { ShopsApiService } from './shops';
export { ReviewsApiService } from './reviews';
export { FavoritesApiService } from './favorites';

// インポート
import { AuthApiService } from './auth';
import { ShopsApiService } from './shops';
import { ReviewsApiService } from './reviews';
import { FavoritesApiService } from './favorites';
import { BaseApiService } from './base';

// 後方互換性のため、統合されたAPIServiceクラスも提供
export class ApiService {
  // 認証関連
  static register = AuthApiService.register.bind(AuthApiService);
  static login = AuthApiService.login.bind(AuthApiService);
  static logout = AuthApiService.logout.bind(AuthApiService);
  static getUser = AuthApiService.getUser.bind(AuthApiService);
  static updateProfile = AuthApiService.updateProfile.bind(AuthApiService);

  // 店舗関連
  static getShops = ShopsApiService.getShops.bind(ShopsApiService);
  static getShop = ShopsApiService.getShop.bind(ShopsApiService);

  // レビュー関連
  static getShopReviews = ReviewsApiService.getShopReviews.bind(ReviewsApiService);
  static createReview = ReviewsApiService.createReview.bind(ReviewsApiService);

  // お気に入り関連
  static getFavorites = FavoritesApiService.getFavorites.bind(FavoritesApiService);
  static addFavorite = FavoritesApiService.addFavorite.bind(FavoritesApiService);
  static removeFavorite = FavoritesApiService.removeFavorite.bind(FavoritesApiService);
  static toggleFavorite = FavoritesApiService.toggleFavorite.bind(FavoritesApiService);
  static checkFavorite = FavoritesApiService.checkFavorite.bind(FavoritesApiService);

  // その他
  static testConnection = BaseApiService.testConnection.bind(BaseApiService);
} 