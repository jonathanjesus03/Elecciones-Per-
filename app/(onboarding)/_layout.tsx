import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  // Define que todas las pantallas en (onboarding) son un Stack
  // y oculta el header (título) por defecto
  return <Stack screenOptions={{ headerShown: false }} />;
}