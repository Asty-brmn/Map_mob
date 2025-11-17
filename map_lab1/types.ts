// types.ts
/**
 * Файл определения TypeScript интерфейсов для приложения карты маркеров
 */

/**
 * Интерфейс для географических координат
 */
export interface Coordinate {
  latitude: number;
  longitude: number;
}

/**
 * Интерфейс для данных изображения маркера
 */
export interface MarkerImage {
  id: number;
  marker_id: number;
  uri: string;
  created_at: string;
}

/**
 * Интерфейс для данных маркера
 */
export interface MarkerData {
  id: number;
  title: string;
  coordinate: Coordinate;
  images: MarkerImage[];
  created_at: string;
}

/**
 * Тип для параметров навигации к экрану деталей маркера
 */
export type MarkerDetailsParams = {
  id: string;
};

/**
 * Интерфейс для ошибок при выборе изображений
 */
export interface ImagePickerError {
  code: string;
  message: string;
  exception?: any;
}

/**
 * Интерфейс для ошибок навигации
 */
export interface NavigationError {
  route: string;
  message: string;
}

/**
 * Интерфейс для ошибок базы данных
 */
export interface DatabaseError {
  code: string;
  message: string;
  sql?: string;
  exception?: any;
}

/**
 * Типы для навигации Expo Router
 */
export type RootStackParamList = {
  index: undefined;
  'marker/[id]': { id: string };
};

/**
 * Интерфейс контекста базы данных
 */
export interface DatabaseContextType {
  // Операции с маркерами
  addMarker: (latitude: number, longitude: number, title?: string) => Promise<number>;
  deleteMarker: (id: number) => Promise<void>;
  getMarkers: () => Promise<MarkerData[]>;
  getMarker: (id: number) => Promise<MarkerData | null>;
  
  // Операции с изображениями
  addImage: (markerId: number, uri: string) => Promise<number>;
  deleteImage: (id: number) => Promise<void>;
  getMarkerImages: (markerId: number) => Promise<MarkerImage[]>;
  
  // Статусы
  isLoading: boolean;
  error: DatabaseError | null;
  initializeDatabase: () => Promise<void>;
}