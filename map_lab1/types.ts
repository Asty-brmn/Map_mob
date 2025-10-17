//Интерфейс для географических координат
export interface Coordinate {
  latitude: number;
  longitude: number;
}

//Интерфейс для данных изображения маркера
export interface MarkerImage {
  id: string;
  uri: string;
  fileName?: string;
  width?: number;
  height?: number;
}

//Интерфейс для данных маркера
export interface MarkerData {
  id: string;
  title: string;
  coordinate: Coordinate;
  images: MarkerImage[];
  createdAt: Date;
}

//Тип для параметров навигации к экрану деталей маркера
export type MarkerDetailsParams = {
  id: string;
};

//Интерфейс для ошибок при выборе изображений
export interface ImagePickerError {
  code: string;
  message: string;
  exception?: any;
}

//Интерфейс для ошибок навигации

export interface NavigationError {
  route: string;
  message: string;
}

 //Типы для навигации Expo Router
export type RootStackParamList = {
  index: undefined;
  'marker/[id]': { id: string };
};