import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import api from '@/apis/api';

const DashboardScreen = () => {
    try {
        api.get('/api/user/protected?number=123987')
            .then((res) => {
                console.log('dashboard api get -----', res.data);
            })
            .catch(err => {
                console.log('dashboard api err----', err);

            })
    }
    catch (err) {
        console.log(err);
    }

    return (
        <View>
            <Text>dashboard</Text>
        </View>
    )
}

export default DashboardScreen

const styles = StyleSheet.create({})