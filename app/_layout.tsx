import AsyncStorage from '@react-native-async-storage/async-storage';
import { SplashScreen, Stack, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

// Prevenir que la pantalla de splash se oculte automáticamente
SplashScreen.preventAutoHideAsync();

const STORAGE_KEY = '@isOnboarded';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    // 1. Revisar si el usuario ya hizo el onboarding
    async function checkOnboarding() {
      try {
        // Simula tu splash screen de 2-3 segundos
        await new Promise(resolve => setTimeout(resolve, 2500)); 

        const value = await AsyncStorage.getItem(STORAGE_KEY);
        if (value === 'true') {
          setIsOnboarded(true);
        }
      } catch (e) {
        console.error("Error leyendo estado de onboarding", e);
      } finally {
        setIsLoading(false);
      }
    }

    checkOnboarding();
  }, []);

  useEffect(() => {
    if (isLoading) {
      return; // No hacer nada mientras carga
    }

    // 2. Ocultar la pantalla de splash
    SplashScreen.hideAsync();

    // 3. Redirigir al usuario
    if (isOnboarded) {
      // Si ya hizo onboarding, llévalo a las tabs
      router.replace('/(onboarding)/welcome');
    } else {
      // Si no, llévalo al inicio del onboarding
      router.replace('/(onboarding)/welcome');
    }
  }, [isLoading, isOnboarded]);

  // Mientras carga, puedes mostrar tu propio Splash Screen si quieres
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  // Define las "raíces" de navegación de tu app.
  return (
    <Stack>
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}