import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MarkerImage } from '../types';

// Пропсы для компонента списка изображений
interface ImageListProps {
  images: MarkerImage[];
  onAddImage: () => void;
  onDeleteImage: (imageId: string) => void;
  emptyText?: string;
}

/**
 * Компонент для отображения горизонтального списка изображений
 * с возможностью добавления и удаления
 */
export default function ImageList({
  images,
  onAddImage,
  onDeleteImage,
  emptyText = 'Нет добавленных изображений',
}: ImageListProps) {
  
  /**
   * Обработчик удаления изображения с подтверждением
   */
  const handleDeletePress = (imageId: string) => {
    Alert.alert(
      'Удаление изображения',
      'Вы уверены, что хотите удалить это изображение?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => onDeleteImage(imageId),
        },
      ]
    );
  };

  /**
   * Рендер отдельного элемента изображения в списке
   */
  const renderImageItem = ({ item }: { item: MarkerImage }) => (
    <View style={styles.imageItem}>
      <Image source={{ uri: item.uri }} style={styles.image} />
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeletePress(item.id)}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Изображения ({images.length})</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAddImage}>
          <Text style={styles.addButtonText}>+ Добавить</Text>
        </TouchableOpacity>
      </View>

      {images.length === 0 ? (
        <Text style={styles.emptyText}>{emptyText}</Text>
      ) : (
        <FlatList
          data={images}
          renderItem={renderImageItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imagesList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#ffa7a7ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    padding: 20,
  },
  imagesList: {
    paddingRight: 16,
  },
  imageItem: {
    marginRight: 12,
    position: 'relative',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#bea3f4ff',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});