import { Credentials, User } from "@/models/User";
import axios, { AxiosInstance } from "axios";

import { hostDomain } from '@/config/config'


const register = async (user: User, password: any) => {
    try {
        let response = await axios.post(
            hostDomain + '/api/register/',
            {
                username: user.email,
                password: password,
                profile: {
                    email: user.email,
                    first_name: user.firstName,
                    last_name: user.lastName,
                    phone_number: user.phoneNumber,
                    date_of_birth: user.dateOfBirth
                }
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