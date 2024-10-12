import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import api from '@/apis/api';
import { logout } from '@/apis/authorize/login';
import { useAppDispatch } from '@/store/hooks';
import { userLogout } from '@/store/slices/userSlice';
import { router } from 'expo-router';

const DashboardScreen = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        api.get('/api/user/protected?number=123987')
            .then((res) => {
                console.log('dashboard api get -----', res.data);
            })
            .catch(err => {
                console.log('dashboard api err----', err);
                if (err.unauthorized) {
                    alert('LOGOUT')
                    router.replace('');
                    logout();
                    dispatch(userLogout());
                }
            })
    }, []);

    return (
        <View>
            <Text>dashboard</Text>
            <TouchableOpacity 
                style={styles.button} 
                onPress={() => {
                    router.push('auth/dashboard/ClockInOutScreen');
                }}
            >
                <Text style={styles.buttonText}>Clock in/out</Text>
            </TouchableOpacity>
        </View>
        
    )
}

export default DashboardScreen

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
})