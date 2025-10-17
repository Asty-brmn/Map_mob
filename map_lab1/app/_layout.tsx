import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* Главный экран с картой */}
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
      
      {/* экран деталей маркера - заголовок динамический */}
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
  );
}