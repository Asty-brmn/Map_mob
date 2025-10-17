import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MarkerData } from '../types';

// Пропсы для компонента списка маркеров
interface MarkerListProps {
  markers: MarkerData[];
  onMarkerPress: (marker: MarkerData) => void;
  emptyText?: string;
}

/**
 * Компонент для отображения списка маркеров в виде текстового списка
 * Альтернативный способ навигации помимо карты
 */
export default function MarkerList({
  markers,
  onMarkerPress,
  emptyText = 'Нет созданных маркеров',
}: MarkerListProps) {
  
  /**
   * Обработчик нажатия на элемент списка маркеров
   */
  const handleMarkerItemPress = (marker: MarkerData) => {
    try {
      onMarkerPress(marker);
    } catch (error) {
      console.error('Ошибка при нажатии на маркер в списке:', error);
      Alert.alert('Ошибка', 'Не удалось открыть детали маркера');
    }
  };

  /**
   * Рендер отдельного элемента маркера в списке
   */
  const renderMarkerItem = ({ item }: { item: MarkerData }) => (
    <TouchableOpacity
      style={styles.markerItem}
      onPress={() => handleMarkerItemPress(item)}
    >
      <Text style={styles.markerTitle}>{item.title}</Text>
      <Text style={styles.markerCoordinates}>
        {item.coordinate.latitude.toFixed(6)}, {item.coordinate.longitude.toFixed(6)}
      </Text>
      <Text style={styles.markerDate}>
        Создан: {item.createdAt.toLocaleDateString('ru-RU')}
      </Text>
      <Text style={styles.markerImages}>
        Изображений: {item.images.length}
      </Text>
    </TouchableOpacity>
  );

  if (markers.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyText}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Список маркеров ({markers.length})</Text>
      <FlatList
        data={markers}
        renderItem={renderMarkerItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  listContent: {
    paddingBottom: 16,
  },
  markerItem: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#71a7e0ff',
  },
  markerTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  markerCoordinates: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  markerDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  markerImages: {
    fontSize: 12,
    color: '#ffa7a7ff',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    fontSize: 16,
  },
});