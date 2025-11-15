import { Tabs } from 'expo-router';
import { Calendar, Home } from 'lucide-react-native'; // Importamos los íconos nativos
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#B91C1C', // Rojo peruano formal
        tabBarInactiveTintColor: '#9CA3AF', // Gris suave
        tabBarStyle: {
          backgroundColor: '#FFFFFF', // Fondo blanco limpio
          borderTopColor: '#E5E7EB', // Borde gris claro
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index" // Este es el archivo index.tsx
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar" // Este es el archivo calendar.tsx
        options={{
          title: 'Calendario',
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}