import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { databaseService } from '../database/sqlite';
import { DatabaseContextType, MarkerData, MarkerImage, DatabaseError } from '../../types';

/**
 * Создание контекста базы данных
 */
const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

/**
 * Провайдер контекста базы данных
 * Обеспечивает доступ к операциям с базой данных во всем приложении
 */
export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<DatabaseError | null>(null);

  /**
   * Инициализация базы данных при монтировании компонента
   */
  useEffect(() => {
    console.log('🏁 DatabaseProvider mounted - initializing database');
    initializeDatabase();
    
    // Очистка при размонтировании
    return () => {
      console.log('🧹 DatabaseProvider unmounted - closing database');
      databaseService.close();
    };
  }, []);

  /**
   * Инициализация базы данных
   */
  const initializeDatabase = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🚀 Starting database initialization...');
      await databaseService.initialize();
      console.log('🎊 Database initialization completed successfully');
    } catch (err) {
      const dbError: DatabaseError = {
        code: 'INIT_FAILED',
        message: 'Не удалось инициализировать базу данных',
        exception: err
      };
      setError(dbError);
      console.error('💥 Database initialization failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Добавление нового маркера
   */
  const addMarker = async (latitude: number, longitude: number, title?: string): Promise<number> => {
    try {
      setError(null);
      console.log(`📍 Adding marker at ${latitude}, ${longitude}`);
      const markerId = await databaseService.addMarker(latitude, longitude, title);
      return markerId;
    } catch (err) {
      const dbError: DatabaseError = {
        code: 'ADD_MARKER_FAILED',
        message: 'Не удалось добавить маркер',
        exception: err
      };
      setError(dbError);
      throw err;
    }
  };

  /**
   * Удаление маркера
   */
  const deleteMarker = async (id: number): Promise<void> => {
    try {
      setError(null);
      console.log(`🗑️ Deleting marker ${id}`);
      await databaseService.deleteMarker(id);
    } catch (err) {
      const dbError: DatabaseError = {
        code: 'DELETE_MARKER_FAILED',
        message: 'Не удалось удалить маркер',
        exception: err
      };
      setError(dbError);
      throw err;
    }
  };

  /**
   * Получение всех маркеров
   */
  const getMarkers = async (): Promise<MarkerData[]> => {
    try {
      setError(null);
      console.log('📥 Fetching all markers from database');
      const markers = await databaseService.getMarkers();
      
      // Загружаем изображения для каждого маркера
      console.log('🖼️ Loading images for markers');
      const markersWithImages = await Promise.all(
        markers.map(async (marker) => {
          const images = await databaseService.getMarkerImages(marker.id);
          return {
            ...marker,
            images
          };
        })
      );
      
      console.log(`✅ Successfully loaded ${markersWithImages.length} markers with images`);
      return markersWithImages;
    } catch (err) {
      const dbError: DatabaseError = {
        code: 'GET_MARKERS_FAILED',
        message: 'Не удалось загрузить маркеры',
        exception: err
      };
      setError(dbError);
      console.error('❌ Failed to get markers:', err);
      throw err;
    }
  };

  /**
   * Получение маркера по ID
   */
  const getMarker = async (id: number): Promise<MarkerData | null> => {
    try {
      setError(null);
      console.log(`🔍 Fetching marker ${id}`);
      const marker = await databaseService.getMarker(id);
      
      if (marker) {
        const images = await databaseService.getMarkerImages(id);
        return {
          ...marker,
          images
        };
      }
      
      return null;
    } catch (err) {
      const dbError: DatabaseError = {
        code: 'GET_MARKER_FAILED',
        message: 'Не удалось загрузить маркер',
        exception: err
      };
      setError(dbError);
      throw err;
    }
  };

  /**
   * Добавление изображения к маркеру
   */
  const addImage = async (markerId: number, uri: string): Promise<number> => {
    try {
      setError(null);
      console.log(`🖼️ Adding image to marker ${markerId}`);
      const imageId = await databaseService.addImage(markerId, uri);
      return imageId;
    } catch (err) {
      const dbError: DatabaseError = {
        code: 'ADD_IMAGE_FAILED',
        message: 'Не удалось добавить изображение',
        exception: err
      };
      setError(dbError);
      throw err;
    }
  };

  /**
   * Удаление изображения
   */
  const deleteImage = async (id: number): Promise<void> => {
    try {
      setError(null);
      console.log(`🗑️ Deleting image ${id}`);
      await databaseService.deleteImage(id);
    } catch (err) {
      const dbError: DatabaseError = {
        code: 'DELETE_IMAGE_FAILED',
        message: 'Не удалось удалить изображение',
        exception: err
      };
      setError(dbError);
      throw err;
    }
  };

  /**
   * Получение изображений маркера
   */
  const getMarkerImages = async (markerId: number): Promise<MarkerImage[]> => {
    try {
      setError(null);
      return await databaseService.getMarkerImages(markerId);
    } catch (err) {
      const dbError: DatabaseError = {
        code: 'GET_IMAGES_FAILED',
        message: 'Не удалось загрузить изображения',
        exception: err
      };
      setError(dbError);
      throw err;
    }
  };

  /**
   * Значение контекста
   */
  const contextValue: DatabaseContextType = {
    // Операции с маркерами
    addMarker,
    deleteMarker,
    getMarkers,
    getMarker,
    
    // Операции с изображениями
    addImage,
    deleteImage,
    getMarkerImages,
    
    // Статусы
    isLoading,
    error,
    initializeDatabase
  };

  return (
    <DatabaseContext.Provider value={contextValue}>
      {children}
    </DatabaseContext.Provider>
  );
};

/**
 * Хук для использования контекста базы данных
 */
export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};