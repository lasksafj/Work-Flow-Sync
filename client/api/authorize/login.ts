import { Credentials, User } from "@/models/User";
import axios, { AxiosInstance } from "axios";

import { hostDomain } from '@/config/config'
import AsyncStorage from "@react-native-async-storage/async-storage";

const loginLocal = async (email: string, password: string) => {
    try {
        let response = await axios.post(
            hostDomain + '/api/token/',
            {
                username: email,
                password: password
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
        const response = await axios.post(hostDomain + '/api/token/refresh/', { refresh: refresh });
        await AsyncStorage.setItem('accessToken', response.data.access);
        await AsyncStorage.setItem('refreshToken', response.data.refresh);
        return response.data;
    } catch (error) {
        console.error('getNewAccessToken:', error);
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
        const response = await axios.post(hostDomain + '/api/token/verify/', { token: access });
        return response;  // Access token is still valid
    } catch (err) {
        console.log('validateToken errrr', err);
        // Access token is not valid, try to refresh it
        const newToken = await getNewAccessToken();
        if (newToken == null) {
            return { status: false, data: null };
        }
        try {
            return await axios.post(hostDomain + '/api/token/verify/', { token: newToken.access });
        }
        catch (err) {
            console.log('validateToken retry errrr', err);
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