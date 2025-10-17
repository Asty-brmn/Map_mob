import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import MapView, { Marker, LongPressEvent } from 'react-native-maps';
import { MarkerData } from '../types';

// Пропсы для компонента карты
interface MapProps {
  markers: MarkerData[];
  onMarkerPress: (marker: MarkerData) => void;
  onMapLongPress: (coordinate: { latitude: number; longitude: number }) => void;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

// Регион по умолчанию (Пермь)
const defaultRegion = {
  latitude: 58.010455,
  longitude: 56.229443,
  latitudeDelta: 0.08,
  longitudeDelta: 0.04,
};

/**
 * Компонент карты для отображения маркеров
 * Обрабатывает долгие нажатия для создания новых маркеров
 * и нажатия на существующие маркеры для перехода к деталям
 */
export default function Map({
  markers,
  onMarkerPress,
  onMapLongPress,
  initialRegion = defaultRegion,
}: MapProps) {
  
  /**
   * Обработчик долгого нажатия на карту
   * Передает координаты в родительский компонент
   */
  const handleLongPress = (e: LongPressEvent) => {
    try {
      const { coordinate } = e.nativeEvent;
      onMapLongPress(coordinate);
    } catch (error) {
      console.error('Ошибка при обработке long press:', error);
      Alert.alert('Ошибка', 'Не удалось обработать длинное нажатие');
    }
  };

  /**
   * Обработчик нажатия на маркер
   * Передает данные маркера в родительский компонент
   */
  const handleMarkerPress = (marker: MarkerData) => {
    try {
      onMarkerPress(marker);
    } catch (error) {
      console.error('Ошибка при нажатии на маркер:', error);
      Alert.alert('Ошибка', 'Не удалось обработать нажатие на маркер');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        onLongPress={handleLongPress}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description="Нажмите для деталей"
            onPress={() => handleMarkerPress(marker)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});