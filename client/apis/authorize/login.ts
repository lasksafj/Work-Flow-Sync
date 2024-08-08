import { Credentials, User } from "@/models/User";
import axios, { AxiosInstance } from "axios";

import { hostDomain } from '@/.config/config'
import AsyncStorage from "@react-native-async-storage/async-storage";

const loginLocal = async (email: string, password: string) => {
    try {
        let response = await axios.post(
            hostDomain + '/api/user/login',
            {
                email: email,
                password: password
            },
            {
                timeout: 5000
            }
        );
        await AsyncStorage.setItem('accessToken', response.data.access);
        await AsyncStorage.setItem('refreshToken', response.data.refresh);
        return response;
    }
    catch (err: any) {
        console.log("Login failed", err);
        return { status: false, data: null }
    }
}

const getNewAccessToken = async () => {
    try {
        let refresh = await AsyncStorage.getItem('refreshToken');
        const response = await axios.post(
            hostDomain + '/api/user/refresh-token/',
            {
                refresh: refresh
            },
            {
                timeout: 5000
            }
        );
        await AsyncStorage.setItem('accessToken', response.data.access);
        await AsyncStorage.setItem('refreshToken', response.data.refresh);
        return response.data;
    } catch (error) {
        console.log('getNewAccessToken:', error);
        return null;
    }
};

const validateToken = async () => {
    const access = await AsyncStorage.getItem('accessToken');
    const refresh = await AsyncStorage.getItem('refreshToken');

    if (!refresh) {
        return { status: false, data: null };  // No refresh token available, user must log in
    }

    try {
        const response = await axios.post(
            hostDomain + '/api/user/verify/',
            {},
            {
                headers: { Authorization: `Bearer ${access}` },
                timeout: 5000
            }
        );
        return response;  // Access token is still valid
    } catch (err) {
        console.log('validateToken ERROR', err);
        // Access token is not valid, try to refresh it
        console.log('validateToken: try to refresh Token');

        const newToken = await getNewAccessToken();
        if (newToken == null) {
            return { status: false, data: null };
        }
        try {
            return await axios.post(
                hostDomain + '/api/user/verify/',
                {},
                { headers: { Authorization: `Bearer ${newToken.access}` } }
            );
        }
        catch (err) {
            console.log('validateToken retry ERROR', err);
            return { status: false, data: null };
        }
    }
};


const logout = async () => {
    await AsyncStorage.setItem('accessToken', '');
    await AsyncStorage.setItem('refreshToken', '');
}

export {
    loginLocal,
    logout,
    getNewAccessToken,
    validateToken,
}