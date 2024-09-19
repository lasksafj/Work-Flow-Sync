import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    View,
    ImageBackground,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { validateToken } from '@/apis/authorize/login';
import { useAppDispatch } from '@/store/hooks';
import { userLogin } from '@/store/slices/userSlice';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function Welcome() {
    const dispatch = useAppDispatch();

    const handleButton = async () => {
        router.push('unauth/login');
    };

    useEffect(() => {
        console.log('START APP');

        async function prepare() {
            const response = await validateToken();

            if (response.status) {
                dispatch(userLogin(response.data));
                router.replace('auth');
            }
            await SplashScreen.hideAsync();
        }
        prepare();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#161622" style="light" />
            <ImageBackground
                source={require('@/assets/images/splash.jpg')} // Replace with your own image
                style={styles.backgroundImage}>
                <View style={styles.overlay}>
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>Workflow Sync</Text>
                        <Text style={styles.subtitle}>
                            Streamline your workflow and boost productivity.
                        </Text>
                        <TouchableOpacity style={styles.button} onPress={handleButton}>
                            <Text style={styles.buttonText}>Get Started</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => {
                                router.push('unauth/register');
                            }}>
                            <Text style={styles.secondaryButtonText}>Create an Account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#161622',
    },
    backgroundImage: {
        flex: 1,
        width: width,
        height: height,
        resizeMode: 'cover',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(22, 22, 34, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        paddingHorizontal: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 42,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#dcdde1',
        textAlign: 'center',
        marginBottom: 40,
    },
    button: {
        backgroundColor: '#3498db',
        paddingVertical: 15,
        paddingHorizontal: 60,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#2980b9',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButton: {
        paddingVertical: 15,
        paddingHorizontal: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#3498db',
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#3498db',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
