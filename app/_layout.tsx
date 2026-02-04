import { useEffect, useState } from 'react';
import { Stack, Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useAuthStore } from '@/stores/authStore';
import { View } from 'react-native';

export default function RootLayout() {
  useFrameworkReady();
  const [ready, setReady] = useState(false);
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (!fontsLoaded) return;
    
    // Set ready state to true after initial render
    setReady(true);
  }, [fontsLoaded]);

  useEffect(() => {
    if (!ready) return;
    
    // Only redirect after the component is fully mounted
    const inAuthGroup = segments[0] === '(auth)';
    
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(app)/(tabs)');
    }
  }, [ready, isAuthenticated, segments]);

  if (!fontsLoaded || !ready) {
    return <View />;
  }

  return (
    <>
      <Slot />
      <StatusBar style="auto" />
    </>
  );
}