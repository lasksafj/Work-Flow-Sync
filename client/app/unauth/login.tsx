import React, { useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { router } from 'expo-router';
import { loginLocal } from '@/apis/authorize/login';
import { userLogin } from '@/store/slices/userSlice';
import { useAppDispatch } from '@/store/hooks';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            let response = await loginLocal(email.trim(), password);

            if (response.status) {
                dispatch(userLogin(response.data));
                router.push('auth');
            }
        } catch (err) {
            console.log('login screen failed', err);
        }
        setIsLoading(false);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Welcome Back!</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor="#7f8c8d"
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#7f8c8d"
                />
                {isLoading ? (
                    <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                )}
                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => router.replace('unauth/register')}>
                        <Text style={styles.registerButtonText}> Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
    },
    innerContainer: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'center',
    },
    textInput: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#dcdde1',
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#2f3640',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 50,
        color: '#2f3640',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#3498db',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#2980b9',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loader: {
        marginVertical: 20,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    registerText: {
        fontSize: 16,
        color: '#7f8c8d',
    },
    registerButtonText: {
        fontSize: 16,
        color: '#3498db',
        fontWeight: 'bold',
    },
});
