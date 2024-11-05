import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { store } from '@/store/store'
import { Provider } from 'react-redux'
// import * as Notifications from 'expo-notifications';

import '@/utils/notificationHandler'; // Import the handler module



export default function RootLayout() {


    // useEffect(() => {
    //     Notifications.requestPermissionsAsync();
    // }, []);

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

