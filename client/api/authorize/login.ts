import { Credentials, User } from "@/models/User";
import axios, { AxiosInstance } from "axios";

import { hostDomain } from '@/config/config'

const loginLocal = async (username: string, password: string) => {
    try {
        let response = await axios.post<Credentials>(
            hostDomain + 'api/auth/login',
            JSON.stringify({ username, password }),
            {
                headers: {
                    "Content-Type": "application/json",
                },
                timeout: 5000
            }
        );
        return response.data;
    }
    catch (err: any) {
        throw new Error("Login failed", err);
    }
}