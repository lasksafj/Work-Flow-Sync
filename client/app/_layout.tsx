import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';


import { store } from '@/store/store'
import { Provider } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export default function RootLayout() {
    // const colorScheme = useColorScheme();
    // const [loaded] = useFonts({
    //   SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    // });

    // useEffect(() => {
    //   if (loaded) {
    //     SplashScreen.hideAsync();
    //   }
    // }, [loaded]);

    // if (!loaded) {
    //   return null;
    // }

    useEffect(() => {
        Notifications.requestPermissionsAsync();
    }, []);

    return (
        <Provider store={store}>
            <ThemeProvider value={DefaultTheme}>
                <Stack>
                    <Stack.Screen name='index' options={{ headerShown: false }} />
                    <Stack.Screen name="auth" options={{ headerShown: false }} />
                    <Stack.Screen name='unauth' options={{ headerShown: false }} />

                </Stack>
            </ThemeProvider>
        </Provider>

    );
}

