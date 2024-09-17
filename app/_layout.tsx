import 'react-native-get-random-values';
import 'react-native-reanimated';
import Realm from "realm";
import SyncService from '../components/SyncService';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { lightTheme, darkTheme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';

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