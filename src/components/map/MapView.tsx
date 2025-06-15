import React from 'react'
import { Platform, StyleSheet } from 'react-native'
import { AppleMaps, GoogleMaps } from 'expo-maps'
import { ShopMarker, CameraPosition } from '../../types/map'

interface MapViewProps {
    cameraPosition: CameraPosition | null
    markers: ShopMarker[]
    onMarkerClick: (event: any) => void
    mapRef: React.RefObject<any>
    errorMsg: string | null
}

export const MapView: React.FC<MapViewProps> = ({
    cameraPosition,
    markers,
    onMarkerClick,
    mapRef,
    errorMsg
}) => {
    const MapComponent = Platform.OS === 'ios' ? AppleMaps.View : GoogleMaps.View

    if (!cameraPosition) {
        return null
    }

    return (
        <MapComponent
            ref={mapRef}
            style={styles.map}
            cameraPosition={cameraPosition}
            markers={markers}
            onMarkerClick={onMarkerClick}
            properties={Platform.OS === 'android' ? {
                isMyLocationEnabled: !errorMsg
            } : undefined}
            uiSettings={{
                myLocationButtonEnabled: !errorMsg
            }}
        />
    )
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
}) 