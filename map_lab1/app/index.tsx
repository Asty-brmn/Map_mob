import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Alert, 
  ActivityIndicator, 
  Text, 
  TouchableOpacity 
} from 'react-native';
import { useRouter } from 'expo-router';
import { MarkerData } from '../types';
import { useDatabase } from '../app/contexts/DatabaseContext';
import { Map } from '../components/Map';
import { MarkerList } from '../components/MarkerList';

const PERM_REGION = {
  latitude: 58.010455,
  longitude: 56.229443,
  latitudeDelta: 0.08,
  longitudeDelta: 0.04,
};

export default function Index() {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [isLoadingMarkers, setIsLoadingMarkers] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [showList, setShowList] = useState(false); // Переключение между картой и списком
  
  const { 
    getMarkers, 
    addMarker, 
    deleteMarker,
    isLoading: isDbLoading
  } = useDatabase();
  
  const router = useRouter();

  // Загружаем маркеры когда БД готова
  useEffect(() => {
    if (!isDbLoading) {
      loadMarkersFromDatabase();
    }
  }, [isDbLoading]);

  const loadMarkersFromDatabase = async () => {
    try {
      setIsLoadingMarkers(true);
      const markersFromDb = await getMarkers();
      setMarkers(markersFromDb);
      console.log('✅ Маркеры загружены:', markersFromDb.length);
    } catch (error) {
      console.error('❌ Ошибка загрузки маркеров:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить маркеры из базы данных');
    } finally {
      setIsLoadingMarkers(false);
    }
  };

  const handleMapLongPress = async (event: any) => {
    if (isAddingMarker) return;
    
    try {
      setIsAddingMarker(true);
      const { coordinate } = event.nativeEvent;
      
      // Сразу добавляем маркер в базу данных
      const markerId = await addMarker(coordinate.latitude, coordinate.longitude);
      
      // Создаем новый маркер для отображения
      const newMarker: MarkerData = {
        id: markerId,
        title: `Маркер ${markers.length + 1}`,
        coordinate: coordinate,
        images: [],
        created_at: new Date().toISOString()
      };
      
      // Добавляем новый маркер в состояние
      setMarkers(prev => [...prev, newMarker]);
      
    } catch (error) {
      console.error('❌ Ошибка при добавлении маркера:', error);
      Alert.alert('Ошибка', 'Не удалось добавить маркер в базу данных');
    } finally {
      setIsAddingMarker(false);
    }
  };

  const handleMarkerPress = (marker: MarkerData) => {
    setSelectedMarker(marker);
  };

  const handleShowDetails = (marker: MarkerData) => {
    try {
      router.push({
        pathname: '/marker/[id]',
        params: { id: marker.id.toString() }
      } as any);
    } catch (error) {
      console.error('❌ Ошибка навигации:', error);
      Alert.alert('Ошибка', 'Не удалось открыть детали маркера');
    }
  };

  const handleDeleteMarker = (marker: MarkerData) => {
    Alert.alert(
      'Удаление маркера',
      `Вы уверены, что хотите удалить маркер "${marker.title}"?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              // Мгновенно удаляем маркер из интерфейса
              setMarkers(prev => prev.filter(m => m.id !== marker.id));
              setSelectedMarker(null);
              
              // Удаляем из базы данных
              await deleteMarker(marker.id);
              console.log('✅ Маркер удален, ID:', marker.id);
              
            } catch (error) {
              console.error('❌ Ошибка при удалении маркера:', error);
              // Восстанавливаем данные из базы в случае ошибки
              await loadMarkersFromDatabase();
              Alert.alert('Ошибка', 'Не удалось удалить маркер');
            }
          },
        },
      ]
    );
  };

  const toggleView = () => {
    setShowList(!showList);
  };

  // Показываем загрузку пока БД не готова
  if (isDbLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#bd70f0ff" />
        <Text style={styles.loadingText}>Инициализация базы данных...</Text>
      </View>
    );
  }

  // Показываем загрузку маркеров
  if (isLoadingMarkers) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#bd70f0ff" />
        <Text style={styles.loadingText}>Загрузка маркеров...</Text>
        <Text style={styles.loadingSubtext}>Найдено маркеров: {markers.length}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showList ? (
        <MarkerList
          markers={markers}
          selectedMarker={selectedMarker}
          onMarkerSelect={handleMarkerPress}
          onMarkerDelete={handleDeleteMarker}
          onShowDetails={handleShowDetails}
        />
      ) : (
        <Map
          markers={markers}
          initialRegion={PERM_REGION}
          onMapLongPress={handleMapLongPress}
          onMarkerPress={handleMarkerPress}
          isAddingMarker={isAddingMarker}
        />
      )}
      
      {/* Панель управления */}
      <View style={styles.controlsContainer}>
        <View style={styles.infoPanel}>
          <Text style={styles.infoText}>
            Маркеров: {markers.length}
          </Text>
          <Text style={styles.hintText}>
            {showList ? '📋 Список маркеров' : '🗺️ Карта'}
          </Text>
          {isAddingMarker && (
            <Text style={styles.addingText}>
              ⏳ Добавляем маркер...
            </Text>
          )}
        </View>
        
        <View style={styles.buttonsPanel}>
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={toggleView}
          >
            <Text style={styles.toggleButtonText}>
              {showList ? '🗺️ Карта' : '📋 Список'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={loadMarkersFromDatabase}
          >
            <Text style={styles.refreshButtonText}>🔄</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Панель управления выбранным маркером */}
      {selectedMarker && !showList && (
        <View style={styles.markerControls}>
          <Text style={styles.selectedMarkerText}>
            Выбран: {selectedMarker.title}
          </Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={styles.detailsButton}
              onPress={() => handleShowDetails(selectedMarker)}
            >
              <Text style={styles.buttonText}>📋 Детали</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => handleDeleteMarker(selectedMarker)}
            >
              <Text style={styles.buttonText}>🗑️ Удалить</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  controlsContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoPanel: {
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  hintText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  addingText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: 'bold',
    marginTop: 2,
  },
  buttonsPanel: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  refreshButton: {
    backgroundColor: '#666',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  markerControls: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  selectedMarkerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});