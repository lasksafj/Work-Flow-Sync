import { User } from "@/models/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

const initUser: User = {
    username: undefined,
    last_name: undefined,
    first_name: undefined,
    email: undefined,
    phone_number: undefined,
    date_of_birth: undefined
}

const initialState = {
    user: initUser,
    accessToken: '',
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state) => {

        },
        logout: (state) => {
            state.user = initUser;
            state.accessToken = '';
            AsyncStorage.removeItem('accessToken'); // Remove token from storage
        },
    },
});