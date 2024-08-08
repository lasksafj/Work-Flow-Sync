import { hostDomain } from "@/.config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { getNewAccessToken, logout, validateToken } from "./authorize/login";
import { router } from "expo-router";

const api = axios.create({
    baseURL: hostDomain,
    timeout: 5000
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('accessToken');

        // config for ngrok: bypass warning page
        config.headers['ngrok-skip-browser-warning'] = '69420';

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        // If the response is successful, just return the response
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        // If the response has an error status code
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access
            const res = await getNewAccessToken();
            if (res) {
                // originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
                return api(originalRequest);
            }
            alert('Unauthorized access. Please log in.');
            error.unauthorized = true;

            router.replace('');
            logout();
        }
        // Return the error to be handled by the calling code
        return Promise.reject(error);
    }
);

export default api;