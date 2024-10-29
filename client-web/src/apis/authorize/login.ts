// login.js

import axios from "axios";
import { hostDomain } from '../../.config/config';
// import Cookies from 'js-cookie';

// const setAccessToken = (accessToken: string) => {
//     Cookies.set('accessToken', accessToken, {
//         expires: 1, // Set the cookie to expire in 1 day
//         secure: true, // Only allow the cookie to be sent over HTTPS
//         sameSite: 'Strict', // Prevent cross-site request forgery (CSRF)
//         path: '/', // Available throughout the entire site,
//         // domain: hostDomain
//     });
// }

// const setRefreshToken = (refreshToken: string) => {
//     Cookies.set('refreshToken', refreshToken, {
//         expires: 1, // Set the cookie to expire in 1 day
//         secure: true, // Only allow the cookie to be sent over HTTPS
//         sameSite: 'Strict', // Prevent cross-site request forgery (CSRF)
//         path: '/', // Available throughout the entire site
//         // domain: hostDomain
//     });
// }

// Function to handle user login
const loginLocal = async (email: string, password: string) => {
    try {
        const response = await axios.post(
            `${hostDomain}/api/user/login`,
            { email, password, client: 'web' },
            { timeout: 5000, withCredentials: true }
        );

        return response;
    } catch (err) {
        console.log("Login failed", err);
        return { status: false, data: null };
    }
};

// Function to retrieve a new access token using the refresh token
const getNewAccessToken = async () => {
    try {
        const response = await axios.post(
            `${hostDomain}/api/user/refresh-token/`,
            { client: 'web' },
            { timeout: 5000, withCredentials: true }
        );

        return response.data;
    } catch (error) {
        console.log('getNewAccessToken:', error);
        return null;
    }
};

// Function to validate the current access token
const validateToken = async () => {
    try {
        const response = await axios.post(
            `${hostDomain}/api/user/verify/`,
            { client: 'web' },
            {
                withCredentials: true,
                timeout: 5000
            }
        );
        return response;
    } catch (err) {
        console.log('validateToken ERROR', err);
        console.log('validateToken: try to refresh Token');

        const newToken = await getNewAccessToken();
        if (newToken == null) {
            return { status: false, data: null };
        }
        try {
            return await axios.post(
                `${hostDomain}/api/user/verify/`,
                { client: 'web' },
                {
                    withCredentials: true,
                    timeout: 5000
                }
            );
        } catch (err) {
            console.log('validateToken retry ERROR', err);
            return { status: false, data: null };
        }
    }
};

// Function to log the user out by clearing tokens
const logout = async () => {
    try {
        await axios.post(`${hostDomain}/api/user/logout/`, { client: 'web' }, { withCredentials: true });
    } catch (error) {
        alert('Logout failed');
    }
};

export {
    loginLocal,
    logout,
    getNewAccessToken,
    validateToken,
};
