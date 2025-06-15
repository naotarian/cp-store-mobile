import { Shop } from './shop'

// マーカーのデータ型
export type ShopMarker = {
    id: string
    coordinates: {
        latitude: number
        longitude: number
    }
    title: string
    snippet?: string
    shop: Shop
    tintColor?: string // マーカーの色
}

// カメラ位置の型
export type CameraPosition = {
    coordinates: {
        latitude: number
        longitude: number
    }
    zoom: number
}

// 位置情報の型
export type LocationCoords = {
    latitude: number
    longitude: number
} 