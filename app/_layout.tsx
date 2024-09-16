import 'react-native-get-random-values';
import { useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import { lightTheme, darkTheme } from '@/constants/theme';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { healthCheck, createObject } from '@/services/apiService';
import { realm } from '@/services/realmDB';
import Realm from "realm";
import SyncService from '../components/SyncService';

// Ensure global Realm usage is disabled
Realm.flags.THROW_ON_GLOBAL_REALM = true;

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const styledTheme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <StyledThemeProvider theme={styledTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <SyncService />
    </StyledThemeProvider>
  );
}