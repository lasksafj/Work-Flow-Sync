// api.js

import axios from 'axios';
import { hostDomain } from '../.config/config';
import { getNewAccessToken, logout } from './authorize/login';

// Create an axios instance with baseURL and timeout
const api = axios.create({
    baseURL: hostDomain,
    timeout: 5000,
    withCredentials: true,
});

// Request interceptor to attach token to headers
api.interceptors.request.use(
    (config) => {
        // Config for ngrok: bypass warning page
        config.headers['ngrok-skip-browser-warning'] = '69420';
        config.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle unauthorized responses
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401) {
            const res = await getNewAccessToken();
            if (res) {
                return api(originalRequest);
            }
            alert('Unauthorized access. Please log in.');
            logout();
            window.location.href = '/login'; // Adjust the path as needed
        }
        return Promise.reject(error);
    }
);

export default api;
