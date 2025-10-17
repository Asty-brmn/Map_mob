import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import ImageList from '../../components/ImageList';
import { MarkerData, MarkerImage } from '../../types';

// Mock данные для демонстрации
let allMarkers: MarkerData[] = [
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
 * Экран деталей маркера
 * Показывает информацию о маркере и управляет его изображениями
 */
export default function MarkerDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [marker, setMarker] = useState<MarkerData | null>(null);
  const [images, setImages] = useState<MarkerImage[]>([]);

  /**
   * Загрузка данных маркера при монтировании компонента
   */
  useEffect(() => {
    loadMarkerData();
  }, [id]);

  /**
   * Загрузка данных маркера по ID из mock данных
   */
  const loadMarkerData = () => {
    try {
      if (!id) {
        Alert.alert('Ошибка', 'ID маркера не указан');
        router.back();
        return;
      }

      const foundMarker = allMarkers.find(m => m.id === id);
      if (foundMarker) {
        setMarker(foundMarker);
        setImages(foundMarker.images);
      } else {
        Alert.alert('Ошибка', 'Маркер не найден');
        router.back();
      }
    } catch (error) {
      console.error('Ошибка загрузки данных маркера:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить данные маркера');
    }
  };

  /**
   * Добавление нового изображения к маркеру
   * Запрашивает разрешения и открывает галерею
   */
  const handleAddImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Разрешение на доступ к галерее не предоставлено');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImage: MarkerImage = {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
          fileName: result.assets[0].fileName || undefined,
          width: result.assets[0].width,
          height: result.assets[0].height,
        };

        const updatedImages = [...images, newImage];
        updateMarkerImages(updatedImages);
        console.log('Изображение добавлено:', newImage);
      }
    } catch (error) {
      console.error('Ошибка при выборе изображения:', error);
      Alert.alert('Ошибка', 'Не удалось добавить изображение');
    }
  };

  /**
   * Удаление изображения из маркера
   */
  const handleDeleteImage = (imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    updateMarkerImages(updatedImages);
    console.log('Изображение удалено:', imageId);
  };

  /**
   * Обновление списка изображений маркера в состоянии и mock данных
   */
  const updateMarkerImages = (updatedImages: MarkerImage[]) => {
    setImages(updatedImages);

    if (marker && id) {
      const updatedMarker = { ...marker, images: updatedImages };
      setMarker(updatedMarker);
      
      // Обновление в mock данных
      const markerIndex = allMarkers.findIndex(m => m.id === id);
      if (markerIndex !== -1) {
        allMarkers[markerIndex] = updatedMarker;
      }
    }
  };

  // Отображение загрузки, если маркер еще не загружен
  if (!marker) {
    return (
      <View style={styles.container}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Заголовок с информацией о маркере */}
      <View style={styles.header}>
        <Text style={styles.title}>{marker.title}</Text>
        <Text style={styles.coordinates}>
          Широта: {marker.coordinate.latitude.toFixed(6)}
          {'\n'}
          Долгота: {marker.coordinate.longitude.toFixed(6)}
        </Text>
        <Text style={styles.createdAt}>
          Создан: {marker.createdAt.toLocaleDateString('ru-RU')}
        </Text>
      </View>

      {/* Компонент списка изображений */}
      <ImageList
        images={images}
        onAddImage={handleAddImage}
        onDeleteImage={handleDeleteImage}
        emptyText="Нет добавленных изображений"
      />

      {/* Кнопка возврата */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Назад к карте</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  coordinates: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    lineHeight: 22,
  },
  createdAt: {
    fontSize: 14,
    color: '#999',
  },
  backButton: {
    backgroundColor: '#8E8E93',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});