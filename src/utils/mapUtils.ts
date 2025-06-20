import { Shop } from '../types/shop'
import { ShopMarker, LocationCoords } from '../types/map'

// 距離を計算する関数（Haversine formula）
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // 地球の半径（km）
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

// 店舗データを距離順にソート
export const sortShopsByDistance = (shopsData: Shop[], userLocation: LocationCoords): Shop[] => {
    return shopsData
        .map(shop => {
            const distanceKm = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                shop.latitude,
                shop.longitude
            );
            return {
                ...shop,
                distance: `${distanceKm.toFixed(1)}km`,
                distance_meters: distanceKm * 1000
            };
        })
        .sort((a, b) => (a.distance_meters || 0) - (b.distance_meters || 0));
};

// 店舗からマーカーを作成
export const createShopMarkers = (shops: Shop[], selectedIndex: number = 0): ShopMarker[] => {
    return shops.map((shop: Shop, index: number) => ({
        id: `shop-${shop.id}`,
        coordinates: {
            latitude: shop.latitude,
            longitude: shop.longitude,
        },
        systemImage: 'storefront.fill',
        title: shop.name,
        snippet: shop.distance ? `距離: ${shop.distance}` : shop.address,
        shop: shop,
        tintColor: index === selectedIndex ? "#FF6B35" : "#FFD700"
    }));
};

// マーカーの色を更新
export const updateMarkerColors = (markers: ShopMarker[], selectedIndex: number): ShopMarker[] => {
    return markers.map((marker, index) => ({
        ...marker,
        tintColor: index === selectedIndex ? "#FF6B35" : "#FFD700"
    }));
}; 