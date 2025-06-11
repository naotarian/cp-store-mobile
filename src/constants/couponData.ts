import { Coupon } from '../types/coupon';

// スターバックス用クーポン
export const starbucksCoupons: Coupon[] = [
  {
    id: 'starbucks-1',
    title: '新規会員限定',
    description: 'ドリンク1杯無料',
    discountType: 'fixed',
    discountValue: 500,
    expireDate: '2024-12-31',
    conditions: '500円以上のドリンク購入で利用可能',
    isNew: true,
  },
  {
    id: 'starbucks-2',
    title: 'フラペチーノ20%OFF',
    description: '全てのフラペチーノが20%割引',
    discountType: 'percentage',
    discountValue: 20,
    expireDate: '2024-08-15',
    conditions: '平日14:00-17:00限定',
    isNew: false,
  },
];

// タリーズ用クーポン
export const tullysCoupons: Coupon[] = [
  {
    id: 'tullys-1',
    title: 'モーニングセット300円OFF',
    description: 'ドリンク+フード セットが300円引き',
    discountType: 'fixed',
    discountValue: 300,
    expireDate: '2024-09-30',
    conditions: '平日9:00-11:00限定',
    isNew: true,
  },
];

// ドトール用クーポン
export const dotourCoupons: Coupon[] = [
  {
    id: 'dotour-1',
    title: 'ランチタイム15%OFF',
    description: '全商品15%割引',
    discountType: 'percentage',
    discountValue: 15,
    expireDate: '2024-07-31',
    conditions: '平日11:30-14:00限定',
    isNew: false,
  },
  {
    id: 'dotour-2',
    title: 'アイスコーヒー100円引き',
    description: 'アイスコーヒー各種が100円お得',
    discountType: 'fixed',
    discountValue: 100,
    expireDate: '2024-08-31',
    conditions: '夏季限定・1日1回まで',
    isNew: true,
  },
];

// ブルーボトル用クーポン
export const blueBottleCoupons: Coupon[] = [
  {
    id: 'bluebottle-1',
    title: 'スペシャルティコーヒー10%OFF',
    description: 'シングルオリジンコーヒーが10%引き',
    discountType: 'percentage',
    discountValue: 10,
    expireDate: '2024-09-15',
    conditions: '豆の購入も対象',
    isNew: false,
  },
];

// コメダ用クーポン
export const komedaCoupons: Coupon[] = [
  {
    id: 'komeda-1',
    title: 'シロノワール200円OFF',
    description: '名物シロノワールが200円お得',
    discountType: 'fixed',
    discountValue: 200,
    expireDate: '2024-08-31',
    conditions: 'ドリンクセット注文時',
    isNew: true,
  },
  {
    id: 'komeda-2',
    title: 'モーニングサービス無料',
    description: 'ドリンク注文でトースト無料',
    discountType: 'fixed',
    discountValue: 0,
    expireDate: '2024-12-31',
    conditions: '平日11:00まで',
    isNew: false,
  },
];

// 珈琲館用クーポン
export const kouhikanCoupons: Coupon[] = [
  {
    id: 'kouhikan-1',
    title: 'ブレンドコーヒー2杯目半額',
    description: '2杯目のブレンドコーヒーが50%OFF',
    discountType: 'percentage',
    discountValue: 50,
    expireDate: '2024-07-31',
    conditions: '同日内での利用限定',
    isNew: false,
  },
]; 