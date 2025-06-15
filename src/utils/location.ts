import * as Location from 'expo-location';
import { Platform } from 'react-native';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface LocationError {
  code: string;
  message: string;
}

/**
 * 現在の位置情報を取得する
 */
export const getCurrentLocation = async (): Promise<LocationCoordinates> => {
  try {
    
    // 位置情報の権限をリクエスト
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      throw {
        code: 'PERMISSION_DENIED',
        message: '位置情報の使用が拒否されました。設定から位置情報の使用を許可してください。'
      } as LocationError;
    }

    // 現在の位置情報を取得
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      timeInterval: 10000,
      distanceInterval: 1,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    };
  } catch (error: any) {
    // Expo Locationのエラーハンドリング
    if (error.code) {
      throw error; // 既にLocationErrorの場合はそのまま
    }
    
    let message = '位置情報の取得に失敗しました';
    
    if (error.message?.includes('Location request timed out')) {
      message = '位置情報の取得がタイムアウトしました';
    } else if (error.message?.includes('Location provider is unavailable')) {
      message = '位置情報サービスが利用できません。GPSを有効にしてください。';
    }
    
    throw {
      code: 'LOCATION_ERROR',
      message
    } as LocationError;
  }
};

/**
 * 2点間の距離を計算する（Haversine公式）
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // 地球の半径（km）
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // 小数点第2位まで
};

/**
 * 度をラジアンに変換
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * 距離を表示用文字列に変換
 */
export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm}km`;
}; 