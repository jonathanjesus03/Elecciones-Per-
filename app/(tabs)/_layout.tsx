import { Tabs } from 'expo-router';
import { Calendar, FileText, Home, ShieldCheck, Vote } from 'lucide-react-native';
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#8B1538', // Rojo vino formal
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
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="voting"
        options={{
          title: 'Mi Voto',
          tabBarIcon: ({ color }) => <Vote size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendario',
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="myrole"
        options={{
          title: 'Mi Rol',
          tabBarIcon: ({ color }) => <ShieldCheck size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="parties"
        options={{
          title: 'Partidos',
          tabBarIcon: ({ color }) => <FileText size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}