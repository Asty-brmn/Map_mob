import { Stack } from "expo-router";
import { DatabaseProvider } from '../app/contexts/DatabaseContext';

/**
 * Настраивает навигацию и предоставляет контексты
 */
export default function RootLayout() {
  return (
    <DatabaseProvider>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Карта маркеров',
            headerStyle: {
              backgroundColor: '#bd70f0ff',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} 
        />
        
        <Stack.Screen 
          name="marker/[id]" 
          options={{ 
            title: 'Детали маркера',
            headerStyle: {
              backgroundColor: '#71a7e0ff',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} 
        />
      </Stack>
    </DatabaseProvider>
  );
}