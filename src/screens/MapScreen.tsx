import { useEffect, useState, useRef } from "react"
import { StyleSheet, View, Text, SafeAreaView, ActivityIndicator, Alert, Platform, Dimensions, FlatList, Linking } from "react-native"
import * as Location from "expo-location"
import { MaterialIcons } from '@expo/vector-icons'
import { Shop } from '../types/shop'
import { ShopMarker, CameraPosition } from '../types/map'
import { ShopsApiService } from '../services/api/shops'
import { useAuth } from '../contexts/AuthContext'
import { ApiService } from '../services/api'
import { MapView } from '../components/map/MapView'
import { ShopCarousel } from '../components/map/ShopCarousel'
import { sortShopsByDistance, createShopMarkers, updateMarkerColors } from '../utils/mapUtils'

interface MapScreenProps {
    navigation: any
    route?: {
        params?: {
            selectedShopId?: string
        }
    }
}

export const MapScreen: React.FC<MapScreenProps> = ({ navigation, route }) => {
    const { isAuthenticated } = useAuth()
    
    // State
    const [cameraPosition, setCameraPosition] = useState<CameraPosition | null>(null)
    const [markers, setMarkers] = useState<ShopMarker[]>([])
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedShop, setSelectedShop] = useState<Shop | null>(null)
    const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null)
    const [shops, setShops] = useState<Shop[]>([])
    const [currentShopIndex, setCurrentShopIndex] = useState(0)
    const [favoriteShopIds, setFavoriteShopIds] = useState<Set<string>>(new Set())
    
    // Refs
    const mapRef = useRef<any>(null)
    const carouselRef = useRef<FlatList<Shop>>(null)
    const { width: screenWidth } = Dimensions.get('window')

    // パラメータから指定された店舗IDを監視
    useEffect(() => {
        const selectedShopId = route?.params?.selectedShopId
        if (selectedShopId && shops.length > 0) {
            const foundIndex = shops.findIndex(shop => shop.id.toString() === selectedShopId)
            
            if (foundIndex !== -1) {
                const selectedShop = shops[foundIndex]
                
                setSelectedShop(selectedShop)
                setSelectedMarkerId(`shop-${selectedShop.id}`)
                setCurrentShopIndex(foundIndex)
                
                // マーカーの色を更新
                const updatedMarkers = updateMarkerColors(markers, foundIndex)
                setMarkers(updatedMarkers)
                
                // カルーセルを該当位置にスクロール
                setTimeout(() => {
                    if (carouselRef.current) {
                        carouselRef.current.scrollToIndex({ 
                            index: foundIndex, 
                            animated: true,
                            viewOffset: (screenWidth - screenWidth * 0.85) / 2 - 8
                        })
                    }
                }, 300)
            }
        }
    }, [shops, route?.params?.selectedShopId])

    useEffect(() => {
        getCurrentLocation()
    }, [])

    useEffect(() => {
        fetchFavoriteShops()
    }, [isAuthenticated])

    const getCurrentLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== "granted") {
            setErrorMsg("位置情報へのアクセスが拒否されました")
            await fetchShops(null)
            return
        }

        try {
            const location = await Location.getCurrentPositionAsync({})
            setCameraPosition({
                coordinates: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                },
                zoom: 15
            })
            
            await fetchShops({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            })
        } catch (error) {
            console.error("現在地情報取得エラー：", error)
            setErrorMsg("現在地情報の取得に失敗しました")
            await fetchShops(null)
        }
    }

    const fetchFavoriteShops = async () => {
        if (!isAuthenticated) {
            setFavoriteShopIds(new Set())
            return
        }
        
        try {
            const response = await ApiService.getFavorites()
            const favoriteIds = new Set<string>(response.map((shop: Shop) => shop.id.toString()))
            setFavoriteShopIds(favoriteIds)
        } catch (error) {
            console.error('Failed to fetch favorite shops:', error)
            setFavoriteShopIds(new Set())
        }
    }

    const fetchShops = async (location: { latitude: number; longitude: number } | null) => {
        try {
            setLoading(true)
            let shopsData: Shop[]
            
            if (location) {
                shopsData = await ShopsApiService.getShopsByLocation(
                    location.latitude,
                    location.longitude,
                    10
                )
            } else {
                shopsData = await ApiService.getShops()
            }

            let sortedShops: Shop[]
            if (location) {
                sortedShops = sortShopsByDistance(shopsData, location)
            } else {
                sortedShops = shopsData
            }
            
            setShops(sortedShops)

            // 特定の店舗が指定されている場合はその店舗のインデックスを取得
            const selectedShopId = route?.params?.selectedShopId
            
            let selectedIndex = 0
            let initialShopIndex = 0
            let initialShop = sortedShops[0]
            
            if (selectedShopId && sortedShops.length > 0) {
                const foundIndex = sortedShops.findIndex(shop => shop.id.toString() === selectedShopId)
                if (foundIndex !== -1) {
                    selectedIndex = foundIndex
                    initialShopIndex = foundIndex
                    initialShop = sortedShops[foundIndex]
                }
            }
            
            // マーカーを作成
            const shopMarkers = createShopMarkers(sortedShops, selectedIndex)
            setMarkers(shopMarkers)
            
            if (sortedShops.length > 0) {
                setSelectedShop(initialShop)
                setSelectedMarkerId(`shop-${initialShop.id}`)
                setCurrentShopIndex(initialShopIndex)
                
                // 初期位置を中央に設定（少し遅延させる）
                setTimeout(() => {
                    if (carouselRef.current) {
                        carouselRef.current.scrollToIndex({ 
                            index: initialShopIndex, 
                            animated: false,
                            viewOffset: (screenWidth - screenWidth * 0.85) / 2 - 8
                        })
                    }
                }, 100)
            }
        } catch (error) {
            console.error("店舗データ取得エラー：", error)
            setErrorMsg("店舗データの取得に失敗しました")
        } finally {
            setLoading(false)
        }
    }

    const handleShopChange = (index: number) => {
        if (index >= 0 && index < shops.length) {
            const shop = shops[index]
            setSelectedShop(shop)
            setSelectedMarkerId(`shop-${shop.id}`)
            setCurrentShopIndex(index)
            
            // マーカーの色を更新
            const updatedMarkers = updateMarkerColors(markers, index)
            setMarkers(updatedMarkers)
            
            // マップのカメラを選択された店舗に移動
            if (mapRef.current && shop) {
                const newCameraPosition = {
                    coordinates: {
                        latitude: shop.latitude,
                        longitude: shop.longitude,
                    },
                    zoom: 15
                }
                setCameraPosition(newCameraPosition)
            }
        }
    }

    const handleMarkerClick = (event: any) => {
        const markerData = event.nativeEvent
        let clickedShop: Shop | null = null
        
        if (markerData && markerData.shop) {
            clickedShop = markerData.shop
        } else if (markerData && markerData.coordinate) {
            const clickedMarker = markers.find(marker => 
                Math.abs(marker.coordinates.latitude - markerData.coordinate.latitude) < 0.0001 &&
                Math.abs(marker.coordinates.longitude - markerData.coordinate.longitude) < 0.0001
            )
            if (clickedMarker) {
                clickedShop = clickedMarker.shop
            }
        }
        
        if (clickedShop) {
            const shopIndex = shops.findIndex(shop => shop.id === clickedShop!.id)
            if (shopIndex !== -1) {
                handleShopChange(shopIndex)
                
                // カルーセルを該当位置にスクロール
                setTimeout(() => {
                    if (carouselRef.current) {
                        carouselRef.current.scrollToIndex({ 
                            index: shopIndex, 
                            animated: true,
                            viewOffset: (screenWidth - screenWidth * 0.85) / 2 - 8
                        })
                    }
                }, 100)
            }
        }
    }

    const handleShopDetailPress = () => {
        if (selectedShop) {
            navigation.navigate('ShopDetail', { shop: selectedShop })
        }
    }

    const handleRoutePress = (shop: Shop) => {
        if (Platform.OS === 'ios') {
            openAppleMaps(shop)
        } else {
            Alert.alert('お知らせ', 'ルート機能はiOSでのみ利用可能です')
        }
    }

    const openAppleMaps = async (shop: Shop) => {
        try {
            const url = `maps://app?daddr=${shop.latitude},${shop.longitude}&dirflg=d`
            const canOpen = await Linking.canOpenURL(url)
            
            if (canOpen) {
                Alert.alert(
                    'Apple Mapsで開く',
                    `${shop.name}への道順をApple Mapsで表示しますか？`,
                    [
                        { text: 'キャンセル', style: 'cancel' },
                        { 
                            text: '開く', 
                            onPress: () => Linking.openURL(url)
                        }
                    ]
                )
            } else {
                Alert.alert('エラー', 'Apple Mapsを開けませんでした')
            }
        } catch (error) {
            console.error('Apple Maps error:', error)
            Alert.alert('エラー', 'Apple Mapsを開けませんでした')
        }
    }

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#6200EA" />
                    <Text style={styles.loadingText}>マップを読み込み中...</Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {errorMsg ? (
                <View style={styles.errorContainer}>
                    <MaterialIcons name="error" size={24} color="#f44336" />
                    <Text style={styles.errorText}>エラー</Text>
                    <Text style={styles.errorSubText}>{errorMsg}</Text>
                </View>
            ) : null}
            
            <MapView
                cameraPosition={cameraPosition}
                markers={markers}
                onMarkerClick={handleMarkerClick}
                mapRef={mapRef}
                errorMsg={errorMsg}
            />
            
            <ShopCarousel
                shops={shops}
                currentShopIndex={currentShopIndex}
                favoriteShopIds={favoriteShopIds}
                onShopChange={handleShopChange}
                onShopDetailPress={handleShopDetailPress}
                onRoutePress={handleRoutePress}
                carouselRef={carouselRef}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        backgroundColor: '#ffebee',
        padding: 16,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ffcdd2',
    },
    errorText: {
        fontSize: 16,
        color: '#f44336',
        fontWeight: 'bold',
        marginTop: 8,
    },
    errorSubText: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
})