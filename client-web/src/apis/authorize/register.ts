// register.js

import axios from "axios";
import { hostDomain } from '../../.config/config';

// Function to handle user registration
const registerUser = async (user: any, password: string) => {
    try {
        const response = await axios.post(
            `${hostDomain}/api/user/register/`,
            {
                email: user.email,
                password,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                dateOfBirth: user.dateOfBirth
            },
            {
                withCredentials: true,
                timeout: 5000,
            }
        );
        return response;
    } catch (err) {
        console.log("Register failed", err);
        return { status: false };
    }
};

export {
    registerUser
};
