import { User } from "@/models/User";
import { createSlice } from "@reduxjs/toolkit";

const initUser = {
    lastName: '',
    firstName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    avatar: ''
}

const initialState = {
    profile: initUser,
    accessToken: '',
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userLogin: (state, action) => {
            state.profile = {
                email: action.payload.profile.email,
                lastName: action.payload.profile.lastName,
                firstName: action.payload.profile.firstName,
                phoneNumber: action.payload.profile.phoneNumber,
                dateOfBirth: action.payload.profile.dateOfBirth,
                avatar: action.payload.profile.avatar
            };
            state.accessToken = action.payload.access;
        },
        userLogout: (state) => {
            state.profile = initUser;
            state.accessToken = '';
        },
    },
});


export const { userLogin, userLogout } = userSlice.actions

export default userSlice.reducer