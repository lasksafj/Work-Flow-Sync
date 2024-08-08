import { Credentials, User } from "@/models/User";
import axios, { AxiosInstance } from "axios";

import { hostDomain } from '@/.config/config'


const register = async (user: User, password: any) => {
    try {
        let response = await axios.post(
            hostDomain + '/api/user/register/',
            {
                email: user.email,
                password: password,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                dateOfBirth: user.dateOfBirth
            }
        );
        return response;
    }
    catch (err: any) {
        console.log("Register failed", err);
        return { status: false };
    }
}

export {
    register
}