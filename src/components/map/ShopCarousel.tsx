import React from 'react'
import { View, FlatList, Dimensions, StyleSheet } from 'react-native'
import { Shop } from '../../types/shop'
import { ShopCard } from './ShopCard'

interface ShopCarouselProps {
    shops: Shop[]
    currentShopIndex: number
    favoriteShopIds: Set<string>
    onShopChange: (index: number) => void
    onShopDetailPress: () => void
    onRoutePress: (shop: Shop) => void
    carouselRef: React.RefObject<FlatList<Shop>>
}

export const ShopCarousel: React.FC<ShopCarouselProps> = ({
    shops,
    currentShopIndex,
    favoriteShopIds,
    onShopChange,
    onShopDetailPress,
    onRoutePress,
    carouselRef
}) => {
    const { width: screenWidth } = Dimensions.get('window')

    const renderShopCard = ({ item: shop, index }: { item: Shop; index: number }) => {
        const isActive = index === currentShopIndex
        const isFavorite = favoriteShopIds.has(shop.id.toString())

        return (
            <View style={{ width: screenWidth * 0.85, marginHorizontal: 8 }}>
                <ShopCard
                    shop={shop}
                    isActive={isActive}
                    isFavorite={isFavorite}
                    onDetailPress={onShopDetailPress}
                    onRoutePress={() => onRoutePress(shop)}
                />
            </View>
        )
    }

    if (shops.length === 0) {
        return null
    }

    return (
        <View style={styles.carouselContainer}>
            <FlatList
                ref={carouselRef}
                data={shops}
                renderItem={renderShopCard}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={screenWidth * 0.85 + 16}
                snapToAlignment="start"
                decelerationRate="fast"
                contentContainerStyle={{ 
                    paddingLeft: (screenWidth - screenWidth * 0.85) / 2 - 8,
                    paddingRight: (screenWidth - screenWidth * 0.85) / 2 - 8
                }}
                onMomentumScrollEnd={(event) => {
                    const cardWidth = screenWidth * 0.85 + 16
                    const offsetX = event.nativeEvent.contentOffset.x
                    const index = Math.round(offsetX / cardWidth)
                    if (index !== currentShopIndex && index >= 0 && index < shops.length) {
                        onShopChange(index)
                    }
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    carouselContainer: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        height: 200,
    },
}) 