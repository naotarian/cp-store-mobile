/**
 * 距離をメートル単位から表示用文字列にフォーマットする
 * @param meters 距離（メートル）
 * @returns フォーマットされた距離文字列
 */
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  } else {
    const km = meters / 1000;
    return `${km.toFixed(1)}km`;
  }
};

/**
 * Shop オブジェクトに表示用距離を追加する
 * @param shop Shop オブジェクト
 * @returns 表示用距離が追加された Shop オブジェクト
 */
export const addFormattedDistance = <T extends { distance_meters?: number; name?: string }>(
  shop: T
): T & { distance?: string } => {
  const formattedDistance = shop.distance_meters ? formatDistance(shop.distance_meters) : undefined;

  return {
    ...shop,
    distance: formattedDistance,
  };
}; 