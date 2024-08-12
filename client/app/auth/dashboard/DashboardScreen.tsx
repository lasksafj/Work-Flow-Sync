import { StyleSheet, Text, View } from 'react-native'
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
        </View>
    )
}

export default DashboardScreen

const styles = StyleSheet.create({})