import React, { useState } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Map from '../components/Map';
import MarkerList from '../components/MarkerList';
import { MarkerData } from '../types';

// Начальные маркеры для демонстрации
const initialMarkers: MarkerData[] = [
  {
    id: '1',
    title: 'Пермь, центр',
    coordinate: {
      latitude: 58.010455,
      longitude: 56.229443,
    },
    images: [],
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Пермь, точка 2',
    coordinate: {
      latitude: 58.010475,
      longitude: 56.229963,
    },
    images: [],
    createdAt: new Date(),
  },
];

/**
 * Главный экран приложения - Карта маркеров
 * Содержит карту и список маркеров
 * Управляет состоянием маркеров и навигацией
 */
export default function Index() {
  const [markers, setMarkers] = useState<MarkerData[]>(initialMarkers);
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('map');
  const router = useRouter();

  /**
   * Обработчик создания нового маркера по долгому нажатию на карту
   */
  const handleMapLongPress = (coordinate: { latitude: number; longitude: number }) => {
    try {
      const newMarker: MarkerData = {
        id: Date.now().toString(),
        title: `Маркер ${markers.length + 1}`,
        coordinate: {
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
        },
        images: [],
        createdAt: new Date(),
      };

      setMarkers(prevMarkers => [...prevMarkers, newMarker]);
      console.log('Новый маркер добавлен:', newMarker);
    } catch (error) {
      console.error('Ошибка при добавлении маркера:', error);
      Alert.alert('Ошибка', 'Не удалось добавить маркер');
    }
  };

  /**
   * Обработчик нажатия на маркер для перехода к деталям
   */
  const handleMarkerPress = (marker: MarkerData) => {
    try {
      router.push({
        pathname: '/marker/[id]',
        params: { id: marker.id }
      });
    } catch (error) {
      console.error('Ошибка навигации:', error);
      Alert.alert('Ошибка', 'Не удалось открыть детали маркера');
    }
  };

  return (
    <View style={styles.container}>
      {/* Переключатель между картой и списком */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'map' && styles.activeTab]}
          onPress={() => setActiveTab('map')}
        >
          <Text style={[styles.tabText, activeTab === 'map' && styles.activeTabText]}>
            🗺️ Карта
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'list' && styles.activeTab]}
          onPress={() => setActiveTab('list')}
        >
          <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>
            📋 Список
          </Text>
        </TouchableOpacity>
      </View>

      {/* Отображение активного компонента */}
      {activeTab === 'map' ? (
        <Map
          markers={markers}
          onMarkerPress={handleMarkerPress}
          onMapLongPress={handleMapLongPress}
        />
      ) : (
        <MarkerList
          markers={markers}
          onMarkerPress={handleMarkerPress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#71a7e0ff',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
});