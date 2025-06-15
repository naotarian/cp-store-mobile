import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert, Linking } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Shop } from '../../types/shop'

interface ShopCardProps {
    shop: Shop
    isActive: boolean
    isFavorite: boolean
    onDetailPress: () => void
    onRoutePress: () => void
}

export const ShopCard: React.FC<ShopCardProps> = ({
    shop,
    isActive,
    isFavorite,
    onDetailPress,
    onRoutePress
}) => {
    return (
        <View style={[styles.shopCard, isActive && styles.activeShopCard]}>
            <View style={styles.shopCardHeader}>
                <View style={styles.shopCardInfo}>
                    <View style={styles.shopNameRow}>
                        <Text style={styles.shopName} numberOfLines={1} ellipsizeMode="tail">
                            {shop.name}
                        </Text>
                        {isFavorite && (
                            <MaterialIcons name="favorite" size={20} color="#FF6B6B" style={styles.favoriteIcon} />
                        )}
                    </View>
                    <Text style={styles.shopAddress} numberOfLines={1} ellipsizeMode="tail">
                        {shop.address}
                    </Text>
                    {shop.distance && (
                        <Text style={styles.shopDistance}>📍 {shop.distance}</Text>
                    )}
                </View>
            </View>
            
            <View style={styles.shopCardActions}>
                <TouchableOpacity
                    style={[
                        styles.detailCardButton,
                        Platform.OS !== 'ios' && styles.fullWidthButton
                    ]}
                    onPress={onDetailPress}
                >
                    <MaterialIcons name="info" size={20} color="#fff" />
                    <Text style={styles.detailCardButtonText}>詳細を見る</Text>
                </TouchableOpacity>
                
                {Platform.OS === 'ios' && (
                    <TouchableOpacity
                        style={styles.routeButton}
                        onPress={onRoutePress}
                    >
                        <MaterialIcons name="directions" size={20} color="#6200EA" />
                        <Text style={styles.routeButtonText}>経路</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    shopCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        padding: 16,
        height: 160,
    },
    activeShopCard: {
        borderWidth: 2,
        borderColor: '#4CAF50',
        shadowColor: '#4CAF50',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 12,
    },
    shopCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    shopCardInfo: {
        flex: 1,
        marginRight: 12,
    },
    shopNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    shopName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        lineHeight: 24,
        flex: 1,
    },
    favoriteIcon: {
        marginLeft: 8,
    },
    shopAddress: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
        lineHeight: 18,
    },
    shopDistance: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '600',
    },
    shopCardActions: {
        flexDirection: 'row',
        gap: 12,
    },
    detailCardButton: {
        flex: 1,
        backgroundColor: '#6200EA',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    detailCardButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    routeButton: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: '#6200EA',
    },
    routeButtonText: {
        color: '#6200EA',
        fontSize: 16,
        fontWeight: '600',
    },
    fullWidthButton: {
        flex: 1,
        marginRight: 0,
    },
}) 