import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState('');

    const handleSubmit = async () => {
        router.push('auth');
    };
    return (
        <View style={styles.container}>
            <Text style={styles.text}>login</Text>
            <TextInput
                style={{ padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 10 }}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={{ padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 10 }}
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