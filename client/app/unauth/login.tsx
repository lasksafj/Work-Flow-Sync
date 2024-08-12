import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router';
import { loginLocal } from '@/apis/authorize/login';
import { userLogin } from '@/store/slices/userSlice';
import { useAppDispatch } from '@/store/hooks';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useAppDispatch()

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            let response = await loginLocal(email.trim(), password);
            // console.log('login screen', response);

            if (response.status) {
                dispatch(userLogin(response.data))
                router.push('auth');
            }
        }
        catch (err) {
            console.log('login screen failed', err);
        }
        setIsLoading(false);

    };
    return (
        <View style={styles.container}>
            <Text style={styles.text}>login</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.textInput}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {isLoading ? (
                <ActivityIndicator size="small" color="#0000ff" />
            ) : (
                <Button title="Login" onPress={handleSubmit} />
            )}
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        width: 200
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 5,
    },
});