import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, LongPressEvent } from 'react-native-maps';
import { MarkerData } from '../types';

interface MapProps {
  markers: MarkerData[];
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  onMapLongPress: (event: LongPressEvent) => void;
  onMarkerPress: (marker: MarkerData) => void;
  isAddingMarker?: boolean;
}

export const Map: React.FC<MapProps> = ({
  markers,
  initialRegion,
  onMapLongPress,
  onMarkerPress,
  isAddingMarker = false
}) => {
  const renderMarkers = () => {
    return markers.map((marker) => (
      <Marker
        key={marker.id}
        coordinate={marker.coordinate}
        title={marker.title}
        description={`Нажмите для выбора`}
        onPress={() => onMarkerPress(marker)}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        onLongPress={isAddingMarker ? undefined : onMapLongPress}
      >
        {renderMarkers()}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});